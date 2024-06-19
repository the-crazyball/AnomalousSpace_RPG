//eslint-disable-next-line no-extend-native
Array.prototype.spliceWhere = function (callback, thisArg) {
	let T = thisArg;
	let O = Object(this);
	let len = O.length >>> 0;

	let k = 0;

	while (k < len) {
		let kValue;

		if (k in O) {
			kValue = O[k];

			if (callback.call(T, kValue, k, O)) {
				O.splice(k, 1);
				k--;
			}
		}
		k++;
	}
};

//eslint-disable-next-line no-extend-native
Array.prototype.spliceFirstWhere = function (callback, thisArg) {
	let T = thisArg;
	let O = Object(this);
	let len = O.length >>> 0;

	let k = 0;

	while (k < len) {
		let kValue;

		if (k in O) {
			kValue = O[k];

			if (callback.call(T, kValue, k, O)) {
				O.splice(k, 1);
				return kValue;
			}
		}
		k++;
	}
};

//eslint-disable-next-line no-extend-native
Object.defineProperty(Object.prototype, 'has', {
	enumerable: false,
	value: function (prop) {
		//eslint-disable-next-line no-undefined
		return (this.hasOwnProperty(prop) && this[prop] !== undefined && this[prop] !== null);
	}
});

if (!String.prototype.padStart) {
	//eslint-disable-next-line no-extend-native
	String.prototype.padStart = function padStart (targetLength, padString) {
		targetLength = targetLength >> 0;
		padString = String(typeof padString !== 'undefined' ? padString : ' ');
		if (this.length >= targetLength)
			return String(this);

		targetLength = targetLength - this.length;
		if (targetLength > padString.length)
			padString += padString.repeat(targetLength / padString.length);

		return padString.slice(0, targetLength) + String(this);
	};
}

window._ = {
    pointyHexPixel: function (center, size, i) {
        const angleDeg = 60 * i - 30;
        const angleRad = Math.PI / 180 * angleDeg;
        return { x: center.x + size * Math.cos(angleRad), y: center.y + size * Math.sin(angleRad) };
    }
}

define([], function () {
	const urlParams = Object.fromEntries(window.location.search.substr(1).split('&').map(k => k.split('=')));

	window.isMobile = (
		urlParams.forceMobile === 'true' ||
		/Mobi|Android/i.test(navigator.userAgent) ||
		(
			navigator.platform === 'MacIntel' &&
			navigator.maxTouchPoints > 1
		)
	);

	window.scale = isMobile ? 32 : 1.5;
	window.scaleMult = isMobile ? 4 : 5;

	return window._;
});

