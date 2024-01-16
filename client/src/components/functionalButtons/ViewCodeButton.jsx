import React, { useState, Fragment } from 'react';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import { PiFileJsx } from 'react-icons/pi';
import { CodeBlock, monokai } from 'react-code-blocks';

export default function ViewCodeButton({ code, name }) {
  const [viewCode, setViewCode] = useState(false);
  return (
    <Fragment>
      <Button
        variant='contained'
        onClick={() => setViewCode(true)}
        startIcon={<PiFileJsx />}
      >
        {name}
      </Button>
      <CopyCodeBackdrop
        viewCode={viewCode}
        setViewCode={setViewCode}
        code={code}
      />
    </Fragment>
  );
}

function CopyCodeBackdrop({ viewCode, setViewCode, code }) {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#ffffff4D',
      }}
      open={viewCode}
      onClick={() => setViewCode(false)}
    >
      <CodeBlock
        text={code}
        language={'jsx'}
        showLineNumbers={true}
        theme={monokai}
      />
    </Backdrop>
  );
}
