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

            const [_, level] = await Promise.all([
                this.loadAssets({
                    dino: '/dino/spritesheet.json'
                }),
                // import("./assets/levels/level1.json")
            ]);

            const character = this.character()

            this.app.stage.addChild(character)

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
            const sprite = new this.PIXI.AnimatedSprite(resource.spritesheet.animations.idle);

            sprite.x = width / 6
            sprite.y = height - height / 6
            sprite.height = 96
            sprite.width = 96
            sprite.anchor.set(0.5)
            sprite.animationSpeed = 0.1
            sprite.play()

            return sprite
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