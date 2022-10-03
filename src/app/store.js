import { configureStore } from "@reduxjs/toolkit";
import drawingSettingsReducer from "./state/drawingSettings/drawingSettingsSlice";

export const store = configureStore({
    reducer: {
        drawingSettings: drawingSettingsReducer,
    }
});