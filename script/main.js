function invert(rgb) {
    rgb = Array.prototype.join.call(arguments).match(/(-?[0-9\.]+)/g);
    for (var i = 0; i < rgb.length; i++) {
      rgb[i] = (i === 3 ? 1 : 255) - rgb[i];
    }
    return rgb;
  }

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
  
// main 
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

const $frameText = document.querySelector('.frameText');
const frameText = "Animation experiments";
const hands = document.querySelector('.hands');
const container = document.querySelector('.container');
const ladder = document.querySelector('.ladder');

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

window.addEventListener('beforeunload', () => {          
    window.scrollTo({
        top: 320,        
    });
});

window.addEventListener('load', () => {
    window.scrollTo({
        top: 320,
    });
});