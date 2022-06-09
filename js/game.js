this.highscore = 0;
var mainState = {

    preload: function () {
        game.load.spritesheet('bird', 'pictures/spritesheets/bird.png',600/4, 150);
        game.load.image('pipe', 'pictures/spritesheets/pipe.png');
        game.load.image('background', 'pictures/backgrounds/background.jpg')
        game.load.audio('jump', 'pictures/sounds/jump.wav');

    },

    create: function () {
        background = game.add.image(0,0,'background');
        background.width = game.width
        background.height = game.height

        game.physics.startSystem(Phaser.Physics.ARCADE); 

        this.bird = game.add.sprite(350, 245, 'bird');
        this.bird.scale.setTo(0.35, 0.35);
        this.bird.animations.add('fly', [0,1,2,3], 15, true);
        this.bird.animations.play('fly');

        this.bird.anchor.setTo(-0.2, 0.5);

        game.physics.arcade.enable(this.bird);

        this.bird.body.gravity.y = 1000;

        var spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceBar.onDown.add(this.jump, this);

        this.pipes = game.add.group();

        this.timer = game.time.events.loop(3200, this.addRowOfPipes, this);

        this.jumpSound = game.add.audio('jump');

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", {
            font: "30px Arial",
            fill: "#ffffff"
        });
        this.labelHiScore = game.add.text(20, 450, "Highscore:  " + highscore, {
            font: "20px Arial",
            fill: "#ffffff"
        });
    },

    addOnePipe: function (x, y) {
        var pipe = game.add.sprite(x, y, 'pipe');

        this.pipes.add(pipe);

        game.physics.arcade.enable(pipe);

        pipe.body.velocity.x = -100;

        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function () {
        var hole = Math.floor(Math.random() * 8) + 1;

        for (var i = 0; i < 9; i++)
            if (i != hole && i != hole + 1)
                this.addOnePipe(1000, i * 55);
                    this.score += 1;
                this.labelScore.text = this.score;
    },

    update: function () {
        if (this.bird.y < 0 || this.bird.y > 500)
            this.restartGame();
            
            if (this.score > highscore) {
                highscore = this.score;
            }

        game.physics.arcade.overlap(
            this.bird, this.pipes, this.hitPipe, null, this);
    },

    jump: function () {
        if (this.bird.alive === false)
            return;
        this.bird.body.velocity.y = -250;

        var animation = game.add.tween(this.bird);

        this.jumpSound.play();

        animation.start();
    },

    hitPipe: function () {
        if (this.bird.alive === false)
            return;

        this.bird.alive = false;

        game.time.events.remove(this.timer);

        this.pipes.forEach(function (p) {
            p.body.velocity.x = 0;
        }, this);

        if (this.score > highscore) {
            highscore = this.score;
        }
        this.gameOverText = false;
    },

    restartGame: function () {
        game.state.start('main');
    },
};

const game = new Phaser.Game(1000, 500);
game.state.add('main', mainState);
game.state.start('main');