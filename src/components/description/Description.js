import { Box, Typography } from '@mui/material';

export default function Description({ video }) {
    const { title, description, date } = video;
    return (
        <Box>
            <Typography
                variant="h6"
                style={{
                    fontWeight: 'bold',
                    letterSpacing: 'tight',
                    color: '#2d3748',
                }}
            >
                {title}
            </Typography>
            <Box
                style={{
                    paddingBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #e2e8f0',
                }}
            >
                This is description
            </Box>
        </Box>
    );
}