import './LoadingScreen.css'

import { useSelector } from 'react-redux'
import { selectStatus } from '../../app/state/canvas/canvasSlice'

import { LoadingAnimation } from './LoadingAnimation';

export function LoadingScreen(){

    const canvasStatus = useSelector(selectStatus);

    const loading = canvasStatus !== 'ready';

    return(
        <div className={loading ? 'loading-message loading' : 'loading-message'}>

            <span className='status'>{canvasStatus}</span>
            <LoadingAnimation/>

        </div>)
}