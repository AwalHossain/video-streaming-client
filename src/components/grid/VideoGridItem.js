import { Avatar, Box, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import { Link } from 'react-router-dom';

const VideoGridItem = ({ video, isLoading, isFetching }) => {
    const { _id, title, author, viewsCount, duration, thumbnailUrl, createdAt } =
        video || {};

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const largeScreen = useMediaQuery(theme.breakpoints.up('lg'));

    return (
        isLoading || isFetching ? (
            <Box sx={{ width: "100%", height: "100%", my: 1 }}>
                <Skeleton variant="rectangular" width={210} height={118} />


                <Box sx={{ pt: 0.5 }}>
                    <Skeleton />
                    <Skeleton width="60%" />
                </Box>
            </Box>
        ) : (
            <Link key={_id} to={`/watch/${_id}`} style={{ textDecoration: 'none', color: "black" }}  >
                <Box sx={{ width: "100%", height: "100%", my: 1 }}>
                    <Box sx={{ position: 'relative', width: '100%', height: isMobile ? 'auto' : 178 }}>
                        <img
                            style={{ width: '100%', height: '100%' }}
                            alt={title}
                            src={thumbnailUrl}
                        />
                        {/* Duration will go here */}
                        <Box sx={{
                            position: 'absolute',
                            bottom: 4,
                            right: 4,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: '#fff',
                            padding: '2px 4px',
                            borderRadius: 0,
                            fontSize: '0.75rem',
                        }}>
                            {duration}
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                        <Avatar src={author ? author.avatar : "/assets/images/avatars/avatar_default.jpg"} alt="" sx={{ width: 40, height: 40, marginRight: 1 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                            <Typography variant="body1">{title}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {author.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {`${viewsCount} views • ${formatDistanceToNow(new Date(createdAt))} ago`}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Link>)
    );
}

export default VideoGridItem;