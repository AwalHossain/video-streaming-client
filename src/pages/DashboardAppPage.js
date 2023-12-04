import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import VideoGrid from '../components/grid/VideoGrid';


export default function DashboardAppPage() {
  const theme = useTheme();

  console.log('data from DashboardAppPage');
  return (
    <>
      <Helmet>
        <title>Video Dashboard</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>
        <VideoGrid />
      </Container>
    </>
  );
}
