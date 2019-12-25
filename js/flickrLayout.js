class FlickrLayout {
    constructor(element, settings = {}) {
        this.element = element;
        this.maxRowHeight = 200;
        this.gutter = 20;
        this.expandLastRow = true;
        Object.assign(this, settings);
        this.findItems();
        this.imageLoadHooks();
        this.layout();
        this.clearFix();
        window.addEventListener('FlickrLayoutResize', (e) => {
            this.layout();
        });
    }
    layout() {
        Object.assign(this.element.style, {
            marginLeft: `-${this.gutter}px`,
        });
        this.width = this.element.clientWidth - this.gutter;
        let lastRow = this.items.reduce((row, item, index) => {
            row.push(item);
            const rowWidth = row.getImagesTotalWidth();
            Object.assign(item.element.style, {
                float: 'left',
                marginLeft: `${this.gutter}px`,
                marginBottom: `${this.gutter}px`,
            });
            if (rowWidth < this.width) {
                return row;
            }
            row.fitWidth();
            return new FlickrLayoutRow([], this);
        }, new FlickrLayoutRow([], this));
        if (this.expandLastRow) {
            lastRow.fitWidth();
        }
        else {
            lastRow.fitHeight();
        }
    }
    findItems() {
        let items = Array.from(this.element.children);
        this.items = items.map(item => new FlickrLayoutItem(item));
    }
    imageLoadHooks() {
        this.items.forEach(item => item.onload(this.layout.bind(this)));
    }
    clearFix() {
        const clearFix = document.createElement('br');
        clearFix.style.clear = 'both';
        this.element.appendChild(clearFix);
    }
    static init() {
        this.throttledResizeEvents();
    }
    static throttledResizeEvents() {
        const throttle = (type, name, obj = window) => {
            let running = false;
            const func = () => {
                if (running) {
                    return;
                }
                running = true;
                requestAnimationFrame(() => {
                    obj.dispatchEvent(new CustomEvent(name));
                    running = false;
                });
            };
            obj.addEventListener(type, func);
        };
        throttle('resize', 'FlickrLayoutResize');
    }
}
class FlickrLayoutItem {
    constructor(element) {
        this.element = element;
        if (this.element.tagName === 'IMG') {
            this.isImg = true;
            this.img = this.element;
        }
        else {
            this.isImg = false;
            this.img = this.element.querySelector('img');
        }
    }
    onload(callback) {
        this.img.addEventListener('load', e => {
            this.width = this.img.width;
            this.height = this.img.height;
            callback();
        });
        if (this.img.complete) {
            this.img.dispatchEvent(new CustomEvent('load'));
        }
    }
    getWidthByHeight(newHeight) {
        return (this.width / this.height) * newHeight;
    }
    getHeightByWidth(newWidth) {
        return (this.height / this.width) * newWidth;
    }
    setScale(height, scale = 1) {
        let width = this.getWidthByHeight(height);
        width *= scale;
        height *= scale;
        this.setSize(width, height);
    }
    setSize(width, height) {
        Object.assign(this.element.style, {
            width: `${width}px`,
            height: `${height}px`,
        });
        if (!this.isImg) {
            Object.assign(this.img.style, {
                display: 'block',
                width: '100%',
            });
        }
    }
}
class FlickrLayoutRow {
    constructor(items, layout) {
        this.items = items;
        this.layout = layout;
    }
    push(item) {
        this.items.push(item);
    }
    fitWidth() {
        const totalGutters = this.getGutterTotal();
        const rowScaleFactor = (this.layout.width - totalGutters) / (this.getImagesTotalWidth() - totalGutters);
        this.items.forEach(item => item.setScale(this.layout.maxRowHeight, rowScaleFactor));
    }
    fitHeight() {
        this.items.forEach(item => item.setScale(this.layout.maxRowHeight));
    }
    getImagesTotalWidth() {
        return this.items.reduce((width, item) => width + item.getWidthByHeight(this.layout.maxRowHeight), 0) + this.getGutterTotal();
    }
    getGutterTotal() {
        return (this.count() - 1) * this.layout.gutter;
    }
    count() {
        return this.items.length;
    }
}
FlickrLayout.init();