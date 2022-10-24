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

    const fontFamily = 'Permanent Marker'
    // const fontFamily = 'Lobster'
    // const fontFamily = 'Monofett'

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
    //TODO - tag appearance
    //TODO - tag color?

    useEffect(() => {
        console.log(font)
    }, [font])

    useEffect(() => {

        //load font
        ( async () => {                    

            try{
                await loadGoogleFont(fontFamily)
                setFont(`${fontSize}px ${fontFamily}`)
            }catch(e){
                console.log(e)
            }
                
            
        })()
    }, [fontSize, fontFamily])

    useEffect(() => {

        if(!enableOverlay || !elt) return;
        

        //TODO - clean up
        function drawTag(tag){

            if(!elt) return;          

            const {name} = tag;
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

            ctx.fillStyle = tag.color ?? '#fffd'
            

            const textPadding = 5;
            // ctx.beginPath();            

            ctx.fillRect(
                -textPadding - tag.actualBoundingBoxLeft, 
                -textPadding - tag.actualBoundingBoxAscent, 
                tag.actualBoundingBoxLeft + tag.actualBoundingBoxRight + 2*textPadding, 
                tag.actualBoundingBoxAscent + tag.actualBoundingBoxDescent + 2*textPadding);

            ctx.fillStyle = tag.textColor;
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
        font,
    ])

    useEffect(() => {

        
        if(!enableOverlay) return;


        function getHexColorValue(hexColor){

            //hex string
            let str = hexColor.match(/^#?((?:[a-f0-9]{3}){1,2}|(?:[a-f0-9]{4}){1,2})$/i)?.[1]
            
            if(!str) throw new Error('getHexColorValue(): invalid string argument')

            //double up if single char per channel
            if(str.length < 6){
                str = str.split('').reduce((p, n) => p + n + n,'')
            }
            
            //split by channel
            str = str.split('').reduce((p,n,i) =>{
                if(i%2 === 0){
                    p.push(n)
                }else{
                    p[p.length-1] += n
                }
                return p
            }, [])
            
            //average r/g/b channel value
            return str.reduce((p,n,i) => {  
                return (i > 2 ? //skip alpha
                    p :
                    p + parseInt(n, 16)
                )            
            },0) / 3;                
        }


        const unsubscribe = subscribe('drawingData', drawingData => {

            const {id, xNorm, yNorm, drawingSettings} = drawingData;
            const {color, eraser} = drawingSettings;

            
            const name = 
                otherUsers[id]?.name ??     //other user id
                (id === ownId ? ownName :   //own user id  (if drawing in multiple browser windows, etc)
                'USER')                     //no id match
            

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