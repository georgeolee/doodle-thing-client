import { setUserDataListener, setIdAssignmentListener } from "../../socket";

import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import { 
    setOtherUser, 
    removeOtherUser, 
    selectOwnId,

    setOwnId
} from "../../redux/user/userSlice";


import { 
    updateUserId 
} from "../../redux/localStorage/localStorageSlice";


export function ReceiveUserData(){
    

    const dispatch = useDispatch()
    
    const ownId = useSelector(selectOwnId)    

    useEffect(() => {
        setIdAssignmentListener(id => {
            dispatch(setOwnId(id));     //
            dispatch(updateUserId(id));
        })
    }, [dispatch])

    useEffect(() => {
        setUserDataListener(userDataArray => {
            for(const user of userDataArray){
                if(user.disconnect){
                    dispatch(removeOtherUser(user)) // user disconnect
                }else if(user.id && user.id !== ownId){
                    dispatch(setOtherUser(user))    //user status change
                }
            }
        })        
    }, [dispatch, ownId])

    return
}