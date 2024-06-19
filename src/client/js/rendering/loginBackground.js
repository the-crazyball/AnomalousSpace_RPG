define([
	'js/library/globals',
	'honeycomb'
], function (
	globals,
	honeycomb
) {
	let customRenderer = null;

	const renderCustomLoginBg = async (renderer, path) => {
		if (!customRenderer) {
			await (new Promise(res => {
				require([path], loadedModule => {
					customRenderer = loadedModule;
					res();
				});
			}));
		}  
		customRenderer(renderer);
	};

	const renderLoginBackground = renderer => {
		const { loginBgGeneratorPath } = globals.clientConfig;
		if (loginBgGeneratorPath) {
			renderCustomLoginBg(renderer, loginBgGeneratorPath);

			return;
		}

		const { width, height, layers } = renderer;

		renderer.setPosition({
			x: 0,
			y: 0
		}, true);

		let w = Math.ceil(width / (44 * scale)) + 1;
		let h = Math.ceil(height / (50 * scale)) + 1;

		let container = layers.tileSprites;

		const heDefinition = honeycomb.defineHex({ dimensions: { xRadius: 33 * scale, yRadius: 34 * scale }, orientation: 'POINTY' });
		const grid = new honeycomb.Grid(heDefinition, honeycomb.rectangle({ width: w, height: h }));

		const hightLightContainer = new PIXI.Container();

		grid.forEach(hex => {
			const childContainer = new PIXI.Container();

			const rnd = Math.floor(Math.random() * 12);

			let tile = new PIXI.Sprite(renderer.getTexture('sprites', rnd));

			// 44 w x 50 h
			tile.x = hex.x;
			tile.y = hex.y;
			tile.width = 60 * scale; 
			tile.height = 68 * scale;
			tile.anchor.set(0.5, 0.5);

			const text = new PIXI.Text('1', { fontSize: 6, fontFamily: 'UniSpace_Regular', fill: 'white', dropShadow: 'false', dropShadowDistance: 0, dropShadowColor: '#4d4d4d' });
			text.text = (hex.col).toString() + ', ' + (hex.row).toString();
			text.position.x = -15 + Math.round((text.width / 2));
			text.position.y = 15;
			text.anchor.set(0.5, 0.5);
			//tile.addChild(text)

			childContainer.addChild(tile);
			container.addChild(childContainer);

			let graphics = new PIXI.Graphics();
            
			graphics.lineStyle(1, 0x343434, 1);
			graphics.beginFill(0x38ABC9, 0);
            
			const corners = hex.corners;

			const [firstCorner, ...otherCorners] = corners;

			graphics.moveTo(firstCorner.x, firstCorner.y);
			otherCorners.forEach(({ x, y }) => graphics.lineTo(x, y));
			graphics.lineTo(firstCorner.x, firstCorner.y);

			graphics.endFill();

			container.addChild(graphics);
		});

		setInterval(() => {
			hightLightContainer.removeChildren();

			const xPos = Math.floor(Math.random() * (w - 2));
			const yPos = Math.floor(Math.random() * (h - 2));

			const hex = grid.getHex([xPos, yPos]);

			let graphics = new PIXI.Graphics();
            
			graphics.lineStyle(2, 0x38abc9, 1);
			graphics.beginFill(0x38ABC9, 0.4);
            
			const corners = hex.corners;

			const [firstCorner, ...otherCorners] = corners;

			graphics.moveTo(firstCorner.x, firstCorner.y);
			otherCorners.forEach(({ x, y }) => graphics.lineTo(x, y));
			graphics.lineTo(firstCorner.x, firstCorner.y);

			graphics.endFill();

			hightLightContainer.addChild(graphics);
			container.addChild(hightLightContainer);
		}, 1500);
	};

	return renderLoginBackground;
});
