
const monsters={
    Emby:{
        position:{
            x:330,
            y:360
        },
        image:{
            src:'https://github.com/KapilSareen/Poke-RPG/blob/main/assets/embySprite.png'
        },
        frames:{
            max:4,
            hold:30
        },
        name:'Emby',
        attacks:[attacks.Tackle,attacks.Fireball]
        
    },
    Draggle:{
        position:{
            x:850,
            y:180
        },
        image:{
            src:'https://github.com/KapilSareen/Poke-RPG/blob/main/assets/draggleSprite.png'
        },
        frames:{
            max:4,
            hold:30
        },
        isEnemy:true,
        name:'Draggle',
        attacks:[attacks.Tackle,attacks.Fireball]
        
    }
}