class Sprite {
  constructor({ position, backgroundSource, frameCap }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.background = new Image();
    this.frame = 0;
    this.frameCap = frameCap;
    this.framesElapsed = 0;
    this.framesHold = 7;
    this.fileTemplate = backgroundSource;
  }

  draw() {
    c.drawImage(this.background, this.position.x, this.position.y);
  }

  update() {
    this.draw();
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      this.background.src = this.fileTemplate + this.frame + ".gif";
      if (this.frame < this.frameCap - 1) {
        this.frame++;
      } else this.frame = 0;
    }
  }
}

/*
 * Class for Fighters. Holds all attributes, draws
 * the sprite, and updates them on screen
 */
class Fighter {
  constructor({
    position,
    velocity,
    color,
    offset,
    modelSource,
    frameCap,
    scale,
  }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.color = color;
    this.health = 100;
    this.isAttacking;
    this.lastKey;
    this.playerModel = new Image();
    this.playerModel.src = modelSource;
    this.scale = scale;
    this.currentFrame = 0;
    this.frameCap = frameCap;
    this.framesElapsed = 0;
    this.framesHold = 7;
    this.fileTemplate = modelSource;
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
    c.drawImage(
      this.playerModel,
      this.currentFrame * (this.playerModel.width / this.frameCap),
      0,
      this.playerModel.width / this.frameCap,
      this.playerModel.height,
      this.position.x,
      this.position.y,
      (this.playerModel.width / this.frameCap) * this.scale,
      this.playerModel.height * this.scale
    );
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
