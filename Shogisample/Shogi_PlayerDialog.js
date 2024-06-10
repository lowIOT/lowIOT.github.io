// PlayerDialog.js
var Shogi_PlayerSelector = function(app, ui_listener) {
    //selector
    Shogi_Component.call(this, app, ui_listener);
}

Shogi_PlayerSelector.prototype = Object.create(Shogi_Component.prototype);
Shogi_PlayerSelector.prototype.constructor = Shogi_PlayerSelector;

Shogi_PlayerSelector.prototype.createElement = function() {
    this.element = document.createElement('div');
    this.element.style.position = 'absolute';

    this.player_label = document.createElement('div');
    this.prev_button = new Shogi_Button(this.app, this);
    this.next_button = new Shogi_Button(this.app, this);

    this.player_labels = [];
    this.player_labels[0] = this.app.text_res['player_human'];
    this.player_labels[1] = this.app.text_res['cpu_lv1'];
    this.player_labels[2] = this.app.text_res['cpu_lv2'];
    this.player_labels[3] = this.app.text_res['cpu_lv3'];

    this.setPlayer(0);
}

Shogi_PlayerSelector.prototype.setBackground = function(bg) {
    Shogi_Component.prototype.setBackground.call(this, bg);
    this.element.style.background = this.background;
}

Shogi_PlayerSelector.prototype.onRectSetted = function() {
    Shogi_Component.prototype.onRectSetted.call(this);

    var player_label_width = Math.floor(this.rect.width * 0.64);
    var player_label_height = this.rect.height;
    var player_label_left = Math.floor(this.rect.width * 0.18);
    var player_label_top = 0;

    this.player_label.style.display = 'inline-block';
    this.player_label.style.position = 'absolute';
    this.player_label.style.width = player_label_width + 'px';
    this.player_label.style.height = player_label_height + 'px';
    this.player_label.style.lineHeight = player_label_height + 'px';
    this.player_label.style.left = player_label_left + 'px';
    this.player_label.style.top = player_label_top + 'px';
    this.player_label.style.textAlign = 'center';
    this.player_label.style.color = 'rgba(224, 240, 255, 1.0)';
    this.player_label.style.background = 'rgba(32, 32, 32, 1.0)';
    this.player_label.style.fontSize = Math.floor(this.app.default_font_size * 1.5) + 'px';

    this.element.appendChild(this.player_label);

    var button_width = Math.floor(this.rect.width * 0.18);
    var button_height = this.rect.height;

    this.prev_button.setRect(0, 0, button_width, button_height);
    this.prev_button.setBackground('rgba(192, 192, 192, 1.0)');
    this.prev_button.setFontSize(this.app.default_font_size * 2);
    this.prev_button.setLabel('<');

    this.next_button.setRect(this.rect.width - button_width, 0, button_width, button_height);
    this.next_button.setBackground('rgba(192, 192, 192, 1.0)');
    this.next_button.setFontSize(this.app.default_font_size * 2);
    this.next_button.setLabel('>');

    this.element.appendChild(this.prev_button.element);
    this.element.appendChild(this.next_button.element);

    this.player = Shogi.PLAYER_HUMAN;
}

Shogi_PlayerSelector.prototype.onListeningComponentClicked = function(comp, x, y) {
    if (comp == this.prev_button) {
        this.player--;
        if (this.player < Shogi.PLAYER_HUMAN) {
            this.player = Shogi.PLAYER_CPU_LV3;
        }
        this.update();
    }
    if (comp == this.next_button) {
        this.player++;
        if (this.player > Shogi.PLAYER_CPU_LV3) {
            this.player = Shogi.PLAYER_HUMAN;
        }
        this.update();
    }
}

Shogi_PlayerSelector.prototype.setPlayer = function(value) {
    this.player = value;
    this.update();
}

Shogi_PlayerSelector.prototype.onPrevButtonClicked = function(e) {}

Shogi_PlayerSelector.prototype.onNextButtonClicked = function(e) {}

Shogi_PlayerSelector.prototype.update = function() {
    this.player_label.textContent = this.player_labels[this.player - 1];
}

function Shogi_PlayerDialog(app, ui_listener) {
    Shogi_Component.call(this, app, ui_listener);
    this.player_turn_button_selected_bg = '#99ccff';
    this.player_turn_button_unselected_bg = '#999999';
}

