import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import VideoGrid from '../components/grid/VideoGrid';
import Tags from '../components/tags/Tags';
import { connectSocket } from '../redux/features/socket/socketApi';


export default function DashboardAppPage() {
  const theme = useTheme();
  const user = useSelector((state) => state.auth.user);
  const userId = user ? user._id : null;
  const dispatch = useDispatch();
  console.log('Before connectSocket', userId, dispatch);
  const data = connectSocket(userId, dispatch);
  console.log('After connectSocket', data);
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
