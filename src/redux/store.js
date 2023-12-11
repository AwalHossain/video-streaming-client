import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './features/api/apiSlice';
import authSliceReducer from './features/auth/authSlice';
import filterSliceReducer from './features/filter/filterSlice';
import socketSliceReducer from './features/socket/socketSlice';
import videoSliceReducer from './features/video/videoSlice';

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSliceReducer,
        socket: socketSliceReducer,
        videoData: videoSliceReducer,
        filter: filterSliceReducer,

    },
    // adding api middleware enables caching, invalidation, polling, and other features of `rtk-query`
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',

})

// setupListeners(store.dispatch)