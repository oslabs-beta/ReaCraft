import React from 'react';
import FileUploaderNewDesign from './FileUploaderNewDesign';
import Workspace from './Workspace/Workspace';
import { useSelector, useDispatch } from 'react-redux';
import { LoadingButton } from '@mui/lab';

export default function DesignPage({ isWorkspaceReady }) {
  const { _id, loading } = useSelector((state) => state.designV3);

  if (!_id && loading) return <LoadingButton />;
  // return _id ? <Workspace /> : <FileUploaderNewDesign />;
  // render FileUploader if _id is not available
  if (!_id) return <FileUploaderNewDesign />;
  // render Workspace if _id is available and workspace is ready
  return _id && isWorkspaceReady ? <Workspace /> : null;
}