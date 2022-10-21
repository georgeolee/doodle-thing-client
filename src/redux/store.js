import { configureStore } from "@reduxjs/toolkit";
import drawingSettingsReducer from "./drawingSettings/drawingSettingsSlice";
import {default as canvasReducer} from "./canvas/canvasSlice";
import {default as localStorageReducer} from "./localStorage/localStorageSlice.js"
import {default as userReducer} from './user/userSlice.js'
import {default as preferencesReducer} from './preferences/preferencesSlice.js'

export const store = configureStore({
    reducer: {
        drawingSettings: drawingSettingsReducer,
        canvas: canvasReducer,
        localStorage: localStorageReducer,
        user: userReducer,
        preferences: preferencesReducer,
    }
});

export const {dispatch} = store;