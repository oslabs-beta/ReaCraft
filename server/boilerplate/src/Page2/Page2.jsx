import './Page2.css';
import React from 'react';
import New from './New.jsx'

 export default function Page2({ childId1 }) {
  return (
    <div className='Page' id='Page2'>
      <New id='New-1'  />
    </div>
  );
}