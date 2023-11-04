import { Grid, TextField } from "@mui/material";

const StepOne = ({ formik }) => (
    <>
        <Grid item xs={12} md={6}>
            <TextField
                label="Video file name"
                value={formik.values.videoFile?.name}
                error={Boolean(formik.errors?.videoFile)}
                helperText={formik.errors?.videoFile}
                fullWidth
            />
            {
                formik.errors?.videoFile && (
                    <div style={{ color: 'red' }}>
                        {formik.errors?.videoFile}
                    </div>
                )
            }
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
);

export default StepOne;