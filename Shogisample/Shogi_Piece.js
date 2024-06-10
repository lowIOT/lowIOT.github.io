function Shogi_Piece() {
    this.images = new Array(9);
}

Shogi_Piece.prototype.createPieceImages = function(cell_width, cell_height) {
    for (var i = Shogi_Piece.MIN; i <= Shogi_Piece.MAX; i++) {
        var piece_width = 0, piece_height = 0;
        switch (Math.abs(i)) {
            case Shogi_Piece.OU:
                piece_width = Math.floor(cell_width * 0.94);
                piece_height = Math.floor(cell_height * 0.94);
                break;
            case Shogi_Piece.KIN:
            case Shogi_Piece.SHA:
            case Shogi_Piece.KAKU:
            case Shogi_Piece.SHA_P:
            case Shogi_Piece.KAKU_P:
                piece_width = Math.floor(cell_width * 0.90);
                piece_height = Math.floor(cell_height * 0.90);
                break;
            case Shogi_Piece.GIN:
            case Shogi_Piece.KEI:
            case Shogi_Piece.KYO:
            case Shogi_Piece.GIN_P:
            case Shogi_Piece.KEI_P:
            case Shogi_Piece.KYO_P:
                piece_width = Math.floor(cell_width * 0.86);
                piece_height = Math.floor(cell_height * 0.86);
                break;
            case Shogi_Piece.FU:
            case Shogi_Piece.FU_P:
                piece_width = Math.floor(cell_width * 0.82);
                piece_height = Math.floor(cell_height * 0.82);
                break;
        }
        if (piece_width > 0) {
            this.images[i] = this.createPieceImage(i, cell_width, cell_height, piece_width, piece_height);
        }
    }
}

