import { VillageObject } from "../WorldObjectModels.js";
// @ts-ignore
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";
// ============================================================
// TEXTURAS COMPARTIDAS (cache por engine)
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

    // Madera rústica (cajas, barriles)
    const woodRustic = makeCanvas(128, 128, (ctx, w, h) => {
        ctx.fillStyle = "#8a6a42"; ctx.fillRect(0, 0, w, h);
        const planks = 6, pw = w / planks;
        for (let i = 0; i < planks; i++) {
            const shade = Math.floor(Math.random() * 24 - 12);
            ctx.fillStyle = `rgb(${138 + shade},${106 + shade},${66 + shade})`;
            ctx.fillRect(i * pw + 1, 0, pw - 2, h);
            ctx.strokeStyle = "#3a2818"; ctx.lineWidth = 1.5;
            ctx.strokeRect(i * pw + 1, 0, pw - 2, h);
            for (let v = 0; v < 12; v++) {
                ctx.strokeStyle = `rgba(50,30,15,${0.1 + Math.random() * 0.15})`;
                ctx.lineWidth = 0.5;
                const yy = Math.random() * h;
                ctx.beginPath(); ctx.moveTo(i * pw + 2, yy);
                ctx.lineTo((i + 1) * pw - 2, yy + (Math.random() - 0.5) * 6);
                ctx.stroke();
            }
        }
    });

    // Madera clara (mesas, sillas)
    const woodLight = makeCanvas(128, 128, (ctx, w, h) => {
        ctx.fillStyle = "#b8956a"; ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < 2000; i++) {
            const v = Math.random() * 30 - 15;
            ctx.fillStyle = `rgba(${160 + v},${130 + v},${90 + v},0.2)`;
            ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
        }
    });

    // Metal oscuro (herrajes)
    const metalDark = makeCanvas(64, 64, (ctx, w, h) => {
        ctx.fillStyle = "#3a3a3e"; ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < 800; i++) {
            const v = Math.random() * 30 - 15;
            ctx.fillStyle = `rgba(${80 + v},${80 + v},${84 + v},0.3)`;
            ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
        }
    });

    // Tela/lino (toldos, sacos)
    const fabric = makeCanvas(128, 128, (ctx, w, h) => {
        ctx.fillStyle = "#d4c8a8"; ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < 3000; i++) {
            const v = Math.random() * 40 - 20;
            ctx.fillStyle = `rgba(${180 + v},${170 + v},${140 + v},0.15)`;
            ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
        }
        // Tejido visible
        ctx.strokeStyle = "rgba(100,90,70,0.08)"; ctx.lineWidth = 0.5;
        for (let i = 0; i < w; i += 4) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
        }
    });

    // Piedra rústica
    const stoneRustic = makeCanvas(128, 128, (ctx, w, h) => {
        ctx.fillStyle = "#9a958a"; ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < 40; i++) {
            const x = Math.random() * w, y = Math.random() * h;
            const r = 6 + Math.random() * 16;
            const shade = 120 + Math.floor(Math.random() * 40);
            ctx.fillStyle = `rgb(${shade},${shade - 5},${shade - 10})`;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = "#5a5650"; ctx.lineWidth = 1; ctx.stroke();
        }
    });

    const textures = { woodRustic, woodLight, metalDark, fabric, stoneRustic };
    _sharedCache.set(THREE, textures);
    return textures;
}

