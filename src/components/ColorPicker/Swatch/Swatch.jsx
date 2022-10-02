import { useRef } from 'react'
import { useNoTouch } from '../../../hooks/useNoTouch'
import './swatch.css'
export function Swatch(props){
    const {
        color = '#000',
        onPointerDown,
        selected,
    } = props

    let className = selected ? 'swatch selected' : 'swatch'
    if(color === 'erase') className += ' eraser'

    const swatchRef = useRef()
    useNoTouch(swatchRef)

    return(
        <div
            ref={swatchRef}
            style={color === 'erase' ? {} : {backgroundColor: color}}
            className={className} 
            onPointerDown={() => {onPointerDown(color)}}></div>
    )
}