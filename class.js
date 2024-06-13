
class Boundary {
    static width = 4.24 * 16
    static height = 4.24 * 16
    constructor({ position }) {
        this.position = position
        this.width = Boundary.width
        this.height = Boundary.height

    }

    draw() {
        c.fillStyle = 'rgba(255,0,0,0 )'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Sprite {
    constructor({
        position, velocity, image, frames = { max: 1, hold:10 }, sprites
    }) {
        this.position = position
        this.image = new Image()
        this.frames = { ...frames, val: 0, elapsed: 0 }
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.image.src=image.src
        this.sprites = sprites
        this.opacity=1

        this.moving = false

    }
    draw() {
        c.save()
        c.globalAlpha=this.opacity
        c.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height
        )
        c.restore()
        if (this.frames.max > 1) {
            this.frames.elapsed++
        }

        if (!this.moving) return
        if (this.frames.elapsed % this.frames.hold == 0)
            if (this.frames.val < this.frames.max - 1){

                this.frames.val++
                // console.log(this.frames.elapsed)
            }
            else this.frames.val = 0
    }

 
}    


class Monster extends Sprite {

    constructor({
        isEnemy=false,name,position, velocity, image, frames = { max: 1, hold:10 }, sprites,attacks,health=100}){
       super({position, velocity, image, frames , sprites})
            this.health=health
            this.isEnemy=isEnemy
            this.name=name
            this.attacks=attacks
            this.image.onload = () => {

                this.width = this.image.width / this.frames.max
                this.height = this.image.height
                // console.log(this.width)
    
            }
            this.moving = false
    
        }
        draw() {
            c.save()
            c.globalAlpha=this.opacity
            c.drawImage(
                this.image,
                this.frames.val * this.width,
                0,
                this.image.width / this.frames.max,
                this.image.height,
                this.position.x,
                this.position.y,
                this.image.width*1.65,
                this.image.height*1.65
            )
            c.restore()
            if (this.frames.max > 1) {
                this.frames.elapsed++
            }
    
            if (!this.moving) return
            if (this.frames.elapsed % this.frames.hold == 0)
                if (this.frames.val < this.frames.max - 1){
    
                    this.frames.val++
                    // console.log(this.frames.elapsed)
                }
                else this.frames.val = 0
        }
    faint(){
        document.querySelector('#dialogueBox').style.display='block'
        document.querySelector('#dialogueBox').innerHTML= this.name +' fainted!'
        gsap.to(this.position,{
            y:this.position.y+20
        })
        gsap.to(this,{
            opacity:0
        })
    }
    
    attack({ attack, recipient }) {

        document.querySelector('#dialogueBox').style.display='block'
        document.querySelector('#dialogueBox').innerHTML= this.name +' used '+ attack.name

        const tl = gsap.timeline();
        recipient.health -= attack.damage; // Update health once
        let movementDistance = 20;
        let healthBar = '#enemyHealth';
        if (this.isEnemy) healthBar = '#myHealth';
    
        if (this.isEnemy) movementDistance = -20;
    
        tl.to(this.position, {
            x: this.position.x - movementDistance
        }).to(this.position, {
            x: this.position.x + (2 * movementDistance),
            duration: 0.1,
            onComplete: () => {
                //  Correct health update in health bar
                gsap.to(healthBar, {
                    width: recipient.health + '%' // Use the already updated health
                });
                gsap.to(recipient.position, {
                    x: recipient.position.x + 10,
                    yoyo: true,
                    repeat: 5,
                    duration: 0.08
                });
                gsap.to(recipient, {
                    opacity: 0,
                    repeat: 5,
                    yoyo: true,
                    duration: 0.08
                });
            }
        }).to(this.position, {
            x: this.position.x
        });
    }

}