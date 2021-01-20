<template>
<div id="container"></div>
</template>

<script>

export default {
    async mounted() {
        await this.mainGame()
    },

    methods: {
        async mainGame() {
            this.PIXI = this.$PIXI();

            this.app = new this.PIXI.Application({
                transparent: true,
                width: window.innerWidth,
                height: window.innerHeight
            });

            document.querySelector('#container').appendChild(this.app.view);

            await this.loadAssets({
                dino: '/dino/spritesheet.json',
                foreground: '/foreground/spritesheet.json'
            })

            const character = this.character()
            const foregrounds = this.foregrounds('blue')

            const initialForeGrounds = [
                foregrounds[0],
                foregrounds[8],
                foregrounds[0],
                foregrounds[0],
                foregrounds[8]
            ];

            this.initialPlatform(initialForeGrounds)

            this.app.stage.addChild(character)
            initialForeGrounds.map((obj) => {
                this.app.stage.addChild(obj)
                })

            // this.foregroundGen([{
            //         sprite: sprite,
            //         y: 0
            //     }, {
            //         sprite: sprite,
            //         y: 0
            // }])

            window.onresize = () => {
                this.app.renderer.resize(window.innerWidth, window.innerHeight);

                const width = this.app.screen.width
                const height = this.app.screen.height

                character.x = width / 6
                character.y = height - height / 6
            }
        },
        loadAssets (textures) {
            return new Promise(resolve => {
                Object.keys(textures).map((key) => {
                    this.PIXI.Loader.shared.add(key, textures[key]);
                })
                    this.PIXI.Loader.shared.load(resolve);
                });
        },
        character() {

            const width = this.app.screen.width
            const height = this.app.screen.height

            const resource = this.PIXI.Loader.shared.resources['dino'];
            const sprite = new this.PIXI.AnimatedSprite(resource.spritesheet.animations.walk);

            sprite.x = width / 6
            sprite.y = height - height / 6
            sprite.height = 96
            sprite.width = 96
            sprite.anchor.set(0.5)
            sprite.animationSpeed = 0.1
            sprite.play()

            return sprite
        },
        foregrounds(color) {

            const resource = this.PIXI.Loader.shared.resources['foreground'];
            const sprites = Object.keys(resource.textures)
                .reduce((acc, key) => {
                    if(color){
                        if(key.includes(color)){
                            acc.push(new this.PIXI.Sprite(resource.textures[key]))
                        }
                    } else {
                        acc.push(new this.PIXI.Sprite(resource.textures[key]))
                    }
                    return acc
                }, [])

            return sprites

        },
        initialPlatform(foregrounds) {
            foregrounds.map((sprite, index) => {

                const width = this.app.screen.width
                const height = this.app.screen.height

                sprite.height = 48
                sprite.width = 48

                const offset = sprite.width * index
                sprite.x = (width / 6) + offset
                sprite.y = height - height / 8
                sprite.anchor.set(0.5)
            })
        },
        foregroundGen(foregrounds) {
            const width = this.app.screen.width
            const height = this.app.screen.height

            this.app.ticker.add(() => {
                foregrounds.map((foreground) => {
                    foreground.sprite.x += 48
                })
            })

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