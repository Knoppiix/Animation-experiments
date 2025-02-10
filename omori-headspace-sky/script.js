const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const width = window.innerWidth;
const height = window.innerHeight;
var scale = 1.3;
const randomSeed = Math.floor(Math.random()*10);

canvas.width = width * scale;
canvas.height = height * scale;
ctx.scale(scale, scale);

const nbOfParticles = (canvas.height * canvas.width) / 3000;

let particlesArray;
let imgArray = ["etoile.png", "bed.png", "table.png"]

const imageCache = [];
const offScreenCanvas = document.createElement('canvas');
const offScreenCtx = offScreenCanvas.getContext('2d');

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
        if(this.size > 1.5*scale){
            ctx.filter = 'blur(1.5px)';
        }
        ctx.fillStyle = this.colour;
        ctx.fill();
        ctx.restore();
    }

    update(){
        if(this.size < 1*scale){
            this.size += 0.8*scale;
        }
        else{
            this.size -= 0.8*scale;
        }
    }
}

function init(){
    particlesArray = [];
    for(let i = 0; i < nbOfParticles; i++){
        let size = 2*Math.random()*scale;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let colour = '#fff';
        particlesArray.push(new Particle(x, y, size, colour));
    }
}

function preloadImages() {
    for (let i = 0; i < imgArray.length; i++) {
        const img = new Image();
        img.src = imgArray[i];
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
    offScreenCanvas.width = canvas.width;
    offScreenCanvas.height = canvas.height;
    const nbLines = Math.floor(canvas.height / 10);
    const nbCols = Math.floor(canvas.width / 10);

    for (let i = 0; i < nbLines * nbCols; i++) {
        const offsetX = ((Math.random() * (canvas.width / 10)) / 4) * (Math.random() < 0.5 ? 1 : -1);
        const offsetY = ((Math.random() * (canvas.height / nbLines)) / 4) * (Math.random() < 0.5 ? 1 : -1);
        offScreenCtx.drawImage(imageCache[i % imageCache.length], 
            ((i%nbCols) * nbCols) + offsetX, 
            (Math.floor(i / nbCols)*nbLines) + offsetY);
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(offScreenCanvas, 0, 0); // Draw the off-screen canvas
    for (let i = 0; i < particlesArray.length; i++) {                
        particlesArray[i].draw();
        particlesArray[i].update();        
    }
}

init();
preloadImages();
animate()
setInterval(animate, 1500);