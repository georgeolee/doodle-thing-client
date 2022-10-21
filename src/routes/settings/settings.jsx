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

import { updateUserName } from '../../redux/localStorage/localStorageSlice';

import { dispatch } from '../../redux/store';

import style from './settings.module.css'

import { Toggle } from '../../components/Toggle/Toggle';

import { selectErrorReporting, enableErrorReporting } from '../../redux/preferences/preferencesSlice';

export async function action({request}){


    try{
        const formData = await request.formData();
        const {
            name, 
            preferNativePixelRatio, 
            errorReporting
        } = Object.fromEntries(formData);

        const visibleName = name.trim()

        if(visibleName){
            dispatch(setOwnName(visibleName))   
            dispatch(updateUserName(visibleName))             
        }

        dispatch(setPreferNativePixelRatio(!!preferNativePixelRatio))
        dispatch(enableErrorReporting(errorReporting));

        return redirect('/')
    }catch(e){
        console.log('in settings.jsx')
        console.error(new Error('ERROR SUBMITTING SETTINGS FORM'))
        throw(e)
    }    
}


//TODO - localStorage -> localStorage ?

//TODO - continue work on settings route

export function Settings(){

    const name = useSelector(selectOwnName);

    const preferNativePixelRatio = useSelector(selectPreferNativePixelRatio);
    const errorReporting = useSelector(selectErrorReporting);

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
            autoComplete='off'
            autoCorrect='off'
            maxLength={24}
            />

        <label 
            htmlFor='preferNativePixelRatio'>prefer native pixel ratio</label>
        <Toggle
            name='preferNativePixelRatio'
            defaultChecked={preferNativePixelRatio}
            />

        <label 
            htmlFor='errorReporting'>allow error reporting</label>
        <Toggle
            name='errorReporting'
            defaultChecked={errorReporting}
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