import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { 
    selectOtherUsersObj,
    selectOwnId,
    selectOwnName,    
 } from "../../redux/user/userSlice";

 import { selectUserNameTags } from "../../redux/preferences/preferencesSlice";

import { subscribe } from "../../socket";
import { NameTag } from "./NameTag";
import { loadGoogleFont } from "../../loadGoogleFont";
import { getHexColorValue } from "../../getHexColorValue";

export function UsersOverlay(props){

    const ownId = useSelector(selectOwnId)
    const ownName = useSelector(selectOwnName)

    const enableOverlay = useSelector(selectUserNameTags);
    const otherUsers = useSelector(selectOtherUsersObj);

    const overlayRef = useRef()

    const fontFamily = 'Permanent Marker'


    const fontSize = 16*devicePixelRatio;

    const [font, setFont] = useState(`${fontSize}px monospace`)


    const {parent} = props;

    const elt = !parent ?
                    null :                        
                        parent.getContext ? 
                    parent :        
                    parent.current;
    
    const width = elt?.width ?? 0;
    const height = elt?.height ?? 0;



    //load google font for nametags
    useEffect(() => {        
        ( async () => {                    

            try{
                await loadGoogleFont(fontFamily)
                setFont(`${fontSize}px ${fontFamily}`)
            }catch(e){
                console.log(e)
            }
                
            
        })()
    }, [fontSize, fontFamily])


    //set up animation loop
    useEffect(() => {

        if(!enableOverlay || !elt) return;
        
        function drawTag(tag, ctx){

            if(!elt) return;          

            const x = width * tag.pos.x;
            const y = height * tag.pos.y;
            const scale = 1;
            const textPadding = 5*devicePixelRatio;

            ctx.setTransform(scale, 0, 0, scale, x, y);

            ctx.fillStyle = tag.color ?? '#fffd'
            ctx.fillRect(
                -textPadding - tag.actualBoundingBoxLeft, 
                -textPadding - tag.actualBoundingBoxAscent, 
                tag.actualBoundingBoxLeft + tag.actualBoundingBoxRight + 2*textPadding, 
                tag.actualBoundingBoxAscent + tag.actualBoundingBoxDescent + 2*textPadding);

            ctx.fillStyle = tag.textColor;
            ctx.fillText(tag.name, 0,0)

        }


        let lastStamp = 0;
        let frameRequest = null;

        function animateFrame(stamp){

            //delta time
            const dt = stamp - lastStamp;

            const ctx = overlayRef.current.getContext('2d')

            //reset transform
            ctx.setTransform(1,0,0,1,0,0);

            //clear previous frame
            ctx.clearRect(0,0, width, height)

            ctx.font = font;
            ctx.textBaseline = 'top'
            ctx.imageSmoothingEnabled=false;

                        
            NameTag.moveAll(dt)

            //iterate through tags
            NameTag.all.forEach((tag) => {                
                drawTag(tag, ctx)                
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
        font,
    ])

    //subscribe to drawingData event -> set name tag
    useEffect(() => {
        if(!enableOverlay) return;


        const unsubscribe = subscribe('drawingData', drawingData => {

            const {id, xNorm, yNorm, drawingSettings} = drawingData;
            const {color, eraser} = drawingSettings;

            //get name from id
            const name = 
                otherUsers[id]?.name ??     
                (id === ownId ? ownName :   
                'USER')
            

            //before setting, check if the tag exists
            const isNewTag = !NameTag.all.get(id)

            //create a new tag or update the existing one
            const tag = NameTag.set(id, xNorm, yNorm, name)

            //set colors
            tag.color = (eraser ? '#fff' : color) + 'd';
            tag.textColor = (eraser || getHexColorValue(tag.color) > 128) ? '#000' : '#fff'            

            //if it's a new tag - measure text bounding box
            if(isNewTag){

                const ctx = overlayRef.current.getContext('2d')
                ctx.font = font;
                ctx.textBaseline = 'top'
                const metrics = ctx.measureText(name)                

                for(const p of [
                    'actualBoundingBoxAscent', 
                    'actualBoundingBoxDescent',
                    'actualBoundingBoxLeft',
                    'actualBoundingBoxRight',
                ]){
                    tag[p] = metrics[p]
                }
            }
        })

        return unsubscribe;
    }, [
        enableOverlay, 
        otherUsers,
        ownId,
        ownName,
        font
    ]) 

    //always style
    const always = {
        pointerEvents: 'none',
        touchAction: 'none',
    }
    const style = !elt ?
                    { 
                        ...always,
                        display:'none',
                    } : //no parent canvas yet
                    {
                        ...always,
                        display: enableOverlay ? 'block' : 'none',
                        position: 'absolute',
                        width: elt.style.width,
                        height: elt.style.height,
                        left: 0,
                        top: 0,
                        zIndex:100,
                    }
    

    return (
        <canvas ref={overlayRef} {...{style, width, height}}/>
    )
}