Shogi_PlayerDialog.prototype = Object.create(Shogi_Component.prototype);
Shogi_PlayerDialog.prototype.constructor = Shogi_PlayerDialog;

Shogi_PlayerDialog.prototype.createElement = function() {
    this.element = document.createElement('div');
    this.element.style.position = 'absolute';
    this.setBackground('rgba(128, 128, 128, 0.75)');
}

Shogi_PlayerDialog.prototype.setBackground = function(bg) {
    Shogi_Component.prototype.setBackground.call(this, bg);
    this.element.style.background = this.background;

    this.up_player_turn_1st_button = new Shogi_Button(this.app, this);
    this.up_player_turn_2nd_button = new Shogi_Button(this.app, this);
    this.down_player_turn_1st_button = new Shogi_Button(this.app, this);
    this.down_player_turn_2nd_button = new Shogi_Button(this.app, this);

    this.ok_button = new Shogi_Button(this.app, this);
    this.cancel_button = new Shogi_Button(this.app, this);
}

Shogi_PlayerDialog.prototype.show = function() {
    this.element.style.display = 'block';
}

Shogi_PlayerDialog.prototype.onRectSetted = function() {
    Shogi_Component.prototype.onRectSetted.call(this);

    var player_selector_width = Math.floor(this.rect.width * 0.6);
    var player_selector_height = Math.floor(this.rect.width * 0.12);

    var player_turn_button_width = Math.floor(this.rect.width * 0.18);
    var player_turn_button_height = Math.floor(this.rect.width * 0.12);
    var player_turn_button_font_size = Math.floor(this.app.default_font_size * 1.5);

    var up_player_turn_button_top = Math.floor(this.rect.width * 0.05);
    var down_player_turn_button_top = Math.floor(this.rect.height - player_selector_height - (this.rect.width * 0.15 + player_turn_button_height));

    this.up_player_turn_1st_button.setRect(Math.floor(this.rect.width * 0.24), up_player_turn_button_top, player_turn_button_width, player_turn_button_height);
    this.up_player_turn_1st_button.element.style.border = '1px solid';
    this.up_player_turn_1st_button.setBackground(this.player_turn_button_selected_bg);
    this.up_player_turn_1st_button.setFontSize(player_turn_button_font_size);
    this.up_player_turn_1st_button.setLabel(this.app.text_res['setting_1st']);
    this.up_player_turn_1st_button.value = 1;
    this.element.appendChild(this.up_player_turn_1st_button.element);

    this.up_player_turn_2nd_button.setRect(Math.floor(this.rect.width * 0.58), up_player_turn_button_top, player_turn_button_width, player_turn_button_height);
    this.up_player_turn_2nd_button.setBackground(this.player_turn_button_unselected_bg);
    this.up_player_turn_2nd_button.setFontSize(player_turn_button_font_size);
    this.up_player_turn_2nd_button.setLabel(this.app.text_res['setting_2nd']);
    this.up_player_turn_2nd_button.value = 2;
    this.up_player_turn_2nd_button.element.style.border = '1px solid';
    this.element.appendChild(this.up_player_turn_2nd_button.element);

    this.down_player_turn_1st_button.setRect(Math.floor(this.rect.width * 0.24), down_player_turn_button_top, player_turn_button_width, player_turn_button_height);
    this.down_player_turn_1st_button.element.style.border = '1px solid';
    this.down_player_turn_1st_button.setBackground(this.player_turn_button_selected_bg);
    this.down_player_turn_1st_button.setFontSize(player_turn_button_font_size);
    this.down_player_turn_1st_button.setLabel(this.app.text_res['setting_1st']);
    this.down_player_turn_1st_button.value = 3;
    this.element.appendChild(this.down_player_turn_1st_button.element);

    this.down_player_turn_2nd_button.setRect(Math.floor(this.rect.width * 0.58), down_player_turn_button_top, player_turn_button_width, player_turn_button_height);
    this.down_player_turn_2nd_button.element.style.border = '1px solid';
    this.down_player_turn_2nd_button.setBackground(this.player_turn_button_unselected_bg);
    this.down_player_turn_2nd_button.setFontSize(player_turn_button_font_size);
    this.down_player_turn_2nd_button.setLabel(this.app.text_res['setting_2nd']);
    this.down_player_turn_2nd_button.value = 4;
    this.element.appendChild(this.down_player_turn_2nd_button.element);

    var player_selector_left = Math.floor((this.rect.width - player_selector_width) / 2);
    var up_player_selector_top = Math.floor(this.rect.width * 0.27);
    var down_player_selector_top = Math.floor(this.rect.height - player_selector_height - this.rect.width * 0.05);

    this.up_player_selector = new Shogi_PlayerSelector(this.app, this);
    this.up_player_selector.setRect(player_selector_left, up_player_selector_top, player_selector_width, player_selector_height);
    this.element.appendChild(this.up_player_selector.element);

    this.down_player_selector = new Shogi_PlayerSelector(this.app, this);
    this.down_player_selector.setRect(player_selector_left, down_player_selector_top, player_selector_width, player_selector_height);
    this.element.appendChild(this.down_player_selector.element);

    var result_button_width = Math.floor(this.rect.width * 0.25);
    var result_button_height = Math.floor(this.rect.width * 0.12);
    var result_button_top = Math.floor(this.rect.height * 0.45);

    this.ok_button.setRect(Math.floor(this.rect.width * 0.5 - (result_button_width + this.rect.width * 0.05)), result_button_top, result_button_width, result_button_height);
    this.ok_button.setFontSize(Math.floor(this.app.default_font_size * 1.5));
    this.ok_button.setLabel(this.app.text_res['setting_ok']);
    this.element.appendChild(this.ok_button.element);

    this.cancel_button.setRect(Math.floor(this.rect.width * 0.55), result_button_top, result_button_width, result_button_height);
    this.cancel_button.setFontSize(Math.floor(this.app.default_font_size * 1.5));
    this.cancel_button.setLabel(this.app.text_res['setting_cancel']);
    this.element.appendChild(this.cancel_button.element);

    this.up_player_selector.setPlayer(Shogi.PLAYER_CPU_LV1);
    this.down_player_selector.setPlayer(Shogi.PLAYER_HUMAN);
    this.setPlayerTurn(3);
}

