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

        this.setDinoProps()
        this.dino.play()

        this.app.stage.addChild(this.dino)
        },
        onResize() {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
            this.setDinoProps()
        },
        setDinoProps() {
            const width = this.app.screen.width
            const height = this.app.screen.height
            this.dino.x = width / 6
            this.dino.y = height - height / 6
            this.dino.height = 96
            this.dino.width = 96
            this.dino.anchor.set(0.5)
            this.dino.animationSpeed = 0.1
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