function sharedMaterials(THREE, colors = {}) {
    const tex = getSharedTextures(THREE);
    return {
        woodRustic: new THREE.MeshStandardMaterial({
            map: tex.woodRustic,
            color: colors.woodRustic ?? 0x9a7a52,
            roughness: 0.85
        }),
        woodLight: new THREE.MeshStandardMaterial({
            map: tex.woodLight,
            color: colors.woodLight ?? 0xc8a878,
            roughness: 0.75
        }),
        metalDark: new THREE.MeshStandardMaterial({
            map: tex.metalDark,
            color: colors.metalDark ?? 0x3a3a3e,
            roughness: 0.5,
            metalness: 0.7
        }),
        fabric: new THREE.MeshStandardMaterial({
            map: tex.fabric,
            color: colors.fabric ?? 0xe8dcc0,
            roughness: 0.9,
            side: THREE.DoubleSide
        }),
        fabricRed: new THREE.MeshStandardMaterial({
            map: tex.fabric,
            color: colors.fabricRed ?? 0xc84848,
            roughness: 0.9,
            side: THREE.DoubleSide
        }),
        fabricBlue: new THREE.MeshStandardMaterial({
            map: tex.fabric,
            color: colors.fabricBlue ?? 0x4868c8,
            roughness: 0.9,
            side: THREE.DoubleSide
        }),
        stoneRustic: new THREE.MeshStandardMaterial({
            map: tex.stoneRustic,
            color: colors.stoneRustic ?? 0xb0a898,
            roughness: 0.95
        }),
        leather: new THREE.MeshStandardMaterial({
            color: colors.leather ?? 0x6a4a2a,
            roughness: 0.8
        }),
        rope: new THREE.MeshStandardMaterial({
            color: colors.rope ?? 0xb89870,
            roughness: 0.95
        }),
        grain: new THREE.MeshStandardMaterial({
            color: colors.grain ?? 0xd4b878,
            roughness: 0.95
        })
    };
}

const addMeshFactory = () => (group) => (geo, mat, x, y, z, parent = group) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
};

// ============================================================
// CAJAS Y CONTENEDORES
// ============================================================

/**
 * Caja de madera (varios tamaños y apilable).
 * @typedef {Object} WoodenCrateOptions
 * @property {number} [size=0.8]     - Lado de la caja
 * @property {boolean} [open=false]  - Tapa abierta
 */
export class WoodenCrate extends VillageObject {
    constructor(x, y, options = {}) {
        const size = options.size ?? 0.8;
        super(x, y, size, size, options);
        this.size = size;
        this.open = options.open ?? false;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const S = this.size;

        // Cuerpo de la caja
        add(new THREE.BoxGeometry(S, S, S), mat.woodRustic, 0, S / 2, 0);

        // Refuerzos metálicos en las esquinas
        const cornerSize = S * 0.08;
        for (const dx of [-1, 1]) {
            for (const dz of [-1, 1]) {
                add(new THREE.BoxGeometry(cornerSize, S + 0.02, cornerSize), mat.metalDark,
                    dx * S / 2, S / 2, dz * S / 2);
            }
        }

        // Tapa (abierta o cerrada)
        if (!this.open) {
            add(new THREE.BoxGeometry(S + 0.02, 0.06, S + 0.02), mat.woodRustic,
                0, S + 0.03, 0);
        } else {
            // Tapa inclinada hacia atrás
            const lid = add(new THREE.BoxGeometry(S + 0.02, 0.06, S + 0.02), mat.woodRustic,
                0, S + 0.15, -S / 2 - 0.05);
            lid.rotation.x = -0.6;
        }

        group.position.set(this.centerX, 0, this.centerY);
        group.rotation.y = this.rotation ?? 0;
        group.name = `WoodenCrate_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }
}

/**
 * Barril de madera con aros de metal.
 */
export class WoodenBarrel extends VillageObject {
    constructor(x, y, options = {}) {
        const radius = options.radius ?? 0.4;
        super(x, y, radius * 2, radius * 2, options);
        this.radius = radius;
        this.height = options.height ?? radius * 2.5;
        this.content = options.content ?? null; // "wine", "grain", null
    }

    occupies(tx, ty) {
        if (!this.blocksMovement) return false;
        const cx = tx + 0.5 - this.centerX;
        const cy = ty + 0.5 - this.centerY;
        return cx * cx + cy * cy <= this.radius * this.radius;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const R = this.radius, H = this.height;

        // Cuerpo del barril (ligeramente abombado)
        const barrelGeo = new THREE.CylinderGeometry(R * 0.92, R * 0.92, H, 12);
        const pos = barrelGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const y = pos.getY(i);
            const bulge = 1 + Math.sin((y / H + 0.5) * Math.PI) * 0.08;
            pos.setX(i, pos.getX(i) * bulge);
            pos.setZ(i, pos.getZ(i) * bulge);
        }
        barrelGeo.computeVertexNormals();
        add(barrelGeo, mat.woodRustic, 0, H / 2, 0);

        // Aros de metal
        const bandPositions = [0.15, 0.5, 0.85];
        for (const t of bandPositions) {
            const bandGeo = new THREE.TorusGeometry(R * 0.94, 0.025, 6, 12);
            const band = add(bandGeo, mat.metalDark, 0, H * t, 0);
            band.rotation.x = Math.PI / 2;
        }

        // Contenido visible (si está abierto)
        if (this.content === "grain") {
            add(new THREE.CylinderGeometry(R * 0.85, R * 0.85, 0.1, 12), mat.grain,
                0, H - 0.1, 0);
        }

        group.position.set(this.centerX, 0, this.centerY);
        group.rotation.y = this.rotation ?? 0;
        group.name = `WoodenBarrel_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }
}

