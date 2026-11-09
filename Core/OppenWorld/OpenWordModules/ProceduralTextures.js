//@ts-check
// --------------------------------------------------
// ProceduralTextures: texturas y sprites generados por código (sin assets).
// - Textures: tiles de 32x32 que repiten sin costuras (para suelos).
// - Sprites: imágenes grandes (árbol, arbusto, roca) para WorldObject.
// Todo se cachea en canvases; se genera una sola vez por (nombre, seed).
// --------------------------------------------------

export const TEX = 32; // px por tile en las texturas generadas

/** PRNG determinista (mulberry32) */
export function rng(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** Aclara (amt>0) u oscurece (amt<0) un color #rrggbb */
export function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const f = (v) => Math.max(0, Math.min(255, Math.round(v + 255 * amt)));
    const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
    return `rgb(${r},${g},${b})`;
}

/** @returns {[HTMLCanvasElement, CanvasRenderingContext2D]} */
export function makeCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = /** @type {CanvasRenderingContext2D} */ (c.getContext('2d'));
    ctx.imageSmoothingEnabled = false;
    return [c, ctx];
}

/** Disco "pixelado" (sin antialias) */
export function disc(ctx, cx, cy, r, color) {
    ctx.fillStyle = color;
    for (let y = -r; y <= r; y++) {
        const half = Math.floor(Math.sqrt(r * r - y * y));
        ctx.fillRect(Math.round(cx - half), Math.round(cy + y), half * 2 + 1, 1);
    }
}

// ==================================================
// TEXTURAS DE SUELO (tileables: todos los píxeles hacen wrap)
// ==================================================
/**
 * Cada generador recibe (put, rand, S) donde put(x,y,color) escribe un píxel con wrap.
 * @type {Object<string, {minimap:string, paint:(put:Function, rand:()=>number, S:number)=>void}>}
 */
const TEXTURES = {
    grass: {
        minimap: '#4c9a3a',
        paint(put, rand, S) {
            const pal = ['#3f8a30', '#4c9a3a', '#4c9a3a', '#56a642', '#63b24e'];
            for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) put(x, y, pal[Math.floor(rand() * pal.length)]);
            for (let i = 0; i < 38; i++) { // briznas
                const x = Math.floor(rand() * S), y = Math.floor(rand() * S);
                put(x, y, '#7cc765'); put(x, y - 1, '#7cc765');
                if (rand() < 0.4) put(x + 1, y - 2, '#8fd776');
            }
            for (let i = 0; i < 6; i++) put(Math.floor(rand() * S), Math.floor(rand() * S), '#2f7326');
        }
    },
    dirt: {
        minimap: '#8a6a45',
        paint(put, rand, S) {
            const pal = ['#7d5f3d', '#8a6a45', '#8a6a45', '#977752', '#6f5335'];
            for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) put(x, y, pal[Math.floor(rand() * pal.length)]);
            for (let i = 0; i < 10; i++) { // piedritas
                const x = Math.floor(rand() * S), y = Math.floor(rand() * S);
                put(x, y, '#b09a7a'); put(x + 1, y, '#9a8564'); put(x, y + 1, '#5a432a');
            }
        }
    },
    sand: {
        minimap: '#dcc98a',
        paint(put, rand, S) {
            const pal = ['#d6c283', '#dcc98a', '#dcc98a', '#e6d59a', '#cdb877'];
            for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) put(x, y, pal[Math.floor(rand() * pal.length)]);
            for (let i = 0; i < 14; i++) { // ondas de arena
                const x = Math.floor(rand() * S), y = Math.floor(rand() * S);
                put(x, y, '#c4ae6c'); put(x + 1, y, '#c4ae6c'); put(x + 2, y + 1, '#c4ae6c');
            }
        }
    },
    water: {
        minimap: '#3b7bd0',
        paint(put, rand, S) {
            for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) put(x, y, rand() < 0.15 ? '#3a78cc' : '#3f84dc');
            for (let i = 0; i < 9; i++) { // reflejos horizontales
                const x = Math.floor(rand() * S), y = Math.floor(rand() * S), len = 3 + Math.floor(rand() * 5);
                for (let k = 0; k < len; k++) put(x + k, y, '#8fc3ff');
            }
        }
    },
    stone: {
        minimap: '#8c8f96',
        paint(put, rand, S) { bricks(put, rand, S, { bw: 16, bh: 8, mortar: '#4d5058', base: '#8c8f96', var: 0.07 }); }
    },
    brick: {
        minimap: '#a4523c',
        paint(put, rand, S) { bricks(put, rand, S, { bw: 16, bh: 8, mortar: '#d8cdbd', base: '#a4523c', var: 0.06 }); }
    },
    wood: {
        minimap: '#9a6b3c',
        paint(put, rand, S) { bricks(put, rand, S, { bw: 32, bh: 8, mortar: '#3e2a15', base: '#9a6b3c', var: 0.05, grain: true }); }
    },
};

