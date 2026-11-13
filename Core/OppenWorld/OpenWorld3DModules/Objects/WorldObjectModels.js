
// ============================================================
// FACTOR DE ESCALA GLOBAL: metros del modelo → tiles del mundo
// Personaje mide 3 tiles de alto ≈ 1.8 m → 1 tile ≈ 0.6 m
// Cambia este valor si tu jugador tiene otra escala.
// ============================================================
export const METERS_TO_TILES = 1 / 0.6; // ≈ 1.6667

export class WorldObject {
    constructor(x, y, w, h, options = {}) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.blocksMovement = options.blocks ?? true;
        this.rotation = options.rotation ?? 0;

        this.visual = null;
        this.rendered = false;
    }

    render(engine) {
        throw new Error(
            `${this.constructor.name} debe implementar render(engine)`
        );
    }

    /**
    * Elimina la representación visual.
    */
    destroy() {
        if (this._smokeRAF) cancelAnimationFrame(this._smokeRAF);
        if (this._smoke) {
            this._smoke.tex.dispose();
            this._smoke = null;
        }

        if (this.visual) {
            this.visual.removeFromParent();
            this.visual.traverse(child => {
                if (child.isMesh || child.isSprite) {
                    child.geometry?.dispose();
                    const mats = Array.isArray(child.material) ? child.material : [child.material];
                    mats.forEach(m => {
                        if (m.map) m.map.dispose();
                        m.dispose();
                    });
                }
            });
            this.visual = null;
        }

        this.rendered = false;
        this.engine = null;
    }
    AsingProps(visual, engine, isRendered) {
        this.visual = visual;
        this.engine = engine;
        this.rendered = isRendered;
    }
    occupies(tx, ty) {
        if (!this.blocksMovement) return false;

        const tilesWidth = Math.ceil(this.w);
        const tilesHeight = Math.ceil(this.h);

        const occupiedMinX = Math.floor(this.x);
        const occupiedMaxX = occupiedMinX + tilesWidth - 1;

        const occupiedMinY = Math.floor(this.y);
        const occupiedMaxY = occupiedMinY + tilesHeight - 1;

        return (
            tx >= occupiedMinX &&
            tx <= occupiedMaxX &&
            ty >= occupiedMinY &&
            ty <= occupiedMaxY
        );
    }
}

// ============================================================
// BASE COMÚN
// ============================================================
export class ModernProp extends WorldObject {
    constructor(x, y, w, h, options = {}) {
        const userScale = options.scale ?? 1;
        const s = userScale * METERS_TO_TILES;

        // Footprint final EN TILES para colisión
        const worldW = w * s;
        const worldH = h * s;

        const rotation = options.rotation ?? 0;
        const q = ((Math.round(rotation / (Math.PI / 2)) % 4) + 4) % 4;
        const swap = q % 2 === 1;

        super(x, y, swap ? worldH : worldW, swap ? worldW : worldH, options);

        this.scale = s;          // factor metros → tiles
        this.baseW = w;          // metros originales (coords locales del grupo)
        this.baseH = h;
        this.rotQuadrant = q;
        this.seed = options.seed ?? Math.floor(Math.random() * 1e9);
        this.colors = options.colors ?? {};

        // ============ INTERACCIÓN UNIVERSAL ============
        this.action = options.action ?? null;
        this.automaticTrigger = options.automaticTrigger ?? false;
        this.interactionRadius = (options.interactionRadius ?? 1.6) * s;
        this.interactionKey = options.interactionKey ?? "E";
        this.interactionLabel = options.interactionLabel ?? null;
        this.interactionCooldown = options.interactionCooldown ?? 1.5;
        this.showIndicator = options.showIndicator ?? (this.action != null);
        this.indicatorHeight = options.indicatorHeight ?? 1.4;

        this.isNear = false;
        this.interactionDistance = Infinity;
        this._armed = false;       // se arma cuando el jugador está fuera del radio
        this._lastTrigger = -999;
        this._indicator = null;

    }

    get centerX() { return this.x + this.w / 2; }
    get centerY() { return this.y + this.h / 2; }

    occupies(tx, ty) {
        if (!this.blocksMovement) return false;
        const theta = this.rotation ?? 0;
        // Coords locales (metros) — convertir de tile a metro dividiendo por scale
        const dx = (tx + 0.5 - this.centerX) / this.scale;
        const dy = (ty + 0.5 - this.centerY) / this.scale;
        const cos = Math.cos(theta), sin = Math.sin(theta);
        const lx = dx * cos - dy * sin;
        const lz = dx * sin + dy * cos;
        return Math.abs(lx) <= this.baseW / 2 + 1e-9
            && Math.abs(lz) <= this.baseH / 2 + 1e-9;
    }

    getInteractionAnchor() { return { x: this.centerX, z: this.centerY }; }

  
    getState() { return null; }

    _execute(source) {
        this.use?.();
        this.action?.(this, { type: source, state: this.getState() });
        return true;
    }

    interact() {
        if (!this.isNear || !this.action) return false;
        return this._execute("manual");
    }

    getInteractionHint() {
        return (this.isNear && this.action) ? (this.interactionLabel ?? this.name) : null;
    }

    _getPlayerPosition(engine) {
        const c = [
            engine.player?.position, engine.character?.position,
            engine.playerController?.position, engine.getPlayer?.()?.position,
            engine.player?.visual?.position, engine.character?.visual?.position
        ];
        return c.find(p => p && typeof p.x === "number") ?? null;
    }

