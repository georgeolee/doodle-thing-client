import {
    Form,
    redirect,
    useNavigate
} from 'react-router-dom'

import { 
    useSelector,
 } from "react-redux";



import {
    selectOwnName,
    setOwnName
} from '../../redux/user/userSlice'

import { selectPreferNativePixelRatio, setPreferNativePixelRatio } from '../../redux/canvas/canvasSlice';

import { updateUserName } from '../../redux/sessionStorage/sessionStorageSlice';

import { dispatch } from '../../redux/store';

import style from './settings.module.css'

import { Toggle } from '../../components/Toggle/Toggle';

export async function action({request}){

    try{
        const formData = await request.formData();
        const {name, preferNativePixelRatio} = Object.fromEntries(formData);

        if(name){
            dispatch(setOwnName(name))   
            dispatch(updateUserName(name))             
        }

        dispatch(setPreferNativePixelRatio(!!preferNativePixelRatio))

        return redirect('/')
    }catch(e){
        console.error(new Error('ERROR SUBMITTING SETTINGS FORM'))
        throw(e)
    }    
}


//TODO - sessionStorage -> localStorage ?

//TODO - continue work on settings route

export function Settings(){

    const name = useSelector(selectOwnName);

    const preferNativePixelRatio = useSelector(selectPreferNativePixelRatio);

    const navigate = useNavigate();

    return (
    <div className={style.overlay}>

    <Form method='post'>

        <span
            className={style.header}
            >app settings</span>

        <label htmlFor="name">display name</label>
        <input 
            type="text" 
            name="name" 
            defaultValue={name} 
            spellCheck='false'
            maxLength={24}
            />

        <label 
            htmlFor='preferNativePixelRatio'>prefer native pixel ratio</label>
        <Toggle
            name='preferNativePixelRatio'
            defaultChecked={preferNativePixelRatio}
            />

        <div
            className={style['button-wrapper']}
            >
            <button 
                type='submit'
                className={style.button + ' ' + style.save}
                >save</button>
            <button 
                id='cancel'
                type='button'
                onClick={() => navigate(-1)}
                className={style.button + ' ' + style.cancel}
                >cancel</button>
        </div>
        
    </Form>
    

    </div>
    )
}