import './Page0.css';
import React from 'react';
import Amir from './Amir.jsx'
import Claire from './Claire.jsx'
import Face from './Face.jsx'
import New from './New.jsx'

 export default function Page0({ childId1, childId2, childId3, childId4 }) {
  return (
    <div className='Page' id='Page0'>
      <Amir id='Amir-1'  />
      <Claire id='Claire-2'  />
      <Face id='Face-3'  />
      <New id='New-3'  />
    </div>
  );
}