class Start extends Phaser.Scene {
    constructor() {
        super("startingscene");
    }

    create() {

        this.add.text(100, 100, "Welcome to Tuna! The Platformer Game!", {
            fontSize: '32px',
            fill: '#fff'
        });

        this.add.text(100, 150, "Press R to start", {
            fontSize: '24px',
            fill: '#fff'
        });

        this.rKey = this.input.keyboard.addKey('R');
        
    }
    update() {
        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.start("platformerScene");

        }
    }
}