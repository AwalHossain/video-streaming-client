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


import {
    CloudUpload as CloudUploadIcon,
    VideoLibrary as VideoLibraryIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useUpload } from '../components/upload/handleUplodadProgress';
import { connectSocket, disconnectSocket } from '../redux/features/socket/socketApi';

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
    const { upload } = useUpload();
    const navigate = useNavigate();
    const wsResponse = useSelector(state => state.socket.wsResponse);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadTimeout, setUploadTimeout] = useState(null);
    const [uploadError, setUploadError] = useState(null);

    console.log(wsResponse, 'wsResponse for upload modal');

    const user = useSelector((state) => state.auth.user);
    const userId = user ? user._id : null;
    const dispatch = useDispatch();

    // Connect socket
    useEffect(() => {
        if (userId) {
            connectSocket(userId, dispatch);
        }
        // Clean up on unmount
        return () => {
            disconnectSocket();
            if (uploadTimeout) {
                clearTimeout(uploadTimeout);
            }
        }
    }, [userId, dispatch, uploadTimeout]);


    useEffect(() => {
        // Check if wsResponse has the _id and fileName/originalName that indicates metadata saved
        if (wsResponse && wsResponse._id && (wsResponse.fileName || wsResponse.originalName)) {
            console.log('Received video metadata, navigating to update page.');
            setIsUploading(false);
            setUploadError(null);
            // Clear timeout if it exists
            if (uploadTimeout) {
                clearTimeout(uploadTimeout);
                setUploadTimeout(null);
            }
            navigate(`/update-video/${wsResponse._id}`);
            onClose();
        }
    }, [wsResponse, navigate, onClose, uploadTimeout]);

    const formik = useFormik({
        initialValues: {
            video: undefined,
            image: undefined,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setIsUploading(true);
            setUploadError(null);
            
            try {
                await upload(values);
                
                // Set a timeout to reset upload state if no response after 30 seconds
                const timeout = setTimeout(() => {
                    setIsUploading(false);
                    setUploadError('Upload timeout. Please try again.');
                }, 30000); // 30 seconds timeout
                
                setUploadTimeout(timeout);
            } catch (error) {
                console.error('Upload error:', error);
                setIsUploading(false);
                setUploadError('Failed to upload video. Please try again.');
            }
        },
    });
    const [selectedVideo, setSelectedVideo] = useState(null);
    // Function to reset the upload state
    const handleRetry = () => {
        setIsUploading(false);
        setUploadError(null);
        if (uploadTimeout) {
            clearTimeout(uploadTimeout);
            setUploadTimeout(null);
        }
    };

    console.log('rendering upload modal checking');
    return (
        <>
            <Modal open={open}>
                <UploadModalContainer elevation={3}>
                    <CloseIconButton onClick={onClose}>
                        <CloseIcon />
                    </CloseIconButton>
                    <Typography variant="h4">Upload Video</Typography>
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
                                            <Button 
                                                component="label" 
                                                variant="contained" 
                                                startIcon={<CloudUploadIcon />}
                                                disabled={isUploading}
                                            >
                                                Upload Video (50MB Max)
                                                <VisuallyHiddenInput
                                                    name='video'
                                                    accept='video/*,video/x-matroska'
                                                    id='video'
                                                    type='file'
                                                    onChange={(e) => {
                                                        const file = e.currentTarget.files[0];
                                                        formik.setFieldValue('video', file);
                                                        setSelectedVideo(file?.name || null);
                                                    }}
                                                    disabled={isUploading}
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
                                        {uploadError && (
                                            <Typography 
                                                variant="body2" 
                                                component="div" 
                                                sx={{ color: 'error.main', mt: 1, mb: 1 }}
                                            >
                                                {uploadError}
                                                <Button 
                                                    variant="text" 
                                                    color="primary" 
                                                    size="small"
                                                    onClick={handleRetry}
                                                    sx={{ ml: 2 }}
                                                >
                                                    Retry
                                                </Button>
                                            </Typography>
                                        )}
                                        
                                        <Button 
                                            type="submit" 
                                            variant="contained" 
                                            color="primary" 
                                            style={{
                                                margin: '20px 0',
                                            }} 
                                            sx={{ 
                                                m: 1,
                                                position: 'relative',
                                                '&.Mui-disabled': {
                                                    bgcolor: isUploading ? 'rgba(25, 118, 210, 0.3)' : undefined,
                                                }
                                            }}
                                            disabled={formik.isSubmitting || !formik.values.video || isUploading}
                                        >
                                            {isUploading ? 'Uploading...' : 'Submit'}
                                            {/* {isUploading && (
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        right: 10,
                                                        transform: 'translateY(-50%)',
                                                        display: 'inline-block',
                                                        width: 18,
                                                        height: 18,
                                                        borderRadius: '50%',
                                                        border: '2px solid white',
                                                        borderTopColor: 'transparent',
                                                        animation: 'spin 1s linear infinite',
                                                        '@keyframes spin': {
                                                            '0%': {
                                                                transform: 'rotate(0deg)',
                                                            },
                                                            '100%': {
                                                                transform: 'rotate(360deg)',
                                                            },
                                                        },
                                                    }}
                                                />
                                            )} */}
                                        </Button>
                                    </Grid>


                                </Grid>

                            </form>
                        </div>

                    </div>
                    <Typography variant="body2" component="p">
                        By submitting your videos to YouTube, you acknowledge that you agree
                        to Reely's{' '}
                        <a
                            href="https://www.reely.tech/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a
                            href="https://www.reely.tech/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Community Guidelines
                        </a>
                        .
                    </Typography>
                </UploadModalContainer>
            </Modal>
        </>
    );
});
