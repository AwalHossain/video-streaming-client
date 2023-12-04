import { Box } from '@mui/material';
import React from 'react';
import RelatedItemList from './RelatedItemList';

const RelatedVideo = () => {
    return (
        <Box sx={{ overflowY: 'visible', maxHeight: 570, gridColumn: { xs: 'span 1', lg: 'auto' } }}>
            {
                Array.from({ length: 10 }).map((_, index) => (
                    <RelatedItemList key={index} />
                ))
            }
        </Box>
    )
}

export default RelatedVideo;