import { WorldObject } from "../WorldObjectModels.js";
// @ts-ignore
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

// ============================================================
// TEXTURAS COMPARTIDAS (generadas una sola vez por engine)
// ============================================================
const _sharedCache = new WeakMap();

function getSharedTextures(THREE) {
    if (_sharedCache.has(THREE)) return _sharedCache.get(THREE);

    const makeCanvas = (w, h, draw) => {
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        draw(c.getContext("2d"), w, h);
        const t = new THREE.CanvasTexture(c);
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
    };

    // Piedra de sillería (bloques visibles)
    const stone = makeCanvas(256, 256, (ctx, w, h) => {
        ctx.fillStyle = "#9a938a"; ctx.fillRect(0, 0, w, h);
        const rows = 6, cols = 4;
        for (let r = 0; r < rows; r++) {
            const rowH = h / rows;
            const offset = (r % 2) * (w / cols / 2);
            for (let c = -1; c < cols + 1; c++) {
                const x = c * (w / cols) + offset;
                const y = r * rowH;
                const bw = w / cols, bh = rowH;
                const shade = 110 + Math.floor(Math.random() * 60);
                ctx.fillStyle = `rgb(${shade},${shade - 3},${shade - 10})`;
                ctx.fillRect(x + 2, y + 2, bw - 4, bh - 4);
                ctx.strokeStyle = "#4a463e"; ctx.lineWidth = 3;
                ctx.strokeRect(x + 2, y + 2, bw - 4, bh - 4);
                // ruido dentro del bloque
                for (let i = 0; i < 30; i++) {
                    const v = Math.random() * 40 - 20;
                    ctx.fillStyle = `rgba(${120 + v},${120 + v},${118 + v},0.25)`;
                    ctx.fillRect(
                        x + 2 + Math.random() * (bw - 4),
                        y + 2 + Math.random() * (bh - 4), 2, 2);
                }
            }
        }
    });
    stone.repeat.set(2, 2);

    // Piedra oscura (cimientos, bases)
    const stoneDark = makeCanvas(256, 256, (ctx, w, h) => {
        ctx.fillStyle = "#5a5550"; ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < 60; i++) {
            const x = Math.random() * w, y = Math.random() * h;
            const r = 8 + Math.random() * 20;
            const shade = 60 + Math.floor(Math.random() * 40);
            ctx.fillStyle = `rgb(${shade},${shade - 3},${shade - 6})`;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = "#2a2825"; ctx.lineWidth = 1.5; ctx.stroke();
        }
    });

    // Madera de roble (puertas, rastrillo)
    const oak = makeCanvas(128, 256, (ctx, w, h) => {
        ctx.fillStyle = "#6b4a2a"; ctx.fillRect(0, 0, w, h);
        const planks = 4, pw = w / planks;
        for (let i = 0; i < planks; i++) {
            const shade = Math.floor(Math.random() * 20 - 10);
            ctx.fillStyle = `rgb(${107 + shade},${74 + shade},${42 + shade})`;
            ctx.fillRect(i * pw + 2, 0, pw - 4, h);
            ctx.strokeStyle = "#2a1a0a"; ctx.lineWidth = 2;
            ctx.strokeRect(i * pw + 2, 0, pw - 4, h);
            for (let v = 0; v < 20; v++) {
                ctx.strokeStyle = `rgba(40,20,10,${0.1 + Math.random() * 0.2})`;
                ctx.lineWidth = 0.7;
                let yy = Math.random() * h;
                ctx.beginPath(); ctx.moveTo(i * pw + 4, yy);
                ctx.lineTo((i + 1) * pw - 4, yy + (Math.random() - 0.5) * 8);
                ctx.stroke();
            }
        }
    });
    oak.repeat.set(1, 1);

    // Hierro forjado (rastrillo, herrajes)
    const iron = makeCanvas(128, 128, (ctx, w, h) => {
        ctx.fillStyle = "#2a2a2e"; ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < 2000; i++) {
            const v = Math.random() * 40 - 20;
            ctx.fillStyle = `rgba(${60 + v},${60 + v},${64 + v},0.3)`;
            ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
        }
    });

    // Agua del foso
    const water = makeCanvas(128, 128, (ctx, w, h) => {
        const g = ctx.createLinearGradient(0, 0, w, h);
        g.addColorStop(0, "#1a3a5a"); g.addColorStop(0.5, "#2a5a7a"); g.addColorStop(1, "#1a3a5a");
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < 40; i++) {
            ctx.strokeStyle = `rgba(120,180,220,${0.1 + Math.random() * 0.2})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            const y = Math.random() * h;
            ctx.moveTo(0, y); ctx.bezierCurveTo(w * 0.3, y + 5, w * 0.7, y - 5, w, y);
            ctx.stroke();
        }
    });
    water.repeat.set(4, 4);

    const textures = { stone, stoneDark, oak, iron, water };
    _sharedCache.set(THREE, textures);
    return textures;
}

function sharedMaterials(THREE, colors = {}) {
    const tex = getSharedTextures(THREE);
    return {
        stone: new THREE.MeshStandardMaterial({
            map: tex.stone,
            color: colors.stone ?? 0xb5afa6,
            roughness: 0.95
        }),
        stoneDark: new THREE.MeshStandardMaterial({
            map: tex.stoneDark,
            color: colors.stoneDark ?? 0x6a6560,
            roughness: 1.0
        }),
        oak: new THREE.MeshStandardMaterial({
            map: tex.oak,
            color: colors.oak ?? 0x8a5a30,
            roughness: 0.8
        }),
        iron: new THREE.MeshStandardMaterial({
            map: tex.iron,
            color: colors.iron ?? 0x2a2a2e,
            roughness: 0.5,
            metalness: 0.75
        }),
        water: new THREE.MeshStandardMaterial({
            map: tex.water,
            color: colors.water ?? 0x3a6a9a,
            roughness: 0.2,
            metalness: 0.3,
            transparent: true,
            opacity: 0.85
        }),
        banner: (color = 0xc03030) => new THREE.MeshStandardMaterial({
            color,
            roughness: 0.85,
            side: THREE.DoubleSide
        }),
        flame: new THREE.MeshStandardMaterial({
            color: 0xffaa33,
            emissive: 0xff6600,
            emissiveIntensity: 1.5,
            transparent: true,
            opacity: 0.9
        })
    };
}

// Helper común para añadir mallas
const addMeshFactory = () => (group) => (geo, mat, x, y, z, parent = group) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
};

// ============================================================
// BASE COMÚN DE TODAS LAS PIEZAS
// ============================================================
class CastlePiece extends WorldObject {
    constructor(x, y, w, h, options = {}) {
        // Dimensiones LOCALES (sin rotar): las usa el render para la geometría.
        const localW = w;
        const localH = h;

        // Footprint ROTADO: en múltiplos de 90° se intercambian w/h,
        // así this.w/this.h (y cualquier lógica externa) reflejan la
        // ocupación real en el mapa.
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

    /** Centro del footprint (pivote de rotación del mesh). */
    get centerX() { return this.x + this.w / 2; }
    get centerY() { return this.y + this.h / 2; }

    /**
     * Colisión rotada: transforma el CENTRO del tile al espacio local
     * del objeto y prueba contra el rectángulo local (localW × localH).
     * Exacto para cualquier ángulo; los footprints tienen grosor de
     * 1 tile entero, así que el test por centro no deja huecos.
     */
    occupies(tx, ty) {
        if (!this.blocksMovement) return false;

        const theta = this.rotation ?? 0;
        const dx = tx + 0.5 - this.centerX;
        const dy = ty + 0.5 - this.centerY;

        const cos = Math.cos(theta);
        const sin = Math.sin(theta);

        // Inversa de la rotación de Three.js (eje Y) en coords de mapa
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

// ============================================================
// Muros
// ============================================================

/**
 * Segmento recto de muralla con almenas opcionales.
 * @typedef {Object} CastleWallOptions
 * @property {number} [length=4]    - Longitud en tiles
 * @property {number} [height=4.5]  - Altura total del muro
 * @property {number} [thickness=0.8] - Grosor del muro
 * @property {boolean} [battlements=true] - Añadir almenas en la parte superior
 * @property {boolean} [walkway=true]     - Añadir pasillo de ronda
 */
export class CastleWall extends CastlePiece {
    constructor(x, y, options = {}) {
        const length = options.length ?? 4;
        super(x, y, length, 1, options);
        this.length = length;
        this.height = options.height ?? 4.5;
        this.thickness = options.thickness ?? 0.8;
        this.battlements = options.battlements ?? true;
        this.walkway = options.walkway ?? true;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const L = this.length, H = this.height, T = this.thickness;
        const foundH = 0.3;

        // Cimiento
        add(new THREE.BoxGeometry(L + 0.2, foundH, T + 0.4), mat.stoneDark,
            0, foundH / 2, 0);

        // Cuerpo del muro
        add(new THREE.BoxGeometry(L, H, T), mat.stone,
            0, foundH + H / 2, 0);

        // Pasillo de ronda
        if (this.walkway) {
            add(new THREE.BoxGeometry(L, 0.15, T + 0.3), mat.stoneDark,
                0, foundH + H - 0.075, 0);
        }

        // Almenas
        if (this.battlements) {
            const merlonW = 0.5, merlonH = 0.8, merlonD = T * 0.8;
            const spacing = 1.1;
            const count = Math.floor(L / spacing);
            const startX = -L / 2 + spacing / 2;
            for (let i = 0; i < count; i++) {
                add(new THREE.BoxGeometry(merlonW, merlonH, merlonD), mat.stone,
                    startX + i * spacing,
                    foundH + H + merlonH / 2,
                    0);
            }
        }

        group.position.set(this.centerX, 0, this.centerY);
        //group.position.set(this.x + L / 2, 0, this.y + 0.5);
        group.rotation.y = this.rotation ?? 0;
        group.name = `CastleWall_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }
}

