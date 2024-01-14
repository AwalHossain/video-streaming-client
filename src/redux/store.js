import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './features/api/apiSlice';
import authSliceReducer from './features/auth/authSlice';
import filterSliceReducer from './features/filter/filterSlice';
import socketSliceReducer from './features/socket/socketSlice';
import NotificationsReducer from './features/utils/notificationSlice';
import videoSliceReducer from './features/video/videoSlice';

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSliceReducer,
        socket: socketSliceReducer,
        videoData: videoSliceReducer,
        filter: filterSliceReducer,
        notification: NotificationsReducer,
    },
    // adding api middleware enables caching, invalidation, polling, and other features of `rtk-query`
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,

})

// setupListeners(store.dispatch)