import React, { useState, useEffect } from 'react';
import './App.css';
import RootContainer from './components/RootContainer.jsx';

function App() {
  const [title, setTitle] = useState('React App');

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className='App'>
      <h1>Your design: {title}</h1>
      <RootContainer setTitle={setTitle} />
    </div>
  );
}

export default App;