function bricks(put, rand, S, o) {
    const rows = S / o.bh, cols = S / o.bw;
    for (let r = 0; r < rows; r++) {
        const off = (r % 2) * (o.bw / 2);
        for (let c = 0; c < cols + 1; c++) {
            const tone = (rand() - 0.5) * 2 * o.var;
            const color = shade(o.base, tone);
            const x0 = c * o.bw + off, y0 = r * o.bh;
            for (let y = 0; y < o.bh; y++) for (let x = 0; x < o.bw; x++) {
                const edge = x === 0 || y === 0;
                if (edge) put(x0 + x, y0 + y, o.mortar);
                else if (o.grain && rand() < 0.08) put(x0 + x, y0 + y, shade(o.base, -0.08));
                else put(x0 + x, y0 + y, color);
            }
        }
    }
}

// ---- helpers de dibujo pixelado reutilizables por los sprites ----
/** Línea gruesa hecha con discos (ramas, troncos curvos, patas) */
export function line(ctx, x0, y0, x1, y1, thick, color) {
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0)));
    ctx.fillStyle = color;
    const r = Math.max(0, Math.round(thick / 2));
    for (let i = 0; i <= n; i++) {
        const t = i / n, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t;
        if (r <= 0) ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
        else ctx.fillRect(Math.round(x - r), Math.round(y - r), r * 2 + 1, r * 2 + 1);
    }
}
/** Triángulo isósceles pixelado (punta arriba) */
export function tri(ctx, cx, top, bottom, halfW, color) {
    ctx.fillStyle = color;
    for (let y = top; y <= bottom; y++) {
        const hw = Math.round(halfW * (y - top) / Math.max(1, bottom - top));
        ctx.fillRect(Math.round(cx - hw), y, hw * 2 + 1, 1);
    }
}

function grassPaint(pal, bladeA, bladeB) {
    return (put, rand, S) => {
        for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) put(x, y, pal[Math.floor(rand() * pal.length)]);
        for (let i = 0; i < 38; i++) {
            const x = Math.floor(rand() * S), y = Math.floor(rand() * S);
            put(x, y, bladeA); put(x, y - 1, bladeA);
            if (rand() < 0.4) put(x + 1, y - 2, bladeB);
        }
    };
}

