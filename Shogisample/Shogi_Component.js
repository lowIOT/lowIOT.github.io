function Shogi_Component(app, ui_listener) {
    this.app = app;
    this.ui_listener = ui_listener;
    this.draw_scale = this.app.draw_scale;
    this.createElement();
    this.element.style.webkitTouchAction = 'none';
    this.element.style.webkitUserSelect = 'none';
    this.element.style.userSelect = 'none';
    this.element.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
    this.element.style.tapHighlightColor = 'rgba(0,0,0,0)';
    this.element.addEventListener('click', this.processElementClicked.bind(this), false);
    this.element.addEventListener('touchstart', this.processElementTouchStart.bind(this), false);
    this.last_touch_start_ms = 0;
}

Shogi_Component.prototype.setBackground = function(bg) {
    this.element.style.background = bg;
    this.background = bg;
}

Shogi_Component.prototype.setRect = function(left, top, width, height) {
    this.rect = Shogi_Rect.createRect(left, top, width, height);
    this.onRectSetted();
}

Shogi_Component.prototype.onRectSetted = function() {
    this.draw_scale = this.app.draw_scale;
    this.element.style.width = this.rect.width + 'px';
    this.element.style.height = this.rect.height + 'px';
    this.element.style.left = this.rect.left + 'px';
    this.element.style.top = this.rect.top + 'px';
}

Shogi_Component.prototype.processElementTouchStart = function(e) {
    if (e.touches.length >= 2) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
    var now = this.app.getTimeMS();
    if (now - this.last_touch_start_ms < 300) {
        e.preventDefault();
        e.stopPropagation();
        this.last_touch_start_ms = now;
        return false;
    }
    this.last_touch_start_ms = now;
}

Shogi_Component.prototype.processElementClicked = function(e) {
    e.preventDefault();
    e.stopPropagation();
    var elm = e.target;
    var element_rect = elm.getBoundingClientRect();
    var element_x = element_rect.left + window.pageXOffset;
    var element_y = element_rect.top + window.pageYOffset;
    var x = e.pageX - element_x;
    var y = e.pageY - element_y;
    this.onElementClicked(x, y);
}

Shogi_Component.prototype.onElementClicked = function(x, y) {
    if (this.ui_listener && this.ui_listener.onListeningComponentClicked) {
        this.ui_listener.onListeningComponentClicked.call(this.ui_listener, this, x, y);
    }
}

Shogi_Component.prototype.getHTMLElement = function() {
    return this.element;
}
