import React, { useRef, useState, Fragment, useEffect } from 'react';
import Tree from 'react-d3-tree';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { Button, Backdrop, Fab, List, FormLabel, Box } from '@mui/material';
import { ImTree } from 'react-icons/im';
import { themeDOMTreeLight } from '../../../styles/ThemeDOMTree';
import { ThemeProvider } from '@mui/material/styles';
import SchemaRoundedIcon from '@mui/icons-material/SchemaRounded';

import BackdropSnackbar from '../../TopBar/BackdropSnackbar';

import '../../../utils/treeNode.css';

export default function ButtoViewTree({ tree }) {
  const [viewTree, setViewTree] = useState(false);

  const handleKeyPress = (e) => {
    if (e.altKey && e.keyCode === 84) setViewTree(!viewTree);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [viewTree]);
  return (
    <Fragment>
      <Tooltip title='View Dom tree'>
        <Fab onClick={() => setViewTree(true)} size='small'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            fontSize='inherit'
            // fill='989897'
            className='bi bi-diagram-3-fill'
            viewBox='0 0 16 16'
          >
            <path
              fillRule='evenodd'
              d='M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H14a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 2 7h5.5V6A1.5 1.5 0 0 1 6 4.5zm-6 8A1.5 1.5 0 0 1 1.5 10h1A1.5 1.5 0 0 1 4 11.5v1A1.5 1.5 0 0 1 2.5 14h-1A1.5 1.5 0 0 1 0 12.5zm6 0A1.5 1.5 0 0 1 7.5 10h1a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5zm6 0a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5z'
            />
          </svg>
        </Fab>
      </Tooltip>

      <BackdropSnackbar open={viewTree} setOpen={setViewTree} />

      <DOMTreeBackdrop
        viewTree={viewTree}
        tree={tree}
        setViewTree={setViewTree}
      />
    </Fragment>
  );
}

const renderRectSvgNode = ({ nodeDatum, toggleNode }) => {
  const textLength = Number(nodeDatum.name.length);
  const estimatedCharWidth =
    nodeDatum.name.length === 1 ? 60 : nodeDatum.name.length <= 5 ? 35 : 20;
  const textWidth = textLength * estimatedCharWidth;
  const padding = 20;
  const paddedWidth = textWidth * 2;

  // console.log('=> This is nodeDatum: ', nodeDatum);
  // const [htmlTag, setHtmlTag] = React.useState('');

  // const handleChange = (event) => {
  //   setHtmlTag(event.target.value);
  // };

  return (
    <ThemeProvider theme={themeDOMTreeLight}>
      <g transform={`translate(${-textWidth / 2}, 0)`}>
        <foreignObject x={0} y={-45} height={50} width={textWidth + 10}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              y: '-50px',
              padding: `${padding}px`,
            }}
          >
            <Fab
              variant='extended'
              onClick={toggleNode}
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: `${paddedWidth}px`,
                alignItems: 'center',
              }}
            >
              <FormLabel
                sx={{
                  fontSize: '8px',
                }}
              >
                {nodeDatum.attributes.tag}
              </FormLabel>
              <List>{nodeDatum.name}</List>
            </Fab>
          </div>
        </foreignObject>
        {nodeDatum.attributes?.department && (
          <text fill='black' x='-15' dy='-15' strokeWidth='1'>
            Department: {nodeDatum.attributes?.department}
          </text>
        )}
      </g>
    </ThemeProvider>
  );
};

function DOMTreeBackdrop({ viewTree, tree, setViewTree }) {
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
      onDoubleClickCapture={() => setViewTree(false)}
    >
      <Tree
        data={tree}
        rootNodeClassName='node__root'
        branchNodeClassName='node__branch'
        leafNodeClassName='node__leaf'
        orientation='vertical'
        draggable='true'
        collapsible='true'
        renderCustomNodeElement={renderRectSvgNode}
        translate={{ x: width / 2, y: height / 3 }}
      />
    </Backdrop>
  );
}
