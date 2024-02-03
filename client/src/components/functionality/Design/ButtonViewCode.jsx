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
          marginTop: isVertical ? '80px' : 0,
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
            <TabPanel value={key} key={key} className='code-panel'>
              <CodeBlock
                text={jsx[key]}
                language='jsx'
                showLineNumbers={true}
                theme={monokai}
              />
            </TabPanel>
          ))}
          <TabPanel value='css' className='code-panel'>
            <CodeBlock
              text={css}
              language='css'
              showLineNumbers={true}
              theme={monokai}
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
