import { animate, utils, createSpring, createTimeline } from 'https://cdn.jsdelivr.net/npm/animejs@4.0.0/+esm'

const [ $frame ] = utils.$('.frame');
const [ $frameText ] = utils.$('.frameText');

const frameText = "Animation experiments";
const [ hands ] = utils.$('.hands');
const [ container ] = utils.$('.container');
let randomDelay = utils.random(0, 600);
const somethingAudio = new Audio('assets/something.mp3');

async function isAudioUnlocked(audioElement) {
  // Try to play the audio (muted to avoid sound)
  const prevMuted = audioElement.muted;
  audioElement.muted = true;
  try {
      await audioElement.play();
      audioElement.pause(); // Stop playback if it worked
      audioElement.muted = prevMuted;
      return true;
  } catch (e) {
      audioElement.muted = prevMuted;
      return false;
  }
}

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


for (let i = 0; i < frameText.length; i++) {
    const node = document.createElement('span');
    node.innerHTML = frameText[i] === ' ' ? '&nbsp;' : frameText[i];
    $frameText.appendChild(node);
}


for(let i = 0; i < 10; i++){
    const newHand = hands.cloneNode(true);
    newHand.style.rotate = `${i * 36}deg`;
    container.appendChild(newHand);
}


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

animate(['feTurbulence', 'feDisplacementMap'], {
  baseFrequency: 0.03,
  scale: 40,
  ease: 'linear',
  alternate: true,
  duration: 1500,
  loop: true
});


const frameTimeline = createTimeline()
.add(frameAnimation)
.add(frameAnimationText);


const sparkTimeline = createTimeline()
.add(spark1Appear)
.add(spark2Appear);

const timeline = createTimeline()
.sync(frameTimeline)
.sync(sparkTimeline);
