import { Box, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const RelatedItemList = ({ id, thumbnail, duration, title, author, views, date }) => {
    return (
        <Box sx={{ display: 'flex', gap: 2, mb: 4, width: '100%' }}>
            <Box
                sx={{
                    position: 'relative',
                    width: 168,
                    height: 94,
                    flex: 'none',
                    transition: 'transform 0.3s',
                    '&:hover': {
                        transform: 'scale(1.03)',
                    },
                }}
            >
                <Link to={`videos/${id}`} >
                    <img src={"https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/storyboard.jpg"} alt="Some video title"
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
                        fontSize: '0.75rem',
                        px: 1,
                    }}
                >
                    {"10:34"}
                </Typography>
            </Box>

            <Box sx={{ flex: '1 1 auto' }}>
                <Link to={`videos/${id}`} component={Link}>
                    <Typography variant="body2" fontWeight="bold">
                        {"Some video title"}
                    </Typography>
                </Link>
                <Link to={`videos/${id}`} component={Link} sx={{ color: 'text.secondary', mt: 2, '&:hover': { color: 'text.primary' } }}>
                    <Typography variant="body2">
                        {"author"}
                    </Typography>
                </Link>
                <Typography variant="body2" color="text.secondary" mt={1}>
                    {"40M"}. {"10hours ago"}
                </Typography>
            </Box>
        </Box>
    );
};

export default RelatedItemList;