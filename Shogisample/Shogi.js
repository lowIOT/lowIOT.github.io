// Shogi.js

/*
    将棋ゲーム本体
*/
function Shogi() {

    this.board_cols = 9;
    this.board_rows = 9;
    this.board_promote_rows = 3;

    this.draw_scale = 1;
    this.text_res = [];

    this.text_res['promote_dialog_text'] = '成りますか？';
    this.text_res['promote_dialog_yes'] = 'はい';
    this.text_res['promote_dialog_no'] = 'いいえ';

    this.text_res['start_button_label'] = '新ゲーム';
    this.text_res['undo_button_label'] = '待った';

    this.text_res['player_human'] = '人間';
    this.text_res['cpu_lv1'] = 'CPU Lv1';
    this.text_res['cpu_lv2'] = 'CPU Lv2';
    this.text_res['cpu_lv3'] = 'CPU Lv3';

    this.text_res['setting_1st'] = '先 手';
    this.text_res['setting_2nd'] = '後 手';
    this.text_res['setting_ok'] = '決 定';
    this.text_res['setting_cancel'] = '戻 る';

    this.text_res['turn_label_1st'] = '先手';
    this.text_res['turn_label_2nd'] = '後手';
    this.text_res['turn_num_label'] = '[:n:]手目';

    this.text_res['player_label'] = [];
    this.text_res[Shogi.PLAYER_HUMAN] = '人間';
    this.text_res[Shogi.PLAYER_CPU_LV1] = 'CPU LV1';
    this.text_res[Shogi.PLAYER_CPU_LV2] = 'CPU LV2';
    this.text_res[Shogi.PLAYER_CPU_LV3] = 'CPU LV3';

    this.rect = null;

    this.piece = new Shogi_Piece();

    this.piece_images = null;

    this.game = null;
    this.game_log = null;

    this.board_processer = new Shogi_BoardProcesser(this.board_cols, this.board_rows, this.board_promote_rows);

    this.game_stage = Shogi.GAME_STAGE_NONE;
    this.movable_hands = null;

    this.rnd = new Shogi_Random(Math.floor(Math.random() * 20000));

}

Shogi.GAME_STAGE_NONE = 0;
Shogi.GAME_STAGE_UP_HUMAN_SELECTING = 1;
Shogi.GAME_STAGE_UP_HUMAN_HOLDING = 2;
Shogi.GAME_STAGE_UP_HUMAN_PUTTING = 3;
Shogi.GAME_STAGE_UP_HUMAN_PUTTED = 4;
Shogi.GAME_STAGE_UP_CPU_SELECTING = 5;
Shogi.GAME_STAGE_UP_CPU_HOLDING = 6;
Shogi.GAME_STAGE_UP_CPU_PUTTED = 7;
Shogi.GAME_STAGE_DOWN_HUMAN_SELECTING = 8;
Shogi.GAME_STAGE_DOWN_HUMAN_HOLDING = 9;
Shogi.GAME_STAGE_DOWN_HUMAN_PUTTING = 10;
Shogi.GAME_STAGE_DOWN_HUMAN_PUTTED = 11;
Shogi.GAME_STAGE_DOWN_CPU_SELECTING = 12;
Shogi.GAME_STAGE_DOWN_CPU_HOLDING = 13;
Shogi.GAME_STAGE_DOWN_CPU_PUTTED = 14;
Shogi.GAME_STAGE_RESULT = 15;

Shogi.PLAYER_NONE = 0;
Shogi.PLAYER_HUMAN = 1;
Shogi.PLAYER_CPU_LV1 = 2;
Shogi.PLAYER_CPU_LV2 = 3;
Shogi.PLAYER_CPU_LV3 = 4;

Shogi.prototype.random = function() {
    return this.rnd.nextFloat();
}

Shogi.prototype.randomInt = function(max) {
    return Math.floor(this.rnd.nextFloat() * (max + 1));
}

