import { createSlice } from "@reduxjs/toolkit"



const initialState = {
    user: undefined,
}



const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userLoggedIn: (state, action) => {
            state.user = action.payload
        },
        userLoggedOut: (state) => {
            state.user = undefined
        }
    }
})


export const { userLoggedIn, userLoggedOut } = authSlice.actions

export default authSlice.reducer