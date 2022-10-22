import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    errorReporting: localStorage.getItem('enableErrorReporting') !== 'false',
    userNameTags: localStorage.getItem('showUserNameTags') === 'true',
}

export const preferencesSlice = createSlice({
    name: "preferences",
    initialState,

    reducers: {
        enableErrorReporting: (state, action) => {
            state.errorReporting = !!action.payload;
            localStorage.setItem('enableErrorReporting', String(state.errorReporting))
        },

        showUserNameTags: (state, action) => {
            state.userNameTags = !!action.payload;
            localStorage.setItem('showUserNameTags', String(state.userNameTags))
        }
    }
})

export const {
    enableErrorReporting,
    showUserNameTags
} = preferencesSlice.actions;

export const selectErrorReporting = (state) => !!state.preferences.errorReporting;
export const selectUserNameTags = (state) => !!state.preferences.userNameTags;

export default preferencesSlice.reducer;