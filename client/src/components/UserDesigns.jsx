import { Box } from '@mui/material';
import React, { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DesignCard from './DesignCard';
import Workspace from './Workspace';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { getDesigns } from '../utils/fetchRequests';
import { setUserDesigns } from '../utils/reducers/appSlice';

export default function UserDesigns() {
  const userDesigns = useSelector((state) => state.app.userDesigns);
  console.log('userDesigns in userDesigns', userDesigns);
  const designId = useSelector((state) => state.design)._id;
  const design = userDesigns.filter((item) => {
    console.log(item);
    return item._id === designId;
  })[0];

  const dispatch = useDispatch();
  console.log(userDesigns);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const designs = await getDesigns();
        console.log(designs);
        dispatch(setUserDesigns(designs));
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  //converts created date to "MM/DD/YYYY"
  const createdDate = (dateRaw) => {
    let year = dateRaw.substring(0, 4);
    let month = dateRaw.substring(5, 7);
    let day = dateRaw.substring(8, 10);
    return `${month}/${day}/${year}`;
  };

  if (!designId) {
    return (
      <Box
        sx={{
          margin: '60px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(30%, 1fr))',
          justifyContent: 'space-around',
        }}>
        {userDesigns.map((design) => (
          <DesignCard design={design} key={design._id} />
        ))}
      </Box>
    );
  } else
    return (
      <Fragment>
        <Box //Box controls the input field for document name && date
          margin='30px' //margin size across site
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '10px',
          }}>
          <TextField
            size='small'
            name='title'
            label='Title'
            defaultValue={design.title}
          />
          <Typography>Created: {createdDate(design.created_at)}</Typography>
        </Box>
        <Workspace />
      </Fragment>
    );
}
