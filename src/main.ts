import Phaser from 'phaser';

class MainScene extends Phaser.Scene {
  private dot!: Phaser.GameObjects.Arc;
  private wKey!: Phaser.Input.Keyboard.Key;
  private aKey!: Phaser.Input.Keyboard.Key;
  private sKey!: Phaser.Input.Keyboard.Key;
  private dKey!: Phaser.Input.Keyboard.Key;
  private yellowDots: Phaser.GameObjects.Arc[] = [];
  private score: number = 0;
  private missedDots: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private missedText!: Phaser.GameObjects.Text;
  private gameActive: boolean = true;
  private spawnTimer!: Phaser.Time.TimerEvent;

  constructor() {
    super('MainScene');
  }

  create() {
    this.initGame();
  }

  initGame() {
    this.dot = this.add.circle(400, 300, 10, 0xffffff);

    this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '18px', color: '#fff' });
    this.missedText = this.add.text(16, 40, 'Missed: 0/10', { fontSize: '18px', color: '#fff' });

    this.score = 0;
    this.missedDots = 0;
    this.gameActive = true;
    this.yellowDots = [];

    this.spawnTimer = this.time.addEvent({
      delay: 1000,
      callback: this.spawnYellowDot,
      callbackScope: this,
      loop: true
    });
  }

  update() {
    if (!this.gameActive) return;

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

    for (let i = this.yellowDots.length - 1; i >= 0; i--) {
      const yellowDot = this.yellowDots[i];
      yellowDot.x -= 2;
      if (yellowDot.x < -10) {
        this.removeYellowDot(i);
        this.missedDots++;
        this.updateMissedText();
        if (this.missedDots >= 10) {
          this.endGame();
        }
      } else {
        this.checkCollision(yellowDot, i);
      }
    }
  }

  spawnYellowDot() {
    const yellowDot = this.add.circle(810, Phaser.Math.Between(10, 590), 3, 0xffff00);
    this.yellowDots.push(yellowDot);
  }

  removeYellowDot(index: number) {
    const yellowDot = this.yellowDots[index];
    if (yellowDot) {
      yellowDot.destroy();
      this.yellowDots.splice(index, 1);
    }
  }

  checkCollision(yellowDot: Phaser.GameObjects.Arc, index: number) {
    const distance = Phaser.Math.Distance.Between(
      this.dot.x, this.dot.y,
      yellowDot.x, yellowDot.y
    );
    if (distance < this.dot.radius + yellowDot.radius) {
      this.removeYellowDot(index);
      this.score++;
      this.updateScoreText();
    }
  }

  updateScoreText() {
    this.scoreText.setText(`Score: ${this.score}`);
  }

  updateMissedText() {
    this.missedText.setText(`Missed: ${this.missedDots}/10`);
  }

  endGame() {
    this.gameActive = false;
    this.spawnTimer.remove();

    const finalScoreText = this.add.text(400, 250, `Game Over!\nFinal Score: ${this.score}`, {
      fontSize: '32px',
      color: '#fff',
      align: 'center'
    });
    finalScoreText.setOrigin(0.5);

    const startOverButton = this.add.text(400, 350, 'Start Over', {
      fontSize: '24px',
      color: '#fff',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 }
    });
    startOverButton.setOrigin(0.5);
    startOverButton.setInteractive();
    startOverButton.on('pointerdown', () => {
      this.scene.restart();
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