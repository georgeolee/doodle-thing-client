import { Swatch } from "./Swatch/Swatch";
import { useState } from "react";


import { useDispatch } from 'react-redux'
import { setColor } from "../../app/state/drawingSettings/drawingSettingsSlice";


import './colorpicker.css'

export function ColorPicker(props){

    const dispatch = useDispatch()


    const {
        colors,
        initialColor
    } = props

    //currently selected swatch
    const [selected, setSelected] = useState(initialColor)
    
    const swatches = colors.map((color, i) => {
        return <Swatch 
                    key={`swatch${i}`} 
                    color={color} 
                    selected={i === selected}
                    onColorPick={col => {

                        dispatch(setColor(col));

                        setSelected(i)
                    }}/>
    })
    return(
        <div className="colorpicker">
            {swatches}
        </div>
    )
}