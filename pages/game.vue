<template>
<div id="container"></div>
</template>

<script>
const state = {
    INTRO: 0,
    PLAY: 1,
    SHOW: 2,
    OUTRO: 3
}
export default {
    data() {
        return {
            PIXI: undefined,
            app: undefined,
            player: undefined,
            initialGround: [],
            ground: undefined,
            speedX: 0,
            speedY: 0,
            playerBounds: undefined,
            state: state.INTRO

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

            this.initialGround = [
                this.GroundByColor('blue',8, 50, 0),
                this.GroundByColor('blue',0, 50, 1),
                this.GroundByColor('blue',0, 50, 2),
                this.GroundByColor('blue',8, 50, 3),
                // this.GroundByColor('blue',0, 50, 2),
                // this.GroundByColor('blue',0, 50, 3),
                // this.GroundByColor('blue',8, 50, 4)
            ];

            console.log(this.initialGround)
            this.initialGround.map((obj) => this.app.stage.addChild(obj))
            this.app.stage.addChild(this.player)

            this.playerBounds = new this.PIXI.Graphics();
            this.playerBounds.lineStyle(2, 0xFF0000);
            this.playerBounds.drawRect(0, 0, 100, 100);

            this.app.stage.addChild(this.playerBounds)
            
            this.onResize()

            this.app.ticker.add((delta) => this.onUpdate())
        },
        onUpdate() {
            this.player.onUpdate()
            
            this.playerBounds.x = this.player.x - this.player.width/2
            this.playerBounds.y = this.player.y - this.player.height/2
            this.playerBounds.width = this.player.width
            this.playerBounds.height = this.player.height
            // this.playerBounds.zIndex = 3
            // this.player.zIndex = 4

            this.initialGround.map((ground) => {
                if(this.rectsIntersectX(this.player, ground)){
                    this.speedX = 0
                } else if(this.rectsIntersectY(this.player, ground, 6)) {
                    this.speedY = 0
                } else {
                    this.speedX = 4
                    this.speedY = 4
                }
            })
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

            sprite.x = 96
            sprite.y = 0
            sprite.height = 96
            sprite.width = 96
            sprite.anchor.set(0.5)
            sprite.animationSpeed = 0.1
            sprite.play()

            sprite.onResize = (width, height) => {
                sprite.x = 96
                sprite.y = 0
            }

            sprite.onUpdate = () => {
                sprite.y += this.speedY
            }

            return sprite
        },
        GroundByColor(color, variant, y, offset) {
            if(!color) return
            if(isNaN(variant)) return

            const width = this.app.screen.width
            const height = this.app.screen.height

            const resource = this.PIXI.Loader.shared.resources['foreground'];
            const sprite = new this.PIXI.Sprite(resource.spritesheet.textures[`${color}-${variant}.png`])

            sprite.width = 48
            sprite.height = 48
            sprite.x = 0 + offset * sprite.width
            sprite.y = height - y

            sprite.onResize = (width, height) => {
                sprite.y = height - y
            }

            return sprite
        },
        rectsIntersectX(a, b) {
            let aBox = a.getBounds()
            let bBox = b.getBounds()

            return aBox.x + aBox.width > bBox.x &&
                   aBox.x < bBox.x + bBox.width
        },
        rectsIntersectY(a, b, offset) {
            let aBox = a.getBounds()
            let bBox = b.getBounds()

            return aBox.y + aBox.height - offset > bBox.y &&
                   aBox.y < bBox.y + bBox.height - offset
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