import { configureStore } from "@reduxjs/toolkit";
import drawingSettingsReducer from "./state/drawingSettings/drawingSettingsSlice";
import {default as canvasReducer} from "./state/canvas/canvasSlice";

export const store = configureStore({
    reducer: {
        drawingSettings: drawingSettingsReducer,
        canvas: canvasReducer,
    }
});