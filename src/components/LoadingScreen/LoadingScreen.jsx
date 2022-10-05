import './LoadingScreen.css'

import { useSelector } from 'react-redux'
import { selectStatus, selectIsReady } from '../../app/state/canvas/canvasSlice'

import { LoadingAnimation } from './LoadingAnimation';

export function LoadingScreen(){

    const canvasStatus = useSelector(selectStatus);
    
    const loading = !useSelector(selectIsReady);

    return(
        <div className={loading ? 'loading-message loading' : 'loading-message'}>

            <span className='status'>{loading ? canvasStatus : 'ready!'}</span>
            <LoadingAnimation/>

        </div>)
}