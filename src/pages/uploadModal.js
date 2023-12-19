import { Close as CloseIcon } from '@mui/icons-material';
import {
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    Modal,
    Paper,
    Typography
} from '@mui/material';
import { styled } from '@mui/system';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import VideoForm from './VideoForm';


import {
    CloudUpload as CloudUploadIcon,
    PictureInPicture as ImageIcon,
    VideoLibrary as VideoLibraryIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useUpload } from '../components/upload/handleUplodadProgress';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const UploadModalContainer = styled(Paper)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: theme.spacing(2),
    width: '90%', // Set the width to 70% for big screen sizes
    height: '90%', // Set the height to 90% for big screen sizes
    maxWidth: 1000, // Set the maximum width to 600px
    textAlign: 'center',
    bgcolor: 'gray', // Set the background color to gray
    [theme.breakpoints.down('sm')]: {
        // Make the modal responsive for small screen sizes
        width: '90%',
    },
    '&:focus': {
        outline: 'none',
    },
    '&:hover': {
        cursor: 'pointer',
    },
    zIndex: 10,
}));

const CloseIconButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
}));







const validationSchema = yup.object({
    video: yup.mixed().test(
        'fileFormat',
        'Unsupported Format',
        (value) => value && ["vide/avi", "video/mp4", "video/x-matroska"].includes(value.type)
    ).test(
        'fileSize',
        'File Size is too large',
        (value) => value && value.size <= 50000000
    ).required('Video file is required'),
    image: yup.mixed().test(
        'fileFormat',
        'Unsupported Format',
        (value) => !value || ['image/jpg', 'image/jpeg', 'image/png'].includes(value.type)
    ).test(
        'fileSize',
        'File Size is too large',
        (value) => !value || value.size <= 2000000
    ).optional(),
});


export const UploadModal = React.memo(({ open, onClose }) => {
    // const [uploading, setUploading] = useState(false); // State to track if upload is in progress
    const InitalMetaData = useSelector(state => state.videoData.videoMetadata);
    const [showForm, setShowForm] = useState(false);
    const { upload, uploading, data } = useUpload();

    useEffect(() => {
        if (InitalMetaData?.originalName) {
            setShowForm(true);
            onClose();
        }
    }, [InitalMetaData, onClose]);

    const formik = useFormik({
        initialValues: {
            video: undefined,
            image: undefined,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const data = await upload(values);
            console.log(data, 'sumit oa di');
        },
    });

    const handleAnimationComplete = () => {
        onClose();
        console.log('Animation completed');
    }
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    console.log('rendering upload modal checking');
    return (
        <>
            <Modal open={open}>
                <UploadModalContainer elevation={3}>
                    <CloseIconButton onClick={onClose}>
                        <CloseIcon />
                    </CloseIconButton>
                    <Typography variant="h6">Upload Video</Typography>
                    <Typography variant="body1" component="p">
                        Drag and drop video files to upload
                    </Typography>
                    <Typography variant="body2" component="p">
                        Your videos will be private until you publish them.
                    </Typography>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '20px',
                        }}
                    >
                        <div>
                            <form onSubmit={formik.handleSubmit}>
                                <Grid container spacing={5} marginY={5}>

                                    <Grid item xs={12} sm={12}>
                                        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                                            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                                Upload Video
                                                <VisuallyHiddenInput
                                                    name='video'
                                                    accept='video/*,video/x-matroska'
                                                    id='video'
                                                    type='file'
                                                    onChange={(e) => {
                                                        const file = e.currentTarget.files[0];
                                                        formik.setFieldValue('video', file);
                                                        setSelectedVideo(file.name);
                                                    }}
                                                />
                                            </Button>
                                            {
                                                formik.touched.video && formik.errors.video ? (
                                                    <Typography variant="body2" component="div" sx={{ color: 'red' }}>
                                                        {formik.errors.video}
                                                    </Typography>
                                                ) : null
                                            }
                                            {selectedVideo && <Box display="flex" alignItems="center">
                                                <VideoLibraryIcon />
                                                <Typography>{selectedVideo}</Typography>
                                            </Box>} {/* Display the file name */}
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} sm={12}>
                                        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                                            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                                Upload WaterMark Image
                                                <VisuallyHiddenInput
                                                    name='image'
                                                    accept='image/*'
                                                    id='image'
                                                    type='file'
                                                    onChange={(e) => {
                                                        const file = e.currentTarget.files[0];
                                                        formik.setFieldValue('image', file);
                                                        setSelectedImage(file.name);
                                                    }}
                                                />
                                            </Button>
                                            {/* formik err */}
                                            {
                                                formik.touched.image && formik.errors.image ? (
                                                    <Typography variant="body2" component="div" sx={{ color: 'red' }}>
                                                        {formik.errors.image}
                                                    </Typography>
                                                ) : null
                                            }
                                            {selectedImage && <Box display="flex" alignItems="center">
                                                <ImageIcon />
                                                <Typography>{selectedImage}</Typography>
                                            </Box>} {/* Display the file name */}

                                        </FormControl>
                                        <Button type="submit" variant="contained" color="primary" style={{
                                            margin: '20px 0',
                                        }} sx={{ m: 1 }}
                                            disabled={formik.isSubmitting || !formik.values.video}
                                        >
                                            Submit
                                        </Button>
                                    </Grid>


                                </Grid>

                            </form>
                        </div>

                    </div>
                    <Typography variant="body2" component="p">
                        By submitting your videos to YouTube, you acknowledge that you agree
                        to YouTube's{' '}
                        <a
                            href="https://www.youtube.com/t/terms"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a
                            href="https://www.youtube.com/yt/about/policies/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Community Guidelines
                        </a>
                        .
                    </Typography>
                </UploadModalContainer>
            </Modal>
            {
                showForm && <VideoForm id={InitalMetaData?._id} />
            }
        </>
    );
});

// {
//     uploading ? (
//         <div>
//             {/* Display rocket animation or loading indicator here */}
//             <Typography variant="body2" component="div">
//                 <div style={{ height: 300, width: 300 }}>
//                     Uploading...
//                     <Lottie
//                         animationData={rocket}
//                         onAnimationEnd={() => console.log('Animation End!')}
//                         onComplete={handleAnimationComplete}
//                         loop={false} // Set to true for the animation to rep
//                         speed={2.5} // Set the speed of the animation
//                         segments={[0, 20]} // Set the start and end frames of the animation
//                     />
//                 </div> {/* Replace with your animation component */}
//             </Typography>
//         </div>
//     ) : (

