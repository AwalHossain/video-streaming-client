import { Avatar, Box, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const VideoGridItem = ({ video, isLoading, isFetching }) => {
    const { _id, title, author, views, date, duration, fileName, thumbnailUrl, createdAt } =
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
                    <img
                        style={{ width: '100%', height: isMobile ? 'auto' : 178 }}
                        alt={title}
                        src={thumbnailUrl}
                    />

                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                        <Avatar src={author ? author.avatar : "/assets/images/avatars/avatar_default.jpg"} alt="" sx={{ width: 40, height: 40, marginRight: 1 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                            <Typography variant="body1">{title}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {author.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {`${"40M"} • ${createdAt}`}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Link>)
    );
}

export default VideoGridItem;