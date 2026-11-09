//@ts-check
// --------------------------------------------------
// ObjectCatalog: definiciones de objetos (sin dependencias del motor).
//
// Cada definición describe:
//   fp(o)            -> huella por defecto {w,h} en tiles ENTEROS (lo que bloquea)
//   vis(fp,o)        -> tamaño visual {w,h,offsetX?,offsetY?} en tiles (lo que se dibuja)
//   sprite(ctx)      -> pinta en un canvas de vis.w*32 x vis.h*32; el "pie" es el borde inferior
//   blocks           -> si la huella bloquea (default true)
//   shadow           -> false para desactivar la sombra automática
//   minimap          -> color en el minimapa
// Todos los objetos, incluso los más simples (caja, barril), tienen huella + visual + sortY.
// --------------------------------------------------
import { TEX, rng, shade, makeCanvas, disc, line, tri, ProceduralSprites, SPRITE_SCALE } from "./ProceduralTextures.js";

/** @typedef {{w:number,h:number}} FP */
/** @typedef {{w:number,h:number,offsetX?:number,offsetY?:number}} Vis */
/**
 * @typedef {Object} ObjectDef
 * @property {string} category
 * @property {(o:any)=>FP} fp
 * @property {(fp:FP,o:any)=>Vis} vis
 * @property {(c:{ctx:CanvasRenderingContext2D,W:number,H:number,fp:FP,vis:Vis,o:any,rand:()=>number})=>void} sprite
 * @property {boolean} [blocks]
 * @property {boolean} [shadow]
 * @property {string} minimap
 * @property {string} [description]
 */

const T = TEX;
const px = (n) => Math.round(n * T);

/** Cara frontal + cara superior de una caja (vista 3/4) */
function boxFaces(ctx, x, yBottom, w, frontH, topH, color) {
    ctx.fillStyle = shade(color, -0.12); ctx.fillRect(x, yBottom - frontH, w, frontH);        // frente
    ctx.fillStyle = shade(color, 0.12); ctx.fillRect(x, yBottom - frontH - topH, w, topH);    // tapa
    ctx.fillStyle = shade(color, -0.28);                                                       // contorno inferior
    ctx.fillRect(x, yBottom - 1, w, 1); ctx.fillRect(x, yBottom - frontH, w, 1);
}

