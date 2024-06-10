function Shogi_Board() {
    this.data = null;
    this.cols = 0;
    this.rows = 0;
    this.cells = 0;
    this.up_piece_table = null;
    this.down_piece_table = null;
    this.turn = 0;
}

Shogi_Board.INIT_BOARD = [
    -Shogi_Piece.KYO, -Shogi_Piece.KEI, -Shogi_Piece.GIN, -Shogi_Piece.KIN, -Shogi_Piece.OU, -Shogi_Piece.KIN, -Shogi_Piece.GIN, -Shogi_Piece.KEI, -Shogi_Piece.KYO,
    Shogi_Piece.NONE, -Shogi_Piece.SHA, Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE, -Shogi_Piece.KAKU, Shogi_Piece.NONE,
    -Shogi_Piece.FU, -Shogi_Piece.FU, -Shogi_Piece.FU, -Shogi_Piece.FU, -Shogi_Piece.FU, -Shogi_Piece.FU, -Shogi_Piece.FU, -Shogi_Piece.FU, -Shogi_Piece.FU,
    Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE,
    Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE,
    Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE,
    Shogi_Piece.FU, Shogi_Piece.FU, Shogi_Piece.FU, Shogi_Piece.FU, Shogi_Piece.FU, Shogi_Piece.FU, Shogi_Piece.FU, Shogi_Piece.FU, Shogi_Piece.FU,
    Shogi_Piece.NONE, Shogi_Piece.KAKU, Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.NONE, Shogi_Piece.SHA, Shogi_Piece.NONE,
    Shogi_Piece.KYO, Shogi_Piece.KEI, Shogi_Piece.GIN, Shogi_Piece.KIN, Shogi_Piece.OU, Shogi_Piece.KIN, Shogi_Piece.GIN, Shogi_Piece.KEI, Shogi_Piece.KYO
];

Shogi_Board.INIT_UP_TABLE = [0, 0, 0, 0, 0, 0, 0, 0, 0];
Shogi_Board.INIT_DOWN_TABLE = [0, 0, 0, 0, 0, 0, 0, 0, 0];

Shogi_Board.createBoard = function() {
    var board = new Shogi_Board();
    board.cols = 9;
    board.rows = 9;
    board.cells = board.cols * board.rows;
    board.data = new Array(board.cells);
    for (var i = 0; i < board.cells; i++) {
        board.data[i] = Shogi_Board.INIT_BOARD[i];
    }
    board.up_piece_table = new Array(9);
    board.down_piece_table = new Array(9);
    for (var i = 0; i <= 8; i++) {
        board.up_piece_table[i] = Shogi_Board.INIT_UP_TABLE[i];
        board.down_piece_table[i] = Shogi_Board.INIT_DOWN_TABLE[i];
    }
    return board;
}

Shogi_Board.prototype.set = function(board) {
    for (var i = 0; i < this.cells; i++) {
        this.data[i] = board.data[i];
    }
    for (var i = 0; i <= 8; i++) {
        this.up_piece_table[i] = board.up_piece_table[i];
        this.down_piece_table[i] = board.down_piece_table[i];
    }
    this.turn = board.turn;
}

Shogi_Board.prototype.clone = function() {
    var board = new Shogi_Board();
    board.cols = this.cols;
    board.rows = this.rows;
    board.cells = this.cells;
    board.data = new Array(this.cells);
    for (var i = 0; i < this.cells; i++) {
        board.data[i] = this.data[i];
    }
    board.up_piece_table = new Array(9);
    board.down_piece_table = new Array(9);
    for (var i = 0; i <= 8; i++) {
        board.up_piece_table[i] = this.up_piece_table[i];
        board.down_piece_table[i] = this.down_piece_table[i];
    }
    board.turn = this.turn;
    return board;
}

Shogi_Board.prototype.getKingCell = function(turn) {
    var king_col = -1;
    var king_row = -1;
    for (var row = 0; row < this.rows; row++) {
        for (var col = 0; col < this.cols; col++) {
            if (this.data[col + row * this.rows] * turn == Shogi_Piece.OU) {
                king_col = col;
                king_row = row;
                break;
            }
        }
    }
    return {'col': king_col, 'row': king_row};
}

Shogi_Board.prototype.isChecked = function(turn, processer) {
    var king_col = -1;
    var king_row = -1;
    for (var row = 0; row < this.rows; row++) {
        for (var col = 0; col < this.cols; col++) {
            if (this.data[col + row * this.rows] * turn == Shogi_Piece.OU) {
                king_col = col;
                king_row = row;
                break;
            }
        }
    }
    return processer.isInRange(this, -turn, king_col, king_row);
}

Shogi_Board.prototype.putHand = function(hand) {
    var to_index = hand.to_col + hand.to_row * this.cols;
    var to_piece = this.data[to_index];
    var from_piece = 0;
    if (hand.from_row == -1) {
        from_piece = hand.from_col;
        if (from_piece < 0) {
            this.up_piece_table[-from_piece]--;
        }
        if (from_piece > 0) {
            this.down_piece_table[from_piece]--;
        }
    } else {
        from_piece = this.data[hand.from_col + hand.from_row * this.cols];
        this.data[hand.from_col + hand.from_row * this.cols] = 0;
    }
    if (to_piece * from_piece < 0) {
        if (to_piece < 0) {
            if (to_piece < -Shogi_Piece.PROMOTED) {
                this.down_piece_table[-to_piece - Shogi_Piece.PROMOTED]++;
            } else {
                this.down_piece_table[-to_piece]++;
            }
        }
        if (to_piece > 0) {
            if (to_piece > Shogi_Piece.PROMOTED) {
                this.up_piece_table[to_piece - Shogi_Piece.PROMOTED]++;
            } else {
                this.up_piece_table[to_piece]++;
            }
        }
    }
    if (hand.promote) {
        switch (from_piece) {
            case Shogi_Piece.GIN:
            case Shogi_Piece.KEI:
            case Shogi_Piece.KYO:
            case Shogi_Piece.SHA:
            case Shogi_Piece.KAKU:
            case Shogi_Piece.FU:
                from_piece += Shogi_Piece.PROMOTED;
                break;
            case Shogi_Piece.M_GIN:
            case Shogi_Piece.M_KEI:
            case Shogi_Piece.M_KYO:
            case Shogi_Piece.M_SHA:
            case Shogi_Piece.M_KAKU:
            case Shogi_Piece.M_FU:
                from_piece -= Shogi_Piece.PROMOTED;
                break;
        }
    }
    this.data[to_index] = from_piece;
}
