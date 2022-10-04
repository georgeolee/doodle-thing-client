import './LoadingMessage.css'

import { useSelector, useDispatch } from 'react-redux'
import { selectStatus } from '../../app/state/canvas/canvasSlice'
import { useEffect } from 'react';

export function LoadingMessage(){

    const canvasStatus = useSelector(selectStatus);

    const loading = canvasStatus !== 'ready';

    return(
        <div className={loading ? 'loading-message loading' : 'loading-message'}>

            <span>{canvasStatus}</span>

        </div>)
}