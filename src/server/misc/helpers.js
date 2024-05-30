//eslint-disable-next-line no-extend-native
Object.defineProperty(Array.prototype, 'spliceWhere', {
	enumerable: false,
	value: function (callback, thisArg) {
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
	} 
});