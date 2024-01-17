import React, { useRef, useState, Fragment } from 'react';
import Tree from 'react-d3-tree';
//import { convertToTree } from '../../utils/treeNode';
import { Button, Backdrop, Fab, List, FormLabel } from '@mui/material';
import { ImTree } from 'react-icons/im';
import { themeDOMTreeLight } from '../../Styles/ThemeDOMTree';
import { ThemeProvider } from '@mui/material/styles';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import '../../utils/treeNode.css';

export default function ViewDomTreeButton({ tree }) {
  const [viewTree, setViewTree] = useState(false);
  return (
    <Fragment>
      <Button
        variant='contained'
        onClick={() => setViewTree(true)}
        startIcon={<ImTree />}>
        Dom Tree
      </Button>

      <DOMTreeBackdrop
        viewTree={viewTree}
        tree={tree}
        toggleViewTree={() => setViewTree(!viewTree)}
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

  console.log('=> This is nodeDatum: ', nodeDatum);
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
            }}>
            <Fab
              variant='extended'
              onClick={toggleNode}
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: `${paddedWidth}px`,
                alignItems: 'center',
              }}>
              <FormLabel
                sx={{
                  fontSize: '8px',
                }}>
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
      onDoubleClickCapture={toggleViewTree}>
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
