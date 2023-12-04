import { Box, Grid } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';
import Description from '../components/description/Description';
import Player from '../components/description/Player';
import Loading from '../components/ui/Loading';
import RelatedVideo from '../components/ui/list/RelatedVideo';
import { useGetVideoByIdQuery } from '../redux/features/video/videoApi';

const VideoPlayerPage = () => {
  const { videoId } = useParams();
  const { data: videoData, isLoading, isError, error, videoLink, status } = useGetVideoByIdQuery(videoId);

  const data = videoData?.data;

  console.log(data, 'videoData from VideoPlayerPage', status);

  let content;

  if (isLoading) {
    content = <Loading />;
  }

  if (!isError && !isLoading && !data?._id) {
    content = <Box sx={{ gridColumn: 'span 12' }}>No video found</Box>;
  }

  if (isError) {
    content = <Box sx={{ gridColumn: 'span 12' }}>{error}</Box>;
  }

  if (!isError && data?._id) {
    content = (
      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <Player link={videoLink} title={data.thumbnailUrl} />
          <Description video={data} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <RelatedVideo />
        </Grid>
      </Grid>
    );
  }

  return (
    <Box sx={{ pt: 6, pb: 20 }}>
      <Box sx={{ mx: 'auto', maxWidth: '7xl', px: 2, pb: 20, minHeight: '400px' }}>
        {content}
      </Box>
    </Box>
  );
};

export default VideoPlayerPage;