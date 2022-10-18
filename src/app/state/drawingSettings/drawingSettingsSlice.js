import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    color: '#000',
    lineWidth: 1,
    eraser: false,

}

//match 3/4/6/8 digit hex color string
const colorPattern = /^#(?:(?:[0-9|a-f]{3}){1,2}|(?:[0-9|a-f]{4}){1,2})$/i

export const drawingSettingsSlice = createSlice({
    
    name: 'drawingSettings',
    initialState,

    reducers: {
        setColor: (state, action) => {

            const col = action.payload;
            
            if(col.match(colorPattern)){
                state.color = col;
                state.eraser = false;
            }else{
                state.color = 'eraser';
                state.eraser = true;
            }            
        },

        setLineWidth: (state, action) => {
            state.lineWidth = action.payload;
        },

    }
})

export const {
    setColor, 
    setLineWidth, 

    setSessionSizeSliderProgress,
} = drawingSettingsSlice.actions;

export const selectColor = (state) => state.drawingSettings.color;
export const selectLineWidth = (state) => state.drawingSettings.lineWidth;
export const selectEraser = (state) => state.drawingSettings.eraser;


export default drawingSettingsSlice.reducer;