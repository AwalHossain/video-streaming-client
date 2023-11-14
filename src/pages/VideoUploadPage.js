import React from 'react';
// @mui


import { UploadModal } from './uploadModal';


// interface FormValues {
//   title: string;
//   description: string;
//   visibility: string;
//   thumbnailUrl: string;
//   language: string;
//   recordingDate: Date | null;
//   category: string;
//   videoFile: File | null;
// }

/**
 *  Create a MUI form to save below video properties: 
    title, description, visibility, 
    thumbnailUrl, language, recordingDate, 
    category,
 */




export default function VideoUploadPage() {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);

    // window.history.back();
  };

  return (
    <UploadModal open={open} onClose={handleClose} />
  );
};



