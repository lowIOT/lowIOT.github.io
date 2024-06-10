var Shogi_Hand = function() {
    this.from_col = 0;
    this.from_row = 0;
    this.to_col = 0;
    this.to_row = 0;
    this.promote = false;
    this.Score = new Array(3);
    this.Score[-1] = 0;
    this.Score[0] = 0;
    this.Score[1] = 0;
    this.children = null;
}

Shogi_Hand.createHand = function(piece, from_col, from_row, to_col, to_row, promote) {
    var hand = new Shogi_Hand();
    hand.from_col = from_col;
    hand.from_row = from_row;
    hand.to_col = to_col;
    hand.to_row = to_row;
    hand.promote = promote;
    return hand;
}

Shogi_Hand.prototype.toString = function() {
    return this.from_col + ',' + this.from_row + ':' + this.to_col + ',' + this.to_row + '/' + this.promote;
}
