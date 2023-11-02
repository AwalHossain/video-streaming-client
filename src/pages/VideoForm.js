import { Close as CloseIcon } from '@mui/icons-material';
import {
    Button,
    FormControl,
    Grid,
    IconButton,
    Modal,
    Paper,
    Step,
    StepLabel,
    Stepper,
    TextField,
} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled } from '@mui/system';
import React, { useState } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { LoadingButton } from '@mui/lab';
import { useFormik } from 'formik';
import * as yup from 'yup';



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

const UploadButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: '100%',
}));

const VideoForm = () => {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            visibility: 'public',
            thumbnailUrl: '',
            language: 'English',
            recordingDate: new Date(),
            category: 'Education',
            videoFile: null,
        },
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
                                <>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            label="Video file name"
                                            value={formik.values.videoFile?.name}
                                            error={Boolean(formik.errors?.videoFile)}
                                            helperText={formik.errors?.videoFile}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            id="title"
                                            name="title"
                                            label="Video title"
                                            value={formik.values.title}
                                            onChange={formik.handleChange}
                                            error={formik.touched.title && Boolean(formik.errors.title)}
                                            helperText={formik.touched.title && formik.errors.title}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="description"
                                            name="description"
                                            multiline
                                            label="Video description"
                                            value={formik.values.description}
                                            onChange={formik.handleChange}
                                            error={
                                                formik.touched.description &&
                                                Boolean(formik.errors.description)
                                            }
                                            helperText={
                                                formik.touched.description && formik.errors.description
                                            }
                                            fullWidth
                                        />
                                    </Grid>
                                </>
                            )}
                            {step === 2 && (
                                <>

                                    <Grid item xs={12} md={6} spacing={5}>
                                        <FormControl fullWidth>
                                            <InputLabel id="visibility-select-label">Visibility</InputLabel>
                                            <Select
                                                labelId="visibility-select-label"
                                                id="visibility-simple-select"
                                                name="visibility"
                                                label="Visibility"
                                                value={formik.values.visibility}
                                                onChange={formik.handleChange}
                                                error={Boolean(formik.errors.visibility)}
                                                fullWidth
                                            >
                                                <MenuItem value="public">Public</MenuItem>
                                                <MenuItem value="private">Private</MenuItem>
                                                <MenuItem value="unlisted">Unlisted</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6} spacing={5}>
                                        <TextField
                                            id="thumbnailUrl"
                                            name="thumbnailUrl"
                                            label="Thumbnail URL"
                                            value={formik.values.thumbnailUrl}
                                            onChange={formik.handleChange}
                                            error={
                                                formik.touched.thumbnailUrl &&
                                                Boolean(formik.errors.thumbnailUrl)
                                            }
                                            helperText={
                                                formik.touched.thumbnailUrl && formik.errors.thumbnailUrl
                                            }
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6} spacing={5}>
                                        <FormControl fullWidth>
                                            <InputLabel id="language-select-label">Language</InputLabel>
                                            <Select
                                                labelId="language-select-label"
                                                id="language-simple-select"
                                                label="Language"
                                                value={formik.values.language}
                                                onChange={formik.handleChange}
                                                error={Boolean(formik.errors.language)}
                                                fullWidth
                                            >
                                                <MenuItem value="English">English</MenuItem>
                                                <MenuItem value="Bangla">Bangla</MenuItem>
                                                <MenuItem value="Spanish">Spanish</MenuItem>
                                                <MenuItem value="Hindi">Hindi</MenuItem>
                                                <MenuItem value="Urdu">Urdu</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6} spacing={5}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Recording Date"
                                                value={formik.values.recordingDate}
                                                inputFormat="DD/MM/YYYY"
                                                onChange={(newValue) => {
                                                    formik.setFieldValue('recordingDate', newValue);
                                                }}
                                                renderInput={(params) => <TextField {...params} fullWidth />}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                </>

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
