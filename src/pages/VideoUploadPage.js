import { Button } from '@mui/material'; // Import Button from Material-UI
import { Box } from '@mui/system'; // Import Box from Material-UI
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UploadModal } from './uploadModal';

export default function VideoUploadPage() {
  const [open, setOpen] = React.useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState();

  const handleClose = () => {
    setOpen(false);
    console.log("prevLocation", prevLocation);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      marginTop={"20%"}
    >
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Video Upload
      </Button>
      <UploadModal open={open} onClose={handleClose} />
    </Box>
  );
};