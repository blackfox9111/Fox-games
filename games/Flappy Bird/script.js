const playBtn = document.getElementById("playFlappy");
const gameContainer = document.getElementById("flappyContainer");

playBtn.addEventListener("click", () => {
    gameContainer.style.display = "block"; // يظهر اللعبة
    initFlappyGame(); // ينادي دالة بدء اللعبة اللي أنت برمجتها
});

function initFlappyGame() {
    const canvas = document.getElementById("flappyCanvas");
    const ctx = canvas.getContext("2d");
    
    // ضع هنا كل كود Flappy Bird اللي كتبناه
    startFlappyGame(ctx);
}
