import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    wsResponse: null,
    process: {}, // Store processes keyed by fileName, then by process name
    resetProcess: false,
    isConnected: false
}

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        setWsResponse: (state, action) => {
            console.log(action.payload, 'setWsResponse'); // Keep logging minimal unless debugging this specifically
            state.wsResponse = action.payload;
        },
        setProcess: (state, action) => {
            const { fileName, name, ...rest } = action.payload || {};
            // console.log('Socket setProcess Action:', action.payload); // Log received socket payload

            if (!fileName || !name) {
                console.warn("Socket setProcess: Received invalid payload without fileName or name", action.payload);
                return; // Ignore updates without necessary keys
            }

            // Ensure the structure exists
            if (!state.process[fileName]) {
                state.process[fileName] = {};
            }

            // Update or add the specific process step
            state.process[fileName][name] = {
                fileName, // Ensure these keys are part of the object
                name,
                ...rest // Spread the rest of the payload (status, progress, etc.)
            };

             // Handle 'completed' or 'failed' status from socket to potentially remove items later
             if (rest.status === 'completed' || rest.status === 'failed' || rest.status === 'finished') {
                 // Optionally remove completed/failed items after a delay?
                 // Or rely on the 'finished' status from the handleUploadProgress hook + ProgressContext reducer
                 // For now, just update the status. Cleanup logic might be better centralized in ProgressContext.
                 console.log(`Socket setProcess: Process ${fileName}/${name} marked as ${rest.status}`);
             }
        },
        // Reducer to specifically remove a process step, perhaps triggered by 'finished' status
        removeProcessItem: (state, action) => {
            const { fileName, name } = action.payload || {};
             if (state.process[fileName] && state.process[fileName][name]) {
                delete state.process[fileName][name];
                if (Object.keys(state.process[fileName]).length === 0) {
                    delete state.process[fileName];
                }
                console.log(`Socket removeProcessItem: Removed ${fileName}/${name}`);
            }
        },
        resetAllProcesses: (state, action) => { // Renamed for clarity
            state.process = {};
            state.resetProcess = action.payload; // Keep this if needed for global reset
            console.log('Socket resetAllProcesses: State reset, resetProcess flag:', action.payload);
        },
        setConnected: (state, action) => {
            // console.log('Socket setConnected:', action.payload);
            state.isConnected = action.payload;
        }
    }
})

// Ensure exported actions match the reducer names
export const { setWsResponse, setProcess, removeProcessItem, resetAllProcesses, setConnected } = socketSlice.actions;

export default socketSlice.reducer;