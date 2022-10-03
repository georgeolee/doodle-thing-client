import { Swatch } from "./Swatch/Swatch";
import { useState } from "react";


import { useDispatch } from 'react-redux'
import { setColor, setEraser } from "../../app/state/drawingSettings/drawingSettingsSlice";


import './colorpicker.css'

export function ColorPicker(props){

    const dispatch = useDispatch()


    const {
        colors,
        initialColor
    } = props

    //currently selected swatch
    const [selected, setSelected] = useState(initialColor)

    //match 3/4/6/8 digit hex color string
    const pattern = /^#(?:(?:[0-9|a-f]{3}){1,2}|(?:[0-9|a-f]{4}){1,2})$/i 


    const swatches = colors.map((color, i) => {
        return <Swatch 
                    key={`swatch${i}`} 
                    color={color} 
                    selected={i === selected}
                    onColorPick={col => {

                        console.log(col)

                        if(col.match(pattern)){
                            dispatch(setColor(col))
                            dispatch(setEraser(false))
                        }else{
                            dispatch(setColor(col))
                            dispatch(setEraser(true))
                        }

                        setSelected(i)
                    }}/>
    })
    return(
        <div className="colorpicker">
            {swatches}
        </div>
    )
}