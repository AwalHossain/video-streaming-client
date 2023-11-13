import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './features/api/apiSlice'
import authSliceReducer from './features/auth/authSlice'

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSliceReducer

    },
    // adding api middleware enables caching, invalidation, polling, and other features of `rtk-query`
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',

})

// setupListeners(store.dispatch)