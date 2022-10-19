import { useState } from "react";
import { useInAppLog } from "../../hooks/useInAppLog";
import { Toggle } from "../Toggle/Toggle";
import './log.css'


export function Log(){

    const {logRef} = useInAppLog({})
    const [isCollapsed, setCollapsed] = useState(true)

    return(
        <div className="log">
            <div className="header">
                
                <div>LOG</div>

                <label>show log 

                    <Toggle
                        defaultChecked={!isCollapsed} 
                        onChange={()=> setCollapsed(!isCollapsed)}
                        />
                        
                </label>
                
            </div>
            <div className={isCollapsed ? 'body collapsed' : 'body'}>

                <div ref={logRef}></div>
            </div>
        </div>
    )
}