Shogi.prototype.setRect = function(left, top, width, height) {

    var frame_r_width = 1.0;

    var header_r_height = 0.1;
    var board_r_height = 1.0;
    var table_r_height = 0.15;

    var frame_aspect = frame_r_width / (header_r_height + (table_r_height * 2) + board_r_height);

    var frame_width = Math.min(width, Math.floor(height / frame_aspect));
    var frame_height = Math.floor(frame_width / frame_aspect);

    if (window.devicePixelRatio) {

        if (window.devicePixelRatio >= 1.5 && frame_width < 800) {
            this.draw_scale = 1.5;
        }

        if (window.devicePixelRatio >= 2.0 && frame_width < 500) {
            this.draw_scale = 2.0;
        }

        if (window.devicePixelRatio >= 3.0 && frame_width < 400) {
            this.draw_scale = 3.0;
        }

    }

    this.rect = Shogi_Rect.createRect(left, top, frame_width, frame_height);

    this.default_font_size = 4 + Math.floor(frame_width / 40);

    var header_width = frame_width;
    var header_height = Math.floor(frame_width * header_r_height);

    var table_height = Math.floor(frame_width * table_r_height);
    var table_width = Math.floor(table_height * 5.2);

    var board_height = Math.floor(frame_width * board_r_height);
    var board_width = board_height;

    var header_left = 0;
    var header_top = 0;

    var up_table_left = frame_width - table_width;
    var up_table_top = header_top + header_height;

    var board_left = 0;
    var board_top = up_table_top + table_height;

    var down_table_left = 0;
    var down_table_top = board_top + board_height;

    this.element = document.createElement('div');

    this.element.style.position = 'relative';
    this.element.style.width = frame_width + 'px';
    this.element.style.height = frame_height + 'px';
    this.element.style.background = '#336699';

    this.header = new Shogi_Header(this, this);
    this.board_view = new Shogi_BoardView(this, this, this.board_cols, this.board_cols);

    this.up_table_view = new Shogi_TableView(this, this, -1, [Shogi_Piece.KIN, Shogi_Piece.GIN, Shogi_Piece.KEI, Shogi_Piece.KYO, Shogi_Piece.SHA, Shogi_Piece.KAKU]);
    this.down_table_view = new Shogi_TableView(this, this, 1, [Shogi_Piece.KIN, Shogi_Piece.GIN, Shogi_Piece.KEI, Shogi_Piece.KYO, Shogi_Piece.SHA, Shogi_Piece.KAKU]);

    this.header.setRect(header_left, header_top, header_width, header_height);
    this.board_view.setRect(board_left, board_top, board_width, board_height);

    this.up_table_view.setRect(up_table_left, up_table_top, table_width, table_height);
    this.down_table_view.setRect(down_table_left, down_table_top, table_width, table_height);

    this.PromoteDialog = {};

    this.PromoteDialog.element = document.createElement('div');

    this.PromoteDialog.element.style.display = 'none';
    this.PromoteDialog.element.style.position = 'absolute';
    this.PromoteDialog.element.style.border = '2px solid';
    this.PromoteDialog.element.style.background = '#d8e0e4';
    this.PromoteDialog.element.style.width = Math.floor(this.board_view.rect.width * 0.52) + 'px';
    this.PromoteDialog.element.style.height = Math.floor(this.board_view.rect.width * 0.3) + 'px';
    this.PromoteDialog.element.style.left = Math.floor(this.board_view.rect.width * 0.23) + 'px';
    this.PromoteDialog.element.style.top = Math.floor(this.board_view.rect.width * 0.65) + 'px';

    this.PromoteDialog.text = document.createElement('div');

    this.PromoteDialog.text.style.position = 'absolute';
    this.PromoteDialog.text.style.width = Math.floor(this.board_view.rect.width * 0.54) + 'px';
    this.PromoteDialog.text.style.height = Math.floor(this.board_view.rect.width * 0.1) + 'px';
    this.PromoteDialog.text.style.fontSize = this.default_font_size + 'px';

    this.PromoteDialog.text.style.textAlign = 'center';
    this.PromoteDialog.text.textContent = this.text_res['promote_dialog_text'];

    this.PromoteDialog.element.appendChild(this.PromoteDialog.text);

    this.PromoteDialog.yes_button = document.createElement('button');

    this.PromoteDialog.yes_button.style.position = 'absolute';
    this.PromoteDialog.yes_button.style.width = Math.floor(this.board_view.rect.width * 0.18) + 'px';
    this.PromoteDialog.yes_button.style.height = Math.floor(this.board_view.rect.width * 0.1) + 'px';
    this.PromoteDialog.yes_button.style.left = Math.floor(this.board_view.rect.width * 0.06) + 'px';
    this.PromoteDialog.yes_button.style.top = Math.floor(this.board_view.rect.width * 0.16) + 'px';
    this.PromoteDialog.yes_button.style.fontSize = this.default_font_size + 'px';
    this.PromoteDialog.yes_button.textContent = this.text_res['promote_dialog_yes'];

    this.PromoteDialog.element.appendChild(this.PromoteDialog.yes_button);


    this.PromoteDialog.no_button = document.createElement('button');

    this.PromoteDialog.no_button.style.position = 'absolute';
    this.PromoteDialog.no_button.style.width = Math.floor(this.board_view.rect.width * 0.18) + 'px';
    this.PromoteDialog.no_button.style.height = Math.floor(this.board_view.rect.width * 0.1) + 'px';
    this.PromoteDialog.no_button.style.left = Math.floor(this.board_view.rect.width * 0.29) + 'px';
    this.PromoteDialog.no_button.style.top = Math.floor(this.board_view.rect.width * 0.16) + 'px';
    this.PromoteDialog.no_button.style.fontSize = this.default_font_size + 'px';
    this.PromoteDialog.no_button.textContent = this.text_res['promote_dialog_no'];

    this.PromoteDialog.element.appendChild(this.PromoteDialog.no_button);

    this.PromoteDialog.yes_button.addEventListener('click', this.onPromoteYesButtonClicked.bind(this));
    this.PromoteDialog.no_button.addEventListener('click', this.onPromoteNoButtonClicked.bind(this));

    this.start_button = document.createElement('button');

    this.start_button.style.display = 'inline-block';
    this.start_button.style.position = 'absolute';
    this.start_button.style.top = Math.floor((header_height - this.default_font_size * 2.4) / 2) + 'px';
    this.start_button.style.right = Math.floor(this.default_font_size) + 'px';
    this.start_button.style.width = Math.floor(this.default_font_size * 8) + 'px';
    this.start_button.style.height = Math.floor(this.default_font_size * 2.4) + 'px';
    this.start_button.innerHTML = this.text_res['start_button_label'];

    var table_space_x = frame_width - table_width;
    var undo_width = Math.floor(table_space_x * 0.7);
    var undo_height = Math.floor(table_height * 0.6);

    this.up_undo_button = new Shogi_Button(this, this);
    this.up_undo_button.setRect(Math.floor(table_space_x * 0.15), up_table_top + Math.floor(table_height * 0.2), undo_width, undo_height);
    this.up_undo_button.setFontSize(this.default_font_size);
    this.up_undo_button.setLabel(this.text_res['undo_button_label']);
    this.up_undo_button.element.style.webkitTransform = 'rotate(180deg)';
    this.up_undo_button.element.style.transform = 'rotate(180deg)';

    this.down_undo_button = new Shogi_Button(this, this);
    this.down_undo_button.setRect(Math.floor(frame_width - table_space_x * 0.15) - undo_width, Math.floor(frame_height - table_height * 0.2) - undo_height, undo_width, undo_height);
    this.down_undo_button.setFontSize(this.default_font_size);
    this.down_undo_button.setLabel(this.text_res['undo_button_label']);

    setTimeout(this.createResources.bind(this), 10);

}

