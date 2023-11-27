import { apiSlice } from "../api/apiSlice";

export const videoApi = apiSlice.injectEndpoints(
    {
        endpoints: (builder) => ({
            getVideoMetaData: builder.query({
                query: (id) => ({
                    url: `$/videos/${id}}`,
                    method: "GET",
                }),
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
        }),
    }
);

export const { useGetVideoMetaDataQuery } = videoApi;