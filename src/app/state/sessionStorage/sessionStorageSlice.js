import { createSlice } from "@reduxjs/toolkit";


/**
 * read and update session data
 * 
 * for initializing inputs on page reload, etc
 */

const KEY_SIZE_SLIDER_PROGRESS = 'sizeSliderProgress';
const KEY_COLOR_INDEX = 'colorIndex';
const KEY_USER_NAME = 'userName';
const KEY_USER_ID = 'userId';

const initialState = {
    sizeSliderProgress: sessionStorage.getItem(KEY_SIZE_SLIDER_PROGRESS),
    colorIndex: sessionStorage.getItem(KEY_COLOR_INDEX),
    
    userName: sessionStorage.getItem(KEY_USER_NAME),
    userId: sessionStorage.getItem(KEY_USER_ID),
}

//export starting values as numerical constants --> instead of selectors, for initializing inputs that shouldn't rerender on store update
export const SESSION_INITIAL_SIZE_SLIDER_PROGRESS = Number(initialState.sizeSliderProgress);
export const SESSION_INITIAL_COLOR_INDEX = Number(initialState.colorIndex);

export const SESSION_INITIAL_USER_NAME = initialState.userName;
export const SESSION_INITIAL_USER_ID = initialState.userId;

export const sessionStorageSlice = createSlice({
    name: 'sessionStorage',
    initialState,

    reducers: {
        updateSizeSliderProgress: (state, action) => {
            // state.sizeSliderProgress = action.payload; <- not updating state here bc storage updates shouldn't trigger rerender
            sessionStorage.setItem(KEY_SIZE_SLIDER_PROGRESS, String(action.payload));
        },

        updateColorIndex: (state, action) => {
            // state.colorIndex = action.payload;
            sessionStorage.setItem(KEY_COLOR_INDEX, String(action.payload));
        },

        updateUserName: (state, action) => {
            sessionStorage.setItem(KEY_USER_NAME, action.payload);
        },

        updateUserId: (state, action) => {
            sessionStorage.setItem(KEY_USER_ID, action.payload);
        }
    }
})

export const {
    updateSizeSliderProgress, 
    updateColorIndex,
    updateUserId,
    updateUserName
} = sessionStorageSlice.actions;

export default sessionStorageSlice.reducer;

