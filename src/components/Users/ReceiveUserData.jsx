import { setUserDataListener } from "../../app/socket";

import { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import { setOtherUser, removeOtherUser, selectOwnId } from "../../app/state/user/userSlice";



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