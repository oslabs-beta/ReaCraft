import React, { useState, Fragment, useEffect, useRef } from 'react';
import Fab from '@mui/material/Fab';
import Popper from '@mui/material/Popper';
import { PiFileJsx } from 'react-icons/pi';
import { CodeBlock, monokai } from 'react-code-blocks';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import '../../styles/ViewCode.scss';
import Grow from '@mui/material/Grow';
import useOutsideClick from '../../hooks/useOutsideClick';

export default function ViewCodeButton({ code, name }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const openPopper = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const closePopper = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setAnchorEl(null);
      setIsTransitioning(false);
    }, 225); // Ensure this matches the Grow component's timeout
  };

  return (
    <Fragment>
      <Tooltip title='View jsx code for components'>
        <Fab size='small' variant='contained' onClick={openPopper}>
          <PiFileJsx />
        </Fab>
      </Tooltip>
      {anchorEl && (
        <CopyCodePopper
          anchorEl={anchorEl}
          code={code}
          name={name}
          onClose={closePopper}
          isTransitioning={isTransitioning}
        />
      )}
    </Fragment>
  );
}

function GrowTransition({ code, name, isTransitioning }) {
  const [value, setValue] = useState('RootContainer');
  console.log('value is ', value);
  useEffect(() => {
    if (name) setValue(name);
  }, [name]);
  return (
    <Grow
      in={!isTransitioning}
      style={{ transformOrigin: 'center right' }}
      timeout={255}
    >
      <Box
        sx={{
          backgroundColor: '#5D5F58',
          borderRadius: '10px',
          marginTop: '60px',
        }}
      >
        <TabContext value={value}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <TabList onChange={(e, newVal) => setValue(newVal)}>
              {Object.keys(code).map((key) => (
                <Tab
                  label={key}
                  value={key}
                  key={key}
                  className='code-block-tab'
                />
              ))}
            </TabList>
          </Box>
          {Object.keys(code).map((key) => (
            <TabPanel value={key} key={key} className='code-panel'>
              <CodeBlock
                text={code[key]}
                language='jsx'
                showLineNumbers={true}
                theme={monokai}
              />
            </TabPanel>
          ))}
        </TabContext>
      </Box>
    </Grow>
  );
}

function CopyCodePopper({ anchorEl, code, name, onClose, isTransitioning }) {
  const popperRef = useRef(null);

  // Close Popper when clicked outside
  useOutsideClick(popperRef, () => {
    if (anchorEl && onClose) onClose();
  });
  return (
    <Popper
      ref={popperRef}
      sx={{
        color: '#fff',
        backgroundColor: '#ffffff4D',
      }}
      open={Boolean(anchorEl)}
      placement='left'
      anchorEl={anchorEl}
    >
      <GrowTransition
        code={code}
        name={name}
        isTransitioning={isTransitioning}
      />
    </Popper>
  );
}
