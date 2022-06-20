let device = "MOUSE";
let verb = "CLICK";

let Menu = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize: function Menu() {
    Phaser.Scene.call(this, {
      key: 'menu'
    });
  },

  create: function () {
    if (!this.sys.game.device.os.desktop) {
      device = "SCREEN";
      verb = "TAP";
    }

    this.cameras.main.setBackgroundColor('#add');
    let titleStyle = {
      fontFamily: 'Commodore',
      fontSize: '38px',
      fill: '#000',
      wordWrap: true,
      align: 'center'
    };
    let title = this.add.text(this.game.canvas.width / 2, 10, "LET'S PLAY:\nANCIENT GREEK PUNISHMENT", titleStyle);
    title.setOrigin(0.5, 0);

    const items = [{
        label: `SISYPHUS`,
        state: `sisyphus`
      },
      {
        label: `TANTALUS`,
        state: `tantalus`
      }, {
        label: `PROMETHEUS`,
        state: `prometheus`
      }, {
        label: `DANAIDS`,
        state: `danaids`
      }, {
        label: `ZENO`,
        state: `zeno`
      }
    ];
    let itemStyle = {
      fontFamily: 'Commodore',
      fontSize: '32px',
      fill: '#000',
      wordWrap: true,
      align: 'center'
    };

    let x = this.game.canvas.width / 2;
    let y = 2 * this.game.canvas.height / 5;
    let spacing = 42;
    for (let i = 0; i < items.length; i++) {
      let item = this.add.text(x, y, `${items[i].label}`, itemStyle)
        .setOrigin(0.5)
        .setInteractive()
        .on(`pointerdown`, () => {
          this.scene.start(items[i].state);
        });

      y += spacing;
    }
  },


  update: function () {

  }

});