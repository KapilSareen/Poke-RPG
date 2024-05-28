const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');


canvas.width = 1120
canvas.height = 640




let clicked = false
addEventListener('click', () => {
  if (!clicked) {
    audio.Map.play()
    clicked = true
  }
})

let uiElements = document.querySelectorAll('.ui');
uiElements.forEach(element => {
    element.style.display = 'none';
}); gsap.to('#overlappingDiv',{
    opacity:0
})
collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, i + 70))

}

const battlezonesMap = []
for (let i = 0; i < battleZone.length; i += 70) {
    battlezonesMap.push(battleZone.slice(i, i + 70))

}



const boundaries = []

const offset = {
    x: -700,
    y: -450
}


collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 343) {

            boundaries.push(new Boundary({
                position: {
                    x: (j * Boundary.width) + offset.x,
                    y: (i * Boundary.height) + offset.y
                }
            }))
        }
    })

});
// console.log(boundaries)

const battlezones = []
battlezonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 183) {

            battlezones.push(new Boundary({
                position: {
                    x: (j * Boundary.width) + offset.x,
                    y: (i * Boundary.height) + offset.y
                }
            }))
        }
    })

});

// console.log(battlezones)

const image = new Image()
image.src = 'https://github.com/KapilSareen/Poke-RPG/blob/main/assets/map.png'


const playerImage = new Image()
playerImage.src = 'https://github.com/KapilSareen/Poke-RPG/blob/main/assets/playerDown.png'

const foregroundimage = new Image()
foregroundimage.src = 'https://github.com/KapilSareen/Poke-RPG/blob/main/assets/foreground.png'


const playerUpImage = new Image()
playerUpImage.src = 'https://github.com/KapilSareen/Poke-RPG/blob/main/assets/playerUp.png'
const playerLeftImage = new Image()
playerLeftImage.src = 'https://github.com/KapilSareen/Poke-RPG/blob/main/assets/playerLeft.png'
const playerRightImage = new Image()
playerRightImage.src = 'https://github.com/KapilSareen/Poke-RPG/blob/main/assets/playerRight.png'



const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})


const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundimage
})

const player = new Sprite({
    image: playerImage,
    position: {
        x: canvas.width / 2 - 192 / 8,
        y: canvas.height / 2 - 68 / 2
    },
    frames: {
        max: 4,
        hold:10
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerImage
    }
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}


const movables = [background, ...boundaries, foreground, ...battlezones]

function IsColliding({ rectangle1, rectangle2 }) {
    return (rectangle1.position.x + rectangle1.width >= rectangle2.position.x
        && rectangle1.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.position.y <= rectangle2.position.y + rectangle2.height && rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}



const battle = {
    initiated: false
}


function animate() {
    const animateId = window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
        if (IsColliding({
            rectangle1: player,
            rectangle2: boundary
        })) {
            console.log("Colliding")
        }
    })

    battlezones.forEach(btzone => {
        btzone.draw()
    })


    player.draw()
    foreground.draw()


    let moving = true
    player.moving = false
    if (battle.initiated) return


    // battle activation
    if (keys.w.pressed || keys.a.pressed || keys.d.pressed || keys.s.pressed) {
        for (let i = 0; i < battlezones.length; i++) {
            const battlezone = battlezones[i];
            const overlappingArea = (Math.min(player.position.x + player.width, battlezone.position.x + battlezone.width) - Math.max(player.position.x, battlezone.position.x)) * (Math.min(player.position.y + player.height, battlezone.position.y + battlezone
                .height) - Math.max(player.position.y, battlezone.position.y))
            if (IsColliding({
                rectangle1: player,
                rectangle2: battlezone
            }) && overlappingArea > (player.width * player.height / 2) && Math.random() < 0.01) {
                // console.log("activate battle")

                battle.initiated = true
                // cancel animation loop
                audio.Map.stop()
                audio.initBattle.play()
                audio.battle.play()
                window.cancelAnimationFrame(animateId)
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.5,
                    onComplete() {
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            duration: 0.5,
                            onComplete() {
                                initBattle()
                                animateBattle()
                                // player.moving
                                gsap.to('#overlappingDiv', {
                                    opacity: 0,
                                    duration: 0.5,
                                    
                                    
                                })
                            }
                        })
                    }
                })
            }

        }
    }
    if (keys.w.pressed && lastkey == 'w') {

        player.moving = true
        player.image = player.sprites.up
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (IsColliding({
                rectangle1: player,
                rectangle2: {
                    ...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3
                    }
                }
            })) {
                console.log("Colliding")
                moving = false
            }




        }
        if (moving == true)

            movables.forEach(movable => {
                movable.position.y += 3
            })



    }
    else if (keys.s.pressed && lastkey == 's') {
        player.moving = true
        player.image = player.sprites.down

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (IsColliding({
                rectangle1: player,
                rectangle2: {
                    ...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 3
                    }
                }
            })) {
                // console.log("Colliding")
                moving = false
            }

        }
        if (moving == true)
            movables.forEach(movable => {
                movable.position.y -= 3
            })
    }
    else if (keys.a.pressed && lastkey == 'a') {
        player.moving = true
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (IsColliding({
                rectangle1: player,
                rectangle2: {
                    ...boundary, position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y
                    }
                }
            })) {
                // console.log("Colliding")
                moving = false
            }

        }
        if (moving == true)

            movables.forEach(movable => {
                movable.position.x += 3
            })
    }
    else if (keys.d.pressed && lastkey == 'd') {
        player.moving = true
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (IsColliding({
                rectangle1: player,
                rectangle2: {
                    ...boundary, position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y
                    }
                }
            })) {
                // console.log("Colliding")
                moving = false
            }

        }
        if (moving == true)
            movables.forEach(movable => {
                movable.position.x -= 3
            })
    }

}

animate() 

let lastkey = ''
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
        case 'ArrowUp':
            keys.w.pressed = true
            lastkey = 'w'
            break;
        case 'a':
        case 'ArrowLeft':
            lastkey = 'a'
            keys.a.pressed = true
            break;
        case 's':
        case 'ArrowDown':
            lastkey = 's'
            keys.s.pressed = true
            break;
        case 'd':
        case 'ArrowRight':
            lastkey = 'd'
            keys.d.pressed = true

            break;

        default:
            break;
    }
    console.log(keys)
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
        case 'ArrowUp':
            keys.w.pressed = false
            break;
        case 'a':
        case 'ArrowLeft':

            keys.a.pressed = false
            break;
        case 's':
        case 'ArrowDown':
            keys.s.pressed = false
            break;
        case 'd':
        case 'ArrowRight':
            keys.d.pressed = false

            break;

        default:
            break;
    }
    // console.log(keys)
})