Shogi.prototype.setElement = function(element) {

    element.appendChild(this.element);

    element.addEventListener('touchstart', function(e) {
        e.stopPropagation();
    }, false);

}

Shogi.prototype.createResources = function() {

    this.piece.createPieceImages(this.board_view.cell_width * this.board_view.draw_scale, this.board_view.cell_height * this.board_view.draw_scale);

    setTimeout(this.onResourcesSetuped.bind(this), 1000);

}

Shogi.prototype.onResourcesSetuped = function() {

    this.up_table_view.setPieceImages(this.piece.images);
    this.down_table_view.setPieceImages(this.piece.images);

    this.board_view.setPieceImages(this.piece.images);

    this.element.appendChild(this.header.getHTMLElement());
    this.element.appendChild(this.up_table_view.getHTMLElement());
    this.element.appendChild(this.board_view.getHTMLElement());
    this.element.appendChild(this.down_table_view.getHTMLElement());
    this.element.appendChild(this.PromoteDialog.element);
    this.element.appendChild(this.up_undo_button.element);
    this.element.appendChild(this.down_undo_button.element);

    this.startGame(Shogi_Game.createNewGame());

    this.player_dialog = new Shogi_PlayerDialog(this, this);
    this.player_dialog.setRect(this.rect.left, this.rect.top, this.rect.width, this.rect.height);

    this.element.appendChild(this.player_dialog.element);

    if (window.requestAnimationFrame) {
        requestAnimationFrame(this.process.bind(this));
    } else {
        setTimeout(this.process.bind(this), 30);
    }

}

