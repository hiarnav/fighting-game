const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const GRAVITY = 0.7;
const JUMP_HEIGHT = 20;
const PLAYER_SPEED = 11;
const GAME_TIME = 60;

canvas.width = 1428;
canvas.height = 600;
c.fillRect(0, 0, canvas.width, canvas.height);

/*
 * position: x, y coordinate of sprite
 * velocity: vx, vy of sprite
 * color: fill color of rect
 * offset: adjustments for player
 */

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  backgroundSource: "./assets/maps/sakuracity/frame_",
  frameCap: 126,
});

const player = new Fighter({
  position: {
    x: -400,
    y: -100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  modelSource: "./assets/characters/windsaber/animations/PNG/idle/frame_",
  frameCap: 8,
  sprites: {
    idle: {
      modelSource: "./assets/characters/windsaber/animations/PNG/idle/frame_",
      frameCap: 8,
    },
    run: {
      modelSource: "./assets/characters/windsaber/animations/PNG/run/frame_",
      frameCap: 8,
    },
    jump: {
      modelSource: "./assets/characters/windsaber/animations/PNG/jump/frame_",
      frameCap: 3,
    },
    fall: {
      modelSource: "./assets/characters/windsaber/animations/PNG/fall/frame_",
      frameCap: 3,
    },
    attack1: {
      modelSource: "./assets/characters/martialhero1/Sprites/Attack1.png",
      frameCap: 6,
    },
  },
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
  modelSource: "./assets/characters/martialhero2/Sprites/Idle.png",
  frameCap: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 225,
  },
  sprites: {
    idle: {
      modelSource: "./assets/characters/martialhero2/Sprites/Idle.png",
      frameCap: 4,
    },
    run: {
      modelSource: "./assets/characters/martialhero2/Sprites/Run.png",
      frameCap: 8,
    },
    jump: {
      modelSource: "./assets/characters/martialhero2/Sprites/Jump.png",
      frameCap: 2,
    },
    fall: {
      modelSource: "./assets/characters/martialhero2/Sprites/Fall.png",
      frameCap: 2,
    },
    attack1: {
      modelSource: "./assets/characters/martialhero2/Sprites/Attack1.png",
      frameCap: 4,
    },
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

/*
 * Determines whether or not the hitbox of a sprite
 * has intersected with another sprite
 */
function hitboxDetection({ sprite1, sprite2 }) {
  return (
    sprite1.attackHitbox.position.x + sprite1.attackHitbox.width >=
      sprite2.position.x &&
    sprite1.attackHitbox.position.x <= sprite2.position.x + sprite2.width &&
    sprite1.attackHitbox.position.y + sprite1.attackHitbox.height >=
      sprite2.position.y &&
    sprite1.attackHitbox.position.y <= sprite2.position.y + sprite2.height
  );
}

/*
 * When the game ends, determines who won: player 1
 * player 2, or a draw
 */
function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  // if player 2 wins
  if (enemy.health > player.health) {
    document.querySelector("#postGameText").innerHTML = "Player 2 Wins";
    // if player 1 wins
  } else if (player.health > enemy.health) {
    document.querySelector("#postGameText").innerHTML = "Player 1 Wins";
    // if it's a tie
  } else {
    document.querySelector("#postGameText").innerHTML = "Tie";
  }
  document.querySelector("#postGameText").style.display = "flex";
}

/*
 * Manages in game timer. Decrements clock by seconds
 * Stops when time expires, or someone wins
 */
let current_time = GAME_TIME;
let timerId;
// manages the timer, decrements seconds
function update_timer() {
  if (current_time > 0) {
    timerId = setTimeout(update_timer, 1000);
    current_time--;
    document.querySelector("#timer").innerHTML = current_time;
  }

  // when the time runs out, determine who won
  if (current_time == 0) determineWinner({ player, enemy, timerId });
}

update_timer();

/*
 * Engine for animation. Draws frames and updates
 * the screen repeatedly/infinitely
 */
function animate() {
  window.requestAnimationFrame(animate);
  // keep the background solid black
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  // draw background before players, so it is in the back
  background.update();
  // have the two sprites update with animations
  player.update();
  //enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //<-------PLAYER MOVEMENT------->

  // moving left
  if (keys.a.pressed && player.lastKey == "a") {
    player.velocity.x = -PLAYER_SPEED;
    player.switchSprites("run");
    // moving right
  } else if (keys.d.pressed && player.lastKey == "d") {
    player.velocity.x = PLAYER_SPEED;
    player.switchSprites("run");
    // idle
  } else {
    player.switchSprites("idle");
  }
  // jumping
  if (player.velocity.y < 0) {
    player.switchSprites("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprites("fall");
  }

  //<-------ENEMY MOVEMENT------->

  // moving left
  if (keys.ArrowLeft.pressed && enemy.lastKey == "ArrowLeft") {
    enemy.velocity.x = -PLAYER_SPEED;
    enemy.switchSprites("run");
    // moving right
  } else if (keys.ArrowRight.pressed && enemy.lastKey == "ArrowRight") {
    enemy.velocity.x = PLAYER_SPEED;
    enemy.switchSprites("run");
    // idle
  } else {
    enemy.switchSprites("idle");
  }
  // jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprites("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprites("fall");
  }

  // detect if attack hits enemy
  if (
    hitboxDetection({ sprite1: player, sprite2: enemy }) &&
    player.isAttacking
  ) {
    // once they land the hit, make sure they can't get spam hit
    player.isAttacking = false;
    // update health bar
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  if (
    hitboxDetection({ sprite1: enemy, sprite2: player }) &&
    enemy.isAttacking
  ) {
    // once they land the hit, make sure they can't get spam hit
    enemy.isAttacking = false;
    // update health bar
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  if (enemy.health == 0 || player.health == 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    // player inputs movement
    case "d":
    case "D":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
    case "A":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
    case "W":
      player.velocity.y = -JUMP_HEIGHT;
      break;
    // enemy inputs movement
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = -JUMP_HEIGHT;
      break;
    case " ":
      player.attack();
      break;
    case "ArrowDown":
      enemy.attack();
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
    case "D":
      keys.d.pressed = false;
      break;
    case "a":
    case "A":
      keys.a.pressed = false;
      break;
  }
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
