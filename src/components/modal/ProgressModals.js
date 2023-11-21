import { Stack } from '@mui/material';
import { useProgress } from '../../contexts/ProgressContext';
import ProgressModal from './ProgresModal';

const ProgressModals = () => {
    const { process } = useProgress();
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
            {Object.entries(process).map(([videoId, videoProcess]) =>
                Object.entries(videoProcess).map(
                    ([name, process]) =>
                        process.status === "processing" && (
                            <ProgressModal
                                key={`${videoId}-${name}`}
                                name={name}
                                fileName={process.fileName}
                                status={process.status}
                                progress={process.progress}
                            />
                        )
                )
            )}
        </Stack>
    );
};


export default ProgressModals;