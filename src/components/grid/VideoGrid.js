import { Box, Grid } from '@mui/material';
import React, { useState } from 'react';
import { useGetAllVideosQuery } from '../../redux/features/video/videoApi';
import PaginationControl from '../paginate/PaginationControl';
import VideoGridItem from './VideoGridItem';

const VideoGrid = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newPageSize) => {
    setPage(1);
    setPageSize(newPageSize)
  }

  const params = {
    // filterMethod: 'myFilterMethod',
    // sortOrder: 'mySortOrder',
    // sortBy: 'mySortBy',
    page: page,
    pageSize: pageSize
  };


  const { isLoading, isError, error, data, refetch } = useGetAllVideosQuery(params, { refetchOnReconnect: true, refetchOnMountOrArgChange: true, refetchOnFocus: true, });

  let content;

  if (isLoading) {
    content = <div>Loading...</div>;
  }

  if (!isLoading && data?.data?.length === 0) {
    content = <div>No data found</div>
  }

  if (!isLoading && data?.data?.length > 0 && !isError) {
    content = data?.data?.map((video) => (
      <Grid item xs={12} sm={6} md={4} key={video._id}  >
        <VideoGridItem video={video} />
      </Grid>
    ))
  }

  if (isError) {
    content = <div>{error.message}</div>;
  }

  console.log(isLoading, 'isLoading from VideoGrid', data);
  return (
    <div>
      <Box pt={3}>
        <Box pt={3}>
          <Grid container spacing={4}
          >
            {content}
          </Grid>
        </Box>
      </Box>
      <PaginationControl
        page={page}
        pageSize={pageSize}
        totalItems={data?.meta?.totalRecords}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  )
}

export default VideoGrid;