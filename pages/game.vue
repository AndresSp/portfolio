<template>
<div id="container"></div>
</template>

<script>

export default {
    mounted() {
        const PIXI = this.$PIXI();

        this.app = new PIXI.Application({
            transparent: true,
            width: window.innerWidth,
            height: window.innerHeight
        });

        // app.renderer.resize(window.innerWidth, window.innerHeight);
        window.onresize = this.onResize
        window.onOri

        document.querySelector('#container').appendChild(this.app.view);

        this.app.loader
        .add('/dino/dinospritesheet.json')
        .load(this.onDinoLoaded);

    },

    methods: {
        onDinoLoaded() {
        const PIXI = this.$PIXI();
        let frames = []

        for (let i = 0; i < 24; i++) {
            frames.push(PIXI.Texture.from(`dino-${i}.png`))
        }

        this.dino = new PIXI.AnimatedSprite(frames)

        const width = this.app.screen.width
        const height = this.app.screen.height

        this.dino.x = width / 2
        this.dino.y = height / 2
        this.dino.height = 72
        this.dino.width = 72
        this.dino.anchor.set(0.5)
        this.dino.animationSpeed = 0.1
        this.dino.play()

        this.app.stage.addChild(this.dino)
        },
        onResize() {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
            this.dino.x = this.app.screen.width / 2
            this.dino.y = this.app.screen.height / 2
            this.dino.height = 72
            this.dino.width = 72
            this.dino.anchor.set(0.5)
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