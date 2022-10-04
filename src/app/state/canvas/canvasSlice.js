import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: 'loading',


}

export const canvasSlice = createSlice({
    name: 'canvas',
    initialState: initialState,

    reducers: {
        setStatus: (state, action) => {
            state.status = action.payload;
        },

    },
});

export const {setStatus} = canvasSlice.actions;

//GAAAAAAAAHHHHHHHH
//AAAAAAAHHHHHH

//SO

//selectors use *global* state -> state.[name].[property]

//reducers do not -> state.[property] = action.payload

export const selectStatus = (state) => state.canvas.status;
export const selectIsReady = (state) => state.canvas.status === 'ready';

export default canvasSlice.reducer;