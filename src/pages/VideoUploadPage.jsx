import { Button } from '@mui/material'; // Import Button from Material-UI
import { Box } from '@mui/system'; // Import Box from Material-UI
import React from 'react';
import { VideoUploadModal } from './VideoUploadModal';

export default function VideoUploadPage() {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
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
      <VideoUploadModal open={open} onClose={handleClose} />
    </Box>
  );
}