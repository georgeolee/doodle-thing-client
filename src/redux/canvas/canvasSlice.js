import { createSlice } from "@reduxjs/toolkit";

const KEY_PREFER_LOW_RES = 'preferNativePixelRatio';

const initialState = {
    status: 'loading',

    preferNativePixelRatio: localStorage.getItem(KEY_PREFER_LOW_RES) !== 'false',

    bufferedInput: []
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
            localStorage.setItem(KEY_PREFER_LOW_RES, String(!!action.payload))
        },

        bufferInput: (state, action) => {
            const arr = Array.isArray(action.payload) ? action.payload : [action.payload];
            state.bufferedInput.push(...arr)
        },

        clearInputBuffer: (state) => {
            state.bufferedInput = []
        }

    },
});

export const {
    setStatus, 
    setPreferNativePixelRatio,

    bufferInput,
    clearInputBuffer,

} = canvasSlice.actions;

//GAAAAAAAAHHHHHHHH
//AAAAAAAHHHHHH

//SO

//selectors use *global* state -> state.[slice name].[property]

//reducers do not -> state.[property] = action.payload

export const selectStatus = (state) => state.canvas.status;
export const selectIsReady = (state) => state.canvas.status === 'ready';
export const selectPreferNativePixelRatio = (state) => state.canvas.preferNativePixelRatio;

export const selectBufferedInput = (state) => [...state.canvas.bufferedInput];

export default canvasSlice.reducer;