/*
Author: Hermann Plass (hermann.plass@gmail.com)
nodetypes.js (c) 2021
Desc: description
Created:  2021-03-19T01:23:50.809Z
Modified: 2021-03-19T10:38:48.264Z
*/
import React from 'react';
import { addEdge, Handle } from 'react-flow-renderer';
import { Overlay } from 'react-bootstrap'; //TODO: change node properties
var LEvent = window.LEvent;

class CustomNode extends React.Component {


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
            <div style={style}>
                <Handle type="target" position="left" id="a" />
                <input style={{width:"100%"}} className="text-center" type="text" onChange={this.onChange.bind(this)} defaultValue={`Node`} value={ !this.props.data.label || !this.props.data.label.length? "Node" : this.props.data.label } />
                <Handle type="source" position="right" id="b" />
            </div>
        );
    }
}

class RandomNode extends React.Component {

}

export default {
    customnode: CustomNode
}