Shogi.prototype.setGame = function(game) {

    this.game = game;

    this.header.setGame(this.game);
    this.board_view.setGame(this.game);
    this.up_table_view.setGame(this.game);
    this.down_table_view.setGame(this.game);

    this.game_id = this.game.game_id;

}

Shogi.prototype.getTimeMS = function() {

    if (window.performance && window.performance.now) {
        return performance.now();
    } else {
        return Date.now();
    }

}

Shogi.prototype.process = function() {

    this.update();

    switch (this.game_stage) {

    case Shogi.GAME_STAGE_UP_HUMAN_SELECTING:
    case Shogi.GAME_STAGE_UP_HUMAN_PUTTING:
    case Shogi.GAME_STAGE_UP_HUMAN_HOLDING:
    case Shogi.GAME_STAGE_UP_CPU_HOLDING:

        var turn_ms = this.getTimeMS() - this.turn_start_ms;
        this.game.up_player_turn_time = turn_ms;

        break;

    case Shogi.GAME_STAGE_DOWN_HUMAN_SELECTING:
    case Shogi.GAME_STAGE_DOWN_HUMAN_HOLDING:
    case Shogi.GAME_STAGE_DOWN_HUMAN_PUTTING:
    case Shogi.GAME_STAGE_DOWN_CPU_HOLDING:

        var turn_ms = this.getTimeMS() - this.turn_start_ms;
        this.game.down_player_turn_time = turn_ms;

        break;

    }

    if (window.requestAnimationFrame) {
        requestAnimationFrame(this.process.bind(this));
    } else {
        setTimeout(this.process.bind(this), 30);
    }


}

Shogi.prototype.startCPUProcess = function(game, turn, level) {

    var hands = this.board_processer.getAllMovableHand(game.board, turn);

    var hand = hands[Math.floor(Math.random() * hands.length)];

    this.onCPUHandSelected(game, turn, hand);

}

Shogi.prototype.onCPUHandSelected = function(game, turn, hand) {

    switch (turn) {

    case -1:

        this.game_stage = Shogi.GAME_STAGE_UP_CPU_HOLDING;

        if (hand.from_row == -1) {
            this.up_table_view.setSelectedCol(-hand.from_col);
        } else {
            this.board_view.setHolding(hand.from_col, hand.from_row);
        }

        break;

    case 1:

        this.game_stage = Shogi.GAME_STAGE_DOWN_CPU_HOLDING;

        if (hand.from_row == -1) {
            this.down_table_view.setSelectedCol(hand.from_col);
        } else {
            this.board_view.setHolding(hand.from_col, hand.from_row);
        }

        break;

    }

    setTimeout(this.onHandSelected.bind(this, game, hand), 500);

}

