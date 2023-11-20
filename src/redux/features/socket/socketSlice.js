import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    wsResponse: null,
    process: {},

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
            state.process = {
                "action.type": "RESET_PROCESS"
            }
        }
    }
})


export const { setWsResponse, setProcess, resetProcess } = socketSlice.actions


export default socketSlice.reducer