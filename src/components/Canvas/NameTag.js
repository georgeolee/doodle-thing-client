const lerp = (a, b, t) => (1 - t)*a + t*b;

const lerp2D = (va, vb, t) => {
    return {
        x: lerp(va.x, vb.x, t),
        y: lerp(va.y, vb.y, t),
    }
}


export class NameTag{

    static all = new Map();

    /**how long a tag should last for after (re)setting */
    static lifetime = 2000;
    
    /**motion damping */
    static lerpFactor = 6;

    /**stop moving the nametag if sq dist from target is less than this*/
    static sqDistThreshold = 1e-5;

    

    /**
     * 
     * @param {string} id tag key
     * @param {number} x target coord; if the tag doesn't exist yet, also sets the starting coord
     * @param {number} y target coord; if the tag doesn't exist yet, also sets the starting coord
     * @param {string} name name to use when setting a new tag
     * @returns {NameTag}
     */
    static set(id, _x, _y, name = 'user'){

        const clamp = true;

        const x = !clamp ? _x : Math.min(Math.max(0,_x),1);
        const y = !clamp ? _y : Math.min(Math.max(0,_y),1);

        let t = this.all.get(id)

        if(t){
            t.target = {x,y}
            t.remaining = NameTag.lifetime            
        }else{
            t = new NameTag(x, y, name, NameTag.lifetime)
            this.all.set(id, t)
        }
        return t;
    }

    /**
     * lerp all tags towards target positions
     * @param {number} dt delta time in millis
     */
    static moveAll(dt){        
        
        const secs = dt * 0.001;
        
        const lerpFactor = Math.min(NameTag.lerpFactor * secs, 1);


        

        this.all.forEach((tag, id)=> {
            if(tag.remaining <= 0){
                this.all.delete(id);
            }else{

                const sqDist = (tag.pos.x - tag.target.x)**2 + (tag.pos.y - tag.target.y)**2;

                if(sqDist >= this.sqDistThreshold){                    
                    tag.pos = lerp2D(tag.pos, tag.target, lerpFactor)
                }else{
                    // tag.pos = {...tag.target};
                }
                
                tag.remaining -= dt;
            }            
        })
    }
        
    pos;
    target;

    name;
    remaining;

    constructor(x, y, name, remaining){
        this.pos = {x,y};
        this.target = {x,y};
        this.name = name;
        this.remaining = remaining;
    }
    

}


