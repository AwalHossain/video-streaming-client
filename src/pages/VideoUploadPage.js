import React from 'react';
// @mui
import { styled } from "@mui/material/styles";


import { UploadModal } from './uploadModal';

const StyledContent = styled("div")(({ theme }) => ({
  maxWidth: 600,
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignContent: "center",
  alignItems: "left",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

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



