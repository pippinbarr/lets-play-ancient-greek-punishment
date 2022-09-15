let Tantalus = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize: function Tantalus() {
    Phaser.Scene.call(this, {
      key: 'tantalus'
    });

    this.ACTION_MIN_DELAY = 1000;
    this.ACTION_DELAY_RANGE = 2000;
    this.ACTION_MIN_PERFORM = 1000;
    this.ACTION_PERFORM_RANGE = 2000;

    this.inputEnabled = true;
    this.appleSuccess = false;
    this.waterSuccess = false;
  },

  create: function () {
    this.cameras.main.setBackgroundColor('rgba(170, 221, 170, 1.0)');

    // Sound
    this.waterDownSFX = this.sound.add('swoopdown');
    this.waterDownSFX.volume = 0.2;
    this.branchUpSFX = this.sound.add('swoopup');
    this.branchUpSFX.volume = 0.2;

    // Tantalus

    // - Sprite
    this.tantalus = this.add.sprite(400, 200, 'atlas', 'tantalus/tantalus.png');
    this.tantalus.setScale(8, 8);

    // - State variables
    this.acting = false;

    // - Animations
    this.createAnimation('tantalus_idle', 'tantalus/reaching/reaching', 1, 1, 5, -1);

    this.createAnimation('reach', 'tantalus/reaching/reaching', 1, 5, 5, 0);
    this.createAnimation('unreach', 'tantalus/reaching/reaching', 5, 1, 5, 0);
    this.createAnimation('eating_fail', 'tantalus/eating_fail/eating_fail', 1, 2, 5, -1);

    this.createAnimation('stoop', 'tantalus/stooping/stooping', 1, 6, 5, 0);
    this.createAnimation('unstoop', 'tantalus/stooping/stooping', 6, 1, 5, 0);
    this.createAnimation('drinking_fail', 'tantalus/stooping/stooping', 6, 7, 5, -1);

    this.tantalus.anims.play('tantalus_idle');

    // - Animation complete events
    this.tantalus.on('animationcomplete', function (animation, frame) {
      switch (animation.key) {
      case 'reach':
        this.tantalus.anims.play('eating_fail');
        break;

      case 'unreach':
        this.tantalus.anims.play('tantalus_idle');
        break;

      case 'stoop':
        this.tantalus.anims.play('drinking_fail');
        break;

      case 'unstoop':
        this.tantalus.x += 1 * 8;
        this.tantalus.y -= 3 * 8;
        this.tantalus.anims.play('tantalus_idle');
        break;

      case 'drinking_fail':
        break;

      default:
      }
    }, this);

    // Branch

    // - Sprite
    this.branch = this.add.sprite(400, 200, 'atlas', 'tantalus/branch/branch_1.png');
    this.branch.setScale(8, 8);

    // - Animations
    this.createAnimation('branch_idle', 'tantalus/branch/branch', 1, 1, 5, -1);
    this.createAnimation('branch_raise', 'tantalus/branch/branch', 2, 4, 10, 0);
    this.createAnimation('branch_lower', 'tantalus/branch/branch', 4, 2, 10, 0);

    // - State variables
    this.branchUp = false;
    this.branchDown = true;
    this.branchRaising = false;
    this.branchLowering = false;

    // - Animation complete events
    this.branch.on('animationcomplete', function (animation, frame) {
      switch (animation.key) {
      case 'branch_raise':
        this.branchUp = true;
        this.branchRaising = false;
        break;

      case 'branch_lower':
        this.branchDown = true;
        this.branchLowering = false;
        break;
      }
    }, this);

    this.branch.anims.play('branch_idle');

    // Water

    // - Sprite
    this.water = this.add.sprite(400, 200, 'atlas', 'tantalus/water/water_1.png');
    this.water.setScale(8, 8);

    // - Animations
    this.createAnimation('water_idle', 'tantalus/water/water', 1, 1, 5, -1);
    this.createAnimation('water_lower', 'tantalus/water/water', 2, 7, 10, 0);
    this.createAnimation('water_raise', 'tantalus/water/water', 7, 2, 10, 0);

    // - State variables
    this.waterUp = true;
    this.waterDown = false;
    this.waterRaising = false;
    this.waterLowering = false;

    // - Animation complete events
    this.water.on('animationcomplete', function (animation, frame) {
      switch (animation.key) {
      case 'water_lower':
        this.waterDown = true;
        this.waterLowering = false;
        break;

      case 'water_raise':
        this.waterUp = true;
        this.waterRaising = false;
        break;
      }
    }, this);

    this.water.anims.play('water_idle');

    // Ground sprite

    this.ground = this.add.sprite(400, 200, 'atlas', 'tantalus/ground.png');
    this.ground.setScale(8, 8);

    // Instructions

    // - Branch
    let appleInstructionStyle = {
      fontFamily: 'Commodore',
      fontSize: '20px',
      fill: '#000',
      wordWrap: true,
      align: 'center'
    };
    let appleInstructionString = `RAPIDLY ${verb} THE\n${device} IN THE UPPER\nHALF TO TAKE THE FRUIT!`;
    this.appleInstructionsText = this.add.text(3 * this.game.canvas.width / 4, 100, appleInstructionString, appleInstructionStyle);
    this.appleInstructionsText.setOrigin(0.5);

    // - Water
    let waterInstructionStyle = {
      fontFamily: 'Commodore',
      fontSize: '20px',
      fill: '#fff',
      wordWrap: true,
      align: 'center'
    };
    let waterInstructionString = `RAPIDLY ${verb}\nTHE ${device}\nIN THE LOWER\nHALF TO DRINK\nTHE WATER!`;
    this.waterInstructionsText = this.add.text(20, 260, waterInstructionString, waterInstructionStyle);
    this.waterInstructionsText.setOrigin(0, 0);


    // Labels
    let fruitStatStyle = {
      fontFamily: 'Commodore',
      fontSize: '32px',
      fill: '#000',
      wordWrap: true,
      align: 'center'
    };
    let fruitStatString = `FRUIT: 0`;
    this.fruitText = this.add.text(160, 25, fruitStatString, fruitStatStyle);
    this.fruitText.setOrigin(0);
    this.fruitText.setAngle(32);

    let waterStatStyle = {
      fontFamily: 'Commodore',
      fontSize: '32px',
      fill: '#fff',
      wordWrap: true,
      align: 'center'
    };
    let waterStatString = `WATER: 0`;
    this.waterText = this.add.text(this.game.canvas.width / 2, this.game.canvas.height - 40, waterStatString, waterStatStyle);
    this.waterText.setOrigin(0.5);
    // this.waterText.setAngle(32);

    // this.children.getChildren()
    //   .forEach((c) => {
    //     c.alpha = 0.2
    //   });

    this.appleClicks = 0;
    this.waterClicks = 0;
    this.idle = 0;
    this.input.on('pointerdown', (pointer) => {
      if (this.inputEnabled) {
        this.idle = 0;
        if (pointer.y < this.game.canvas.height / 2) {
          this.appleClicks++;
        } else if (pointer.y > this.game.canvas.height / 2) {
          this.waterClicks++;
        }
      }
    });

    let interval = setInterval(() => {
      this.idle++;
      if (TIMEOUT && this.idle > TIMEOUT) {
        clearInterval(interval);
        clearInterval(this.inputInterval);
        this.scene.start(`menu`);
      }
    }, 1000);

    this.inputInterval = setInterval(() => {
      // console.log(this.appleClicks,this.waterClicks);
      if (this.appleClicks > 1 && this.inputEnabled) {
        this.appleSuccess = true;
        this.appleInstructionsText.visible = false;
        this.waterSuccess = false;
      } else if (this.waterClicks > 1 && this.inputEnabled) {
        this.waterSuccess = true;
        this.waterInstructionsText.visible = false;
        this.appleSuccess = false;
      } else {
        this.appleSuccess = false;
        this.waterSuccess = false;
      }
      this.appleClicks = 0;
      this.waterClicks = 0;
    }, 500);
  },

  update: function (time, delta) {
    this.updateTantalus();
  },

  updateTantalus: function () {
    if (this.appleSuccess) {
      this.reach();
    } else {
      this.unreach();
    }

    if (this.waterSuccess) {
      this.stoop();
    } else {
      this.unstoop();
    }
  },

  stoop: function () {
    let key = this.tantalus.anims.currentAnim.key
    if (key === 'tantalus_idle') {
      this.tantalus.x -= 1 * 8;
      this.tantalus.y += 3 * 8;
      this.tantalus.anims.play('stoop');
      this.water.play('water_lower');
      this.waterDownSFX.play();
    }
  },

  unstoop: function () {
    let key = this.tantalus.anims.currentAnim.key
    if (key === 'stoop' || key === 'drinking_fail') {
      this.tantalus.anims.play('unstoop');
      this.water.play('water_raise');
      this.branchUpSFX.play();
    }
  },

  reach: function () {
    let key = this.tantalus.anims.currentAnim.key
    if (key === 'tantalus_idle') {
      this.tantalus.anims.play('reach');
      this.branch.play('branch_raise');
      this.branchUpSFX.play();
    }
  },

  unreach: function () {
    let key = this.tantalus.anims.currentAnim.key
    if (key === 'reach' || key === 'eating_fail') {
      this.tantalus.anims.play('unreach');
      this.branch.play('branch_lower');
      this.waterDownSFX.play();
    }
  },

  // createAnimation(name,start,end)
  //
  // Helper function to generate the frames and animation for Sisyphus between set limits
  createAnimation: function (name, path, start, end, framerate, repeat) {
    let frames = this.anims.generateFrameNames('atlas', {
      start: start,
      end: end,
      zeroPad: 0,
      prefix: path + '_',
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