Shogi.prototype.startGame = function(game) {

    this.setGame(game);
    this.game_stage = Shogi.GAME_STAGE_NONE;

    this.board_view.reset();
    this.game_log = [];

    this.startTurn(game);

}

Shogi.prototype.startTurn = function(game) {

    if (game == null || game.game_id != this.game_id) {
        return;
    }

    var game_log_item = {};

    game_log_item.game = this.game.clone();
    game_log_item.last_moved = this.board_view.getLastMoved();

    this.game_log[this.game.turn_num] = game_log_item;

    this.game.turn_num++;
    this.turn_start_ms = this.getTimeMS();

    this.game.up_player_turn_time = 0;
    this.game.down_player_turn_time = 0;

    this.up_undo_button.element.disabled = 'disabled';
    this.down_undo_button.element.disabled = 'disabled';

    switch (this.game.turn_player) {

    case -1:

        this.up_table_view.setActive(true);
        this.down_table_view.setActive(false);

        switch (this.game.up_player) {

        case Shogi.PLAYER_HUMAN:

            this.game_stage = Shogi.GAME_STAGE_UP_HUMAN_SELECTING;
            this.up_undo_button.element.disabled = '';

            break;

        case Shogi.PLAYER_CPU_LV1:
        case Shogi.PLAYER_CPU_LV2:
        case Shogi.PLAYER_CPU_LV3:

            this.game_stage = Shogi.GAME_STAGE_UP_CPU_SELECTING;

            this.startCPUProcess(this.game, this.game.turn_player, this.game.up_player - 1);

            break;

        }

        break;

    case 1:

        this.up_table_view.setActive(false);
        this.down_table_view.setActive(true);

        switch (this.game.down_player) {

        case Shogi.PLAYER_HUMAN:

            this.game_stage = Shogi.GAME_STAGE_DOWN_HUMAN_SELECTING;
            this.down_undo_button.element.disabled = '';

            break;

        case Shogi.PLAYER_CPU_LV1:
        case Shogi.PLAYER_CPU_LV2:
        case Shogi.PLAYER_CPU_LV3:

            this.game_stage = Shogi.GAME_STAGE_DOWN_CPU_SELECTING;

            this.startCPUProcess(this.game, this.game.turn_player, this.game.down_player - 1);

            break;

        }

        break;

    }

}

Shogi.prototype.onHandSelected = function(game, hand) {

    if (game.game_id != this.game_id) {
        return;
    }

    switch (this.game_stage) {

    case Shogi.GAME_STAGE_UP_HUMAN_PUTTING:
    case Shogi.GAME_STAGE_UP_HUMAN_HOLDING:
    case Shogi.GAME_STAGE_DOWN_HUMAN_HOLDING:
    case Shogi.GAME_STAGE_DOWN_HUMAN_PUTTING:

        this.putHand(game, hand);

        break;

    case Shogi.GAME_STAGE_UP_CPU_HOLDING:
    case Shogi.GAME_STAGE_DOWN_CPU_HOLDING:

        this.putHand(game, hand);

        break;

    }

}

