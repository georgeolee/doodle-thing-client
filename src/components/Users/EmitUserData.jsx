import { 
    selectOwnId, 
    selectOwnName, 
    selectOwnStatus,

} from "../../redux/user/userSlice";

import { selectColor } from "../../redux/drawingSettings/drawingSettingsSlice";

import { useSelector } from "react-redux";

import { 
    sendUserData,
} from "../../socket";


import { useEffect } from "react";

export function EmitUserData(){

    // const dispatch = useDispatch()

    //get drawing color
    const color = useSelector(selectColor);
    
    //get own user
    const name = useSelector(selectOwnName);
    const id = useSelector(selectOwnId);
    const status = useSelector(selectOwnStatus);
    

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