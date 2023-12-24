import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import VideoGrid from '../components/grid/VideoGrid';
import Tags from '../components/tags/Tags';


export default function DashboardAppPage() {
  const theme = useTheme();

  console.log('data from DashboardAppPage');
  return (
    <>
      <Helmet>
        <title>Video Dashboard</title>
      </Helmet>

      <Container maxWidth="xl">
        <Tags />
        <VideoGrid />
      </Container>
    </>
  );
}
