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

            // const family = 'Lobster';
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

        

        //TODO - clean up
        function drawTag(tag){

            if(!elt) return;            

            const {name, textWidth, textHeight} = tag;
            const {x:xNorm, y:yNorm} = tag.pos;

            /*
             *  xNorm and yNorm are normalized to the drawing canvas boundaries,
             *  not the overlay canvas
             * 
             *  get ratio between drawing & overlay canvas in order to scale
             *  them to overlay canvas space  
             */
            const canvasRatio = width/(width + 2*padding)

            const x = (padding + width * xNorm) * canvasRatio;
            const y = (padding + height * yNorm) * canvasRatio;

            const ctx = overlayRef.current.getContext('2d');

            ctx.save()

            const scale = 1;

            ctx.setTransform(scale, 0, 0, scale, x, y);


            //TODO nametag styling

            ctx.fillStyle = '#fffd'

            const textPadding = 5;
            // ctx.beginPath();

            ctx.fillRect(-textPadding, -textPadding, textWidth + 2*textPadding, textHeight + 2*textPadding)
            ctx.fillStyle = '#000';
            ctx.font = font;
            ctx.textBaseline = 'top'
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
                drawTag(tag)
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


        //TODO - clean up ; refactor for performance
        function measureText(text, family, size){
            const span = document.createElement('span')
            const padding = 0;
            span.style.fontFamily = family;
            span.style.fontSize = size + 'px';
            span.textContent = text;
            span.style.margin = 0;
            span.style.padding = padding + 'px';
            span.style.display = 'flex';
            span.style.lineHeight = 1;
            span.style.width = 'fit-content';
            span.style.height = 'fit-content';
            span.style.visibility = 'hidden';
            span.style.pointerEvents = 'none';
            span.style.touchAction = 'none';
            span.style.position = 'fixed';
            span.style.zIndex = -1;

            document.body.appendChild(span);

            const {
                width:textWidth, 
                height:textHeight
            } = span.getBoundingClientRect()

            return {textWidth,textHeight}
        }

        const unsubscribe = subscribe('drawingData', drawingData => {
            const {id, xNorm, yNorm} = drawingData;

            const name = 
                otherUsers[id]?.name ??     //get other user name
                (id === ownId ? ownName :   //get own name - ie if drawing in multiple browser windows
                'USER')                     //default if no id match

            const isNewTag = !NameTag.all.get(id)
    
            const tag = NameTag.set(id, xNorm, yNorm, name)

            //TODO - this check is slow - only do it once per name per text style
            if(isNewTag){

                const {textWidth, textHeight} = measureText(name, 'Permanent Marker', 16)

                tag.textWidth = textWidth;
                tag.textHeight = textHeight;
            }
                        
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