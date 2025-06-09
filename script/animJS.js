import { animate, utils, createSpring, createTimeline, engine } from 'https://cdn.jsdelivr.net/npm/animejs@4.0.0/+esm'

const [ $frame ] = utils.$('.frame');
const [ $frameText ] = utils.$('.frameText');
const [ container ] = utils.$('.container');
let randomDelay = utils.random(0, 600);
const somethingAudio = new Audio('assets/something.mp3');
const ladder = utils.$('.ladder');
const scrollElement = 
    window.document.scrollingElement ||
    window.document.body ||
    window.document.documentElement;



engine.defaults.delay = 550; // Play the animations when the loader animation is finished

const playAudio = () => {
  isAudioUnlocked(somethingAudio).then(unlocked => {
    if (unlocked) {
        somethingAudio.play();
        animate(".hands", {
          translateY: ["0", "85%"],
          duration: 1000,
          ease: "easeOutQuad",
          alternate: true,
          loopDelay: 1000,
          loop: 1,
        })
        container.removeEventListener('mouseover', playAudio)
}
  }, { once: true })
}
container.addEventListener('mouseover', playAudio)

const frameAnimation = animate($frame,{  
    transform: ['scaleX(0)', 'scaleX(1)'],
    ease: 'cubic-bezier(0.25,-0.03, 0.82, 0.83)', 
    duration: 200,        
});


const frameAnimationText = animate($frameText.children,{
    opacity: [0,1],
    ease: 'easeOutQuad',    
    delay: (_, i) => i * 20,
});

const spark1Appear = animate("#spark1", {
  scale: [0, 1, 0],
  ease: 'steps(2)',
  duration: 600,
  loopDelay: 8000,      
  loop: true,
  alternate: true,
});

const spark2Appear = animate("#spark2", {
  scale: [0, 1, 0],
  ease: 'steps(2)',
  duration: 600,
  delay: () => randomDelay,
  loopDelay: 8000,      
  loop: true,
  alternate: true,
  onLoopComplete: () => {
    randomDelay = utils.random(0, 600);
  }
});

const lightBulbAppear = animate(".string", {
  height: ["0", "5rem"],
  ease: createSpring({stiffness: 100, damping: 10}),
  duration: 200,
});


ladder[0].addEventListener('click', () => {
  if(window.scrollY >= 320){
    window.scrollTo({
      top: 0,    
      behavior: 'smooth'
    });
  }else{
    window.scrollTo({
      top: 320,    
      behavior: 'smooth'
    });
  }
})

animate(['feTurbulence', 'feDisplacementMap'], {
  baseFrequency: 0.03,
  scale: 40,
  ease: 'linear',
  alternate: true,
  duration: 1500,
  loop: true
});