/**
 * Saco de grano o harina.
 */
export class GrainSack extends VillageObject {
    constructor(x, y, options = {}) {
        super(x, y, 0.7, 0.7, options);
        this.height = options.height ?? 0.9;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const H = this.height;

        // Cuerpo del saco (forma irregular)
        const sackGeo = new THREE.CylinderGeometry(0.28, 0.32, H, 8, 4);
        const pos = sackGeo.attributes.position;
        const rnd = this._rng();
        for (let i = 0; i < pos.count; i++) {
            const y = pos.getY(i);
            const bulge = 1 + Math.sin((y / H + 0.5) * Math.PI) * 0.15;
            const noise = 1 + (rnd() - 0.5) * 0.1;
            pos.setX(i, pos.getX(i) * bulge * noise);
            pos.setZ(i, pos.getZ(i) * bulge * noise);
        }
        sackGeo.computeVertexNormals();
        add(sackGeo, mat.fabric, 0, H / 2, 0);

        // Atadura en la parte superior
        const rope = add(new THREE.TorusGeometry(0.18, 0.02, 6, 8), mat.rope,
            0, H - 0.08, 0);
        rope.rotation.x = Math.PI / 2;

        group.position.set(this.centerX, 0, this.centerY);
        group.rotation.y = this.rotation ?? 0;
        group.name = `GrainSack_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }
}

// ============================================================
// MOBILIARIO
// ============================================================

/**
 * Mesa de madera rústica.
 */
export class WoodenTable extends VillageObject {
    constructor(x, y, options = {}) {
        const width = options.width ?? 1.6;
        const depth = options.depth ?? 0.9;
        super(x, y, width, depth, options);
        this.tableWidth = width;
        this.tableDepth = depth;
        this.tableHeight = options.height ?? 0.85;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const W = this.tableWidth, D = this.tableDepth, H = this.tableHeight;

        // Tablero
        add(new THREE.BoxGeometry(W, 0.08, D), mat.woodLight, 0, H, 0);

        // Patas
        const legW = 0.08;
        for (const dx of [-1, 1]) {
            for (const dz of [-1, 1]) {
                add(new THREE.BoxGeometry(legW, H, legW), mat.woodRustic,
                    dx * (W / 2 - legW), H / 2, dz * (D / 2 - legW));
            }
        }

        // Travesaños
        add(new THREE.BoxGeometry(W - legW * 2, 0.06, 0.06), mat.woodRustic,
            0, H * 0.35, 0);

        group.position.set(this.centerX, 0, this.centerY);
        group.rotation.y = this.rotation ?? 0;
        group.name = `WoodenTable_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }
}

/**
 * Silla/banco de madera.
 */