Shogi_Piece.prototype.createPieceImage = function(piece, img_width, img_height, width, height) {
    var cv = document.createElement("canvas");
    var upset = piece < 0;
    if (upset) {
        piece *= -1;
    }
    cv.width = width;
    cv.height = height;
    var context = cv.getContext("2d");
    context.fillStyle = "#e8e4a0";
    context.strokeStyle = "#101018";
    context.lineWidth = 2.0;
    context.beginPath();
    context.moveTo(Math.floor(width / 2), 1);
    context.lineTo(Math.floor(width * 0.12), Math.floor(height * 0.2));
    context.lineTo(1, height - 2);
    context.lineTo(width - 2, height - 2);
    context.lineTo(Math.floor(width * 0.88), Math.floor(height * 0.2));
    context.lineTo(Math.floor(width / 2), 1);
    context.closePath();
    context.fill();
    context.stroke();
    var chars = [];
    var color_1 = '#080810';
    var color_2 = '#cc0810';
    switch (piece) {
        case Shogi_Piece.OU:
            chars.push(this.createCharCanvas("王", Math.floor(width * 0.44), Math.floor(width * 0.30), color_1));
            chars.push(this.createCharCanvas("将", Math.floor(width * 0.46), Math.floor(width * 0.35), color_1));
            break;
        case Shogi_Piece.KIN:
            chars.push(this.createCharCanvas("金", Math.floor(width * 0.44), Math.floor(width * 0.33), color_1));
            chars.push(this.createCharCanvas("将", Math.floor(width * 0.46), Math.floor(width * 0.36), color_1));
            break;
        case Shogi_Piece.GIN:
            chars.push(this.createCharCanvas("銀", Math.floor(width * 0.44), Math.floor(width * 0.33), color_1));
            chars.push(this.createCharCanvas("将", Math.floor(width * 0.44), Math.floor(width * 0.36), color_1));
            break;
        case Shogi_Piece.KEI:
            chars.push(this.createCharCanvas("桂", Math.floor(width * 0.44), Math.floor(width * 0.36), color_1));
            chars.push(this.createCharCanvas("馬", Math.floor(width * 0.44), Math.floor(width * 0.36), color_1));
            break;
        case Shogi_Piece.KYO:
            chars.push(this.createCharCanvas("香", Math.floor(width * 0.44), Math.floor(width * 0.36), color_1));
            chars.push(this.createCharCanvas("車", Math.floor(width * 0.44), Math.floor(width * 0.36), color_1));
            break;
        case Shogi_Piece.SHA:
            chars.push(this.createCharCanvas("飛", Math.floor(width * 0.44), Math.floor(width * 0.36), color_1));
            chars.push(this.createCharCanvas("車", Math.floor(width * 0.44), Math.floor(width * 0.36), color_1));
            break;
        case Shogi_Piece.KAKU:
            chars.push(this.createCharCanvas("角", Math.floor(width * 0.44), Math.floor(width * 0.36), color_1));
            chars.push(this.createCharCanvas("行", Math.floor(width * 0.44), Math.floor(width * 0.36), color_1));
            break;
        case Shogi_Piece.FU:
            chars.push(this.createCharCanvas("歩", Math.floor(width * 0.44), Math.floor(width * 0.36), color_1));
            chars.push(this.createCharCanvas("兵", Math.floor(width * 0.44), Math.floor(width * 0.36), color_1));
            break;
        case Shogi_Piece.GIN_P:
            chars.push(this.createCharCanvas("成", Math.floor(width * 0.44), Math.floor(width * 0.33), color_2));
            chars.push(this.createCharCanvas("銀", Math.floor(width * 0.44), Math.floor(width * 0.36), color_2));
            break;
        case Shogi_Piece.KEI_P:
            chars.push(this.createCharCanvas("成", Math.floor(width * 0.44), Math.floor(width * 0.36), color_2));
            chars.push(this.createCharCanvas("桂", Math.floor(width * 0.44), Math.floor(width * 0.36), color_2));
            break;
        case Shogi_Piece.KYO_P:
            chars.push(this.createCharCanvas("成", Math.floor(width * 0.44), Math.floor(width * 0.36), color_2));
            chars.push(this.createCharCanvas("香", Math.floor(width * 0.44), Math.floor(width * 0.36), color_2));
            break;
        case Shogi_Piece.SHA_P:
            chars.push(this.createCharCanvas("龍", Math.floor(width * 0.44), Math.floor(width * 0.36), color_2));
            chars.push(this.createCharCanvas("王", Math.floor(width * 0.44), Math.floor(width * 0.36), color_2));
            break;
        case Shogi_Piece.KAKU_P:
            chars.push(this.createCharCanvas("龍", Math.floor(width * 0.44), Math.floor(width * 0.36), color_2));
            chars.push(this.createCharCanvas("馬", Math.floor(width * 0.44), Math.floor(width * 0.36), color_2));
            break;
        case Shogi_Piece.FU_P:
            chars.push(this.createCharCanvas("と", Math.floor(width * 0.44), Math.floor(width * 0.36), color_2));
            break;
    }
    var vgap = Math.floor(chars[0].height * 0.15);
    var chars_height = chars[0].height;
    if (chars.length > 1) {
        chars_height += vgap;
        chars_height += chars[1].height;
    }
    var chars_top = Math.floor(height * 0.05 + (height - chars_height) / 2);
    var chars_y = chars_top;
    for (var i = 0; i < 2; i++) {
        if (i < chars.length) {
            var left = Math.floor((width - chars[i].width) / 2);
            context.drawImage(chars[i], left, chars_y);
            chars_y += chars[i].height + vgap;
        }
    }
    var result_cv = document.createElement("canvas");
    result_cv.width = img_width;
    result_cv.height = img_height;
    var result_context = result_cv.getContext("2d");
    if (upset) {
        result_context.translate(img_width / 1, img_height / 1);
        result_context.rotate(Math.PI);
    }
    result_context.drawImage(cv, Math.floor((img_width - width) / 2), Math.floor((img_height - height) / 2));
    return result_cv;
}

