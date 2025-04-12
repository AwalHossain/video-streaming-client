import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import Description from "../components/description/Description";
import Player from "../components/description/Player";
import Loading from "../components/ui/Loading";
import RelatedVideo from "../components/ui/list/RelatedVideo";
import { useGetVideoByIdQuery } from "../redux/features/video/videoApi";

const VideoPlayerPage = () => {
  const { videoId } = useParams();
  const {
    data: videoData,
    isLoading,
    isError,
    error,
  } = useGetVideoByIdQuery(videoId);

  const data = videoData?.data;

  let content;

  if (isLoading) {
    content = (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Loading />
      </Box>
    );
  }

  if (!isError && !isLoading && !data?._id) {
    content = (
      <Box sx={{ 
        gridColumn: "span 12", 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <Typography variant="h5" color="text.secondary">
          Video not found
        </Typography>
      </Box>
    );
  }

  if (isError) {
    content = (
      <Box sx={{ 
        gridColumn: "span 12", 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: 'error.main'
      }}>
        <Typography variant="h5">
          {error?.data?.message || "An error occurred"}
        </Typography>
      </Box>
    );
  }

  if (!isError && data?._id) {
    content = (
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Box sx={{ borderRadius: '12px', overflow: 'hidden' }}>
            <Player link={data?.videoLink} thumbnailUrl={data.thumbnailUrl} />
          </Box>
          <Paper elevation={0} sx={{ mt: 2, borderRadius: '12px' }}>
            <Description video={data} />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 500, 
              mb: 2, 
              pl: 1 
            }}
          >
            Related Videos
          </Typography>
          <Box 
            sx={{ 
              borderRadius: '12px', 
              overflow: 'hidden',
            }}
          >
            <RelatedVideo tags={data?.tags} />
          </Box>
        </Grid>
      </Grid>
    );
  }

  return (
    <Box 
      sx={{ 
        pt: 3, 
        pb: 6, 
        bgcolor: '#f9f9f9', 
        minHeight: '100vh'
      }}
    >
      <Container 
        maxWidth="xl" 
        sx={{ 
          px: { xs: 1, sm: 2, md: 3 } 
        }}
      >
        {content}
      </Container>
    </Box>
  );
};

export default VideoPlayerPage;
