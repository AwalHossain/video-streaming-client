import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '../../../helpers/axios/axiosBaseQuery'

console.log(process.env.REACT_APP_API_URL, 'check')
export const apiSlice = createApi({
    name: 'api',
    reducerPath: 'api',
    baseQuery: axiosBaseQuery({
        baseUrl: process.env.REACT_APP_API_URL
    }),
    endpoints: (builder) => ({}),
    tagTypes: []
})