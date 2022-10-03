import { useEffect } from 'react'
import { useRef } from 'react'
import { useNoTouch } from '../../../hooks/useNoTouch'
import './swatch.css'




export function Swatch(props){
    const {
        color = '#000',
        onColorPick,
        selected,
    } = props

    let className = selected ? 'swatch selected' : 'swatch'

    if(color === 'erase') className += ' eraser'

    const swatchRef = useRef()
    useNoTouch(swatchRef)

    //initialize color selection -> first render only
    useEffect(()=>{
        if(selected) onColorPick(color)
        //eslint-disable-next-line
    },[])

    return(
        <div
            ref={swatchRef}
            style={color === 'erase' ? {} : {backgroundColor: color}}
            className={className} 
            onPointerDown={() => {if(!selected) onColorPick(color)}}></div> 
    )
}