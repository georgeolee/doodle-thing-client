import { useSelector } from "react-redux"

import { 
    selectColor, 
    selectEraser,
    selectLineWidth
 } from "./redux/drawingSettings/drawingSettingsSlice"

export function DrawingSettings(){

    const color = useSelector(selectColor)
    const lineWidth = useSelector(selectLineWidth)
    const eraser = useSelector(selectEraser)

    return {
        color,
        lineWidth,
        eraser,
    }
}