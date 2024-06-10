var Shogi_Rect = function() {

	this.left = 0;
	this.top = 0;
	this.right = 0;
	this.bottom = 0;
	this.width = 0;
	this.height = 0;
	this.center_x = 0;
	this.center_y = 0;

}

Shogi_Rect.createRectWithRect = function(rect) {
	return Shogi_Rect.createRect(rect.left, rect.top, rect.width, rect.height);
}

Shogi_Rect.createRect = function(left, top, width, height) {

	var rect = new Shogi_Rect();

	rect.left = left;
	rect.top = top;
	rect.right = left + width - 1;
	rect.bottom = top + height - 1;
	rect.width = width;
	rect.height = height;
	rect.center_x = Math.floor((rect.left + rect.right) / 2);
	rect.center_y = Math.floor((rect.top + rect.bottom) / 2);

	return rect;

}

Shogi_Rect.prototype.contains = function(x, y) {
	return (x >= this.left && x <= this.right && y >= this.top && y <= this.bottom);
}

Shogi_Rect.prototype.toString = function() {
	return this.left + ',' + this.top + ',' + this.right + ',' + this.bottom;
}
