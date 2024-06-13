
const battlebg = new Image();
battlebg.src = './assets/bg1.jpg';

const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: battlebg
});

let enemyPokemon;
let myPokemon;


let enemy;
let myPoke;
let queue = [];
let animationFrame;
let myMoves=[];
let enemyMoves=[];

async function getMoves(pokemonObject, n) {
    let req = await fetch("https://pokeapi.co/api/v2/pokemon/" + pokemonObject.species.toLowerCase());
    let pokemon = await req.json();
    let a = {};
    
    for (let i = 15; i < n+15 && i < pokemon.moves.length; i++) {
        let moveReq = await fetch(pokemon.moves[i].move.url);
        let move = await moveReq.json();
        a[pokemon.moves[i].move.name] = {
            name: move.name,
            damage: move.power,
            type: move.type.name
        };
    }

    return a;
}


async function initBattle() {
    myPokemon= mypokemons[0]
    enemyPokemon = await getPokemon(Math.floor(Math.random() * 50 + 50));
    myMoves = await getMoves(myPokemon, 4);
    enemyMoves = await getMoves(enemyPokemon, 4);
    // console.log(enemyMoves)
    let enemyname = document.querySelector('#enemyPokemonName');
    enemyname.innerText = `${enemyPokemon.species}`;

    enemy = new Monster({
        position: {
            x: 820,
            y: 129
        },
        health:enemyPokemon.baseStats.hp,
        image: {
            src: enemyPokemon.sprite
        },
        isEnemy: true,
        name: enemyPokemon.species,
        attacks: Object.values(enemyMoves)
    });
    let mypokemon = document.querySelector('#myPokemonName');
    mypokemon.innerText = `${myPokemon.species}`;
    myPoke = new Monster({
        position: {
            x: 255,
            y: 320
        },
        health:myPokemon.baseStats.hp,
        image: {
            src: myPokemon.backSprite
        },
      
        name: myPokemon.species,
        attacks:Object.values(myMoves)
    });

    queue = [];
    uiElements = document.querySelectorAll('.ui');
    document.querySelector('#attacksBox').replaceChildren();
    document.querySelector('#dialogueBox').style.display = 'none';
    uiElements.forEach(element => {
        element.style.display = 'block';
    });

    gsap.to('#overlappingDiv', {
        opacity: 0
    });

    document.querySelector('#enemyHealth').style.width = '100%';
    document.querySelector('#myHealth').style.width = '100%';

    myPoke.attacks.forEach(attack => {
        const button = document.createElement('button');
        button.innerHTML = attack.name;
        document.querySelector('#attacksBox').append(button);
    });

    document.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', (e) => {
            const selectedAttack = myMoves[e.currentTarget.innerHTML];
            myPoke.attack({
                attack: selectedAttack,
                recipient: enemy
            });
            if (enemy.health <= 0) {
                queue.push(() => {
                    enemy.faint();
                });
                queue.push(() => {
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        onComplete: () => {
                            cancelAnimationFrame(animationFrame);
                            animate();
                            var uiElements = document.querySelectorAll('.ui');
                            uiElements.forEach(element => {
                                element.style.display = 'none';
                            });
                            gsap.to('#overlappingDiv', {
                                opacity: 0
                            });
                            battle.initiated = false;
                            audio.battle.stop();
                            audio.initBattle.stop();
                            // audio.Map.play();
                            showCatchModal();
                        }
                    });
                });
            }

            const randomAttack = enemy.attacks[Math.floor(Math.random() * enemy.attacks.length)];

            queue.push(() => {
                enemy.attack({
                    attack: randomAttack,
                    recipient: myPoke
                });
                if (myPoke.health <= 0) {
                    queue.push(() => {
                        myPoke.faint();
                    });
                    queue.push(() => {
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            onComplete: () => {
                                cancelAnimationFrame(animationFrame);
                                animate();
                                var uiElements = document.querySelectorAll('.ui');
                                uiElements.forEach(element => {
                                    element.style.display = 'none';
                                });
                                gsap.to('#overlappingDiv', {
                                    opacity: 0
                                });
                                battle.initiated = false;
                                audio.battle.stop();
                                audio.initBattle.stop();
                                audio.Map.play();
                            }
                        });
                    });
                }
            });
        });

        button.addEventListener('mouseenter', (e) => {
            const selectedattack = myMoves[e.currentTarget.innerHTML];
            document.querySelector('#AttackType').innerHTML = selectedattack.type;
        });
    });
}

function animateBattle() {
    animationFrame = window.requestAnimationFrame(animateBattle);
    battleBackground.image.width = canvas.width;
    battleBackground.image.height = canvas.height;
    c.drawImage(battleBackground.image, 0, 0, canvas.width, canvas.height);

    enemy.moving = true;
    enemy.draw();
    myPoke.moving = true;
    myPoke.draw();
}

const dialogueBox = document.querySelector('#dialogueBox');
if (dialogueBox) {
    dialogueBox.addEventListener('click', (e) => {
            if (queue.length > 0) {
                queue[0]();
                queue.shift();
            } else {
                e.currentTarget.style.display = 'none';
            }
        });
    }
    function showCatchModal() {
        const modal = document.createElement('div');
        Object.assign(modal.style, {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'fixed',
            zIndex: '1',
            left: '0',
            top: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
        });
    
        const modalContent = document.createElement('div');
        Object.assign(modalContent.style, {
            backgroundColor: '#fff',
            padding: '20px',
            border: '1px solid #888',
            width: '80%',
            maxWidth: '400px',
            textAlign: 'center',
        });
    
        const modalText = document.createElement('p');
        modalText.textContent = 'Do you want to catch the fainted Pokémon?';
        modalText.style.marginBottom = '20px';
        modalContent.appendChild(modalText);
    
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
    
        const catchButton = createButton('Catch', () => {
            console.log('Pokémon caught!');
            mypokemons.push(enemyPokemon)
            console.log(mypokemons)
            closeModal(modal);
        });
        buttonContainer.appendChild(catchButton);
    
        const leaveButton = createButton('Leave', () => {
            console.log('Pokémon left!');
            closeModal(modal);
        });
        buttonContainer.appendChild(leaveButton);
    
        modalContent.appendChild(buttonContainer);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }
    
    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        Object.assign(button.style, {
            padding: '10px 20px',
            margin: '0 10px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
        });
        button.addEventListener('click', onClick);
        return button;
    }
    
    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.removeChild(modal);
    }
    
    
        // initBattle();
        // animateBattle();