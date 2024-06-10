function Shogi_BoardProcesser(cols, rows, promote_rows) {

	this.cols = cols;
	this.rows = rows;

	this.promote_rows = promote_rows;

	this.up_promote_row = this.promote_rows - 1;
	this.down_promote_row = this.rows - this.promote_rows;

}

Shogi_BoardProcesser.prototype.getAllMovableHand = function(board, turn) {

	var cols = board.cols;
	var rows = board.rows;

	var king_col = -1;
	var king_row = -1;

	for (var row = 0;row < rows;row++) {
		for (var col = 0;col < cols;col++) {
			if (turn * board.data[col + row * cols] == Shogi_Piece.OU) {

				king_col = col;
				king_row = row;

				break;

			}
		}
	}

	return this.getAllMovableHandWithKingPos(board, turn, king_col, king_row);

}

Shogi_BoardProcesser.prototype.getAllMovableHandWithKingPos = function(board, turn, king_col, king_row) {

	var cols = board.cols;
	var rows = board.rows;

	var hands = [];
	var result_hands = [];

	var test_board = board.clone();

	for (var row = 0;row < rows;row++) {

		var rc = row * cols;

		for (var col = 0;col < cols;col++) {
			if (turn * board.data[col + rc] > 0) {

				var piece_hands = this.getMovableHands(board, col, row);

				var hands_num = piece_hands.length;

				for (var i = 0;i < hands_num;i++) {

					var kc = king_col;
					var kr = king_row;

					var hand = piece_hands[i];

					if (hand.from_col == king_col && hand.from_row == king_row) {

						kc = hand.to_col;
						kr = hand.to_row;

					}

					test_board.set(board);
					test_board.putHand(hand);

					if (!this.isInRange(test_board, -turn, kc, kr)) {
						result_hands.push(hand);
					}

				}

			}
		}

	}

	var check_test = this.isInRange(board, -turn, king_col, king_row);

	if (check_test) {

		if (turn < 0) {

			for (var i = 2;i <= 8;i++) {
				if (board.up_piece_table[i] > 0) {

					var piece_hands = this.getMovableHands(board, -i, -1);

					var hands_num = piece_hands.length;

					for (var j = 0;j < hands_num;j++) {

						var hand = piece_hands[j];


						test_board.set(board);
						test_board.putHand(hand);

						if (!this.isInRange(test_board, -turn, king_col, king_row)) {
							result_hands.push(hand);
						}

					}

				}
			}

		}

		if (turn > 0) {

			for (var i = 2;i <= 8;i++) {
				if (board.down_piece_table[i] > 0) {

					var piece_hands = this.getMovableHands(board, i, -1);

					var hands_num = piece_hands.length;

					for (var j = 0;j < hands_num;j++) {

						var hand = piece_hands[j];

						test_board.set(board);
						test_board.putHand(hand);

						if (!this.isInRange(test_board, -turn, king_col, king_row)) {
							result_hands.push(hand);
						}

					}

				}
			}

		}

	} else {

		if (turn < 0) {

			for (var i = 2;i <= 8;i++) {
				if (board.up_piece_table[i] > 0) {

					var piece_hands = this.getMovableHands(board, -i, -1);

					if (piece_hands && piece_hands.length > 0) {
						Array.prototype.push.apply(result_hands, piece_hands);
					}

				}
			}

		}

		if (turn > 0) {

			for (var i = 2;i <= 8;i++) {
				if (board.down_piece_table[i] > 0) {

					var piece_hands = this.getMovableHands(board, i, -1);

					if (piece_hands && piece_hands.length > 0) {
						Array.prototype.push.apply(result_hands, piece_hands);
					}

				}
			}

		}

	}

	return result_hands;

}

Shogi_BoardProcesser.prototype.isInRange = function(board, turn, col, row) {

	var board_data = board.data;

	var cols = this.cols;
	var rows = this.rows;

	var scol = col - 1;
	var ecol = col + 1;
	var srow = row - 1;
	var erow = row + 1;

	if (scol < 0) {
		scol = 0;
	}

	if (ecol >= cols) {
		ecol = cols - 1;
	}

	if (srow < 0) {
		srow = 0;
	}

	if (erow >= rows) {
		erow = rows - 1;
	}

	if (turn == -1) {

		for (var r = srow;r <= erow;r++) {

			var rc = r * cols;

			for (var c = scol;c <= ecol;c++) {

				if (r == row && c == col) {
					continue;
				}

				switch (board_data[c + rc]) {

				case -Shogi_Piece.OU:
				case -Shogi_Piece.SHA_P:
				case -Shogi_Piece.KAKU_P:

					return true;

				case -Shogi_Piece.KIN:
				case -Shogi_Piece.GIN_P:
				case -Shogi_Piece.KEI_P:
				case -Shogi_Piece.KYO_P:
				case -Shogi_Piece.FU_P:

					if (!((r == row + 1) && (c != col))) {
						return true;
					}

					break;

				case -Shogi_Piece.GIN:

					if (!(r == row) && !((r == row + 1) && (c == col))) {
						return true;
					}

					break;

				case -Shogi_Piece.FU:

					if (r == row - 1 && c == col) {
						return true;
					}

					break;

				}

			}
		}

		if (row > 0) {
			for (var r = row - 1;r >= 0;r--) {

				var rc = r * cols;
				var p = board_data[col + rc];

				if (p == -Shogi_Piece.KYO || p == -Shogi_Piece.SHA || p == -Shogi_Piece.SHA_P) {
					return true;
				}

				if (p != 0) {
					break;
				}

			}
		}

		if (row < rows - 1) {
			for (var r = row + 1;r < rows;r++) {

				var rc = r * cols;
				var p = board_data[col + rc];

				if (p == -Shogi_Piece.SHA || p == -Shogi_Piece.SHA_P) {
					return true;
				}

				if (p != 0) {
					break;
				}

			}
		}

		var rc = row * cols;

		if (col > 0) {
			for (var c = col - 1;c >= 0;c--) {

				var p = board_data[c + rc];

				if (p == -Shogi_Piece.SHA || p == -Shogi_Piece.SHA_P) {
					return true;
				}

				if (p != 0) {
					break;
				}

			}
		}

		if (col < cols - 1) {
			for (var c = col + 1;c < cols;c++) {

				var p = board_data[c + rc];

				if (p == -Shogi_Piece.SHA || p == -Shogi_Piece.SHA_P) {
					return true;
				}

				if (p != 0) {
					break;
				}

			}
		}

		if ((col > 0) && (row >= 2) && (board_data[(col - 1) + (row - 2) * cols] == -Shogi_Piece.KEI)) {
			return true;
		}

		if ((col < cols - 1) && (row >= 2) && (board_data[(col + 1) + (row - 2) * cols] == -Shogi_Piece.KEI)) {
			return true;
		}

	}

	if (turn == 1) {

		for (var r = srow;r <= erow;r++) {

			var rc = r * cols;

			for (var c = scol;c <= ecol;c++) {

				if (r == row && c == col) {
					continue;
				}

				switch (board_data[c + rc]) {

				case Shogi_Piece.OU:
				case Shogi_Piece.SHA_P:
				case Shogi_Piece.KAKU_P:

					return true;

				case Shogi_Piece.KIN:
				case Shogi_Piece.GIN_P:
				case Shogi_Piece.KEI_P:
				case Shogi_Piece.KYO_P:
				case Shogi_Piece.FU_P:

					if (!((r == row - 1) && (c != col))) {
						return true;
					}

					break;

				case Shogi_Piece.GIN:

					if (!(r == row) && !((r == row - 1) && (c == col))) {
						return true;
					}

					break;

				case Shogi_Piece.FU:

					if (r == row + 1 && c == col) {
						return true;
					}

					break;

				}

			}
		}

		if (row > 0) {
			for (var r = row - 1;r >= 0;r--) {

				var rc = r * cols;
				var p = board_data[col + rc];

				if (p == Shogi_Piece.SHA || p == Shogi_Piece.SHA_P) {
					return true;
				}

				if (p != 0) {
					break;
				}

			}
		}

		if (row < rows - 1) {
			for (var r = row + 1;r < rows;r++) {

				var rc = r * cols;
				var p = board_data[col + rc];

				if (p == Shogi_Piece.KYO || p == Shogi_Piece.SHA || p == Shogi_Piece.SHA_P) {
					return true;
				}

				if (p != 0) {
					break;
				}

			}
		}

		var rc = row * cols;

		if (col > 0) {
			for (var c = col - 1;c >= 0;c--) {

				var p = board_data[c + rc];

				if (p == Shogi_Piece.SHA || p == Shogi_Piece.SHA_P) {
					return true;
				}

				if (p != 0) {
					break;
				}

			}
		}

		if (col < cols - 1) {
			for (var c = col + 1;c < cols;c++) {

				var p = board_data[c + rc];

				if (p == Shogi_Piece.SHA || p == Shogi_Piece.SHA_P) {
					return true;
				}

				if (p != 0) {
					break;
				}

			}
		}

		if ((col > 0) && (row < rows - 2) && (board_data[(col - 1) + (row + 2) * cols] == Shogi_Piece.KEI)) {
			return true;
		}

		if ((col < cols - 1) && (row < rows - 2) && (board_data[(col + 1) + (row + 2) * cols] == Shogi_Piece.KEI)) {
			return true;
		}

	}

	if (col > 0 && row > 0) {

		var dcol = col - 1;
		var drow = row - 1;

		while (dcol >= 0 && drow >= 0) {

			var p = board_data[dcol + drow * cols] * turn;

			if (p == Shogi_Piece.KAKU || p == Shogi_Piece.KAKU_P) {
				return true;
			}

			if (p != 0) {
				break;
			}

			dcol--;
			drow--;

		}

	}

	if (col < cols - 1 && row > 0) {

		var dcol = col + 1;
		var drow = row - 1;

		while (dcol < cols && drow >= 0) {

			var p = board_data[dcol + drow * cols] * turn;

			if (p == Shogi_Piece.KAKU || p == Shogi_Piece.KAKU_P) {
				return true;
			}

			if (p != 0) {
				break;
			}

			dcol++;
			drow--;

		}

	}

	if (col > 0 && row < rows - 1) {

		var dcol = col - 1;
		var drow = row + 1;

		while (dcol >= 0 && drow < rows) {

			var p = board_data[dcol + drow * cols] * turn;

			if (p == Shogi_Piece.KAKU || p == Shogi_Piece.KAKU_P) {
				return true;
			}

			if (p != 0) {
				break;
			}

			dcol--;
			drow++;

		}

	}

	if (col < cols - 1 && row < rows - 1) {

		var dcol = col + 1;
		var drow = row + 1;

		while (dcol < cols && drow < rows) {

			var p = board_data[dcol + drow * cols] * turn;

			if (p == Shogi_Piece.KAKU || p == Shogi_Piece.KAKU_P) {
				return true;
			}

			if (p != 0) {
				break;
			}

			dcol++;
			drow++;

		}

	}

	return false;

}


