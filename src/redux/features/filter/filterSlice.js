import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    filter: 'all',
    search: '',
    sort: 'desc',
    tags: [],
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
        tagSelected: (state, action) => {
            state.tags.push(action.payload);
        },
        tagRemoved: (state, action) => {
            state.tags = state.tags.filter((tag) => tag !== action.payload);
        },
    }
})


export const { setFilter, setSearchFilter, setSortFilter, tagSelected, tagRemoved } = filterSlice.actions;
export default filterSlice.reducer;