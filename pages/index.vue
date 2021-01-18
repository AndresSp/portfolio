<template>
  <main id="main" class="container mx-auto px-8 h-screen flex flex-col justify-start pt-32">
      <section class="flex justify-center font-title text-3xl md:text-6xl font-medium text-white tracking-wide ">
        <h1 id="name">I am n</h1>
      </section>
      <section class="flex justify-center font-title text-3xl md:text-6xl font-medium text-white tracking-wide mt-6">
        <h1 id="career">a c</h1>
      </section>
      <section id="dino-container" class="flex justify-center mt-20">
        <div id="inner-door"></div>
        <div id="door"></div>
        <div id="dino"></div>
      </section>
      <section class="flex justify-center font-title text-2xl md:text-4xl  font-normal text-white tracking-wide mt-16">
        <h1 id="continue">
          <span v-if="isDesktop">PRESS ANY BUTTON </span>
          <span v-else>TAP </span>
          TO CONTINUE</h1>
      </section>
      <section v-if="showSkip && introSeen" id="skip" class="flex justify-end font-title text-2xl text-white cursor-pointer mt-12">
        <h1 @click="skip">SKIP</h1>
      </section>
      <!-- <section v-else class="mt-12" style="color: transparent">TEXT</section> -->
    <!-- </div> -->
  </main>
</template>

<script>

import Bowser from 'bowser';