// ---- texturas adicionales ----
Object.assign(TEXTURES, {
    darkgrass: { minimap: '#2f7326', paint: grassPaint(['#2a6a22', '#2f7326', '#2f7326', '#38802d', '#43903a'], '#58a24a', '#6ab45a') },
    flowergrass: {
        minimap: '#4f9d3d',
        paint(put, rand, S) {
            grassPaint(['#3f8a30', '#4c9a3a', '#4c9a3a', '#56a642', '#63b24e'], '#7cc765', '#8fd776')(put, rand, S);
            const cols = ['#ffffff', '#ffd23f', '#ff6b9d', '#b388ff'];
            for (let i = 0; i < 7; i++) {
                const x = Math.floor(rand() * S), y = Math.floor(rand() * S), c = cols[Math.floor(rand() * cols.length)];
                put(x, y, c); put(x + 1, y, c); put(x, y + 1, '#2f7326');
            }
        }
    },
    snow: {
        minimap: '#eef3f8',
        paint(put, rand, S) {
            const pal = ['#e6edf5', '#eef3f8', '#eef3f8', '#f7fafc', '#dbe6f1'];
            for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) put(x, y, pal[Math.floor(rand() * pal.length)]);
            for (let i = 0; i < 10; i++) put(Math.floor(rand() * S), Math.floor(rand() * S), '#b8cfe6');
        }
    },
    ice: {
        minimap: '#b9dff2',
        paint(put, rand, S) {
            for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) put(x, y, rand() < 0.2 ? '#a9d6ee' : '#bfe3f4');
            for (let i = 0; i < 4; i++) { // grietas (cierran por wrap)
                let x = Math.floor(rand() * S), y = Math.floor(rand() * S);
                for (let k = 0; k < 8; k++) { put(x, y, '#f2fbff'); x += rand() < 0.5 ? 1 : 0; y += rand() < 0.5 ? 1 : -1; }
            }
        }
    },
    mud: {
        minimap: '#5b4630',
        paint(put, rand, S) {
            const pal = ['#53402c', '#5b4630', '#5b4630', '#654e36', '#4a3826'];
            for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) put(x, y, pal[Math.floor(rand() * pal.length)]);
            for (let i = 0; i < 6; i++) { const x = Math.floor(rand() * S), y = Math.floor(rand() * S); put(x, y, '#7a6446'); put(x + 1, y, '#7a6446'); }
        }
    },
    lava: {
        minimap: '#d9480f',
        paint(put, rand, S) {
            for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) put(x, y, rand() < 0.2 ? '#c2380a' : '#d9480f');
            for (let i = 0; i < 8; i++) {
                const x = Math.floor(rand() * S), y = Math.floor(rand() * S), len = 3 + Math.floor(rand() * 5);
                for (let k = 0; k < len; k++) put(x + k, y, '#ffb703');
            }
        }
    },
    cobble: { minimap: '#a39d90', paint(put, rand, S) { bricks(put, rand, S, { bw: 8, bh: 8, mortar: '#5b5750', base: '#a39d90', var: 0.09 }); } },
    tile: { minimap: '#d5d9de', paint(put, rand, S) { bricks(put, rand, S, { bw: 16, bh: 16, mortar: '#9aa0a8', base: '#d5d9de', var: 0.03 }); } },
    carpet: {
        minimap: '#8e2f3a',
        paint(put, rand, S) {
            for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) put(x, y, rand() < 0.25 ? '#832a35' : '#8e2f3a');
            for (let y = 0; y < S; y += 8) for (let x = 0; x < S; x += 8) { put(x + 4, y + 4, '#d9a441'); put(x + 3, y + 4, '#c4902f'); put(x + 5, y + 4, '#c4902f'); put(x + 4, y + 3, '#c4902f'); put(x + 4, y + 5, '#c4902f'); }
        }
    },
    farmland: {
        minimap: '#6b4a2b',
        paint(put, rand, S) {
            for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
                const furrow = (y % 8) < 3;
                const pal = furrow ? ['#4e3620', '#563c24'] : ['#7a5532', '#845d38', '#6f4d2d'];
                put(x, y, pal[Math.floor(rand() * pal.length)]);
            }
        }
    },
});

const texCache = new Map();
const patCache = new Map();

export const ProceduralTextures = {
    names: Object.keys(TEXTURES),

    /** Color promedio aproximado (para minimapa) */
    minimapColor: (/** @type {string} */ name) => TEXTURES[name]?.minimap ?? '#888',

    /**
     * Tile 32x32 repetible.
     * @param {string} name grass | dirt | sand | water | stone | brick | wood
     * @param {number} [seed]
     * @returns {HTMLCanvasElement}
     */
    get(name, seed = 1) {
        const key = name + ':' + seed;
        if (texCache.has(key)) return texCache.get(key);
        const def = TEXTURES[name];
        if (!def) throw new Error(`Textura procedural desconocida: ${name}`);
        const [c, ctx] = makeCanvas(TEX, TEX);
        const put = (x, y, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(((Math.floor(x) % TEX) + TEX) % TEX, ((Math.floor(y) % TEX) + TEX) % TEX, 1, 1);
        };
        def.paint(put, rng(seed * 9973 + name.length * 131), TEX);
        texCache.set(key, c);
        return c;
    },

    /** CanvasPattern cacheado para rellenar áreas grandes */
    pattern(/** @type {CanvasRenderingContext2D} */ ctx, /** @type {string} */ name, seed = 1) {
        const key = name + ':' + seed;
        if (!patCache.has(key)) patCache.set(key, ctx.createPattern(this.get(name, seed), 'repeat'));
        return patCache.get(key);
    },
};