Shogi.prototype.putHand = function(game, hand) {

    if (game.game_id != this.game_id) {
        return;
    }

    var test_board = this.game.board.clone();

    test_board.putHand(hand);

    if (test_board.isChecked(this.game.turn_player, this.board_processer)) {

        this.board_view.resetHolding();
        this.board_view.resetMovableHands();

        var king_cell = this.game.board.getKingCell(this.game.turn_player);
        this.board_view.setCheckedCell(king_cell);

        switch (this.game_stage) {

        case Shogi.GAME_STAGE_UP_HUMAN_HOLDING:
        case Shogi.GAME_STAGE_UP_HUMAN_PUTTING:

            this.game_stage = Shogi.GAME_STAGE_UP_HUMAN_SELECTING;

            break;

        case Shogi.GAME_STAGE_DOWN_HUMAN_HOLDING:
        case Shogi.GAME_STAGE_DOWN_HUMAN_PUTTING:

            this.game_stage = Shogi.GAME_STAGE_DOWN_HUMAN_SELECTING;

            break;

        }

        return;

    }

    this.board_view.resetCheckedCell();

    this.game.board.putHand(hand);

    var turn_ms = this.getTimeMS() - this.turn_start_ms;

    switch (this.game_stage) {

    case Shogi.GAME_STAGE_UP_HUMAN_HOLDING:
    case Shogi.GAME_STAGE_UP_HUMAN_PUTTING:
    case Shogi.GAME_STAGE_UP_CPU_HOLDING:

        this.game_stage = Shogi.GAME_STAGE_UP_HUMAN_PUTTED;

        this.board_view.setLastMoved(hand.to_col, hand.to_row);

        this.game.up_player_time += turn_ms;
        this.game.up_player_turn_time = 0;

        this.turn_start_ms = 0;

        this.onTurnEnd(game);

        break;

    case Shogi.GAME_STAGE_DOWN_HUMAN_HOLDING:
    case Shogi.GAME_STAGE_DOWN_HUMAN_PUTTING:
    case Shogi.GAME_STAGE_DOWN_CPU_HOLDING:

        this.game_stage = Shogi.GAME_STAGE_DOWN_HUMAN_PUTTED;

        this.board_view.setLastMoved(hand.to_col, hand.to_row);

        this.game.down_player_time += turn_ms;
        this.game.down_player_turn_time = 0;

        this.turn_start_ms = 0;

        this.onTurnEnd(game);

        break;

    }

}

Shogi.prototype.onTurnEnd = function(game) {

    if (game.game_id != this.game_id) {
        return;
    }

    this.board_view.resetHolding();
    this.board_view.resetMovableHands();
    this.up_table_view.resetSelectedCol();
    this.down_table_view.resetSelectedCol();

    var result = 0;

    if (this.board_processer.isLose(this.game.board, -this.game.turn_player)) {
        result = this.game.turn_player;
    }

    if (result == 0) {

        switch (this.game_stage) {

        case Shogi.GAME_STAGE_UP_HUMAN_PUTTED:

            this.game.turn_player = 1;

            break;

        case Shogi.GAME_STAGE_DOWN_HUMAN_PUTTED:

            this.game.turn_player = -1;

            break;

        }

        setTimeout(this.startTurn.bind(this, this.game), 100);

    } else {

        this.game_stage = Shogi.GAME_STAGE_DOWN_HUMAN_RESULT;

        if (this.game.up_player == Shogi.PLAYER_HUMAN) {
            this.up_undo_button.element.disabled = '';
        } else {
            this.up_undo_button.element.disabled = 'disabled';
        }

        if (this.game.down_player == Shogi.PLAYER_HUMAN) {
            this.down_undo_button.element.disabled = '';
        } else {
            this.down_undo_button.element.disabled = 'disabled';
        }

        this.board_view.setLose(-result);

    }
}

Shogi.prototype.getHTMLElement = function() {
    return this.element;
}

Shogi.prototype.update = function() {

    this.header.update();
    this.board_view.update();

    this.up_table_view.update();
    this.down_table_view.update();

}

Shogi.prototype.onPlayerDialogResult = function(up_player, down_player, first) {

    var game = Shogi_Game.createNewGame();

    game.up_player = up_player;
    game.down_player = down_player;

    game.first_player = first;

    if (first == -1) {
        game.turn_player = -1;
    } else {
        game.turn_player = 1;
    }

    this.startGame(game);

}

