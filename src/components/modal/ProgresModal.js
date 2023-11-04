import { Box, CircularProgress } from '@mui/material';
import React from 'react';
import { useAppContext } from '../../contexts/context';

const ProgressModal = ({ name, progress }) => {

    const { socket } = useAppContext();

    React.useEffect(() => {
        if (progress === 100) {
            setTimeout(() => {
                socket.emit("getFiles");
            }, 1000);
        }
    }, [progress, socket]);

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                right: 0,
                margin: '1em',
                zIndex: 9999, // Ensure the modal is above other elements
                backgroundColor: "#252525",
                width: "400px",
                height: "auto   ",
                padding: "1em",
                color: "white",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <p>{name} is processing</p>
            <CircularProgress variant="determinate" value={progress}
                sx={{
                    color: '#ff0000', // Change the color of the progress bar
                    width: '100px !important', // Change the width of the progress bar
                    height: '100px !important', // Change the height of the progress bar
                }}
            />
        </Box>
    );
};

export default ProgressModal;