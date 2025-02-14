const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const width = window.innerWidth;
const height = window.innerHeight;
const scale = 1.0
const nbOfParticles = (canvas.height * canvas.width) / 3000;
const imageCache = [];
const offScreenCanvas = document.createElement('canvas');
const offScreenCtx = offScreenCanvas.getContext('2d');

let particlesArray;
let imgArray = ["etoile.png", "bed.png", "table.png"]
let startTime = performance.now();

canvas.width = width * scale;
canvas.height = height * scale;
ctx.scale(scale, scale);


class Particle {
    constructor(x, y, size, colour) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.colour = colour;
    }

    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        if(this.size > 2*scale){
            ctx.filter = 'blur(1.5px)';
        }
        ctx.fillStyle = this.colour;
        ctx.fill();
        ctx.restore();
    }

    update(){
        if(this.size < 2*scale){
            this.size += 1.5*scale;
        }
        else{
            this.size -= 1.5*scale;
        }
    }
}

function init(){
    particlesArray = [];
    for(let i = 0; i < nbOfParticles; i++){
        let size = 3*Math.random()*scale;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let colour = '#fff';
        particlesArray.push(new Particle(x, y, size, colour));
    }
}

function preloadImages() {
    for (let i = 0; i < imgArray.length; i++) {
        const img = new Image();
        img.src = 'src/assets/' + imgArray[i];
        imageCache.push(img);
    }

    // Draw images on the off-screen canvas once they are loaded
    Promise.all(imageCache.map(img => new Promise(resolve => {
        img.onload = resolve;
    }))).then(() => {
        drawImagesOnOffScreen();
    });
}

function drawImagesOnOffScreen() {
    offScreenCanvas.width = window.innerWidth;
    offScreenCanvas.height = window.innerHeight;
    // Ratio scaling permits proper scaling of the images, based on the height of the screen
    const ratioScaling = 965/window.innerHeight;
    const AVG_IMG_WIDTH = 65/ratioScaling;

    const nbLines = Math.floor(window.innerHeight/(AVG_IMG_WIDTH*4));
    // We want to place 1 image per columns, every 4 * img width (permits proper spacing)
    const nbCols = Math.floor(window.innerWidth/(AVG_IMG_WIDTH*4));

    const lineHeight = window.innerHeight/nbLines;
    const colWidth = (window.innerWidth/nbCols);

    console.log(nbCols, nbLines)
    let img = null;
    for (let i = 0; i < nbLines * nbCols; i++) {
        img = imageCache[Math.floor(Math.random() * imageCache.length)];
        const offsetX = (colWidth/6) * (Math.floor(i / nbCols) % 2 == 0 ? 1 : -1) + (colWidth/3);
        const offsetY =  ((lineHeight/6)+ Math.random()*(lineHeight/3) * (i % 2 == 0 ? 1 : -1)) + (lineHeight/6);
        const X = ((i%nbCols) * colWidth) + offsetX
        const Y = (Math.floor(i/nbCols) * lineHeight)+offsetY
        offScreenCtx.drawImage(
            img,
            X,
            Y,
            img.width/ratioScaling,
            img.height/ratioScaling
        );
    }
}

function animate(timestamp) {
    diff = timestamp - startTime;
    if(diff >= 1500){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(offScreenCanvas, 0, 0); // Draw the off-screen canvas
        for (let i = 0; i < particlesArray.length; i++) {                
            particlesArray[i].draw();
            particlesArray[i].update();               
        }
        startTime = timestamp;
    }    
    requestAnimationFrame(animate);
}

init();
preloadImages();
animate();