Shogi_BoardProcesser.prototype.setRangeMap = function(board, range_map1, range_map2) {

	var board_cells = board.data;
	var cols = this.cols;
	var rows = this.rows;
	var cells = cols * rows;

	var colsm1 = cols - 1;

	for (var i = 0;i < cells;i++) {

		range_map1[i] = false;
		range_map2[i] = false;

	}

	var p_index = 0;

	for (var row = 0;row < rows;row++) {

		var row_nt1 = row >= 1;
		var row_nb1 = row < colsm1;

		for (var col = 0;col < cols;col++) {

			var piece = board_cells[p_index];

			if (piece < 0) {

				if (piece >= Shogi_Piece.M_FU_P && piece <= Shogi_Piece.M_GIN_P) {
					piece = Shogi_Piece.M_KIN;
				}

				switch (piece) {

				case Shogi_Piece.M_FU:

					range_map1[p_index + cols] = true;

					break;

				case Shogi_Piece.M_OU:

					if (row_nt1) {

						var p_m1 = p_index - cols;

						if (col > 0) {
							range_map1[p_m1 - 1] = true;
						}

						range_map1[p_m1] = true;

						if (col < cols - 1) {
							range_map1[p_index - colsm1] = true;
						}

					}

					if (col > 0) {
						range_map1[p_index - 1] = true;
					}

					if (col < cols - 1) {
						range_map1[p_index + 1] = true;
					}

					if (row_nb1) {

						var p_p1 = p_index + cols;

						if (col > 0) {
							range_map1[p_p1 - 1] = true;
						}

						range_map1[p_p1] = true;

						if (col < cols - 1) {
							range_map1[p_p1 + 1] = true;
						}

					}

					break;

				case Shogi_Piece.M_KIN:

					if (row_nt1) {
						range_map1[p_index - cols] = true;
					}

					if (col > 0) {
						range_map1[p_index - 1] = true;
					}

					if (col < cols - 1) {
						range_map1[p_index + 1] = true;
					}

					if (row_nb1) {

						var p_p1 = p_index + cols;

						if (col > 0) {
							range_map1[p_p1 - 1] = true;
						}

						range_map1[p_p1] = true;

						if (col < cols - 1) {
							range_map1[p_p1 + 1] = true;
						}

					}

					break;

				case Shogi_Piece.M_GIN:

					if (row_nt1) {

						if (col > 0) {
							range_map1[p_index - 1 - cols] = true;
						}

						if (col < cols - 1) {
							range_map1[p_index - colsm1] = true;
						}

					}

					if (row_nb1) {

						var pp = p_index + cols;

						if (col > 0) {
							range_map1[pp - 1] = true;
						}

						range_map1[pp] = true;

						if (col < cols - 1) {
							range_map1[pp + 1] = true;
						}

					}

					break;

				case Shogi_Piece.M_KEI:

					var p_pr2 = p_index + cols * 2;

					if(col >= 1) {
						range_map1[p_pr2 - 1] = true;
					}

					if(col <= cols - 2) {
						range_map1[p_pr2 + 1] = true;
					}

					break;

				case Shogi_Piece.M_KYO:

					var to = col + (row + 1) * cols;

					while (to < cells) {

						range_map1[to] = true;

						if (board_cells[to] != 0) {
							break;
						}

						to += cols;

					}

					break;

				case Shogi_Piece.M_SHA:
				case Shogi_Piece.M_SHA_P:

					if (row < rows - 1) {

						var to = p_index + cols;

						while (to < cells) {

							range_map1[to] = true;

							if (board_cells[to] != 0) {
								break;
							}

							to += cols;

						}

						if (piece == Shogi_Piece.M_SHA_P) {

							if (col < colsm1) {
								range_map1[col + 1 + (row + 1) * cols] = true;
							}

							if (col > 0) {
								range_map1[col - 1 + (row + 1) * cols] = true;
							}

						}

					}

					if (row > 0) {

						var to = p_index - cols;

						while (to >= 0) {

							range_map1[to] = true;

							if (board_cells[to] != 0) {
								break;
							}

							to -= cols;

						}

						if (piece == Shogi_Piece.M_SHA_P) {

							if (col < colsm1) {
								range_map1[col + 1 + (row - 1) * cols] = true;
							}

							if (col > 0) {
								range_map1[col - 1 + (row - 1) * cols] = true;
							}

						}

					}

					if (col < cols - 1) {

						var to = p_index + 1;

						for (var c = col + 1;c < cols;c++) {

							range_map1[to] = true;

							if (board_cells[to] != 0) {
								break;
							}

							to++;

						}

					}

					if (col > 0) {

						var to = p_index - 1;

						for (var c = col - 1;c >= 0;c--) {

							range_map1[to] = true;

							if (board_cells[to] != 0) {
								break;
							}

							to--;

						}

					}

					break;

				case Shogi_Piece.M_KAKU:
				case Shogi_Piece.M_KAKU_P:

					if (row > 0) {

						var dcol = col - 1, drow = row - 1;
						var to = dcol + drow * cols;

						while (dcol >= 0 && drow >= 0) {

							range_map1[to] = true;

							if (board_cells[to] != 0) {
								break;
							}

							dcol--;
							drow--;

							to -= cols + 1;

						}

						var dcol = col + 1, drow = row - 1;
						var to = dcol + drow * cols;

						while (dcol < cols && drow >= 0) {

							range_map1[to] = true;

							if (board_cells[to] != 0) {
								break;
							}

							dcol++;
							drow--;

							to -= cols - 1;

						}

						if (piece == Shogi_Piece.M_KAKU_P) {
							range_map1[col + (row - 1) * cols] = true;
						}

					}

					if (row < cols - 1) {

						var dcol = col - 1, drow = row + 1;

						while (dcol >= 0 && drow < rows) {

							var to = dcol + drow * cols;

							range_map1[to] = true;

							if (board_cells[to] != 0) {
								break;
							}

							dcol--;
							drow++;

						}

						var dcol = col + 1, drow = row + 1;

						while (dcol < cols && drow < rows) {

							var to = dcol + drow * cols;

							range_map1[to] = true;

							if (board_cells[to] != 0) {
								break;
							}

							dcol++;
							drow++;

						}

						if (piece == Shogi_Piece.M_KAKU_P) {
							range_map1[p_index + cols] = true;
						}

					}

					if (piece == Shogi_Piece.M_KAKU_P) {

						if (col > 0) {
							range_map1[p_index - 1] = true;
						}

						if (col < cols - 1) {
							range_map1[p_index + 1] = true;
						}

					}

					break;

				}

			}

			if (piece > 0) {

				if (piece >= Shogi_Piece.GIN_P && piece <= Shogi_Piece.FU_P) {
					piece = Shogi_Piece.KIN;
				}

				switch (piece) {

				case Shogi_Piece.FU:

					range_map2[p_index - cols] = true;

					break;

				case Shogi_Piece.OU:

					if (row_nt1) {

						if (col > 0) {
							range_map2[p_index - cols - 1] = true;
						}

						range_map2[p_index - cols] = true;

						if (col < cols - 1) {
							range_map2[p_index - colsm1] = true;
						}

					}

					if (col > 0) {
						range_map2[p_index - 1] = true;
					}

					if (col < cols - 1) {
						range_map2[p_index + 1] = true;
					}

					if (row_nb1) {

						if (col > 0) {
							range_map2[p_index + colsm1] = true;
						}

						range_map2[p_index + cols] = true;

						if (col < cols - 1) {
							range_map2[p_index + cols + 1] = true;
						}

					}

					break;

				case Shogi_Piece.KIN:

					if (row_nt1) {

						if (col > 0) {
							range_map2[p_index - cols - 1] = true;
						}

						range_map2[p_index - cols] = true;

						if (col < cols - 1) {
							range_map2[p_index - colsm1] = true;
						}

					}

					if (col > 0) {
						range_map2[p_index - 1] = true;
					}

					if (col < cols - 1) {
						range_map2[p_index + 1] = true;
					}

					if (row_nb1) {
						range_map2[p_index + cols] = true;
					}

					break;

				case Shogi_Piece.GIN:

					if (row_nt1) {

						var pp = p_index - cols;

						if (col > 0) {
							range_map2[pp - 1] = true;
						}

						range_map2[pp] = true;

						if (col < colsm1) {
							range_map2[pp + 1] = true;
						}

					}

					if (row_nb1) {

						var rc = (row + 1) * cols;

						if (col > 0) {
							range_map2[col - 1 + rc] = true;
						}

						if (col < cols - 1) {
							range_map2[col + 1 + rc] = true;
						}

					}

					break;

				case Shogi_Piece.KEI:

					var p_mr2 = p_index - cols * 2;

					if (col >= 1) {
						range_map2[p_mr2 - 1] = true;
					}

					if(col <= cols - 2) {
						range_map2[p_mr2 + 1] = true;
					}

					break;

				case Shogi_Piece.KYO:

					var to = p_index - cols;

					while (to >= 0) {

						range_map2[to] = true;

						if (board_cells[to] != 0) {
							break;
						}

						to -= cols;

					}

					break;

				case Shogi_Piece.SHA:
				case Shogi_Piece.SHA_P:

					if (row < rows - 1) {

						var to = p_index + cols;

						while (to < cells) {

							range_map2[to] = true;

							if (board_cells[to] != 0) {
								break;
							}

							to += cols;

						}

						if (piece == Shogi_Piece.SHA_P) {

							if (col < colsm1) {
								range_map2[col + 1 + (row + 1) * cols] = true;
							}

							if (col > 0) {
								range_map2[col - 1 + (row + 1) * cols] = true;
							}

						}

					}

					if (row > 0) {

						var to = p_index - cols;

						while (to >= 0) {

							range_map2[to] = true;

							if (board_cells[to] != 0) {
								break;
							}

							to -= cols;

						}

						if (piece == Shogi_Piece.SHA_P) {

							if (col < colsm1) {
								range_map2[col + 1 + (row - 1) * cols] = true;
							}

							if (col > 0) {
								range_map2[col - 1 + (row - 1) * cols] = true;
							}

						}

					}

					if (col < colsm1) {

						var to = p_index + 1;

						for (var c = col + 1;c < cols;c++) {

							range_map2[to] = true;

							if (board_cells[to] != 0) {
								break;
							}

							to++;

						}

					}

					if (col > 0) {

						var to = p_index - 1;

						for (var c = col - 1;c >= 0;c--) {

							range_map2[to] = true;

							if (board_cells[to] != 0) {
								break;
							}

							to--;

						}

					}

					break;

				case Shogi_Piece.KAKU:
				case Shogi_Piece.KAKU_P:

					if (row > 0) {

						var dcol = col - 1, drow = row - 1;
						var to = dcol + drow * cols;

						while (dcol >= 0 && drow >= 0) {

							range_map2[to] = true;

							if (board_cells[to] != 0) {
								break;
							}

							dcol--;
							drow--;

							to -= cols + 1;

						}

						var dcol = col + 1, drow = row - 1;
						var to = dcol + drow * cols;

						while (dcol < cols && drow >= 0) {

							range_map2[to] = true;

							if (board_cells[to] != 0) {
								break;
							}

							dcol++;
							drow--;

							to -= colsm1;

						}

						if (piece == Shogi_Piece.KAKU_P) {
							range_map2[col + (row - 1) * cols] = true;
						}

					}

					if (row <= rows - 2) {

						var dcol = col - 1, drow = row + 1;

						while (dcol >= 0 && drow < rows) {

							var to = dcol + drow * cols;

							range_map2[to] = true;

							if (board_cells[to] != 0) {
								break;
							}

							dcol--;
							drow++;

						}

						var dcol = col + 1, drow = row + 1;

						while (dcol < cols && drow < rows) {

							var to = dcol + drow * cols;

							range_map2[to] = true;

							if (board_cells[to] != 0) {
								break;
							}

							dcol++;
							drow++;

						}

						if (piece == Shogi_Piece.KAKU_P) {
							range_map2[col + (row + 1) * cols] = true;
						}

					}

					if (piece == Shogi_Piece.KAKU_P) {

						if (col > 0) {
							range_map2[p_index - 1] = true;
						}

						if (col < cols - 1) {
							range_map2[p_index + 1] = true;
						}

					}

					break;

				}

			}

			p_index++;

		}
	}

}

