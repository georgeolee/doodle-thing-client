import { createSlice } from "@reduxjs/toolkit";


/**
 * read and update session data
 * 
 * for initializing inputs on page reload, etc
 */

const KEY_SIZE_SLIDER_PROGRESS = 'sizeSliderProgress';
const KEY_COLOR_INDEX = 'colorIndex';

const initialState = {
    sizeSliderProgress: sessionStorage.getItem(KEY_SIZE_SLIDER_PROGRESS),
    colorIndex: sessionStorage.getItem(KEY_COLOR_INDEX),
}

//export starting values as numerical constants --- for initializing inputs that shouldn't rerender on store update
export const SESSION_INITIAL_SIZE_SLIDER_PROGRESS = Number(initialState.sizeSliderProgress);
export const SESSION_INITIAL_COLOR_INDEX = Number(initialState.colorIndex);


export const sessionStorageSlice = createSlice({
    name: 'sessionStorage',
    initialState,

    reducers: {
        updateSizeSliderProgress: (state, action) => {
            // state.sizeSliderProgress = action.payload;
            sessionStorage.setItem(KEY_SIZE_SLIDER_PROGRESS, String(action.payload));
        },

        updateColorIndex: (state, action) => {
            // state.colorIndex = action.payload;
            sessionStorage.setItem(KEY_COLOR_INDEX, String(action.payload));
        }
    }
})

export const {updateSizeSliderProgress, updateColorIndex} = sessionStorageSlice.actions;

export default sessionStorageSlice.reducer;

