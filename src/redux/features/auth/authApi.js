import { apiSlice } from "../api/apiSlice";
import { userLoggedIn } from "./authSlice";


export const authApi = apiSlice.injectEndpoints(
    {
        endpoints: (builder) => ({
            register: builder.mutation({
                query: (data) => ({
                    url: "/auth/signup",
                    method: "POST",
                    data
                }),

                async onQueryStarted(arg, {
                    queryFulfilled,
                    dispatch
                }) {
                    try {
                        const response = await queryFulfilled;
                        console.log(response);

                        dispatch(
                            userLoggedIn(response?.data)
                        )
                    } catch (err) {

                    }
                }
            }),
            login: builder.mutation({
                query: (data) => ({
                    url: "/auth/login",
                    method: "POST",
                    // contentType: "application/json",
                    data
                }),
                async onQueryStarted(arg, {
                    queryFulfilled,
                    dispatch
                }) {
                    try {
                        const response = await queryFulfilled;
                        console.log(response);

                        dispatch(
                            userLoggedIn(response?.data)
                        )
                    } catch (err) {

                    }
                }
            }),
            googleLogin: builder.query({
                query: () => ({
                    url: "/auth/google/callback",
                    method: "GET",
                }),
                async onQueryStarted(arg, {
                    queryFulfilled,
                    dispatch
                }) {
                    try {
                        const response = await queryFulfilled;
                        console.log(response);

                        dispatch(
                            userLoggedIn(response?.data)
                        )
                    } catch (err) {

                    }
                }
            }),
            checkSession: builder.query({
                query: (data) => ({
                    url: "/auth/check-session",
                    method: "GET",
                }),
                async onQueryStarted(arg, {
                    queryFulfilled,
                    dispatch
                }) {
                    try {
                        const response = await queryFulfilled;
                        console.log(response.data, 'checkSession');

                        dispatch(
                            userLoggedIn(response?.data)
                        )
                    } catch (err) {

                    }
                }
            }),
            logout: builder.mutation({
                query: () => ({
                    url: "/auth/logout",
                    method: "GET",
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
                                user: null
                            })
                        )
                    } catch (err) {

                    }
                }
            }),
        })
    }
)


export const {
    useLoginMutation,
    useRegisterMutation,
    useCheckSessionQuery,
    useGoogleLoginQuery,
    useLogoutMutation

} = authApi