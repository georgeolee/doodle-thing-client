
import { subscribe } from "../../socket";

import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import { 
    setOtherUser, 
    removeOtherUser, 
    selectOwnId,

    setOwnId
} from "../../redux/user/userSlice";


import { updateUserId } from "../../redux/localStorage/localStorageSlice";


export function ReceiveUserData(){
    

    const dispatch = useDispatch()
    
    const ownId = useSelector(selectOwnId)    

    //listen for id assignment from server
    useEffect(() => {
        const unsubscribe = subscribe('assign id', id => {
            dispatch(setOwnId(id))
            dispatch(updateUserId(id))
        })

        return unsubscribe;

    },[dispatch])

    //listen for updates about other users
    useEffect(() => {
        const unsubscribe = subscribe('user', userDataArray => {
            for(const user of userDataArray){
                
                //other user disconnect
                if(user.disconnect){
                    dispatch(removeOtherUser(user));
                }

                //other user status change
                else if(user.id && user.id !== ownId){
                    dispatch(setOtherUser(user));
                }
            }
        })
        
        return unsubscribe;

    }, [dispatch, ownId])

    return
}