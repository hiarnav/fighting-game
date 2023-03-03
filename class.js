class Sprite {
  constructor({ position, backgroundSource }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.background = new Image();
    this.background.src = backgroundSource;
  }

  draw() {
    c.drawImage(this.background, this.position.x, this.position.y);
  }

  update() {
    this.draw();
  }
}

/*
 * Class for Fighters. Holds all attributes, draws
 * the sprite, and updates them on screen
 */
class Fighter {
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
