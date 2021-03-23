/*
Author: Hermann Plass (hermann.plass@gmail.com)
nodes.js (c) 2021
Desc: description
Created:  2021-03-18T20:38:03.260Z
Modified: 2021-03-20T12:01:13.636Z
*/

import fs from 'browserify-fs';

import path from 'path';
import React from 'react';
import {ButtonToolbar,ButtonGroup , Button, Card} from 'react-bootstrap';
import { PlusSquareDotted, ArrowCounterclockwise,Save, Download,EraserFill } from 'react-bootstrap-icons';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";
function onChange(newValue) {
  console.log("change", newValue);
}

function onLoad(a) {
  console.log("load", a);
}


var LEvent = window.LEvent;

function CtxData(){
  return (<div style={{width:'100%'}}>
    <h3>Ctx</h3>
    <Card>
    <Card.Body>
      <PlusSquareDotted style={{color:"gray"}}/>
    </Card.Body>
    </Card>
  </div>);
}

export default () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside id="inspector" style={{padding:'0 1rem 0 .25rem', margin: '2rem 0', width:'100%', height:'calc(100% - 4rem)', borderRight: '1px solid rgba(0,0,0,0.15)' }}>
      <ButtonGroup className="mb-4">
        <Button variant="outline-secondary" size="sm" onClick={()=>LEvent.trigger(window,'clear')}><EraserFill/></Button>
        <Button variant="outline-secondary" size="sm" onClick={()=>LEvent.trigger(window,'save')}><Save/></Button>
        <Button variant="outline-secondary" size="sm" onClick={()=>LEvent.trigger(window,'reload')}><ArrowCounterclockwise/></Button>
        <Button variant="outline-secondary" size="sm" onClick={()=>LEvent.trigger(window,'download')}><Download/></Button>
      </ButtonGroup >
      
      <h3>Nodes</h3>
      <div className = "inputnode"  onDragStart = {(event) => onDragStart(event, 'input')}      draggable> Input Node   </div>
      <div className = "customnode" onDragStart = {(event) => onDragStart(event, 'customnode')} draggable> Default Node </div>
      <div className = "randomnode" onDragStart = {(event) => onDragStart(event, 'randomnode')} draggable> Random Node </div>
      <div className = "outputnode" onDragStart = {(event) => onDragStart(event, 'output')}     draggable> Output Node  </div>
      <CtxData/>
      {/*<AceEditor
        placeholder="Placeholder Text"
        mode="json"
        theme="monokai"
        onLoad={onLoad}
        onChange={onChange}
        fontSize={12}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={`{}`}
        setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 1,
        }}/>*/}
    </aside>
  );
};