export class WoodenChair extends VillageObject {
    constructor(x, y, options = {}) {
        super(x, y, 0.5, 0.5, options);
        this.hasBack = options.hasBack ?? true;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const seatH = 0.5;

        // Asiento
        add(new THREE.BoxGeometry(0.45, 0.06, 0.45), mat.woodLight, 0, seatH, 0);

        // Patas
        for (const dx of [-1, 1]) {
            for (const dz of [-1, 1]) {
                add(new THREE.BoxGeometry(0.06, seatH, 0.06), mat.woodRustic,
                    dx * 0.18, seatH / 2, dz * 0.18);
            }
        }

        // Respaldo
        if (this.hasBack) {
            add(new THREE.BoxGeometry(0.45, 0.55, 0.06), mat.woodLight,
                0, seatH + 0.275, -0.2);

            // Travesaños del respaldo
            add(new THREE.BoxGeometry(0.06, 0.45, 0.04), mat.woodRustic,
                -0.12, seatH + 0.25, -0.2);
            add(new THREE.BoxGeometry(0.06, 0.45, 0.04), mat.woodRustic,
                0.12, seatH + 0.25, -0.2);
        }

        group.position.set(this.centerX, 0, this.centerY);
        group.rotation.y = this.rotation ?? 0;
        group.name = `WoodenChair_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }
}

/**
 * Banco largo (para taberna o mesa comunal).
 */
export class WoodenBench extends VillageObject {
    constructor(x, y, options = {}) {
        const length = options.length ?? 2;
        super(x, y, length, 0.5, options);
        this.benchLength = length;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const L = this.benchLength;
        const seatH = 0.5;

        // Asiento largo
        add(new THREE.BoxGeometry(L, 0.08, 0.4), mat.woodLight, 0, seatH, 0);

        // Patas (3 o más según longitud)
        const legCount = Math.max(2, Math.floor(L / 0.8));
        for (let i = 0; i < legCount; i++) {
            const lx = -L / 2 + (L / (legCount - 1)) * i;
            add(new THREE.BoxGeometry(0.08, seatH, 0.35), mat.woodRustic,
                lx, seatH / 2, 0);
        }

        group.position.set(this.centerX, 0, this.centerY);
        group.rotation.y = this.rotation ?? 0;
        group.name = `WoodenBench_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }
}

// ============================================================
// PUESTOS DE MERCADO
// ============================================================

/**
 * Puesto de mercado con toldo.
 */
export class MarketStall extends VillageObject {
    constructor(x, y, options = {}) {
        const width = options.width ?? 3;
        const depth = options.depth ?? 2;
        super(x, y, width, depth, options);
        this.stallWidth = width;
        this.stallDepth = depth;
        this.stallHeight = options.height ?? 2.4;
        this.fabricColor = options.fabricColor ?? "red"; // "red", "blue", "natural"
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const W = this.stallWidth, D = this.stallDepth, H = this.stallHeight;
        const counterH = 1.0;

        // Mostrador
        add(new THREE.BoxGeometry(W, counterH, D * 0.4), mat.woodRustic,
            0, counterH / 2, D * 0.3);

        // Postes de soporte
        const postSize = 0.12;
        for (const dx of [-1, 1]) {
            for (const dz of [-1, 1]) {
                add(new THREE.BoxGeometry(postSize, H, postSize), mat.woodRustic,
                    dx * (W / 2 - postSize / 2),
                    H / 2,
                    dz * (D / 2 - postSize / 2));
            }
        }

        // Toldo (plano inclinado)
        const fabricMat = this.fabricColor === "red" ? mat.fabricRed :
            this.fabricColor === "blue" ? mat.fabricBlue :
                mat.fabric;

        const canopy = add(new THREE.BoxGeometry(W + 0.3, 0.05, D + 0.3), fabricMat,
            0, H - 0.2, 0);
        canopy.rotation.x = 0.15; // Ligera inclinación

        // Borde del toldo (flecos)
        add(new THREE.BoxGeometry(W + 0.3, 0.15, 0.08), fabricMat,
            0, H - 0.35, D / 2 + 0.1);

        group.position.set(this.centerX, 0, this.centerY);
        group.rotation.y = this.rotation ?? 0;
        group.name = `MarketStall_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }
}

/**
 * Toldo independiente (awning) para fachadas.
 */
export class Awning extends VillageObject {
    constructor(x, y, options = {}) {
        const width = options.width ?? 3;
        super(x, y, width, 1, options);
        this.awningWidth = width;
        this.awningDepth = options.depth ?? 1.2;
        this.awningHeight = options.height ?? 2.8;
        this.fabricColor = options.fabricColor ?? "red";
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const W = this.awningWidth, D = this.awningDepth, H = this.awningHeight;

        // Barra de soporte
        add(new THREE.CylinderGeometry(0.04, 0.04, W, 8), mat.metalDark,
            0, H, 0);
        group.children[group.children.length - 1].rotation.z = Math.PI / 2;

        // Toldo (curvado)
        const fabricMat = this.fabricColor === "red" ? mat.fabricRed :
            this.fabricColor === "blue" ? mat.fabricBlue :
                mat.fabric;

        const canopyGeo = new THREE.PlaneGeometry(W, D, 8, 4);
        const pos = canopyGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const z = pos.getY(i);
            const sag = Math.sin((x / W + 0.5) * Math.PI) * 0.15;
            pos.setZ(i, z + sag);
        }
        canopyGeo.computeVertexNormals();

        const canopy = add(canopyGeo, fabricMat, 0, H - 0.1, D / 2);
        canopy.rotation.x = -Math.PI / 2 + 0.2;

        group.position.set(this.centerX, 0, this.centerY);
        group.rotation.y = this.rotation ?? 0;
        group.name = `Awning_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }
}