    /** Distancia horizontal del jugador al borde de la huella (no al centro). */
    _distanceToFootprint(p) {
        const dx = Math.max(this.x - p.x, 0, p.x - (this.x + this.w));
        const dz = Math.max(this.y - p.z, 0, p.z - (this.y + this.h));
        return Math.hypot(dx, dz);
    }

    checkProximity(worldPos) {
        this.interactionDistance = this._distanceToFootprint(worldPos);
        this.isNear = this.interactionDistance <= this.interactionRadius;
        return this.isNear;
    }

    _getPlayerPosition(engine) {
        const p = engine.getPlayerWorldPosition?.();
        if (p) return p;
        const c = [
            engine.player?.position, engine.character?.position,
            engine.playerController?.position, engine.getPlayer?.()?.position
        ];
        return c.find(q => q && typeof q.x === "number") ?? null;
    }

    /** Devuelve una Promise para que el motor mantenga el candado mientras dura la acción. */
    _execute(source) {
        this.use?.();
        return Promise.resolve(
            this.action?.(this, { type: source, state: this.getState() })
        ).then(() => true);
    }

    update(engine, delta = 0.016) {
        const p = engine ? this._getPlayerPosition(engine) : null;
        if (p) {
            this.checkProximity(p);

            if (!this.isNear) {
                this._armed = true;                      // salió del radio: se rearma
            } else if (
                this.automaticTrigger && this.action && this._armed &&
                !engine.isInteracting
            ) {
                const now = performance.now() / 1e3;
                if (now - this._lastTrigger > this.interactionCooldown) {
                    this._armed = false;                 // no vuelve a disparar hasta salir
                    this._lastTrigger = now;
                    engine.runInteraction(this, () => this._execute("auto"));
                }
            }
        }
        this._updateIndicator();
        this.animate?.(delta, engine);
    }

    _updateIndicator() {
        if (!this.action || !this.showIndicator || !this.visual) return;
        if (!this._indicator) {
            const sp = new (this._THREE()).Sprite(new (this._THREE()).SpriteMaterial({
                map: ModernProp._indicatorTex(this._THREE(), this.interactionKey),
                transparent: true, depthWrite: false, opacity: 0
            }));
            // El sprite se escala con el grupo (está dentro). Ajustamos su
            // escala local para que se vea bien en mundo (0.45 m / scale ≈ tile).
            sp.scale.set(0.45, 0.45, 1);
            sp.position.set(0, this.indicatorHeight, 0);
            sp.userData.baseY = this.indicatorHeight;
            sp.visible = false;
            this.visual.add(sp);
            this._indicator = sp;
        }
        this._indicator.visible = this.isNear;
        if (this.isNear) {
            const t = performance.now() / 1e3;
            this._indicator.material.opacity = 0.7 + Math.sin(t * 5) * 0.3;
            this._indicator.position.y = this._indicator.userData.baseY + Math.sin(t * 3) * 0.05;
        }
    }

    _THREE() { return this._threeRef; }

    /**
     * Tail unificado: escala el grupo, lo centra, lo añade a escena y
     * marca rendered. Sustituye el bloque final de CADA render().
     */
    _finishGroup(engine, group, prefix) {
        this._threeRef = engine.THREE;                // ← BUG FIX: era `his._threeRef`
        group.scale.setScalar(this.scale);            // ← aplica metros → tiles
        group.position.set(this.centerX, 0, this.centerY);
        group.rotation.y = this.rotation ?? 0;
        group.name = `${prefix}_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);
        this.AsingProps(group, engine, true);
        this._armed = false; // si el jugador aparece ya dentro del radio, no dispara
    }

    static _indicatorTex(THREE, key) {
        ModernProp._texCache ??= new Map();
        if (ModernProp._texCache.has(key)) return ModernProp._texCache.get(key);
        const c = document.createElement("canvas");
        c.width = c.height = 64;
        const ctx = c.getContext("2d");
        ctx.fillStyle = "rgba(10,10,14,0.85)";
        ctx.beginPath(); ctx.roundRect(6, 6, 52, 52, 12); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.9)"; ctx.lineWidth = 3; ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 32px sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(key, 32, 34);
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        ModernProp._texCache.set(key, t);
        return t;
    }

    _rng() {
        let a = this.seed >>> 0;
        return () => {
            a |= 0; a = (a + 0x6D2B79F5) | 0;
            let t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }
}


// ============================================================
// BASE COMÚN
// ============================================================
export class VillageObject extends WorldObject {
    constructor(x, y, w, h, options = {}) {
        const localW = w;
        const localH = h;

        const rotation = options.rotation ?? 0;
        const q = ((Math.round(rotation / (Math.PI / 2)) % 4) + 4) % 4;
        const swap = q % 2 === 1;

        super(x, y, swap ? localH : localW, swap ? localW : localH, options);

        this.localW = localW;
        this.localH = localH;
        this.rotQuadrant = q;

        this.seed = options.seed ?? Math.floor(Math.random() * 1e9);
        this.colors = options.colors ?? {};
    }

    get centerX() { return this.x + this.w / 2; }
    get centerY() { return this.y + this.h / 2; }

    occupies(tx, ty) {
        if (!this.blocksMovement) return false;

        const theta = this.rotation ?? 0;
        const dx = tx + 0.5 - this.centerX;
        const dy = ty + 0.5 - this.centerY;

        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        const lx = dx * cos - dy * sin;
        const lz = dx * sin + dy * cos;

        return (
            Math.abs(lx) <= this.localW / 2 + 1e-9 &&
            Math.abs(lz) <= this.localH / 2 + 1e-9
        );
    }

    _rng() {
        let a = this.seed >>> 0;
        return () => {
            a |= 0; a = (a + 0x6D2B79F5) | 0;
            let t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }
}