Shogi_Piece.prototype.createCharCanvas = function(c, width, height, color) {
    var cv = document.createElement("canvas");
    cv.width = width * 3;
    cv.height = width * 2;
    var context = cv.getContext("2d");
    context.font = "bold " + (width * 2) + "px 'ＭＳ Ｐゴシック'";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = color;
    context.fillText(c, cv.width / 2, cv.height / 2);
    var drawn_data = context.getImageData(0, 0, cv.width, cv.height);
    var min_x = cv.width;
    var min_y = cv.height;
    var max_x = 0;
    var max_y = 0;
    for (var y = 0; y < cv.height; y++) {
        var p_index = y * cv.width * 4;
        for (var x = 0; x < cv.width; x++) {
            var a = drawn_data.data[p_index + 3];
            if (a > 1) {
                if (x < min_x) {
                    min_x = x;
                }
                if (y < min_y) {
                    min_y = y;
                }
                if (x > max_x) {
                    max_x = x;
                }
                if (y > max_y) {
                    max_y = y;
                }
            }
            p_index += 4;
        }
    }
    var drawn_width = max_x - min_x + 1;
    var drawn_height = max_y - min_y + 1;
    var drawn_cv = document.createElement('canvas');
    drawn_cv.width = drawn_width;
    drawn_cv.height = drawn_height;
    var drawn_context = drawn_cv.getContext("2d");
    drawn_context.putImageData(drawn_data, -min_x, -min_y);
    var result_cv = document.createElement("canvas");
    result_cv.width = width;
    result_cv.height = height;
    var result_context = result_cv.getContext("2d");
    result_context.drawImage(drawn_cv, 0, 0, drawn_width, drawn_height, 0, 0, width, height);
    return result_cv;
}

Shogi_Piece.NONE = 0;
Shogi_Piece.OU = 1;
Shogi_Piece.KIN = 2;
Shogi_Piece.GIN = 3;
Shogi_Piece.KEI = 4;
Shogi_Piece.KYO = 5;
Shogi_Piece.FU = 6;
Shogi_Piece.KAKU = 7;
Shogi_Piece.SHA = 8;
Shogi_Piece.PROMOTED = 16;
Shogi_Piece.GIN_P = Shogi_Piece.GIN + Shogi_Piece.PROMOTED;
Shogi_Piece.KEI_P = Shogi_Piece.KEI + Shogi_Piece.PROMOTED;
Shogi_Piece.KYO_P = Shogi_Piece.KYO + Shogi_Piece.PROMOTED;
Shogi_Piece.SHA_P = Shogi_Piece.SHA + Shogi_Piece.PROMOTED;
Shogi_Piece.KAKU_P = Shogi_Piece.KAKU + Shogi_Piece.PROMOTED;
Shogi_Piece.FU_P = Shogi_Piece.FU + Shogi_Piece.PROMOTED;
Shogi_Piece.M_OU = -1;
Shogi_Piece.M_KIN = -2;
Shogi_Piece.M_GIN = -3;
Shogi_Piece.M_KEI = -4;
Shogi_Piece.M_KYO = -5;
Shogi_Piece.M_FU = -6;
Shogi_Piece.M_KAKU = -7;
Shogi_Piece.M_SHA = -8;
Shogi_Piece.M_GIN_P = -Shogi_Piece.GIN_P;
Shogi_Piece.M_KEI_P = -Shogi_Piece.KEI_P;
Shogi_Piece.M_KYO_P = -Shogi_Piece.KYO_P;
Shogi_Piece.M_SHA_P = -Shogi_Piece.SHA_P;
Shogi_Piece.M_KAKU_P = -Shogi_Piece.KAKU_P;
Shogi_Piece.M_FU_P = -Shogi_Piece.FU_P;
Shogi_Piece.MIN = -Shogi_Piece.SHA_P;
Shogi_Piece.MAX = Shogi_Piece.SHA_P;
