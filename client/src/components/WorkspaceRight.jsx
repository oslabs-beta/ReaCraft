import React, { useRef, useState } from 'react';
import Tree from 'react-d3-tree';
import { useSelector } from 'react-redux';
import { convertToTree } from '../utils/treeNode';
import { Button, Backdrop, Fab} from '@mui/material';
import '../utils/treeNode.css'

export default function WorkspaceRight() {
  const components = useSelector((state) => state.design.components);
  const tree = convertToTree(components);
  const [viewTree, setViewTree] = useState(false);
  return (
    <div>
      <Button
        variant='contained'
        onClick={() => setViewTree(true)}
        // startIcon={
        //   <svg
        //     xmlns='http://www.w3.org/2000/svg'
        //     width='16'
        //     height='16'
        //     fill='currentColor'
        //     className='bi bi-diagram-3-fill'
        //     viewBox='0 0 16 16'
        //   >
        //     <path
        //       fillRule='evenodd'
        //       d='M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H14a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 2 7h5.5V6A1.5 1.5 0 0 1 6 4.5zm-6 8A1.5 1.5 0 0 1 1.5 10h1A1.5 1.5 0 0 1 4 11.5v1A1.5 1.5 0 0 1 2.5 14h-1A1.5 1.5 0 0 1 0 12.5zm6 0A1.5 1.5 0 0 1 7.5 10h1a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5zm6 0a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5z'
        //     />
        //   </svg>
        // }
      >
        Dom Tree
      </Button>

      <DOMTreeBackdrop
        viewTree={viewTree}
        tree={tree}
        toggleViewTree={() => setViewTree(!viewTree)}
      />
    </div>
  );
}

//tree naming properties
// const orgChart = {
//   name: 'Animals',
//   children: [
//     {
//       name: 'Bunny',
//       attributes: {
//         department: 'Kick Butt',
//       },
//       children: [
//         {
//           name: 'lil Bunnies',
//           attributes: {
//             department: 'administration',
//           },
//           children: [
//             {
//               name: 'baby bunny',
//             },
//           ],
//         },
//         {
//           name: 'Foreman Bunny',
//           attributes: {
//             department: 'Stands Around',
//           },
//           children: [
//             {
//               name: 'Stands and pretends',
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };



const renderRectSvgNode = ({ nodeDatum, toggleNode }) => {
  const textLength = Number(nodeDatum.name.length)
  const estimatedCharWidth = (nodeDatum.name.length === 1) ? 60 : (nodeDatum.name.length <= 5) ? 30 : 20;
  const textWidth = textLength * estimatedCharWidth;
  const padding = 20;
  const paddedWidth = textWidth * 2;

  return (
  <g
    transform={`translate(${-textWidth / 2}, 0)`}
  >
    <foreignObject
      x={0}
      y={-45}
      width={textWidth}
      height={50}
    >
    <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        y: '-50px',
        padding: `${padding}px`
      }}>
      <Fab
        variant="extended" 
        onClick={toggleNode}
        style={{ 
          width: `${paddedWidth}px`, 
          height: `40px`, 
          borderWidth: `3px` 
        }}
        >
        <p
          fontSize="small"
          fill="black" 
          strokeWidth="1" 
          x="0"
          y="0"
        >
          {nodeDatum.name}
        </p>
      </Fab>
    </div>
  </foreignObject>
    {nodeDatum.attributes?.department && (
      <text fill="black" x="-15" dy="-15" strokeWidth="1">
        Department: {nodeDatum.attributes?.department}
      </text>
    )}
  </g>
  )
    };

function DOMTreeBackdrop({ viewTree, tree, toggleViewTree }) {
  const windowSize = useRef([window.innerWidth, window.innerHeight]);
  const [width, height] = windowSize.current;
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#ffffff4D',
      }}
      open={viewTree}
      onDoubleClickCapture={toggleViewTree}
    >
      <Tree
        data={tree}
        rootNodeClassName="node__root"
        branchNodeClassName="node__branch"
        leafNodeClassName="node__leaf"
        orientation='vertical'
        draggable='true'
        collapsible='true'
        renderCustomNodeElement={renderRectSvgNode}
        translate={{ x: width / 2, y: height / 3 }}
      />
    </Backdrop>
  );
}
