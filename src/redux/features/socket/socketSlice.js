import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    wsResponse: null,
    process: {},
    resetProcess: false,
    isConnected: false

}


const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        setWsResponse: (state, action) => {
            console.log(action.payload, 'setProcess');
            state.wsResponse = action.payload
        },
        setProcess: (state, action) => {
            state.process = {
                ...action.payload,
                "action.type": "SET_PROCESS"
            }

        },
        resetProcess: (state, action) => {
            state.process = {}
            state.resetProcess = action.payload
        },
        setConnected: (state, action) => {
            state.isConnected = action.payload
        }
    }
})


export const { setWsResponse, setProcess, resetProcess, setConnected } = socketSlice.actions


export default socketSlice.reducer