Shogi.prototype.onTableViewClicked = function(table, piece) {

    if (table == this.up_table_view) {
        piece *= -1;
    }

    if (piece < 0 && this.game.board.up_piece_table[-piece] < 1) {
        return;
    }

    if (piece > 0 && this.game.board.down_piece_table[piece] < 1) {
        return;
    }

    var col = piece;
    var row = -1;

    switch (this.game_stage) {

    case Shogi.GAME_STAGE_UP_HUMAN_SELECTING:

        if (piece < 0) {

            var hands = this.board_processer.getMovableHands(this.game.board, col, row);

            if (hands.length > 0) {

                this.game_stage = Shogi.GAME_STAGE_UP_HUMAN_HOLDING;

                this.holding = {'col': col, 'row': row};
                this.movable_hands = hands;

                this.up_table_view.setSelectedCol(-col);

                this.board_view.setHolding(col, row);
                this.board_view.setMovableHands(this.movable_hands);

            }

        }

        break;

    case Shogi.GAME_STAGE_UP_HUMAN_HOLDING:

        this.game_stage = Shogi.GAME_STAGE_UP_HUMAN_SELECTING;

        this.holding = null;
        this.movable_hands = null;

        this.up_table_view.resetSelectedCol();

        this.board_view.resetHolding();
        this.board_view.resetMovableHands();

        break;

    case Shogi.GAME_STAGE_DOWN_HUMAN_SELECTING:

        if (piece > 0) {

            var hands = this.board_processer.getMovableHands(this.game.board, col, row);

            if (hands.length > 0) {

                this.game_stage = Shogi.GAME_STAGE_DOWN_HUMAN_HOLDING;

                this.holding = {'col': col, 'row': row};
                this.movable_hands = hands;

                this.down_table_view.setSelectedCol(col);

                this.board_view.setHolding(col, row);
                this.board_view.setMovableHands(this.movable_hands);

            }

        }

        break;

    case Shogi.GAME_STAGE_DOWN_HUMAN_HOLDING:

        this.game_stage = Shogi.GAME_STAGE_DOWN_HUMAN_SELECTING;

        this.holding = null;
        this.movable_hands = null;

        this.down_table_view.resetSelectedCol();

        this.board_view.resetHolding();
        this.board_view.resetMovableHands();

        break;

    }

    this.update();

}

Shogi.prototype.onBoardViewCellClicked = function(col, row) {

    var piece = this.game.board.data[col + row * this.game.board.cols];

    this.board_view.resetCheckedCell();

    switch (this.game_stage) {

    case Shogi.GAME_STAGE_UP_HUMAN_SELECTING:

        if (piece < 0) {

            var hands = this.board_processer.getMovableHands(this.game.board, col, row);

            if (hands.length > 0) {

                this.game_stage = Shogi.GAME_STAGE_UP_HUMAN_HOLDING;

                this.holding = {'col': col, 'row': row};
                this.movable_hands = hands;

                this.board_view.setHolding(col, row);
                this.board_view.setMovableHands(this.movable_hands);

            }

        }

        break;

    case Shogi.GAME_STAGE_UP_HUMAN_HOLDING:

        var hands = [];

        for (var i = 0;i < this.movable_hands.length;i++) {
            if (col == this.movable_hands[i].to_col && row == this.movable_hands[i].to_row) {
                hands.push(this.movable_hands[i]);
            }
        }

        if (hands.length >= 1) {

            if (hands.length == 1) {
                this.onHandSelected(this.game, hands[0]);
            } else {

                this.movable_hands = hands;

                this.board_view.resetMovableHands();
                this.up_table_view.resetSelectedCol();

                this.game_stage = Shogi.GAME_STAGE_UP_HUMAN_PUTTING;

                this.PromoteDialog.element.style.display = 'block';

            }

        } else {

            this.game_stage = Shogi.GAME_STAGE_UP_HUMAN_SELECTING;

            this.holding = null;
            this.movable_hands = null;

            this.board_view.resetHolding();
            this.board_view.resetMovableHands();
            this.up_table_view.resetSelectedCol();

        }

        break;

    case Shogi.GAME_STAGE_DOWN_HUMAN_SELECTING:

        if (piece > 0) {

            var hands = this.board_processer.getMovableHands(this.game.board, col, row);

            if (hands.length > 0) {

                this.game_stage = Shogi.GAME_STAGE_DOWN_HUMAN_HOLDING;

                this.holding = {'col': col, 'row': row};
                this.movable_hands = hands;

                this.board_view.setHolding(col, row);
                this.board_view.setMovableHands(this.movable_hands);

            }

        }

        break;

    case Shogi.GAME_STAGE_DOWN_HUMAN_HOLDING:

        var hands = [];

        for (var i = 0;i < this.movable_hands.length;i++) {
            if (col == this.movable_hands[i].to_col && row == this.movable_hands[i].to_row) {
                hands.push(this.movable_hands[i]);
            }
        }

        if (hands.length >= 1) {

            if (hands.length == 1) {
                this.onHandSelected(this.game, hands[0]);
            } else {

                this.movable_hands = hands;

                this.board_view.resetMovableHands();
                this.down_table_view.resetSelectedCol();

                this.game_stage = Shogi.GAME_STAGE_DOWN_HUMAN_PUTTING;

                this.PromoteDialog.element.style.display = 'block';

            }

        } else {

            this.game_stage = Shogi.GAME_STAGE_DOWN_HUMAN_SELECTING;

            this.holding = null;
            this.movable_hands = null;

            this.board_view.resetHolding();
            this.board_view.resetMovableHands();
            this.down_table_view.resetSelectedCol();

        }

        break;

    }

    this.update();

}

