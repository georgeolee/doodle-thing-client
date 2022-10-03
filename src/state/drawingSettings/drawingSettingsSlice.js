import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    color: '#000',
    lineWidth: 1,
    eraser: false,
}

export const drawingSettingsSlice = createSlice({
    
    name: 'drawingSettings',
    initialState,

    reducers: {
        setColor: (state, action) => {
            state.color = action.payload;
        },

        setLineWidth: (state, action) => {
            state.lineWidth = action.payload;
        },

        setEraser: (state, action) => {
            state.eraser = !!action.payload
        }
    }
})

export const {setColor, setLineWidth, setEraser} = drawingSettingsSlice.actions;

export const selectColor = (state) => state.drawingSettings.color;
export const selectLineWidth = (state) => state.drawingSettings.lineWidth;
export const selectEraser = (state) => state.drawingSettings.eraser;
export const selectSettings = (state) => {return {
    color: selectColor(state),
    lineWidth: selectLineWidth(state),
    eraser: setEraser(state),
}}

export default drawingSettingsSlice.reducer;