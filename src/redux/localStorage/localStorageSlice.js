import { createSlice } from "@reduxjs/toolkit";


/**
 * read and update LOCAL data
 * 
 * for initializing inputs on page reload, etc
 */

const KEY_SIZE_SLIDER_PROGRESS = 'sizeSliderProgress';
const KEY_COLOR_INDEX = 'colorIndex';
const KEY_USER_NAME = 'userName';
const KEY_USER_ID = 'userId';

const initialState = {
    sizeSliderProgress: localStorage.getItem(KEY_SIZE_SLIDER_PROGRESS),
    colorIndex: localStorage.getItem(KEY_COLOR_INDEX),
    
    userName: localStorage.getItem(KEY_USER_NAME),
    userId: localStorage.getItem(KEY_USER_ID),
}

//export starting values as numerical constants --> instead of selectors, for initializing inputs that shouldn't rerender on store update
export const LOCAL_INITIAL_SIZE_SLIDER_PROGRESS = Number(initialState.sizeSliderProgress);
export const LOCAL_INITIAL_COLOR_INDEX = Number(initialState.colorIndex);

export const LOCAL_INITIAL_USER_NAME = initialState.userName;
export const LOCAL_INITIAL_USER_ID = initialState.userId;

export const localStorageSlice = createSlice({
    name: 'localStorage',
    initialState,

    reducers: {
        updateSizeSliderProgress: (state, action) => {
            // state.sizeSliderProgress = action.payload; <- not updating state here bc storage updates shouldn't trigger rerender
            localStorage.setItem(KEY_SIZE_SLIDER_PROGRESS, String(action.payload));
        },

        updateColorIndex: (state, action) => {
            // state.colorIndex = action.payload;
            localStorage.setItem(KEY_COLOR_INDEX, String(action.payload));
        },

        updateUserName: (state, action) => {
            localStorage.setItem(KEY_USER_NAME, action.payload);
        },

        updateUserId: (state, action) => {
            localStorage.setItem(KEY_USER_ID, action.payload);
        }
    }
})

export const {
    updateSizeSliderProgress, 
    updateColorIndex,
    updateUserId,
    updateUserName
} = localStorageSlice.actions;

export default localStorageSlice.reducer;

