import React, { Fragment } from 'react';
import './Logo.css';

export default function Logo() {
  return (
    <Fragment>
      <a href='https://reacraft.org' target='_blank' rel='noopener noreferrer'>
        <div class='logo-container'>
          <img
            alt='Logo'
            class='logo rotate-in-ver'
            src={`${process.env.PUBLIC_URL}/02_Ring_1.svg`}
          />
          <img
            alt='Logo'
            class='logo2 rotate-in-ver2'
            src={`${process.env.PUBLIC_URL}/02_Ring_2.svg`}
          />
          <img
            alt='Logo'
            class='logo3 rotate-in-ver3'
            src={`${process.env.PUBLIC_URL}/02_Ring_3.svg`}
          />
          <img
            alt='Logo Letters'
            class='logo-letters'
            src={`${process.env.PUBLIC_URL}/4_RC_Letters.svg`}
          />
        </div>
      </a>
      <p>
        Thank you for using{' '}
        <a
          href='https://reacraft.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          ReaCraft
        </a>
      </p>
    </Fragment>
  );
}
