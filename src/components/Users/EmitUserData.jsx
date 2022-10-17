import { 
    selectOwnId, 
    selectOwnName, 
    selectOwnStatus,

    setOwnName,
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

//FIXME any weirdness going on here ?

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
        //TODO - test - is this working? YES, I THINK SO - SEE PHONE PIC
        setIdAssignmentListener(id => {
            dispatch(setOwnId(id));     //
            dispatch(updateUserId(id));
        })
    }, [dispatch])

    //emit user update when redux store updates
    useEffect(() => {

        //TODO test - is this firing? when?



        //FIXME --- see phone pic -> name, status, color undefined, at least on server side - what's going on?

        //TODO - print out here -> what are their values client side?
        //socket emit to server
        
        console.log(`\nin ${EmitUserData.name}:`)
        console.log(`id: ${id}\tname: ${name}\tstatus: ${status} color: ${color}\n`)

        sendUserData({
            id,
            name,
            status,
            color,            
        })

    }, [color, name, id, status])

    return;
}