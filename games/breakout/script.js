const canvas = document.getElementById("breakoutCanvas");
const ctx = canvas.getContext("2d");

let x = canvas.width/2, y = canvas.height-30;
let dx = 2, dy = -2;
const ballRadius = 10;

const paddleHeight = 10, paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth)/2;

const brickRowCount = 5, brickColumnCount = 7;
const brickWidth = 50, brickHeight = 15;
const brickPadding = 10, brickOffsetTop = 30, brickOffsetLeft = 30;

let bricks = [];
for(let c=0;c<brickColumnCount;c++){
  bricks[c] = [];
  for(let r=0;r<brickRowCount;r++){
    bricks[c][r] = {x:0, y:0, status:1};
  }
}

let rightPressed = false, leftPressed = false;
document.addEventListener("keydown", e => {
  if(e.key=="Right"||e.key=="ArrowRight") rightPressed=true;
  if(e.key=="Left"||e.key=="ArrowLeft") leftPressed=true;
});
document.addEventListener("keyup", e => {
  if(e.key=="Right"||e.key=="ArrowRight") rightPressed=false;
  if(e.key=="Left"||e.key=="ArrowLeft") leftPressed=false;
});

function drawBall(){
  ctx.beginPath();
  ctx.arc(x,y,ballRadius,0,Math.PI*2);
  ctx.fillStyle="#00bfff";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle(){
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle="#1e90ff";
  ctx.fill();
  ctx.closePath();
}

function drawBricks(){
  for(let c=0;c<brickColumnCount;c++){
    for(let r=0;r<brickRowCount;r++){
      if(bricks[c][r].status==1){
        let brickX = c*(brickWidth+brickPadding)+brickOffsetLeft;
        let brickY = r*(brickHeight+brickPadding)+brickOffsetTop;
        bricks[c][r].x=brickX; bricks[c][r].y=brickY;
        ctx.beginPath();
        ctx.rect(brickX,brickY,brickWidth,brickHeight);
        ctx.fillStyle="#ff4500";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();

  if(x+dx>canvas.width-ballRadius||x+dx<ballRadius) dx=-dx;
  if(y+dy<ballRadius) dy=-dy;
  else if(y+dy>canvas.height-ballRadius){
    if(x>paddleX && x<paddleX+paddleWidth) dy=-dy;
    else document.location.reload();
  }

  for(let c=0;c<brickColumnCount;c++){
    for(let r=0;r<brickRowCount;r++){
      let b=bricks[c][r];
      if(b.status==1){
        if(x>b.x && x<b.x+brickWidth && y>b.y && y<b.y+brickHeight){
          dy=-dy; b.status=0;
        }
      }
    }
  }

  if(rightPressed && paddleX<canvas.width-paddleWidth) paddleX+=5;
  if(leftPressed && paddleX>0) paddleX-=5;

  x+=dx; y+=dy;
  requestAnimationFrame(draw);
}

draw();

