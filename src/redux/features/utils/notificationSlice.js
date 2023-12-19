import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
    name: 'error',
    initialState: { message: null, severity: null },
    reducers: {
        setMessage: (state, action) => {
            state.message = action.payload.message;
            state.severity = action.payload.severity;
        },
        clearError: (state) => {
            state.message = null;
            state.severity = null;
        },
    },
});

export const { setMessage, clearError } = notificationSlice.actions;

export default notificationSlice.reducer;