import styled from "@emotion/styled";
import {
    CloudUpload as CloudUploadIcon,
    PictureInPicture as ImageIcon,
    VideoLibrary as VideoLibraryIcon
} from '@mui/icons-material';
import { Box, Button, FormControl, Grid, Typography } from "@mui/material";

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

const UploadForm = ({ formik, setSelectedVideo, setSelectedImage, selectedVideo, selectedImage }) => {
    return (
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
                        disabled={formik.isSubmitting || !formik.isValid}
                    >
                        Submit
                    </Button>
                </Grid>


            </Grid>

        </form>
    )
}


export default UploadForm;