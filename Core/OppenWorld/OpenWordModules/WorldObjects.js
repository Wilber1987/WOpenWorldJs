//@ts-check
// --------------------------------------------------
// WorldObjects: objetos con HUELLA (colisión) separada de lo VISUAL.
//
//  - footprint  = (x, y, w, h) en tiles -> lo que bloquea el movimiento (la base del tronco)
//  - visual     = rectángulo de dibujo en tiles, anclado al centro-abajo de la huella
//                 (la copa puede ser 5x5 aunque la base sea 2x2) y NO bloquea
//  - sortY      = y + h (la base). Quien tenga los pies "más arriba" (y menor) queda
//                 detrás del objeto, igual que con un NPC.
// --------------------------------------------------
import { BlockObject } from "./Models.js";
import { TILE_SIZE } from "../OpenWorldEngineView.js";
import { ProceduralTextures, ProceduralSprites } from "./ProceduralTextures.js";

export class WorldObject extends BlockObject {
    /**
     * @param {number} x huella: tile X
     * @param {number} y huella: tile Y (esquina superior de la huella)
     * @param {number} w huella: ancho en tiles
     * @param {number} h huella: alto en tiles
     * @param {any} [opts]
     * @param {boolean} [opts.blocks=true]  si la huella bloquea el movimiento
     * @param {'ground'|'sorted'} [opts.layer='sorted']  ground = bajo todo, sin y-sort
     * @param {HTMLCanvasElement|HTMLImageElement|string} [opts.image] sprite (canvas procedural o PNG)
     * @param {{w:number,h:number,offsetX?:number,offsetY?:number}} [opts.visual] tamaño visual en tiles
     * @param {{rx:number,ry:number,offsetY?:number,alpha?:number}} [opts.shadow] sombra en el suelo (tiles)
     * @param {number|null} [opts.fadeOnBehind=0.45] alpha cuando un personaje queda detrás (null = desactivar)
     * @param {(ctx:CanvasRenderingContext2D, r:{x:number,y:number,w:number,h:number}) => void} [opts.paint] dibujo custom
     * @param {string} [opts.minimapColor]
     */
    constructor(x, y, w, h, opts = {}) {
        super(x, y, w, h, { ...opts, color: opts.minimapColor ?? opts.color });
        this.blocksMovement = opts.blocks ?? true;
        this.layer = opts.layer ?? 'sorted';
        this.sortY = y + h;
        this.visual = { w, h, offsetX: 0, offsetY: 0, ...(opts.visual ?? {}) };
        this.shadow = opts.shadow ?? null;
        this.fadeOnBehind = opts.fadeOnBehind === undefined ? 0.45 : opts.fadeOnBehind;
        this.paint = opts.paint ?? null;
        this._alpha = 1;

        /** @type {HTMLCanvasElement|HTMLImageElement|null} */
        this.image = null;
        if (typeof opts.image === 'string') {
            const img = new Image(); img.src = opts.image; this.image = img;
        } else {
            this.image = opts.image ?? null;
        }
    }

    /** Solo la huella colisiona; el resto del dibujo (copa) es atravesable. */
    occupies(tx, ty) {
        return this.blocksMovement && super.occupies(tx, ty);
    }

