import { Stack } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useProgress } from '../../contexts/ProgressContext';
import { resetAllProcesses } from '../../redux/features/socket/socketSlice';
import ProgressModal from './ProgresModal';

const ProgressModals = () => {
    const { process } = useProgress();
    const socketConnected = useSelector(state => state.socket.isConnected);
    const wsResponse = useSelector(state => state.socket.wsResponse);
    const dispatch = useDispatch();
    
    // Force close all modals if video is published or socket disconnects
    useEffect(() => {
        if (!socketConnected || (wsResponse && wsResponse.name === "Video published")) {
            dispatch(resetAllProcesses(false));
        }
    }, [socketConnected, wsResponse, dispatch]);
    
    // If socket is disconnected, don't render anything
    if (!socketConnected) {
        return null;
    }

    return (
        <Stack
            direction="column"
            justifyContent="flex-end"
            alignItems="flex-end"
            spacing={2}
            sx={{
                position: "fixed",
                bottom: "20px",
                right: "5px",
                zIndex: 9999,
            }}
        >
            {/* Only render active processes with simple flatMap approach */}
            {Object.entries(process).flatMap(([fileName, processMap]) => 
                Object.entries(processMap).map(([name, data]) => 
                    data.status === 'uploading' || data.status === 'processing' ? (
                        <ProgressModal
                            key={`${fileName}-${name}`}
                            name={data.name}
                            fileName={data.fileName}
                            status={data.status}
                            progress={data.progress}
                        />
                    ) : null
                )
            ).filter(Boolean)}
        </Stack>
    );
};

export default ProgressModals;