import { Close as CloseIcon } from '@mui/icons-material';
import { Box, IconButton, LinearProgress, Typography } from '@mui/material';
import Draggable from 'react-draggable';
import { useDispatch } from 'react-redux';
import { useProgress } from '../../contexts/ProgressContext';
import { removeProcessItem } from '../../redux/features/socket/socketSlice';

function ProgressModal({ name, status, progress, fileName }) {
    const { dispatch: progressDispatch } = useProgress();
    const reduxDispatch = useDispatch();
    
    // Function to close this specific modal
    const handleClose = () => {
        progressDispatch({ 
            type: "REMOVE_PROCESS_ITEM", 
            payload: { fileName, name } 
        });
        
        reduxDispatch(removeProcessItem({ 
            fileName, 
            name 
        }));
    };

    return (
        <Draggable>
            <div style={{ cursor: 'move' }}>
                <Box
                    sx={{
                        zIndex: 9999,
                        backgroundColor: "#252525",
                        width: "400px",
                        height: "auto",
                        padding: "10px",
                        color: "white",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative"
                    }}
                >
                    {/* Add a close button */}
                    <IconButton 
                        size="small"
                        onClick={handleClose}
                        sx={{ 
                            position: 'absolute', 
                            top: 5, 
                            right: 5,
                            color: 'white'
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                    
                    <Typography variant="subtitle1" fontSize={"12px"} component="p" color="text.secondary">
                        {`${name} is processing...`}
                    </Typography>
                    <Typography variant="subtitle2" component="p" fontSize={"10px"} color="text.secondary">
                        {`${fileName}`}
                    </Typography>
                    <Box sx={{ width: '100%', marginTop: '10px' }}>
                        <LinearProgress variant="determinate" value={progress || 0} />
                    </Box>
                    <Typography variant="caption" component="div" color="text.secondary">
                        {progress ? `${Math.round(progress)}%` : 'Uploading...'}
                    </Typography>
                </Box>
            </div>
        </Draggable>
    );
}

export default ProgressModal;