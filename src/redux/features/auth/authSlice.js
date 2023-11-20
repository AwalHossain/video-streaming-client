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
            console.log('State before userLoggedIn:', state);
            console.log('Action for userLoggedIn:', action);
            state.user = action.payload.user;
            state.userLoggedIn = action.payload.userLoggedIn;
            console.log('State after userLoggedIn:', state);
        },
        userLoggedOut: (state) => {
            console.log('State before userLoggedOut:', state);
            state.user = undefined;
            state.userLoggedIn = false
            console.log('State after userLoggedOut:', state);
        }
    }
})

export const { userLoggedIn, userLoggedOut } = authSlice.actions

export default authSlice.reducer