import { 
    selectOwnId, 
    selectOwnName, 
    selectOwnStatus,

    // setOwnName,
    setOwnId
} from "../../app/state/user/userSlice";

import { 
    updateUserId 
} from "../../app/state/sessionStorage/sessionStorageSlice";

import { selectColor } from "../../app/state/drawingSettings/drawingSettingsSlice";

import { useSelector, useDispatch } from "react-redux";

import { 
    sendUserData,
    setIdAssignmentListener
} from "../../app/socket";


import { useEffect } from "react";

export function EmitUserData(){

    const dispatch = useDispatch()

    //get drawing color
    const color = useSelector(selectColor);
    
    //get own user
    const name = useSelector(selectOwnName);
    const id = useSelector(selectOwnId);
    const status = useSelector(selectOwnStatus);



    //first render - listen for id assignment from server
    useEffect(() => {
        setIdAssignmentListener(id => {
            dispatch(setOwnId(id));     //
            dispatch(updateUserId(id));
        })
    }, [dispatch])

    //emit user update when redux store updates
    useEffect(() => {

        //socket emit to server

        sendUserData({
            id,
            name,
            status,
            color,            
        })

    }, [color, name, id, status])

    return;
}