/**
 * Esquina de muralla (90°).
 * @typedef {Object} CastleCornerOptions
 * @property {number} [size=2]     - Tamaño del cuadrado de esquina
 * @property {number} [height=4.5]
 */
export class CastleCorner extends CastlePiece {
    constructor(x, y, options = {}) {
        const size = options.size ?? 2;
        super(x, y, size, size, options);
        this.size = size;
        this.height = options.height ?? 4.5;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const S = this.size, H = this.height;
        const foundH = 0.3;

        add(new THREE.BoxGeometry(S + 0.2, foundH, S + 0.2), mat.stoneDark,
            0, foundH / 2, 0);
        add(new THREE.BoxGeometry(S, H, S), mat.stone,
            0, foundH + H / 2, 0);

        // Pasillo y almenas en ambas direcciones
        add(new THREE.BoxGeometry(S, 0.15, S + 0.3), mat.stoneDark,
            0, foundH + H - 0.075, 0);

        const merlonW = 0.5, merlonH = 0.8;
        const positions = [
            [-S / 2 + 0.25, 0], [S / 2 - 0.25, 0],
            [0, -S / 2 + 0.25], [0, S / 2 - 0.25]
        ];
        for (const [px, pz] of positions) {
            add(new THREE.BoxGeometry(merlonW, merlonH, merlonW), mat.stone,
                px, foundH + H + merlonH / 2, pz);
        }

        group.position.set(this.centerX, 0, this.centerY);
        //group.position.set(this.x + S / 2, 0, this.y + S / 2);
        group.rotation.y = this.rotation ?? 0;
        group.name = `CastleCorner_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }
}

/**
 * Muro con hueco para puerta (no incluye la puerta).
 */
export class CastleWallGate extends CastlePiece {
    constructor(x, y, options = {}) {
        const length = options.length ?? 4;
        super(x, y, length, 1, options);
        this.length = length;
        this.height = options.height ?? 4.5;
        this.thickness = options.thickness ?? 0.8;
        this.gateWidth = options.gateWidth ?? 2;
        this.gateHeight = options.gateHeight ?? 3;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const L = this.length, H = this.height, T = this.thickness;
        const GW = this.gateWidth, GH = this.gateHeight;
        const foundH = 0.3;

        // Cimiento completo
        add(new THREE.BoxGeometry(L + 0.2, foundH, T + 0.4), mat.stoneDark,
            0, foundH / 2, 0);

        // Muro izquierdo
        const sideW = (L - GW) / 2;
        if (sideW > 0.01) {
            add(new THREE.BoxGeometry(sideW, H, T), mat.stone,
                -L / 2 + sideW / 2, foundH + H / 2, 0);
            add(new THREE.BoxGeometry(sideW, H, T), mat.stone,
                L / 2 - sideW / 2, foundH + H / 2, 0);
        }

        // Dintel sobre la puerta
        const lintelH = H - GH;
        if (lintelH > 0.01) {
            add(new THREE.BoxGeometry(GW + 0.4, lintelH, T), mat.stone,
                0, foundH + GH + lintelH / 2, 0);
        }

        // Arco de piedra
        add(new THREE.BoxGeometry(GW + 0.6, 0.3, T + 0.3), mat.stoneDark,
            0, foundH + GH + 0.15, 0);

        // Almenas laterales
        const merlonW = 0.5, merlonH = 0.8;
        for (const side of [-1, 1]) {
            const baseX = side * L / 2 - side * sideW / 2;
            const count = Math.max(1, Math.floor(sideW / 1.1));
            for (let i = 0; i < count; i++) {
                add(new THREE.BoxGeometry(merlonW, merlonH, T * 0.8), mat.stone,
                    baseX + side * (sideW / (count + 1)) * (i + 1) - side * sideW / 2,
                    foundH + H + merlonH / 2, 0);
            }
        }

        group.position.set(this.centerX, 0, this.centerY);
        //group.position.set(this.x + L / 2, 0, this.y + 0.5);
        group.rotation.y = this.rotation ?? 0;
        group.name = `CastleWallGate_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }
}