    /** Pasada 1 (antes del y-sort): sombras en el suelo */
    drawGround(ctx, engine) {
        if (!this.shadow) return;
        const cam = engine.cam, k = TILE_SIZE * cam.zoom;
        const cx = (this.x + this.w / 2 - cam.x) * k + cam.screenW / 2;
        const cy = (this.y + this.h + (this.shadow.offsetY ?? -0.3) - cam.y) * k + cam.screenH / 2;
        ctx.save();
        ctx.fillStyle = `rgba(0,0,0,${this.shadow.alpha ?? 0.22})`;
        ctx.beginPath();
        ctx.ellipse(cx, cy, this.shadow.rx * k, this.shadow.ry * k, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    /** Pasada 2 (y-sorted): el objeto en sí */
    render(ctx, engine, scale = 1) {
        const cam = engine.cam, v = this.visual;
        const u = TILE_SIZE * cam.zoom * scale;                 // px por tile (con perspectiva)
        const k = TILE_SIZE * cam.zoom;                         // px por tile (posición)
        const bx = (this.x + this.w / 2 - cam.x) * k + cam.screenW / 2; // centro de la base
        const by = (this.y + this.h - cam.y) * k + cam.screenH / 2;     // borde inferior de la base
        const dw = v.w * u, dh = v.h * u;
        const left = bx - dw / 2 + (v.offsetX ?? 0) * u;
        const top = by - dh + (v.offsetY ?? 0) * u;
        if (left > cam.screenW || left + dw < 0 || top > cam.screenH || top + dh < 0) return; // culling

        // Transparencia suave si un personaje está "dentro" de la copa, por detrás de la base
        if (this.fadeOnBehind !== null) {
            const p = engine.SelectedCharacter;
            const vx0 = this.x + this.w / 2 - v.w / 2 + (v.offsetX ?? 0);
            const vy1 = this.y + this.h + (v.offsetY ?? 0);
            const hidden = p && p.y < this.y + this.h && p.x >= vx0 && p.x <= vx0 + v.w
                && p.y >= vy1 - v.h && p.y <= vy1;
            const target = hidden ? this.fadeOnBehind : 1;
            this._alpha += (target - this._alpha) * 0.15;
        }

        ctx.save();
        ctx.globalAlpha = this._alpha;
        ctx.imageSmoothingEnabled = false; // pixel art nítido al hacer zoom
        const img = this.image;
        if (img && (img instanceof HTMLCanvasElement || (img.complete && img.naturalWidth > 0))) {
            ctx.drawImage(img, left, top, dw, dh);
        } else if (this.paint) {
            this.paint(ctx, { x: left, y: top, w: dw, h: dh });
        } else if (this.color) {
            ctx.fillStyle = this.color;
            ctx.fillRect(left, top, dw, dh);
        }
        ctx.restore();
    }
}

/** Parche de suelo texturizado (sin assets). No bloquea por defecto. */
export class TerrainPatch extends WorldObject {
    /**
     * @param {number} x @param {number} y @param {number} w @param {number} h
     * @param {string} texture grass | dirt | sand | water | stone | brick | wood
     * @param {{blocks?:boolean, seed?:number}} [opts] blocks:true sirve para agua/paredes
     */
    constructor(x, y, w, h, texture, opts = {}) {
        super(x, y, w, h, {
            blocks: opts.blocks ?? false, layer: 'ground', fadeOnBehind: null,
            minimapColor: ProceduralTextures.minimapColor(texture),
        });
        this.texture = texture;
        this.seed = opts.seed ?? 1;
    }
    drawGround(ctx, engine) {
        const cam = engine.cam, k = TILE_SIZE * cam.zoom;
        const left = Math.floor((this.x - cam.x) * k + cam.screenW / 2);
        const top = Math.floor((this.y - cam.y) * k + cam.screenH / 2);
        const right = Math.ceil((this.x + this.w - cam.x) * k + cam.screenW / 2);
        const bottom = Math.ceil((this.y + this.h - cam.y) * k + cam.screenH / 2);
        if (left > cam.screenW || right < 0 || top > cam.screenH || bottom < 0) return;

        const pat = ProceduralTextures.pattern(ctx, this.texture, this.seed);
        if (!pat) return;
        const s = k / 32; // 1 tile = 32 px de textura
        // El patrón se ancla al mundo (tile 0,0) => parches vecinos empalman sin costura
        pat.setTransform(new DOMMatrix().translate(-cam.x * k + cam.screenW / 2, -cam.y * k + cam.screenH / 2).scale(s));
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.fillStyle = pat;
        ctx.fillRect(left, top, right - left, bottom - top);
        ctx.restore();
    }
    render() { /* todo se pinta en drawGround */ }
}

// --------------------------------------------------
// Fábricas listas para usar
// --------------------------------------------------

/**
 * Árbol: base 2x2 que bloquea, copa 5x5 (o lo que pidas) que se atraviesa por detrás.
 * @param {number} x @param {number} y esquina superior de la base
 * @param {{seed?:number, baseW?:number, baseH?:number, crownW?:number, crownH?:number, leaf?:string, bark?:string}} [o]
 */
export function createTree(x, y, o = {}) {
    const { seed = x * 31 + y * 17, baseW = 2, baseH = 2, crownW = 5, crownH = 6, leaf, bark } = o;
    return new WorldObject(x, y, baseW, baseH, {
        image: ProceduralSprites.tree({ seed, tilesW: crownW, tilesH: crownH, leaf, bark }),
        visual: { w: crownW, h: crownH, offsetY: 0.2 },
        shadow: { rx: crownW * 0.36, ry: crownW * 0.14, offsetY: -0.4 },
        minimapColor: '#2f6f2a',
    });
}

/** Arbusto 1x1 que bloquea. */
export function createBush(x, y, o = {}) {
    return new WorldObject(x, y, 1, 1, {
        image: ProceduralSprites.bush({ seed: o.seed ?? x * 13 + y * 7 }),
        visual: { w: 2, h: 1.5, offsetY: 0.2 }, fadeOnBehind: null,
        shadow: { rx: 0.8, ry: 0.25, offsetY: -0.1, alpha: 0.18 }, minimapColor: '#3f9a3a',
    });
}

/** Roca 1x1 que bloquea. */
export function createRock(x, y, o = {}) {
    return new WorldObject(x, y, 1, 1, {
        image: ProceduralSprites.rock({ seed: o.seed ?? x * 5 + y * 11 }),
        visual: { w: 2, h: 1.5, offsetY: 0.2 }, fadeOnBehind: null,
        shadow: { rx: 0.8, ry: 0.22, offsetY: -0.1, alpha: 0.2 }, minimapColor: '#8c8f96',
    });
}

/** Suelo texturizado. */
export function createGround(x, y, w, h, texture, opts) {
    return new TerrainPatch(x, y, w, h, texture, opts);
}
