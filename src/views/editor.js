/*
Author: Hermann Plass (hermann.plass@gmail.com)
editor.js (c) 2021
Desc: description
Created:  2021-03-18T18:53:56.258Z
Modified: 2021-03-20T19:02:52.015Z
*/

import fs from 'browserify-fs';
import React from "react";
import ReactFlow, {
    ReactFlowProvider,
    removeElements,
    addEdge,
    updateEdge,
    MiniMap,
    Controls,
    Background,
} from 'react-flow-renderer';

import { Container, Row, Col } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import "../levent.js";
import fsm from "../fsm/fsm.js";
import Inspector from './inspector.js';
import nodeTypes from './nodetypes.js';
import edgeTypes from './edgetypes.js';

//Every time we create a 
const initialElements = [
    {
        id      : 'anytime',
        type    : 'input',
        data    : { label: 'Anytime', Background: "#73BDD5" },
        style   : {background:'#333333', color:'#DDD'},
        sourcePosition:"right",
        targetPosition:"left",
        position: { x: 0, y: -50 },
    },
    {
        id      : 'root',
        type    : 'input',
        data    : { label: 'Default', Background: "#FFC61B" },
        style   : {background:'#333333', color:'#DDD'},
        sourcePosition:"right",
        targetPosition:"left",
        position: { x: 0, y: 50 },
    },

];


var LEvent = window.LEvent;

export default class Editor extends React.Component {

    //we store all internal state here, that is mutable, using setState forces re-render this element
    state = {
        filename:"",
        darkmode: true,
        instance: null,
        elements: initialElements,
        history: [], //TODO: CTRL+Z check https://reactflow.dev/examples/save-and-restore/
    }

    //props are inmutable properties passed from those who constructed this element
    constructor(props)
    {
        super(props);
        
        this.setState({filename : this.props.match.params.filename});
        if(this.props.match.params.filename)
            this.loadFile();

        this.reactFlowWrapper = React.createRef();
        this.HandleKeyPress   = this.HandleKeyPress.bind(this);
        this.downloadFile     = this.downloadFile.bind(this);
        this.onConnect        = this.onConnect.bind(this);
        this.onElementsRemove = this.onElementsRemove.bind(this);
        this.onLoad           = this.onLoad.bind(this);
        this.onDrop           = this.onDrop.bind(this);
        this.onDragOver       = this.onDragOver.bind(this);
        this.onNodeUpdate     = this.onNodeUpdate.bind(this);
        this.onEdgeUpdate     = this.onEdgeUpdate.bind(this);
        this.onNodeDragStop   = this.onNodeDragStop.bind(this);
    }

    /*
        ██╗          ██████╗ ███████╗ █████╗  ██████╗████████╗     ██████╗ ██████╗ ███╗   ███╗██████╗  ██████╗ ███╗   ██╗███████╗███╗   ██╗████████╗    ███████╗██╗   ██╗███╗   ██╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗             ██╗
       ██╔╝▄ ██╗▄    ██╔══██╗██╔════╝██╔══██╗██╔════╝╚══██╔══╝    ██╔════╝██╔═══██╗████╗ ████║██╔══██╗██╔═══██╗████╗  ██║██╔════╝████╗  ██║╚══██╔══╝    ██╔════╝██║   ██║████╗  ██║██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝    ▄ ██╗▄  ██╔╝
      ██╔╝  ████╗    ██████╔╝█████╗  ███████║██║        ██║       ██║     ██║   ██║██╔████╔██║██████╔╝██║   ██║██╔██╗ ██║█████╗  ██╔██╗ ██║   ██║       █████╗  ██║   ██║██╔██╗ ██║██║        ██║   ██║██║   ██║██╔██╗ ██║███████╗     ████╗ ██╔╝
     ██╔╝  ▀╚██╔▀    ██╔══██╗██╔══╝  ██╔══██║██║        ██║       ██║     ██║   ██║██║╚██╔╝██║██╔═══╝ ██║   ██║██║╚██╗██║██╔══╝  ██║╚██╗██║   ██║       ██╔══╝  ██║   ██║██║╚██╗██║██║        ██║   ██║██║   ██║██║╚██╗██║╚════██║    ▀╚██╔▀██╔╝
    ██╔╝     ╚═╝     ██║  ██║███████╗██║  ██║╚██████╗   ██║       ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║     ╚██████╔╝██║ ╚████║███████╗██║ ╚████║   ██║       ██║     ╚██████╔╝██║ ╚████║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║███████║      ╚═╝██╔╝
    ╚═╝              ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝   ╚═╝        ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝      ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═══╝   ╚═╝       ╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝         ╚═╝
    */

