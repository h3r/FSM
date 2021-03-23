/*
Author: Hermann Plass (hermann.plass@gmail.com)
edgetypes.js (c) 2021
Desc: description
Created:  2021-03-19T09:12:31.164Z
Modified: 2021-03-20T18:50:47.218Z
*/

import React from 'react';
import { getBezierPath, getMarkerEnd, SmoothStepEdge } from 'react-flow-renderer';

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  arrowHeadType,
  markerEndId,
}) {
  const edgePath = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

  return (
    <>
      <path id={id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
      <text>
        <textPath href={`#${id}`} style={{ fontSize: '12px' }} startOffset="50%" textAnchor="middle">
          {data?data.label:`bla`} {/*this.props.data.label*/}
        </textPath>
      </text>
    </>
  );
}

export default {
  default: CustomEdge
}