// ============================================================
// Torres
// ============================================================

/**
 * Torre circular con almenas superiores.
 * @typedef {Object} CastleRoundTowerOptions
 * @property {number} [radius=2]
 * @property {number} [height=8]
 * @property {number} [segments=16]
 * @property {boolean} [battlements=true]
 */
export class CastleRoundTower extends CastlePiece {
    constructor(x, y, options = {}) {
        const radius = options.radius ?? 2;
        super(x, y, radius * 2, radius * 2, options);
        this.radius = radius;
        this.height = options.height ?? 8;
        this.segments = options.segments ?? 16;
        this.battlements = options.battlements ?? true;
    }

    occupies(tx, ty) {
        if (!this.blocksMovement) return false;
        const cx = tx + 0.5 - (this.x + this.radius);
        const cy = ty + 0.5 - (this.y + this.radius);
        return cx * cx + cy * cy <= this.radius * this.radius;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const R = this.radius, H = this.height, S = this.segments;
        const foundH = 0.4;

        // Base ligeramente más ancha
        add(new THREE.CylinderGeometry(R + 0.25, R + 0.35, foundH, S), mat.stoneDark,
            0, foundH / 2, 0);

        // Cuerpo
        add(new THREE.CylinderGeometry(R, R + 0.05, H, S), mat.stone,
            0, foundH + H / 2, 0);

        // Cornisa superior
        add(new THREE.CylinderGeometry(R + 0.3, R + 0.3, 0.2, S), mat.stoneDark,
            0, foundH + H + 0.1, 0);

        // Techo cónico
        add(new THREE.ConeGeometry(R + 0.35, R * 0.9, S), mat.oak,
            0, foundH + H + 0.2 + R * 0.45, 0);

        // Almenas
        if (this.battlements) {
            const count = Math.max(6, Math.floor(S * 0.75));
            for (let i = 0; i < count; i++) {
                const a = (i / count) * Math.PI * 2;
                const bx = Math.cos(a) * (R + 0.2);
                const bz = Math.sin(a) * (R + 0.2);
                add(new THREE.BoxGeometry(0.45, 0.75, 0.45), mat.stone,
                    bx, foundH + H + 0.57, bz);
            }
        }

        // Ventanas (huecos oscuros)
        const windowMat = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a, roughness: 1
        });
        for (let i = 0; i < 3; i++) {
            const a = (i / 3) * Math.PI * 2;
            const wy = foundH + H * (0.4 + i * 0.18);
            add(new THREE.BoxGeometry(0.3, 0.8, 0.15), windowMat,
                Math.cos(a) * (R + 0.02), wy, Math.sin(a) * (R + 0.02));
        }

        group.position.set(this.centerX, 0, this.centerY);
        //group.position.set(this.x + R, 0, this.y + R);
        group.rotation.y = this.rotation ?? 0;
        group.name = `CastleRoundTower_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }
}

/**
 * Torre cuadrada.
 */
export class CastleSquareTower extends CastlePiece {
    constructor(x, y, options = {}) {
        const size = options.size ?? 3;
        super(x, y, size, size, options);
        this.size = size;
        this.height = options.height ?? 7;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const S = this.size, H = this.height;
        const foundH = 0.4;

        add(new THREE.BoxGeometry(S + 0.4, foundH, S + 0.4), mat.stoneDark,
            0, foundH / 2, 0);
        add(new THREE.BoxGeometry(S, H, S), mat.stone,
            0, foundH + H / 2, 0);
        add(new THREE.BoxGeometry(S + 0.5, 0.2, S + 0.5), mat.stoneDark,
            0, foundH + H + 0.1, 0);

        // Techo piramidal
        const roofH = S * 0.7;
        const roofGeo = new THREE.ConeGeometry(S * 0.7, roofH, 4);
        const roof = add(roofGeo, mat.oak, 0, foundH + H + 0.2 + roofH / 2, 0);
        roof.rotation.y = Math.PI / 4;

        // Almenas en las 4 esquinas
        for (const [dx, dz] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
            add(new THREE.BoxGeometry(0.5, 0.8, 0.5), mat.stone,
                dx * (S / 2 - 0.25),
                foundH + H + 0.6,
                dz * (S / 2 - 0.25));
        }

        // Almenas centrales de cada lado
        for (const [dx, dz] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
            add(new THREE.BoxGeometry(0.45, 0.7, 0.45), mat.stone,
                dx * S / 2, foundH + H + 0.55, dz * S / 2);
        }

        group.position.set(this.centerX, 0, this.centerY);
        //group.position.set(this.x + S / 2, 0, this.y + S / 2);
        group.rotation.y = this.rotation ?? 0;
        group.name = `CastleSquareTower_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }
}

