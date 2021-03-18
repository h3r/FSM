/*
Author: Hermann Plass (hermann.plass@gmail.com)
editor.js (c) 2021
Desc: description
Created:  2021-03-18T18:53:56.258Z
Modified: 2021-03-18T22:57:15.077Z
*/

import fs from 'browserify-fs';
import React from "react";
import ReactFlow, {
    ReactFlowProvider,
    removeElements,
    addEdge,
    MiniMap,
    Controls,
    Background,
} from 'react-flow-renderer';

import { Container, Row, Col } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import fsm from "../fsm/fsm.js";
import NodePanel from './nodepanel.js';

const initialElements = [
{
    id: '1',
    type: 'input',
    data: { label: 'default node' },
    position: { x: 250, y: 5 },
},
];




export default class Editor extends React.Component {

    state = {
        filename:"",
        instance: null,
        elements: initialElements,
    }

    constructor(props)
    {
        super(props);
        this.setState({filename : this.props.match.params.filename});

        this.reactFlowWrapper = React.createRef();
        this.HandleKeyPress = this.HandleKeyPress.bind(this);
    }

    componentDidMount()
    {
        document.body.addEventListener('keydown',this.HandleKeyPress );
    }

    componentWillUnmount()
    {
        document.body.removeEventListener('keydown', this.HandleKeyPress);
    }

    HandleKeyPress(event){
        //console.log(`Key: ${event.key} with keycode ${event.keyCode} has been pressed`);
        if(event.ctrlKey  && event.keyCode == 83){
            event.preventDefault();
            this.saveFile()
        }
    }

    saveFile()
    {
        let filename = this.props.match.params.filename ?? prompt('add a title', 'test');
        
        let data     = 'Hello World!',
            callback = ()=>{ alert('done') };
        fs.mkdir('/files', ()=> {
            fs.writeFile(`/files/${filename}.fsm`, data, 'utf-8', ()=>{
                fs.readFile(`/files/${filename}.fsm`, 'utf-8', function(err, data) {
                    alert(data);
                });
            })
        });

    }

    onConnect(params)
    { this.setState({elements: addEdge(params, this.state.elements)}); }

    onElementsRemove(elementsToRemove)
    { this.setState({elements: removeElements(elementsToRemove, this.state.elements)}); }

    onLoad(instance)
    { this.setState({instance: instance}); }
    
    
    onDragOver(event)
    {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
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

    handleTest(event)
    {
        debugger;
    }

    render()
    {
        return (
        <ReactFlowProvider>
        <Container fluid >
            <Row>

            <Col xs='auto'>
                <NodePanel/>
            </Col>

            <Col ref={this.reactFlowWrapper}>
                <ReactFlow style={{ height: '100vh' }}

                    elements         = {this.state.elements}
                    onConnect        = {this.onConnect.bind(this)}
                    onElementsRemove = {this.onElementsRemove.bind(this)}
                    onLoad           = {this.onLoad.bind(this)}
                    onDrop           = {this.onDrop.bind(this)}
                    onDragOver       = {this.onDragOver.bind(this)}
                    deleteKeyCode    = {46}
                >
                    <MiniMap />
                    <Controls />
                    <Background color="#aaa" gap={16}/>
                </ReactFlow>
            </Col>
            </Row>

            
        </Container>
        </ReactFlowProvider>

        );
    }
}