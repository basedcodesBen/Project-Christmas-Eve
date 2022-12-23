// welcome page background animation
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const interval = 1000 / 60;
let canvasWidth, canvasHeight;

let imgData = {};
let startPoint = {};
const particles = [];

const img = new Image();
img.src = getImageSrc();
img.onload = () => {
  init();
  render();
};

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 1;
    this.colorDeg = randomNumBetween(0, 50);
    this.vx = randomNumBetween(-1, 1) * 0.17;
    this.vy = randomNumBetween(-1, 1) * 0.17;
    this.opacity = randomNumBetween(10, 50) * 0.01;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.opacity -= 0.005;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(canvasWidth / 2 - imgData.width / 2 + this.x, canvasHeight / 2 - imgData.height / 2 + this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.colorDeg}, 100%, 85%, ${this.opacity})`;
    ctx.fill();
  }
}

function resize() {
  canvasWidth = innerWidth;
  canvasHeight = innerHeight;
  canvas.style.width = canvasWidth + "px";
  canvas.style.height = canvasHeight + "px";
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
}

function init() {
  resize();
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, img.width, img.height);
  //ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  imgData.data = new Array(data.height).fill(0).map(() => new Array(data.width));
  for (let y = 0; y < data.height; y++) {
    for (let x = 0; x < data.width; x++) {
      const value = data.data[(data.width * y + x) * 4 + 3];
      imgData.data[y][x] = value > 0 ? 1 : 0;
    }
  }
  console.log(imgData.data);

  imgData.width = data.width;
  imgData.height = data.height;

  startPoint = getStartPoint();
  console.log(startPoint);
  fillTile(startPoint.x, startPoint.y, -1);
}

function getStartPoint() {
  for (let y = imgData.height - 1; y >= 0; y--) {
    for (let x = imgData.width - 1; x >= 0; x--) {
      if (imgData.data[y][x] === 1) return { x, y };
    }
  }
}

function createParticles(x, y) {
  const TOTAL = 1;
  for (let i = 0; i < TOTAL; i++) {
    const particle = new Particle(x, y);
    particles.push(particle);
  }
}

function fillTile(x, y, targetValue) {
  if (x > imgData.width - 1 || x < 0 || y > imgData.height - 1 || y < 0) return;
  if (imgData.data[y][x] === 0 || imgData.data[y][x] === targetValue) return;

  imgData.data[y][x] = targetValue;

  createParticles(x, y);

  setTimeout(() => {
    fillTile(x + 1, y, targetValue);
    fillTile(x - 1, y, targetValue);
    fillTile(x, y + 1, targetValue);
    fillTile(x, y - 1, targetValue);
  }, 0);
}

function render() {
  let now, delta;
  let then = Date.now();
  let count = 0;

  const frame = () => {
    requestAnimationFrame(frame);
    now = Date.now();
    delta = now - then;
    if (delta < interval) return;

    ctx.fillStyle = "#00000010";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    if (++count % 100 === 0) {
      fillTile(startPoint.x, startPoint.y, count * -1);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();

      if (particles[i].opacity <= 0) particles.splice(i, 1);
    }

    then = now - (delta % interval);
  };
  requestAnimationFrame(frame);
}

window.addEventListener("resize", resize);

function randomNumBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function getImageSrc() {
  return "data:image/png;base64,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";
}
