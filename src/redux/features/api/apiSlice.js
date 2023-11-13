import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

console.log(process.env.REACT_APP_API_URL, 'check')
export const apiSlice = createApi({
    name: 'api',
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_URL,
        credentials: 'include'

    }),
    endpoints: (builder) => ({}),
    tagTypes: []
})