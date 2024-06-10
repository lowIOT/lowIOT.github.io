var Shogi_Button = function(app, ui_listener) {
    Shogi_Component.call(this, app, ui_listener);
}

Shogi_Button.prototype = Object.create(Shogi_Component.prototype);
Shogi_Button.prototype.constructor = Shogi_Button;

Shogi_Button.prototype.createElement = function() {
    this.element = document.createElement('button');
    this.element.style.display = 'inline-block';
    this.element.style.position = 'absolute';
}

Shogi_Button.prototype.setFontSize = function(font_size) {
    this.element.style.fontSize = font_size + 'px';
}

Shogi_Button.prototype.setLabel = function(label) {
    this.element.textContent = label;
}
