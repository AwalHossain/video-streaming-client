import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const StepTwo = ({ formik }) => (
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
                    <MenuItem value="Public">Public</MenuItem>
                    <MenuItem value="Private">Private</MenuItem>
                    <MenuItem value="Unlisted">Unlisted</MenuItem>
                </Select>
            </FormControl>
        </Grid>
        {/* <Grid item xs={12} md={6} spacing={5}>
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
        </Grid> */}
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
);

export default StepTwo;