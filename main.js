var score = 0;
var lives = 3;
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});

function preload(){
	game.load.image("sky", "./assets/sky.png");
	game.load.image("ground", "./assets/ground.png");
	game.load.image("star", "./assets/star.png");
	game.load.image("diamond", "./assets/diamond.png");
	game.load.image("health", "./assets/health.png");

	game.load.spritesheet("dude", "./assets/dude.png")
	game.load.spritesheet("baddie", "./assets/baddie.png")
}

function create(){
	game.physics.startSystem(Phaser.Physics.Arcade);

	game.add.sprite(0, 0, "sky");

	platforms = game.add.physicsGroup();
	platforms.enableBody = true;

	ground = platforms.create(0, 550, "ground");
	ground.scale.setTo(2, 2);
	ground.body.immovable = true;
	ledge = platforms.create(400, 400, "ground");
	ledge.body.immovable = true;
	ledge = platforms.create(-100, 250, "ground");
	ledge.body.immovable = true;

	var style = {
		font: "Arial 32px bold",
		fill: "#fff", 
		boundsAlignH: "center",
		boundsAlignV: "middle",
	};

	var scoreText = "Score: " + score;
	var scoreLabel = game.add.text(300, 560, scoreText, style);

	var livesText = "Lives: " + lives;
	var livesLabel = game.add.text(10, 5, livesText, style);

	stars = game.add.physicsGroup();
	stars.enableBody = true;

	for(var count = 0; count < 12; count = count + 1 ){
		var star = stars.create(count * 70, 0, "star");
		star.body.gravity.y = 200;
		star.body.gravity.x = 0.5 + Math.random()* 0.3;
		star.body.bounce.y = 0.7 + Math.random()* 0.3;

	}

	player = game.add.sprite(32, 400, "dude");
	player.animations.add("left",[0, 1, 2, 3], 10, true);
	player.animations.add("right",[5, 6, 7, 8], 10, true);
	game.physics.arcade.enable(player);
	player.body.bounce.y = 0.2;
	player.body.gravity.y = 300;
	player.body.collideWorldBounds = true;

	enemy1 = game.add.sprite(760, 20, "baddie");
	enemy1.animations.add("left",[0, 1], 10, true);
	enemy1.animations.add("right",[2, 3], 10, true);
	game.physics.arcade.enable(enemy1);
	enemy1.body.bounce.y = 0.2;
	enemy1.body.gravity.y = 500;
	enemy1.body.collideWorldBounds = true;

	enemy2 = game.add.sprite(10, 20, "baddie");
	enemy2.animations.add("left",[0, 1], 10, true);
	enemy2.animations.add("right",[2, 3], 10, true);
	game.physics.arcade.enable(enemy2);
	enemy2.body.bounce.y = 0.2;
	enemy2.body.gravity.y = 500;
	enemy2.body.collideWorldBounds = true;

	enemy3 = game.add.sprite(200, 20, "baddie");
	enemy3.animations.add("left",[0, 1], 10, true);
	enemy3.animations.add("right",[2, 3], 10, true);
	game.physics.arcade.enable(enemy3);
	enemy3.body.bounce.y = 0.2;
	enemy3.body.gravity.y = 500;
	enemy3.body.collideWorldBounds = true;

	cursors = game.input.keyboard.createCursorKeys();
	enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

	diamonds = game.add.physicsGroup();
	diamonds.enableBody = true;

	var diamond = diamonds.create(Math.floor(Math.random()*750), 0, 'diamond');
	diamond.body.gravity.y = 200;
	diamond.body.bounce.y = 0.7 + Math.random() * 0.2;

	hp = game.add.physicsGroup();
  	hp.enableBody = true;

  	goLabel = game.add.text(0, 0, "", style);
  	goLabel.setTextBounds(100, 200, 800, 100);
  	goLabel.visible = false;

}

function update(){
	game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(stars, platforms);
	game.physics.arcade.collide(enemy1, platforms);
	game.physics.arcade.collide(enemy2, platforms);
	game.physics.arcade.collide(enemy3, platforms);
	game.physics.arcade.collide(diamonds, platforms);
	game.physics.arcade.collide(hp, platforms);

	player.body.velocity.x = 0;

	if (cursors.left.isDown){
		player.body.velocity.x = -150;
		player.animations.play("left");
	}

	else if (cursors.right.isDown){
		player.body.velocity.x = 150;
		player.animations.play("right");
	}

	else {
		player.animations.stop();
		player.frame = 4;
	}

	if (cursors.up.isDown && player.body.touching.ground){
		player.body.velocity.y = -300;
	}

	game.physics.arcade.overlap(player, stars, collectStar);
	game.physics.arcade.overlap(player, enemy1, loseLife);
	game.physics.arcade.overlap(player, enemy2, loseLife);
	game.physics.arcade.overlap(player, enemy3, loseLife);
	game.physics.arcade.overlap(player, diamonds, collectDiamond);
	game.physics.arcade.overlap(player, hp, collectHealth);

	moveEnemy();

	if(lives < 0){
		endGame();
	}


}

function collectStar(){

}
function collectDiamond(){

}
function collectHealth(){

}
function loseLife(){

}
function endGame(){

}
function restartGame(){

}
function moveEnemy(){
	
}