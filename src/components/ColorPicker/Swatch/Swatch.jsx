import './swatch.css'
export function Swatch(props){
    const {
        color = '#000',
        onPointerDown,
        selected,
    } = props

    let className = selected ? 'swatch selected' : 'swatch'
    if(color === 'erase') className += ' eraser'

    return(
        <div
            style={color === 'erase' ? {} : {backgroundColor: color}}
            className={className} 
            onPointerDown={() => {onPointerDown(color)}}></div>
    )
}