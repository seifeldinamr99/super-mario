class MainMenu extends Phaser.Group {
    constructor(game, parent) {
        super(game, parent, 'main_menu', false, false);

        this.game = game;

        // Create name input and start button using DOM
        this.nameInput = this.game.add.dom(this.game.world.centerX, this.game.world.centerY - 100).createFromHTML(`
            <div style="text-align: center;">
                <input type="text" id="playerName" placeholder="Enter your name" style="font-size: 18px; padding: 8px; width: 200px;"/>
                <br/><br/>
                <button id="startGameBtn" style="font-size: 18px; padding: 8px 16px;">Start Game</button>
            </div>
        `);

        this.nameInput.addListener('click');
        this.nameInput.on('click', (event) => {
            if (event.target.id === 'startGameBtn') {
                const name = document.getElementById('playerName').value.trim();
                if (name) {
                    this.game.playerName = name; // Store the name globally in game object
                    this.nameInput.destroy(); // Clean up DOM elements
                    this.createButtons(['help', 'leaderboard', 'options']); // Updated button label
                    this.game.state.start('game'); // Start the game
                } else {
                    alert('Please enter your name!');
                }
            }
        });

        // Optionally, delay showing the rest of the menu until name is entered
        // this.createButtons(['help', 'leaderboard', 'options']);
    }

    createButtons(buttons) {
        this.removeAll();

        for (let index in buttons) {
            let button = this.game.make.button(0, 0, 'buttons', this.buttonOnClick, this, buttons[index], buttons[index], `${buttons[index]}_down`);
            button.name = buttons[index];
            this.add(button);
        }

        this.align(1, -1, 385, 95);

        this.x = this.game.world.centerX - this.width / 2;
        this.y = this.game.world.centerY - 20;
    }

    buttonOnClick(button) {
        switch (button.name) {
            case 'start':
                this.game.state.start('game');
                break;
            case 'help':
                this.game.state.start('help');
                break;
            case 'leaderboard': // Updated logic
                this.game.state.start('highscore'); // Still loads the highscore state
                break;
            case 'back':
                this.createButtons(['start', 'help', 'leaderboard', 'options']); // Updated back logic
                break;
            case 'options':
                this.game.sound.mute ? this.createButtons(['back', 'sound_on']) : this.createButtons(['back', 'sound_off']);
                break;
            case 'sound_on':
                this.createButtons(['back', 'sound_off']);
                this.game.sound.mute = false;
                break;
            case 'sound_off':
                this.createButtons(['back', 'sound_on']);
                this.game.sound.mute = true;
                break;
        }
    }
}

export default MainMenu;
