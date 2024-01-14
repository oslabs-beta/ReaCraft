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
import HtmlTagSelector from './HtmlTagSelector';
import {
  convertArrToObj,
  convertObjToArr,
} from '../../utils/convertBetweenObjArr';
import {
  deleteComponent,
  submitComponentForm,
} from '../../utils/reducers/designSliceV2';

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
export default function ComponentEditorForm({
  idx,
  open,
  closeEditor,
  isLeaf,
}) {
  const components = useSelector((state) => state.designV2.components);
  const component = components[idx];

  const [props, setProps] = useState(
    convertObjToArr(JSON.parse(component.props))
  );
  const [styles, setStyles] = useState(
    convertObjToArr(JSON.parse(component.styles))
  );

  const dispatch = useDispatch();

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
          const body = {
            name: e.target.name.value,
            innerHtml: e.target.innerHtml.value,
            styles: convertArrToObj(styles),
            props: convertArrToObj(props),
          };
          if (isValidVariableName(body.name)) {
            try {
              dispatch(
                submitComponentForm({ componentId: component._id, body })
              );
            } catch (err) {
              setMessage({
                severity: 'error',
                text: 'Saving component: ' + err,
              });
            }
          } else {
            dispatch(
              setMessage({
                severity: 'error',
                text: 'React component name must start with an uppercase letter.',
              })
            );
          }
        }}
      >
        <NameAndParent idx={idx} name={component.name} />

        {isLeaf && (
          <HtmlData
            idx={idx}
            isLeaf={isLeaf}
            innerHtml={component.inner_html}
          />
        )}

        <Box gridColumn='span 12'>
          <Divider />
        </Box>

        <AddData data={props} setData={setProps} dataName={'Props'} />

        <AddData data={styles} setData={setStyles} dataName={'Styles'} />

        <Box gridColumn='span 4'>
          {idx > 0 && (
            <Button
              variant='outlined'
              color='error'
              onClick={() => {
                if (isLeaf) {
                  dispatch(deleteComponent(component._id));
                  closeEditor();
                }
                dispatch(setMessage(deleteMessage));
              }}
            >
              Delete
            </Button>
          )}
        </Box>

        <Box gridColumn='span 4'>
          <Button color='secondary' variant='contained' onClick={closeEditor}>
            Cancel
          </Button>
        </Box>

        <Box gridColumn='span 4'>
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
          required
          label='name'
          name='name'
          defaultValue={name}
          disabled={idx === 0}
        />
      </Box>
      <Box gridColumn='span 6'>
        <ParentSelector childIdx={idx} />
      </Box>
    </Fragment>
  );
}

function HtmlData({ idx, isLeaf, innerHtml }) {
  return (
    <Fragment>
      <Box gridColumn='span 2'>
        <HtmlTagSelector idx={idx} isLeaf={isLeaf} />
      </Box>
      <Box gridColumn='span 10'>
        <TextField
          label='inner_html'
          name='innerHtml'
          sx={{ width: '100%' }}
          value={innerHtml}
        />
      </Box>
    </Fragment>
  );
}

function AddData({ data, setData, dataName }) {
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
          }
        >
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
                const duplicateErr = {
                  severity: 'error',
                  text: `Invalid prop key: ${e.target.value} has already been declared.`,
                };
                const invalidErr = {
                  severity: 'error',
                  text: `Invalid prop key: ${e.target.value} is not a valid Javascript variable name.`,
                };
                const emptyErr = {
                  severity: 'error',
                  text: `Props key cannot be empty.`,
                };
                let message;
                if (e.target.value.length > 0 && keys.includes(e.target.value))
                  message = duplicateErr;
                else if (
                  !isValidVariableName(e.target.value) &&
                  e.target.value.length > 0
                )
                  message = invalidErr;
                else if (e.target.value.length === 0) message = emptyErr;
                else {
                  setData(
                    data.map((el, i) =>
                      i === idx ? { ...el, key: e.target.value } : el
                    )
                  );
                }

                dispatch(setMessage(message));
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
                setData(data.filter((_, i) => i !== idx));
              }}
            >
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
