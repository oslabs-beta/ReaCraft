import React, { useState } from 'react';
import cssGlobal from '../Styles/cssGlobal.css';
import { fontSize } from '@mui/system';

const EditableText = ({ initialText }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <div style={cssGlobal} align='center' onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <input
          className='cardInput'
          type='text'
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      ) : (
        <span className='cardTitle'>{text}</span>
      )}
    </div>
  );
};

export default EditableText;
