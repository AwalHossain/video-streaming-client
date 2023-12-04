import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    videoMetadata: {
        visibility: '',
        thumbnailUrl: '',
        language: '',
        recordingDate: new Date().toISOString().split('T')[0],
        category: '',
        videoFile: '',
    },
    videos: [],
    video: {},
}


export const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
        setVideoMetaData: (state, action) => {
            console.log(action.payload, 'action.payload from videoSlice');
            state.videoMetadata = action.payload;

        },
        resetVideoData: (state) => {
            state.videoMetadata = initialState.videoMetadata;
        },
        setVideoData: (state, action) => {
            state
                .state.videos = action.payload;
        },
        resetVideoMetaData: (state) => {
            state.videoMetadata = initialState.videoMetadata;
        },
        setSingleVideo: (state, action) => {
            state.video = action.payload;
        },
    },
});


export const { setVideoMetaData, resetVideoData, setVideoData, resetVideoMetaData, setSingleVideo } = videoSlice.actions;

export default videoSlice.reducer;