var resizeText;
var INPUT_WORD;


BasicGame.Menu = function (game) {


};

BasicGame.Menu.prototype = {

	create: function () {

		if (this.game.device.desktop) {
			INPUT_WORD = 'CLICK';
		}
		else {
			INPUT_WORD = 'TAP';
		}

		// this.game.canvas.style.cursor = 'none';

		menuInputEnabled = true;
		menuInputValid = true;

		// document.body.style.backgroundColor = '#222222';
    this.stage.backgroundColor = '#AADDDD';

		var TITLE_X = 20;
		var TOP_Y = 45;
		BUTTONS_X = this.game.width/2 + 70;

		var MENU_SEPARATION = 70;
		var sButton = this.createButton(TOP_Y,'SISYPHUS',0xAAAAFF,'Sisyphus');
		var tButton = this.createButton(sButton.y + MENU_SEPARATION,'TANTALUS',0xAAFFAA,'Tantalus');
		var pButton = this.createButton(tButton.y + MENU_SEPARATION,'PROMETHEUS',0xFFAAAA,'Prometheus');
		var dButton = this.createButton(pButton.y + MENU_SEPARATION,'DANAIDS',0xDDDDAA,'Danaids');
		var zButton = this.createButton(dButton.y + MENU_SEPARATION,'ZENO',0xDDAADD,'Zeno');

		var MENU_SPACING = 70;

		var titleStyle = { font: FONT_SIZE_BIG*1.2 + "px commodore_64_pixelizedregular", fill: "#000000", lineHeight: 1, wordWrap: true, wordWrapWidth: this.game.width, align: "right"};
		this.titleText = this.game.add.text(0,0, 'LET\'S PLAY:', titleStyle);
		this.titleText.x = TITLE_X
		this.titleText.y = sButton.textField.y;

		this.title2Text = this.game.add.text(0,0, 'ANCIENT GREEK', titleStyle);
		this.title2Text.x = TITLE_X
		this.title2Text.y = tButton.textField.y;;

		this.title3Text = this.game.add.text(0,0, 'PUNISHMENT:', titleStyle);
		this.title3Text.x = TITLE_X
		this.title3Text.y = pButton.textField.y;;

		this.title4Text = this.game.add.text(0,0, 'LIMITED', titleStyle);
		this.title4Text.x = TITLE_X
		this.title4Text.y = dButton.textField.y;;

		this.title5Text = this.game.add.text(0,0, 'EDITION!', titleStyle);
		this.title5Text.x = TITLE_X
		this.title5Text.y = zButton.textField.y;;
	},

	createButton: function (y,title,color,state) {
		var PADDING = SCALE*2;
		var menuItemStyle = { font: FONT_SIZE_BIG*1.2 + "px commodore_64_pixelizedregular", fill: "#000000", lineHeight: 2, wordWrap: true, wordWrapWidth: this.game.width, align: "center"};
		var buttonBG = this.game.add.sprite(0,0,'atlas','white_pixel.png');
		buttonBG.anchor.x = 0;
		var buttonText = this.game.add.text(0,0,title,menuItemStyle);
		buttonText.anchor.x = 0;
		buttonText.x = BUTTONS_X;
		buttonText.y = y;
		buttonBG.x = buttonText.x - PADDING;
		buttonBG.y = buttonText.y - PADDING/2;
		buttonBG.width = buttonText.width + PADDING*2;
		buttonBG.height = buttonText.height + PADDING;
		buttonBG.tint = color;//'#AAAAFF';
		buttonBG.theTint = color;
		buttonBG.inputEnabled = true;
		buttonBG.events.onInputUp.add(this.buttonUp,this);
		buttonBG.events.onInputDown.add(this.buttonDown,this);
		buttonBG.events.onInputOut.add(this.buttonOut,this);
		buttonBG.state = state;
		buttonBG.title = title;
		buttonBG.textField = buttonText;
		return buttonBG;
	},

	buttonUp: function (b, context) {
		if (!menuInputEnabled || !menuInputValid) return;
		b.tint = b.theTint;
		b.game.time.events.add(Phaser.Timer.SECOND * .25,function () {
			b.game.state.start(b.state);
		},this);
		menuInputEnabled = false;
	},

	buttonDown: function (b) {
		if (!menuInputEnabled) return;
		menuInputValid = true;
		b.tint = 0xFFFFFF;
	},

	buttonOut: function (b) {
		menuInputValid = false;
		if (!menuInputEnabled) return;
		b.tint = b.theTint;
	},

	update: function () {

	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		// this.music.stop();

		//	And start the actual game
		this.state.start('Game');

	}

};
