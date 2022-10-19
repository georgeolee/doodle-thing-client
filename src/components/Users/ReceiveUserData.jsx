import { setUserDataListener } from "../../socket";

import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import { 
    setOtherUser, 
    removeOtherUser, 
    selectOwnId 
} from "../../redux/user/userSlice";



export function ReceiveUserData(){
    

    const dispatch = useDispatch()
    
    const ownId = useSelector(selectOwnId)    

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