const gameArea = document.getElementById("gameArea");
const character = spawnCharacter("haha.png");

const bulletWidth = 10;
const bulletHeight = 20;
const bulletSpeed = 8;

let enemies = [];
let bullets = [];
let isGameOver = false;

function moveEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    const enemyRect = enemy.getBoundingClientRect();
    const gameAreaRect = gameArea.getBoundingClientRect();

    const enemyY = parseFloat(enemy.style.top);
    const maxEnemyY = gameAreaRect.height - enemyRect.height;

    if (enemyY >= maxEnemyY) {
      // Enemy reached the bottom edge, end the game
      gameOver();
      return;
    }

    enemy.style.top = enemyY + 1 + "px"; // Move the enemy downwards

    let isEnemyRemoved = false; // Flag variable

    // Check for collision with character
    if (isColliding(enemyRect, character.getBoundingClientRect())) {
      // Enemy collided with the character, end the game
      gameOver();
      return;
    }

    // Check for collision with bullets
    for (let j = 0; j < bullets.length; j++) {
      const bullet = bullets[j];
      if (isColliding(enemyRect, bullet.getBoundingClientRect())) {
        // Bullet hit the enemy, despawn the enemy and remove the bullet
        var deadLOL = new Audio('oof.mp3');
        deadLOL.loop = false;
        deadLOL.play();
        gameArea.removeChild(enemy);
        gameArea.removeChild(bullet);
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        isEnemyRemoved = true; // Set flag to true
        break; // Exit inner loop
      }
    }

    if (isEnemyRemoved) {
      break; // Exit outer loop if enemy was removed
    }
  }

  requestAnimationFrame(moveEnemies);
}

function isColliding(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
}

function shootBullet() {
  const bullet = document.createElement("div");
  bullet.classList.add("bullet");
  bullet.style.position = "absolute";
  bullet.style.width = bulletWidth + "px";
  bullet.style.height = bulletHeight + "px";
  bullet.style.backgroundColor = "red";

  const characterRect = character.getBoundingClientRect();
  const bulletX = characterRect.left + (characterRect.width - bulletWidth) / 2;
  const bulletY = characterRect.top - bulletHeight;
  bullet.style.left = bulletX + "px";
  bullet.style.top = bulletY + "px";


  var stop = new Audio('shot.mp3');
  stop.loop = false;
  stop.play();
  gameArea.appendChild(bullet);
  bullets.push(bullet);
}

let positionX = gameArea.offsetWidth / 2;
const speed = 5;
let isMovingLeft = false;
let isMovingRight = false;

function handleKeyDown(e) {
  if (e.key === "ArrowLeft") {
    isMovingLeft = true;
  } else if (e.key === "ArrowRight") {
    isMovingRight = true;
  } else if (e.key === " ") {
    shootBullet();
  }
}

function handleKeyUp(e) {
  if (e.key === "ArrowLeft") {
    isMovingLeft = false;
  } else if (e.key === "ArrowRight") {
    isMovingRight = false;
  }
}

function update() {
  if (!isGameOver) {
    updateCharacterPosition();

    // Move bullets
    for (let i = 0; i < bullets.length; i++) {
      const bullet = bullets[i];
      const bulletRect = bullet.getBoundingClientRect();
      const bulletY = parseFloat(bullet.style.top);

      bullet.style.top = bulletY - bulletSpeed + "px"; // Move the bullet upwards

      let isBulletRemoved = false; // Flag variable

      // Check for collision with enemies
      for (let j = 0; j < enemies.length; j++) {
        const enemy = enemies[j];
        const enemyRect = enemy.getBoundingClientRect();
        if (isColliding(enemyRect, bulletRect)) {
          // Bullet hit the enemy, despawn the enemy and remove the bullet
          gameArea.removeChild(enemy);
          gameArea.removeChild(bullet);
          enemies.splice(j, 1);
          bullets.splice(i, 1);
          isBulletRemoved = true; // Set flag to true

          break; // Exit inner loop
        }
      }

      if (isBulletRemoved) {
        break; // Exit outer loop if bullet was removed
      }
    }

    requestAnimationFrame(update);
  }
}

function updateCharacterPosition() {
  const gameAreaRect = gameArea.getBoundingClientRect();

  const minPositionX = gameAreaRect.left;
  const maxPositionX = gameAreaRect.right - character.offsetWidth;

  if (isMovingLeft && !isMovingRight) {
    positionX -= speed;
    if (positionX < minPositionX) {
      positionX = minPositionX;
    }
  } else if (isMovingRight && !isMovingLeft) {
    positionX += speed;
    if (positionX > maxPositionX) {
      positionX = maxPositionX;
    }
  }

  character.style.left = positionX + "px";
}

const enemySpawnInterval = setInterval(() => {
  if (!isGameOver) {
    spawnEnemy("enemy.png");

  }
}, 1500);

function spawnCharacter(imagePath) {
  const char = document.createElement("img");
  const gameArea = document.getElementById("gameArea");
  char.src = imagePath;
  char.style.position = "absolute";
  char.id = "character";

  const charWidth = 100;
  const charHeight = 133;
  const gameAreaWidth = gameArea.offsetWidth - charWidth;
  const gameAreaHeight = gameArea.offsetHeight - charHeight;

  char.style.width = charWidth + "px";
  char.style.height = charHeight + "px";
  char.style.left = gameAreaWidth / 2 + "px";
  char.style.top = gameAreaHeight + "px";

  gameArea.appendChild(char);
  return char;

}

function spawnEnemy(imagePath) {
  const enemy = document.createElement("img");
  enemy.src = imagePath;
  enemy.classList.add("enemy");

  const enemyWidth = 50;
  const enemyHeight = 50;

  const gameAreaRect = gameArea.getBoundingClientRect();
  const minEnemyX = gameAreaRect.left;
  const maxEnemyX = gameAreaRect.right - enemyWidth;
  const enemyX = Math.random() * (maxEnemyX - minEnemyX) + minEnemyX;
  const enemyY = -enemyHeight;

  enemy.style.position = "absolute";
  enemy.style.width = enemyWidth + "px";
  enemy.style.height = enemyHeight + "px";
  enemy.style.left = enemyX + "px";
  enemy.style.top = enemyY + "px";

  gameArea.appendChild(enemy);
  enemies.push(enemy);
}


function checkCollisions() {
  const characterRect = character.getBoundingClientRect();
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    const enemyRect = enemy.getBoundingClientRect();
    if (isColliding(characterRect, enemyRect)) {
      gameOver();
      return;
    }
  }
  requestAnimationFrame(checkCollisions);
}

function gameOver() {
  isGameOver = true;
  clearInterval(enemySpawnInterval);
  let done = new Audio('stoopid.mp3')
  done.play()
  gameArea.innerHTML = "<div class='game-over'>Jeu terminé</div>";
}



window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

update();
moveEnemies();
checkCollisions();