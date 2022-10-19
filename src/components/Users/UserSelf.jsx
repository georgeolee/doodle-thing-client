import { User } from './User'
import style from './user.module.css'

import { useSelector } from 'react-redux'

import { 
    selectOwnStatus,     
    selectOwnName 
} from '../../redux/user/userSlice'

import {
    selectColor
} from '../../redux/drawingSettings/drawingSettingsSlice'

export function UserSelf(){

    const name = useSelector(selectOwnName)
    const color = useSelector(selectColor)
    const status = useSelector(selectOwnStatus)

    return <User {...{name,status,color}} className={style.self + 'user-name'}/>    
}