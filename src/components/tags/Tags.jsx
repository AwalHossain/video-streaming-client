import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import React from 'react';
import { VIDEO_TAGS } from '../../utils/constants';
import Tag from './Tag';

const Tags = () => {

    const tags = VIDEO_TAGS;

    return (
        <section>
            <Grid
                container
                // justifyContent="center"
                alignItems="center"
                spacing={2}
            >
                {tags.map((tag) => (
                    <Box key={tag.id} m={0.5}>
                        {/* <Typography variant="body1" fontWeight="fontWeightBold"> */}
                        <Tag tag={tag} />
                        {/* </Typography> */}
                    </Box>
                ))}
            </Grid>
        </section>
    );
};

export default Tags;