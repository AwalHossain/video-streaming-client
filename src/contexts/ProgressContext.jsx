import { createContext, useContext, useEffect, useReducer } from 'react';
import { useDispatch as useReduxDispatch, useSelector } from 'react-redux';
import { progressEmitter } from '../components/upload/handleUplodadProgress';
import { removeProcessItem as removeProcessItemFromSocket, resetAllProcesses } from '../redux/features/socket/socketSlice';


const ProgressContext = createContext({
    process: {},
    dispatch: () => { }
});

const processReducer = (state, action) => {
    switch (action.type) {
        case "SET_PROCESS": {
            const { fileName, name, status, ...rest } = action.payload || {};
            if (!fileName || !name) return state;

            if (status === 'finished' || status === 'completed' || status === 'failed') {
                console.log(`CONTEXT REDUCER: Removing completed/failed item ${fileName}/${name}`);
                return processReducer(state, { type: "REMOVE_PROCESS_ITEM", payload: { fileName, name } });
            }
            return {
                ...state,
                [fileName]: {
                    ...state[fileName],
                    [name]: { fileName, name, status, ...rest },
                },
            };
        }
        case "RESET_ALL_CONTEXT_PROCESSES":
            console.log("CONTEXT REDUCER: Resetting all processes");
            return {};
        case "REMOVE_PROCESS_ITEM": {
            const { fileName: fileToRemove, name: nameToRemove } = action.payload || {};
            if (!state[fileToRemove] || !state[fileToRemove][nameToRemove]) return state;

            const updatedFileProcess = { ...state[fileToRemove] };
            delete updatedFileProcess[nameToRemove];

            if (Object.keys(updatedFileProcess).length === 0) {
                const updatedState = { ...state };
                delete updatedState[fileToRemove];
                return updatedState;
            } else {
                return {
                    ...state,
                    [fileToRemove]: updatedFileProcess,
                };
            }
        }
        default:
            return state;
    }
};

export const ProgressProvider = ({ children }) => {
    const [process, dispatch] = useReducer(processReducer, {});
    const dataProcess = useSelector((state) => state.socket.process);
    const socketConnected = useSelector((state) => state.socket.isConnected);
    const wsResponse = useSelector((state) => state.socket.wsResponse);
    const reduxDispatch = useReduxDispatch();

    // Handle socket disconnection - clear all progress bars
    useEffect(() => {
        if (socketConnected === false) {
            console.log("Socket disconnected - clearing all progress bars");
            dispatch({ type: "RESET_ALL_CONTEXT_PROCESSES" });
        }
    }, [socketConnected]);

    // Listen for NOTIFY_VIDEO_PUBLISHED event to close progress bars
    useEffect(() => {
        // Check for video published event - "name" is the key to watch based on your actual data
        if (wsResponse && wsResponse.name === "Video published") {
            console.log("Video published - forcefully clearing ALL progress bars");
            
            // Just reset everything - much simpler approach
            dispatch({ type: "RESET_ALL_CONTEXT_PROCESSES" });
            
            // For Redux consistency, could dispatch an action to reset the socket process state too
            // This assumes you have a resetAllProcesses action in socketSlice
            reduxDispatch(resetAllProcesses(false));
        }
    }, [wsResponse, reduxDispatch]);  // Remove process from dependencies since we're not using it

    useEffect(() => {
        const handleProgress = (data) => {
            if (data.status === 'finished' || data.status === 'completed' || data.status === 'failed') {
                dispatch({ type: "REMOVE_PROCESS_ITEM", payload: data });
                reduxDispatch(removeProcessItemFromSocket({ fileName: data.fileName, name: data.name }));
            } else {
                dispatch({ type: "SET_PROCESS", payload: data });
            }
        };

        progressEmitter.on('progress', handleProgress);

        return () => {
            progressEmitter.off('progress', handleProgress);
        };
    }, [reduxDispatch]);

    // Add a cleanup mechanism for stale progress bars (optional)
    useEffect(() => {
        // Cleanup function to remove any progress bars that have been stuck for too long
        const cleanupStaleProgressBars = () => {
            const now = Date.now();
            const staleThreshold = 5 * 60 * 1000; // 5 minutes
            
            Object.entries(process).forEach(([fileName, fileProcesses]) => {
                Object.entries(fileProcesses).forEach(([processName, processData]) => {
                    // If the process has a lastUpdated timestamp and it's older than the threshold
                    if (processData.lastUpdated && (now - processData.lastUpdated > staleThreshold)) {
                        console.log(`Removing stale progress bar: ${fileName}/${processName}`);
                        dispatch({ 
                            type: "REMOVE_PROCESS_ITEM", 
                            payload: { fileName, name: processName } 
                        });
                        reduxDispatch(removeProcessItemFromSocket({ 
                            fileName, 
                            name: processName 
                        }));
                    }
                });
            });
        };

        // Run cleanup every minute
        const cleanupInterval = setInterval(cleanupStaleProgressBars, 60000);
        
        return () => clearInterval(cleanupInterval);
    }, [process, reduxDispatch]);

    // Sync with Redux socket process data
    useEffect(() => {
        if (dataProcess) {
            Object.values(dataProcess).forEach(fileProcesses => {
                Object.values(fileProcesses).forEach(proc => {
                    // Add a timestamp to track when this process was last updated
                    dispatch({ 
                        type: "SET_PROCESS", 
                        payload: { ...proc, lastUpdated: Date.now() } 
                    });
                });
            });
        }
    }, [dataProcess]);

    return (
        <ProgressContext.Provider value={{ process, dispatch }}>
            {children}
        </ProgressContext.Provider>
    );
};

export const useProgress = () => useContext(ProgressContext);