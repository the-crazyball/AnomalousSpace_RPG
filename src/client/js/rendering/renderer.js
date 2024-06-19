define([
    'js/resources',
    'js/library/events',
    'particles',
    'js/rendering/map/grid',
    'honeycomb',
    'js/rendering/loginBackground',
    'js/library/globals',
], function (
    resources,
    events,
    particleEmitter,
    Grid,
    honeycomb,
    renderLoginBackground,
    globals
) {
    const particleLayers = ['particlesUnder', 'particles'];
    const particleEngines = {};

    return {
        stage: null,

        layers: {
			particlesUnder: null,
			objects: null,
			mobs: null,
			characters: null,
			attacks: null,
			effects: null,
			particles: null,
			lightPatches: null,
			lightBeams: null,
			tileSprites: null,
			hiders: null
		},

		titleScreen: false,

		width: 0,
		height: 0,

		showTilesW: 0,
		showTilesH: 0,

		pos: {
			x: 0,
			y: 0
		},

		moveTo: null,
		moveSpeed: 0,
		moveSpeedMax: 1.50,
		moveSpeedInc: 0.5,

		lastUpdatePos: {
			x: 0,
			y: 0
		},

		zoneId: null,

		textures: {},
		textureCache: {},

		sprites: [],

		lastTick: null,

		hiddenRooms: null,

        init: function () {
            const { Container, ParticleContainer, Renderer, Ticker, Assets, Sprite, Graphics } = PIXI;
            
            PIXI.settings.GC_MODE = PIXI.GC_MODES.AUTO;
			PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
			PIXI.settings.SPRITE_MAX_TEXTURES = Math.min(PIXI.settings.SPRITE_MAX_TEXTURES, 16);
			PIXI.settings.RESOLUTION = 1;

            events.on('onGetMap', this.onGetMap.bind(this));

            this.width = $('body').width();
			this.height = $('body').height();

            this.renderer = new Renderer({
                width: this.width,
				height: this.height,
				backgroundColor: '0xaaaaaa'
            })
            
            window.addEventListener('resize', this.onResize.bind(this));

			$(this.renderer.view).appendTo('.canvas-container');

			this.stage = new Container();

			let layers = this.layers;
			Object.keys(layers).forEach(l => {
				layers[l] = new Container();
				layers[l].layer = (l === 'tileSprites') ? 'tiles' : l;

				this.stage.addChild(layers[l]);
			});

			const textureList = globals.clientConfig.textureList;
			const sprites = resources.sprites;

			textureList.forEach(t => {
				this.textures[t] = new PIXI.BaseTexture(sprites[t]);
				this.textures[t].scaleMode = PIXI.SCALE_MODES.NEAREST;
			});


           // const hex1 = honeycomb.defineHex({ dimensions: 70, orientation: 'POINTY' });
           // const testGrid = new honeycomb.Grid(hex1, honeycomb.rectangle({ width: 100, height: 100 }));

            // particleLayers.forEach(p => {
            //     const engine = $.extend({}, particles);
            //     engine.init({
            //         r: this,
            //         renderer: this.renderer,
            //         stage: this.layers[p]
            //     });

            //     particleEngines[p] = engine;
            // });

            $(this.renderer.view).appendTo('.canvas-container');
           
            //const background = Sprite.from('images/background.jpg')

            
            //const map = new Container();
            //map.setTransform(this.width / 2 | 0, this.height / 2 | 0, 1, 1);

            //const cnt = new ParticleContainer();
            //this.stage.addChild(background);
           // this.stage.addChild(map);
            //this.stage.addChild(cnt);

            // const SCALE = 1;

			// const centerX = ~~((-this.stage.x / SCALE) + (this.width / (SCALE * 2)));
			// const centerY = ~~((-this.stage.y / SCALE) + (this.height / (SCALE * 2)));

            // const DEPTH = 2;

            // const d = Math.abs(DEPTH);
            // const gameWidth = this.width;

            // const hexagonWidth = gameWidth / ((d * 2) + 1) ;
            // const size = ~~(hexagonWidth / (Math.sqrt(18) / 2) / 2);
            
            // const hexGrid = new Grid(DEPTH, size);

            // testGrid.forEach(hex => {
            //     let graphics = new PIXI.Graphics();
                
            //     graphics.lineStyle(1, 0xffffff, 1);
            //     graphics.beginFill(0x38ABC9, 0.1);
                
            //     const corners = hex.corners;

            //     const [firstCorner, ...otherCorners] = corners;

            //     graphics.moveTo(firstCorner.x, firstCorner.y);
            //     otherCorners.forEach(({ x, y }) => graphics.lineTo(x, y));
            //     graphics.lineTo(firstCorner.x, firstCorner.y);

            //     graphics.endFill();

            //    // map.addChild(graphics)

            // });


            // hexGrid.allToList().map(async h => {
            //     const pixels = [0, 1, 2, 3, 4, 5].map(v => _.pointyHexPixel(h.centerPixel, h.size, v));
            //     const startPixel = pixels[0];

            //     const hex = new Graphics();

            //     if (h.q === 0 && h.r === 0) {
            //         hex.lineStyle(4, 0xffffff, 1)
            //         this.pos.x = h.centerPixel.x;
            //         this.pos.y = h.centerPixel.y;
            //     } else {
            //         hex.lineStyle(1, 0xffffff, 1)
            //     }
                
            //     hex.moveTo(startPixel.x + centerX, startPixel.y + centerY);
            //     hex.beginFill(0x38ABC9, 0.1);

            //     for (let i = 1; i <= 5; i++) {
            //         hex.lineTo(pixels[i].x + centerX, pixels[i].y + centerY);
            //     }
            //     hex.lineTo(startPixel.x + centerX, startPixel.y + centerY);

            //     map.addChild(hex)
            // })

            // const ticker = new Ticker();
            // let elapsed = 0;
            // ticker.add(() => this.renderer.render(stage));
            // ticker.start();

            // const emitter = new PIXI.particles.Emitter(cnt, {
            //     lifetime: { min: 0.1, max: 3 },
            //     frequency: 1,
            //     spawnChance: 1,
            //     particlesPerWave: 1,
            //     emitterLifetime: 120,
            //     maxParticles: 10,
            //     pos: { x: 327, y: 200 },
            //     autoUpdate: true,
            //     behaviors: [
            //         {
            //             type: 'spawnShape',
            //             config: { type: 'torus', data: { x: 0, y: 0, radius: 100 } },
            //         },
            //         { 
            //             type: 'textureSingle', config: { texture: PIXI.Texture.WHITE } 
            //         },
            //     ],
            // });

            this.buildSpritesTexture();

        },
        onResize: function () {
			//if (isMobile)
			//	return;

			this.width = $('body').width();
			this.height = $('body').height();

			this.showTilesW = Math.ceil((this.width / scale) / 2) + 3;
			this.showTilesH = Math.ceil((this.height / scale) / 2) + 3;

			this.renderer.resize(this.width, this.height);
			if (window.player) {
				this.setPosition({
					x: (window.player.x - (this.width / (scale * 2))) * scale,
					y: (window.player.y - (this.height / (scale * 2))) * scale
				}, true);
			}

			if (this.titleScreen) {
				this.clean();
				this.buildTitleScreen();
			}

			events.emit('onResize');
		},
        onGetMap: function (msg) {
			this.titleScreen = false;
			
		},
        update: function () {
			let time = +new Date();

			this.lastTick = time;
		},
        buildTitleScreen: function () {
			this.titleScreen = true;
            //const background = PIXI.Sprite.from('images/background.jpg');
            //this.stage.addChild(background);

			renderLoginBackground(this);
		},
        setPosition: function (pos, instant) {
			pos.x += 16;
			pos.y += 16;

			let player = window.player;
			if (player) {
				let px = player.x;
				let py = player.y;

				let hiddenRooms = this.hiddenRooms || [];
				let hLen = hiddenRooms.length;
				for (let i = 0; i < hLen; i++) {
					let h = hiddenRooms[i];
					if (!h.discoverable)
						continue;
					if (
						px < h.x ||
						px >= h.x + h.width ||
						py < h.y ||
						py >= h.y + h.height ||
						!physics.isInPolygon(px, py, h.area)
					)
						continue;

					h.discovered = true;
				}
			}

			if (instant) {
				this.moveTo = null;
				this.pos = pos;
				this.stage.x = -~~this.pos.x;
				this.stage.y = -~~this.pos.y;
			} else
				this.moveTo = pos;

			this.updateSprites();
		},
        buildSpritesTexture: function () {
			const { clientConfig: { atlasTextureDimensions, atlasTextures } } = globals;

			let container = new PIXI.Container();

			let totalHeight = 0;
			atlasTextures.forEach(t => {
				let texture = this.textures[t];
				let tile = new PIXI.Sprite(new PIXI.Texture(texture));
    
				tile.width = texture.width;
				tile.height = texture.height;
				tile.x = 0;
				tile.y = totalHeight;

				atlasTextureDimensions[t] = {
					w: texture.width / 10,
					h: texture.height / 10
				};

				container.addChild(tile);

				totalHeight += tile.height;
			});

			let renderTexture = PIXI.RenderTexture.create({ width: this.textures.tiles.width, height: totalHeight });

			this.renderer.render(container, { renderTexture: renderTexture });

			this.textures.sprites = renderTexture;
			this.textures.scaleMult = PIXI.SCALE_MODES.NEAREST;
		},
        getTexture: function (baseTex, cell, size) {
			size = size || 61;

			let textureName = baseTex + '_' + cell;

			let textureCache = this.textureCache;

			let cached = textureCache[textureName];

			if (!cached) {
				let y = ~~(cell / 44);
				let x = cell - (y * 50);

                cached = new PIXI.Texture(this.textures[baseTex], new PIXI.Rectangle(x * 44, y * 50, 44, 50));
				textureCache[textureName] = cached;
			}

			return cached;
		},
        updateSprites: function () {
			if (this.titleScreen)
				return;
        },
        render: function () {
			if (!this.stage)
				return;

			//effects.render();

			//particleLayers.forEach(p => particleEngines[p].update());

			this.renderer.render(this.stage);
		}
    }
})