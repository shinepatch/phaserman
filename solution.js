var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload:preload, create:create, update:update});
var score = 0;
var life = 3;

function preload(){
  game.load.image('sky', 'assets/sky.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('star', 'assets/star.png');
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32);

  game.load.image('diamond','assets/diamond.png');
  //V2 - load health packs
  game.load.image('health','assets/firstaid.png');
}

function create(){
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	// Create the sky
	game.add.sprite(0, 0, 'sky');
	// Create group of platforms
	platforms = game.add.physicsGroup();
	platforms.enableBody = true;
	// Create the ground
	var ground = platforms.create(0, 550, 'ground');
	ground.scale.setTo(2, 2);
	ground.body.immovable = true;
	// Create the ledges
	var ledge = platforms.create(400, 400, 'ground');
	ledge.body.immovable = true;
	ledge = platforms.create(-100, 250, 'ground');
	ledge.body.immovable = true;

	//set text style
	var style = {font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle"};
	//positioning the score
	scorelabel = game.add.text(300,560, "Score: ", style);
	scoretext = game.add.text(420, 560, score,style);
	scorelabel.setShadow(3,3,'rgba(0,0,0,0.5)',2);
	scoretext.setShadow(3,3,'rgba(0,0,0,0.5)',2);

	//positioning the lives
	lifelabel = game.add.text(10,5, "Lives: ", style);
	lifetext = game.add.text(120,5, life,style);
	lifelabel.setShadow(3,3,'rgba(0,0,0,0.5)',2);
	lifetext.setShadow(3,3,'rgba(0,0,0,0.5)',2);

	//Lesson 8:

	// Create the stars
	stars = game.add.physicsGroup();
	stars.enableBody = true;
	// We will create 12 stars evenly spaced
	for(var i = 0; i < 12; i++){
		var star = stars.create(i * 70, 0, 'star');
		star.body.gravity.y = 200;
		star.body.bounce.y = 0.7 + Math.random() * 0.2;
	}

	// Creating the player sprite
	player = game.add.sprite(32, 400, 'dude');
		// Animating the player sprite
		player.animations.add('left', [0, 1, 2, 3], 10, true);
		player.animations.add('right', [5, 6, 7, 8], 10, true);
		game.physics.arcade.enable(player);
		player.body.bounce.y = 0.2;
		player.body.gravity.y = 300;
		player.body.collideWorldBounds = true;

	// Create the enemy
  	enemy1 = game.add.sprite(760, 20, 'baddie');
    // Animate the enemy1
    	enemy1.animations.add('left', [0,1], 10, true);
    	enemy1.animations.add('right', [2,3], 10, true);
    	game.physics.arcade.enable(enemy1);
    	enemy1.body.bounce.y = 0.2;
    	enemy1.body.gravity.y = 500;
    	enemy1.body.collideWorldBounds = true;


    enemy2 = game.add.sprite(10, 20, 'baddie');
    // Animate the enemy2
    	enemy2.animations.add('left', [0,1], 10, true);
    	enemy2.animations.add('right', [2,3], 10, true);
    	game.physics.arcade.enable(enemy2);
    	enemy2.body.bounce.y = 0.2;
    	enemy2.body.gravity.y = 500;
    	enemy2.body.collideWorldBounds = true;

  	enemy3 = game.add.sprite(200, 20, 'baddie');
    // Animate the enemy3
    	enemy3.animations.add('left', [0,1], 10, true);
    	enemy3.animations.add('right', [2,3], 10, true);
    	game.physics.arcade.enable(enemy3);
    	enemy3.body.bounce.y = 0.2;
    	enemy3.body.gravity.y = 500;
    	enemy3.body.collideWorldBounds = true;

	// Create keyboard entries
	cursors = game.input.keyboard.createCursorKeys();

	//Create diamond bonus sprite
	diamonds = game.add.physicsGroup();
	diamonds.enableBody = true;

	var diamond = diamonds.create(Math.floor(Math.random()*750), 0, 'diamond');
	diamond.body.gravity.y = 200;
	diamond.body.bounce.y = 0.7 + Math.random() * 0.2; 

	//V2 - add enter key as an input
	enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

	//V2 - create health pack group
  	var healths = game.add.physicsGroup();
  	healths.enableBody = true;	

  	//V2 - game over text
  	goText = game.add.text(0,0,'',style);
  	goText.setShadow(3,3,'rgba(0,0,0,0.5)',2);
  	goText.setTextBounds(100,200,800,100);
  	goText.visible = false;
}

function update(){
	game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(stars, platforms);
	game.physics.arcade.collide(enemy1, platforms);
	game.physics.arcade.collide(enemy2, platforms);
	game.physics.arcade.collide(enemy3, platforms);

	//diamond sprite collide
	game.physics.arcade.collide(diamonds, platforms);

	//V2 - collide with health pack
	game.physics.arcade.collide(healths, platforms);

	//reset the player's velocity if no events.
	player.body.velocity.x = 0;

	//player movement by keys
	if(cursors.left.isDown){
		//move left
		player.body.velocity.x = -150;
		player.animations.play('left');
	} else if(cursors.right.isDown){
		//move right
		player.body.velocity.x = 150;
		player.animations.play('right');
	} else {
		player.animations.stop();
		player.frame = 4;
	}

	//allow the player to jump if touching the ground
	if(cursors.up.isDown && player.body.touching.down){
		player.body.velocity.y = -300;
	}

	//Lesson 9:
	game.physics.arcade.overlap(player, stars, collectStar); 
	game.physics.arcade.overlap(player, enemy1, loseLife); 
	game.physics.arcade.overlap(player, enemy2, loseLife); 
	game.physics.arcade.overlap(player, enemy3, loseLife); 

	//collect diamonds
	game.physics.arcade.overlap(player, diamonds, collectDiamond);

	//V2 - collect helthpacks
	game.physics.arcade.overlap(player, healths, collectHealth);

	moveEnemy();

	if(life < 0){
		endGame();
	}
}


//define collectStar function
function collectStar(player,star){
	//update score variable
	score =score +1;
	//reflect in text
	scoretext.setText(score);

	//remove the star and reset to the top
	star.kill();
	star.reset(Math.floor(Math.random()*750),0)

	//V2 - create health pack if collected multiple of 10
  	if(score % 10 == 0){
    	health = healths.create(Math.floor(Math.random()*750),0,'health');
    	health.body.gravity.y = 200;
    	health.body.bounce.y = 0.2;
  	}
}

//define loseLife
function loseLife(player, enemy){
	//lose life
	life -= 1;
	lifetext.setText(life);

	enemy.kill();
	enemy.reset(10, 20);
}

function moveEnemy(){
	//Enemy AI
	if(enemy1.x > 759){
		enemy1.animations.play('left');
		enemy1.body.velocity.x = -120;
	}else if(enemy1.x < 405){
		enemy1.animations.play('right');
		enemy1.body.velocity.x = 120;
	}
	if(enemy2.x > 200){
		enemy2.animations.play('left');
		enemy2.body.velocity.x = -120;
	}else if(enemy2.x < 21){
		enemy2.animations.play('right');
		enemy2.body.velocity.x = 120;
	}
	if(enemy3.x > 759){
		enemy3.animations.play('left');
		enemy3.body.velocity.x = -120;
	}else if(enemy3.x < 201){
		enemy3.animations.play('right');
		enemy3.body.velocity.x = 120;
	}
}

function endGame(){
  player.kill();
  //scorelabel.text="GAME OVER! You scored " + score;
  scoretext.visible = false;
  lifelabel.visible = false;
  lifetext.visible = false;

  //V2 - game over text and restart key
  scorelabel.visible = false;
  goText.text = "GAME OVER! \n You scored " + score + "\n Press Enter to try again...";
  goText.visible = true;

  //add single keydown event to restart game
  enterKey.onDown.addOnce(restartGame);
}

//define collectDiamond
function collectDiamond(player,diamond){
  score += 10;
  scoretext.setText(score);
  diamond.kill();

  diamond.reset(Math.random()*750,0);
}

//V2 - define collectHealth
function collectHealth(player,health){
  life += 1;
  lifetext.setText(life);
  health.kill();
}

//V2 - restarts the game
function restartGame(){
	stars.callAll('kill');
	healths.callAll('kill');
	diamonds.callAll('kill');
	
	for(var i = 0; i < 12; i++){
  	var star = stars.create(i * 70, 0, 'star');
  	star.body.gravity.y = 200;
  	star.body.bounce.y = 0.7 + Math.random() * 0.2;
	}

	var diamond = diamonds.create(Math.floor(Math.random()*750), 0, 'diamond');
	diamond.body.gravity.y = 200;
	diamond.body.bounce.y = 0.7 + Math.random() * 0.2;

  	score = 0;
  	life = 3;
  	player.reset(32, 400);
  	lifetext.setText(life);
  	scoretext.setText(score);
  	goText.visible = false;
  	scorelabel.visible = true;
  	scoretext.visible = true;
  	lifelabel.visible = true;
  	lifetext.visible = true;
}
