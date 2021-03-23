/*
Author: Hermann Plass (hermann.plass@gmail.com)
nodetypes.js (c) 2021
Desc: description
Created:  2021-03-19T01:23:50.809Z
Modified: 2021-03-20T20:02:06.659Z
*/
import React from 'react';
import { addEdge, Handle } from 'react-flow-renderer';
import { Overlay } from 'react-bootstrap'; //TODO: change node properties
var LEvent = window.LEvent;

/*class CustomNode extends React.Component {


    handleConnect(params) {
        console.log('handle onConnect', params)
        debugger;
    }

    onChange(params) {
        this.props.data.label = params.target.value;
        LEvent.trigger(window, 'nodeUpdate', this.props);
    }

    render() {
        const style = {
            border: "1px solid #aaa",
            color: '#FFF',
            padding: 10,
            borderRadius: "3px",
            width: "130px"
        };

        return (
            <div style={style} className="hexagon">
                <Handle type="target" position="left" id="a" isValidConnection={() => true} />
                <input style={{ width: "100%" }} className="text-center" type="text" onChange={this.onChange.bind(this)} defaultValue={`Node`} value={!this.props.data.label || !this.props.data.label.length ? "Node" : this.props.data.label} />
                <Handle type="source" position="right" id="b" isValidConnection={() => true} />
            </div>
        );
    }
}

*/
class CustomNode extends React.Component {

    handleConnect(params) {
        console.log('handle onConnect', params)
        debugger;
    }

    onChange(params) {
        this.props.data.label = params.target.value;
        LEvent.trigger(window, 'nodeUpdate', this.props);
    }

    render()
    {
        return(
        <div id={this.props.id}>
            {/*<input className="text-center" type="text" onChange={this.onChange.bind(this)} value={!this.props.data.label || !this.props.data.label.length ? "Node" : this.props.data.label} />*/}

            <div className="center" >
                <Handle type="source" className="hexagon" isValidConnection={() => true} />
                <div className="hexagon label" >N</div>
            </div>

        </div>);
    }
}

class RandomNode extends React.Component {

    handleConnect(params) {
        console.log('handle onConnect', params)
        debugger;
    }

    onChange(params) {
        this.props.data.label = params.target.value;
        LEvent.trigger(window, 'nodeUpdate', this.props);
    }

    render()
    {
        return(
        <div id={this.props.id}>
            {/*<input className="text-center" type="text" onChange={this.onChange.bind(this)} value={!this.props.data.label || !this.props.data.label.length ? "Node" : this.props.data.label} />*/}

            <div className="center" >
                <Handle type="source" className="hexagon" isValidConnection={() => true} />
                <div className="hexagon label" >R</div>
            </div>

        </div>);
    }
}

export default {
    customnode: CustomNode,
    randomnode: RandomNode
}