// ============================================================
// HERRAMIENTAS Y UTENSILIOS
// ============================================================

/**
 * Carreta/carro de madera.
 */
export class WoodenCart extends VillageObject {
    constructor(x, y, options = {}) {
        super(x, y, 2.5, 1.5, options);
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        // Plataforma
        add(new THREE.BoxGeometry(2.2, 0.12, 1.2), mat.woodRustic, 0, 0.6, 0);

        // Laterales
        add(new THREE.BoxGeometry(2.2, 0.4, 0.08), mat.woodRustic, 0, 0.86, 0.6);
        add(new THREE.BoxGeometry(2.2, 0.4, 0.08), mat.woodRustic, 0, 0.86, -0.6);
        add(new THREE.BoxGeometry(0.08, 0.4, 1.2), mat.woodRustic, -1.1, 0.86, 0);

        // Ruedas
        for (const dz of [-1, 1]) {
            const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 12);
            const wheel = add(wheelGeo, mat.woodRustic, -0.5, 0.35, dz * 0.65);
            wheel.rotation.x = Math.PI / 2;

            // Aro metálico
            const rim = add(new THREE.TorusGeometry(0.35, 0.02, 6, 12), mat.metalDark,
                -0.5, 0.35, dz * 0.65);
            rim.rotation.x = Math.PI / 2;

            // Eje
            add(new THREE.CylinderGeometry(0.03, 0.03, 1.3, 6), mat.metalDark,
                -0.5, 0.35, 0);
            group.children[group.children.length - 1].rotation.z = Math.PI / 2;
        }

        // Vara de tiro
        add(new THREE.CylinderGeometry(0.04, 0.04, 1.5, 6), mat.woodRustic,
            1.8, 0.7, 0);
        group.children[group.children.length - 1].rotation.z = Math.PI / 2;

        group.position.set(this.centerX, 0, this.centerY);
        group.rotation.y = this.rotation ?? 0;
        group.name = `WoodenCart_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }
}

/**
 * Pila de leña.
 */
export class FirewoodPile extends VillageObject {
    constructor(x, y, options = {}) {
        const width = options.width ?? 1.5;
        super(x, y, width, 1, options);
        this.pileWidth = width;
        this.pileHeight = options.height ?? 0.8;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const W = this.pileWidth, H = this.pileHeight;
        const rnd = this._rng();

        // Troncos apilados
        const logCount = Math.floor(W * 8);
        for (let i = 0; i < logCount; i++) {
            const lx = -W / 2 + rnd() * W;
            const ly = rnd() * H;
            const lz = -0.4 + rnd() * 0.8;
            const logLen = 0.8 + rnd() * 0.3;

            const log = add(new THREE.CylinderGeometry(0.08, 0.08, logLen, 6), mat.woodRustic,
                lx, ly + 0.08, lz);
            log.rotation.z = Math.PI / 2 + (rnd() - 0.5) * 0.3;
            log.rotation.y = (rnd() - 0.5) * 0.5;
        }

        group.position.set(this.centerX, 0, this.centerY);
        group.rotation.y = this.rotation ?? 0;
        group.name = `FirewoodPile_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }
}

