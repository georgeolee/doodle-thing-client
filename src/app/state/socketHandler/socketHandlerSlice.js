import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    socket: null,
    drawingDataHandler: null,
}

export const socketHandlerSlice = createSlice({
    name: 'socketHandler',
    
    
    reducers: {
        setDrawingDataHandler: (state, action) => {
            state.drawingDataHandler = action.payload;
        },

        
    },
});

//actions
export const {setDrawingDataHandler} = socketHandlerSlice.actions;

//selectors
export const selectDrawingDataHandler = (state) => state.drawingDataHandler;