    //Called when the element is displayed
    componentDidMount()
    {
        document.body.addEventListener('keydown',this.HandleKeyPress );
        LEvent.bind(window, "nodeUpdate", this.onNodeUpdate );
        LEvent.bind(window, "download", this.downloadFile );
        LEvent.bind(window, "clear", ()=>{ 
            if(window.confirm("Changes will be lost"))
            window.location.replace("/");
        });
        LEvent.bind(window, "reload", ()=>{ 
            if(window.confirm("Changes will be lost"))
            window.location.replace(window.location);
        });
    }

    //Called when the element is going to be removed because of an interface update/switching pages/etc
    componentWillUnmount()
    {
        LEvent.unbindAllEvent(this);
        document.body.removeEventListener('keydown', this.HandleKeyPress);
    }

    /*
        ██╗          ███╗   ███╗██╗   ██╗    ███████╗██╗   ██╗███╗   ██╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗             ██╗
       ██╔╝▄ ██╗▄    ████╗ ████║╚██╗ ██╔╝    ██╔════╝██║   ██║████╗  ██║██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝    ▄ ██╗▄  ██╔╝
      ██╔╝  ████╗    ██╔████╔██║ ╚████╔╝     █████╗  ██║   ██║██╔██╗ ██║██║        ██║   ██║██║   ██║██╔██╗ ██║███████╗     ████╗ ██╔╝
     ██╔╝  ▀╚██╔▀    ██║╚██╔╝██║  ╚██╔╝      ██╔══╝  ██║   ██║██║╚██╗██║██║        ██║   ██║██║   ██║██║╚██╗██║╚════██║    ▀╚██╔▀██╔╝
    ██╔╝     ╚═╝     ██║ ╚═╝ ██║   ██║       ██║     ╚██████╔╝██║ ╚████║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║███████║      ╚═╝██╔╝
    ╚═╝              ╚═╝     ╚═╝   ╚═╝       ╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝         ╚═╝
    */
    
    onLoad(instance)
    { 
        instance.fitView();
        this.setState({instance: instance}); 
    }

    HandleKeyPress(event)
    {
        switch(event.keyCode)
        {
            case 83: if(event.ctrlKey)
            {
                event.preventDefault();
                this.saveFile();
                break;
            }
        }
    }

    /*
        ██╗          ███████╗██╗██╗     ███████╗    ███╗   ███╗ █████╗ ███╗   ██╗ █████╗  ██████╗ ███████╗███╗   ███╗███████╗███╗   ██╗████████╗             ██╗
       ██╔╝▄ ██╗▄    ██╔════╝██║██║     ██╔════╝    ████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔════╝ ██╔════╝████╗ ████║██╔════╝████╗  ██║╚══██╔══╝    ▄ ██╗▄  ██╔╝
      ██╔╝  ████╗    █████╗  ██║██║     █████╗      ██╔████╔██║███████║██╔██╗ ██║███████║██║  ███╗█████╗  ██╔████╔██║█████╗  ██╔██╗ ██║   ██║        ████╗ ██╔╝
     ██╔╝  ▀╚██╔▀    ██╔══╝  ██║██║     ██╔══╝      ██║╚██╔╝██║██╔══██║██║╚██╗██║██╔══██║██║   ██║██╔══╝  ██║╚██╔╝██║██╔══╝  ██║╚██╗██║   ██║       ▀╚██╔▀██╔╝
    ██╔╝     ╚═╝     ██║     ██║███████╗███████╗    ██║ ╚═╝ ██║██║  ██║██║ ╚████║██║  ██║╚██████╔╝███████╗██║ ╚═╝ ██║███████╗██║ ╚████║   ██║         ╚═╝██╔╝
    ╚═╝              ╚═╝     ╚═╝╚══════╝╚══════╝    ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝            ╚═╝
    */

    saveFile()
    {
        let filename = this.props.match.params.filename ?? prompt('Save File: enter a title', 'test');
        let data     = JSON.stringify(this.state.elements);
        var that = this;
        fs.writeFile(`/files/${filename}.fsm`, data, 'utf-8', ()=>{
            console.log(`File writed: /files/${filename}.fsm`);
            if( !that.props.match.params.filename )
                window.location.replace(`/${filename}`);
        });
    }

    loadFile()
    {
        let filename = this.props.match.params.filename;
        if(!filename) return;
        var that = this;

        fs.readFile(`/files/${filename}.fsm`, 'utf-8', function(err, data) {
            if(!data) 
                return console.error(`File not found: /files/${filename}.fsm`);

            let elements     = JSON.parse(data);
            that.setState({elements});
            console.log(`File loaded: /files/${filename}.fsm`)
        });
    }

    dropFile()
    {}