/**
 * Torreón principal (Keep) — más grande, varios pisos, puerta en la base.
 */
export class CastleKeep extends CastlePiece {
    constructor(x, y, options = {}) {
        const size = options.size ?? 5;
        super(x, y, size, size, options);
        this.size = size;
        this.height = options.height ?? 12;
        this.floors = options.floors ?? 3;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const S = this.size, H = this.height;
        const foundH = 0.5;

        // Base reforzada
        add(new THREE.BoxGeometry(S + 0.6, foundH, S + 0.6), mat.stoneDark,
            0, foundH / 2, 0);

        // Cuerpo principal
        add(new THREE.BoxGeometry(S, H, S), mat.stone,
            0, foundH + H / 2, 0);

        // Cornisas entre pisos
        const floorH = H / this.floors;
        for (let i = 1; i < this.floors; i++) {
            add(new THREE.BoxGeometry(S + 0.2, 0.15, S + 0.2), mat.stoneDark,
                0, foundH + i * floorH, 0);
        }

        // Cornisa superior + almenas
        add(new THREE.BoxGeometry(S + 0.4, 0.2, S + 0.4), mat.stoneDark,
            0, foundH + H + 0.1, 0);

        const merlonCount = Math.max(4, Math.floor(S / 1.0));
        for (let i = 0; i < merlonCount; i++) {
            const t = (i / (merlonCount - 1)) * (S - 0.5) - (S - 0.5) / 2;
            for (const side of [-1, 1]) {
                add(new THREE.BoxGeometry(0.5, 0.8, 0.5), mat.stone,
                    t, foundH + H + 0.6, side * S / 2);
                if (Math.abs(t) < S / 2 - 0.5) {
                    add(new THREE.BoxGeometry(0.5, 0.8, 0.5), mat.stone,
                        side * S / 2, foundH + H + 0.6, t);
                }
            }
        }

        // Puerta en la base (lado frontal)
        const doorW = S * 0.35, doorH = H * 0.25;
        add(new THREE.BoxGeometry(doorW, doorH, 0.15), mat.oak,
            0, foundH + doorH / 2, S / 2 + 0.07);
        add(new THREE.BoxGeometry(doorW + 0.3, 0.25, 0.3), mat.stoneDark,
            0, foundH + doorH + 0.12, S / 2 + 0.15);

        // Ventanas de cada piso
        const windowMat = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a, roughness: 1
        });
        for (let f = 0; f < this.floors; f++) {
            const wy = foundH + f * floorH + floorH / 2;
            for (const side of [-1, 1]) {
                // Laterales
                add(new THREE.BoxGeometry(0.15, 0.9, 0.3), windowMat,
                    side * (S / 2 + 0.02), wy, 0);
                add(new THREE.BoxGeometry(0.3, 0.9, 0.15), windowMat,
                    0, wy, side * (S / 2 + 0.02));
            }
        }

        // Techo piramidal
        const roofH = S * 0.8;
        const roofGeo = new THREE.ConeGeometry(S * 0.75, roofH, 4);
        const roof = add(roofGeo, mat.oak,
            0, foundH + H + 0.2 + roofH / 2, 0);
        roof.rotation.y = Math.PI / 4;

        group.position.set(this.centerX, 0, this.centerY);
        //group.position.set(this.x + S / 2, 0, this.y + S / 2);
        group.rotation.y = this.rotation ?? 0;
        group.name = `CastleKeep_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }
}

// ============================================================
// Puertas
// ============================================================

/**
 * Puerta de madera con arco.
 */
export class CastleGate extends CastlePiece {
    constructor(x, y, options = {}) {
        const width = options.width ?? 2;
        super(x, y, width, 1, options);
        this.gateWidth = width;
        this.gateHeight = options.height ?? 3;
        this.open = false;
        this.onInteract = options.onInteract ?? null;
    }

    occupies(tx, ty) {
        if (!this.blocksMovement || this.open) return false;
        return super.occupies(tx, ty);
    }

    toggle() {
        this.open = !this.open;
        if (this._doorL && this._doorR) {
            const target = this.open ? Math.PI / 2.2 : 0;
            this._doorL.userData.target = target;
            this._doorR.userData.target = -target;
        }
        this.onInteract?.(this, { type: "gate", open: this.open });
        return this.open;
    }

    update() {
        if (!this._doorL || !this._doorR) return;
        for (const door of [this._doorL, this._doorR]) {
            const t = door.userData.target ?? 0;
            door.rotation.y += (t - door.rotation.y) * 0.15;
        }
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const W = this.gateWidth, H = this.gateHeight;

        // Postes laterales de piedra
        const postW = 0.4;
        add(new THREE.BoxGeometry(postW, H + 0.5, 1), mat.stoneDark,
            -W / 2 - postW / 2, H / 2 + 0.25, 0);
        add(new THREE.BoxGeometry(postW, H + 0.5, 1), mat.stoneDark,
            W / 2 + postW / 2, H / 2 + 0.25, 0);

        // Dintel con arco
        add(new THREE.BoxGeometry(W + postW * 2, 0.4, 1), mat.stoneDark,
            0, H + 0.45, 0);

        // Hojas de puerta (dos mitades)
        const pivotL = new THREE.Group();
        pivotL.position.set(-W / 2, 0, 0);
        pivotL.userData.target = 0;
        group.add(pivotL);
        this._doorL = pivotL;

        const pivotR = new THREE.Group();
        pivotR.position.set(W / 2, 0, 0);
        pivotR.userData.target = 0;
        group.add(pivotR);
        this._doorR = pivotR;

        add(new THREE.BoxGeometry(W / 2, H, 0.12), mat.oak,
            W / 4, H / 2, 0, pivotL);
        add(new THREE.BoxGeometry(W / 2, H, 0.12), mat.oak,
            -W / 4, H / 2, 0, pivotR);

        // Herrajes de hierro
        const bandCount = 3;
        for (let i = 0; i < bandCount; i++) {
            const by = H * (0.25 + i * 0.25);
            add(new THREE.BoxGeometry(W / 2, 0.08, 0.14), mat.iron,
                W / 4, by, 0.07, pivotL);
            add(new THREE.BoxGeometry(W / 2, 0.08, 0.14), mat.iron,
                -W / 4, by, 0.07, pivotR);
        }

        group.position.set(this.centerX, 0, this.centerY);
        //group.position.set(this.x + W / 2, 0, this.y + 0.5);
        group.rotation.y = this.rotation ?? 0;
        group.name = `CastleGate_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }
}