/** @type {Object<string, ObjectDef>} */
export const OBJECT_DEFS = {
    // ============ VEGETACIÓN ============
    oak: {
        category: 'vegetation', description: 'Roble: base 2x2, copa 5x6 atravesable',
        fp: () => ({ w: 2, h: 2 }), vis: (fp, o) => ({ w: o.crownW ?? 5, h: o.crownH ?? 6 }),
        sprite: ({ ctx, W, H, o }) => ctx.drawImage(ProceduralSprites.tree({
            seed: o.seed, tilesW: W / T, tilesH: H / T, leaf: o.leaf, bark: o.bark, trunkH: 2.4
        }), 0, 0),
        minimap: '#2f6f2a',
    },
    pine: {
        category: 'vegetation', description: 'Pino: base 1x1, copa cónica 3x6',
        fp: () => ({ w: 1, h: 1 }), vis: (fp, o) => ({ w: o.crownW ?? 3, h: o.crownH ?? 6 }),
        sprite: ({ ctx, W, H, o, rand }) => {
            const leaf = o.leaf ?? '#2d6e45', cx = W / 2;
            ctx.fillStyle = '#5a3d22'; ctx.fillRect(cx - 5, H - 30, 10, 30);
            ctx.fillStyle = '#4a3019'; ctx.fillRect(cx + 1, H - 30, 4, 30);
            const tiers = 4, top = 4, usable = H - 26;
            for (let i = tiers - 1; i >= 0; i--) { // de abajo hacia arriba
                const t0 = top + (usable * i) / (tiers + 0.6), t1 = t0 + usable / (tiers - 0.6);
                const hw = (W / 2 - 3) * (0.55 + 0.45 * ((i + 1) / tiers));
                tri(ctx, cx + 2, Math.round(t0), Math.round(t1), hw, shade(leaf, -0.14));
                tri(ctx, cx, Math.round(t0), Math.round(t1), hw, leaf);
                tri(ctx, cx - 4, Math.round(t0 + 2), Math.round(t1 - 2), hw * 0.55, shade(leaf, 0.09));
                for (let k = 0; k < 6; k++) ctx.fillRect(Math.round(cx - hw + rand() * hw * 2), Math.round(t0 + rand() * (t1 - t0)), 2, 1);
            }
        },
        minimap: '#2d6e45',
    },
    palm: {
        category: 'vegetation', description: 'Palmera: base 1x1, tronco curvo y hojas largas',
        fp: () => ({ w: 1, h: 1 }), vis: () => ({ w: 4, h: 5 }),
        sprite: ({ ctx, W, H, rand }) => {
            const bx = W / 2 - 6, by = H, tx = W / 2 + 6, ty = 46;
            let prev = [bx, by];
            for (let i = 1; i <= 14; i++) { // tronco curvo
                const t = i / 14, x = bx + (tx - bx) * t + Math.sin(t * Math.PI) * -10, y = by + (ty - by) * t;
                line(ctx, prev[0], prev[1], x, y, 7 - t * 2, i % 2 ? '#8a6a45' : '#7a5c3a'); prev = [x, y];
            }
            const fronds = 7;
            for (let i = 0; i < fronds; i++) {
                const a = (i / fronds) * Math.PI * 2 + rand() * 0.3, len = 44 + rand() * 12;
                const ex = tx + Math.cos(a) * len, ey = ty + Math.sin(a) * len * 0.55 + 14;
                const mx = tx + Math.cos(a) * len * 0.5, my = ty + Math.sin(a) * len * 0.3 - 10;
                line(ctx, tx, ty, mx, my, 4, '#2f8f3a'); line(ctx, mx, my, ex, ey, 3, '#3fae4a'); line(ctx, mx, my, ex, ey - 2, 1, '#7ddc7a');
            }
            disc(ctx, tx, ty + 2, 5, '#6b4a2b'); disc(ctx, tx - 4, ty + 6, 3, '#8a5a2b');
        },
        minimap: '#3fae4a',
    },
    deadtree: {
        category: 'vegetation', description: 'Árbol seco: base 1x1, ramas sin hojas',
        fp: () => ({ w: 1, h: 1 }), vis: () => ({ w: 3, h: 4.5 }),
        sprite: ({ ctx, W, H, rand }) => {
            const cx = W / 2;
            line(ctx, cx, H, cx - 2, H - 70, 8, '#4a4038'); line(ctx, cx + 2, H, cx, H - 66, 3, '#5c5046');
            const branch = (x, y, a, len, th, d) => {
                if (d === 0 || len < 8) return;
                const x2 = x + Math.cos(a) * len, y2 = y - Math.sin(a) * len;
                line(ctx, x, y, x2, y2, th, '#4a4038');
                branch(x2, y2, a + 0.5 + rand() * 0.3, len * 0.7, Math.max(1, th - 2), d - 1);
                branch(x2, y2, a - 0.5 - rand() * 0.3, len * 0.7, Math.max(1, th - 2), d - 1);
            };
            branch(cx - 2, H - 68, Math.PI / 2, 26, 5, 4);
            branch(cx - 1, H - 45, Math.PI / 2 + 0.9, 20, 3, 3);
            branch(cx + 1, H - 40, Math.PI / 2 - 0.9, 20, 3, 3);
        },
        minimap: '#4a4038',
    },
    bush: {
        category: 'vegetation', description: 'Arbusto 1x1', fp: () => ({ w: 1, h: 1 }), vis: () => ({ w: 2, h: 1.5 }),
        sprite: ({ ctx, o }) => ctx.drawImage(ProceduralSprites.bush({ seed: o.seed, leaf: o.leaf }), 0, 0),
        minimap: '#3f9a3a',
    },
    flowers: {
        category: 'vegetation', description: 'Flores (decoración, no bloquea)', blocks: false, shadow: false,
        fp: () => ({ w: 1, h: 1 }), vis: () => ({ w: 1, h: 1 }),
        sprite: ({ ctx, W, H, rand, o }) => {
            const cols = o.colors ?? ['#ff6b9d', '#ffd23f', '#ffffff', '#b388ff'];
            for (let i = 0; i < 6; i++) {
                const x = 4 + Math.floor(rand() * (W - 8)), y = H - 4 - Math.floor(rand() * (H * 0.6)), c = cols[Math.floor(rand() * cols.length)];
                ctx.fillStyle = '#2f7326'; ctx.fillRect(x, y, 1, 5);
                ctx.fillStyle = c; ctx.fillRect(x - 1, y - 2, 3, 3); ctx.fillStyle = '#ffe9a8'; ctx.fillRect(x, y - 1, 1, 1);
            }
        },
        minimap: '#ff6b9d',
    },
    tallgrass: {
        category: 'vegetation', description: 'Pasto alto (decoración, no bloquea)', blocks: false, shadow: false,
        fp: () => ({ w: 1, h: 1 }), vis: () => ({ w: 1, h: 1 }),
        sprite: ({ ctx, W, H, rand }) => {
            for (let i = 0; i < 14; i++) {
                const x = 2 + rand() * (W - 4), h = 8 + rand() * 14;
                line(ctx, x, H, x + (rand() - 0.5) * 6, H - h, 1, rand() < 0.5 ? '#4c9a3a' : '#63b24e');
            }
        },
        minimap: '#4c9a3a',
    },
    stump: {
        category: 'vegetation', description: 'Tocón 1x1', fp: () => ({ w: 1, h: 1 }), vis: () => ({ w: 1, h: 1 }),
        sprite: ({ ctx, W, H }) => {
            ctx.fillStyle = '#6b4a2b'; ctx.fillRect(6, H - 18, W - 12, 14);
            ctx.fillStyle = '#4a3019'; ctx.fillRect(W - 12, H - 18, 6, 14);
            disc(ctx, W / 2, H - 20, 11, '#8a6a45'); disc(ctx, W / 2, H - 20, 7, '#a38058'); disc(ctx, W / 2, H - 20, 3, '#8a6a45');
        },
        minimap: '#6b4a2b',
    },
    log: {
        category: 'vegetation', description: 'Tronco caído 2x1', fp: (o) => ({ w: 2, h: 1 }), vis: () => ({ w: 2, h: 1 }),
        sprite: ({ ctx, W, H }) => {
            ctx.fillStyle = '#6b4a2b'; ctx.fillRect(8, H - 20, W - 16, 16);
            ctx.fillStyle = '#7d5834'; ctx.fillRect(8, H - 20, W - 16, 5);
            ctx.fillStyle = '#4a3019'; ctx.fillRect(8, H - 8, W - 16, 4);
            disc(ctx, W - 10, H - 12, 8, '#a38058'); disc(ctx, W - 10, H - 12, 4, '#8a6a45');
        },
        minimap: '#6b4a2b',
    },

    // ============ ROCAS ============
    rock: {
        category: 'rocks', description: 'Roca 1x1', fp: () => ({ w: 1, h: 1 }), vis: () => ({ w: 2, h: 1.5 }),
        sprite: ({ ctx, o }) => ctx.drawImage(ProceduralSprites.rock({ seed: o.seed, color: o.color }), 0, 0),
        minimap: '#8c8f96',
    },
    boulder: {
        category: 'rocks', description: 'Peñasco: base 2x2, visual 3x3',
        fp: () => ({ w: 2, h: 2 }), vis: () => ({ w: 3, h: 3 }),
        sprite: ({ ctx, o }) => ctx.drawImage(ProceduralSprites.rock({ seed: o.seed, tilesW: 3, tilesH: 3, color: o.color ?? '#7d8088' }), 0, 0),
        minimap: '#7d8088',
    },

    // ============ MOBILIARIO / PROPS ============
    box: {
        category: 'props',
        description: 'Caja genérica con volumen. Opciones: w, h (huella), height (alto en tiles), color. Úsala para convertir cualquier bloque simple.',
        fp: (o) => ({ w: o.w ?? 1, h: o.h ?? 1 }),
        vis: (fp, o) => ({ w: fp.w, h: (o.height ?? 1) + 0.4 }),
        sprite: ({ ctx, W, H, o }) => {
            const topH = px(0.4), frontH = H - topH;
            boxFaces(ctx, 0, H, W, frontH, topH, o.color ?? '#b07a45');
        },
        minimap: '#b07a45',
    },
    crate: {
        category: 'props', description: 'Caja de madera 1x1', fp: () => ({ w: 1, h: 1 }), vis: () => ({ w: 1, h: 1.4 }),
        sprite: ({ ctx, W, H }) => {
            const topH = px(0.4), frontH = H - topH;
            boxFaces(ctx, 2, H, W - 4, frontH, topH, '#b07a45');
            ctx.fillStyle = '#6b4a2b';
            ctx.fillRect(2, H - frontH, 3, frontH); ctx.fillRect(W - 5, H - frontH, 3, frontH);
            line(ctx, 5, H - frontH + 1, W - 6, H - 2, 2, '#8a5a2b'); line(ctx, W - 6, H - frontH + 1, 5, H - 2, 2, '#8a5a2b');
        },
        minimap: '#b07a45',
    },
    barrel: {
        category: 'props', description: 'Barril 1x1', fp: () => ({ w: 1, h: 1 }), vis: () => ({ w: 1, h: 1.5 }),
        sprite: ({ ctx, W, H }) => {
            ctx.fillStyle = '#8a5a2b'; ctx.fillRect(5, 14, W - 10, H - 18);
            ctx.fillStyle = '#6f4720'; ctx.fillRect(W - 12, 14, 7, H - 18);
            ctx.fillStyle = '#a56f36'; ctx.fillRect(7, 14, 4, H - 18);
            ctx.fillStyle = '#3d3d44'; ctx.fillRect(5, 22, W - 10, 3); ctx.fillRect(5, H - 14, W - 10, 3);
            disc(ctx, W / 2, 14, 11, '#a56f36'); disc(ctx, W / 2, 14, 8, '#c38a4a'); disc(ctx, W / 2, 14, 2, '#8a5a2b');
        },
        minimap: '#8a5a2b',
    },
    haystack: {
        category: 'props', description: 'Fardo de heno 2x1', fp: () => ({ w: 2, h: 1 }), vis: () => ({ w: 2, h: 1.6 }),
        sprite: ({ ctx, W, H, rand }) => {
            for (let y = H - 6; y > 8; y -= 1) {
                const t = (H - 6 - y) / (H - 14), hw = Math.round((W / 2 - 4) * Math.sqrt(Math.max(0, 1 - t * t * 0.9)));
                ctx.fillStyle = rand() < 0.3 ? '#d9b44a' : '#e6c45a'; ctx.fillRect(W / 2 - hw, y, hw * 2, 1);
            }
            for (let i = 0; i < 40; i++) { ctx.fillStyle = '#b8932f'; ctx.fillRect(10 + rand() * (W - 20), 12 + rand() * (H - 22), 1 + rand() * 4, 1); }
        },
        minimap: '#e6c45a',
    },
    bench: {
        category: 'props', description: 'Banca 2x1', fp: () => ({ w: 2, h: 1 }), vis: () => ({ w: 2, h: 1.3 }),
        sprite: ({ ctx, W, H }) => {
            ctx.fillStyle = '#4a3019'; ctx.fillRect(6, H - 14, 4, 14); ctx.fillRect(W - 10, H - 14, 4, 14);
            ctx.fillStyle = '#8a5a2b'; ctx.fillRect(2, H - 30, W - 4, 8);      // respaldo
            ctx.fillStyle = '#a56f36'; ctx.fillRect(2, H - 30, W - 4, 2);
            ctx.fillStyle = '#9a6430'; ctx.fillRect(2, H - 20, W - 4, 8);      // asiento
            ctx.fillStyle = '#b87a3c'; ctx.fillRect(2, H - 20, W - 4, 2);
        },
        minimap: '#8a5a2b',
    },
    signpost: {
        category: 'props', description: 'Cartel 1x1. Opciones: text. Usa Action para leerlo con Z.',
        fp: () => ({ w: 1, h: 1 }), vis: () => ({ w: 1.5, h: 2 }),
        sprite: ({ ctx, W, H, o }) => {
            ctx.fillStyle = '#5a3d22'; ctx.fillRect(W / 2 - 3, H - 34, 6, 34);
            ctx.fillStyle = '#4a3019'; ctx.fillRect(W / 2 + 1, H - 34, 2, 34);
            ctx.fillStyle = '#b07a45'; ctx.fillRect(4, 6, W - 8, 24);
            ctx.fillStyle = '#c8905a'; ctx.fillRect(4, 6, W - 8, 3);
            ctx.fillStyle = '#6b4a2b'; ctx.fillRect(4, 28, W - 8, 2);
            if (o.text) { ctx.fillStyle = '#2b1b0c'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(String(o.text).slice(0, 8), W / 2, 22); }
        },
        minimap: '#b07a45',
    },
    lamp: {
        category: 'props', description: 'Farola 1x1', fp: () => ({ w: 1, h: 1 }), vis: () => ({ w: 1.4, h: 3.6 }),
        sprite: ({ ctx, W, H }) => {
            const cx = W / 2;
            ctx.fillStyle = '#2f3138'; ctx.fillRect(cx - 4, H - 8, 8, 8);
            ctx.fillStyle = '#3d4048'; ctx.fillRect(cx - 2, 28, 4, H - 34);
            ctx.fillStyle = '#2f3138'; ctx.fillRect(cx - 8, 16, 16, 4); ctx.fillRect(cx - 7, 28, 14, 3);
            ctx.fillStyle = '#ffe58a'; ctx.fillRect(cx - 6, 20, 12, 8);
            ctx.fillStyle = '#fff4c2'; ctx.fillRect(cx - 3, 22, 6, 4);
            tri(ctx, cx, 8, 16, 9, '#2f3138');
            ctx.fillStyle = 'rgba(255,229,138,0.18)'; disc(ctx, cx, 24, 22, 'rgba(255,229,138,0.14)');
        },
        minimap: '#ffe58a',
    },
    well: {
        category: 'props', description: 'Pozo 2x2 con techito',
        fp: () => ({ w: 2, h: 2 }), vis: () => ({ w: 2.6, h: 3.6 }),
        sprite: ({ ctx, W, H, rand }) => {
            const cx = W / 2, baseY = H;
            ctx.fillStyle = '#7d8088'; ctx.fillRect(10, baseY - 44, W - 20, 40);        // cuerpo
            ctx.fillStyle = '#9aa0a8'; ctx.fillRect(10, baseY - 44, W - 20, 6);
            ctx.fillStyle = '#5b5e66'; ctx.fillRect(W - 22, baseY - 38, 12, 34);
            for (let i = 0; i < 18; i++) { ctx.fillStyle = '#5b5e66'; ctx.fillRect(12 + rand() * (W - 28), baseY - 36 + rand() * 30, 6, 1); }
            ctx.fillStyle = '#1d3b5c'; ctx.fillRect(16, baseY - 46, W - 32, 4);          // agua
            ctx.fillStyle = '#5a3d22'; ctx.fillRect(14, baseY - 90, 5, 48); ctx.fillRect(W - 19, baseY - 90, 5, 48); // postes
            ctx.fillStyle = '#6b4a2b'; ctx.fillRect(14, baseY - 76, W - 28, 4);          // viga
            tri(ctx, cx, baseY - 112, baseY - 86, W / 2 - 4, '#a4523c');                 // techo
            tri(ctx, cx - 5, baseY - 108, baseY - 88, W / 2 - 18, '#c2664d');
            ctx.fillStyle = '#e8d8b0'; ctx.fillRect(cx - 1, baseY - 74, 2, 14);          // cuerda
        },
        minimap: '#7d8088',
    },
    tent: {
        category: 'props', description: 'Tienda de campaña 3x2',
        fp: () => ({ w: 3, h: 2 }), vis: () => ({ w: 3.4, h: 3 }),
        sprite: ({ ctx, W, H, o }) => {
            const c = o.color ?? '#c2553a', cx = W / 2;
            tri(ctx, cx, 6, H - 2, W / 2 - 2, shade(c, -0.14));
            tri(ctx, cx - 3, 8, H - 2, W / 2 - 14, c);
            tri(ctx, cx, Math.round(H * 0.45), H - 2, 14, '#2b1b0c');
            tri(ctx, cx + 2, Math.round(H * 0.5), H - 2, 9, '#3d2a16');
            ctx.fillStyle = '#e8d8b0'; ctx.fillRect(cx - 1, 2, 2, 8);
            line(ctx, cx, 6, 4, H - 2, 1, shade(c, -0.3)); line(ctx, cx, 6, W - 4, H - 2, 1, shade(c, -0.3));
        },
        minimap: '#c2553a',
    },
    tombstone: {
        category: 'props', description: 'Lápida 1x1', fp: () => ({ w: 1, h: 1 }), vis: () => ({ w: 1, h: 1.5 }),
        sprite: ({ ctx, W, H }) => {
            ctx.fillStyle = '#8c8f96'; ctx.fillRect(7, H - 36, W - 14, 32); disc(ctx, W / 2, H - 34, (W - 14) / 2, '#8c8f96');
            ctx.fillStyle = '#a7aab2'; ctx.fillRect(9, H - 34, 3, 28);
            ctx.fillStyle = '#5b5e66'; ctx.fillRect(W / 2 - 1, H - 34, 3, 12); ctx.fillRect(W / 2 - 5, H - 30, 11, 3); ctx.fillRect(4, H - 5, W - 8, 4);
        },
        minimap: '#8c8f96',
    },
    campfire: {
        category: 'props', description: 'Fogata 1x1', fp: () => ({ w: 1, h: 1 }), vis: () => ({ w: 1.2, h: 1.4 }),
        sprite: ({ ctx, W, H }) => {
            line(ctx, 6, H - 4, W - 6, H - 12, 5, '#6b4a2b'); line(ctx, W - 6, H - 4, 6, H - 12, 5, '#5a3d22');
            tri(ctx, W / 2, 6, H - 8, 11, '#e8590c'); tri(ctx, W / 2, 14, H - 9, 7, '#ffa94d'); tri(ctx, W / 2, 22, H - 10, 3, '#ffe066');
            for (let i = 0; i < 6; i++) disc(ctx, 6 + i * ((W - 12) / 5), H - 3, 3, '#7d8088');
        },
        minimap: '#ffa94d',
    },

    // ============ ESTRUCTURAS ============
    fenceh: {
        category: 'structures', description: 'Cerca horizontal. Opciones: w (largo en tiles)',
        fp: (o) => ({ w: o.w ?? 3, h: 1 }), vis: (fp) => ({ w: fp.w, h: 1.4 }),
        sprite: ({ ctx, W, H, fp }) => {
            ctx.fillStyle = '#9a6430'; ctx.fillRect(0, H - 30, W, 5); ctx.fillRect(0, H - 18, W, 5);
            ctx.fillStyle = '#b87a3c'; ctx.fillRect(0, H - 30, W, 1); ctx.fillRect(0, H - 18, W, 1);
            for (let i = 0; i < fp.w; i++) {
                const x = i * T + T / 2 - 3;
                ctx.fillStyle = '#7d5834'; ctx.fillRect(x, H - 38, 6, 38); ctx.fillStyle = '#9a6a40'; ctx.fillRect(x, H - 38, 2, 38);
                ctx.fillStyle = '#6b4a2b'; ctx.fillRect(x, H - 38, 6, 2);
            }
        },
        minimap: '#9a6430',
    },
    fencev: {
        category: 'structures', description: 'Cerca vertical. Opciones: h (largo en tiles)',
        fp: (o) => ({ w: 1, h: o.h ?? 3 }), vis: (fp) => ({ w: 1, h: fp.h + 0.6 }),
        sprite: ({ ctx, W, H, fp }) => {
            const cx = W / 2;
            for (let i = 0; i < fp.h; i++) {
                const yb = H - i * T - 2;
                if (i < fp.h - 1) { ctx.fillStyle = '#9a6430'; ctx.fillRect(cx - 2, yb - T - 20, 4, T); } // travesaño al siguiente poste
                ctx.fillStyle = '#7d5834'; ctx.fillRect(cx - 4, yb - 26, 8, 26); ctx.fillStyle = '#9a6a40'; ctx.fillRect(cx - 4, yb - 26, 3, 26);
                ctx.fillStyle = '#6b4a2b'; ctx.fillRect(cx - 4, yb - 26, 8, 2);
            }
        },
        minimap: '#9a6430',
    },
    wall: {
        category: 'structures', description: 'Muro de piedra. Opciones: w, h (huella), height (alto visual en tiles)',
        fp: (o) => ({ w: o.w ?? 3, h: o.h ?? 1 }), vis: (fp, o) => ({ w: fp.w, h: (o.height ?? 1.5) + 0.3 }),
        sprite: ({ ctx, W, H, o, rand }) => {
            const c = o.color ?? '#8c8f96', topH = px(0.3), frontH = H - topH;
            boxFaces(ctx, 0, H, W, frontH, topH, c);
            for (let y = H - 8; y > topH; y -= 8) { ctx.fillStyle = shade(c, -0.3); ctx.fillRect(0, y, W, 1); for (let x = ((y / 8) % 2) * 8; x < W; x += 16) ctx.fillRect(x, y - 8, 1, 8); }
            for (let i = 0; i < 30; i++) { ctx.fillStyle = shade(c, rand() < 0.5 ? 0.06 : -0.08); ctx.fillRect(rand() * W, topH + rand() * frontH, 3, 2); }
        },
        minimap: '#8c8f96',
    },
    house: {
        category: 'structures',
        description: 'Casa. Opciones: w (ancho, 5), h (alto de la fachada, 2), roof (alto del techo, 3), color, roofColor. Huella = fachada; el techo se atraviesa por detrás.',
        fp: (o) => ({ w: o.w ?? 5, h: o.h ?? 2 }),
        vis: (fp, o) => ({ w: fp.w + 1, h: fp.h + (o.roof ?? 3) }),
        sprite: ({ ctx, W, H, fp, o, rand }) => {
            const wall = o.color ?? '#d8c7a4', roofC = o.roofColor ?? '#a4523c';
            const wallH = fp.h * T, wx = T / 2, ww = fp.w * T, roofH = H - wallH;
            // Fachada
            ctx.fillStyle = wall; ctx.fillRect(wx, H - wallH, ww, wallH);
            ctx.fillStyle = shade(wall, -0.1); ctx.fillRect(wx, H - 6, ww, 6);               // zócalo
            for (let y = H - wallH + 6; y < H - 6; y += 6) { ctx.fillStyle = shade(wall, -0.05); ctx.fillRect(wx, y, ww, 1); }
            // Puerta centrada
            const dw = 22, dh = Math.min(wallH - 6, 46), dx = Math.round(wx + ww / 2 - dw / 2);
            ctx.fillStyle = '#4a3019'; ctx.fillRect(dx - 2, H - dh - 2, dw + 4, dh + 2);
            ctx.fillStyle = '#7d5834'; ctx.fillRect(dx, H - dh, dw, dh);
            ctx.fillStyle = '#6b4a2b'; ctx.fillRect(dx + dw / 2, H - dh, 1, dh);
            ctx.fillStyle = '#e6c45a'; ctx.fillRect(dx + dw - 5, H - dh / 2, 2, 3);
            // Ventanas simétricas
            const win = (x) => { ctx.fillStyle = '#5a3d22'; ctx.fillRect(x - 1, H - wallH + 11, 20, 19); ctx.fillStyle = '#8fc3ff'; ctx.fillRect(x + 1, H - wallH + 13, 16, 15); ctx.fillStyle = '#d6ebff'; ctx.fillRect(x + 2, H - wallH + 14, 5, 4); ctx.fillStyle = '#5a3d22'; ctx.fillRect(x + 8, H - wallH + 13, 2, 15); };
            for (let i = 1; i < fp.w; i++) { const cxw = wx + i * T + T / 2; if (Math.abs(cxw - (wx + ww / 2)) > dw / 2 + 14) win(Math.round(cxw - 9)); }
            // Techo trapezoidal con tejas
            const top = 2, inset = Math.round(W * 0.2);
            ctx.fillStyle = roofC; ctx.beginPath();
            ctx.moveTo(inset, top); ctx.lineTo(W - inset, top); ctx.lineTo(W, H - wallH + 6); ctx.lineTo(0, H - wallH + 6); ctx.closePath(); ctx.fill();
            ctx.save(); ctx.clip();
            for (let y = top, row = 0; y < H - wallH + 6; y += 8, row++) {
                ctx.fillStyle = shade(roofC, -0.16); ctx.fillRect(0, y + 7, W, 1);
                for (let x = (row % 2) * 8; x < W; x += 16) ctx.fillRect(x, y, 1, 8);
                ctx.fillStyle = shade(roofC, 0.07 * (rand() - 0.2)); ctx.fillRect(0, y, W, 3);
            }
            ctx.restore();
            ctx.fillStyle = shade(roofC, -0.3); ctx.fillRect(0, H - wallH + 5, W, 3);       // alero
            ctx.fillStyle = shade(roofC, 0.12); ctx.fillRect(inset, top, W - inset * 2, 2); // cumbrera
            // Chimenea
            ctx.fillStyle = '#7d8088'; ctx.fillRect(W - inset - 22, 0, 12, 18); ctx.fillStyle = '#5b5e66'; ctx.fillRect(W - inset - 22, 0, 12, 3);
        },
        minimap: '#a4523c',
    },
};

export const CATEGORIES = [...new Set(Object.values(OBJECT_DEFS).map(d => d.category))];

/**
 * Construye el canvas del sprite de una definición.
 * @param {ObjectDef} def @param {FP} fp @param {Vis} vis @param {any} o
 */
export function buildSprite(def, fp, vis, o = {}) {
    const W = px(vis.w);
    const H = px(vis.h);

    const scale = SPRITE_SCALE;
    const canvas = document.createElement('canvas');

    canvas.width = W * scale;
    canvas.height = H * scale;

    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    def.sprite({
        ctx, W, H, fp, vis, o,
        rand: rng((o.seed ?? 1) * 2654435761)
    });

    return canvas;
}
