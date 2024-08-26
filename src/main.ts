import Phaser from 'phaser';

class MainScene extends Phaser.Scene {
  private dot!: Phaser.GameObjects.Arc;
  private wKey!: Phaser.Input.Keyboard.Key;
  private aKey!: Phaser.Input.Keyboard.Key;
  private sKey!: Phaser.Input.Keyboard.Key;
  private dKey!: Phaser.Input.Keyboard.Key;
  private isBlinking: boolean = false;

  constructor() {
    super('MainScene');
  }

  create() {
    this.dot = this.add.circle(400, 300, 10, 0xffffff);

    this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.leftButtonDown()) {
        this.blinkDot();
      }
    });
  }

  update() {
    const speed = 4;

    if (this.aKey.isDown) {
      this.dot.x -= speed;
    }
    if (this.dKey.isDown) {
      this.dot.x += speed;
    }
    if (this.wKey.isDown) {
      this.dot.y -= speed;
    }
    if (this.sKey.isDown) {
      this.dot.y += speed;
    }

    this.dot.x = Phaser.Math.Clamp(this.dot.x, 10, 790);
    this.dot.y = Phaser.Math.Clamp(this.dot.y, 10, 590);
  }

  blinkDot() {
    if (this.isBlinking) return;

    this.isBlinking = true;
    
    this.tweens.add({
      targets: this.dot,
      alpha: 0,
      duration: 100,
      yoyo: true,
      repeat: 5,
      onComplete: () => {
        this.isBlinking = false;
      }
    });
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: MainScene
};

new Phaser.Game(config);