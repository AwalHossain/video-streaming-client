import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    filter: 'all',
    search: '',
    sort: 'desc',
}


const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setFilter: (state, action) => {
            state.filter = action.payload
        },
        setSearchFilter: (state, action) => {
            state.search = action.payload
        },
        setSortFilter: (state, action) => {
            state.sort = action.payload
        },
    }
})


export const { setFilter, setSearchFilter, setSortFilter } = filterSlice.actions;
export default filterSlice.reducer;