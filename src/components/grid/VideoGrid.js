import { Box, Grid } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllVideosQuery } from '../../redux/features/video/videoApi';
import PaginationControl from '../paginate/PaginationControl';
import VideoGridItem from './VideoGridItem';

const VideoGrid = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const handlePageChange = (newPage) => {
        setPage(newPage)
    }

    const { search, filter, sort } = useSelector((state) => state.filter);

    const handlePageSizeChange = (newPageSize) => {
        setPage(1);
        setPageSize(newPageSize)
    }

    const params = {
        page: page,
        pageSize: pageSize,
        sortBy: 'createdAt',
        sortOrder: sort,
        searchTerm: search,
    };

    const { isFetching, isLoading, isError, error, data, refetch } = useGetAllVideosQuery(params, { refetchOnReconnect: true, refetchOnMountOrArgChange: true, refetchOnFocus: true, });

    let content;

    if (isLoading) {
        content = Array.from({ length: 6 }).map((_, index) => (
            <VideoGridItem key={index} isLoading={isLoading} />
        ));
    } else if (isError) {
        content = <div>{error.message}</div>;
    } else if (data?.data?.length === 0) {
        content = <div>No data found</div>
    } else {
        content = data?.data?.map((video) => (
            <VideoGridItem key={video._id} video={video} />
        ));
    }

    console.log(isLoading, 'isLoading from VideoGrid', data);
    return (
        <Box>
            <Box pt={3}>
                <Grid container wrap='wrap'>
                    {content}
                </Grid>
            </Box>
            <PaginationControl
                page={page}
                pageSize={pageSize}
                totalItems={data?.meta?.totalRecords}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
            />
        </Box>
    )
}

export default VideoGrid;