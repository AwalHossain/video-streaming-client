import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {
        name: '',
        email: '',
        picture: ''

    },
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userLoggedIn: (state, action) => {

            state.user = action.payload.user;
            state.userLoggedIn = action.payload.userLoggedIn;
        },
        userLoggedOut: (state) => {
            state.user = undefined;
            state.userLoggedIn = false
        }
    }
})

export const { userLoggedIn, userLoggedOut } = authSlice.actions

export default authSlice.reducer