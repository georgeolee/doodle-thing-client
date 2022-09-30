import { useState } from "react";
import { useInAppLog } from "../../hooks/useInAppLog";
import './log.css'


export function Log(props){

    const {logRef} = useInAppLog({})
    const [isCollapsed, setCollapsed] = useState(true)

    return(
        <div className="log">
            <div className="header">
                
                <div>LOG</div>

                <label>show log 
                    <input 
                        type="checkbox" 
                        checked={!isCollapsed} 
                        onClick={()=> setCollapsed(!isCollapsed)}/>
                </label>
                
            </div>
            <div 
                className={isCollapsed ? 'body collapsed' : 'body'}
                ref={logRef}/>
        </div>
    )
}