import React, { useState, Fragment, useEffect } from 'react';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import { PiFileJsx } from 'react-icons/pi';
import { CodeBlock, monokai } from 'react-code-blocks';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import '../../styles/ViewCode.scss';
import BackdropSnackbar from './BackdropSnackbar';

export default function ViewCodeButton({ code, name }) {
  const [viewCode, setViewCode] = useState(false);

  return (
    <Fragment>
      <Tooltip title='View jsx code for components'>
        <Button variant='contained' onClick={() => setViewCode(true)}>
          <PiFileJsx />
          {/* {name ? name : 'View All'} */}
        </Button>
      </Tooltip>
      <CopyCodeBackdrop
        viewCode={viewCode}
        setViewCode={setViewCode}
        code={code}
        name={name}
      />
      <BackdropSnackbar open={viewCode} setOpen={setViewCode} />
    </Fragment>
  );
}

function CopyCodeBackdrop({ viewCode, setViewCode, code, name }) {
  const [value, setValue] = useState('RootContainer');

  useEffect(() => {
    if (name) setValue(name);
  }, [name]);

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#ffffff4D',
      }}
      open={viewCode}
      onDoubleClick={() => setViewCode(false)}>
      <Box
        sx={{
          backgroundColor: '#5D5F58',
          borderRadius: '10px',
        }}>
        <TabContext value={value}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
            }}>
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
    </Backdrop>
  );
}
