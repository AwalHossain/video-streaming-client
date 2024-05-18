import { Box } from '@mui/material';
import React from 'react';
import { useGetAllVideosQuery } from '../../../redux/features/video/videoApi';
import RelatedItemList from './RelatedItemList';

const RelatedVideo = ({ tags }) => {
    let params = {};
    if (tags && tags.length > 0) {
        params.tags = tags;
    }

    const { isFetching, isLoading, isError, error, data, refetch } = useGetAllVideosQuery(params, { refetchOnReconnect: true, refetchOnMountOrArgChange: true, refetchOnFocus: true, });
    console.log(tags, 'tags from RelatedVideo');

    let content;

    if (isLoading || isFetching) {
        content = <Box sx={{
            gridColumn: { xs: 'span 1', lg: 'auto' }
        }}>
            {Array.from({ length: 15 }).map((_, index) => (
                <RelatedItemList key={index} isLoading={isLoading} isFetching={isFetching} />
            ))}
        </Box>
    } else if (isError) {
        content = <div>{error.message}</div>;
    }

    if (data?.data?.length === 0) {
        content = <div>No data found</div>
    }

    if (data?.data?.length > 0) {
        content = <Box sx={{
            gridColumn: { xs: 'span 1', lg: 'auto' }
        }}>
            {
                data?.data?.map((video, index) => (
                    <RelatedItemList video={video} key={index} />
                ))
            }
        </Box>


    }

    return content;
}

export default RelatedVideo;