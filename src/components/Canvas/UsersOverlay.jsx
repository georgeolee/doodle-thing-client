import { useSelector } from "react-redux";
import { 
    selectOtherUsersObj,
    selectOwnId,
    selectOwnName,    
 } from "../../redux/user/userSlice";

import { useEffect, useRef, useState } from "react";

import { subscribe } from "../../socket";

import { NameTag } from "./NameTag";

import { selectUserNameTags } from "../../redux/preferences/preferencesSlice";


import { loadGoogleFont } from "../../loadGoogleFont";

export function UsersOverlay(props){

    const ownId = useSelector(selectOwnId)
    const ownName = useSelector(selectOwnName)

    const enableOverlay = useSelector(selectUserNameTags);
    const otherUsers = useSelector(selectOtherUsersObj);

    const overlayRef = useRef()

    const fontSize = 16*devicePixelRatio;

    const [font, setFont] = useState(`${fontSize}px monospace`)
    

    const {parent} = props;

    const padding = 50 * devicePixelRatio; //extra width around the edge of the parent canvas

    const elt = !parent ?
                    null :                        
                        parent.getContext ? 
                    parent :        
                    parent.current;
    
    const width = elt?.width ?? 0;
    const height = elt?.height ?? 0;


    //TODO - cleanup
    //FIXME - deps
    //TODO - tag appearance

    useEffect(() => {
        console.log(font)
    }, [font])

    useEffect(() => {

        //load font
        ( async () => {
            const family = 'Permanent Marker';
            const googleFontsUrl = `https://fonts.googleapis.com/css2?family=${family}`

            try{
                await loadGoogleFont(googleFontsUrl)
                setFont(`${fontSize}px ${family}`)
            }catch(e){
                console.log(e)
            }
                
            
        })()
    }, [])

    useEffect(() => {

        if(!enableOverlay || !elt) return;


        //FIXME - tag positioning
        function drawTag(xNorm, yNorm, name){

            if(!elt) return;            

            /*
             *  xNorm and yNorm are normalized to the drawing canvas boundaries,
             *  not the overlay canvas
             * 
             *  get ratio between drawing & overlay canvas in order to scale
             *  them to overlay canvas space  
             */
            const canvasRatio = width/(width + 2*padding)

            const x = padding + width * xNorm * canvasRatio;
            const y = padding + height * yNorm * canvasRatio;

            const ctx = overlayRef.current.getContext('2d');

            ctx.save()

            const scale = 1;

            ctx.setTransform(scale, 0, 0, scale, x, y);

            ctx.fillStyle = '#fffd'
            ctx.fillRect(0,-14, 16*name.length*0.7, 20)
            ctx.fillStyle = '#000';
            ctx.font = font;
            ctx.fillText(name, 0,0)

            ctx.fill()
            //draw nametag at position

            ctx.restore()

        }


        let lastStamp = 0;
        let frameRequest = null;

        function animateFrame(stamp){

            const ctx = overlayRef.current.getContext('2d')
            ctx.clearRect(0,0, padding*2 + width, padding*2 + height)
            const dt = stamp - lastStamp;
            ctx.imageSmoothingEnabled=false;
            //iterate through tags

            NameTag.moveAll(dt)

            NameTag.all.forEach((tag, id) => {
                const {name} = tag;
                const {x, y} = tag.pos;
                drawTag(x, y, name)
                // console.log(tag)
            })


            frameRequest = window.requestAnimationFrame(animateFrame)
            lastStamp = stamp;
        }
        
        frameRequest = window.requestAnimationFrame(animateFrame)

        return () => window.cancelAnimationFrame(frameRequest);

    }, [
        enableOverlay, 
        elt, 
        width, 
        height, 
        padding,
        font
    ])

    useEffect(() => {

        if(!enableOverlay) return;

        const unsubscribe = subscribe('drawingData', drawingData => {
            const {id, xNorm, yNorm} = drawingData;

            const name = 
                otherUsers[id]?.name ??     //get other user name
                (id === ownId ? ownName :   //get own name - ie if drawing in multiple browser windows
                'USER')                     //default if no id match

            NameTag.set(id, xNorm, yNorm, name)

        })

        return unsubscribe;
    }, [
        enableOverlay, 
        otherUsers,
        ownId,
        ownName
    ]) 

    //always style
    const always = {
        pointerEvents: 'none',
        touchAction: 'none',
    }
    const style = !elt ?
                    always : //no parent canvas yet
                    {
                        ...always,
                        position: 'absolute',
                        width: `calc(${elt.style.width} + ${2*padding}px)`,
                        height: `calc(${elt.style.height} + ${2*padding}px)`,
                        left:`${ -padding}px`,
                        top: `${-padding}px`,
                        border: '1px solid red',
                        zIndex:100,
                    }
    

    return (
        <canvas ref={overlayRef} {...{style, width, height}}/>
    )
}