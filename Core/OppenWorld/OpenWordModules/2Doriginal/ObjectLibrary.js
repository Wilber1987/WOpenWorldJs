//@ts-check
// --------------------------------------------------
// ObjectLibrary: API para crear y colocar objetos del catálogo en un GameMap.
//
//   import { ObjectLibrary } from "./OpenWordModules/ObjectLibrary.js";
//
//   map.place('oak', 10, 8);                                  // árbol: base 2x2, copa 5x6
//   map.place('house', 20, 6, { w: 6, roof: 3, Action: () => ... });
//   map.place('fenceh', 4, 12, { w: 8 });
//   map.place('box', 30, 5, { w: 2, h: 1, height: 1.5, color: '#a55' });  // objeto simple CON volumen
//   ObjectLibrary.scatter(map, 'oak', { x: 0, y: 0, w: 64, h: 36 }, 25, { seed: 3 });
//   ObjectLibrary.upgrade(oldBlockObject, { height: 1.5 });   // BlockObject viejo -> WorldObject
//
// Opciones comunes de create/place: seed, variants (looks distintos, 6 por defecto; 0 = único), blocks, w/h (si el objeto es redimensionable),
// Action, ActionQuestion, autoTrigger, fadeOnBehind, shadow:false, visual:{...}, color, leaf, ...
// --------------------------------------------------
import { GameMap, BlockObject } from "./Models.js";
import { WorldObject } from "./WorldObjects.js";
import { OBJECT_DEFS, CATEGORIES, buildSprite } from "./ObjectCatalog.js";

/** @type {Object<string, import('./ObjectCatalog.js').ObjectDef>} */
const defs = { ...OBJECT_DEFS };

const int = (/** @type {number} */ n, min = 1) => Math.max(min, Math.round(n));

/** Cache de sprites: mismo objeto + mismas opciones visuales + misma variante => mismo canvas */
const spriteCache = new Map();
const STYLE_KEYS = ['leaf', 'bark', 'color', 'roofColor', 'text', 'roof', 'crownW', 'crownH', 'colors', 'height'];

