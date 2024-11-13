const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


canvas.width = 400;
canvas.height = 600;


let bird = { x: 50, y: 150, width: 30, height: 30, velocity: 0, gravity: 0.3, lift: -6 };
let pipes = [];
let pipeWidth = 50;
let gap = 130; 
let score = 0;
let isGameOver = false;


const birdImage = new Image();
birdImage.src = "./images/bird.png.png";

const pipeImage = new Image();
pipeImage.src = "./images/tuberia.png.png";


function createPipe() {
  const topHeight = Math.random() * (canvas.height / 2.5); 
  pipes.push({
    x: canvas.width,
    topHeight: topHeight,
    bottomY: topHeight + gap,
  });
}


function drawBird() {
  ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}


function drawPipes() {
  pipes.forEach((pipe) => {
    
    ctx.drawImage(pipeImage, pipe.x, 0, pipeWidth, pipe.topHeight);
   
    ctx.drawImage(pipeImage, pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);

  
    pipe.x -= 2;
  });

 
  pipes = pipes.filter((pipe) => pipe.x + pipeWidth > 0);
}


function checkCollision() {
  pipes.forEach((pipe) => {
    if (
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + pipeWidth && 
      (bird.y < pipe.topHeight || bird.y + bird.height > pipe.bottomY)
    ) {
      isGameOver = true;
    }
  });

  
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    isGameOver = true;
  }
}


function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}


function restartGame() {
  bird = { x: 50, y: 150, width: 30, height: 30, velocity: 0, gravity: 0.3, lift: -6 };
  pipes = [];
  score = 0;
  isGameOver = false;
  createPipe(); 
}

// Lógica principal del juego
function updateGame() {
  bird.velocity += bird.gravity; 
  bird.y += bird.velocity; 

  if (bird.velocity > 5) bird.velocity = 5;

  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  drawScore();


  pipes.forEach((pipe) => {
    if (pipe.x + pipeWidth === bird.x) {
      score++;
    }
  });

  checkCollision();

  if (isGameOver) {
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 70, canvas.height / 2);
    ctx.fillText("Press Space to Restart", canvas.width / 2 - 130, canvas.height / 2 + 50);
    return;
  }

  requestAnimationFrame(updateGame);
}


setInterval(() => {
  if (!isGameOver) createPipe();
}, 2500);

// Controles
document.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "ArrowUp":
      bird.velocity = bird.lift; 
      break;
    case "ArrowDown":
      bird.y += 10; 
      break;
    case "ArrowLeft":
      bird.x -= 10; 
      break;
    case "ArrowRight":
      bird.x += 10; 
      break;
    case "Space":
      if (isGameOver) {
        restartGame();
        updateGame();
      }
      break;
  }
});


createPipe(); 
updateGame();