/**
 * Cubo de agua.
 */
export class WaterBucket extends VillageObject {
    constructor(x, y, options = {}) {
        super(x, y, 0.5, 0.5, options);
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        // Cuerpo del cubo
        add(new THREE.CylinderGeometry(0.18, 0.15, 0.35, 8), mat.woodRustic,
            0, 0.175, 0);

        // Aros metálicos
        for (const y of [0.08, 0.28]) {
            const band = add(new THREE.TorusGeometry(0.19, 0.015, 6, 8), mat.metalDark,
                0, y, 0);
            band.rotation.x = Math.PI / 2;
        }

        // Asa
        const handle = add(new THREE.TorusGeometry(0.12, 0.02, 6, 8), mat.metalDark,
            0, 0.45, 0);
        handle.rotation.y = Math.PI / 2;

        // Agua visible
        add(new THREE.CylinderGeometry(0.16, 0.16, 0.02, 8),
            new THREE.MeshStandardMaterial({ color: 0x4a7a9a, roughness: 0.3 }),
            0, 0.32, 0);

        group.position.set(this.centerX, 0, this.centerY);
        group.rotation.y = this.rotation ?? 0;
        group.name = `WaterBucket_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }
}

// ============================================================
// DECORACIÓN Y SEÑALIZACIÓN
// ============================================================

/**
 * Letrero colgante de taberna/tienda.
 */
export class HangingSign extends VillageObject {
    constructor(x, y, options = {}) {
        super(x, y, 1, 1, { ...options, blocks: false });
        this.signText = options.signText ?? "TAVERN";
        this.signColor = options.signColor ?? 0x8a5a2a;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        // Soporte de hierro
        add(new THREE.BoxGeometry(0.08, 0.08, 0.8), mat.metalDark, 0, 2.2, 0.4);

        // Cadena/cuerda
        add(new THREE.CylinderGeometry(0.015, 0.015, 0.3, 6), mat.metalDark,
            0, 2.05, 0.75);

        // Letrero
        const sign = add(new THREE.BoxGeometry(0.8, 0.6, 0.05), mat.woodRustic,
            0, 1.7, 0.75);

        // Borde metálico
        add(new THREE.BoxGeometry(0.84, 0.04, 0.07), mat.metalDark,
            0, 2.0, 0.75);
        add(new THREE.BoxGeometry(0.84, 0.04, 0.07), mat.metalDark,
            0, 1.4, 0.75);

        this._sign = sign;

        group.position.set(this.centerX, 0, this.centerY);
        group.rotation.y = this.rotation ?? 0;
        group.name = `HangingSign_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }

    update() {
        if (!this._sign) return;
        const t = performance.now() / 1000;
        this._sign.rotation.z = Math.sin(t * 0.8) * 0.08;
    }
}

/**
 * Antorcha/lámpara de exterior.
 */
