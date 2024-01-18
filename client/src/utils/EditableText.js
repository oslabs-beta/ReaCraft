import React, { useState } from 'react';

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
    <div align='center' onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <input
          type='text'
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      ) : (
        <span fontSize='30vw'>{text}</span>
      )}
    </div>
  );
};

export default EditableText;
