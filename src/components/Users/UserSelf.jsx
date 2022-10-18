import { User } from './User'
import style from './user.module.css'

import { useSelector } from 'react-redux'

import { 
    selectOwnStatus,     
    selectOwnName 
} from '../../app/state/user/userSlice'

import {
    selectColor
} from '../../app/state/drawingSettings/drawingSettingsSlice'

export function UserSelf(){

    const name = useSelector(selectOwnName)
    const color = useSelector(selectColor)
    const status = useSelector(selectOwnStatus)

    // return <User {...{name,status,color}} className={style.self}/>
    return (<>
    <input type='text' onInput={e => {
        const nametag = e.target.nextElementSibling.children[0];
        nametag.textContent = e.target.value;
    }}/>
    <User {...{name,status,color}} className={style.self}/>
    </>)
    
}