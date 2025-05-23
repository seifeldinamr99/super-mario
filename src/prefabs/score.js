class Score extends Phaser.BitmapText {
    /*
     * displays the player's score at the top left
     * of the screen
     */
    constructor(game, x, y) {
        super(game, x, y, 'press_start_2p', null, 30);

        this.x = 20;
        this.y = 20;

        this.score = 0;
        this.setScore(this.score);

        game.add.existing(this);
    }

    // increment the score
    setScore(score) {
        this.score += score;
        const name = this.game.playerName || 'PLAYER';
        this.setText(`${name.toUpperCase()}\n${this.score}`);


        // Emit score to backend if socket and playerName are set
        if (this.game.playerName && this.game.socket) {
            this.game.socket.emit('score', {
                name: this.game.playerName,
                score: this.score
            });
        }
    }

    /*
     * retrieve score from local storage
     */
    static getScoreLocalStore() {
        if (localStorage.getItem('score') !== null) {
            return localStorage.getItem('score')
        } else {
            return null
        }
    }

    /*
     * store score in local storage
     */
    static setScoreLocalStore(score) {
        localStorage.setItem('score', `${score}`)
    }
}

export default Score;