export class VillageTorch extends VillageObject {
    constructor(x, y, options = {}) {
        super(x, y, 1, 1, { ...options, blocks: false });
        this.lightColor = options.lightColor ?? 0xff9944;
        this.lightIntensity = options.lightIntensity ?? 1.0;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        // Poste
        add(new THREE.CylinderGeometry(0.05, 0.06, 1.8, 8), mat.woodRustic,
            0, 0.9, 0);

        // Soporte metálico
        add(new THREE.BoxGeometry(0.08, 0.08, 0.3), mat.metalDark,
            0, 1.7, 0.15);

        // Antorcha
        add(new THREE.CylinderGeometry(0.04, 0.05, 0.4, 6), mat.woodRustic,
            0, 1.9, 0.25);

        // Llama
        const flame = add(new THREE.ConeGeometry(0.08, 0.25, 8),
            new THREE.MeshStandardMaterial({
                color: 0xffaa33,
                emissive: 0xff6600,
                emissiveIntensity: 1.5,
                transparent: true,
                opacity: 0.9
            }),
            0, 2.2, 0.25);
        this._flame = flame;

        // Luz
        const light = new THREE.PointLight(this.lightColor, this.lightIntensity, 5);
        light.position.set(0, 2.2, 0.25);
        group.add(light);

        group.position.set(this.centerX, 0, this.centerY);
        group.rotation.y = this.rotation ?? 0;
        group.name = `VillageTorch_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }

    update() {
        if (!this._flame) return;
        const t = performance.now() / 1000;
        this._flame.scale.y = 1 + Math.sin(t * 9) * 0.2;
        this._flame.scale.x = 1 + Math.cos(t * 7) * 0.12;
    }
}

/**
 * Pozo de piedra.
 */
export class StoneWell extends VillageObject {
    constructor(x, y, options = {}) {
        super(x, y, 2, 2, options);
        this.wellRadius = options.radius ?? 0.8;
    }

    occupies(tx, ty) {
        if (!this.blocksMovement) return false;
        const cx = tx + 0.5 - this.centerX;
        const cy = ty + 0.5 - this.centerY;
        const r = this.wellRadius + 0.3;
        return cx * cx + cy * cy <= r * r;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const R = this.wellRadius;

        // =============== MURO CON GROSOR REAL ===============
        // Perfil de revolución: cara exterior -> canto superior -> cara
        // interior. Al ser un sólido cerrado en sección, NINGUNA cara se
        // culéa y desaparece el efecto de transparencia.
        const wallProfile = [
            new THREE.Vector2(R + 0.14, 0.00),  // base exterior
            new THREE.Vector2(R + 0.06, 0.45),  // panza exterior
            new THREE.Vector2(R, 0.90),  // borde exterior superior
            new THREE.Vector2(R - 0.24, 0.90),  // canto superior (grosor)
            new THREE.Vector2(R - 0.18, 0.45),  // panza interior
            new THREE.Vector2(R - 0.16, 0.10)   // base interior (bajo el agua)
        ];
        const wallGeo = new THREE.LatheGeometry(wallProfile, 20);

        // Textura con repeat propio (evita el estirado de la piedra)
        const wallMat = mat.stoneRustic.clone();
        wallMat.map = mat.stoneRustic.map.clone();
        wallMat.map.needsUpdate = true;
        wallMat.map.repeat.set(3, 1);

        add(wallGeo, wallMat, 0, 0, 0);

        // =============== AGUA ===============
        // Radio ligeramente mayor que la cara interior: se incrusta en el
        // muro y no queda rendija visible entre agua y piedra.
        add(
            new THREE.CylinderGeometry(R - 0.10, R - 0.10, 0.06, 20),
            new THREE.MeshStandardMaterial({
                color: 0x1a3a5a,
                roughness: 0.15,
                metalness: 0.5
            }),
            0, 0.22, 0
        );

        // Fondo oscuro (da profundidad al mirar dentro)
        add(
            new THREE.CylinderGeometry(R - 0.12, R - 0.12, 0.02, 20),
            new THREE.MeshStandardMaterial({ color: 0x050a10, roughness: 1 }),
            0, 0.05, 0
        );

        // =============== ESTRUCTURA SUPERIOR ===============
        for (const angle of [0, Math.PI]) {
            add(
                new THREE.CylinderGeometry(0.06, 0.06, 1.8, 8),
                mat.woodRustic,
                Math.cos(angle) * (R - 0.1),
                1.7,
                Math.sin(angle) * (R - 0.1)
            );
        }

        // Techo
        add(new THREE.ConeGeometry(R + 0.35, 0.6, 8), mat.woodRustic, 0, 2.85, 0);

        // Travesaño y polea
        add(new THREE.CylinderGeometry(0.04, 0.04, (R - 0.1) * 2, 6), mat.woodRustic,
            0, 2.45, 0);
        group.children[group.children.length - 1].rotation.z = Math.PI / 2;

        const pulley = add(new THREE.TorusGeometry(0.12, 0.03, 6, 10), mat.metalDark,
            0, 2.45, 0);
        pulley.rotation.y = Math.PI / 2;

        // Cuerda y cubo
        add(new THREE.CylinderGeometry(0.015, 0.015, 1.5, 6), mat.rope, 0, 1.7, 0);
        add(new THREE.CylinderGeometry(0.13, 0.10, 0.26, 8), mat.woodRustic, 0, 0.85, 0);

        // =============== POSICIÓN ===============
        group.position.set(this.centerX, 0, this.centerY);
        group.rotation.y = this.rotation ?? 0;
        group.name = `StoneWell_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }
}

