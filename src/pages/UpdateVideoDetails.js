import { VIDEO_TAGS } from '@/utils/constants';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import Hls from 'hls.js';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import Iconify from '../components/iconify';
import { connectSocket, disconnectSocket } from '../redux/features/socket/socketApi';
import { useGetVideoByIdQuery } from '../redux/features/video/videoApi';
import REACT_APP_API_URL from '../utils/apiUrl';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string(),
  visibility: yup.string().required('Visibility is required'),
  tags: yup.array()
});

const UpdateVideoDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [videoData, setVideoData] = useState(null);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [thumbnailReady, setThumbnailReady] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const videoRef = useRef(null);
  
  // Get socket response from Redux
  const wsResponse = useSelector(state => state.socket.wsResponse);
  const user = useSelector(state => state.auth.user);
  const userId = user ? user._id : null;

  console.log(params, 'params from update video details');
  // Use RTK Query to fetch video data
  const { data, refetch } = useGetVideoByIdQuery(params.videoId, { 
    refetchOnMountOrArgChange: true,
    skip: !params.videoId
  });

  // Connect socket when component mounts
  useEffect(() => {
    if (userId) {
      connectSocket(userId, dispatch);
    }
    
    return () => {
      disconnectSocket();
    };
  }, [userId, dispatch]);

  // Listen for socket events related to this video
  useEffect(() => {
    if (wsResponse && videoData) {
      // Check if the response is for this video
      if (wsResponse._id === videoData._id) {
        // Update video processing status
        if (wsResponse.status === 'completed' || wsResponse.status === 'published') {
          setProcessingComplete(true);
          refetch(); // Refetch video data to get updated info
        }
        
        // Check if thumbnail is ready
        if (wsResponse.thumbnailUrl || (wsResponse.data && wsResponse.data.thumbnailUrl)) {
          setThumbnailReady(true);
          refetch();
        }
      }
    }
  }, [wsResponse, videoData, refetch]);

  // Update state when data is fetched
  useEffect(() => {
    if (data && data.data) {
      setVideoData(data.data);
      setLoading(false);
      
      // Check initial status
      if (data.data.status === 'completed' || data.data.status === 'published') {
        setProcessingComplete(true);
      }
      
      // Check if thumbnail exists
      if (data.data.thumbnailUrl) {
        setThumbnailReady(true);
      }
    }
  }, [data]);


  // Set up form with formik
  const formik = useFormik({
    initialValues: {
      title: videoData?.title || '',
      description: videoData?.description || '',
      visibility: videoData?.visibility || 'Public',
      tags: videoData?.tags || [],
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        // Transform tags to strings before submission
        const formattedValues = {
          ...values,
          tags: values.tags.map(tag => typeof tag === 'object' ? tag.name : tag)
        };
        
        const response = await axios.put(`${REACT_APP_API_URL}/videos/update/${videoData._id}`, formattedValues, {
          headers: {
            Authorization: localStorage.getItem('accessToken'),
          },
        });
        
        console.log('Video updated successfully:', response.data);
        navigate('/dashboard');
      } catch (error) {
        console.error('Error updating video:', error);
      }
    },
  });

  // Function to initialize HLS
  const initializeHls = (videoElement) => {
    if (!videoData || !processingComplete) return;
    
    // Only use HLS if it's supported and we have a video URL
    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });
      
      // const videoUrl = 
      console.log(videoData, 'video data from update video details');
      hls.loadSource(videoData.videoLink);
      hls.attachMedia(videoElement);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoElement.muted = true; // Mute video by default
      });
      
      // Handle errors
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch(data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // Try to recover network error
              console.log('Network error encountered, trying to recover...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('Media error encountered, trying to recover...');
              hls.recoverMediaError();
              break;
            default:
              // Cannot recover
              console.error('Fatal HLS error:', data);
              hls.destroy();
              break;
          }
        }
      });
      
      return hls;
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      // For Safari which has native HLS support
      videoElement.src = `${REACT_APP_API_URL}/videos/stream/${videoData._id}`;
    } else {
      console.warn('HLS is not supported in this browser');
      // Fallback to regular MP4 if available or show an error message
      videoElement.src = `${REACT_APP_API_URL}/videos/stream/${videoData._id}`;
    }
  };
  
  // Initialize HLS when video element and data are ready
  useEffect(() => {
    if (videoRef.current && processingComplete && videoData) {
      const hls = initializeHls(videoRef.current);
      
      // Cleanup on unmount
      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    }
  }, [videoRef, processingComplete, videoData]);

  // Function to copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${window.location.origin}/watch/${videoData._id}`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Video details
        </Typography>
        
        <Grid container spacing={4}>
          {/* Video Preview Section */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 0,
                height: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#000',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {processingComplete ? (
                <>
                  <Box 
                    component="video" 
                    controls 
                    width="100%" 
                    height="100%" 
                    ref={videoRef}
                    sx={{ 
                      objectFit: 'contain',
                      backgroundColor: '#000', 
                    }} 
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Iconify icon="eva:external-link-fill" />}
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      },
                    }}
                    component="a"
                    href={`/watch/${videoData._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Full Video
                  </Button>
                </>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  color: '#fff'
                }}>
                  <CircularProgress sx={{ mb: 2, color: '#fff' }} />
                  <Typography variant="body1" sx={{ color: '#fff' }}>
                    Video processing in progress...
                  </Typography>
                </Box>
              )}
            </Paper>
            
            {/* Video URL Section (added) */}
            {processingComplete && (
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  mt: 2,
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e0e0e0'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <Iconify icon="eva:link-2-fill" sx={{ mr: 1, color: 'primary.main' }} />
                    Share this video
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    startIcon={<Iconify icon="eva:external-link-fill" />}
                    component="a"
                    href={`/watch/${videoData._id}`}
                    target="_blank"
                    sx={{ borderRadius: '20px', px: 2 }}
                  >
                    Watch Now
                  </Button>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  p: 0.5,
                  pl: 1.5,
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  ...(linkCopied && {
                    borderColor: 'primary.main',
                    boxShadow: '0 0 0 1px rgba(25, 118, 210, 0.2)',
                  })
                }}>
                  <Box 
                    component="input"
                    value={`${window.location.origin}/watch/${videoData._id}`}
                    readOnly
                    sx={{ 
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.875rem',
                      mr: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      backgroundColor: 'transparent',
                    }}
                    onClick={(e) => e.target.select()}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    color={linkCopied ? "success" : "primary"}
                    onClick={copyToClipboard}
                    sx={{ 
                      borderRadius: '4px',
                      minWidth: '80px',
                      transition: 'all 0.2s ease'
                    }}
                    endIcon={linkCopied ? <Iconify icon="eva:checkmark-fill" /> : <Iconify icon="eva:copy-fill" />}
                  >
                    {linkCopied ? 'Copied' : 'Copy'}
                  </Button>
                </Box>
                
                {linkCopied && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'success.main', 
                      mt: 1, 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Iconify icon="eva:checkmark-circle-2-fill" sx={{ mr: 0.5 }} />
                    Link copied to clipboard!
                  </Typography>
                )}
              </Paper>
            )}
            
            {/* Thumbnail */}
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                mt: 2,
                position: 'relative',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #e0e0e0',
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Iconify icon="eva:image-fill" sx={{ mr: 1, color: 'primary.main' }} />
                Thumbnail
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box 
                  sx={{ 
                    position: 'relative',
                    width: '160px',
                    height: '90px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    border: '1px solid #e0e0e0',
                    backgroundColor: '#000',
                  }}
                >
                  {thumbnailReady ? (
                    <Box 
                      component="img"
                      src={videoData.thumbnailUrl}
                      alt="Video thumbnail"
                      sx={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <Box 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'center', 
                        alignItems: 'center',
                        backgroundColor: '#2d2d2d',
                        color: '#f5f5f5'
                      }}
                    >
                      <CircularProgress size={20} color="inherit" sx={{ mb: 0.5, opacity: 0.7 }} />
                      <Typography variant="caption">
                        Processing...
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    Your thumbnail will be used on the video player and in playlists
                  </Typography>
                  
                  <Button
                    disabled={!thumbnailReady}
                    variant="outlined"
                    size="small"
                    startIcon={<Iconify icon="eva:image-fill" />}
                    sx={{ borderRadius: '4px', fontSize: '0.75rem' }}
                  >
                    Change thumbnail
                  </Button>
                </Box>
              </Box>
            </Paper>

            {/* Video Info */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Status:</strong> {videoData.status.charAt(0).toUpperCase() + videoData.status.slice(1)}
              </Typography>
              <Typography variant="body2">
                <strong>Filename:</strong> {videoData.originalName}
              </Typography>
              <Typography variant="body2">
                <strong>Uploaded:</strong> {new Date(videoData.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </Grid>
          
          {/* Edit Form Section */}
          <Grid item xs={12} md={6}>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label="Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                sx={{ mb: 3 }}
              />
              
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                sx={{ mb: 3 }}
              />
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="visibility-label">Visibility</InputLabel>
                <Select
                  labelId="visibility-label"
                  id="visibility"
                  name="visibility"
                  value={formik.values.visibility}
                  label="Visibility"
                  onChange={formik.handleChange}
                >
                  <MenuItem value="Public">Public</MenuItem>
                  <MenuItem value="Private">Private</MenuItem>
                  <MenuItem value="Unlisted">Unlisted</MenuItem>
                </Select>
              </FormControl>
              
              <Autocomplete
                multiple
                id="tags"
                options={VIDEO_TAGS}
                disableCloseOnSelect
                getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                isOptionEqualToValue={(option, value) => 
                  option.id === value.id || option.name === value
                }
                value={formik.values.tags}
                onChange={(event, newValue) => {
                  formik.setFieldValue('tags', newValue);
                }}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.name}
                  </li>
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={typeof option === 'string' ? option : option.name}
                      {...getTagProps({ index })}
                      key={typeof option === 'string' ? option : option.id}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    placeholder="Add tags"
                  />
                )}
                sx={{ mb: 3 }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                >
                  Save changes
                </Button>
              </Box>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default UpdateVideoDetails;