/**
 * Rastrillo de hierro (reja vertical).
 */
export class CastlePortcullis extends CastlePiece {
    constructor(x, y, options = {}) {
        const width = options.width ?? 2;
        super(x, y, width, 1, options);
        this.gateWidth = width;
        this.gateHeight = options.height ?? 3.5;
        this.raised = false;
        this.onInteract = options.onInteract ?? null;
    }

    occupies(tx, ty) {
        if (!this.blocksMovement || this.raised) return false;
        return super.occupies(tx, ty);
    }

    toggle() {
        this.raised = !this.raised;
        if (this._grate) {
            this._grate.userData.target = this.raised ? this.gateHeight * 0.9 : 0;
        }
        this.onInteract?.(this, { type: "portcullis", raised: this.raised });
        return this.raised;
    }

    update() {
        if (!this._grate) return;
        const t = this._grate.userData.target ?? 0;
        this._grate.position.y += (t - this._grate.position.y) * 0.12;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const W = this.gateWidth, H = this.gateHeight;

        // Postes
        const postW = 0.5;
        add(new THREE.BoxGeometry(postW, H + 1, 1), mat.stoneDark,
            -W / 2 - postW / 2, H / 2 + 0.5, 0);
        add(new THREE.BoxGeometry(postW, H + 1, 1), mat.stoneDark,
            W / 2 + postW / 2, H / 2 + 0.5, 0);
        add(new THREE.BoxGeometry(W + postW * 2, 0.5, 1), mat.stoneDark,
            0, H + 0.75, 0);

        // Reja (grupo que se eleva)
        const grate = new THREE.Group();
        grate.userData.target = 0;
        group.add(grate);
        this._grate = grate;

        // Barras verticales
        const barCount = Math.floor(W / 0.25);
        for (let i = 0; i < barCount; i++) {
            const bx = -W / 2 + (i + 0.5) * (W / barCount);
            add(new THREE.CylinderGeometry(0.04, 0.04, H, 6), mat.iron,
                bx, H / 2, 0, grate);
        }
        // Barras horizontales
        for (let i = 0; i < 3; i++) {
            add(new THREE.CylinderGeometry(0.05, 0.05, W, 6), mat.iron,
                0, H * (0.25 + i * 0.25), 0, grate);
            // rotar 90°
            grate.children[grate.children.length - 1].rotation.z = Math.PI / 2;
        }
        // Punta inferior
        for (let i = 0; i < barCount; i++) {
            const bx = -W / 2 + (i + 0.5) * (W / barCount);
            add(new THREE.ConeGeometry(0.05, 0.15, 6), mat.iron,
                bx, -0.07, 0, grate);
        }

        group.position.set(this.centerX, 0, this.centerY);
        //group.position.set(this.x + W / 2, 0, this.y + 0.5);
        group.rotation.y = this.rotation ?? 0;
        group.name = `CastlePortcullis_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }
}

// ============================================================
// Terreno
// ============================================================

/**
 * Foso de agua (bloquea movimiento).
 */
export class CastleMoat extends CastlePiece {
    constructor(x, y, options = {}) {
        const width = options.width ?? 8;
        const depth = options.depth ?? 2;
        super(x, y, width, depth, options);
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        add(new THREE.BoxGeometry(this.w, 0.05, this.h), mat.water,
            0, -0.1, 0);

        // Bordes de piedra
        add(new THREE.BoxGeometry(this.w + 0.2, 0.3, 0.3), mat.stoneDark,
            0, 0, this.h / 2);
        add(new THREE.BoxGeometry(this.w + 0.2, 0.3, 0.3), mat.stoneDark,
            0, 0, -this.h / 2);

        group.position.set(this.centerX, 0, this.centerY);
            //group.position.set(this.x + this.w / 2, 0, this.y + this.h / 2);
        group.rotation.y = this.rotation ?? 0;
        group.name = `CastleMoat_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }
}

