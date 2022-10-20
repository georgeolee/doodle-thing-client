//log messages to page for debugging on mobile

import { useEffect, useRef, useCallback } from "react"

/**
 * 
 * @param {{
 *      consoleOverride:true,
 *      append: true,
 *      newline: true,
 *      consoleOverride: true,
 *      onLog?: function
 * }} options 
 * @returns 
 */
export function useInAppLog(options = {}){
    const {
        consoleOverride = true,     //attach this logger to default console.log behavior        
        onLog,                      //optional callback
        append = true,             //append new messages instead of overwriting
        newline = true,        
    } = options

    const logRef = useRef() //ref for display HTMLElement

    const textRef = useRef('')


    const consoleDotLog = useCallback(console.log.bind(console), [])       //native console log
    const consoleDotError = useCallback(console.error.bind(console), [])   //native console error
    
    const log = useCallback((...args) => {
        const elt = logRef.current
        
        //erase
        if(!append){
            clear()
        }

        //print
        for(const arg of args){
            const text = newline ? String(arg) + '\n' : String(arg)

            textRef.current += text
            elt.textContent += text
        }

        onLog?.(...args)
    }, [])

    //maybe change this up later -> add some coloring or something
    const error = err => {
        log(err)
        if(err instanceof Error) reportError(err)
    }

    const clear = useCallback(() => {
        textRef.current = ''
        logRef.current.textContent = ''
    }, [])

    useEffect(()=>{
        const elt = logRef.current
        elt.textContent = textRef.current
    })

    useEffect(()=>{
     
        const printError = (event, source, lineno, colno) => {
            const text = newline ?
                `\n[X] ${event}\n\t${source} : ${lineno}.${colno}\n` :
                `[X] ${event} - ${source} : ${lineno}.${colno}`

            log(text)

            log('ERROR')
            log(event.error)

            log('ERROR.name')
            log(event.error?.name)

            log('ERROR.message')
            log(event.error?.message)

        }
        
        window.addEventListener('error', printError)
        
        return () => {
            window.removeEventListener('error', printError)
        }
    })
        

    //override default console behavior
    useEffect(() => {
        if(consoleOverride){
            console.log = function(...args){
                log(...args)
                consoleDotLog(...args)                
            }

            console.error = function(...args){
                error(...args)
                consoleDotError(...args)                
            }

        }else{
           console.log = consoleDotLog 
           console.error = consoleDotError 
        }
    }, [consoleOverride])

    return {log, error, clear, logRef}
}