Shogi_BoardProcesser.prototype.getMovableHands = function(board, col, row) {

	var board_cells = board.data;
	var cols = this.cols;
	var rows = this.rows;
	var promote_rows = this.promote_rows;

	var hands = [];

	if (row == -1) {

		var piece = col;

		switch (piece) {

		case -Shogi_Piece.FU:

			for (var r = 0; r < rows - 1;r++) {

				var rc = r * cols;

				for (var c = 0; c < cols;c++) {
					if (board_cells[c + rc] == 0) {

						var fu = false;

						for (var r2 = 0; r2 < rows - 1;r2++) {
							if (board_cells[c + r2 * cols] == -Shogi_Piece.FU) {

								fu = true;

								break;

							}
						}

						if (!fu) {
							hands.push(Shogi_Hand.createHand(piece, col, row, c, r, false));
						}

					}
				}
			}

			break;

		case Shogi_Piece.FU:

			for (var r = 1; r < rows;r++) {

				var rc = r * cols;

				for (var c = 0; c < cols;c++) {
					if (board_cells[c + rc] == 0) {

						var fu = false;

						for (var r2 = 1; r2 < rows;r2++) {
							if (board_cells[c + r2 * cols] == Shogi_Piece.FU) {

								fu = true;

								break;

							}
						}

						if (!fu) {
							hands.push(Shogi_Hand.createHand(piece, col, row, c, r, false));
						}

					}
				}
			}

			break;

		case -Shogi_Piece.KEI:

			for (var r = 0; r < rows - 2;r++) {

				var rc = r * cols;

				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + rc] == 0) {
						hands.push(Shogi_Hand.createHand(piece, col, row, c, r, false));
					}
				}
			}

			break;

		case Shogi_Piece.KEI:

			for (var r = 2; r < rows;r++) {

				var rc = r * cols;

				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + rc] == 0) {
						hands.push(Shogi_Hand.createHand(piece, col, row, c, r, false));
					}
				}
			}

			break;

		case -Shogi_Piece.KYO:

			for (var r = 0; r < rows - 1;r++) {
				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + r * cols] == 0) {
						hands.push(Shogi_Hand.createHand(piece, col, row, c, r, false));
					}
				}
			}

			break;

		case Shogi_Piece.KYO:

			for (var r = 1; r < rows;r++) {
				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + r * cols] == 0) {
						hands.push(Shogi_Hand.createHand(piece, col, row, c, r, false));
					}
				}
			}

			break;

		default:

			for (var r = 0; r < rows;r++) {

				var rc = r * cols;

				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + rc] == 0) {
						hands.push(Shogi_Hand.createHand(piece, col, row, c, r, false));
					}
				}

			}

		}

	} else {

		var piece = board_cells[col + row * cols];

		switch (piece) {

		case -Shogi_Piece.OU:
		case Shogi_Piece.OU:

			for (var r = row - 1; r <= row + 1;r++) {
				if (r >= 0 && r < rows) {

					var rc = r * cols;

					for (var c = col - 1; c <= col + 1;c++) {
						if (c >= 0 && c < cols && piece * board_cells[c + rc] <= 0) {
							hands.push(Shogi_Hand.createHand(piece, col, row, c, r, false));
						}

					}
				}
			}

			break;

		case -Shogi_Piece.KIN:
		case -Shogi_Piece.GIN - Shogi_Piece.PROMOTED:
		case -Shogi_Piece.KEI - Shogi_Piece.PROMOTED:
		case -Shogi_Piece.KYO - Shogi_Piece.PROMOTED:
		case -Shogi_Piece.FU - Shogi_Piece.PROMOTED:
		case Shogi_Piece.KIN:
		case Shogi_Piece.GIN + Shogi_Piece.PROMOTED:
		case Shogi_Piece.KEI + Shogi_Piece.PROMOTED:
		case Shogi_Piece.KYO + Shogi_Piece.PROMOTED:
		case Shogi_Piece.FU + Shogi_Piece.PROMOTED:

			if (col >= 1 && piece * board_cells[(col - 1) + row * cols] <= 0) {
				hands.push(Shogi_Hand.createHand(piece, col, row, (col - 1), row, false));
			}

			if (col <= cols - 2 && piece * board_cells[(col + 1) + row * cols] <= 0) {
				hands.push(Shogi_Hand.createHand(piece, col, row, (col + 1), row, false));
			}

			if (row >= 1 && piece * board_cells[col + (row - 1) * cols] <= 0) {
				hands.push(Shogi_Hand.createHand(piece, col, row, col, (row - 1), false));
			}

			if (row <= rows - 2 && piece * board_cells[col + (row + 1) * cols] <= 0) {
				hands.push(Shogi_Hand.createHand(piece, col, row, col, (row + 1), false));
			}

			if (piece < 0 && row <= rows - 2) {

				if (col >= 1 && board_cells[(col - 1) + (row + 1) * cols] >= 0) {
					hands.push(Shogi_Hand.createHand(piece, col, row, (col - 1), (row + 1), false));
				}

				if (col <= cols - 2 && board_cells[(col + 1) + (row + 1) * cols] >= 0) {
					hands.push(Shogi_Hand.createHand(piece, col, row, (col + 1), (row + 1), false));
				}

			}

			if (piece > 0 && row >= 1) {

				if ((col >= 1) && board_cells[(col - 1) + (row - 1) * cols] <= 0) {
					hands.push(Shogi_Hand.createHand(piece, col, row, (col - 1), (row - 1), false));
				}

				if (col < cols - 1 && board_cells[(col + 1) + (row - 1) * cols] <= 0) {
					hands.push(Shogi_Hand.createHand(piece, col, row, (col + 1), (row - 1), false));
				}

			}

			break;

		case -Shogi_Piece.GIN:
		case Shogi_Piece.GIN:

			if (row >= 1) {

				if((col >= 1) && (piece * board_cells[(col - 1) + (row - 1) * cols] <= 0)) {
					hands.push(Shogi_Hand.createHand(piece, col, row, (col - 1), (row - 1), false));
				}

				if(piece == Shogi_Piece.GIN && (board_cells[col + (row - 1) * cols] <= 0)) {
					hands.push(Shogi_Hand.createHand(piece, col, row, col, (row - 1), false));
				}

				if(col <= cols - 2 && piece * board_cells[(col + 1) + (row - 1) * cols] <= 0) {
					hands.push(Shogi_Hand.createHand(piece, col, row, (col + 1), (row - 1), false));
				}

			}

			if (row <= rows - 2) {

				if(col >= 1 && piece * board_cells[(col - 1) + (row + 1) * cols] <= 0) {
					hands.push(Shogi_Hand.createHand(piece, col, row, (col - 1), (row + 1), false));
				}

				if(piece == -Shogi_Piece.GIN && board_cells[col + (row + 1) * cols] >= 0) {
					hands.push(Shogi_Hand.createHand(piece, col, row, col, (row + 1), false));
				}

				if(col <= cols - 2 && piece * board_cells[(col + 1) + (row + 1) * cols] <= 0) {
					hands.push(Shogi_Hand.createHand(piece, col, row, (col + 1), (row + 1), false));
				}

			}

			break;

		case -Shogi_Piece.KEI:

			if (row >= rows - 4) {

				if(col >= 1 && piece * board_cells[(col - 1) + (row + 2) * cols] <= 0) {
					hands.push(Shogi_Hand.createHand(piece, col, row, (col - 1), (row + 2), true));
				}

				if(col <= cols - 2 && piece * board_cells[(col + 1) + (row + 2) * cols] <= 0) {
					hands.push(Shogi_Hand.createHand(piece, col, row, (col + 1), (row + 2), true));
				}

			}

			if (row <= rows - 5) {

				if(col >= 1 && piece * board_cells[(col - 1) + (row + 2) * cols] <= 0) {
					hands.push(Shogi_Hand.createHand(piece, col, row, (col - 1), (row + 2), false));
				}

				if(col <= cols - 2 && piece * board_cells[(col + 1) + (row + 2) * cols] <= 0) {
					hands.push(Shogi_Hand.createHand(piece, col, row, (col + 1), (row + 2), false));
				}

			}

			break;

		case Shogi_Piece.KEI:

			if (row <= 3) {

				if(col >= 1 && board_cells[col - 1 + (row - 2) * cols] <= 0) {
					hands.push(Shogi_Hand.createHand(piece, col, row, (col - 1), row - 2, true));
				}

				if(col <= cols - 2 && board_cells[col + 1 + (row - 2) * cols] <= 0) {
					hands.push(Shogi_Hand.createHand(piece, col, row, (col + 1), row - 2, true));
				}

			}

			if (row >= 4) {

				if(col >= 1 && board_cells[(col - 1) + (row - 2) * cols] <= 0) {
					hands.push(Shogi_Hand.createHand(piece, col, row, (col - 1), (row - 2), false));
				}

				if(col <= cols - 2 && board_cells[(col + 1) + (row - 2) * cols] <= 0) {
					hands.push(Shogi_Hand.createHand(piece, col, row, (col + 1), (row - 2), false));
				}

			}

			break;

		case -Shogi_Piece.KYO:

			if ((row == rows - 2) && (board_cells[col + (row + 1) * cols] >= 0)) {
				hands.push(Shogi_Hand.createHand(piece, col, row, col, (row + 1), true));
			}

			if (row <= rows - 3) {

				for (var r = row + 1;r < rows;r++) {

					var rc = r * cols;

					if (board_cells[col + rc] > 0) {

						if (r == rows - 1) {
							hands.push(Shogi_Hand.createHand(piece, col, row, col, r, true));
						} else {
							hands.push(Shogi_Hand.createHand(piece, col, row, col, r, false));
						}

						break;

					}

					if (board_cells[col + rc] < 0) {
						break;
					}

					if (r == rows - 1) {
						hands.push(Shogi_Hand.createHand(piece, col, row, col, r, true));
					} else {
						hands.push(Shogi_Hand.createHand(piece, col, row, col, r, false));
					}

				}

			}

			break;

		case Shogi_Piece.KYO:

			if ((row == 1) && (board_cells[col] <= 0)) {
				hands.push(Shogi_Hand.createHand(piece, col, row, col, 0, true));
			}

			if (row >= 2) {

				for (var r = row - 1;r >= 0;r--) {

					if (board_cells[col + r * cols] < 0) {

						if (r == 0) {
							hands.push(Shogi_Hand.createHand(piece, col, row, col, r, true));
						} else {
							hands.push(Shogi_Hand.createHand(piece, col, row, col, r, false));
						}

						break;

					}

					if (board_cells[col + r * cols] > 0) {
						break;
					}

					if (r == 0) {
						hands.push(Shogi_Hand.createHand(piece, col, row, col, r, true));
					} else {
						hands.push(Shogi_Hand.createHand(piece, col, row, col, r, false));
					}

				}

			}

			break;

		case -Shogi_Piece.SHA:
		case -Shogi_Piece.SHA_P:
		case Shogi_Piece.SHA:
		case Shogi_Piece.SHA_P:

			if (piece == -Shogi_Piece.SHA_P || piece == Shogi_Piece.SHA_P) {

				if (col <= cols - 2) {

					if (row >= 1 && (piece * board_cells[col + 1 + (row - 1) * cols] <= 0)) {
						hands.push(Shogi_Hand.createHand(piece, col, row, (col + 1), (row - 1), false));
					}

					if (row <= rows - 2 && (piece * board_cells[col + 1 + (row + 1) * cols] <= 0)) {
						hands.push(Shogi_Hand.createHand(piece, col, row, (col + 1), (row + 1), false));
					}

				}

				if (col >= 1) {

					if (row >= 1 && (piece * board_cells[col - 1 + (row - 1) * cols] <= 0)) {
						hands.push(Shogi_Hand.createHand(piece, col, row, (col - 1), (row - 1), false));
					}

					if (row <= rows - 2 && (piece * board_cells[col - 1 + (row + 1) * cols] <= 0)) {
						hands.push(Shogi_Hand.createHand(piece, col, row, (col - 1), (row + 1), false));
					}

				}

			}

			var rowc = row * cols;

			if (col <= cols - 2) {

				for (var c = col + 1;c < cols;c++) {

					if (piece * board_cells[c + rowc] < 0) {

						hands.push(Shogi_Hand.createHand(piece, col, row, c, row, false));

						break;

					}

					if (piece * board_cells[c + rowc] > 0) {
						break;
					}

					hands.push(Shogi_Hand.createHand(piece, col, row, c, row, false));

				}

			}

			if (col >= 1) {

				for (var c = col - 1;c >= 0;c--) {

					if (piece * board_cells[c + rowc] < 0) {

						hands.push(Shogi_Hand.createHand(piece, col, row, c, row, false));

						break;

					}

					if (piece * board_cells[c + rowc] > 0) {
						break;
					}

					hands.push(Shogi_Hand.createHand(piece, col, row, c, row, false));

				}

			}

			if (row <= rows - 2) {

				for (var r = row + 1;r < rows;r++) {

					var rc = r * cols;

					if (piece * board_cells[col + rc] < 0) {

						hands.push(Shogi_Hand.createHand(piece, col, row, col, r, false));

						break;

					}

					if (piece * board_cells[col + rc] > 0) {
						break;
					}

					hands.push(Shogi_Hand.createHand(piece, col, row, col, r, false));

				}

			}

			if (row >= 1) {

				for (var r = row - 1;r >= 0;r--) {

					var rc = r * cols;

					if (piece * board_cells[col + rc] < 0) {

						hands.push(Shogi_Hand.createHand(piece, col, row, col, r, false));

						break;

					}

					if (piece * board_cells[col + rc] > 0) {
						break;
					}

					hands.push(Shogi_Hand.createHand(piece, col, row, col, r, false));

				}

			}

			break;

		case -Shogi_Piece.KAKU:
		case -Shogi_Piece.KAKU - Shogi_Piece.PROMOTED:
		case Shogi_Piece.KAKU:
		case Shogi_Piece.KAKU + Shogi_Piece.PROMOTED:

			if (piece == -Shogi_Piece.KAKU - Shogi_Piece.PROMOTED || piece == Shogi_Piece.KAKU + Shogi_Piece.PROMOTED) {

				if (col <= cols - 2 && (piece * board_cells[col + 1 + row * cols] <= 0)) {
					hands.push(Shogi_Hand.createHand(piece, col, row, (col + 1), row, false));
				}

				if (col >= 1 && (piece * board_cells[col - 1 + row * cols] <= 0)) {
					hands.push(Shogi_Hand.createHand(piece, col, row, (col - 1), row, false));
				}

				if (row <= rows - 2 && (piece * board_cells[col + (row + 1) * cols] <= 0)) {
					hands.push(Shogi_Hand.createHand(piece, col, row, col, (row + 1), false));
				}

				if (row >= 1 && (piece * board_cells[col + (row - 1) * cols] <= 0)) {
					hands.push(Shogi_Hand.createHand(piece, col, row, col, (row - 1), false));
				}

			}

			var dcol = col + 1;
			var drow = row + 1;

			while (dcol < cols && drow < rows) {

				var p = piece * board_cells[dcol + drow * cols];

				if (p < 0) {

					hands.push(Shogi_Hand.createHand(piece, col, row, dcol, drow, false));

					break;

				}

				if (p > 0) {
					break;
				}

				hands.push(Shogi_Hand.createHand(piece, col, row, dcol, drow, false));

				dcol++;
				drow++;

			}

			dcol = col - 1;
			drow = row + 1;

			while (dcol >= 0 && drow < rows) {

				var p = piece * board_cells[dcol + drow * cols];

				if (p < 0) {

					hands.push(Shogi_Hand.createHand(piece, col, row, dcol, drow, false));

					break;

				}

				if (p > 0) {
					break;
				}

				hands.push(Shogi_Hand.createHand(piece, col, row, dcol, drow, false));

				dcol--;
				drow++;

			}

			dcol = col + 1;
			drow = row - 1;

			while (dcol < cols && drow >= 0) {

				var p = piece * board_cells[dcol + drow * cols];

				if (p < 0) {

					hands.push(Shogi_Hand.createHand(piece, col, row, dcol, drow, false));

					break;

				}

				if (p > 0) {
					break;
				}

				hands.push(Shogi_Hand.createHand(piece, col, row, dcol, drow, false));

				dcol++;
				drow--;

			}

			dcol = col - 1;
			drow = row - 1;

			while (dcol >= 0 && drow >= 0) {

				var p = piece * board_cells[dcol + drow * cols];

				if (p < 0) {

					hands.push(Shogi_Hand.createHand(piece, col, row, dcol, drow, false));

					break;

				}

				if (p > 0) {
					break;
				}

				hands.push(Shogi_Hand.createHand(piece, col, row, dcol, drow, false));

				dcol--;
				drow--;

			}

			break;

		case Shogi_Piece.M_FU:

			if (row <= rows - 2 && board_cells[col + (row + 1) * cols] >= 0) {
				if (row == rows - 2) {
					hands.push(Shogi_Hand.createHand(piece, col, row, col, (row + 1), true));
				} else {
					hands.push(Shogi_Hand.createHand(piece, col, row, col, (row + 1), false));
				}
			}

			break;

		case Shogi_Piece.FU:

			if (row >= 1 && board_cells[col + (row - 1) * cols] <= 0) {
				if (row == 1) {
					hands.push(Shogi_Hand.createHand(piece, col, row, col, (row - 1), true));
				} else {
					hands.push(Shogi_Hand.createHand(piece, col, row, col, (row - 1), false));
				}
			}

			break;

		}

		var promote_hands = [];

		switch (piece) {

		case Shogi_Piece.GIN:
		case Shogi_Piece.KEI:
		case Shogi_Piece.KYO:
		case Shogi_Piece.SHA:
		case Shogi_Piece.KAKU:
		case Shogi_Piece.FU:

			for (var i = 0;i < hands.length;i++) {

				var hand = hands[i];

				if (((hand.to_row <= this.up_promote_row) || (hand.from_row <= this.up_promote_row)) && !hand.promote) {
					promote_hands.push(Shogi_Hand.createHand(piece, hand.from_col, hand.from_row, hand.to_col, hand.to_row, true));
				}

			}

			break;

		case Shogi_Piece.M_GIN:
		case Shogi_Piece.M_KEI:
		case Shogi_Piece.M_KYO:
		case Shogi_Piece.M_SHA:
		case Shogi_Piece.M_KAKU:
		case Shogi_Piece.M_FU:

			for (var i = 0;i < hands.length;i++) {

				var hand = hands[i];

				if (((hands[i].to_row >= this.down_promote_row) || (hands[i].from_row >= this.down_promote_row)) && !hand.promote) {
					promote_hands.push(Shogi_Hand.createHand(piece, hand.from_col, hand.from_row, hand.to_col, hand.to_row, true));
				}

			}

			break;

		}

		for (var i = 0;i < promote_hands.length;i++) {
			hands.push(promote_hands[i]);
		}

	}

	return hands;

}