export default {

  data() {
    return {
      showSkip: true,
      isDesktop: false,
      introSeen: false,
      start: false
    }
  },

  mounted() {
    this.checkDevice()
    this.checkIfYouSawIntro()
    this.introAnim()
  },
  methods: {

    introAnim() {
      this.registerDecodeWord()
      this.registerDino()

      const gsap = this.$gsap()
      
      this.introTl = gsap.timeline();

      this.introTl
      .add(this.titles())
      .add(this.dinoIntro())
      .add(this.continue(), 24)
      .addLabel('skipIntro', '<')

      const GSDevTools = this.$GSDevTools()
      // GSDevTools.create();
    },

    startGame() {
      const gsap = this.$gsap()

      this.startGameIntroTl = gsap.timeline();

      this.continueTl.repeat(0)
      this.continueTl.set('#continue', { opacity: 0 })
      this.start = true

      this.startGameIntroTl.add(
        this.startGameIntro()
      )
    },

    //#region start game intro
    startGameIntro() {
      const gsap = this.$gsap()
      const CustomWiggle = this.$CustomWiggle()
      const CustomEase = this.$CustomEase()
      const SplitText = this.$SplitText()

      const nameChars = new SplitText('#name', {type:['chars']}).chars
      const careerChars = new SplitText('#career', {type:['chars']}).chars

      const earthquakeTl = gsap.timeline();

      let meteors = [],
      main = document.querySelector('#main');

      for (let i = 0; i < 10; i++) {
      const meteor = document.createElement('div');
      meteor.setAttribute('class', 'meteor');
      main.appendChild(meteor);
      meteors.push(meteor);
      }

      const meteorContainderWidth = main.offsetWidth

      earthquakeTl.set('.meteor', {
        left: `random(0, ${meteorContainderWidth})`,
        top: 'random(-60, -200)'
      })
      earthquakeTl.to('.meteor', {
        duration: 5,
        physics2D: {
          gravity: 'random(700, 1000)',
          friction: 0.02
        },
        stagger: {
          from: 'random',
          amount: 5.5
        }
      })

      CustomEase.create('earthquake', 'M0,0 C0,0 0.062,0 0.077,0 0.078,0.016 0.077,0.341 0.078,0.358 0.093,0.358 0.138,0.358 0.153,0.358 0.153,0.374 0.155,-0.37 0.156,-0.354 0.171,-0.354 0.214,-0.354 0.23,-0.354 0.23,-0.338 0.231,0.629 0.231,0.646 0.246,0.646 0.291,0.646 0.306,0.646 0.307,0.662 0.308,-0.37 0.308,-0.354 0.323,-0.354 0.368,-0.354 0.383,-0.354 0.383,-0.338 0.384,0.629 0.385,0.646 0.4,0.646 0.444,0.646 0.46,0.646 0.46,0.662 0.461,-0.37 0.461,-0.354 0.477,-0.354 0.522,-0.354 0.538,-0.354 0.538,-0.338 0.539,0.629 0.54,0.646 0.555,0.646 0.599,0.646 0.615,0.646 0.615,0.662 0.616,-0.37 0.616,-0.354 0.631,-0.354 0.676,-0.354 0.691,-0.354 0.692,-0.338 0.693,0.629 0.693,0.646 0.708,0.646 0.753,0.646 0.768,0.646 0.768,0.662 0.769,-0.37 0.77,-0.354 0.785,-0.354 0.829,-0.354 0.845,-0.354 0.845,-0.338 0.846,0.351 0.847,0.368 0.862,0.368 0.906,0.368 0.922,0.368 0.922,0.384 0.923,-0.017 0.923,0 0.938,0 1,0 1,0 ')
      
      earthquakeTl.to('#dino', { 
        duration: 1, 
        x: 30,
        ease: 'earthquake',
        repeat: 5
      }, '<3')

      earthquakeTl.dinoHurt('#dino', { duration: 1, repeat: 5 }, '<')

      earthquakeTl.to(nameChars, { 
        duration: 1, 
        x: 30,
        ease: 'earthquake',
        repeat: 2
      }, '<')

      earthquakeTl.to(nameChars, {
        duration: 3,
        physics2D: {
          gravity: 400
        },
        ease: 'power1.inOut',
        stagger: {
          grid: [1,14],
          from: 'random',
          ease: 'power2.in',
          amount: 1
        }
      }, '<')

      earthquakeTl.to(careerChars, { 
        duration: 1, 
        x: 30,
        ease: 'earthquake',
        repeat: 2
      }, '<')

      earthquakeTl.to(careerChars, {
        duration: 3,
        y: 1000,
        ease: 'power1.inOut',
        stagger: {
          grid: [1,14],
          from: 'random',
          ease: 'power2.in',
          amount: 1
        }  
      }, '<')
      
      earthquakeTl.to('#dino', {
        duration: 3,
        physics2D: {
          gravity: 400
        },
        onComplete: this.onCompleteMeteorsTransition
      }, '<2')

      return earthquakeTl
    },

    onCompleteMeteorsTransition() {
      this.$router.push('game')
    },
    //#endregion start game intro

    //#region intro

    skip () {
      const nextLabel = this.introTl.nextLabel()
      if(nextLabel == 'skipIntro'){
        this.introTl.seek('skipIntro', false)
      }
    },

    titles() {

      const gsap = this.$gsap()
      const SplitText = this.$SplitText()

      const lettersTl = gsap.timeline()

      const nameSplitted = new SplitText('#name', {type:['words']})
      const careerSplitted = new SplitText('#career', {type:['words']})

      const Iam = [nameSplitted.words[0], nameSplitted.words[1]]
      const n = [nameSplitted.words[2]]
      const a = [careerSplitted.words[0]]
      const c = [careerSplitted.words[1]]

      const green = '#B6FF00'
      const blue = '#00EFFF'
      const mid = '#3EDE59'

      
      lettersTl.to(Iam, {
        duration: 2,
        opacity: 1,
      })

      lettersTl.decodeWord(n, { newText: 'Mr Dino', color: green })
      lettersTl.decodeWord(n, { newText: 'AndresSp', color: green })
      lettersTl.decodeWord(n, { newText: 'Andrés Tuñón', color: green })

      lettersTl.to(a, {
        duration: 1,
        opacity: 1,
      })

      lettersTl.decodeWord(c, { newText: 'System Engineer', color: blue })
      lettersTl.decodeWord(c, { newText: 'Frontend Developer', color: blue })
      lettersTl.decodeWord(c, { newText: 'Lifelong Learner', color: blue })

      return lettersTl;
    },

    dinoIntro() {
      const gsap = this.$gsap()

      const dinoIntroTl = gsap.timeline()

      dinoIntroTl.to('#door', {
        transformPerspective: 1200,
        rotateY: '-105deg',
        backgroundColor: '#000000'
      })
      dinoIntroTl.dinoKick('#dino', { repeat: 0 }, '=-1')
      dinoIntroTl.dinoIdle('#dino', { repeat: 0 })
      dinoIntroTl.dinoWalk('#dino', { repeat: 0 })
      dinoIntroTl.to('#dino', { duration: 1, y: 25 }, '<')
      dinoIntroTl.set('#dino', { zIndex: 2 })
      dinoIntroTl.dinoIdle('#dino', { repeat: 0, right: false })
      dinoIntroTl.dinoWalk('#dino', { repeat: 1, right: false })
      dinoIntroTl.to('#dino', { duration: 2, x: -105 }, '<')
      dinoIntroTl.dinoIdle('#dino', { repeat: 0 })
      dinoIntroTl.set('#dino', { zIndex: 0 })
      dinoIntroTl.dinoWalk('#dino', { repeat: 0 })
      dinoIntroTl.to('#dino', { duration: 1, x: -80,y: 10 }, '<')
      dinoIntroTl.to('#door', {
        transformPerspective: 0,
        rotateY: '0deg',
        backgroundColor: '#1A1D0E'
      })
      dinoIntroTl.dinoKick('#dino', { repeat: 0 }, '=-1')
      dinoIntroTl.dinoIdle('#dino', { repeat: 0 })
      dinoIntroTl.set('#dino', { zIndex: 2 })
      dinoIntroTl.set('#inner-door', { zIndex: -3 })
      dinoIntroTl.set('#door', { zIndex: -2 })
      dinoIntroTl.dinoIdle('#dino')

      return dinoIntroTl
    },

    continue() {
      const gsap = this.$gsap()
      this.continueTl = gsap.timeline()
      this.continueTl.to('#continue', { duration: 1, repeat: 0, opacity: 1, ease: 'steps(2)',
      onStart: this.onStart })
      return this.continueTl.repeat(-1)
    },

    onStart() {
      this.showSkip = false

      if(process.client){
        window.addEventListener('keyup', this.onStartHandler)
        window.addEventListener('click', this.onStartHandler)
      }
    },

    onStartHandler(event) {
      this.startGame()
      window.removeEventListener('keyup', this.onStartHandler)
      window.removeEventListener('click', this.onStartHandler)
    },

    //#endregion intro

    //#region helpers
    registerDino() {
      const gsap = this.$gsap()

      gsap.registerEffect({
        name: 'dinoIdle',
        effect: (targets, config) => {
          const dinoTl = gsap.timeline()

          dinoTl.set(targets, {
            scaleX: config.right ? 1 : -1
          })

            dinoTl.fromTo(targets, { 
            backgroundPositionX: '0px'
          }, {
            duration: config.duration,
            repeat: config.repeat,
            backgroundPositionX: `-${3*96}px`,
            ease:'steps(3)'
          })

          return dinoTl
        },
        defaults: { repeat: -1 , duration: 1, right: true  },
        extendTimeline: true, 
        }
      )

      gsap.registerEffect({
        name: 'dinoWalk',
        effect: (targets, config) => {
          const dinoTl = gsap.timeline()

          dinoTl.set(targets, {
            scaleX: config.right ? 1 : -1
          })

            dinoTl.fromTo(targets, { 
            backgroundPositionX: `-${4*96}px`
          }, {
            duration: config.duration,
            repeat: config.repeat,
            backgroundPositionX: `-${9*96}px`,
            ease:'steps(5)'
          })

          return dinoTl
        },
        defaults: { repeat: -1, duration: 1, right: true },
        extendTimeline: true, 
        }
      )

      gsap.registerEffect({
        name: 'dinoKick',
        effect: (targets, config) => {
          const dinoTl = gsap.timeline()

          dinoTl.set(targets, {
            scaleX: config.right ? 1 : -1
          })

           dinoTl.fromTo(targets, { 
              backgroundPositionX: `-${10*96}px` 
            }, {
              duration: config.duration,
              repeat: config.repeat,
              backgroundPositionX: `-${13*96}px`,
              ease:'steps(3)'
            })
            return dinoTl
        },
        defaults: { repeat: -1, duration: 1, right: true },
        extendTimeline: true, 
        }
      )

      gsap.registerEffect({
        name: 'dinoHurt',
        effect: (targets, config) => {
          const dinoTl = gsap.timeline()

          dinoTl.set(targets, {
            scaleX: config.right ? 1 : -1
          })

          dinoTl.fromTo(targets, { 
            backgroundPositionX: `-${14*96}px`
          }, {
            duration: config.duration,
            repeat: config.repeat,
            backgroundPositionX: `-${16*96}px`,
            ease:'steps(2)'
          })

          return dinoTl
        },
        defaults: { repeat: -1, duration: 1, right: true },
        extendTimeline: true, 
        }
      )

      gsap.registerEffect({
        name: 'dinoSneak',
        effect: (targets, config) => {
          const dinoTl = gsap.timeline()

          dinoTl.set(targets, {
            scaleX: config.right ? 1 : -1
          })
          dinoTl.fromTo(targets, { 
        backgroundPositionX: `-${17*96}px`
        }, {
          duration: config.duration,
          repeat: config.repeat,
          backgroundPositionX: `-${23*96}px`,
          ease:'steps(6)'
        })
          return dinoTl
        },
        defaults: { repeat: -1, duration: 1, right: true },
        extendTimeline: true, 
        }
      )
    },

    registerDecodeWord(){
      const gsap = this.$gsap()
      gsap.registerEffect({
        name: 'decodeWord',
        effect: (targets, config) => {
          const decodeTl = gsap.timeline()

          decodeTl.set(targets, {
            color: 'white',
            textShadow: `0 0 0`
          });

          decodeTl.to(targets, {
            duration: 1,
            opacity: 1,
            scrambleText: {
              text: config.newText, 
              chars:'lowerCase', 
              revealDelay: 1, 
              tweenLength:false 
              },
          })
          decodeTl.to(targets, {
            duration: 0.5,
            textShadow: `0 0 10px ${config.color}, 0 0 10px ${config.color}, 0 0 10px ${config.color}`,
            ease: 'power4.in'
          })

          decodeTl.to(targets, {
            duration: 0.5, 
            color: `${config.color}`,
            textShadow: `0 0 5px ${config.color}, 0 0 0px ${config.color}, 0 0 0px ${config.color}`,
            ease:'none'
          })

            return decodeTl
        },
        defaults: {},
        extendTimeline: true, 
      })
    },

     checkDevice() {
       const bowser = Bowser.parse(window.navigator.userAgent)
       const platform = bowser.platform.type;
       this.isDesktop = platform == 'desktop'
     },

     checkIfYouSawIntro() {
       this.introSeen = localStorage.getItem('introSeen') == 'true'

       if(!this.introSeen){
         localStorage.setItem('introSeen', true)
       }
       
     }

     //#endregion helpers
  }

  

}
</script>

