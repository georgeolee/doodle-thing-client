import { Swatch } from "./Swatch/Swatch";
import { useState } from "react";


import { useDispatch } from 'react-redux'
import { setColor } from "../../redux/drawingSettings/drawingSettingsSlice";

import { 
    LOCAL_INITIAL_COLOR_INDEX,
    updateColorIndex,
 } from "../../redux/localStorage/localStorageSlice";

import './colorpicker.css'

export function ColorPicker(props){

    const dispatch = useDispatch()


    const {
        colors,
        initialColor
    } = props

    //currently selected swatch
    const [selected, setSelected] = useState(LOCAL_INITIAL_COLOR_INDEX  ?? initialColor)
    
    const swatches = colors.map((color, i) => {
        return <Swatch 
                    key={`swatch${i}`} 
                    color={color} 
                    selected={i === selected}
                    onColorPick={col => {

                        //set color
                        dispatch(setColor(col));

                        //dispatch to LOCAL slice
                        dispatch(updateColorIndex(i))

                        setSelected(i)
                    }}/>
    })
    return(
        <div className="colorpicker">
            {swatches}
        </div>
    )
}