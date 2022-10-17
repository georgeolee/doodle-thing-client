import { setUserDataListener } from "../../app/socket";

import { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import { setOtherUser, removeOtherUser, selectOwnId, selectOtherUsers } from "../../app/state/user/userSlice";

import { UserList } from "./UserList";



export function ReceiveUserData(){
    

    const dispatch = useDispatch()
    
    const ownId = useSelector(selectOwnId)

    const userKVPairs = useSelector(selectOtherUsers) // Array<[id, {name,status,color}]>

    useEffect(() => {
        setUserDataListener(userDataArray => {
            for(const user of userDataArray){
                console.log(user)
                if(user.disconnect){
                    dispatch(removeOtherUser(user)) // user disconnect
                }else if(user.id && user.id !== ownId){
                    dispatch(setOtherUser(user))    //user status change
                }
            }

            console.log('UKV')
            console.log(userKVPairs)
        })        
    }, [])


    return <UserList users={userKVPairs}/>
}