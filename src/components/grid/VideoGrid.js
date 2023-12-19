import { Refresh as RefreshIcon } from '@mui/icons-material';
import { Box, Button, Grid, SvgIcon, Typography } from '@mui/material';
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
        content =
            Array.from({ length: 6 }).map((_, index) => (
                <Grid container wrap='wrap'>
                    <VideoGridItem key={index} isLoading={isLoading} />
                </Grid>
            ));
    } else if (isError) {
        content = <div>{error.message}</div>;
    } else if (data?.data?.length === 0) {
        content = <div>No data found</div>
    } else if (data?.data?.length > 0) {
        content =
            <Grid container wrap='wrap'>
                {data?.data?.map((video) => (
                    <VideoGridItem key={video._id} video={video} />
                ))}
            </Grid>
    } else {
        content = (
            <Box
                flexDirection="column"
                // justifyContent="center"
                alignItems="center"
                // height="100vh"
                textAlign="center"
            >
                <Typography variant="h4" component="div" gutterBottom>
                    Something went wrong
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SvgIcon component={RefreshIcon} />}
                    onClick={() => refetch()}
                >
                    Retry
                </Button>
            </Box>
        );
    }

    console.log(isLoading, 'isLoading from VideoGrid', data);
    return (
        <Box>
            <Box pt={3}>
                {content}
            </Box>
            <PaginationControl
                page={page}
                pageSize={pageSize}
                totalItems={data?.meta?.totalRecords}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
            />
        </Box >
    )
}

export default VideoGrid;