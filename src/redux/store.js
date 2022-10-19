import { configureStore } from "@reduxjs/toolkit";
import drawingSettingsReducer from "./drawingSettings/drawingSettingsSlice";
import {default as canvasReducer} from "./canvas/canvasSlice";
import {default as sessionStorageReducer} from "./sessionStorage/sessionStorageSlice.js"
import {default as userReducer} from './user/userSlice.js'

export const store = configureStore({
    reducer: {
        drawingSettings: drawingSettingsReducer,
        canvas: canvasReducer,
        sessionStorage: sessionStorageReducer,
        user: userReducer,
    }
});

export const {dispatch} = store;