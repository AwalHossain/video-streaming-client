import { apiSlice } from "../api/apiSlice";
import { setSingleVideo, setVideoData } from "./videoSlice";

export const videoApi = apiSlice.injectEndpoints(
    {
        endpoints: (builder) => ({
            getVideoMetaData: builder.query({
                query: (id) => ({
                    url: `/videos/${id}`,
                    method: "GET",
                }),
                providesTags: ['Video'],
                async onQueryStarted(arg, {
                    queryFulfilled,
                    dispatch
                }) {
                    try {
                        const response = await queryFulfilled;
                        console.log(response, 'response from getVideoMetaData');
                    }
                    catch (err) {
                        console.log(err, 'err from getVideoMetaData');
                    }
                }
            }),
            updateVideoMetaData: builder.mutation({
                query: ({ id }) => {
                    console.log(id, 'id from updateVideoMetaData');
                    return {
                        url: `/videos/update/${id}`,
                        method: "PUT",
                        body: { "formData": "title", }
                    }
                },
                invalidatesTags: ['Video'],
            }),
            getAllVideos: builder.query({
                query: ({ searchTerm, tags, page, pageSize, sortBy, sortOrder }) => {
                    let queryString = '';
                    if (searchTerm) queryString += `searchTerm=${searchTerm}&`;
                    if (tags) tags.forEach((tag) => queryString += `tags=${tag}&`);
                    if (page) queryString += `page=${page}&`;
                    if (pageSize) queryString += `limit=${pageSize}&`;
                    if (sortBy) queryString += `sortBy=${sortBy}&`;
                    if (sortOrder) queryString += `sortOrder=${sortOrder}&`;

                    // Remove the trailing '&'
                    queryString = queryString.slice(0, -1);
                    console.log(queryString, 'queryString from getAllVideos');
                    return {
                        url: `/videos?${queryString.toString()}`,
                        method: "GET",
                    }
                },
                providesTags: ['Video'],
                async onQueryStarted(arg, {
                    dispatch,
                    queryFulfilled,
                }) {
                    try {
                        const response = await queryFulfilled;
                        console.log(response, 'response from getAllVideos');
                        dispatch(
                            setVideoData(response.data)
                        )
                    } catch (err) {

                    }
                }
            }),
            getVideoById: builder.query({
                query: (id) => ({
                    url: `/videos/${id}`,
                    method: "GET",
                }),
                providesTags: ['Video'],
                async onQueryStarted(arg, {
                    dispatch,
                    queryFulfilled,
                }) {
                    try {
                        const response = await queryFulfilled;
                        console.log(response, 'response from getVideoById');
                        dispatch(
                            setSingleVideo(response.data)
                        )
                    } catch (err) {

                    }
                }
            }),
            getAllTags: builder.query({
                query: () => ({
                    url: `/tags`,
                    method: "GET",
                }),
                providesTags: ['Tag'],
            }),
        }),
    }
);

export const { useGetVideoMetaDataQuery, useUpdateVideoMetaDataMutation, useGetAllVideosQuery, useGetVideoByIdQuery,
    useGetAllTagsQuery
} = videoApi;