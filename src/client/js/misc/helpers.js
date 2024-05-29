window._ = {
    pointyHexPixel: function (center, size, i) {
        const angleDeg = 60 * i - 30;
        const angleRad = Math.PI / 180 * angleDeg;
        return { x: center.x + size * Math.cos(angleRad), y: center.y + size * Math.sin(angleRad) };
    }
}

define([], function () {
	return window._;
});