Shogi_BoardProcesser.prototype.canTableMovableHand = function(board, turn, col, check_test, king_col, king_row) {

	var test_board = board.clone();

	var hand_num = 0;

	var cols = board.cols;
	var rows = board.rows;
	var board_cells = board.data;

	if (check_test) {

		var piece = col;

		switch (piece) {

		case -Shogi_Piece.FU:

			for (var r = 0; r < rows - 1;r++) {

				var rc = r * cols;

				for (var c = 0; c < cols;c++) {
					if (board_cells[c + rc] == 0) {

						var fu = false;

						for (var r2 = 0; r2 < rows - 1;r2++) {
							if (board_cells[c + r2 * cols] == -Shogi_Piece.FU) {

								fu = true;

								break;

							}
						}

						if (!fu) {

							test_board.data[c + rc] = piece;

							if (!this.isInRange(test_board, -turn, king_col, king_row)) {
								return true;
							}

							test_board.data[c + rc] = 0;

						}

					}
				}
			}

			break;

		case Shogi_Piece.FU:

			for (var r = 1; r < rows;r++) {
				for (var c = 0; c < cols;c++) {
					if (board_cells[c + r * cols] == 0) {

						var fu = false;

						for (var r2 = 1; r2 < rows;r2++) {
							if (board_cells[c + r2 * cols] == Shogi_Piece.FU) {

								fu = true;

								break;

							}
						}

						if (!fu) {

							test_board.data[c + r * cols] = piece;

							if (!this.isInRange(test_board, -turn, king_col, king_row)) {
								return true;
							}

							test_board.data[c + r * cols] = 0;

						}

					}
				}
			}

			break;

		case -Shogi_Piece.KEI:

			for (var r = 0; r < rows - 2;r++) {
				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + r * cols] == 0) {

						test_board.data[c + r * cols] = piece;

						if (!this.isInRange(test_board, -turn, king_col, king_row)) {
							return true;
						}

						test_board.data[c + r * cols] = 0;

					}
				}
			}

			break;

		case Shogi_Piece.KEI:

			for (var r = 2; r < rows;r++) {
				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + r * cols] == 0) {

						test_board.data[c + r * cols] = piece;

						if (!this.isInRange(test_board, -turn, king_col, king_row)) {
							return true;
						}

						test_board.data[c + r * cols] = 0;

					}
				}
			}

			break;

		case -Shogi_Piece.KYO:

			for (var r = 0; r < rows - 1;r++) {
				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + r * cols] == 0) {

						test_board.data[c + r * cols] = piece;

						if (!this.isInRange(test_board, -turn, king_col, king_row)) {
							return true;
						}

						test_board.data[c + r * cols] = 0;

					}
				}
			}

			break;

		case Shogi_Piece.KYO:

			for (var r = 1; r < rows;r++) {
				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + r * cols] == 0) {

						test_board.data[c + r * cols] = piece;

						if (!this.isInRange(test_board, -turn, king_col, king_row)) {
							return true;
						}

						test_board.data[c + r * cols] = 0;

					}
				}
			}

			break;

		default:

			for (var r = 0; r < rows;r++) {

				var rc = r * cols;

				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + rc] == 0) {

						test_board.data[c + rc] = piece;

						if (!this.isInRange(test_board, -turn, king_col, king_row)) {
							return true;
						}

						test_board.data[c + rc] = 0;

					}
				}

			}

		}

	} else {

		piece = col;

		switch (piece) {

		case -Shogi_Piece.FU:

			for (var r = 0; r < rows - 1;r++) {
				for (var c = 0; c < cols;c++) {
					if (board_cells[c + r * cols] == 0) {

						var fu = false;

						for (var r2 = 0; r2 < rows - 1;r2++) {
							if (board_cells[c + r2 * cols] == -Shogi_Piece.FU) {

								fu = true;

								break;

							}
						}

						if (!fu) {
							return true;
						}

					}
				}
			}

			break;

		case Shogi_Piece.FU:

			for (var r = 1; r < rows;r++) {
				for (var c = 0; c < cols;c++) {
					if (board_cells[c + r * cols] == 0) {

						var fu = false;

						for (var r2 = 1; r2 < rows;r2++) {
							if (board_cells[c + r2 * cols] == Shogi_Piece.FU) {

								fu = true;

								break;

							}
						}

						if (!fu) {
							return true;
						}

					}
				}
			}

			break;

		case -Shogi_Piece.KEI:

			for (var r = 0; r < rows - 2;r++) {
				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + r * cols] == 0) {
						return true;
					}
				}
			}

			break;

		case Shogi_Piece.KEI:

			for (var r = 2; r < rows;r++) {
				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + r * cols] == 0) {
						return true;
					}
				}
			}

			break;

		case -Shogi_Piece.KYO:

			for (var r = 0; r < rows - 1;r++) {
				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + r * cols] == 0) {
						return true;
					}
				}
			}

			break;

		case Shogi_Piece.KYO:

			for (var r = 1; r < rows;r++) {
				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + r * cols] == 0) {
						return true;
					}
				}
			}

			break;

		default:

			for (var r = 0; r < rows;r++) {

				var rc = r * cols;

				for (var c = 0; c < cols;c++) {
					if (piece * board_cells[c + rc] == 0) {
						return true;
					}
console.log("test:"+piece+":"+(c+rc));
				}

			}

