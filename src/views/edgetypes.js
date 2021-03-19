/*
Author: Hermann Plass (hermann.plass@gmail.com)
edgetypes.js (c) 2021
Desc: description
Created:  2021-03-19T09:12:31.164Z
Modified: 2021-03-19T10:20:42.797Z
*/

import React from 'react';

function TimerEdge({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    connectionLineType,
    connectionLineStyle,
  }){
    return (
        <g>
          <path
            fill="none"
            stroke="red"
            label='true'
            strokeWidth={1.5}
            className="animated"
            d={`M${sourceX},${sourceY} C ${sourceX} ${targetY} ${sourceX} ${targetY} ${targetX},${targetY}`}
          />
          <circle cx={targetX} cy={targetY} fill="#fff" r={3} stroke="#222" strokeWidth={1.5} />
        </g>
      );
}


export default {
    timer: TimerEdge
}