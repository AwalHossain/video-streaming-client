import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: '',
    name: '',
    title: '',
    description: '',
    visibility: '',
    thumbnailUrl: '',
    language: '',
    recordingDate: new Date(),
    category: '',
    videoFile: '',
}


export const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
        setVideoData: (state, action) => {
            state.id = action.payload._id;
            state.title = action.payload.title;
            state.name = action.payload.name;
            state.description = action.payload.description;
            state.visibility = action.payload.visibility;
            state.language = action.payload.language;
            state.recordingDate = action.payload.recordingDate;
            state.category = action.payload.category;
        },
        resetVideoData: (state) => {
            state.id = '';
            state.title = '';
            state.description = '';
            state.visibility = '';
            state.thumbnailUrl = '';
            state.language = '';
            state.recordingDate = new Date();
            state.category = '';
            state.videoFile = '';
        },
    },
});


export const { setVideoData, resetVideoData } = videoSlice.actions;

export default videoSlice.reducer;