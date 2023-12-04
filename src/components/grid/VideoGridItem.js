import { Box, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const VideoGridItem = ({ video, isLoading }) => {
    const { _id, title, author, views, date, duration, fileName, thumbnailUrl, createdAt } =
        video || {};

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        isLoading ? (
            <Box sx={{ width: isMobile ? '100%' : 210, marginRight: 3, my: 1 }}>
                <Skeleton variant="rectangular" width={210} height={118} />


                <Box sx={{ pt: 0.5 }}>
                    <Skeleton />
                    <Skeleton width="60%" />
                </Box>
            </Box>
        ) : (
            <Link key={_id} to={`/watch/${_id}`} style={{ textDecoration: 'none', color: "black" }}  >
                <Box sx={{ width: isMobile ? '100%' : 210, marginRight: 3, my: 1 }}>
                    <img
                        style={{ width: '100%', height: isMobile ? 'auto' : 118 }}
                        alt={title}
                        src={thumbnailUrl}
                    />

                    <Box sx={{ pr: 2 }}>
                        <Typography gutterBottom variant="body1">
                            {title}
                        </Typography>
                        <Typography display="block" variant="caption" color="text.secondary">
                            {"Queen Official"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {`${"40M"} • ${createdAt}`}
                        </Typography>
                    </Box>
                </Box>
            </Link>)
    );
}

export default VideoGridItem;