/**
 * Puente de piedra (no bloquea movimiento).
 */
export class CastleBridge extends CastlePiece {
    constructor(x, y, options = {}) {
        super(x, y, options.width ?? 4, options.depth ?? 2, { ...options, blocks: false });
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        add(new THREE.BoxGeometry(this.w, 0.25, this.h), mat.stone,
            0, 0.12, 0);
        // Barandillas
        add(new THREE.BoxGeometry(this.w, 0.6, 0.15), mat.stoneDark,
            0, 0.55, this.h / 2);
        add(new THREE.BoxGeometry(this.w, 0.6, 0.15), mat.stoneDark,
            0, 0.55, -this.h / 2);

        group.position.set(this.centerX, 0, this.centerY);
            //group.position.set(this.x + this.w / 2, 0, this.y + this.h / 2);
        group.rotation.y = this.rotation ?? 0;
        group.name = `CastleBridge_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }
}

// ============================================================
// Decoración
// ============================================================

/**
 * Bandera ondeante sobre asta.
 */
export class CastleBanner extends CastlePiece {
    constructor(x, y, options = {}) {
        super(x, y, 1, 1, { ...options, blocks: false });
        this.bannerColor = options.bannerColor ?? 0xc03030;
        this.height = options.height ?? 3;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const H = this.height;

        // Asta
        add(new THREE.CylinderGeometry(0.04, 0.05, H, 8), mat.iron,
            0, H / 2, 0);

        // Base de piedra
        add(new THREE.BoxGeometry(0.4, 0.2, 0.4), mat.stoneDark,
            0, 0.1, 0);

        // Bandera (plano subdividido para futura animación)
        const flagGeo = new THREE.PlaneGeometry(0.8, 0.5, 6, 3);
        const flag = add(flagGeo, mat.banner(this.bannerColor),
            0.4, H - 0.3, 0);
        flag.userData.baseGeo = flagGeo.clone();
        this._flag = flag;

        group.position.set(this.centerX, 0, this.centerY);
        //group.position.set(this.x + 0.5, 0, this.y + 0.5);
        group.rotation.y = this.rotation ?? 0;
        group.name = `CastleBanner_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }

