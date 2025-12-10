window.addEventListener("load", ()=>{

  const canvas = document.getElementById("breakoutCanvas");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const restartBtn = document.getElementById("restartBtn");
  const startBtn = document.getElementById("startBtn");
  const backBtn = document.getElementById("backBtn");
  const leftBtn = document.getElementById("leftBtn");
  const rightBtn = document.getElementById("rightBtn");
  const hitSound = document.getElementById("hitSound");
  const loseSound = document.getElementById("loseSound");

  let gameStarted = false;

  // الكرة
  let x, y, dx, dy;
  const ballRadius = 10;

  // المجداف
  const paddleHeight = 12, paddleWidth = 100;
  let paddleX;

  // الطوبات
  const brickRowCount = 6;
  const brickColumnCount = 11;
  const brickWidth = 50, brickHeight = 15;
  const brickPadding = 8, brickOffsetTop = 30, brickOffsetLeft = 20;
  let bricks = [];

  // التحكم
  let rightPressed=false, leftPressed=false;

  // ----------------- إعداد اللعبة -----------------
  function initGame(){
    x = canvas.width/2;
    y = canvas.height-30;
    dx = 3; dy = -3;
    paddleX = (canvas.width - paddleWidth)/2;
    scoreEl.textContent = "Score: 0";
    restartBtn.style.display = "none";
    gameStarted=false;

    bricks = [];
    for(let c=0;c<brickColumnCount;c++){
      bricks[c]=[];
      for(let r=0;r<brickRowCount;r++){
        bricks[c][r]={x:0, y:0, status:1};
      }
    }
  }

  // ----------------- التحكم بالكيبورد -----------------
  document.addEventListener("keydown", e=>{
    if(e.key=="d"||e.key=="D") rightPressed=true;
    if(e.key=="a"||e.key=="A") leftPressed=true;
  });
  document.addEventListener("keyup", e=>{
    if(e.key=="d"||e.key=="D") rightPressed=false;
    if(e.key=="a"||e.key=="A") leftPressed=false;
  });

  // ----------------- التحكم بالموبايل -----------------
  leftBtn.addEventListener("mousedown", ()=>{leftPressed=true;});
  leftBtn.addEventListener("mouseup", ()=>{leftPressed=false;});
  leftBtn.addEventListener("touchstart", ()=>{leftPressed=true;});
  leftBtn.addEventListener("touchend", ()=>{leftPressed=false;});

  rightBtn.addEventListener("mousedown", ()=>{rightPressed=true;});
  rightBtn.addEventListener("mouseup", ()=>{rightPressed=false;});
  rightBtn.addEventListener("touchstart", ()=>{rightPressed=true;});
  rightBtn.addEventListener("touchend", ()=>{rightPressed=false;});

  // ----------------- زر Start -----------------
  startBtn.addEventListener("click", ()=>{
    gameStarted=true;
    startBtn.style.display="none";
  });

  // ----------------- زر Restart -----------------
  restartBtn.addEventListener("click", ()=>{
    initGame();
    gameStarted=true;
    startBtn.style.display="none";
  });

  // ----------------- زر Back -----------------
  backBtn.addEventListener("click", ()=>{
    window.location.href = "../../index.html";
  });

  // ----------------- رسم اللعبة -----------------
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
        let b=bricks[c][r];
        if(b.status==1){
          b.x = c*(brickWidth+brickPadding)+brickOffsetLeft;
          b.y = r*(brickHeight+brickPadding)+brickOffsetTop;
          ctx.beginPath();
          ctx.rect(b.x,b.y,brickWidth,brickHeight);
          ctx.fillStyle="#ff4500";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  function collisionDetection(){
    for(let c=0;c<brickColumnCount;c++){
      for(let r=0;r<brickRowCount;r++){
        let b=bricks[c][r];
        if(b.status==1){
          if(x>b.x && x<b.x+brickWidth && y>b.y && y<b.y+brickHeight){
            dy=-dy;
            b.status=0;
            scoreEl.textContent = "Score: "+(++score);
            hitSound.play();
          }
        }
      }
    }
  }

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    if(gameStarted){
      // الكرة تتحرك
      x += dx;
      y += dy;

      // الاصطدام بالحواف
      if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) dx = -dx;
      if(y + dy < ballRadius) dy = -dy;
      else if(y + dy > canvas.height-ballRadius){
        if(x > paddleX && x < paddleX+paddleWidth) dy = -dy;
        else {
          loseSound.play();
          gameStarted=false;
          restartBtn.style.display="inline-block";
        }
      }

      // تحريك المجداف
      if(rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 6;
      if(leftPressed && paddleX > 0) paddleX -= 6;
    }

    requestAnimationFrame(draw);
  }

  initGame();
  draw();

});
