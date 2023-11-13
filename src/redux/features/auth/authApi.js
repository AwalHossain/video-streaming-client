import { apiSlice } from "../api/apiSlice";
import { userLoggedIn } from "./authSlice";


export const authApi = apiSlice.injectEndpoints(
    {
        endpoints: (builder) => ({
            register: builder.mutation({
                query: (data) => ({
                    url: "/auth/signup",
                    method: "POST",
                    body: data
                }),

                async onQueryStarted(arg, {
                    queryFulfilled,
                    dispatch
                }) {
                    try {
                        const response = await queryFulfilled;
                        console.log(response);

                        dispatch(
                            userLoggedIn({
                                user: response.data.user
                            })
                        )
                    } catch (err) {

                    }
                }
            }),
            login: builder.mutation({
                query: (data) => ({
                    url: "/auth/login",
                    method: "POST",
                    body: data
                }),
                async onQueryStarted(arg, {
                    queryFulfilled,
                    dispatch
                }) {
                    try {
                        const response = await queryFulfilled;
                        console.log(response);

                        dispatch(
                            userLoggedIn({
                                user: response.data.user
                            })
                        )
                    } catch (err) {

                    }
                }
            }),
            checkSession: builder.query({
                query: (data) => ({
                    url: "/auth/check-session",
                    method: "GET",
                    credentials: 'include'
                }),
                async onQueryStarted(arg, {
                    queryFulfilled,
                    dispatch
                }) {
                    try {
                        const response = await queryFulfilled;
                        console.log(response);

                        dispatch(
                            userLoggedIn({
                                user: response.data.user
                            })
                        )
                    } catch (err) {

                    }
                }
            })
        })
    }
)


export const {
    useLoginMutation,
    useRegisterMutation,
    useCheckSessionQuery,

} = authApi