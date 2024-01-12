import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import UserImageUpload from './UserImageUpload';
import { useDispatch, useSelector } from 'react-redux';
import Workspace from './Workspace';
import { startDesign } from '../utils/reducers/designSlice';
import SaveDesign from './userInputs/SaveDesign';
import { nextStep, prevStep, resetStep } from '../utils/reducers/appSlice';

const steps = [
  'Upload your design',
  'Create React components',
  'Save your design',
];

export default function HorizontalStepper() {
  const activeStep = useSelector((state) => state.app.activeStep);
  const userImage = useSelector((state) => state.design.userImage);
  const dispatch = useDispatch();

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === 0 && userImage && (
        <img src={userImage} style={{ maxWidth: '100%' }} />
      )}
      {activeStep === 0 && <UserImageUpload />}
      {activeStep === 1 && <Workspace />}
      {activeStep === 2 && <SaveDesign />}
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button
          color='inherit'
          disabled={activeStep === 0}
          onClick={() => dispatch(prevStep())}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />

        <Button
          onClick={() => {
            dispatch(nextStep());
            if (activeStep === 0 && !userImage) {
              dispatch(startDesign(null));
            }
            if (activeStep === steps.length - 1) {
              dispatch(resetStep());
            }
          }}
        >
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
}
