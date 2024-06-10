function Shogi_Game() {
    this.board = null;
    this.up_player = 1;
    this.down_player = 1;
    this.turn_player = 1;
    this.turn_num = 0;
    this.first_player = 1;
    this.up_player_time = 0;
    this.down_player_time = 0;
    this.up_player_turn_time = 0;
    this.down_player_turn_time = 0;
    var now = Date.now();
    var rnd = Math.floor(Math.random() * 16);
    this.game_id = (now % 10000000) * 16 + rnd;
}

Shogi_Game.createNewGame = function() {
    var game = new Shogi_Game();
    game.board = Shogi_Board.createBoard();
    return game;
}

Shogi_Game.prototype.clone = function() {
    var game = new Shogi_Game();
    game.board = this.board.clone();
    game.up_player = this.up_player;
    game.down_player = this.down_player;
    game.turn_player = this.turn_player;
    game.turn_num = this.turn_num;
    game.first_player = this.first_player;
    game.up_player_time = this.up_player_time;
    game.down_player_time = this.down_player_time;
    game.up_player_turn_time = this.up_player_turn_time;
    game.down_player_turn_time = this.down_player_turn_time;
    game.game_id = this.game_id;
    return game;
}
