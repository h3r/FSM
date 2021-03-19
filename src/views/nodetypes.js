/*
Author: Hermann Plass (hermann.plass@gmail.com)
nodetypes.js (c) 2021
Desc: description
Created:  2021-03-19T01:23:50.809Z
Modified: 2021-03-19T09:37:34.135Z
*/
import React from 'react';
import { addEdge, Handle } from 'react-flow-renderer';
import { Overlay } from 'react-bootstrap'; //TODO: change node properties
var LEvent = window.LEvent;

class CustomNode extends React.Component {

    
    handleConnect(params)
    {
        console.log('handle onConnect', params)
        debugger;
    }

    onChange(params)
    {
        this.props.data.label = params.target.value;
        LEvent.trigger(window, 'nodeUpdate', this);
    }

    render(){
        return(
            <>
            <Handle type="target" position="left" id="a"/>
            <input className="text-center" type="text" onChange={this.onChange.bind(this)} value = {this.props.data.label}/>
            <Handle type="source" position="right" id="b"/>
            </>
        );
    }
}

class RandomNode extends React.Component {

}

export default {
    customnode: CustomNode
}