Shogi_PlayerDialog.prototype.setPlayerTurn = function(pos) {
    this.up_player_turn_1st_button.setBackground(this.player_turn_button_unselected_bg);
    this.up_player_turn_2nd_button.setBackground(this.player_turn_button_unselected_bg);
    this.down_player_turn_1st_button.setBackground(this.player_turn_button_unselected_bg);
    this.down_player_turn_2nd_button.setBackground(this.player_turn_button_unselected_bg);

    switch (pos) {
        case 1:
            this.first_player = -1;
            this.up_player_turn_1st_button.setBackground(this.player_turn_button_selected_bg);
            this.down_player_turn_2nd_button.setBackground(this.player_turn_button_selected_bg);
            break;
        case 2:
            this.first_player = 1;
            this.up_player_turn_2nd_button.setBackground(this.player_turn_button_selected_bg);
            this.down_player_turn_1st_button.setBackground(this.player_turn_button_selected_bg);
            break;
        case 3:
            this.first_player = 1;
            this.up_player_turn_2nd_button.setBackground(this.player_turn_button_selected_bg);
            this.down_player_turn_1st_button.setBackground(this.player_turn_button_selected_bg);
            break;
        case 4:
            this.first_player = -1;
            this.up_player_turn_1st_button.setBackground(this.player_turn_button_selected_bg);
            this.down_player_turn_2nd_button.setBackground(this.player_turn_button_selected_bg);
            break;
    }
}

Shogi_PlayerDialog.prototype.onListeningComponentClicked = function(comp, x, y) {
    if (comp.value) {
        this.setPlayerTurn(parseInt(comp.value));
    }
    if (comp == this.cancel_button) {
        this.element.style.display = 'none';
    }
    if (comp == this.ok_button) {
        this.ui_listener.onPlayerDialogResult(this.up_player_selector.player, this.down_player_selector.player, this.first_player);
        this.element.style.display = 'none';
    }
}

Shogi_PlayerDialog.prototype.onTurnButtonClicked = function(e) {
    if (e.target == this.up_first_button) {
        this.UpTurn = 1;
        this.DownTurn = 2;
    }
    if (e.target == this.up_second_button) {
        this.UpTurn = 2;
        this.DownTurn = 1;
    }
    if (e.target == this.down_first_button) {
        this.UpTurn = 2;
        this.DownTurn = 1;
    }
    if (e.target == this.down_second_button) {
        this.UpTurn = 1;
        this.DownTurn = 2;
    }
    this.update();
}

Shogi_PlayerDialog.prototype.update = function() {}