    update() {
        if (!this._flag) return;
        const t = performance.now() / 1000;
        const pos = this._flag.geometry.attributes.position;
        const base = this._flag.userData.baseGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = base.getX(i);
            const wave = Math.sin(x * 4 + t * 3) * 0.05 * (x + 0.4);
            pos.setZ(i, base.getZ(i) + wave);
        }
        pos.needsUpdate = true;
    }
}

/**
 * Antorcha con luz puntual.
 */
export class CastleTorch extends CastlePiece {
    constructor(x, y, options = {}) {
        super(x, y, 1, 1, { ...options, blocks: false });
        this.lightColor = options.lightColor ?? 0xff9944;
        this.lightIntensity = options.lightIntensity ?? 1.2;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        // Soporte de hierro
        add(new THREE.BoxGeometry(0.1, 0.5, 0.1), mat.iron, 0, 1.4, 0);
        add(new THREE.BoxGeometry(0.3, 0.08, 0.1), mat.iron, 0.1, 1.55, 0);

        // Antorcha (mango)
        add(new THREE.CylinderGeometry(0.04, 0.05, 0.5, 6), mat.oak,
            0.2, 1.7, 0);

        // Llama (cono emisivo)
        const flame = add(new THREE.ConeGeometry(0.08, 0.2, 8), mat.flame,
            0.2, 2.05, 0);
        this._flame = flame;

        // Luz puntual
        const light = new THREE.PointLight(this.lightColor, this.lightIntensity, 6);
        light.position.set(0.2, 2.1, 0);
        group.add(light);

        group.position.set(this.centerX, 0, this.centerY);
        //group.position.set(this.x + 0.5, 0, this.y + 0.5);
        group.rotation.y = this.rotation ?? 0;
        group.name = `CastleTorch_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }

    update() {
        if (!this._flame) return;
        const t = performance.now() / 1000;
        this._flame.scale.y = 1 + Math.sin(t * 8) * 0.15;
        this._flame.scale.x = 1 + Math.cos(t * 7) * 0.1;
    }
}

// ============================================================
// HELPER: construye un castillo ejemplo usando las piezas
// ============================================================

/**
 * Construye un castillo rectangular ejemplo usando map.place().
 *
 * @param {GameMap} map
 * @param {number} baseX - Coordenada X base del castillo
 * @param {number} baseY - Coordenada Y base del castillo
 * @param {Object} [opts] - { width: 16, depth: 14, wallHeight: 4.5 }
 * @returns {{ pieces: CastlePiece[], interact: () => void }}
 */
export function buildSampleCastle(map, baseX, baseY, opts = {}) {
    const W = opts.width ?? 16;
    const D = opts.depth ?? 14;
    const H = opts.wallHeight ?? 4.5;
    const pieces = [];

    const place = (piece) => { map.place(piece); pieces.push(piece); };

    // Torres en las 4 esquinas
    place(new CastleRoundTower(baseX, baseY, { radius: 2, height: 8, seed: 1001 }));
    place(new CastleRoundTower(baseX + W - 4, baseY, { radius: 2, height: 8, seed: 1002 }));
    place(new CastleRoundTower(baseX, baseY + D - 4, { radius: 2, height: 8, seed: 1003 }));
    place(new CastleRoundTower(baseX + W - 4, baseY + D - 4, { radius: 2, height: 8, seed: 1004 }));

    // Muros norte y sur (con puerta al sur)
    place(new CastleWall(baseX + 4, baseY + 1, { length: W - 8, height: H }));
    // Muro sur: dividido en dos tramos por la puerta
    place(new CastleWall(baseX + 4, baseY + D - 2, { length: (W - 8) / 2 - 1.5, height: H }));
    place(new CastleWall(baseX + 4 + (W - 8) / 2 + 1.5, baseY + D - 2, {
        length: (W - 8) / 2 - 1.5, height: H
    }));

    // Muros este y oeste
    place(new CastleWall(baseX + W - 2, baseY + 4, {
        length: D - 8, height: H, rotation: Math.PI / 2
    }));
    place(new CastleWall(baseX + 1, baseY + 4, {
        length: D - 8, height: H, rotation: Math.PI / 2
    }));

    // Puerta principal (al sur, centrada)
    const gate = new CastleGate(
        baseX + W / 2 - 1,
        baseY + D - 1.5,
        { width: 2, height: 3.5, seed: 2001 }
    );
    place(gate);

    // Foso alrededor
    place(new CastleMoat(baseX - 2, baseY - 2, { width: W + 4, depth: 2 }));
    place(new CastleMoat(baseX - 2, baseY + D, { width: W + 4, depth: 2 }));
    place(new CastleMoat(baseX - 2, baseY, { width: 2, depth: D }));
    place(new CastleMoat(baseX + W, baseY, { width: 2, depth: D }));

    // Puente sobre el foso (frente a la puerta)
    place(new CastleBridge(baseX + W / 2 - 1, baseY + D, { width: 2, depth: 2 }));

    // Torreón central (Keep)
    place(new CastleKeep(baseX + W / 2 - 2.5, baseY + D / 2 - 2.5, {
        size: 5, height: 12, floors: 3, seed: 3001
    }));

    // Banderas en las torres
    place(new CastleBanner(baseX + 1, baseY + 1, { bannerColor: 0xc03030, height: 3 }));
    place(new CastleBanner(baseX + W - 2, baseY + 1, { bannerColor: 0xc03030, height: 3 }));

    // Antorchas junto a la puerta
    place(new CastleTorch(baseX + W / 2 - 2.5, baseY + D - 2));
    place(new CastleTorch(baseX + W / 2 + 1.5, baseY + D - 2));

    return {
        pieces,
        gate,
        interact: () => gate.toggle(),
        update: () => pieces.forEach(p => p.update?.())
    };
}