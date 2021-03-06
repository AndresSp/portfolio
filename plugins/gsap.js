import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { GSDevTools } from 'gsap/GSDevTools';
import { CustomEase } from 'gsap/CustomEase';
import { CustomWiggle } from 'gsap/CustomWiggle';
import { PhysicsPropsPlugin } from 'gsap/PhysicsPropsPlugin';
import { Physics2DPlugin } from 'gsap/Physics2DPlugin';

export default ({ app }, inject) => {
    // Inject $hello(msg) in Vue, context and store.
    gsap.registerPlugin(
      SplitText, 
      ScrambleTextPlugin,
      CustomEase, 
      CustomWiggle,
      Physics2DPlugin, 
      GSDevTools
      );

    inject('gsap', () => gsap)
    inject('SplitText', () => SplitText)
    inject('ScrambleText', () => ScrambleTextPlugin)
    inject('CustomEase', () => CustomEase)
    inject('CustomWiggle', () => CustomWiggle)
    inject('Physics2DPlugin', () => Physics2DPlugin)
    inject('GSDevTools', () => GSDevTools)

  }