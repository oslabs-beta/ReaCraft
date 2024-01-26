import React from 'react';
import FileUploaderNewDesign from './FileUploaderNewDesign';
import Workspace from './Workspace/Workspace';
import { useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';

export default function DesignPage() {
  const { _id, loading } = useSelector((state) => state.designV3);

  if (!_id && loading) return <LoadingButton />;
  return _id ? <Workspace /> : <FileUploaderNewDesign />;
}
