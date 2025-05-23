import Mario from '../prefabs/mario';
import Clouds from '../prefabs/clouds';
import Hills from '../prefabs/hills';
import Bushes from '../prefabs/bushes';
import Ground from '../prefabs/ground';
import config from '../config';

class Highscore extends Phaser.State {
    constructor() {
        super();
        this.audio = [];
        this.socket = null;
    }

    create() {
        // set up physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = config.GRAVITY;

        // create the scenery
        this.clouds = new Clouds(this.game);
        this.hills = new Hills(this.game);
        this.bushes = new Bushes(this.game);
        this.ground = new Ground(this.game);

        // create an instance of mario
        this.mario = new Mario(this.game, this.game.width * 0.5, this.game.height - 158, 'small', 1, 0.5);

        // play stage clear music
        this.audio['stageclear'] = this.game.add.audio('stageclear', config.VOLUME);
        this.audio['stageclear'].play();

        // display trophy image
        this.trophy = this.game.add.image(this.game.width * 0.5, this.game.height * 0.25, 'trophy');
        this.trophy.anchor.setTo(0.5);

        // header text
        this.headerText = this.game.add.bitmapText(this.game.width * 0.5, this.game.height * 0.4, 'press_start_2p', 'LEADERBOARD', 28);
        this.headerText.anchor.setTo(0.5);

        // loading placeholder
        this.loadingText = this.game.add.bitmapText(this.game.width * 0.5, this.game.height * 0.5, 'press_start_2p', 'Loading...', 20);
        this.loadingText.anchor.setTo(0.5);

        // setup socket
        this.socket = io();

        // ask for leaderboard
        this.socket.emit('requestLeaderboard');

        // receive and display
        this.socket.on('leaderboard', (data) => {
            this.loadingText.destroy();
            this.displayLeaderboard(data);
        });

        // allow return to intro after music ends
        this.audio['stageclear'].onStop.add(() => {
            this.game.input.onTap.add(() => this.game.state.start('intro'), this);
        });
    }

    displayLeaderboard(data) {
        data.slice(0, 5).forEach((entry, index) => {
            const text = this.game.add.bitmapText(
                this.game.width * 0.5,
                this.game.height * 0.5 + 40 + index * 40,
                'press_start_2p',
                `${index + 1}. ${entry.name}: ${entry.score}`,
                20
            );
            text.anchor.setTo(0.5);
        });
    }

    update() {
        this.game.physics.arcade.collide(this.mario, this.ground);
    }
}

export default Highscore;
