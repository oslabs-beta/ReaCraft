import React, { useState, Fragment, useEffect, useRef } from 'react';
import Fab from '@mui/material/Fab';
import Popper from '@mui/material/Popper';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import { CodeBlock, monokai } from 'react-code-blocks';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import '../../../styles/ViewCode.scss';
import Grow from '@mui/material/Grow';
import useOutsideClick from '../../../hooks/useOutsideClick';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';

export default function ButtonViewCode({
  css,
  jsx,
  name,
  pageName,
  isVertical,
}) {
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
      <Tooltip title='View JSX Code for Components'>
        <Fab size='small' variant='contained' onClick={openPopper}>
          <FontAwesomeIcon icon={faCode} />
        </Fab>
      </Tooltip>
      {anchorEl && (
        <CopyCodePopper
          anchorEl={anchorEl}
          jsx={jsx}
          css={css}
          name={name}
          onClose={closePopper}
          isTransitioning={isTransitioning}
          pageName={pageName}
          isVertical={isVertical}
        />
      )}
    </Fragment>
  );
}

function GrowTransition({
  jsx,
  css,
  name,
  isTransitioning,
  pageName,
  isVertical,
}) {
  const [value, setValue] = useState(pageName);
  useEffect(() => {
    if (name) setValue(name);
  }, [name]);

  const tabStyles = {
    backgroundColor: '#ffffff', // Use a white background for the tabs
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Apply a subtle shadow
    borderRadius: '8px', // Rounded corners for the tabs
    color: '#000', // Text color for the tabs
    padding: '10px', // Add padding inside the tabs container
  };

  const tabListStyles = {
    borderBottom: '1px solid #e0e0e0', // Light grey border at the bottom of the tab list
  };

  const tabPanelStyles = {
    backgroundColor: '#f7f7f7', // A light grey background for the content area
    padding: '10px', // Padding inside the tab panels
    minHeight: '100px', // Minimum height for the content area
    // Additional styles for the code blocks and container
    '& .code-block': {
      backgroundColor: '#272822', // Background for the code block (monokai theme color)
      borderRadius: '4px', // Optional: Rounded corners for the code block
      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)', // Optional: Inner shadow for depth
      fontSize: '0.85rem', // Smaller font size for the code
      overflowX: 'auto', // Allow horizontal scrolling if code overflows
    },
    '& .react-code-blocks__pre': {
      margin: '0', // Remove default margins
    },
  };

  return (
    <Grow
      in={!isTransitioning}
      style={{ transformOrigin: 'center right' }}
      timeout={255}
    >
      <Box sx={{
        ...tabStyles,
        marginTop: isVertical ? '80px' : 0,
      }}
        // sx={{
        //   backgroundColor: '#5D5F58',
        //   borderRadius: '10px',
        //   marginTop: isVertical ? '80px' : 0,
        // }}
      >
        <TabContext value={value}>
          <Box sx={tabListStyles}
            // sx={{
            //   borderBottom: 1,
            //   borderColor: 'divider',
            // }}
          >
            <TabList onChange={(e, newVal) => setValue(newVal)} variant="scrollable" scrollButtons="auto">
              {Object.keys(jsx).map((key) => (
                <Tab
                  label={key + '.jsx'}
                  value={key}
                  key={key}
                  className='code-block-tab'
                />
              ))}
              <Tab
                label={`${pageName}.css`}
                value='css'
                className='code-block-tab'
              />
            </TabList>
          </Box>
          {Object.keys(jsx).map((key) => (
            // <TabPanel value={key} key={key} className='code-panel'> 
            <TabPanel value={key} key={key} sx={tabPanelStyles}> 
              <CodeBlock
                text={jsx[key]}
                language='jsx'
                showLineNumbers={true}
                theme={monokai}
                customStyle={{ backgroundColor: '#E0E1DD', color: 'black' }}
              />
            </TabPanel>
          ))}
          {/* <TabPanel value='css' className='code-panel'> */}
          <TabPanel value='css' sx={tabPanelStyles}>
            <CodeBlock
              text={css}
              language='css'
              showLineNumbers={true}
              theme={monokai}
              customStyle={{ backgroundColor: '#E0E1DD', color: 'black' }}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </Grow>
  );
}

function CopyCodePopper({
  anchorEl,
  jsx,
  css,
  name,
  onClose,
  isTransitioning,
  pageName,
  isVertical,
}) {
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
      placement={isVertical ? 'left' : 'bottom'}
      anchorEl={anchorEl}
    >
      <GrowTransition
        jsx={jsx}
        css={css}
        name={name}
        isTransitioning={isTransitioning}
        pageName={pageName}
        isVertical={isVertical}
      />
    </Popper>
  );
}
