
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
    enemyPokemon = await getPokemon(Math.floor(Math.random() * 50 + 50));
    myPokemon = await getPokemon(25);

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
                            audio.Map.play();
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
            console.log(selectedattack)
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
            console.log('clicked');
            if (queue.length > 0) {
                queue[0]();
                queue.shift();
            } else {
                e.currentTarget.style.display = 'none';
            }
        });
    }
    
    
        // initBattle();
        // animateBattle();