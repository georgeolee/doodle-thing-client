export class Doodler{

    cnvRef    
    strokeStyle
    lineWidth

    constructor(cnvRef){
        this.cnvRef = cnvRef  
        // this.strokeStyle = '#000'     
        // this.lineWidth = 1
        // this.drawingSettings = drawingSettings
    }

    getCanvas(){
        const cnv = this.cnvRef['getContext'] ? this.cnvRef : this.cnvRef.current        
        return [cnv, cnv.getContext('2d', {
            alpha: false
        })]
    }

    getDataURL(){
        const [cnv,] = this.getCanvas()
        return cnv.toDataURL()
    }

    line(x0,y0,x1,y1){
        const [, ctx] = this.getCanvas()
           
        ctx.beginPath()
        ctx.moveTo(x0,y0)
        ctx.moveTo(x1,y1)
        ctx.stroke()
    }

    consumePointerStates(...pointerStates){
        const [cnv, ctx] = this.getCanvas()

        ctx.beginPath()
        // ctx.strokeStyle = this.strokeStyle
        // ctx.lineWidth = this.lineWidth * devicePixelRatio
        
        // ctx.strokeStyle = this.drawingSettings.color
        // ctx.lineWidth = this.drawingSettings.lineWidth * devicePixelRatio

        //HERE
        //change this - go back to front, starting w most recent, and use p.last to draw lines
        //decide what to do w/ only one

        for(let i = pointerStates.length - 1; i >= 0; i--){
            const p = pointerStates[i]
            if(!p.isPressed) continue

            ctx.strokeStyle = p.drawingSettings.color
            // ctx.lineWidth = p.drawingSettings.lineWidth * devicePixelRatio
            ctx.lineWidth = p.drawingSettings.lineWidth * 1

            ctx.moveTo(...this.scaleXY(cnv, p.xNorm, p.yNorm))

            if(p.last?.isPressed){
                ctx.lineTo(...this.scaleXY(cnv, p.last.xNorm ?? p.xNorm, p.last.yNorm ?? p.yNorm))
            }else{
                ctx.lineTo(...this.scaleXY(cnv, p.xNorm, p.yNorm))
            }
        }

        ctx.stroke()

    }

    scaleXY(cnv, normalizedX, normalizedY){    
        return [normalizedX * cnv.width, normalizedY * cnv.height]
    }
}