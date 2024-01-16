import React, { Fragment, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import ParentSelector from './ParentSelector';
import { Divider, Typography, IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { setMessage } from '../../utils/reducers/appSlice';
import isValidVariableName from '../../utils/isValidVariableName';
import Button from '@mui/material/Button';
import {
  removeComponent,
  updateComponent,
} from '../../utils/reducers/designSlice';
import HtmlTagSelector from './HtmlTagSelector';

const boxStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
export default function ComponentEditor({ idx, open, closeEditor }) {
  const dispatch = useDispatch();

  const component = useSelector((state) => state.design.components)[idx];
  const childrenNum = useSelector((state) => state.design.components).filter(
    (item) => item.parent === idx
  ).length;

  const [props, setProps] = useState(component.props);
  const [styles, setStyles] = useState(component.styles);

  const isLeaf = childrenNum === 0 && idx > 0;

  const deleteMessage = isLeaf
    ? {
        severity: 'success',
        text: 'Successfully removed a component ' + component.name,
      }
    : {
        severity: 'error',
        text: `Component ${component.name} has children. Failed to remove`,
      };

  return (
    <Modal open={open} onClose={closeEditor}>
      <Box
        component='form'
        sx={boxStyle}
        display='grid'
        gridTemplateColumns='repeat(12, 1fr)'
        gap={2}
        onSubmit={(e) => {
          e.preventDefault();
          const updatedComponent = {
            name: e.target.name.value,
            inner_html: '',
            styles,
            props,
          };
          if (isValidVariableName(updatedComponent.name)) {
            dispatch(updateComponent({ idx, updatedComponent }));
            closeEditor();
          } else {
            dispatch(
              setMessage({
                severity: 'error',
                text: 'React component name must start with an uppercase letter.',
              })
            );
          }
        }}>
        <NameAndParent idx={idx} name={component.name} />

        {isLeaf && <HtmlData idx={idx} isLeaf={isLeaf} />}

        <Box gridColumn='span 12'>
          <Divider />
        </Box>

        <AddData data={props} setData={setProps} dataName={'Props'} />

        <AddData
          data={styles}
          setData={setStyles}
          dataName={'Styles'}
          isRoot={idx === 0}
        />

        <Box gridColumn='span 6'>
          {idx > 0 && (
            <Button
              variant='outlined'
              color='error'
              onClick={() => {
                if (childrenNum === 0) {
                  dispatch(removeComponent(idx));
                  closeEditor();
                }
                dispatch(setMessage(deleteMessage));
              }}>
              Delete
            </Button>
          )}
        </Box>

        <Box gridColumn='span 6'>
          <Button variant='contained' color='success' type='submit'>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

function NameAndParent({ idx, name }) {
  return (
    <Fragment>
      <Box gridColumn='span 6'>
        <TextField
          size='small'
          required
          label='name'
          name='name'
          defaultValue={name}
          disabled={idx === 0}
        />
      </Box>
      <Box gridColumn='span 6'>
        <ParentSelector size='small' childIdx={idx} />
      </Box>
    </Fragment>
  );
}

function HtmlData({ idx, isLeaf }) {
  return (
    <Fragment>
      <Box gridColumn='span 2'>
        <HtmlTagSelector idx={idx} isLeaf={isLeaf} />
      </Box>
      <Box gridColumn='span 10'>
        <TextField
          label='inner_html'
          name='inner html'
          sx={{ width: '100%' }}
        />
      </Box>
    </Fragment>
  );
}

function AddData({ data, setData, dataName, isRoot }) {
  const keys = data.map((item) => item.key);
  const dispatch = useDispatch();

  return (
    <Fragment>
      <Typography variant='h5'>{dataName}</Typography>
      <Box gridColumn='span 12' display='flex'>
        <Typography variant='h6' sx={{ mr: 2 }}>
          Add {dataName}
        </Typography>
        <IconButton
          onClick={() =>
            setData([
              ...data,
              {
                key:
                  dataName.toLowerCase().slice(0, dataName.length - 1) +
                  (data.length + 1),
                value: '',
              },
            ])
          }>
          <AddCircleIcon color='primary' />
        </IconButton>
      </Box>
      {data.map((item, idx) => (
        <Fragment key={idx}>
          <Box gridColumn='span 5'>
            <TextField
              required
              label='key'
              id={`key${idx}`}
              name={`${dataName.toLowerCase()}-${item.key}-key`}
              value={item.key}
              onChange={(e) => {
                if (
                  e.target.value.length > 0 &&
                  keys.includes(e.target.value)
                ) {
                  dispatch(
                    setMessage({
                      severity: 'error',
                      text: `Invalid prop key: ${e.target.value} has already been declared.`,
                    })
                  );
                } else if (
                  !isValidVariableName(e.target.value) &&
                  e.target.value.length > 0
                ) {
                  dispatch(
                    setMessage({
                      severity: 'error',
                      text: `Invalid prop key: ${e.target.value} is not a valid Javascript variable name.`,
                    })
                  );
                } else {
                  if (e.target.value.length === 0) {
                    dispatch(
                      setMessage({
                        severity: 'error',
                        text: `Props key cannot be empty.`,
                      })
                    );
                  }
                  setData(
                    data.map((el, i) =>
                      i === idx ? { ...el, key: e.target.value } : el
                    )
                  );
                }
              }}
            />
          </Box>
          <Box gridColumn='span 5'>
            <TextField
              label='value'
              id={`value${idx}`}
              name={`${dataName.toLowerCase()}-${item.key}-value`}
              value={item.value}
              onChange={(e) =>
                setData(
                  data.map((el, i) =>
                    i === idx ? { ...el, value: e.target.value } : el
                  )
                )
              }
            />
          </Box>
          <Box gridColumn='span 2'>
            <IconButton
              onClick={() => {
                if (isRoot && item.key === 'height') {
                  dispatch(
                    setMessage({
                      severity: 'error',
                      text: "Cannot remove 'height' of root component.",
                    })
                  );
                } else if (isRoot && item.key === 'width') {
                  dispatch(
                    setMessage({
                      severity: 'error',
                      text: "Cannot remove 'width' of root component.",
                    })
                  );
                } else {
                  setData(data.filter((_, i) => i !== idx));
                }
              }}>
              <RemoveCircleIcon />
            </IconButton>
          </Box>
        </Fragment>
      ))}
      <Box gridColumn='span 12'>
        <Divider />
      </Box>
    </Fragment>
  );
}
