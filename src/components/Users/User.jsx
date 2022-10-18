import style from './user.module.css'

export function User(props){
    const {
        name,
        status,
        color,

        className
    } = props;

    const isEraser = color === 'eraser';

    return (
        <div className={style.user + (className ? ' ' + className : '')} data-status={status}>
            <div className={style.name}>{name}</div>
            <div 
                style={isEraser ? {} : {backgroundColor:color}} 
                className={style.color + (isEraser ? ' ' + style.eraser : '')}
                />
            {/* <div className={style.status}>{status}</div> */}

        </div>
    )
}