// ============================================================
// HELPER: escena de mercado
// ============================================================

/**
 * Crea una escena de mercado medieval con puestos y decoración.
 *
 * @param {GameMap} map
 * @param {number} baseX
 * @param {number} baseY
 * @returns {{ pieces: VillageObject[], update: () => void }}
 */
export function buildMarketScene(map, baseX, baseY) {
    const pieces = [];
    const place = (piece) => { map.place(piece); pieces.push(piece); };

    // Puestos de mercado en fila
    place(new MarketStall(baseX, baseY, {
        width: 3, depth: 2, fabricColor: "red", seed: 1001
    }));
    place(new MarketStall(baseX + 4, baseY, {
        width: 3, depth: 2, fabricColor: "blue", seed: 1002
    }));
    place(new MarketStall(baseX + 8, baseY, {
        width: 3, depth: 2, fabricColor: "natural", seed: 1003
    }));

    // Cajas y barriles alrededor
    place(new WoodenCrate(baseX + 1, baseY + 3, { size: 0.8, seed: 2001 }));
    place(new WoodenCrate(baseX + 1.8, baseY + 3.2, { size: 0.6, seed: 2002 }));
    place(new WoodenBarrel(baseX + 5, baseY + 3, { content: "grain", seed: 2003 }));
    place(new WoodenBarrel(baseX + 5.8, baseY + 3.1, { seed: 2004 }));
    place(new GrainSack(baseX + 9, baseY + 3, { seed: 2005 }));
    place(new GrainSack(baseX + 9.6, baseY + 3.2, { seed: 2006 }));

    // Mesa con bancos frente a los puestos
    place(new WoodenTable(baseX + 3, baseY + 5, { seed: 3001 }));
    place(new WoodenBench(baseX + 3, baseY + 6.5, { length: 2, seed: 3002 }));
    place(new WoodenBench(baseX + 3, baseY + 3.5, { length: 2, seed: 3003 }));

    // Carreta con mercancía
    place(new WoodenCart(baseX + 8, baseY + 6, { seed: 4001 }));
    place(new WoodenCrate(baseX + 8.5, baseY + 6.2, { size: 0.7, seed: 4002 }));
    place(new WoodenBarrel(baseX + 9.2, baseY + 6.3, { seed: 4003 }));

    // Pozo central
    place(new StoneWell(baseX + 5, baseY + 8, { seed: 5001 }));

    // Antorchas para iluminación nocturna
    place(new VillageTorch(baseX + 1, baseY + 2, { seed: 6001 }));
    place(new VillageTorch(baseX + 10, baseY + 2, { seed: 6002 }));

    // Letreros
    place(new HangingSign(baseX + 2, baseY + 1, { signText: "BREAD", seed: 7001 }));
    place(new HangingSign(baseX + 6, baseY + 1, { signText: "ALE", seed: 7002 }));

    // Pila de leña
    place(new FirewoodPile(baseX + 11, baseY + 4, { width: 1.5, seed: 8001 }));

    return {
        pieces,
        update: () => pieces.forEach(p => p.update?.())
    };
}