/*
Author: Hermann Plass (hermann.plass@gmail.com)
nodes.js (c) 2021
Desc: description
Created:  2021-03-18T20:38:03.260Z
Modified: 2021-03-18T22:27:09.099Z
*/
import { exec } from "child_process";
import path from 'path';
import React from 'react';

export default () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className = "dndnode input" onDragStart  = {(event) => onDragStart(event, 'input')}   draggable> Input Node   </div>
      <div className = "dndnode" onDragStart        = {(event) => onDragStart(event, 'default')} draggable> Default Node </div>
      <div className = "dndnode output" onDragStart = {(event) => onDragStart(event, 'output')}  draggable> Output Node  </div>
    </aside>
  );
};