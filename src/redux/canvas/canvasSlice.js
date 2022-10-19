import { createSlice } from "@reduxjs/toolkit";

const KEY_PREFER_LOW_RES = 'preferNativePixelRatio';

const initialState = {
    status: 'loading',

    preferNativePixelRatio: sessionStorage.getItem(KEY_PREFER_LOW_RES) !== 'false',
}

export const canvasSlice = createSlice({
    name: 'canvas',
    initialState: initialState,

    reducers: {
        setStatus: (state, action) => {
            state.status = action.payload;
        },

        setPreferNativePixelRatio: (state, action) => {
            state.preferNativePixelRatio = action.payload;
            sessionStorage.setItem(KEY_PREFER_LOW_RES, String(!!action.payload))
        }

    },
});

export const {
    setStatus, 
    setPreferNativePixelRatio
} = canvasSlice.actions;

//GAAAAAAAAHHHHHHHH
//AAAAAAAHHHHHH

//SO

//selectors use *global* state -> state.[slice name].[property]

//reducers do not -> state.[property] = action.payload

export const selectStatus = (state) => state.canvas.status;
export const selectIsReady = (state) => state.canvas.status === 'ready';
export const selectPreferNativePixelRatio = (state) => state.canvas.preferNativePixelRatio;
export default canvasSlice.reducer;