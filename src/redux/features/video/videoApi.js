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
                    const query = new URLSearchParams();
                    if (searchTerm) query.append('searchTerm', searchTerm);
                    if (tags) query.append('tags', tags);
                    if (page) query.append('page', page);
                    if (pageSize) query.append('limit', pageSize);
                    if (sortBy) query.append('sortBy', sortBy);
                    if (sortOrder) query.append('sortOrder', sortOrder);
                    const queryString = query.toString() ? `${query.toString()}` : '';
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