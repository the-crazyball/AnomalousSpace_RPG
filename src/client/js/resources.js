define([
	'js/library/globals'
], function (
	globals
) {
	return {
		sprites: {},

		init: async function () {
			const { sprites } = this;
			const { clientConfig: { resourceList, textureList } } = globals;

			const fullList = [].concat(resourceList, textureList);

			return Promise.all(fullList.map(s => {
				return new Promise(res => {
					const spriteSource = s.includes('.png') ? s : `images/${s}.png`;

					const sprite = new Image();
					sprites[s] = sprite;
					sprite.onload = res;
					sprite.src = spriteSource;
				});
			}));
		},
		loadFonts: async function () {
			return new Promise((resolve, rej) => {
				const fontList = [
					new FontFace('UniSpace_Regular', 'url(fonts/unispace_rg.ttf', { style: 'normal', weight: 700 })
				]

				fontList.forEach(font => {
					font.load().then(function(loadedFontFace) {
						document.fonts.add(loadedFontFace);
					})
				})
				document.fonts.ready.then(() => resolve());
			})
		}
	};
});