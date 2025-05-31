class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 200;
        this.DRAG = 800;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -300;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 6.0;
        this.jumps = 0;
        this.maxJumps = 2;

    }

    create() {
        this.walkingNoise = this.sound.add('run', {
            loop: true,
            volume: 0.2
        });

        this.jumpingNoise = this.sound.add('jump');

        this.map = this.add.tilemap("platformer-level-1", 18, 18, 80, 24);
        this.tileset = this.map.addTilesetImage("monochrome_tilemap_packed.png", "tilemap_tiles");
        //Layers
        this.flagLayer = this.map.createLayer("Flag", this.tileset, 0, 0).setDepth(1);
        this.foregroundLayer = this.map.createLayer("Foreground", this.tileset, 0, 0).setDepth(6);
        this.groundLayer = this.map.createLayer("Gound", this.tileset, 0, 0).setDepth(5);
        this.killPartLayer = this.map.createLayer("KillPart", this.tileset, 0, 0).setDepth(4);
        this.backgroundLayer = this.map.createLayer("Backround", this.tileset, 0, 0).setDepth(0);
        this.coinsLayer = this.map.createLayer("Coins", this.tileset, 0, 0).setDepth(1);

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.walkingNoise.stop();
        });
        

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(30, 250, "platformer_characters", "tile_0000.png");
        my.sprite.player.setCollideWorldBounds(true);
        my.sprite.player.setDepth(100);
        my.sprite.player.setScale(.5)

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25);
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

        this.groundLayer.setCollisionByExclusion([-1]);

        this.physics.add.collider(my.sprite.player, this.groundLayer);

        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);
        
        this.coinsLayer.setTileIndexCallback([1,2,3], this.addCoin, this);
        this.physics.add.overlap(my.sprite.player, this.coinsLayer);

        this.killPartLayer.setTileIndexCallback([183, 182, 184], this.killPlayer, this);
        this.physics.add.overlap(my.sprite.player, this.killPartLayer);

    }
    killPlayer(plr, tile) {
        this.cameras.main.flash(100, 255, 0, 0);
        my.sprite.player.setTint(0xffffff);
        this.time.delayedCall(50, () => {
            this.scene.restart();
        });
    }

    addCoin(plr, tile) {
        this.coinsLayer.removeTileAt(tile.x, tile.y, true, true);
    }
    

    update() {
        if(cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            if(!this.walkingNoise.isPlaying) {
                // Only play the sound if it isn't already playing
                this.walkingNoise.play();
            }
    
            // TODO: add particle following code here

        } else if(cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            if(!this.walkingNoise.isPlaying) {
                // Only play the sound if it isn't already playing
                this.walkingNoise.play();
            }
    
            // TODO: add particle following code here

        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            this.walkingNoise.stop();
            // TODO: have the vfx stop playing
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        // Handle animation while airborne
if (!my.sprite.player.body.blocked.down) {
    my.sprite.player.anims.play('jump');
}

// Reset jumps when on the ground
if (my.sprite.player.body.blocked.down) {
    this.jumps = 0;
}

// Jump if under jump limit
if (Phaser.Input.Keyboard.JustDown(cursors.up) && this.jumps < this.maxJumps) {
    my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
    this.jumps++;

    // Play jump sound once per actual jump
    if (!this.jumpingNoise.isPlaying) {
        this.jumpingNoise.play();
    }
}



        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }
    }
}