export const ObjectLibrary = {
    /** ids disponibles, opcionalmente por categoría */
    list(/** @type {string} */ category) {
        return Object.keys(defs).filter(id => !category || defs[id].category === category);
    },
    categories: () => CATEGORIES,
    describe: (/** @type {string} */ id) => defs[id]?.description ?? '',

    /**
     * Registra un objeto propio con el mismo contrato (huella + visual + sprite).
     * @param {string} id @param {import('./ObjectCatalog.js').ObjectDef} def
     */
    register(id, def) { defs[id.toLowerCase()] = def; },

    /**
     * Crea un WorldObject del catálogo (sin agregarlo al mapa).
     * @param {string} id
     * @param {number} x tile X de la esquina superior-izquierda de la huella
     * @param {number} y tile Y de la esquina superior-izquierda de la huella
     * @param {any} [o]
     * @returns {WorldObject}
     */
    create(id, x, y, o = {}) {
        const def = defs[id.toLowerCase()];
        if (!def) throw new Error(`ObjectLibrary: "${id}" no existe. Disponibles: ${Object.keys(defs).join(', ')}`);
        x = Math.round(x); y = Math.round(y); // la colisión del motor trabaja por tiles enteros

        const base = def.fp(o);
        const fp = { w: int(o.fw ?? base.w), h: int(o.fh ?? base.h) };
        const vis = { offsetX: 0, offsetY: 0, ...def.vis(fp, o), ...(o.visual ?? {}) };
        o = { seed: x * 31 + y * 17 + 1, ...o };

        // visual alto sobre la huella => se vuelve translúcido cuando alguien pasa detrás
        const fade = o.fadeOnBehind !== undefined ? o.fadeOnBehind : (vis.h - fp.h >= 1.5 ? 0.45 : null);
        const shadow = o.shadow === false || def.shadow === false ? null
            : (o.shadow ?? { rx: Math.max(fp.w * 0.55, vis.w * 0.28), ry: Math.max(0.25, fp.h * 0.22), offsetY: -fp.h * 0.18, alpha: 0.2 });

        const obj = new WorldObject(x, y, fp.w, fp.h, {
            ...o, // Action, ActionQuestion, autoTrigger, etc. pasan al BlockObject
            blocks: o.blocks ?? def.blocks ?? true,
            image: (() => {
                // variants: cuántos "looks" distintos por objeto (0 = uno único por seed, sin cache)
                const seed = o.variants === 0 ? o.seed : (Math.abs(o.seed) % (o.variants ?? 6)) + 1;
                const key = JSON.stringify([id, fp, vis, seed, STYLE_KEYS.map(k => o[k])]);
                if (o.variants === 0) return buildSprite(def, fp, vis, { ...o, seed });
                if (!spriteCache.has(key)) spriteCache.set(key, buildSprite(def, fp, vis, { ...o, seed }));
                return spriteCache.get(key);
            })(),
            visual: vis, shadow, fadeOnBehind: fade,
            minimapColor: o.minimapColor ?? def.minimap,
        });
        obj.libraryId = id.toLowerCase();
        /** punto libre justo frente a la huella (útil para spawnear al salir de una casa) */
        obj.frontTile = { x: x + Math.floor(fp.w / 2), y: y + fp.h };
        return obj;
    },

    /**
     * Crea y agrega al mapa.
     * @param {GameMap} map @param {string} id @param {number} x @param {number} y @param {any} [o]
     */
    place(map, id, x, y, o) {
        const obj = this.create(id, x, y, o);
        map.addObject(obj);
        return obj;
    },

    /**
     * Reparte N objetos al azar dentro de un área, evitando huellas bloqueadas y el spawn.
     * @param {GameMap} map @param {string} id
     * @param {{x:number,y:number,w:number,h:number}} area
     * @param {number} count
     * @param {{seed?:number, margin?:number, tries?:number, options?:any, variation?:(i:number)=>any}} [cfg]
     * @returns {WorldObject[]}
     */
    scatter(map, id, area, count, cfg = {}) {
        let s = (cfg.seed ?? 1) >>> 0;
        const rand = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
        const placed = [];
        const margin = cfg.margin ?? 0, tries = cfg.tries ?? count * 25;
        for (let t = 0; t < tries && placed.length < count; t++) {
            const x = Math.floor(area.x + rand() * area.w), y = Math.floor(area.y + rand() * area.h);
            const obj = this.create(id, x, y, { seed: Math.floor(rand() * 1e6), ...(cfg.options ?? {}), ...(cfg.variation?.(placed.length) ?? {}) });
            // La huella (con margen) debe caber en el área, no tocar bloqueos ni el spawn
            let ok = obj.x >= area.x && obj.y >= area.y && obj.x + obj.w <= area.x + area.w && obj.y + obj.h <= area.y + area.h;
            for (let tx = obj.x - margin; ok && tx < obj.x + obj.w + margin; tx++)
                for (let ty = obj.y - margin; ok && ty < obj.y + obj.h + margin; ty++)
                    if (map.isBlocked(tx, ty, 1)) ok = false;
            if (ok && Math.hypot(obj.x - map.spawnX, obj.y - map.spawnY) < 2 + Math.max(obj.w, obj.h)) ok = false;
            if (!ok) continue;
            map.addObject(obj); placed.push(obj);
        }
        return placed;
    },

    /**
     * Convierte un BlockObject simple en un WorldObject con volumen,
     * conservando posición, tamaño, color y acciones.
     * @param {BlockObject} block
     * @param {{height?:number, color?:string, image?:any, id?:string}} [o]
     */
    upgrade(block, o = {}) {
        const w = int(block.w), h = int(block.h);
        const obj = o.image
            ? new WorldObject(block.x, block.y, w, h, { ...block, image: o.image, visual: { w, h: o.height ?? h } })
            : this.create(o.id ?? 'box', block.x, block.y, { w, h, height: o.height ?? 1, color: o.color ?? block.color ?? '#b07a45' });
        obj.Action = block.Action; obj.ActionQuestion = block.ActionQuestion; obj.autoTrigger = block.autoTrigger;
        return obj;
    },
};

// map.place('oak', 10, 8, opts)
if (!GameMap.prototype.place) {
    GameMap.prototype.place = function (/** @type {string} */ id, /** @type {number} */ x, /** @type {number} */ y, /** @type {any} */ o) {
        return ObjectLibrary.place(this, id, x, y, o);
    };
    GameMap.prototype.scatter = function (/** @type {string} */ id, /** @type {any} */ area, /** @type {number} */ n, /** @type {any} */ cfg) {
        return ObjectLibrary.scatter(this, id, area, n, cfg);
    };
}