// ==================================================
// SPRITES PROCEDURALES (objetos con volumen)
// Todos devuelven un canvas de (tilesW*32 x tilesH*32) con el "pie" abajo-centro.
// ==================================================
export const ProceduralSprites = {
    /**
     * Árbol: tronco abajo + copa grande arriba.
     * @param {{seed?:number, tilesW?:number, tilesH?:number, trunkW?:number, trunkH?:number,
     *          leaf?:string, bark?:string}} [o]
     */
    tree(o = {}) {
        const { seed = 1, tilesW = 5, tilesH = 6, trunkW = 1.1, trunkH = 2.4,
            leaf = '#3f9a3a', bark = '#6b4a2b' } = o;
        const W = tilesW * TEX, H = tilesH * TEX, rand = rng(seed * 7919);
        const [c, ctx] = makeCanvas(W, H);

        // Tronco
        const tw = Math.round(trunkW * TEX), th = Math.round(trunkH * TEX);
        const tx = Math.round(W / 2 - tw / 2), ty = H - th;
        ctx.fillStyle = bark; ctx.fillRect(tx, ty, tw, th);
        ctx.fillStyle = shade(bark, -0.12); ctx.fillRect(tx + tw - Math.round(tw * 0.3), ty, Math.round(tw * 0.3), th);
        ctx.fillStyle = shade(bark, 0.08);
        for (let i = 0; i < 8; i++) ctx.fillRect(tx + 2 + Math.floor(rand() * (tw - 6)), ty + Math.floor(rand() * th * 0.9), 1, 4 + Math.floor(rand() * 6));
        ctx.fillStyle = bark; // raíces
        ctx.fillRect(tx - 4, H - 6, 6, 6); ctx.fillRect(tx + tw - 2, H - 6, 6, 6);

        // Copa: 3 pasadas (sombra -> base -> luz), blobs dentro de una elipse
        const cx = W / 2, cy = H - th - (tilesH * TEX - th) * 0.42;
        const rx = W / 2 - 6, ry = (H - th * 0.55) / 2 - 4;
        const passes = [
            { color: shade(leaf, -0.16), dx: 3, dy: 5, n: 46 },
            { color: leaf, dx: 0, dy: 0, n: 40 },
            { color: shade(leaf, 0.10), dx: -4, dy: -6, n: 26 },
            { color: shade(leaf, 0.20), dx: -6, dy: -9, n: 12 },
        ];
        for (const p of passes) {
            for (let i = 0; i < p.n; i++) {
                const a = rand() * Math.PI * 2, d = Math.sqrt(rand()) * 0.78;
                const r = 9 + Math.floor(rand() * 12);
                disc(ctx, cx + Math.cos(a) * rx * d + p.dx, cy + Math.sin(a) * ry * d + p.dy, r, p.color);
            }
        }
        return c;
    },

    /** Arbusto pequeño */
    bush(o = {}) {
        const { seed = 1, tilesW = 2, tilesH = 1.5, leaf = '#3f9a3a' } = o;
        const W = Math.round(tilesW * TEX), H = Math.round(tilesH * TEX), rand = rng(seed * 104729);
        const [c, ctx] = makeCanvas(W, H);
        const passes = [[-0.16, 3, 3], [0, 0, 0], [0.12, -3, -4]];
        for (const [t, dx, dy] of passes) for (let i = 0; i < 9; i++)
            disc(ctx, 10 + rand() * (W - 20) + dx, H - 14 - rand() * (H - 24) + dy, 8 + Math.floor(rand() * 5), shade(leaf, t));
        return c;
    },

    /** Roca */
    rock(o = {}) {
        const { seed = 1, tilesW = 2, tilesH = 1.5, color = '#8c8f96' } = o;
        const W = Math.round(tilesW * TEX), H = Math.round(tilesH * TEX), rand = rng(seed * 31337);
        const [c, ctx] = makeCanvas(W, H);
        for (const [t, dx, dy, k] of [[-0.18, 2, 3, 1], [0, 0, 0, 0.92], [0.12, -3, -4, 0.55]])
            for (let i = 0; i < 4; i++)
                disc(ctx, W / 2 + (rand() - 0.5) * W * 0.4 * k + dx, H - 18 + (rand() - 0.5) * 10 * k + dy,
                    Math.round((10 + rand() * 6) * k + 4), shade(color, t));
        return c;
    },
};
