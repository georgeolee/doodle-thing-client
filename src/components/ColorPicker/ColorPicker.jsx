import { Swatch } from "./Swatch/Swatch";
import { useState } from "react";

import './colorpicker.css'

export function ColorPicker(props){

    const [selected, setSelected] = useState(0)

    const {
        colors,
        onColorPick,
    } = props

    const swatches = colors.map((color, i) => {
        return <Swatch 
                    key={`swatch${i}`} 
                    color={color} 
                    selected={i === selected}
                    onPointerDown={col => {
                        onColorPick(col)
                        setSelected(i)
                    }}/>
    })
    return(
        <div className="colorpicker">
            {swatches}
        </div>
    )
}