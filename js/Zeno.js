let Zeno = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize: function Zeno() {
    Phaser.Scene.call(this, {
      key: 'zeno'
    });

    this.SPECIAL_START_TEXT = "ALMOST\nHALF-WAY";
    this.SPECIAL_HALFWAY_TEXT = "HALF-WAY";
    this.speed = 1;
    this.animSpeed = 100;
    this.ZENO_START_X = 16 * 4;
    this.ZENO_HALFWAY_X = 95 * 4;
    this.ZENO_FINISH_X = this.ZENO_HALFWAY_X + (this.ZENO_HALFWAY_X - this.ZENO_START_X);

    this.inputEnabled = true;
    this.inputSuccess = false;
  },

  create: function () {

    this.cameras.main.setBackgroundColor('rgba(221, 170, 221, 1.0)');

    // Sound
    this.victorySFX = this.sound.add('victory');
    this.victorySFX.volume = 0.2;
    this.defeatSFX = this.sound.add('swoopdown');
    this.defeatSFX.volume = 0.2;


    this.zeno = this.add.sprite(this.ZENO_START_X, this.game.canvas.height / 2 + 4 * 15, 'atlas', 'zeno/zeno/zeno_1.png');
    this.zeno.setScale(4, 4);
    this.zeno.setOrigin(0.5);

    this.flag = this.add.sprite(this.ZENO_FINISH_X, this.game.canvas.height / 2 + 4 * 10, 'atlas', 'zeno/flag.png');
    this.flag.setScale(4, 4);

    let groundRect = new Phaser.Geom.Rectangle(0, this.game.canvas.height / 2 + 4 * 26, this.game.canvas.width, 200);
    this.ground = this.add.graphics({
      fillStyle: {
        color: 0x000000
      }
    });
    this.ground.fillRectShape(groundRect);

    // Add the various animations
    this.createAnimation('zeno_idle', 4, 4, 5, 0);
    this.createAnimation('zeno_running', 1, 3, 5, -1);
    this.createAnimation('zeno_victory', 4, 8, 5, 0);
    this.createAnimation('zeno_defeat', 8, 4, 5, 0);

    this.zeno.anims.play('zeno_idle');

    this.zeno.on('animationcomplete', (animation, frame) => {
      switch (animation.key) {
      case 'zeno_victory':
        this.startText.visible = false;
        let zenoTweenBack = this.tweens.add({
          targets: [this.zeno, this.halfWayText],
          x: this.ZENO_START_X,
          duration: 1000,
          repeat: 0,
          onComplete: () => {
            this.startText.visible = true;
            if (this.startText.text === this.SPECIAL_START_TEXT) {

            } else {
              this.halfway += (100 - this.halfway) / 2;
              if (this.halfway === 100) {
                this.startText.text = `${this.SPECIAL_START_TEXT}`;
                this.halfWayText.text = `${this.SPECIAL_HALFWAY_TEXT}`;
              } else {
                this.speed++;
                this.animSpeed = 100 / this.speed;
                this.startText.text = this.halfWayText.text;
                this.halfWayText.text = `${this.halfway}m`;
              }
            }
            this.halfWayText.x = this.ZENO_HALFWAY_X;

            setTimeout(() => {
              this.zeno.anims.play('zeno_defeat');
              this.defeatSFX.play();
            }, 1000);
          },
        });

        break;
      case 'zeno_defeat':
        this.inputEnabled = true;
        this.zeno.anims.play('zeno_idle');
        this.encouragementText.visible = false;
        break;
      }
    });

    this.start = 0;
    this.halfway = 50; // This will max out at 99.99999999999999m (14dp)
    this.finish = 100;

    let encouragementStyle = {
      fontFamily: 'Commodore',
      fontSize: '20px',
      fill: '#000',
      wordWrap: true,
      align: 'center'
    };
    this.encouragementText = this.add.text(this.game.canvas.width / 2, 40 * 4, "HALF-WAY THERE!", encouragementStyle);
    this.encouragementText.setOrigin(0.5, 0.5);
    this.encouragementText.visible = false;

    let markerStyle = {
      fontFamily: 'Commodore',
      fontSize: '18px',
      fill: '#fff',
      wordWrap: true,
      align: 'left'
    };
    this.startText = this.add.text(this.ZENO_START_X, 82 * 4, `${this.start}m`, markerStyle); //.setOrigin(0.5);
    this.halfWayText = this.add.text(this.ZENO_HALFWAY_X, 82 * 4, `${this.halfway}m`, markerStyle); //.setOrigin(0.5);
    this.finishText = this.add.text(this.ZENO_FINISH_X, 82 * 4, `${this.finish}m`, markerStyle); //.setOrigin(0.5);

    // Add instructions
    let instructionStyle = {
      fontFamily: 'Commodore',
      fontSize: '24px',
      fill: '#000',
      wordWrap: true,
      align: 'center'
    };
    let instructionString = `RAPIDLY ${verb} THE\n${device} TO RUN\nTHE RACE!`;
    this.instructionsText = this.add.text(this.game.canvas.width / 4, 100, instructionString, instructionStyle);
    this.instructionsText.setOrigin(0.5);

    // this.children.getChildren()
    //   .forEach((c) => {
    //     c.alpha = 0.2
    //   });

    this.clicks = 0;
    this.input.on('pointerdown', () => {
      if (this.inputEnabled) this.clicks++;
    });
    setInterval(() => {
      if (this.clicks > 1 && this.inputEnabled) {
        this.inputSuccess = true;
        this.instructionsText.visible = false;
      } else {
        this.inputSuccess = false;
      }
      this.clicks = 0;
    }, 500);
  },

  update: function (time, delta) {

    this.updateZeno();

  },

  updateZeno: function () {
    if (!this.inputEnabled) return;

    if (this.zeno.x >= this.ZENO_HALFWAY_X) {
      this.zeno.x = this.ZENO_HALFWAY_X;
      this.inputEnabled = false;
      this.zeno.anims.play('zeno_victory');
      this.victorySFX.play();
      this.encouragementText.visible = true;
    } else if (this.inputSuccess) {
      if (this.zeno.anims.currentAnim.key === 'zeno_idle') {
        this.anims.get('zeno_running')
          .msPerFrame = this.animSpeed;
        this.zeno.anims.play('zeno_running');
      }
      this.zeno.x += this.speed;
    } else {
      this.zeno.anims.play('zeno_idle');
    }
  },

  // createAnimation(name,start,end)
  //
  // Helper function to generate the frames and animation for Sisyphus between set limits
  createAnimation: function (name, start, end, framerate, repeat) {
    let frames = this.anims.generateFrameNames('atlas', {
      start: start,
      end: end,
      zeroPad: 0,
      prefix: 'zeno/zeno/zeno_',
      suffix: '.png'
    });
    let config = {
      key: name,
      frames: frames,
      frameRate: framerate,
      repeat: repeat,
    };
    this.anims.create(config);
  }

});