define([
    'particles',
    'js/rendering/map/grid'
], function (
    particleEmitter,
    Grid
) {
    return {
        pos: {
            x: 0,
            y: 0
        },

        init: function () {
            const { Container, ParticleContainer, Renderer, Ticker, Assets, Sprite, Graphics } = PIXI;

            PIXI.settings.GC_MODE = PIXI.GC_MODES.AUTO;
			PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
			PIXI.settings.SPRITE_MAX_TEXTURES = Math.min(PIXI.settings.SPRITE_MAX_TEXTURES, 16);
			PIXI.settings.RESOLUTION = 1;

            this.width = $('body').width();
			this.height = $('body').height();

            this.renderer = new Renderer({
                width: this.width,
				height: this.height,
				backgroundColor: '0x2d2136'
            })

            $(this.renderer.view).appendTo('.canvas-container');
           
            const background = Sprite.from('images/background.jpg')

            const stage = new Container();
            const map = new Container();
            //map.setTransform(this.width / 2 | 0, this.height / 2 | 0, 1, 1);

            const cnt = new ParticleContainer();
            stage.addChild(background);
            stage.addChild(map);
            stage.addChild(cnt);

            const SCALE = 1;

			const centerX = ~~((-stage.x / SCALE) + (this.width / (SCALE * 2)));
			const centerY = ~~((-stage.y / SCALE) + (this.height / (SCALE * 2)));

            const DEPTH = 2;

            const d = Math.abs(DEPTH);
            const gameWidth = this.width;

            const hexagonWidth = gameWidth / ((d * 2) + 1) ;
            const size = ~~(hexagonWidth / (Math.sqrt(18) / 2) / 2);
            
            const hexGrid = new Grid(DEPTH, size);

            hexGrid.allToList().map(async h => {
                const pixels = [0, 1, 2, 3, 4, 5].map(v => _.pointyHexPixel(h.centerPixel, h.size, v));
                const startPixel = pixels[0];

                const hex = new Graphics();

                if (h.q === 0 && h.r === 0) {
                    hex.lineStyle(4, 0xffffff, 1)
                    this.pos.x = h.centerPixel.x;
                    this.pos.y = h.centerPixel.y;
                } else {
                    hex.lineStyle(1, 0xffffff, 1)
                }
                
                hex.moveTo(startPixel.x + centerX, startPixel.y + centerY);
                hex.beginFill(0x38ABC9, 0.1);

                for (let i = 1; i <= 5; i++) {
                    hex.lineTo(pixels[i].x + centerX, pixels[i].y + centerY);
                }
                hex.lineTo(startPixel.x + centerX, startPixel.y + centerY);

                map.addChild(hex)
            })

            const ticker = new Ticker();
            let elapsed = 0;
            ticker.add(() => this.renderer.render(stage));
            ticker.start();

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


        }
    }
})