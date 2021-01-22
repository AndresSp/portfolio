<template>
<div id="container"></div>
</template>

<script>
const gameState = {
    INTRO: 0,
    PLAY: 1,
    SHOW: 2,
    OUTRO: 3
}

const playerState = {
    IDLE: 0,
    WALK: 1,
    JUMP: 2,
    FALL: 3,
    HURT: 4
}

export default {
    data() {
        return {
            PIXI: undefined,
            app: undefined,
            gameState: gameState.INTRO,
            player: undefined,
            prevPlayerState: playerState.HURT,
            playerState: playerState.HURT,
            vX: 0,
            vY: 0,
            playerBounds: undefined,
            initialGround: [],
            ground: undefined,
            groundGravity: 5,
            jumpHeight: 96 * 3

        }
    },
    async mounted() {
        this.PIXI = this.$PIXI();

        this.app = new this.PIXI.Application({
                transparent: true,
                width: window.innerWidth,
                height: window.innerHeight
            });

        document.querySelector('#container').appendChild(this.app.view);

        await this.init()

        window.addEventListener('resize', this.onResize)
    },

    methods: {
        async init() {

            await this.loadAssets({
                dino: '/dino/spritesheet.json',
                foreground: '/foreground/spritesheet.json'
            }).then(() => this.draw())

        },
        draw() {
            this.player = this.Player()

            this.initialGround = this.genInitialGrounds()

            this.initialGround.map((obj) => this.app.stage.addChild(obj))
            this.app.stage.addChild(this.player)

            this.playerBounds = new this.PIXI.Graphics();
            this.playerBounds.lineStyle(2, 0xFF0000);
            this.playerBounds.drawRect(0, 0, 100, 100);

            // this.app.stage.addChild(this.playerBounds)
            
            this.onResize()

            this.app.ticker.add((delta) => this.onUpdate(delta))
        },
        onUpdate(delta) {

            this.playerBounds.x = this.player.x - this.player.width/2
            this.playerBounds.y = this.player.y - this.player.height/2
            
            this.playerBounds.width = this.player.width
            this.playerBounds.height = this.player.height

            //#region collision

            const nearbyGround = this.initialGround.reduce((smallest, current) => {
                if(!smallest){
                    return current
                }
                const dSmallest = this.distance(this.player, smallest)
                const dCurrent = this.distance(this.player, current)

                if(dCurrent < dSmallest){
                    return current
                } else {
                    return smallest
                }
            }, undefined)

            //#endregion collision

            //#region player animation

            const resource = this.PIXI.Loader.shared.resources['dino'];

            if(this.prevPlayerState != this.playerState){
                switch (this.playerState) {
                case playerState.HURT:
                    this.player.textures = resource.spritesheet.animations.hurt
                    break;

                case playerState.WALK:
                    this.player.textures = resource.spritesheet.animations.walk
                    break;

                case playerState.JUMP:
                    this.player.textures = resource.spritesheet.animations.walk
                    break;
                }

                this.player.play()
                this.prevPlayerState = this.playerState
            }

            //#endregion player animation

            //#region player state

            if(this.playerState == playerState.JUMP){ //JUMP
                this.vY = -10;
                if(this.player.y <= this.app.screen.height - this.jumpHeight){
                    this.playerState = playerState.FALL
                }
            }

            if(this.playerState == playerState.WALK || //COLLISION
               this.playerState == playerState.FALL ||
               this.playerState == playerState.HURT && this.gameState == gameState.INTRO){
                if(this.collision(this.player, nearbyGround, 7)){
                    this.vY = 0
                    if(this.playerState != playerState.WALK && this.playerState == playerState.FALL){
                        this.playerState = playerState.WALK
                    }
                } else {
                    this.vY = 10
                }
            }

            //#endregion player state

            //#region game state

            if(this.initialGround.every(ground => ground.y > this.player.y && ground.y > 50) 
            && this.gameState == gameState.INTRO){
                this.gameState = gameState.PLAY
                this.playerState = playerState.WALK
            }

            //#endregion game state

            //#region loops

            this.player.onUpdate(delta)

            this.initialGround.map((ground, i) => { //falling grounds
                ground.onUpdate(delta)
            })

            //#endregion loops
        },
        onResize() {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);

            const width = this.app.screen.width
            const height = this.app.screen.height

            this.player.onResize(width, height)
            this.initialGround.map((ground) => ground.onResize(width, height))

        },
        loadAssets (textures) {
            return new Promise(resolve => {
                Object.keys(textures).map((key) => {
                    this.PIXI.Loader.shared.add(key, textures[key]);
                })
                    this.PIXI.Loader.shared.load(resolve);
                });
        },
        Player() {

            const width = this.app.screen.width
            const height = this.app.screen.height

            const resource = this.PIXI.Loader.shared.resources['dino'];
            const sprite = new this.PIXI.AnimatedSprite(resource.spritesheet.animations.hurt);

            sprite.height = 96
            sprite.width = 96
            sprite.x = 96
            sprite.y = -2000
            sprite.anchor.set(0.5)
            sprite.animationSpeed = 0.1
            sprite.play()

            sprite.onResize = (width, height) => {
                sprite.x = 96
                // sprite.y = 0
            }

            window.onkeyup = (event) => {
                if(event.keyCode == 32 && this.playerState == playerState.WALK) { //Space
                    this.playerState = playerState.JUMP
                }
            }

            sprite.onUpdate = (delta) => {
                sprite.x += this.vX
                sprite.y += this.vY
            }

            return sprite
        },
        GroundByColor(color, variant, yOffset, index) {
            if(!color) return
            if(isNaN(variant)) return

            const width = this.app.screen.width
            const height = this.app.screen.height

            const resource = this.PIXI.Loader.shared.resources['foreground'];
            const sprite = new this.PIXI.Sprite(resource.spritesheet.textures[`${color}-${variant}.png`])

            sprite.width = 48
            sprite.height = 48
            sprite.x = 0 + index * sprite.width
            sprite.y = 0 - (sprite.height * 2 * index)

            sprite.onResize = (width, height) => {
                if(this.gameState != gameState.INTRO){
                    sprite.y = height - yOffset
                }
            }

            sprite.onUpdate = (delta) => {
                if(sprite.y < height - yOffset){
                    sprite.y += this.groundGravity
                } else {
                    sprite.y = height - yOffset
                }
                
            }

            return sprite
        },
        genInitialGrounds() {
            const width = this.app.screen.width
            const maxGrounds = width / 48 // 48 == ground width
            let arr = []

            for (let index = 0; index < maxGrounds; index++) {
                arr.push(this.GroundByColor('blue', index % 4 ? 0 : 8, 50, index))
            }

            return arr
        },
        collision(a, b, yOffset) {
            const aBox = a.getBounds()
            const bBox = b.getBounds()


            return aBox.x < bBox.x + bBox.width &&
            aBox.x + aBox.width > bBox.x &&
            aBox.y < bBox.y + bBox.height &&
            aBox.y + aBox.height - yOffset > bBox.y
        },
        distance(a, b) {
            const aBox = a.getBounds()
            const bBox = b.getBounds()

            return Math.sqrt((aBox.x - bBox.x) ** 2 + (aBox.y - bBox.y) ** 2)

        }

    }
}
</script>

<style>
#container {
    display: flex;
    justify-content: center;
    height: 100%;
    overflow: hidden;
}
</style>