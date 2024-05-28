
const battlebg = new Image()
battlebg.src = './assets/bg1.jpg'


const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: battlebg
})




let draggle 
let emby 
let queue=[]
let animationFrame
function initBattle(){
    draggle =new Monster(monsters.Draggle)
    emby =new Monster(monsters.Emby)
   
    queue=[]

    uiElements = document.querySelectorAll('.ui');
    document.querySelector('#attacksBox').replaceChildren()
    document.querySelector('#dialogueBox').style.display = 'none'
    uiElements.forEach(element => {
        element.style.display = 'block';
    }); gsap.to('#overlappingDiv',{
        opacity:0
    })
    
    document.querySelector('#enemyHealth').style.width='100%'
    document.querySelector('#myHealth').style.width='100%'

    emby.attacks.forEach(attack=>{
        const button=document.createElement('button')
        button.innerHTML=attack.name
        document.querySelector('#attacksBox').append(button)
    })
    document.querySelectorAll('button').forEach((button)=>{
        button.addEventListener('click',(e)=>{
        // console.log('clicked')
        const selectedAttack=attacks[e.currentTarget.innerHTML]
        // console.log(selectedAttack)
        emby.attack({
            attack:selectedAttack,
            recipient:draggle
        })
        
        if(draggle.health<=0){
            queue.push(()=>{
              draggle.faint()
            })
            queue.push(()=>{
                gsap.to('#overlappingDiv',{
                    opacity:1,
                    onComplete:()=>{
                        cancelAnimationFrame(animationFrame)
                        animate()
                        var uiElements = document.querySelectorAll('.ui');
                        uiElements.forEach(element => {
                            element.style.display = 'none';
                        }); gsap.to('#overlappingDiv',{
                            opacity:0
                            
                        })
                        battle.initiated = false
                        audio.battle.stop()
                        audio.initBattle.stop()
                        audio.Map.play()
                    }
                })
            })
            
        }
        
        //enemy attack
        const randomAttack=draggle.attacks[Math.floor(Math.random()*draggle.attacks.length)]
        
        queue.push(()=>{
            draggle.attack({
                attack:randomAttack,
                recipient:emby
            })
            if(emby.health<=0){
                queue.push(()=>{
                  emby.faint()
                })
                queue.push(()=>{
                    gsap.to('#overlappingDiv',{
                        opacity:1,
                        onComplete:()=>{
                            cancelAnimationFrame(animationFrame)
                            animate()
                            var uiElements = document.querySelectorAll('.ui');
                            uiElements.forEach(element => {
                                element.style.display = 'none';
                            }); gsap.to('#overlappingDiv',{
                                opacity:0
                                
                            })
                            battle.initiated = false
                            audio.battle.stop()
                            audio.initBattle.stop()
                            audio.Map.play()
                        }
                    })
                })
                
                
            }
        })
        
        
        })
        button.addEventListener('mouseenter', (e) => {
            const selectedattack = attacks[e.currentTarget.innerHTML];
            document.querySelector('#AttackType').innerHTML = selectedattack.type;
          });
        
        })
  
    
    
}

function animateBattle() {
  animationFrame= window.requestAnimationFrame(animateBattle)
  console.log(animationFrame)
    battleBackground.image.width = canvas.width;
    battleBackground.image.height = canvas.height;
    c.drawImage(battleBackground.image, 0, 0, canvas.width, canvas.height);
    
    draggle.moving=true
    draggle.draw()
    emby.moving=true
    emby.draw()
}

// initBattle()
// animateBattle()


//event listener for attacks

document.querySelector('#dialogueBox').addEventListener('click',(e)=>{
    if(queue.length>0){
        queue[0]()
        queue.shift()
    }else{
        e.currentTarget.style.display='none'
    }
    

})