<style>
#name  > div {
  opacity: 0;
}

#career > div {
  opacity: 0;
}

#continue {
  opacity: 0
}

#dino-container {
  display: grid;
}

#door {
  grid-area: 1 / 1;
  background-color:  #1A1D0E;
  width: 80px;
  height: 96px;
  transform-origin: left;
  z-index: 1;
}

#inner-door {
  grid-area: 1 / 1;
  background-color: #0F4269;
  width: 80px;
  height: 96px;
}

#dino {
  grid-area: 1 / 1;
  width: 96px;
  height: 96px;
  background : url(~assets/dino/dino.png);
  background-repeat: no-repeat;
  background-size: cover;
  image-rendering: pixelated;
}

.meteor {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f1e3ce;
  position: absolute;
  box-shadow: 
    0 5px 10px 3px #FAE2BF,
    0 5px 10px 3px #EE9F2A inset,
    0 -10px 10px 3px #FAE2BF inset,
    0 -10px 20px 3px black inset,
    0 -5px 10px 3px #FAE2BF,
    0 -5px 10px 3px #EE9F2A,
    0 -20px 10px 3px #EE9F2A,
    0 -15px 10px 1px #EE9F2A,
    0 -30px 10px 0px #EE9F2A,
    0 -45px 15px 0px #EE9F2A;
  /* top: -40px;
  right: -40px; */
}

main {
  position: relative;
  overflow: hidden;
}
</style>
