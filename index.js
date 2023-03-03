const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const GRAVITY = 0.7;
const JUMP_HEIGHT = 20;
const PLAYER_SPEED = 5;
const GAME_TIME = 60;

canvas.width = 1400;
canvas.height = 675;
c.fillRect(0, 0, canvas.width, canvas.height);

/*
 * Class for Sprites. Holds all attributes, draws
 * the sprite, and updates them on screen
 */
class Sprite {
  constructor({ position, velocity, color, offset }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.color = color;
    this.health = 100;
    this.isAttacking;
    this.lastKey;
    this.attackHitbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.attackHitbox.position.x,
        this.attackHitbox.position.y,
        this.attackHitbox.width,
        this.attackHitbox.height
      );
    }
  }

  update() {
    this.draw();
    this.attackHitbox.position.x = this.position.x + this.attackHitbox.offset.x;
    this.attackHitbox.position.y = this.position.y;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    // may need to add + this.velocity.y
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else this.velocity.y += GRAVITY;
  }

  // sets attacking state to true, and then resets to false after 100ms
  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

/*
 * position: x, y coordinate of sprite
 * velocity: vx, vy of sprite
 * color: fill color of rect
 * offset: adjustments for player
 */
const player = new Sprite({
  position: {
    x: 100,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "red",
  offset: {
    x: 0,
    y: 0,
  },
});

const enemy = new Sprite({
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
  // have the two sprites update with animations
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movement
  if (keys.a.pressed && player.lastKey == "a") {
    player.velocity.x = -PLAYER_SPEED;
  } else if (keys.d.pressed && player.lastKey == "d") {
    player.velocity.x = PLAYER_SPEED;
  }

  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey == "ArrowLeft") {
    enemy.velocity.x = -PLAYER_SPEED;
  } else if (keys.ArrowRight.pressed && enemy.lastKey == "ArrowRight") {
    enemy.velocity.x = PLAYER_SPEED;
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
