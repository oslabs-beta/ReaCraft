import React, { useEffect } from 'react';
import './App.css';
import Page0 from './Page0/Page0.jsx';
import Page1 from './Page1/Page1.jsx';
import Page2 from './Page2/Page2.jsx';

export default function App() {
  useEffect(() => {
    document.title = Test;
  },[]);
  return (
    <div className='App'>
      Your design: Test
      <Page0 />
      <Page1 />
      <Page2 />
    </div>
  )
}