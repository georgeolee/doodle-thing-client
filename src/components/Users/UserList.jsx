import { useEffect } from "react";
import { User } from "./User"

export function UserList(props){

    useEffect(() => {
        console.log('USER LIST RENDER')

        console.log(props.users)
    })

    const users = props.users?.map(([id, {name, status, color}]) => {
        return <User {...{id, name, status, color}} />
    })

    return users;
}