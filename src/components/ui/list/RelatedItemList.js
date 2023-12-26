import { Box, Skeleton, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const RelatedItemList = ({ video = {}, index, isLoading, isFetching }) => {
    const { _id, thumbnailUrl, duration, title, author, views, date } = video;
    return (

        isLoading || isFetching ? (
            <Box key={index} sx={{ display: 'flex', gap: 2, mb: 4, width: '100%' }}>
                <Skeleton variant="rectangular" width={210} height={118} />


                <Box sx={{ pt: 0.5 }}>
                    <Skeleton />
                    <Skeleton width="60%" />
                </Box>
            </Box>
        ) : (
            <Box key={index} sx={{ display: 'flex', gap: 2, mb: 4, width: '100%' }}>
                <Box
                    sx={{
                        position: 'relative',
                        width: 200,
                        height: 100,
                        flex: 'none',
                        transition: 'transform 0.3s',
                        '&:hover': {
                            transform: 'scale(1.03)',
                        },
                    }}
                >
                    <Link to={`videos/${_id}`} >
                        <img src={thumbnailUrl} alt="Some video title"
                            style={{
                                objectFit: 'cover',
                                display: 'block',
                                width: '100%',
                                height: '100%'
                            }}
                        />
                    </Link>
                    <Typography
                        sx={{
                            position: 'absolute',
                            right: 2,
                            bottom: 2,
                            bgcolor: 'grey.900',
                            color: 'grey.100',
                            fontSize: '0.85rem',
                            px: 1,
                        }}
                    >
                        {"10:34"}
                    </Typography>
                </Box>

                <Box sx={{ flex: '1 1 auto' }}>
                    <Link to={`videos/${_id}`} component={Link}>
                        <Typography variant="body1" fontWeight="bold">
                            {title}
                        </Typography>
                    </Link>
                    <Link to={`videos/${_id}`} component={Link} sx={{ color: 'text.secondary', mt: 2, '&:hover': { color: 'text.primary' } }}>
                        <Typography variant="body2">
                            {"author"}
                        </Typography>
                    </Link>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                        {"40M"}. {"10hours ago"}
                    </Typography>
                </Box>
            </Box>
        )


    );
};

export default RelatedItemList;