import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Autocomplete, Grid, TextField } from "@mui/material";
import Checkbox from '@mui/material/Checkbox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const StepOne = ({ formik }) => {
    console.log('title');

    // Sample tags. Replace this with your actual tags.
    const tags = ['Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5', "Tag6", "tag00"];

    const handleTagsChange = (event, value) => {
        formik.setFieldValue('tags', value);
    };
    return (
        <>
            <Grid item xs={12} spacing={5}>
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

            <Grid item xs={12} spacing={5}>
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
            <Grid item xs={12} spacing={5} >
                <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={tags}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option}
                    onChange={handleTagsChange}
                    value={formik.values.tags}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                            />
                            {option}
                        </li>
                    )}
                    // style={{ width: 500 }}
                    renderInput={(params) => (
                        <TextField {...params} label="Checkboxes" placeholder="Favorites" />
                    )}
                />
            </Grid>
        </>
    );
}

export default StepOne;