let  mypokemons=[]
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
image.src = './assets/map.png'


const playerImage = new Image()
playerImage.src = './assets/playerDown.png'

const foregroundimage = new Image()
foregroundimage.src = './assets/foreground.png'


const playerUpImage = new Image()
playerUpImage.src = './assets/playerUp.png'
const playerLeftImage = new Image()
playerLeftImage.src = './assets/playerLeft.png'
const playerRightImage = new Image()
playerRightImage.src = './assets/playerRight.png'



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
            // console.log("Colliding")
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
                audio.Map.pause()
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
                // console.log("Colliding")
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
    // console.log(keys)
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

async function getPokemon(num) {
    let a = await fetch('https://graphqlpokemon.favware.tech/v8', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
    {
        getPokemonByDexNumber(number: ${num}) {
            species
            sprite
            backSprite
            baseStats {
                attack
                defense
                hp
                specialattack
                specialdefense
                speed
            }}}`
        })
    });
    let json = await a.json();
    let pokemone = json.data.getPokemonByDexNumber;
    return pokemone;
}

async function get_mypoke(){
    let a = await getPokemon(25);
    mypokemons.push(a);
    myPokemon=mypokemons[0]

}


async function getPokemon(num) {
    let a = await fetch('https://graphqlpokemon.favware.tech/v8', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
    {
        getPokemonByDexNumber(number: ${num}) {
            species
            sprite
            backSprite
            baseStats {
                attack
                defense
                hp
                specialattack
                specialdefense
                speed
            }}}`
        })
    });
    let json = await a.json();
    let pokemone = json.data.getPokemonByDexNumber;
    return pokemone;
}
get_mypoke()

let pokeball=document.querySelector("#pokeball")
pokeball.addEventListener('click', () => {
    console.log(mypokemons)
    const modal = document.createElement('div');
    Object.assign(modal.style, {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        zIndex: '1000',
        left: '0',
        top: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    });

    const modalContent = document.createElement('div');
    Object.assign(modalContent.style, {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '80%',
        maxHeight: '70%',
        overflow: 'auto',
        maxWidth: '650px',
        position: 'relative',
        textAlign: 'center',
    });

    const closeButton = document.createElement('span');
    closeButton.innerHTML = '&times;';
    Object.assign(closeButton.style, {
        position: 'absolute',
        top: '10px',
        right: '20px',
        color: '#aaa',
        fontSize: '28px',
        fontWeight: 'bold',
        cursor: 'pointer',
    });

    closeButton.addEventListener('click', () => {
        closeModal(modal);
    });

    const modalText = document.createElement('p');
    modalText.textContent = 'Choose your Pokémon for next battle!';
    Object.assign(modalText.style, {
        marginBottom: '20px',
        fontSize: '16px',
        marginBottom:'45px',
        fontWeight: 'bold',
    });
    modalContent.appendChild(modalText);

    const cardContainer = document.createElement('div');
    Object.assign(cardContainer.style, {
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        flexWrap: 'wrap',
        
    });

    mypokemons.forEach(element => {
        const card = document.createElement('div');
        Object.assign(card.style, {
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '14px',
            cursor: 'pointer',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s',
        });
        card.classList.add('card');
        card.innerHTML = `<div style="font-weight: bold; margin-bottom: 8px;">${element.species}</div>
        <img src="${element.sprite}" alt="${element.species}" style="width: 100px; height: 100px;"/>`;

        cardContainer.appendChild(card);

        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });

    modalContent.appendChild(closeButton);
    modalContent.appendChild(cardContainer);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    document.querySelectorAll('.card').forEach((card) => {
        card.addEventListener('click', () => {
            let cardname = (card.firstElementChild.innerHTML);
            for (let i = 0; i < mypokemons.length; i++) {
                const element = mypokemons[i];
                if (element.species === cardname) {
                    mypokemons.splice(i, 1);
                    mypokemons.unshift(element);
                    closeModal(modal);
                    break;
                }
            }
        });
    });
});

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.removeChild(modal);
}
