import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    errorReporting: localStorage.getItem('enableErrorReporting') !== 'false'
}

export const preferencesSlice = createSlice({
    name: "preferences",
    initialState,

    reducers: {
        enableErrorReporting: (state, action) => {
            state.errorReporting = !!action.payload;
            localStorage.setItem('enableErrorReporting', String(state.errorReporting))
        }
    }
})

export const {enableErrorReporting} = preferencesSlice.actions;

export const selectErrorReporting = (state) => !!state.preferences.errorReporting;

export default preferencesSlice.reducer;