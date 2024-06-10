function Shogi_TableView(app, ui_listener, position, pieces) {

	Shogi_Component.call(this, app, ui_listener);

	this.position = position;

	if (this.position == -1) {

		this.element.style.webkitTransform = 'rotate(180deg)';
		this.element.style.transform = 'rotate(180deg)';

	}

	this.pieces = new Array(7);

	this.pieces[0] = {};
	this.pieces[0].piece = Shogi_Piece.KIN;
	this.pieces[0].image = null;
	this.pieces[0].num = 0;

	this.pieces[1] = {};
	this.pieces[1].piece = Shogi_Piece.GIN;
	this.pieces[1].image = null;
	this.pieces[1].num = 0;

	this.pieces[2] = {};
	this.pieces[2].piece = Shogi_Piece.KEI;
	this.pieces[2].image = null;
	this.pieces[2].num = 0;

	this.pieces[3] = {};
	this.pieces[3].piece = Shogi_Piece.KYO;
	this.pieces[3].image = null;
	this.pieces[3].num = 0;

	this.pieces[4] = {};
	this.pieces[4].piece = Shogi_Piece.SHA;
	this.pieces[4].image = null;
	this.pieces[4].num = 0;

	this.pieces[5] = {};
	this.pieces[5].piece = Shogi_Piece.KAKU;
	this.pieces[5].image = null;
	this.pieces[5].num = 0;

	this.pieces[6] = {};
	this.pieces[6].piece = Shogi_Piece.FU;
	this.pieces[6].image = null;
	this.pieces[6].num = 0;

	this.selected_col = 0;

	this.active_bg = '#e0d8e8';
	this.inactive_bg = '#a0a0a8';

	this.setActive(false);

}

Shogi_TableView.prototype = Object.create(Shogi_Component.prototype);
Shogi_TableView.prototype.constructor = Shogi_TableView;

Shogi_TableView.prototype.createElement = function() {

	this.element = document.createElement('canvas');

	this.element.style.display = 'block';
	this.element.style.position = 'absolute';

}

Shogi_TableView.prototype.onRectSetted = function() {

	Shogi_Component.prototype.onRectSetted.call(this);

	this.draw_width = Math.floor(this.rect.width * this.draw_scale);
	this.draw_height = Math.floor(this.rect.height * this.draw_scale);

	this.element.width = this.draw_width;
	this.element.height = this.draw_height;

	this.element.style.width = this.rect.width + 'px';
	this.element.style.height = this.rect.height + 'px';

}

Shogi_TableView.prototype.setActive = function(active) {

	if (active) {
		this.setBackground(this.active_bg);
	} else {
		this.setBackground(this.inactive_bg);
	}

}

Shogi_TableView.prototype.setPieceImages = function(images) {

	var col_span = Math.floor(this.rect.width / 7);
	var col_padding_x = Math.floor((col_span - images[2].width / this.draw_scale) / 2);

	var col_draw_span = Math.floor((this.rect.width * this.draw_scale) / 7);
	var col_draw_padding_x = Math.floor((col_draw_span - images[2].width) / 2);

	this.num_font_size = Math.floor(2 + col_draw_span / 3.5);
	this.num_font = this.num_font_size + "px 'Times New Roman'";

	for (var i = 0;i < 7;i++) {

		this.pieces[i].image = images[this.pieces[i].piece];

		this.pieces[i].left = col_span * i + col_padding_x;
		this.pieces[i].top = Math.floor(this.rect.height / 30);

		this.pieces[i].draw_left = col_draw_padding_x + col_draw_span * i;
		this.pieces[i].draw_top = Math.floor((this.pieces[i].top / 4) * this.draw_scale - 2);

		this.pieces[i].piece_draw_width = images[2].width;
		this.pieces[i].piece_draw_height = images[2].height;

		this.pieces[i].piece_width = Math.floor(images[2].width / this.draw_scale);
		this.pieces[i].piece_height = Math.floor(images[2].height / this.draw_scale);

		this.pieces[i].rect = Shogi_Rect.createRect(this.pieces[i].left, this.pieces[i].top, this.pieces[i].piece_width, Math.floor(this.pieces[i].piece_height * 1.2));

		this.pieces[i].piece_draw_rect = Shogi_Rect.createRect(this.pieces[i].draw_left, this.pieces[i].draw_top, this.pieces[i].piece_draw_width, this.pieces[i].piece_draw_height);

		this.pieces[i].center_x = Math.floor((this.pieces[i].left + images[2].width / 2) * this.draw_scale);
		this.pieces[i].num_draw_y = Math.floor(this.pieces[i].piece_draw_rect.bottom + this.num_font_size * 0.06);

	}

}

Shogi_TableView.prototype.setGame = function(game) {
	this.game = game;
}

Shogi_TableView.prototype.setSelectedCol = function(col) {
	this.selected_col = col;
}

Shogi_TableView.prototype.resetSelectedCol = function() {
	this.selected_col = 0;
}

Shogi_TableView.prototype.update = function() {

	var context = this.element.getContext('2d');

	context.fillStyle = this.background;
	context.fillRect(0, 0, this.draw_width, this.draw_height);

	context.fillStyle = '#000000';
	context.font = this.num_font;
	context.textAlign = 'center';
	context.textBaseline = 'top';

	var mark_width = Math.floor(1 + this.pieces[0].piece_draw_rect.width / 20);

	if (this.game != null) {

		if (this.position == -1) {
			for (var i = 0;i < 7;i++) {
				this.pieces[i].num = this.game.board.up_piece_table[this.pieces[i].piece];
			}
		}

		if (this.position == 1) {
			for (var i = 0;i < 7;i++) {
				this.pieces[i].num = this.game.board.down_piece_table[this.pieces[i].piece];
			}
		}

	}

	for (var i = 0;i < 7;i++) {

		context.drawImage(this.pieces[i].image, this.pieces[i].draw_left, this.pieces[i].draw_top);

		context.fillText(this.pieces[i].num, this.pieces[i].piece_draw_rect.center_x, this.pieces[i].num_draw_y);

		if (this.pieces[i].piece == this.selected_col) {

			context.strokeStyle = '#003399';
			context.lineWidth = mark_width;

			context.strokeRect(this.pieces[i].piece_draw_rect.left + mark_width, this.pieces[i].piece_draw_rect.top + mark_width, this.pieces[i].piece_draw_rect.width - mark_width * 2, this.pieces[i].piece_draw_rect.height - mark_width);

		}

	}

}

Shogi_TableView.prototype.onElementClicked = function(x, y) {

	for (var i = 0;i < 7;i++) {
		if (this.pieces[i].rect.contains(x,y)) {

			if (this.position == -1) {
				this.ui_listener.onTableViewClicked(this, this.pieces[6 - i].piece);
			} else {
				this.ui_listener.onTableViewClicked(this, this.pieces[i].piece);
			}

			break;

		}
	}

}
