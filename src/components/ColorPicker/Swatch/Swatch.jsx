import './swatch.css'
export function Swatch(props){
    const {
        color = '#000',
        onClick,
        selected,
        // key
    } = props

    return(
        <div 
            style={{
                backgroundColor: color
            }}
            className={selected ? 'swatch selected' : 'swatch'} 
            onClick={() => onClick(color)}></div>
    )
}