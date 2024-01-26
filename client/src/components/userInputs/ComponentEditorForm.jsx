import React, { Fragment, useRef, useState } from 'react';
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
import { convertArrToObj } from '../../utils/convertBetweenObjArr';
import { submitComponentForm } from '../../utils/reducers/designSliceV2';
import Tooltip from '@mui/material/Tooltip';
import Autocomplete from '@mui/material/Autocomplete';
import Popper from '@mui/material/Popper';

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
  const dispatch = useDispatch();
  const component = useSelector((state) => state.designV3.pages[0].components)[
    idx
  ];

  const [props, setProps] = useState(component.props);
  const [styles, setStyles] = useState(component.styles);

  const deleteMessage = isLeaf
    ? {
        severity: 'success',
        text: 'Successfully removed a component ' + component.name,
      }
    : {
        severity: 'error',
        text: `Component ${component.name} has children. Failed to remove`,
      };

  function handleSumbit(e) {
    e.preventDefault();
    const body = {
      name: e.target.name.value,
      innerHtml: isLeaf ? e.target.innerHtml.value : '',
      styles: convertArrToObj(styles),
      props: convertArrToObj(props),
    };
    if (isValidVariableName(body.name)) {
      try {
        dispatch(submitComponentForm({ componentId: component._id, body }));
        setMessage({ severity: 'success', text: 'Saved successfully.' });
        closeEditor();
      } catch (err) {
        setMessage({
          severity: 'error',
          text: 'Design: update component: ' + err,
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
  }

  return (
    <Modal open={open} onClose={closeEditor}>
      <Box
        component='form'
        className='componentEditor'
        sx={boxStyle}
        display='grid'
        gridTemplateColumns='repeat(12, 1fr)'
        gap={2}
        onSubmit={handleSumbit}
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
                  disp;
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
  const [nameVal, setNameVal] = useState(name);
  return (
    <Fragment>
      <Box gridColumn='span 6'>
        <TextField
          size='small'
          required
          label='name'
          name='name'
          value={nameVal}
          disabled={idx === 0}
          onChange={(e) => setNameVal(e.target.value)}
        />
      </Box>
      <Box gridColumn='span 6'>
        <ParentSelector size='small' childIdx={idx} />
      </Box>
    </Fragment>
  );
}

function HtmlData({ idx, isLeaf, innerHtml }) {
  const [innerHtmlVal, setInnerHtmlVal] = useState(innerHtml);
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
          value={innerHtmlVal}
          onChange={(e) => setInnerHtmlVal(e.target.value)}
        />
      </Box>
    </Fragment>
  );
}

function AddData({ data, setData, dataName }) {
  const keys = data.map((item) => item.key);
  const title =
    dataName === 'Props'
      ? 'You can specify your component props in key-value pairs. '
      : 'You can specify some basic html in key-value pairs.';

  return (
    <Fragment>
      <Typography variant='h5'>{dataName}</Typography>
      <Box gridColumn='span 12' display='flex'>
        <Tooltip title={title}>
          <Typography variant='h6' sx={{ mr: 2 }}>
            Add {dataName}
          </Typography>
        </Tooltip>

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
            {dataName === 'Props' ? (
              <PropsTextField
                idx={idx}
                item={item}
                setData={setData}
                keys={keys}
                data={data}
              />
            ) : (
              <StylesAutocomplete
                idx={idx}
                item={item}
                setData={setData}
                keys={keys}
                data={data}
              />
            )}
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

function PropsTextField({ idx, item, setData, keys, data }) {
  const dispatch = useDispatch();
  return (
    <TextField
      required
      label='key'
      id={`key${idx}`}
      name={`props-${item.key}-key`}
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
  );
}

const basicCssProperties = [
  'border',
  'border-style',
  'color',
  'font-size',
  'font-style',
  'font-weight',
  'line-height',
  'padding',
  'padding-bottom',
  'padding-left',
  'padding-right',
  'padding-top',
  'text-align',
  'text-decoration',
  'text-transform',
  'word-spacing',
  'letter-spacing',
  'overflow',
  'box-shadow',
  'text-shadow',
  'cursor',
];

function StylesAutocomplete({ idx, item, setData, keys, data }) {
  const [value, setValue] = useState(
    item.key.slice(0, 5) === 'style' ? null : item.key
  );
  const [inputValue, setInputValue] = useState('');

  const [anchorEl, setAnchorEl] = useState(null);
  const inputRef = useRef();

  return (
    <Fragment>
      <Autocomplete
        value={value}
        onChange={(e, newValue) => {
          if (!newValue || newValue.length === 0) {
            setValue(item.key);
          } else {
            setValue(newValue);
            setData(
              data.map((el, i) => (i === idx ? { ...el, key: newValue } : el))
            );
            if (newValue.slice(0, 6) === 'border' && inputRef.current) {
              setAnchorEl(inputRef.current);
              setTimeout(() => setAnchorEl(null), 2000);
            } else setAnchorEl(null);
          }
        }}
        inputValue={inputValue}
        onInputChange={(e, newInputValue) => {
          setInputValue(newInputValue);
        }}
        options={basicCssProperties}
        renderInput={(params) => (
          <TextField
            {...params}
            label='Common Non-Layour css'
            inputRef={inputRef}
          />
        )}
      />
      <Popper
        open={Boolean(anchorEl)}
        placement='bottom'
        anchorEl={anchorEl}
        sx={{ zIndex: 10000, color: '#fff', backgroundColor: '#ffffff4D' }}
      >
        <Typography>
          Note: setting border-related styles here might not {'\n'}be reflected
          in the component rectangle
        </Typography>
      </Popper>
    </Fragment>
  );
}
