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
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useGetVideoMetaDataQuery } from '../redux/features/video/videoApi';



const validationSchema = yup.object({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    visibility: yup.string().required('Visibility is required'),
    thumbnailUrl: yup.string().required('Thumbnail URL is required'),
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



const VideoForm = ({ data }) => {
    // const {} = data;
    console.log(data, 'data from videoForm');
    const [open, setOpen] = useState(true);
    // const [videoData, setVideoData] = useState(null);

    const { isLoading, data: videoData, } = useGetVideoMetaDataQuery(data?.id)
    console.log(videoData, 'data from useGetVideoMetaDataQuery');
    const handleClose = () => {
        setOpen(false);
    };
    console.log(videoData?.originalName, 'videData');
    const formik = useFormik({
        initialValues: {
            title: videoData?.originalName || '',
            description: '',
            visibility: 'public',
            thumbnailUrl: '',
            language: 'English',
            recordingDate: new Date(),
            category: 'Education',
            videoFile: null,
        },
        // enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            // await postToServer(values);
            console.log(values);
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
                                    Upload
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
                </UploadModalContainer>
            </Modal>
        </>
    );
};

export default VideoForm;
