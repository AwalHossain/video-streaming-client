import { Close as CloseIcon } from '@mui/icons-material';
import {
    Button,
    Grid,
    IconButton,
    Modal,
    Paper,
    Step,
    StepLabel,
    Stepper
} from '@mui/material';
import { styled } from '@mui/system';
import React, { useState } from 'react';
import StepOne from '../components/upload/StepOneForm';
import StepTwo from '../components/upload/StepTwoForm';


import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useGetVideoByIdQuery } from '../redux/features/video/videoApi';
import { resetVideoMetaData } from '../redux/features/video/videoSlice';
import REACT_APP_API_URL from '../utils/apiUrl';



const validationSchema = yup.object({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    visibility: yup.string().required('Visibility is required'),
    // thumbnailUrl: yup.string().required('Thumbnail URL is required'),
    language: yup.string().required('Language is required'),
    recordingDate: yup.date().required('Recording date is required'),
    category: yup.string().required('Category is required'),
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
    bgcolor: 'gray',
    [theme.breakpoints.down('sm')]: {
        width: '100%',
    },
    '&:focus': {
        outline: 'none',
    },
    '&:hover': {
        cursor: 'pointer',
    },
}));

const CloseIconButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
}));



const VideoForm = ({ id, onClose }) => {
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    console.log(id, 'data from videoForm update');

    const { data: VideoData, isLoading: FetcLoading, error } = useGetVideoByIdQuery(id, { refetchOnMountOrArgChange: true, refetchOnFocus: true });

    const data = VideoData?.data;

    const handleClose = () => {
        dispatch(resetVideoMetaData())
        setOpen(false);
        onClose();
    };
    console.log(data?.originalName, 'videData', data?.title);
    const formik = useFormik({
        initialValues: {
            title: data?.title || '',
            description: data?.description || '',
            visibility: data?.visibility || '',
            language: data?.language || '',
            recordingDate: data?.recordingDate || "",
            category: data?.category || '',
            tags: data?.tags || [],
        },
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            console.log(values, 'data from updateVideoMetaData', data?._id);
            console.log(values);
            await axios.put(`${REACT_APP_API_URL}/videos/update/${data?._id}`, values, {
                headers: {
                    Authorization: localStorage.getItem('accessToken'),
                },
            })
                .then((res) => {
                    console.log(res, 'res from updateVideoMetaData');
                    dispatch(resetVideoMetaData())
                    navigate('/dashboard');
                })
                .catch((err) => {
                    console.log(err, 'err from updateVideoMetaData');
                })
        },
    });

    const [step, setStep] = useState(1);
    const steps = ['Video Details', 'Visibility and Publish'];

    const nextStep = () => {
        if (step === 1) {
            // Validate step 1
            if (formik.values.title && formik.values.description) {
                setStep(step + 1);
            }
        } else if (step === 2) {
            // Validate step 2
            if (formik.values.visibility && formik.values.thumbnailUrl) {
                setStep(step + 1);
            }
        }
        // Add more else if blocks for additional steps
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    return (
        <>
            <Modal open={open}>
                <UploadModalContainer elevation={3}>
                    <CloseIconButton onClick={handleClose}>
                        <CloseIcon />
                    </CloseIconButton>
                    {
                        FetcLoading ? <h1>Loading....</h1> : (
                            <form onSubmit={formik.handleSubmit}>
                                <Stepper activeStep={step - 1} alternativeLabel>
                                    {steps.map((label) => (
                                        <Step key={label}>
                                            <StepLabel>{label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                                <Grid container spacing={5} marginY={5}>
                                    {step === 1 && (
                                        <StepOne formik={formik} />

                                    )}
                                    {step === 2 && (
                                        <StepTwo formik={formik} />
                                    )}
                                </Grid>
                                <div>
                                    {step === 2 && (
                                        <LoadingButton
                                            //fullWidth
                                            size='large'
                                            type='submit'
                                            variant='contained'
                                            disabled={formik.isSubmitting || !formik.isValid}
                                        >
                                            Update
                                        </LoadingButton>
                                    )}
                                </div>
                                <div
                                    style={{
                                        marginTop: 20,
                                    }}
                                >
                                    <Button onClick={prevStep} disabled={step === 1}>
                                        Back
                                    </Button>
                                    <Button onClick={nextStep} disabled={step === 2}>
                                        Next
                                    </Button>
                                </div>
                            </form>
                        )
                    }

                </UploadModalContainer>
            </Modal>
        </>
    );
};

export default VideoForm;
