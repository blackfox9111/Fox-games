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
  const paddleHeight = 12, paddleWidth = 110;
  let paddleX;

  // نقاط
  let score = 0;

  // الطوب
  const brickRowCount = 7;
  const brickColumnCount = 11;
  const brickWidth = 45, brickHeight = 15;
  const brickPadding = 8, brickOffsetTop = 30, brickOffsetLeft = 10;
  let bricks = [];

  // التحكم
  let rightPressed=false, leftPressed=false;

  // ----------------- إعداد اللعبة -----------------
  function initGame(){
    x = canvas.width/2;
    y = canvas.height-40;
    dx = 4;
    dy = -4;
    paddleX = (canvas.width - paddleWidth)/2;
    score = 0;

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
// ----------------- التحكم بالكيبورد (اسهم) -----------------
document.addEventListener("keydown", e=>{
  if(e.key === "ArrowRight") rightPressed = true;
  if(e.key === "ArrowLeft") leftPressed = true;
});

document.addEventListener("keyup", e=>{
  if(e.key === "ArrowRight") rightPressed = false;
  if(e.key === "ArrowLeft") leftPressed = false;
});


  // ----------------- التحكم بالموبايل -----------------
  const pressLeft = (e)=>{ leftPressed=true; e.preventDefault(); };
  const releaseLeft = (e)=>{ leftPressed=false; e.preventDefault(); };

  const pressRight = (e)=>{ rightPressed=true; e.preventDefault(); };
  const releaseRight = (e)=>{ rightPressed=false; e.preventDefault(); };

  leftBtn.addEventListener("touchstart", pressLeft);
  leftBtn.addEventListener("touchend", releaseLeft);
  leftBtn.addEventListener("mousedown", pressLeft);
  leftBtn.addEventListener("mouseup", releaseLeft);

  rightBtn.addEventListener("touchstart", pressRight);
  rightBtn.addEventListener("touchend", releaseRight);
  rightBtn.addEventListener("mousedown", pressRight);
  rightBtn.addEventListener("mouseup", releaseRight);

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

  // ----------------- رسم الكرة -----------------
  function drawBall(){
    ctx.beginPath();
    ctx.arc(x,y,ballRadius,0,Math.PI*2);
    ctx.fillStyle="#00bfff";
    ctx.fill();
    ctx.closePath();
  }

  // ----------------- رسم المنصة -----------------
  function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle="#1e90ff";
    ctx.fill();
    ctx.closePath();
  }

  // ----------------- رسم الطوب -----------------
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

  // ----------------- تصادم -----------------
  function collisionDetection(){
    for(let c=0;c<brickColumnCount;c++){
      for(let r=0;r<brickRowCount;r++){
        let b=bricks[c][r];
        if(b.status==1){
          if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight){

            dy = -dy;

            b.status=0;
            score++;
            scoreEl.textContent = "Score: " + score;
            hitSound.play();
          }
        }
      }
    }
  }

  // ----------------- الحلقة الرئيسية -----------------
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    if(gameStarted){

      x += dx;
      y += dy;

      // ارتداد من الحواف
      if(x + dx > canvas.width-ballRadius || x + dx < ballRadius){
        dx = -dx;
      }

      if(y + dy < ballRadius){
        dy = -dy;
      }
      else if(y + dy > canvas.height-ballRadius){
        // ارتداد فيزيائي من المنصة
        if(x > paddleX && x < paddleX + paddleWidth){

          let collidePoint = x - (paddleX + paddleWidth / 2);
          collidePoint /= paddleWidth/2;

          let angle = collidePoint * (Math.PI / 3);

          dx = Math.sin(angle) * 5;
          dy = -Math.cos(angle) * 5;

          hitSound.play();
        }
        else {
          loseSound.play();
          gameStarted = false;
          restartBtn.style.display = "inline-block";
        }
      }

      // حركة المنصة
      if(rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 7;
      if(leftPressed && paddleX > 0) paddleX -= 7;
    }

    requestAnimationFrame(draw);
  }

  initGame();
  draw();

});
