this.PIXI = this.PIXI || {}, (function (t, e, i, s, r, a, n) {
	 class h {
		constructor (t, e, i) {
			this.value = t, this.time = e, this.next = null, this.isStepped = !1, this.ease = i ? typeof i === 'function' ? i : g(i) : null;
		}static createList (t) {
			if ('list' in t) {
				const e = t.list; let i; const { value: s, time: r } = e[0], a = i = new h(typeof s === 'string' ? v(s) : s, r, t.ease); if (e.length > 2 || e.length === 2 && e[1].value !== s) {
					for (let t = 1; t < e.length; ++t) {
						const { value: s, time: r } = e[t]; i.next = new h(typeof s === 'string' ? v(s) : s, r), i = i.next;
					}
				} return a.isStepped = !!t.isStepped, a;
			} const e = new h(typeof t.start === 'string' ? v(t.start) : t.start, 0); return t.end !== t.start && (e.next = new h(typeof t.end === 'string' ? v(t.end) : t.end, 1)), e;
		}
	}let o = e.Texture.from; const l = !1, d = Math.PI / 180; function c (t, e) {
		if (!t) return; const i = Math.sin(t), s = Math.cos(t), r = e.x * s - e.y * i, a = e.x * i + e.y * s; e.x = r, e.y = a;
	} function p (t, e, i) {
		return t << 16 | e << 8 | i;
	} function u (t) {
		return Math.sqrt(t.x * t.x + t.y * t.y);
	} function m (t) {
		const e = 1 / u(t); t.x *= e, t.y *= e;
	} function f (t, e) {
		t.x *= e, t.y *= e;
	} function v (t, e) {
		let i; return e || (e = {}), t.charAt(0) === '#' ? t = t.substr(1) : t.indexOf('0x') === 0 && (t = t.substr(2)), t.length === 8 && (i = t.substr(0, 2), t = t.substr(2)), e.r = parseInt(t.substr(0, 2), 16), e.g = parseInt(t.substr(2, 2), 16), e.b = parseInt(t.substr(4, 2), 16), i && (e.a = parseInt(i, 16)), e;
	} function g (t) {
		const e = t.length, i = 1 / e; return function (s) {
			const r = e * s | 0, a = (s - r * i) * e, n = t[r] || t[e - 1]; return n.s + a * (2 * (1 - a) * (n.cp - n.s) + a * (n.e - n.s));
		};
	} function x (t) {
		return t ? (t = t.toUpperCase().replace(/ /g, '_'), i.BLEND_MODES[t] || i.BLEND_MODES.NORMAL) : i.BLEND_MODES.NORMAL;
	} let C, _ = { __proto__: null, GetTextureFromString: o, verbose: l, DEG_TO_RADS: d, rotatePoint: c, combineRGBComponents: p, length: u, normalize: m, scaleBy: f, hexToRGB: v, generateEase: g, getBlendMode: x, createSteppedGradient: function (t, e = 10) {
		(typeof e !== 'number' || e <= 0) && (e = 10); const i = new h(v(t[0].value), t[0].time); i.isStepped = !0; let s = i, r = t[0], a = 1, n = t[a]; for (let i = 1; i < e; ++i) {
			let o = i / e; for (;o > n.time;)r = n, n = t[++a]; o = (o - r.time) / (n.time - r.time); const l = v(r.value), d = v(n.value), c = { r: (d.r - l.r) * o + l.r, g: (d.g - l.g) * o + l.g, b: (d.b - l.b) * o + l.b }; s.next = new h(c, i / e), s = s.next;
		} return i;
	} }; class y extends s.Sprite {
		constructor (t) {
			super(), this.prevChild = this.nextChild = null, this.emitter = t, this.config = {}, this.anchor.x = this.anchor.y = 0.5, this.maxLife = 0, this.age = 0, this.agePercent = 0, this.oneOverLife = 0, this.next = null, this.prev = null, this.init = this.init, this.kill = this.kill;
		}init (t) {
			this.maxLife = t, this.age = this.agePercent = 0, this.rotation = 0, this.position.x = this.position.y = 0, this.scale.x = this.scale.y = 1, this.tint = 16777215, this.alpha = 1, this.oneOverLife = 1 / this.maxLife, this.visible = !0;
		}kill () {
			this.emitter.recycle(this);
		}destroy () {
			this.parent && this.parent.removeChild(this), this.emitter = this.next = this.prev = null, super.destroy();
		}
	}!(function (t) {
		t[t.Spawn = 0] = 'Spawn', t[t.Normal = 2] = 'Normal', t[t.Late = 5] = 'Late';
	})(C || (C = {})); const P = a.Ticker.shared, w = Symbol('Position particle per emitter position'); class b {
		constructor (t, e) {
			this.initBehaviors = [], this.updateBehaviors = [], this.recycleBehaviors = [], this.minLifetime = 0, this.maxLifetime = 0, this.customEase = null, this._frequency = 1, this.spawnChance = 1, this.maxParticles = 1e3, this.emitterLifetime = -1, this.spawnPos = new r.Point(), this.particlesPerWave = 1, this.rotation = 0, this.ownerPos = new r.Point(), this._prevEmitterPos = new r.Point(), this._prevPosIsValid = !1, this._posChanged = !1, this._parent = null, this.addAtBack = !1, this.particleCount = 0, this._emit = !1, this._spawnTimer = 0, this._emitterLife = -1, this._activeParticlesFirst = null, this._activeParticlesLast = null, this._poolFirst = null, this._origConfig = null, this._autoUpdate = !1, this._destroyWhenComplete = !1, this._completeCallback = null, this.parent = t, e && this.init(e), this.recycle = this.recycle, this.update = this.update, this.rotate = this.rotate, this.updateSpawnPos = this.updateSpawnPos, this.updateOwnerPos = this.updateOwnerPos;
		}static registerBehavior (t) {
			b.knownBehaviors[t.type] = t;
		} get frequency () {
			return this._frequency;
		} set frequency (t) {
			this._frequency = typeof t === 'number' && t > 0 ? t : 1;
		} get parent () {
			return this._parent;
		} set parent (t) {
			this.cleanup(), this._parent = t;
		}init (t) {
			if (!t) return; this.cleanup(), this._origConfig = t, this.minLifetime = t.lifetime.min, this.maxLifetime = t.lifetime.max, t.ease ? this.customEase = typeof t.ease === 'function' ? t.ease : g(t.ease) : this.customEase = null, this.particlesPerWave = 1, t.particlesPerWave && t.particlesPerWave > 1 && (this.particlesPerWave = t.particlesPerWave), this.frequency = t.frequency, this.spawnChance = typeof t.spawnChance === 'number' && t.spawnChance > 0 ? t.spawnChance : 1, this.emitterLifetime = t.emitterLifetime || -1, this.maxParticles = t.maxParticles > 0 ? t.maxParticles : 1e3, this.addAtBack = !!t.addAtBack, this.rotation = 0, this.ownerPos.set(0), t.pos ? this.spawnPos.copyFrom(t.pos) : this.spawnPos.set(0), this._prevEmitterPos.copyFrom(this.spawnPos), this._prevPosIsValid = !1, this._spawnTimer = 0, this.emit = void 0 === t.emit || !!t.emit, this.autoUpdate = !!t.autoUpdate; const e = t.behaviors.map((t => {
				const e = b.knownBehaviors[t.type]; return e ? new e(t.config) : (console.error(`Unknown behavior: ${t.type}`), null);
			})).filter((t => !!t)); e.push(w), e.sort(((t, e) => t === w ? e.order === C.Spawn ? 1 : -1 : e === w ? t.order === C.Spawn ? -1 : 1 : t.order - e.order)), this.initBehaviors = e.slice(), this.updateBehaviors = e.filter((t => t !== w && t.updateParticle)), this.recycleBehaviors = e.filter((t => t !== w && t.recycleParticle));
		}getBehavior (t) {
			return b.knownBehaviors[t] && this.initBehaviors.find((e => e instanceof b.knownBehaviors[t])) || null;
		}fillPool (t) {
			for (;t > 0; --t) {
				const t = new y(this); t.next = this._poolFirst, this._poolFirst = t;
			}
		}recycle (t, e = !1) {
			for (let i = 0; i < this.recycleBehaviors.length; ++i) this.recycleBehaviors[i].recycleParticle(t, !e); t.next && (t.next.prev = t.prev), t.prev && (t.prev.next = t.next), t === this._activeParticlesLast && (this._activeParticlesLast = t.prev), t === this._activeParticlesFirst && (this._activeParticlesFirst = t.next), t.prev = null, t.next = this._poolFirst, this._poolFirst = t, t.parent && t.parent.removeChild(t), --this.particleCount;
		}rotate (t) {
			if (this.rotation === t) return; const e = t - this.rotation; this.rotation = t, c(e, this.spawnPos), this._posChanged = !0;
		}updateSpawnPos (t, e) {
			this._posChanged = !0, this.spawnPos.x = t, this.spawnPos.y = e;
		}updateOwnerPos (t, e) {
			this._posChanged = !0, this.ownerPos.x = t, this.ownerPos.y = e;
		}resetPositionTracking () {
			this._prevPosIsValid = !1;
		} get emit () {
			return this._emit;
		} set emit (t) {
			this._emit = !!t, this._emitterLife = this.emitterLifetime;
		} get autoUpdate () {
			return this._autoUpdate;
		} set autoUpdate (t) {
			this._autoUpdate && !t ? P.remove(this.update, this) : !this._autoUpdate && t && P.add(this.update, this), this._autoUpdate = !!t;
		}playOnceAndDestroy (t) {
			this.autoUpdate = !0, this.emit = !0, this._destroyWhenComplete = !0, this._completeCallback = t;
		}playOnce (t) {
			this.emit = !0, this._completeCallback = t;
		}update (t) {
			if (this._autoUpdate && (t = 0.001 * P.elapsedMS), !this._parent) return; for (let e, i = this._activeParticlesFirst; i; i = e) {
				if (e = i.next, i.age += t, i.age > i.maxLife || i.age < 0) this.recycle(i); else {
					let e = i.age * i.oneOverLife; this.customEase && (e = this.customEase.length === 4 ? this.customEase(e, 0, 1, 1) : this.customEase(e)), i.agePercent = e; for (let e = 0; e < this.updateBehaviors.length; ++e) {
						if (this.updateBehaviors[e].updateParticle(i, t)) {
							this.recycle(i); break;
						}
					}
				}
			}let e, i; this._prevPosIsValid && (e = this._prevEmitterPos.x, i = this._prevEmitterPos.y); const s = this.ownerPos.x + this.spawnPos.x, r = this.ownerPos.y + this.spawnPos.y; if (this._emit) {
				for (this._spawnTimer -= t < 0 ? 0 : t; this._spawnTimer <= 0;) {
					if (this._emitterLife >= 0 && (this._emitterLife -= this._frequency, this._emitterLife <= 0)) {
						this._spawnTimer = 0, this._emitterLife = 0, this.emit = !1; break;
					} if (this.particleCount >= this.maxParticles) {
						this._spawnTimer += this._frequency; continue;
					}let a, n; if (this._prevPosIsValid && this._posChanged) {
						const h = 1 + this._spawnTimer / t; a = (s - e) * h + e, n = (r - i) * h + i;
					} else a = s, n = r; let h = null, o = null; for (let t = Math.min(this.particlesPerWave, this.maxParticles - this.particleCount), e = 0; e < t; ++e) {
						if (this.spawnChance < 1 && Math.random() >= this.spawnChance) continue; let t, e; (t = this.minLifetime === this.maxLifetime ? this.minLifetime : Math.random() * (this.maxLifetime - this.minLifetime) + this.minLifetime, -this._spawnTimer >= t) || (this._poolFirst ? (e = this._poolFirst, this._poolFirst = this._poolFirst.next, e.next = null) : e = new y(this), e.init(t), this.addAtBack ? this._parent.addChildAt(e, 0) : this._parent.addChild(e), h ? (o.next = e, e.prev = o, o = e) : o = h = e, ++this.particleCount);
					} if (h) {
						this._activeParticlesLast ? (this._activeParticlesLast.next = h, h.prev = this._activeParticlesLast, this._activeParticlesLast = o) : (this._activeParticlesFirst = h, this._activeParticlesLast = o); for (let t = 0; t < this.initBehaviors.length; ++t) {
							const e = this.initBehaviors[t]; if (e === w) {
								for (let t, e = h; e; e = t) {
									t = e.next, this.rotation !== 0 && (c(this.rotation, e.position), e.rotation += this.rotation), e.position.x += a, e.position.y += n, e.age += -this._spawnTimer; let i = e.age * e.oneOverLife; this.customEase && (i = this.customEase.length === 4 ? this.customEase(i, 0, 1, 1) : this.customEase(i)), e.agePercent = i;
								}
							} else e.initParticles(h);
						} for (let t, e = h; e; e = t) {
							t = e.next; for (let t = 0; t < this.updateBehaviors.length; ++t) {
								if (this.updateBehaviors[t].updateParticle(e, -this._spawnTimer)) {
									this.recycle(e); break;
								}
							}
						}
					} this._spawnTimer += this._frequency;
				}
			} if (this._posChanged && (this._prevEmitterPos.x = s, this._prevEmitterPos.y = r, this._prevPosIsValid = !0, this._posChanged = !1), !this._emit && !this._activeParticlesFirst) {
				if (this._completeCallback) {
					const t = this._completeCallback; this._completeCallback = null, t();
				} this._destroyWhenComplete && this.destroy();
			}
		}emitNow () {
			const t = this.ownerPos.x + this.spawnPos.x, e = this.ownerPos.y + this.spawnPos.y; let i = null, s = null; for (let t = Math.min(this.particlesPerWave, this.maxParticles - this.particleCount), e = 0; e < t; ++e) {
				if (this.spawnChance < 1 && Math.random() >= this.spawnChance) continue; let t, e; this._poolFirst ? (t = this._poolFirst, this._poolFirst = this._poolFirst.next, t.next = null) : t = new y(this), e = this.minLifetime === this.maxLifetime ? this.minLifetime : Math.random() * (this.maxLifetime - this.minLifetime) + this.minLifetime, t.init(e), this.addAtBack ? this._parent.addChildAt(t, 0) : this._parent.addChild(t), i ? (s.next = t, t.prev = s, s = t) : s = i = t, ++this.particleCount;
			} if (i) {
				this._activeParticlesLast ? (this._activeParticlesLast.next = i, i.prev = this._activeParticlesLast, this._activeParticlesLast = s) : (this._activeParticlesFirst = i, this._activeParticlesLast = s); for (let s = 0; s < this.initBehaviors.length; ++s) {
					const r = this.initBehaviors[s]; if (r === w) for (let s, r = i; r; r = s)s = r.next, this.rotation !== 0 && (c(this.rotation, r.position), r.rotation += this.rotation), r.position.x += t, r.position.y += e; else r.initParticles(i);
				}
			}
		}cleanup () {
			let t, e; for (t = this._activeParticlesFirst; t; t = e)e = t.next, this.recycle(t, !0); this._activeParticlesFirst = this._activeParticlesLast = null, this.particleCount = 0;
		} get destroyed () {
			return !(this._parent && this.initBehaviors.length);
		}destroy () {
			let t; this.autoUpdate = !1, this.cleanup(); for (let e = this._poolFirst; e; e = t)t = e.next, e.destroy(); this._poolFirst = this._parent = this.spawnPos = this.ownerPos = this.customEase = this._completeCallback = null, this.initBehaviors.length = this.updateBehaviors.length = this.recycleBehaviors.length = 0;
		}
	}b.knownBehaviors = {}; class S {
		constructor (t) {
			this.x = t.x, this.y = t.y, this.w = t.w, this.h = t.h;
		}getRandPos (t) {
			t.x = Math.random() * this.w + this.x, t.y = Math.random() * this.h + this.y;
		}
	}S.type = 'rect', S.editorConfig = null; class B {
		constructor (t) {
			this.x = t.x || 0, this.y = t.y || 0, this.radius = t.radius, this.innerRadius = t.innerRadius || 0, this.rotation = !!t.affectRotation;
		}getRandPos (t) {
			this.innerRadius !== this.radius ? t.x = Math.random() * (this.radius - this.innerRadius) + this.innerRadius : t.x = this.radius, t.y = 0; const e = Math.random() * Math.PI * 2; this.rotation && (t.rotation += e), c(e, t.position), t.position.x += this.x, t.position.y += this.y;
		}
	}B.type = 'torus', B.editorConfig = null; class L {
		constructor (t) {
			this.segments = [], this.countingLengths = [], this.totalLength = 0, this.init(t);
		}init (t) {
			if (t && t.length) {
				if (Array.isArray(t[0])) {
					for (let e = 0; e < t.length; ++e) {
						const i = t[e]; let s = i[0]; for (let t = 1; t < i.length; ++t) {
							const e = i[t]; this.segments.push({ p1: s, p2: e, l: 0 }), s = e;
						}
					}
				} else {
					let e = t[0]; for (let i = 1; i < t.length; ++i) {
						const s = t[i]; this.segments.push({ p1: e, p2: s, l: 0 }), e = s;
					}
				}
			} else this.segments.push({ p1: { x: 0, y: 0 }, p2: { x: 0, y: 0 }, l: 0 }); for (let t = 0; t < this.segments.length; ++t) {
				const { p1: e, p2: i } = this.segments[t], s = Math.sqrt((i.x - e.x) * (i.x - e.x) + (i.y - e.y) * (i.y - e.y)); this.segments[t].l = s, this.totalLength += s, this.countingLengths.push(this.totalLength);
			}
		}getRandPos (t) {
			const e = Math.random() * this.totalLength; let i, s; if (this.segments.length === 1)i = this.segments[0], s = e; else {
				for (let t = 0; t < this.countingLengths.length; ++t) {
					if (e < this.countingLengths[t]) {
						i = this.segments[t], s = t === 0 ? e : e - this.countingLengths[t - 1]; break;
					}
				}
			}s /= i.l || 1; const { p1: r, p2: a } = i; t.x = r.x + s * (a.x - r.x), t.y = r.y + s * (a.y - r.y);
		}
	}L.type = 'polygonalChain', L.editorConfig = null; let M = { __proto__: null, Rectangle: S, Torus: B, PolygonalChain: L }; class E {
		constructor (t) {
			let e; this.order = C.Late, this.minStart = t.minStart, this.maxStart = t.maxStart, this.accel = t.accel, this.rotate = !!t.rotate, this.maxSpeed = (e = t.maxSpeed) !== null && void 0 !== e ? e : 0;
		}initParticles (t) {
			let e = t; for (;e;) {
				const t = Math.random() * (this.maxStart - this.minStart) + this.minStart; e.config.velocity ? e.config.velocity.set(t, 0) : e.config.velocity = new r.Point(t, 0), c(e.rotation, e.config.velocity), e = e.next;
			}
		}updateParticle (t, e) {
			const i = t.config.velocity, s = i.x, r = i.y; if (i.x += this.accel.x * e, i.y += this.accel.y * e, this.maxSpeed) {
				const t = u(i); t > this.maxSpeed && f(i, this.maxSpeed / t);
			}t.x += (s + i.x) / 2 * e, t.y += (r + i.y) / 2 * e, this.rotate && (t.rotation = Math.atan2(i.y, i.x));
		}
	} function I (t) {
		return this.ease && (t = this.ease(t)), (this.first.next.value - this.first.value) * t + this.first.value;
	} function A (t) {
		this.ease && (t = this.ease(t)); const e = this.first.value, i = this.first.next.value; return p((i.r - e.r) * t + e.r, (i.g - e.g) * t + e.g, (i.b - e.b) * t + e.b);
	} function R (t) {
		this.ease && (t = this.ease(t)); let e = this.first, i = e.next; for (;t > i.time;)e = i, i = i.next; return t = (t - e.time) / (i.time - e.time), (i.value - e.value) * t + e.value;
	} function k (t) {
		this.ease && (t = this.ease(t)); let e = this.first, i = e.next; for (;t > i.time;)e = i, i = i.next; t = (t - e.time) / (i.time - e.time); const s = e.value, r = i.value; return p((r.r - s.r) * t + s.r, (r.g - s.g) * t + s.g, (r.b - s.b) * t + s.b);
	} function T (t) {
		this.ease && (t = this.ease(t)); let e = this.first; for (;e.next && t > e.next.time;)e = e.next; return e.value;
	} function D (t) {
		this.ease && (t = this.ease(t)); let e = this.first; for (;e.next && t > e.next.time;)e = e.next; const i = e.value; return p(i.r, i.g, i.b);
	}E.type = 'moveAcceleration', E.editorConfig = null; class F {
		constructor (t = !1) {
			this.first = null, this.isColor = !!t, this.interpolate = null, this.ease = null;
		}reset (t) {
			this.first = t; t.next && t.next.time >= 1 ? this.interpolate = this.isColor ? A : I : t.isStepped ? this.interpolate = this.isColor ? D : T : this.interpolate = this.isColor ? k : R, this.ease = this.first.ease;
		}
	} class O {
		constructor (t) {
			this.order = C.Normal, this.list = new F(!1), this.list.reset(h.createList(t.alpha));
		}initParticles (t) {
			let e = t; for (;e;)e.alpha = this.list.first.value, e = e.next;
		}updateParticle (t) {
			t.alpha = this.list.interpolate(t.agePercent);
		}
	}O.type = 'alpha', O.editorConfig = null; class N {
		constructor (t) {
			this.order = C.Normal, this.value = t.alpha;
		}initParticles (t) {
			let e = t; for (;e;)e.alpha = this.value, e = e.next;
		}
	} function U (t) {
		const i = []; for (let s = 0; s < t.length; ++s) {
			let r = t[s]; if (typeof r === 'string')i.push(o(r)); else if (r instanceof e.Texture)i.push(r); else {
				let t = r.count || 1; for (r = typeof r.texture === 'string' ? o(r.texture) : r.texture; t > 0; --t)i.push(r);
			}
		} return i;
	}N.type = 'alphaStatic', N.editorConfig = null; class q {
		constructor (t) {
			this.order = C.Normal, this.anims = []; for (let e = 0; e < t.anims.length; ++e) {
				const i = t.anims[e], s = U(i.textures), r = i.framerate < 0 ? -1 : i.framerate > 0 ? i.framerate : 60, a = { textures: s, duration: r > 0 ? s.length / r : 0, framerate: r, loop: r > 0 && !!i.loop }; this.anims.push(a);
			}
		}initParticles (t) {
			let e = t; for (;e;) {
				const t = Math.floor(Math.random() * this.anims.length), i = e.config.anim = this.anims[t]; e.texture = i.textures[0], e.config.animElapsed = 0, i.framerate === -1 ? (e.config.animDuration = e.maxLife, e.config.animFramerate = i.textures.length / e.maxLife) : (e.config.animDuration = i.duration, e.config.animFramerate = i.framerate), e = e.next;
			}
		}updateParticle (t, i) {
			const s = t.config, r = s.anim; s.animElapsed += i, s.animElapsed >= s.animDuration && (s.anim.loop ? s.animElapsed = s.animElapsed % s.animDuration : s.animElapsed = s.animDuration - 1e-6); const a = s.animElapsed * s.animFramerate + 1e-7 | 0; t.texture = r.textures[a] || r.textures[r.textures.length - 1] || e.Texture.EMPTY;
		}
	}q.type = 'animatedRandom', q.editorConfig = null; class W {
		constructor (t) {
			this.order = C.Normal; const e = t.anim, i = U(e.textures), s = e.framerate < 0 ? -1 : e.framerate > 0 ? e.framerate : 60; this.anim = { textures: i, duration: s > 0 ? i.length / s : 0, framerate: s, loop: s > 0 && !!e.loop };
		}initParticles (t) {
			let e = t; const i = this.anim; for (;e;)e.texture = i.textures[0], e.config.animElapsed = 0, i.framerate === -1 ? (e.config.animDuration = e.maxLife, e.config.animFramerate = i.textures.length / e.maxLife) : (e.config.animDuration = i.duration, e.config.animFramerate = i.framerate), e = e.next;
		}updateParticle (t, i) {
			const s = this.anim, r = t.config; r.animElapsed += i, r.animElapsed >= r.animDuration && (s.loop ? r.animElapsed = r.animElapsed % r.animDuration : r.animElapsed = r.animDuration - 1e-6); const a = r.animElapsed * r.animFramerate + 1e-7 | 0; t.texture = s.textures[a] || s.textures[s.textures.length - 1] || e.Texture.EMPTY;
		}
	}W.type = 'animatedSingle', W.editorConfig = null; class X {
		constructor (t) {
			this.order = C.Normal, this.value = t.blendMode;
		}initParticles (t) {
			let e = t; for (;e;)e.blendMode = x(this.value), e = e.next;
		}
	}X.type = 'blendMode', X.editorConfig = null; class $ {
		constructor (t) {
			this.order = C.Spawn, this.spacing = t.spacing * d, this.start = t.start * d, this.distance = t.distance;
		}initParticles (t) {
			let e = 0, i = t; for (;i;) {
				let t; t = this.spacing ? this.start + this.spacing * e : Math.random() * Math.PI * 2, i.rotation = t, this.distance && (i.position.x = this.distance, c(t, i.position)), i = i.next, ++e;
			}
		}
	}$.type = 'spawnBurst', $.editorConfig = null; class G {
		constructor (t) {
			this.order = C.Normal, this.list = new F(!0), this.list.reset(h.createList(t.color));
		}initParticles (t) {
			let e = t; const i = this.list.first.value, s = p(i.r, i.g, i.b); for (;e;)e.tint = s, e = e.next;
		}updateParticle (t) {
			t.tint = this.list.interpolate(t.agePercent);
		}
	}G.type = 'color', G.editorConfig = null; class j {
		constructor (t) {
			this.order = C.Normal; let e = t.color; e.charAt(0) === '#' ? e = e.substr(1) : e.indexOf('0x') === 0 && (e = e.substr(2)), this.value = parseInt(e, 16);
		}initParticles (t) {
			let e = t; for (;e;)e.tint = this.value, e = e.next;
		}
	}j.type = 'colorStatic', j.editorConfig = null; class V {
		constructor (t) {
			this.order = C.Normal, this.index = 0, this.textures = t.textures.map((t => typeof t === 'string' ? o(t) : t));
		}initParticles (t) {
			let e = t; for (;e;)e.texture = this.textures[this.index], ++this.index >= this.textures.length && (this.index = 0), e = e.next;
		}
	}V.type = 'textureOrdered', V.editorConfig = null; const Q = new r.Point(), Y = ['E', 'LN2', 'LN10', 'LOG2E', 'LOG10E', 'PI', 'SQRT1_2', 'SQRT2', 'abs', 'acos', 'acosh', 'asin', 'asinh', 'atan', 'atanh', 'atan2', 'cbrt', 'ceil', 'cos', 'cosh', 'exp', 'expm1', 'floor', 'fround', 'hypot', 'log', 'log1p', 'log10', 'log2', 'max', 'min', 'pow', 'random', 'round', 'sign', 'sin', 'sinh', 'sqrt', 'tan', 'tanh'], z = new RegExp(['[01234567890\\.\\*\\-\\+\\/\\(\\)x ,]'].concat(Y).join('|'), 'g'); class H {
		constructor (t) {
			let e; if (this.order = C.Late, t.path) {
				if (typeof t.path === 'function') this.path = t.path; else {
					try {
						this.path = (function (t) {
							const e = t.match(z); for (let t = e.length - 1; t >= 0; --t)Y.indexOf(e[t]) >= 0 && (e[t] = `Math.${e[t]}`); return t = e.join(''), new Function('x', `return ${t};`);
						})(t.path);
					} catch (t) {
						l, this.path = null;
					}
				}
			} else this.path = t => t; this.list = new F(!1), this.list.reset(h.createList(t.speed)), this.minMult = (e = t.minMult) !== null && void 0 !== e ? e : 1;
		}initParticles (t) {
			let e = t; for (;e;) {
				e.config.initRotation = e.rotation, e.config.initPosition ? e.config.initPosition.copyFrom(e.position) : e.config.initPosition = new r.Point(e.x, e.y), e.config.movement = 0; const t = Math.random() * (1 - this.minMult) + this.minMult; e.config.speedMult = t, e = e.next;
			}
		}updateParticle (t, e) {
			const i = this.list.interpolate(t.agePercent) * t.config.speedMult; t.config.movement += i * e, Q.x = t.config.movement, Q.y = this.path(Q.x), c(t.config.initRotation, Q), t.position.x = t.config.initPosition.x + Q.x, t.position.y = t.config.initPosition.y + Q.y;
		}
	}H.type = 'movePath', H.editorConfig = null; class J {
		constructor () {
			this.order = C.Spawn;
		}initParticles (t) {}
	}J.type = 'spawnPoint', J.editorConfig = null; class K {
		constructor (t) {
			this.order = C.Normal, this.textures = t.textures.map((t => typeof t === 'string' ? o(t) : t));
		}initParticles (t) {
			let e = t; for (;e;) {
				const t = Math.floor(Math.random() * this.textures.length); e.texture = this.textures[t], e = e.next;
			}
		}
	}K.type = 'textureRandom', K.editorConfig = null; class Z {
		constructor (t) {
			this.order = C.Normal, this.minStart = t.minStart * d, this.maxStart = t.maxStart * d, this.minSpeed = t.minSpeed * d, this.maxSpeed = t.maxSpeed * d, this.accel = t.accel * d;
		}initParticles (t) {
			let e = t; for (;e;) this.minStart === this.maxStart ? e.rotation += this.maxStart : e.rotation += Math.random() * (this.maxStart - this.minStart) + this.minStart, e.config.rotSpeed = Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed, e = e.next;
		}updateParticle (t, e) {
			if (this.accel) {
				const i = t.config.rotSpeed; t.config.rotSpeed += this.accel * e, t.rotation += (t.config.rotSpeed + i) / 2 * e;
			} else t.rotation += t.config.rotSpeed * e;
		}
	}Z.type = 'rotation', Z.editorConfig = null; class tt {
		constructor (t) {
			this.order = C.Normal, this.min = t.min * d, this.max = t.max * d;
		}initParticles (t) {
			let e = t; for (;e;) this.min === this.max ? e.rotation += this.max : e.rotation += Math.random() * (this.max - this.min) + this.min, e = e.next;
		}
	}tt.type = 'rotationStatic', tt.editorConfig = null; class et {
		constructor (t) {
			this.order = C.Late + 1, this.rotation = (t.rotation || 0) * d;
		}initParticles (t) {
			let e = t; for (;e;)e.rotation = this.rotation, e = e.next;
		}
	}et.type = 'noRotation', et.editorConfig = null; class it {
		constructor (t) {
			let e; this.order = C.Normal, this.list = new F(!1), this.list.reset(h.createList(t.scale)), this.minMult = (e = t.minMult) !== null && void 0 !== e ? e : 1;
		}initParticles (t) {
			let e = t; for (;e;) {
				const t = Math.random() * (1 - this.minMult) + this.minMult; e.config.scaleMult = t, e.scale.x = e.scale.y = this.list.first.value * t, e = e.next;
			}
		}updateParticle (t) {
			t.scale.x = t.scale.y = this.list.interpolate(t.agePercent) * t.config.scaleMult;
		}
	}it.type = 'scale', it.editorConfig = null; class st {
		constructor (t) {
			this.order = C.Normal, this.min = t.min, this.max = t.max;
		}initParticles (t) {
			let e = t; for (;e;) {
				const t = Math.random() * (this.max - this.min) + this.min; e.scale.x = e.scale.y = t, e = e.next;
			}
		}
	}st.type = 'scaleStatic', st.editorConfig = null; class rt {
		constructor (t) {
			this.order = C.Spawn; const e = rt.shapes[t.type]; if (!e) throw new Error(`No shape found with type '${t.type}'`); this.shape = new e(t.data);
		}static registerShape (t, e) {
			rt.shapes[e || t.type] = t;
		}initParticles (t) {
			let e = t; for (;e;) this.shape.getRandPos(e), e = e.next;
		}
	}rt.type = 'spawnShape', rt.editorConfig = null, rt.shapes = {}, rt.registerShape(L), rt.registerShape(S), rt.registerShape(B), rt.registerShape(B, 'circle'); class at {
		constructor (t) {
			this.order = C.Normal, this.texture = typeof t.texture === 'string' ? o(t.texture) : t.texture;
		}initParticles (t) {
			let e = t; for (;e;)e.texture = this.texture, e = e.next;
		}
	}at.type = 'textureSingle', at.editorConfig = null; class nt {
		constructor (t) {
			let e; this.order = C.Late, this.list = new F(!1), this.list.reset(h.createList(t.speed)), this.minMult = (e = t.minMult) !== null && void 0 !== e ? e : 1;
		}initParticles (t) {
			let e = t; for (;e;) {
				const t = Math.random() * (1 - this.minMult) + this.minMult; e.config.speedMult = t, e.config.velocity ? e.config.velocity.set(this.list.first.value * t, 0) : e.config.velocity = new r.Point(this.list.first.value * t, 0), c(e.rotation, e.config.velocity), e = e.next;
			}
		}updateParticle (t, e) {
			const i = this.list.interpolate(t.agePercent) * t.config.speedMult, s = t.config.velocity; m(s), f(s, i), t.x += s.x * e, t.y += s.y * e;
		}
	}nt.type = 'moveSpeed', nt.editorConfig = null; class ht {
		constructor (t) {
			this.order = C.Late, this.min = t.min, this.max = t.max;
		}initParticles (t) {
			let e = t; for (;e;) {
				const t = Math.random() * (this.max - this.min) + this.min; e.config.velocity ? e.config.velocity.set(t, 0) : e.config.velocity = new r.Point(t, 0), c(e.rotation, e.config.velocity), e = e.next;
			}
		}updateParticle (t, e) {
			const i = t.config.velocity; t.x += i.x * e, t.y += i.y * e;
		}
	}ht.type = 'moveSpeedStatic', ht.editorConfig = null; let ot = { __proto__: null, spawnShapes: M, editor: { __proto__: null }, get BehaviorOrder () {
		return C;
	}, AccelerationBehavior: E, AlphaBehavior: O, StaticAlphaBehavior: N, RandomAnimatedTextureBehavior: q, SingleAnimatedTextureBehavior: W, BlendModeBehavior: X, BurstSpawnBehavior: $, ColorBehavior: G, StaticColorBehavior: j, OrderedTextureBehavior: V, PathBehavior: H, PointSpawnBehavior: J, RandomTextureBehavior: K, RotationBehavior: Z, StaticRotationBehavior: tt, NoRotationBehavior: et, ScaleBehavior: it, StaticScaleBehavior: st, ShapeSpawnBehavior: rt, SingleTextureBehavior: at, SpeedBehavior: nt, StaticSpeedBehavior: ht }; class lt extends n.Container {
		constructor () {
			super(...arguments), this._firstChild = null, this._lastChild = null, this._childCount = 0;
		} get firstChild () {
			return this._firstChild;
		} get lastChild () {
			return this._lastChild;
		} get childCount () {
			return this._childCount;
		}addChild (...t) {
			if (t.length > 1) for (let e = 0; e < t.length; e++) this.addChild(t[e]); else {
				const e = t[0]; e.parent && e.parent.removeChild(e), e.parent = this, this.sortDirty = !0, e.transform._parentID = -1, this._lastChild ? (this._lastChild.nextChild = e, e.prevChild = this._lastChild, this._lastChild = e) : this._firstChild = this._lastChild = e, ++this._childCount, this._boundsID++, this.onChildrenChange(), this.emit('childAdded', e, this, this._childCount), e.emit('added', this);
			} return t[0];
		}addChildAt (t, e) {
			if (e < 0 || e > this._childCount) throw new Error(`addChildAt: The index ${e} supplied is out of bounds ${this._childCount}`); t.parent && t.parent.removeChild(t), t.parent = this, this.sortDirty = !0, t.transform._parentID = -1; const i = t; if (this._firstChild) {
				if (e === 0) this._firstChild.prevChild = i, i.nextChild = this._firstChild, this._firstChild = i; else if (e === this._childCount) this._lastChild.nextChild = i, i.prevChild = this._lastChild, this._lastChild = i; else {
					let t = 0, s = this._firstChild; for (;t < e;)s = s.nextChild, ++t; s.prevChild.nextChild = i, i.prevChild = s.prevChild, i.nextChild = s, s.prevChild = i;
				}
			} else this._firstChild = this._lastChild = i; return ++this._childCount, this._boundsID++, this.onChildrenChange(e), t.emit('added', this), this.emit('childAdded', t, this, e), t;
		}addChildBelow (t, e) {
			if (e.parent !== this) throw new Error('addChildBelow: The relative target must be a child of this parent'); return t.parent && t.parent.removeChild(t), t.parent = this, this.sortDirty = !0, t.transform._parentID = -1, e.prevChild.nextChild = t, t.prevChild = e.prevChild, t.nextChild = e, e.prevChild = t, this._firstChild === e && (this._firstChild = t), ++this._childCount, this._boundsID++, this.onChildrenChange(), this.emit('childAdded', t, this, this._childCount), t.emit('added', this), t;
		}addChildAbove (t, e) {
			if (e.parent !== this) throw new Error('addChildBelow: The relative target must be a child of this parent'); return t.parent && t.parent.removeChild(t), t.parent = this, this.sortDirty = !0, t.transform._parentID = -1, e.nextChild.prevChild = t, t.nextChild = e.nextChild, t.prevChild = e, e.nextChild = t, this._lastChild === e && (this._lastChild = t), ++this._childCount, this._boundsID++, this.onChildrenChange(), this.emit('childAdded', t, this, this._childCount), t.emit('added', this), t;
		}swapChildren (t, e) {
			if (t === e || t.parent !== this || e.parent !== this) return; const { prevChild: i, nextChild: s } = t; t.prevChild = e.prevChild, t.nextChild = e.nextChild, e.prevChild = i, e.nextChild = s, this._firstChild === t ? this._firstChild = e : this._firstChild === e && (this._firstChild = t), this._lastChild === t ? this._lastChild = e : this._lastChild === e && (this._lastChild = t), this.onChildrenChange();
		}getChildIndex (t) {
			let e = 0, i = this._firstChild; for (;i && i !== t;)i = i.nextChild, ++e; if (!i) throw new Error('The supplied DisplayObject must be a child of the caller'); return e;
		}setChildIndex (t, e) {
			if (e < 0 || e >= this._childCount) throw new Error(`The index ${e} supplied is out of bounds ${this._childCount}`); if (t.parent !== this) throw new Error('The supplied DisplayObject must be a child of the caller'); if (t.nextChild && (t.nextChild.prevChild = t.prevChild), t.prevChild && (t.prevChild.nextChild = t.nextChild), this._firstChild === t && (this._firstChild = t.nextChild), this._lastChild === t && (this._lastChild = t.prevChild), t.nextChild = null, t.prevChild = null, this._firstChild) {
				if (e === 0) this._firstChild.prevChild = t, t.nextChild = this._firstChild, this._firstChild = t; else if (e === this._childCount) this._lastChild.nextChild = t, t.prevChild = this._lastChild, this._lastChild = t; else {
					let i = 0, s = this._firstChild; for (;i < e;)s = s.nextChild, ++i; s.prevChild.nextChild = t, t.prevChild = s.prevChild, t.nextChild = s, s.prevChild = t;
				}
			} else this._firstChild = this._lastChild = t; this.onChildrenChange(e);
		}removeChild (...t) {
			if (t.length > 1) for (let e = 0; e < t.length; e++) this.removeChild(t[e]); else {
				const e = t[0]; if (e.parent !== this) return null; e.parent = null, e.transform._parentID = -1, e.nextChild && (e.nextChild.prevChild = e.prevChild), e.prevChild && (e.prevChild.nextChild = e.nextChild), this._firstChild === e && (this._firstChild = e.nextChild), this._lastChild === e && (this._lastChild = e.prevChild), e.nextChild = null, e.prevChild = null, --this._childCount, this._boundsID++, this.onChildrenChange(), e.emit('removed', this), this.emit('childRemoved', e, this);
			} return t[0];
		}getChildAt (t) {
			if (t < 0 || t >= this._childCount) throw new Error(`getChildAt: Index (${t}) does not exist.`); if (t === 0) return this._firstChild; if (t === this._childCount) return this._lastChild; let e = 0, i = this._firstChild; for (;e < t;)i = i.nextChild, ++e; return i;
		}removeChildAt (t) {
			const e = this.getChildAt(t); return e.parent = null, e.transform._parentID = -1, e.nextChild && (e.nextChild.prevChild = e.prevChild), e.prevChild && (e.prevChild.nextChild = e.nextChild), this._firstChild === e && (this._firstChild = e.nextChild), this._lastChild === e && (this._lastChild = e.prevChild), e.nextChild = null, e.prevChild = null, --this._childCount, this._boundsID++, this.onChildrenChange(t), e.emit('removed', this), this.emit('childRemoved', e, this, t), e;
		}removeChildren (t = 0, e = this._childCount) {
			const i = t; e === 0 && this._childCount > 0 && (e = this._childCount); const s = e, r = s - i; if (r > 0 && r <= s) {
				const e = []; let r = this._firstChild; for (let t = 0; t <= s && r; ++t, r = r.nextChild)t >= i && e.push(r); const a = e[0].prevChild, n = e[e.length - 1].nextChild; n ? n.prevChild = a : this._lastChild = a, a ? a.nextChild = n : this._firstChild = n; for (let t = 0; t < e.length; ++t)e[t].parent = null, e[t].transform && (e[t].transform._parentID = -1), e[t].nextChild = null, e[t].prevChild = null; this._boundsID++, this.onChildrenChange(t); for (let t = 0; t < e.length; ++t)e[t].emit('removed', this), this.emit('childRemoved', e[t], this, t); return e;
			} if (r === 0 && this._childCount === 0) return []; throw new RangeError('removeChildren: numeric values are outside the acceptable range.');
		}updateTransform () {
			let t, e; for (this._boundsID++, this.transform.updateTransform(this.parent.transform), this.worldAlpha = this.alpha * this.parent.worldAlpha, t = this._firstChild; t; t = e)e = t.nextChild, t.visible && t.updateTransform();
		}calculateBounds () {
			let t, e; for (this._bounds.clear(), this._calculateBounds(), t = this._firstChild; t; t = e) {
				if (e = t.nextChild, t.visible && t.renderable) {
					if (t.calculateBounds(), t._mask) {
						const e = t._mask.maskObject || t._mask; e.calculateBounds(), this._bounds.addBoundsMask(t._bounds, e._bounds);
					} else t.filterArea ? this._bounds.addBoundsArea(t._bounds, t.filterArea) : this._bounds.addBounds(t._bounds);
				}
			} this._bounds.updateID = this._boundsID;
		}getLocalBounds (t, e = !1) {
			const i = n.DisplayObject.prototype.getLocalBounds.call(this, t); if (!e) {
				let t, e; for (t = this._firstChild; t; t = e)e = t.nextChild, t.visible && t.updateTransform();
			} return i;
		}render (t) {
			if (this.visible && !(this.worldAlpha <= 0) && this.renderable) {
				if (this._mask || this.filters && this.filters.length) this.renderAdvanced(t); else {
					let e, i; for (this._render(t), e = this._firstChild; e; e = i)i = e.nextChild, e.render(t);
				}
			}
		}renderAdvanced (t) {
			t.batch.flush(); const e = this.filters, i = this._mask; if (e) {
				this._enabledFilters || (this._enabledFilters = []), this._enabledFilters.length = 0; for (let t = 0; t < e.length; t++)e[t].enabled && this._enabledFilters.push(e[t]); this._enabledFilters.length && t.filter.push(this, this._enabledFilters);
			}let s, r; for (i && t.mask.push(this, this._mask), this._render(t), s = this._firstChild; s; s = r)r = s.nextChild, s.render(t); t.batch.flush(), i && t.mask.pop(this), e && this._enabledFilters && this._enabledFilters.length && t.filter.pop();
		}renderCanvas (t) {
			if (!this.visible || this.worldAlpha <= 0 || !this.renderable) return; let e, i; for (this._mask && t.maskManager.pushMask(this._mask), this._renderCanvas(t), e = this._firstChild; e; e = i)i = e.nextChild, e.renderCanvas(t); this._mask && t.maskManager.popMask(t);
		}
	}b.registerBehavior(E), b.registerBehavior(O), b.registerBehavior(N), b.registerBehavior(q), b.registerBehavior(W), b.registerBehavior(X), b.registerBehavior($), b.registerBehavior(G), b.registerBehavior(j), b.registerBehavior(V), b.registerBehavior(H), b.registerBehavior(J), b.registerBehavior(K), b.registerBehavior(Z), b.registerBehavior(tt), b.registerBehavior(et), b.registerBehavior(it), b.registerBehavior(st), b.registerBehavior(rt), b.registerBehavior(at), b.registerBehavior(nt), b.registerBehavior(ht), t.Emitter = b, t.LinkedListContainer = lt, t.Particle = y, t.ParticleUtils = _, t.PropertyList = F, t.PropertyNode = h, t.behaviors = ot, t.upgradeConfig = function (t, e) {
		let i, s, r, a, n, h, o, l, d, c, p, u, m, f, v, g, x, C, _, y, P; if ('behaviors' in t) return t; const w = { lifetime: t.lifetime, ease: t.ease, particlesPerWave: t.particlesPerWave, frequency: t.frequency, spawnChance: t.spawnChance, emitterLifetime: t.emitterLifetime, maxParticles: t.maxParticles, addAtBack: t.addAtBack, pos: t.pos, emit: t.emit, autoUpdate: t.autoUpdate, behaviors: [] }; if (t.alpha) {
			if ('start' in t.alpha) {
				if (t.alpha.start === t.alpha.end)t.alpha.start !== 1 && w.behaviors.push({ type: 'alphaStatic', config: { alpha: t.alpha.start } }); else {
					const e = { list: [{ time: 0, value: t.alpha.start }, { time: 1, value: t.alpha.end }] }; w.behaviors.push({ type: 'alpha', config: { alpha: e } });
				}
			} else t.alpha.list.length === 1 ? t.alpha.list[0].value !== 1 && w.behaviors.push({ type: 'alphaStatic', config: { alpha: t.alpha.list[0].value } }) : w.behaviors.push({ type: 'alpha', config: { alpha: t.alpha } });
		} if (t.acceleration && (t.acceleration.x || t.acceleration.y)) {
			let e, r; 'start' in t.speed ? (e = t.speed.start * ((i = t.speed.minimumSpeedMultiplier) !== null && void 0 !== i ? i : 1), r = t.speed.start) : (e = t.speed.list[0].value * ((s = t.minimumSpeedMultiplier) !== null && void 0 !== s ? s : 1), r = t.speed.list[0].value), w.behaviors.push({ type: 'moveAcceleration', config: { accel: t.acceleration, minStart: e, maxStart: r, rotate: !t.noRotation, maxSpeed: t.maxSpeed } });
		} else if ((r = t.extraData) === null || void 0 === r ? void 0 : r.path) {
			let e, i; 'start' in t.speed ? (i = (a = t.speed.minimumSpeedMultiplier) !== null && void 0 !== a ? a : 1, e = t.speed.start === t.speed.end ? { list: [{ time: 0, value: t.speed.start }] } : { list: [{ time: 0, value: t.speed.start }, { time: 1, value: t.speed.end }] }) : (e = t.speed, i = (n = t.minimumSpeedMultiplier) !== null && void 0 !== n ? n : 1), w.behaviors.push({ type: 'movePath', config: { path: t.extraData.path, speed: e, minMult: i } });
		} else if (t.speed) {
			if ('start' in t.speed) {
				if (t.speed.start === t.speed.end)w.behaviors.push({ type: 'moveSpeedStatic', config: { min: t.speed.start * ((h = t.speed.minimumSpeedMultiplier) !== null && void 0 !== h ? h : 1), max: t.speed.start } }); else {
					const e = { list: [{ time: 0, value: t.speed.start }, { time: 1, value: t.speed.end }] }; w.behaviors.push({ type: 'moveSpeed', config: { speed: e, minMult: t.speed.minimumSpeedMultiplier } });
				}
			} else t.speed.list.length === 1 ? w.behaviors.push({ type: 'moveSpeedStatic', config: { min: t.speed.list[0].value * ((o = t.minimumSpeedMultiplier) !== null && void 0 !== o ? o : 1), max: t.speed.list[0].value } }) : w.behaviors.push({ type: 'moveSpeed', config: { speed: t.speed, minMult: (l = t.minimumSpeedMultiplier) !== null && void 0 !== l ? l : 1 } });
		} if (t.scale) {
			if ('start' in t.scale) {
				const e = (d = t.scale.minimumScaleMultiplier) !== null && void 0 !== d ? d : 1; if (t.scale.start === t.scale.end)w.behaviors.push({ type: 'scaleStatic', config: { min: t.scale.start * e, max: t.scale.start } }); else {
					const i = { list: [{ time: 0, value: t.scale.start }, { time: 1, value: t.scale.end }] }; w.behaviors.push({ type: 'scale', config: { scale: i, minMult: e } });
				}
			} else if (t.scale.list.length === 1) {
				const e = (c = t.minimumScaleMultiplier) !== null && void 0 !== c ? c : 1, i = t.scale.list[0].value; w.behaviors.push({ type: 'scaleStatic', config: { min: i * e, max: i } });
			} else w.behaviors.push({ type: 'scale', config: { scale: t.scale, minMult: (p = t.minimumScaleMultiplier) !== null && void 0 !== p ? p : 1 } });
		} if (t.color) {
			if ('start' in t.color) {
				if (t.color.start === t.color.end)t.color.start !== 'ffffff' && w.behaviors.push({ type: 'colorStatic', config: { color: t.color.start } }); else {
					const e = { list: [{ time: 0, value: t.color.start }, { time: 1, value: t.color.end }] }; w.behaviors.push({ type: 'color', config: { color: e } });
				}
			} else t.color.list.length === 1 ? t.color.list[0].value !== 'ffffff' && w.behaviors.push({ type: 'colorStatic', config: { color: t.color.list[0].value } }) : w.behaviors.push({ type: 'color', config: { color: t.color } });
		} if (t.rotationAcceleration || ((u = t.rotationSpeed) === null || void 0 === u ? void 0 : u.min) || ((m = t.rotationSpeed) === null || void 0 === m ? void 0 : m.max) ? w.behaviors.push({ type: 'rotation', config: { accel: t.rotationAcceleration || 0, minSpeed: ((f = t.rotationSpeed) === null || void 0 === f ? void 0 : f.min) || 0, maxSpeed: ((v = t.rotationSpeed) === null || void 0 === v ? void 0 : v.max) || 0, minStart: ((g = t.startRotation) === null || void 0 === g ? void 0 : g.min) || 0, maxStart: ((x = t.startRotation) === null || void 0 === x ? void 0 : x.max) || 0 } }) : (((C = t.startRotation) === null || void 0 === C ? void 0 : C.min) || ((_ = t.startRotation) === null || void 0 === _ ? void 0 : _.max)) && w.behaviors.push({ type: 'rotationStatic', config: { min: ((y = t.startRotation) === null || void 0 === y ? void 0 : y.min) || 0, max: ((P = t.startRotation) === null || void 0 === P ? void 0 : P.max) || 0 } }), t.noRotation && w.behaviors.push({ type: 'noRotation', config: {} }), t.blendMode && t.blendMode !== 'normal' && w.behaviors.push({ type: 'blendMode', config: { blendMode: t.blendMode } }), Array.isArray(e) && typeof e[0] !== 'string' && 'framerate' in e[0]) {
			for (let t = 0; t < e.length; ++t)e[t].framerate === 'matchLife' && (e[t].framerate = -1); w.behaviors.push({ type: 'animatedRandom', config: { anims: e } });
		} else typeof e !== 'string' && 'framerate' in e ? (e.framerate === 'matchLife' && (e.framerate = -1), w.behaviors.push({ type: 'animatedSingle', config: { anim: e } })) : t.orderedArt && Array.isArray(e) ? w.behaviors.push({ type: 'textureOrdered', config: { textures: e } }) : Array.isArray(e) ? w.behaviors.push({ type: 'textureRandom', config: { textures: e } }) : w.behaviors.push({ type: 'textureSingle', config: { texture: e } }); if (t.spawnType === 'burst')w.behaviors.push({ type: 'spawnBurst', config: { start: t.angleStart || 0, spacing: t.particleSpacing, distance: 0 } }); else if (t.spawnType === 'point')w.behaviors.push({ type: 'spawnPoint', config: {} }); else {
			let e; t.spawnType === 'ring' ? e = { type: 'torus', data: { x: t.spawnCircle.x, y: t.spawnCircle.y, radius: t.spawnCircle.r, innerRadius: t.spawnCircle.minR, affectRotation: !0 } } : t.spawnType === 'circle' ? e = { type: 'torus', data: { x: t.spawnCircle.x, y: t.spawnCircle.y, radius: t.spawnCircle.r, innerRadius: 0, affectRotation: !1 } } : t.spawnType === 'rect' ? e = { type: 'rect', data: t.spawnRect } : t.spawnType === 'polygonalChain' && (e = { type: 'polygonalChain', data: t.spawnPolygon }), e && w.behaviors.push({ type: 'spawnShape', config: e });
		} return w;
	};
})(this.PIXI.particles = this.PIXI.particles || {}, PIXI, PIXI, PIXI, PIXI, PIXI, PIXI);