Shogi.prototype.onStartButtonClicked = function() {

    this.player_dialog.show();

}

Shogi.prototype.onPromoteYesButtonClicked = function(e) {

    var hand = null;

    for (var i = 0;i < this.movable_hands.length;i++) {
        if (this.movable_hands[i].promote) {
            hand = this.movable_hands[i];
        }
    }

    this.onHandSelected(this.game, hand);

    this.PromoteDialog.element.style.display = 'none';

}

Shogi.prototype.onPromoteNoButtonClicked = function(e) {

    var hand = null;

    for (var i = 0;i < this.movable_hands.length;i++) {
        if (!this.movable_hands[i].promote) {
            hand = this.movable_hands[i];
        }
    }

    this.onHandSelected(this.game, hand);

    this.PromoteDialog.element.style.display = 'none';

}

Shogi.prototype.onListeningComponentClicked = function(comp, x, y) {

    if (comp == this.up_undo_button) {

        var game_log_item = null;

        var log_last = this.game.turn_num - 1;

        if (this.game_stage != Shogi.GAME_STAGE_DOWN_HUMAN_RESULT) {
            log_last--;
        }

        for (var i = log_last;i >= 0;i--) {

            var item = this.game_log[i];

            if (item && item.game.turn_player == -1) {

                game_log_item = item;

                break;

            }
        }

        if (game_log_item != null) {

            var game = game_log_item.game;

            this.setGame(game);

            this.board_view.reset();

            if (game_log_item.last_moved != null) {
                this.board_view.setLastMoved(game_log_item.last_moved.col, game_log_item.last_moved.row);
            }

            this.startTurn(game);

        }

    }

    if (comp == this.down_undo_button) {

        var game_log_item = null;

        var log_last = this.game.turn_num - 1;

        if (this.game_stage != Shogi.GAME_STAGE_DOWN_HUMAN_RESULT) {
            log_last--;
        }

        for (var i = log_last;i >= 0;i--) {

            var item = this.game_log[i];

            if (item && item.game.turn_player == 1) {

                game_log_item = item;

                break;

            }
        }

        if (game_log_item != null) {

            var game = game_log_item.game;

            this.setGame(game);

            this.board_view.reset();

            if (game_log_item.last_moved != null) {
                this.board_view.setLastMoved(game_log_item.last_moved.col, game_log_item.last_moved.row);
            }

            this.startTurn(game);

        }

    }

}

var Shogi_Random = function(num) {

    this.Num = num;

}

Shogi_Random.prototype.nextInt = function() {

    var val = (this.Num * 48271) % 2147483647;

    this.Num = val;

    return val;

}

Shogi_Random.prototype.nextFloat = function() {

    return this.nextInt() / 2147483647;

}