    downloadFile()
    {
        console.log('reload!!');
        this.saveFile();

        let data = JSON.stringify(this.state.elements, null, 2);
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
        element.setAttribute('download', `${this.props.match.params.filename}.fsm`);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    /*
        ██╗          ███╗   ██╗ ██████╗ ██████╗ ███████╗    ███╗   ███╗ █████╗ ███╗   ██╗ █████╗  ██████╗ ███████╗███╗   ███╗███████╗███╗   ██╗████████╗             ██╗
       ██╔╝▄ ██╗▄    ████╗  ██║██╔═══██╗██╔══██╗██╔════╝    ████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔════╝ ██╔════╝████╗ ████║██╔════╝████╗  ██║╚══██╔══╝    ▄ ██╗▄  ██╔╝
      ██╔╝  ████╗    ██╔██╗ ██║██║   ██║██║  ██║█████╗      ██╔████╔██║███████║██╔██╗ ██║███████║██║  ███╗█████╗  ██╔████╔██║█████╗  ██╔██╗ ██║   ██║        ████╗ ██╔╝
     ██╔╝  ▀╚██╔▀    ██║╚██╗██║██║   ██║██║  ██║██╔══╝      ██║╚██╔╝██║██╔══██║██║╚██╗██║██╔══██║██║   ██║██╔══╝  ██║╚██╔╝██║██╔══╝  ██║╚██╗██║   ██║       ▀╚██╔▀██╔╝
    ██╔╝     ╚═╝     ██║ ╚████║╚██████╔╝██████╔╝███████╗    ██║ ╚═╝ ██║██║  ██║██║ ╚████║██║  ██║╚██████╔╝███████╗██║ ╚═╝ ██║███████╗██║ ╚████║   ██║         ╚═╝██╔╝
    ╚═╝              ╚═╝  ╚═══╝ ╚═════╝ ╚═════╝ ╚══════╝    ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝            ╚═╝
    */
   
    onDragOver(event)
    {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }

    onNodeDragStop(event, node)
    {
        let { elements } = this.state;
        let v = elements.find( v => v.id == node.id );
        v = node;
        this.setState({ elements });
    }
    
    onDrop(event)
    {
        event.preventDefault();

        let { instance, elements } = this.state;

        const reactFlowBounds = this.reactFlowWrapper.current.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/reactflow');
        const position = instance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });
        
        const newNode = {
          id: window.getId(),
          type,
          position,
          data: { label: `${type} node` },
        };
        
        this.setState({ elements: elements.concat(newNode) });
    }
    
    onConnect(params)
    { 
        this.setState({elements: addEdge(params, this.state.elements)}); 
        LEvent.trigger(window, "connected", params);
    }

    onEdgeUpdate(oldEdge, newConnection)
    {
        this.setState({elements: updateEdge(oldEdge, newConnection, this.state.elements) });
        LEvent.trigger(window, "edgeUpdate", oldEdge, newConnection);
    }

    onElementsRemove(elementsToRemove)
    { 
        elementsToRemove = elementsToRemove.filter( v => !(["root", "anytime"].includes(v.id)));
        this.setState({elements: removeElements(elementsToRemove, this.state.elements)}); 
        LEvent.trigger(window, "connected", elementsToRemove);
    }

    onNodeUpdate(eventname, node)
    {
        let { elements } = this.state;
        let v = elements.find( v => v.id == node.id );
        v = node;
        this.setState({ elements });
    }


    render()
    {
        return (
        <ReactFlowProvider>
        <Container fluid >
            <Row noGutters={true} >

            <Col xs='auto'>
                <Inspector/>
            </Col>

            <Col ref={this.reactFlowWrapper} style={{padding:0}}>
                <ReactFlow style={{ height: '100vh' }}
                    deleteKeyCode    = {46}
                    snapToGrid={true}
                    snapGrid={[20, 20]}
                    defaultZoom={2}

                    elements         = {this.state.elements}
                    onLoad           = {this.onLoad}
                    onDrop           = {this.onDrop}
                    onElementsRemove = {this.onElementsRemove}
                    onConnect        = {this.onConnect}
                    onDragOver       = {this.onDragOver}
                    onEdgeUpdate     = {this.onEdgeUpdate}
                    onNodeDragStop   = {this.onNodeDragStop}
                    connectionMode   = {'loose'}
                    nodeTypes        = {nodeTypes}
                    edgeTypes        = {edgeTypes}
                
                >
                    <MiniMap />
                    <Controls />
                    <Background variant="lines" color="#000" gap={16}/>
                </ReactFlow>
            </Col>
            </Row>

            
        </Container>
        </ReactFlowProvider>

        );
    }
}