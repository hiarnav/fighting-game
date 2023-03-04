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
      this.background.src = this.fileTemplate + this.frame + ".jpg";
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
  constructor({ position, velocity, modelSource, frameCap, sprites }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.health = 100;
    this.attackHitbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 100,
      height: 50,
    };
    this.isAttacking;
    this.lastKey;
    this.playerModel = new Image();
    this.frame = 0;
    this.frameCap = frameCap;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.fileTemplate = modelSource;
    this.sprites = sprites;
  }
  draw() {
    c.drawImage(this.playerModel, this.position.x, this.position.y);
  }

  update() {
    this.draw();
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      this.playerModel.src = this.fileTemplate + this.frame + ".png";
      if (this.frame < this.frameCap - 1) {
        this.frame++;
      } else this.frame = 0;
    }
  }

  // sets attacking state to true, and then resets to false after 100ms
  attack() {
    this.switchSprites("attack1");
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  switchSprites(sprite) {
    // if we are attacking, finish the attack animation first, then proceed
    if (
      this.playerModel === this.sprites.attack1.playerModel &&
      this.frame < this.frameCap - 1
    )
      return;

    // switch based on what animation needs to be done
    switch (sprite) {
      case "idle":
        if (this.fileTemplate !== this.sprites.idle.modelSource) {
          this.fileTemplate = this.sprites.idle.modelSource;
          this.frameCap = this.sprites.idle.frameCap;
          this.frame = 0;
        }
        break;
      case "run":
        if (this.playerModel != this.sprites.run.playerModel) {
          this.playerModel = this.sprites.run.playerModel;
          this.frameCap = this.sprites.run.frameCap;
          this.frame = 0;
        }
        break;
      case "jump":
        if (this.playerModel != this.sprites.jump.playerModel) {
          this.playerModel = this.sprites.jump.playerModel;
          this.frameCap = this.sprites.jump.frameCap;
          this.frame = 0;
        }
        break;
      case "fall":
        if (this.playerModel != this.sprites.fall.playerModel) {
          this.playerModel = this.sprites.fall.playerModel;
          this.frameCap = this.sprites.fall.frameCap;
          this.frame = 0;
        }
        break;
      case "attack1":
        if (this.playerModel != this.sprites.attack1.playerModel) {
          this.playerModel = this.sprites.attack1.playerModel;
          this.frameCap = this.sprites.attack1.frameCap;
          this.frame = 0;
        }
        break;
    }
  }
}
