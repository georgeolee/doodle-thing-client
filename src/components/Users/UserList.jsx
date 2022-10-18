import { User } from "./User"

import { useSelector } from "react-redux";
import { selectOtherUsers } from "../../app/state/user/userSlice";

export function UserList(){

    const userKVPairs = useSelector(selectOtherUsers) //array of key/value pairs representing other users

    const users = userKVPairs?.map(([id, {name, status, color}]) => {
        return <User {...{id, name, status, color}} key={id}/>
    })
    return users;
}