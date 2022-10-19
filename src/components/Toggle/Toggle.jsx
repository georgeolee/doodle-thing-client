import style from './toggle.module.css'

export function Toggle(props){

    const className = style.checkbox + (props.className ? ' ' + props.className : '')

    return (
        <input 
            type="checkbox" 
            {...{...props, className}}
            onPointerDown={e => e.currentTarget.checked = !e.currentTarget.checked}
            onClick={e => e.preventDefault()}            
            />
    )
}