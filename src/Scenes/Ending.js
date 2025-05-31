class Ending extends Phaser.Scene {
    constructor() {
        super("endScene");
    }

    create() {

        this.add.text(100, 100, "You have completed the game!", {
            fontSize: '32px',
            fill: '#fff'
        });

        this.add.text(100, 150, "Press R to restart", {
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