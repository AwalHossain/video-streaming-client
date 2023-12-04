import React, { useEffect, useState } from 'react';
// @mui


import { useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState();

  useEffect(() => {
    setPrevLocation(location.pathname);
  }, [location]);
  const handleClose = () => {
    setOpen(false);
    console.log("prevLocation", prevLocation);
    navigate('/');

  };

  return (

    <UploadModal open={open} onClose={handleClose} />
  );
};