console.log("test:"+piece+":"+false);

		}

	}

	return false;

}

Shogi_BoardProcesser.prototype.canMoveHandWithKingPos = function(board, turn, col, row, king_col, king_row) {

	var test_board = board.clone();

	var hand_num = 0;

	var cols = test_board.cols;
	var rows = test_board.rows;
	var board_cells = test_board.data;

	var from = col + row * cols;

	var piece = board_cells[col + row * cols];

	switch (piece) {

	case -Shogi_Piece.OU:
	case Shogi_Piece.OU:

		var scol = col - 1, ecol = col + 1;
		var srow = row - 1, erow = row + 1;

		if (scol < 0) {
			scol = 0;
		}

		if (ecol > cols - 1) {
			ecol = cols - 1;
		}

		if (srow < 0) {
			srow = 0;
		}

		if (erow > rows - 1) {
			erow = rows - 1;
		}

		for (var r = srow; r <= erow;r++) {

			var rc = r * cols;

			for (var c = scol; c <= ecol;c++) {

				var to = c + rc;

				if (piece * board_cells[to] <= 0) {

					var tmp = test_board.data[to];

					test_board.data[from] = 0;
					test_board.data[to] = piece;

					if (!this.isInRange(test_board, -turn, c, r)) {
						return true;
					}

					test_board.data[from] = piece;
					test_board.data[to] = tmp;

				}

			}
		}

		break;

	case -Shogi_Piece.KIN:
	case -Shogi_Piece.GIN - Shogi_Piece.PROMOTED:
	case -Shogi_Piece.KEI - Shogi_Piece.PROMOTED:
	case -Shogi_Piece.KYO - Shogi_Piece.PROMOTED:
	case -Shogi_Piece.FU - Shogi_Piece.PROMOTED:
	case Shogi_Piece.KIN:
	case Shogi_Piece.GIN + Shogi_Piece.PROMOTED:
	case Shogi_Piece.KEI + Shogi_Piece.PROMOTED:
	case Shogi_Piece.KYO + Shogi_Piece.PROMOTED:
	case Shogi_Piece.FU + Shogi_Piece.PROMOTED:

		var to = (col - 1) + row * cols;

		if (col >= 1 && piece * board_cells[to] <= 0) {

			var tmp = test_board.data[to];

			test_board.data[from] = 0;
			test_board.data[to] = piece;

			if (!this.isInRange(test_board, -turn, king_col, king_row)) {
				return true;
			}

			test_board.data[from] = piece;
			test_board.data[to] = tmp;

		}

		var to = (col + 1) + row * cols;

		if (col <= cols - 2 && piece * board_cells[to] <= 0) {

			var tmp = test_board.data[to];

			test_board.data[from] = 0;
			test_board.data[to] = piece;

			if (!this.isInRange(test_board, -turn, king_col, king_row)) {
				return true;
			}

			test_board.data[from] = piece;
			test_board.data[to] = tmp;

		}

		var to = col + (row - 1) * cols;

		if (row >= 1 && piece * board_cells[to] <= 0) {

			var tmp = test_board.data[to];

			test_board.data[from] = 0;
			test_board.data[to] = piece;

			if (!this.isInRange(test_board, -turn, king_col, king_row)) {
				return true;
			}

			test_board.data[from] = piece;
			test_board.data[to] = tmp;

		}

		var to = col + (row + 1) * cols;

		if (row <= rows - 2 && piece * board_cells[to] <= 0) {

			var tmp = test_board.data[to];

			test_board.data[from] = 0;
			test_board.data[to] = piece;

			if (!this.isInRange(test_board, -turn, king_col, king_row)) {
				return true;
			}

			test_board.data[from] = piece;
			test_board.data[to] = to;

		}

		if (piece < 0 && row <= rows - 2) {

			var to = (col - 1) + (row + 1) * cols;

			if (col >= 1 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

			var to = (col + 1) + (row + 1) * cols;

			if (col <= cols - 2 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = to;

			}

		}

		if (piece > 0 && row >= 1) {

			var to = (col - 1) + (row - 1) * cols;

			if (col >= 1 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

			var to = (col + 1) + (row - 1) * cols;

			if (col <= cols - 2 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

		}

		break;

	case -Shogi_Piece.GIN:
	case Shogi_Piece.GIN:

		if (row >= 1) {

			var rm1c = (row - 1) * cols;
			var to = (col - 1) + rm1c;

			if(col >= 1 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

			var to = col + rm1c;

			if(piece == Shogi_Piece.GIN && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

			var to = (col + 1) + rm1c;

			if(col <= cols - 2 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

		}

		if (row <= rows - 2) {

			var to = (col - 1) + (row + 1) * cols;

			if(col >= 1 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

			var to = col + (row + 1) * cols;

			if(piece == -Shogi_Piece.GIN && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

			var to = (col + 1) + (row + 1) * cols;

			if(col <= cols - 2 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

		}

		break;

	case -Shogi_Piece.KEI:

		if (row == rows - 3) {

			var to = (col - 1) + (row + 2) * cols;

			if(col >= 1 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

			var to = (col + 1) + (row + 2) * cols;

			if(col <= cols - 2 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

		}

		if (row <= rows - 4) {

			var to = (col - 1) + (row + 2) * cols;

			if(col >= 1 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

			var to = (col + 1) + (row + 2) * cols;

			if(col <= cols - 2 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

		}

		break;

	case Shogi_Piece.KEI:

		if (row == 2) {

			var to = col - 1;

			if(col >= 1 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

			var to = col + 1;

			if(col <= cols - 2 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

		}

		if (row >= 3) {

			var to = (col - 1) + (row - 2) * cols;

			if(col >= 1 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

			var to = (col + 1) + (row - 2) * cols;

			if(col <= cols - 2 && piece * board_cells[to] <= 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

		}

		break;

	case -Shogi_Piece.KYO:

		var to = col + (row + 1) * cols;

		if ((row == rows - 2) && (board_cells[to] >= 0)) {

			var tmp = test_board.data[to];

			test_board.data[from] = 0;
			test_board.data[to] = piece;

			if (!this.isInRange(test_board, -turn, king_col, king_row)) {
				return true;
			}

			test_board.data[from] = piece;
			test_board.data[to] = tmp;

		}

		if (row <= rows - 3) {

			for (var r = row + 1;r < rows;r++) {

				var rc = r * cols;

				var to = col + rc;

				if (board_cells[to] > 0) {

					var tmp = test_board.data[to];

					test_board.data[from] = 0;
					test_board.data[to] = piece;

					if (!this.isInRange(test_board, -turn, king_col, king_row)) {
						return true;
					}

					test_board.data[from] = piece;
					test_board.data[to] = tmp;

					break;

				}

				if (board_cells[to] < 0) {
					break;
				}

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

		}

		break;

	case Shogi_Piece.KYO:

		if ((row == 1) && (board_cells[col] <= 0)) {

			var tmp = test_board.data[col];

			test_board.data[from] = 0;
			test_board.data[col] = piece;

			if (!this.isInRange(test_board, -turn, king_col, king_row)) {
				return true;
			}

			test_board.data[from] = piece;
			test_board.data[col] = tmp;

		}

		if (row >= 2) {

			for (var r = row - 1;r >= 0;r--) {

				var to = col + r * cols;

				if (piece * board_cells[to] < 0) {

					var tmp = test_board.data[to];

					test_board.data[from] = 0;
					test_board.data[to] = piece;

					if (!this.isInRange(test_board, -turn, king_col, king_row)) {
						return true;
					}

					test_board.data[from] = piece;
					test_board.data[to] = tmp;

					break;

				}

				if (piece * board_cells[to] > 0) {
					break;
				}

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

		}

		break;

	case -Shogi_Piece.SHA:
	case -Shogi_Piece.SHA_P:
	case Shogi_Piece.SHA:
	case Shogi_Piece.SHA_P:

		if (piece == (-Shogi_Piece.SHA_P) || piece == (Shogi_Piece.SHA_P)) {

			if (col <= cols - 2) {

				var to = col + 1 + (row - 1) * cols;

				if (row >= 1 && (piece * board_cells[to] <= 0)) {

					var tmp = test_board.data[to];

					test_board.data[from] = 0;
					test_board.data[to] = piece;

					if (!this.isInRange(test_board, -turn, king_col, king_row)) {
						return true;
					}

					test_board.data[from] = piece;
					test_board.data[to] = to;

				}

				var to = col + 1 + (row + 1) * cols;

				if (row <= rows - 2 && (piece * board_cells[to] <= 0)) {

					var tmp = test_board.data[to];

					test_board.data[from] = 0;
					test_board.data[to] = piece;

					if (!this.isInRange(test_board, -turn, king_col, king_row)) {
						return true;
					}

					test_board.data[from] = piece;
					test_board.data[to] = tmp;

				}

			}

			if (col >= 1) {

				var to = col - 1 + (row - 1) * cols;

				if (row >= 1 && (piece * board_cells[to] <= 0)) {

					var tmp = test_board.data[to];

					test_board.data[from] = 0;
					test_board.data[to] = piece;

					if (!this.isInRange(test_board, -turn, king_col, king_row)) {
						return true;
					}

					test_board.data[from] = piece;
					test_board.data[to] = tmp;

				}

				var to = col - 1 + (row + 1) * cols;

				if (row <= rows - 2 && (piece * board_cells[to] <= 0)) {

					var tmp = test_board.data[to];

					test_board.data[from] = 0;
					test_board.data[to] = piece;

					if (!this.isInRange(test_board, -turn, king_col, king_row)) {
						return true;
					}

					test_board.data[from] = piece;
					test_board.data[to] = tmp;

				}

			}

		}

		if (col <= cols - 2) {

			var rc = row * cols;

			for (var c = col + 1;c < cols;c++) {

				var to = c + rc;

				if (piece * board_cells[to] < 0) {

					var tmp = test_board.data[to];

					test_board.data[from] = 0;
					test_board.data[to] = piece;

					if (!this.isInRange(test_board, -turn, king_col, king_row)) {
						return true;
					}

					test_board.data[from] = piece;
					test_board.data[to] = tmp;

					break;

				}

				if (piece * board_cells[to] > 0) {
					break;
				}

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

		}

		if (col >= 1) {

			var rc = row * cols;

			for (var c = col - 1;c >= 0;c--) {

				var to = c + rc;

				if (piece * board_cells[to] < 0) {

					var tmp = test_board.data[to];

					test_board.data[from] = 0;
					test_board.data[to] = piece;

					if (!this.isInRange(test_board, -turn, king_col, king_row)) {
						return true;
					}

					test_board.data[from] = piece;
					test_board.data[to] = tmp;

					break;

				}

				if (piece * board_cells[to] > 0) {
					break;
				}

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

		}

		if (row <= rows - 2) {

			for (var r = row + 1;r < rows;r++) {

				var to = col + r * cols;

				if (piece * board_cells[to] < 0) {

					var tmp = test_board.data[to];

					test_board.data[from] = 0;
					test_board.data[to] = piece;

					if (!this.isInRange(test_board, -turn, king_col, king_row)) {
						return true;
					}

					break;

					test_board.data[from] = piece;
					test_board.data[to] = tmp;

				}

				if (piece * board_cells[to] > 0) {
					break;
				}

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

		}

		if (row >= 1) {

			for (var r = row - 1;r >= 0;r--) {

				var to = col + r * cols;

				if (piece * board_cells[to] < 0) {

					var tmp = test_board.data[to];

					test_board.data[from] = 0;
					test_board.data[to] = piece;

					if (!this.isInRange(test_board, -turn, king_col, king_row)) {
						return true;
					}

					test_board.data[from] = piece;
					test_board.data[to] = tmp;

					break;

				}

				if (piece * board_cells[to] > 0) {
					break;
				}

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

		}

		break;

	case -Shogi_Piece.KAKU:
	case -Shogi_Piece.KAKU_P:
	case Shogi_Piece.KAKU:
	case Shogi_Piece.KAKU_P:

		if (piece == -Shogi_Piece.KAKU_P || piece == Shogi_Piece.KAKU_P) {

			var to = col + 1 + row * cols;

			if (col <= cols - 2 && (piece * board_cells[to] <= 0)) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

			}

			if (col >= 1 && (piece * board_cells[col - 1 + row * cols] <= 0)) {

				var tmp = test_board.data[col - 1 + row * cols];

				test_board.data[from] = 0;
				test_board.data[col - 1 + row * cols] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[col - 1 + row * cols] = tmp;

			}

			if (row <= rows - 2 && (piece * board_cells[col + (row + 1) * cols] <= 0)) {

				var tmp = test_board.data[col + (row + 1) * cols];

				test_board.data[from] = 0;
				test_board.data[col + (row + 1) * cols] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[col + (row + 1) * cols] = tmp;

			}

			if (row >= 1 && (piece * board_cells[col + (row - 1) * cols] <= 0)) {

				var tmp = test_board.data[col + (row - 1) * cols];

				test_board.data[from] = 0;
				test_board.data[col + (row - 1) * cols] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[col + (row - 1) * cols] = tmp;

			}

		}

		var d = 1;

		var dcol = col + d;
		var drow = row + d;

		while (dcol < cols && drow < rows) {

			var to = dcol + drow * cols;

			var p = piece * board_cells[to];

			if (p < 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

				break;

			}

			if (p > 0) {
				break;
			}

			var tmp = test_board.data[to];

			test_board.data[from] = 0;
			test_board.data[to] = piece;

			if (!this.isInRange(test_board, -turn, king_col, king_row)) {
				return true;
			}

			test_board.data[from] = piece;
			test_board.data[to] = tmp;

			dcol++;
			drow++;

		}

		d = 1;

		dcol = col - d;
		drow = row + d;

		while (dcol >= 0 && drow < rows) {

			var to = dcol + drow * cols;
			var p = piece * board_cells[to];

			if (p < 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

				break;

			}

			if (p > 0) {
				break;
			}

			var tmp = test_board.data[to];

			test_board.data[from] = 0;
			test_board.data[to] = piece;

			if (!this.isInRange(test_board, -turn, king_col, king_row)) {
				return true;
			}

			test_board.data[from] = piece;
			test_board.data[to] = tmp;

			dcol--;
			drow++;

		}

		d = 1;

		dcol = col + d;
		drow = row - d;

		while (dcol < cols && drow >= 0) {

			var to = dcol + drow * cols;
			var p = piece * board_cells[to];

			if (p < 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;

				break;

			}

			if (p > 0) {
				break;
			}

			var tmp = test_board.data[to];

			test_board.data[from] = 0;
			test_board.data[to] = piece;

			if (!this.isInRange(test_board, -turn, king_col, king_row)) {
				return true;
			}

			test_board.data[from] = piece;
			test_board.data[to] = tmp;

			dcol++;
			drow--;

		}

		d = 1;

		dcol = col - d;
		drow = row - d;

		while (dcol >= 0 && drow >= 0) {

			var to = dcol + drow * cols;
			var p = piece * board_cells[to];

			if (p < 0) {

				var tmp = test_board.data[to];

				test_board.data[from] = 0;
				test_board.data[to] = piece;

				if (!this.isInRange(test_board, -turn, king_col, king_row)) {
					return true;
				}

				test_board.data[from] = piece;
				test_board.data[to] = tmp;


				break;

			}

			if (p > 0) {
				break;
			}

			var tmp = test_board.data[to];

			test_board.data[from] = 0;
			test_board.data[to] = piece;

			if (!this.isInRange(test_board, -turn, king_col, king_row)) {
				return true;
			}

			test_board.data[from] = piece;
			test_board.data[to] = tmp;

			dcol--;
			drow--;

		}

		break;

	case -Shogi_Piece.FU:

		var to = col + (row + 1) * cols;

		if (row <= rows - 2 && board_cells[to] >= 0) {

			var tmp = test_board.data[to];

			test_board.data[from] = 0;
			test_board.data[to] = piece;

			if (!this.isInRange(test_board, -turn, king_col, king_row)) {
				return true;
			}

			test_board.data[from] = piece;
			test_board.data[to] = tmp;

		}

		break;

	case Shogi_Piece.FU:

		var to = col + (row - 1) * cols;

		if (row >= 1 && board_cells[to] <= 0) {

			var tmp = test_board.data[to];

			test_board.data[from] = 0;
			test_board.data[to] = piece;

			if (!this.isInRange(test_board, -turn, king_col, king_row)) {
				return true;
			}

			test_board.data[from] = piece;
			test_board.data[to] = tmp;

		}

		break;

	}

	return false;

}

Shogi_BoardProcesser.prototype.isLose = function(board, turn) {

	var king_col = -1;
	var king_row = -1;

	var cols = board.cols;
	var rows = board.rows;

	var board_data = board.data;

	for (var row = 0;row < rows;row++) {
		for (var col = 0;col < cols;col++) {
			if (board_data[col + row * cols] * turn == Shogi_Piece.OU) {

				king_col = col;
				king_row = row;

				break;

			}
		}
	}

	return this.isLoseWithKingPos(board, turn, king_col, king_row);

}

Shogi_BoardProcesser.prototype.isLoseWithKingPos = function(board, turn, king_col, king_row) {

	var cols = board.cols;
	var rows = board.rows;

	var board_data = board.data;

	var scol = king_col - 1, ecol = king_col + 1;
	var srow = king_row - 1, erow = king_row + 1;

	if (scol < 0) {
		scol = 0;
	}

	if (ecol > cols - 1) {
		ecol = cols - 1;
	}

	if (srow < 0) {
		srow = 0;
	}

	if (erow > rows - 1) {
		erow = rows - 1;
	}

	var test_board = board.clone();
	test_board.data[king_col + king_row * cols] = 0;

	for (var r = srow; r <= erow;r++) {

		var rc = r * cols;

		for (var c = scol; c <= ecol;c++) {

			if (!(c == king_col && r == king_row) && (turn * test_board.data[c + rc] <= 0) && !this.isInRange(test_board, -turn, c, r)) {
				return false;
			}

		}

	}

	for (var row = 0;row < rows;row++) {

		var rc = row * cols;

		for (var col = 0;col < cols;col++) {
			if (turn * board_data[col + rc] > 0) {

				var test = this.canMoveHandWithKingPos(board, turn, col, row, king_col, king_row);

				if (test) {
					return false;
				}

			}
		}
	}

	var check_test = this.isInRange(board, -turn, king_col, king_row);

	var hand_num = 0;

	if (turn < 0) {

		for (var i = 2;i <= 8;i++) {
			if (board.up_piece_table[i] > 0) {
				if (this.canTableMovableHand(board, turn, -i, check_test, king_col, king_row)) {
					return false;
				}
			}
		}

	}

	if (turn > 0) {

		for (var i = 2;i <= 8;i++) {
			if (board.down_piece_table[i] > 0) {
				if (this.canTableMovableHand(board, turn, i, check_test, king_col, king_row)) {
					return false;
				}
			}
		}

	}

	return true;

}
