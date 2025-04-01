import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import { Avatar, Box, Button, Divider, IconButton, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import { formatDistanceToNow } from 'date-fns';
import { useState } from "react";
import { useGetUserbyIdQuery } from '../../redux/features/auth/authApi';

export default function Description({ video }) {
  const { title, createdAt, author, viewsCount, likesCount } = video;
  console.log(video,'video');

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  
  // Only make the query if author exists and is a valid ID
  const { 
    data, 
    isLoading: userLoading, 
    isError: userError 
  } = useGetUserbyIdQuery(author, { 
    skip: !author || author === 'undefined' || author === 'null',
  });
  const userData = data?.data;
  console.log('Author ID:', author);
  console.log('User data:', userData);

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  // Format the date nicely - e.g. "3 days ago"
  const formattedDate = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : '';

  return (
    <Box sx={{ py: 2 }}>
      {/* Video Title */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: "#0f0f0f",
          mb: 1,
          lineHeight: 1.2,
        }}
      >
        {title}
      </Typography>

      {/* Stats and Action Buttons */}
      <Box 
        sx={{ 
          display: "flex", 
          alignItems: { xs: "start", sm: "center" }, 
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          mb: 2,
          mt: 1,
          gap: 2
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2" color="text.secondary">
            {viewsCount || 0} views • {formattedDate}
          </Typography>
        </Box>

        <Stack 
          direction="row" 
          spacing={0.5} 
          alignItems="center"
          sx={{ 
            bgcolor: "#f2f2f2", 
            borderRadius: "24px",
            height: "36px",
            pl: 1
          }}
        >
          <Tooltip title="I like this">
            <IconButton 
              onClick={handleLike} 
              sx={{ color: liked ? "primary.main" : "text.primary" }}
            >
              {liked ? <ThumbUpIcon fontSize="small" /> : <ThumbUpOutlinedIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Typography variant="body2" sx={{ pr: 1 }}>
            {liked ? (likesCount ? likesCount + 1 : 1) : (likesCount || 0)}
          </Typography>
          
          <Divider orientation="vertical" flexItem sx={{ height: "24px", my: "auto" }} />
          
          <Tooltip title="I dislike this">
            <IconButton 
              onClick={handleDislike}
              sx={{ color: disliked ? "text.primary" : "inherit" }}
            >
              {disliked ? <ThumbDownIcon fontSize="small" /> : <ThumbDownOutlinedIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Share">
            <IconButton>
              <ReplyOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Save">
            <IconButton>
              <PlaylistAddOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="More">
            <IconButton sx={{ mr: 1 }}>
              <MoreHorizIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Channel Info and Subscribe Button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {userLoading ? (
            <>
              <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
              <Box>
                <Skeleton variant="text" width={120} height={24} />
                <Skeleton variant="text" width={80} height={20} />
              </Box>
            </>
          ) : userError ? (
            <Typography color="text.secondary">
              Channel information unavailable
            </Typography>
          ) : (
            <>
              <Avatar 
                src={userData?.data?.avatar || userData?.avatar} 
                alt={userData?.data?.name || userData?.name || "Channel"}
                sx={{ width: 48, height: 48, mr: 2, bgcolor: "primary.main" }}
              >
                {(userData?.data?.name || userData?.name || "C").charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                  {userData?.data?.name || userData?.name || "Channel Name"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {userData?.data?.subscribersCount || userData?.subscribersCount || 0} subscribers
                </Typography>
              </Box>
            </>
          )}
        </Box>
        
        <Button 
          variant="contained" 
          sx={{ 
            bgcolor: "#0f0f0f", 
            color: "white", 
            borderRadius: "24px",
            textTransform: "none",
            px: 2,
            "&:hover": {
              bgcolor: "#272727"
            }
          }}
        >
          Subscribe
        </Button>
      </Box>

      {/* Video Description */}
      <Box
        sx={{
          p: 2,
          bgcolor: "#f2f2f2",
          borderRadius: 2,
          whiteSpace: "pre-wrap",
        }}
      >
        <Typography variant="body2" sx={{ mb: 1 }}>
          {video?.description || "No description"}
        </Typography>
      </Box>
    </Box>
  );
}
