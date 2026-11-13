//@ts-check
import { ModernProp, WorldObject } from "../WorldObjectModels.js";
// @ts-ignore
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

// ============================================================
// MATERIALES DE INTERIOR (cache por engine)
// ============================================================
const _intCache = new WeakMap();

/**
 * @param {WeakKey} THREE
 */
function interiorMaterials(THREE, colors = {}) {
    if (_intCache.has(THREE)) {
        if (Object.keys(colors).length === 0) return _intCache.get(THREE);
    }

    const fabricTex = (() => {
        const c = document.createElement("canvas");
        c.width = c.height = 128;
        const ctx = c.getContext("2d");
        ctx.fillStyle = "#8a8e92"; ctx.fillRect(0, 0, 128, 128);
        for (let i = 0; i < 3000; i++) {
            const v = Math.random() * 30 - 15;
            ctx.fillStyle = `rgba(${138 + v},${142 + v},${146 + v},0.2)`;
            ctx.fillRect(Math.random() * 128, Math.random() * 128, 2, 2);
        }
        const t = new THREE.CanvasTexture(c);
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
    })();

    const mats = {
        fabric: new THREE.MeshStandardMaterial({
            map: fabricTex, color: colors.fabric ?? 0x9aa0a6, roughness: 0.95
        }),
        fabricSoft: new THREE.MeshStandardMaterial({
            map: fabricTex, color: colors.fabricSoft ?? 0xe8e4dc, roughness: 0.95
        }),
        accent: new THREE.MeshStandardMaterial({
            map: fabricTex, color: colors.accent ?? 0xc86a4a, roughness: 0.9
        }),
        woodLight: new THREE.MeshStandardMaterial({
            color: colors.woodLight ?? 0xc8a878, roughness: 0.7
        }),
        woodDark: new THREE.MeshStandardMaterial({
            color: colors.woodDark ?? 0x6a4a2e, roughness: 0.75
        }),
        metal: new THREE.MeshStandardMaterial({
            color: colors.metal ?? 0xb8bcc0, roughness: 0.35, metalness: 0.7
        }),
        metalDark: new THREE.MeshStandardMaterial({
            color: colors.metalDark ?? 0x2a2c2e, roughness: 0.45, metalness: 0.6
        }),
        plasticWhite: new THREE.MeshStandardMaterial({
            color: colors.plasticWhite ?? 0xf0f0ee, roughness: 0.5
        }),
        ceramic: new THREE.MeshStandardMaterial({
            color: colors.ceramic ?? 0xfafaf8, roughness: 0.25, metalness: 0.05
        }),
        glassShower: new THREE.MeshStandardMaterial({
            color: 0xbcd8e0, roughness: 0.05, metalness: 0.2,
            transparent: true, opacity: 0.28
        }),
        screenOff: new THREE.MeshStandardMaterial({
            color: 0x0a0c0e, roughness: 0.15, metalness: 0.5
        }),
        leaf: new THREE.MeshStandardMaterial({ color: 0x3f7a33, roughness: 0.9 }),
        pot: new THREE.MeshStandardMaterial({ color: 0xb8b0a4, roughness: 0.8 })
    };
    if (Object.keys(colors).length === 0) _intCache.set(THREE, mats);
    return mats;
}

const addFactory = () => (/** @type {any} */ group) => (/** @type {any} */ geo, /** @type {any} */ mat, /** @type {any} */ x, /** @type {any} */ y, /** @type {any} */ z, parent = group) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true; m.receiveShadow = true;
    parent.add(m);
    return m;
};

// ============================================================
// HELPER DE CIERRE — aplica escala y añade a escena
// (mismo patrón que ModernProp._finishGroup, replicado aquí
//  para no depender de cambios no aplicados aún en ModernObjects)
// ============================================================
/**
 * @param {{ scale: any; centerX: any; centerY: any; rotation: number; x: any; y: any; visual: any; engine: any; rendered: boolean; }} prop
 * @param {{ renderer: { scene: { add: (arg0: any) => void; }; }; }} engine
 * @param {{ scale: { setScalar: (arg0: any) => void; }; position: { set: (arg0: any, arg1: number, arg2: any) => void; }; rotation: { y: any; }; name: string; userData: { worldObject: any; }; }} group
 * @param {any} prefix
 */
function finishGroup(prop, engine, group, prefix) {
    group.scale.setScalar(prop.scale);              // metros → tiles
    group.position.set(prop.centerX, 0, prop.centerY);
    group.rotation.y = prop.rotation ?? 0;
    group.name = `${prefix}_${prop.x}_${prop.y}`;
    group.userData.worldObject = prop;
    engine.renderer.scene.add(group);
    prop.visual = group;
    prop.engine = engine;
    prop.rendered = true;
}

// ============================================================
// DORMITORIO
// ============================================================

/** Cama moderna con cabecero. Interactable (ej: dormir). */
export class BedModern extends ModernProp {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y, options = {}) {
        super(x, y, 2.1, 1.7, options);
        this.indicatorHeight = options.indicatorHeight ?? 1.1;
    }

    /**
     * @param {{ THREE: any; }} engine
     */
    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = interiorMaterials(THREE, this.colors);
        const add = addFactory()(group);

        // Somier
        add(new THREE.BoxGeometry(2.0, 0.25, 1.6), mat.woodDark, 0, 0.2, 0);
        // Colchón
        add(new THREE.BoxGeometry(1.95, 0.22, 1.55), mat.fabricSoft, 0, 0.43, 0);
        // Edredón
        add(new THREE.BoxGeometry(1.4, 0.1, 1.6), mat.accent, 0.25, 0.56, 0);
        // Almohadas
        for (const dz of [-0.4, 0.4]) {
            add(new THREE.BoxGeometry(0.4, 0.14, 0.6), mat.fabricSoft, -0.7, 0.6, dz);
        }
        // Cabecero
        add(new THREE.BoxGeometry(0.1, 0.9, 1.7), mat.woodDark, -1.02, 0.6, 0);
        // Patas
        for (const dx of [-0.9, 0.9]) {
            for (const dz of [-0.7, 0.7]) {
                add(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 6), mat.metalDark,
                    dx, 0.06, dz);
            }
        }

        this._finishGroup(engine, group, "BedModern");
        this.AsingProps(group, engine, true);
    }
}

/** Armario con puertas correderas animadas. */
export class WardrobeModern extends ModernProp {
    /**
     * @param {any} x
     * @param {any} y
     */
    constructor(x, y, options = {}) {
        super(x, y, 1.8, 0.65, options);
        this.open = false;
        this._doorOffset = 0;
        this.indicatorHeight = options.indicatorHeight ?? 1.8;
    }

    use() { this.open = !this.open; }
    getState() { return { open: this.open }; }

    /**
     * @param {number} delta
     */
    animate(delta) {
        if (!this._doorL) return;
        const target = this.open ? 0.75 : 0;
        this._doorOffset += (target - this._doorOffset) * Math.min(1, delta * 6);
        this._doorL.position.x = -0.44 + this._doorOffset;
        this._doorR.position.x = 0.44 - this._doorOffset * 0.4;
    }

    /**
     * @param {{ THREE: any; }} engine
     */
    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = interiorMaterials(THREE, this.colors);
        const add = addFactory()(group);

        add(new THREE.BoxGeometry(1.75, 2.1, 0.6), mat.woodLight, 0, 1.05, -0.02);
        add(new THREE.BoxGeometry(1.65, 2.0, 0.05), mat.metalDark, 0, 1.05, 0.28);
        this._doorL = add(new THREE.BoxGeometry(0.86, 2.02, 0.04), mat.woodDark,
            -0.44, 1.05, 0.32);
        this._doorR = add(new THREE.BoxGeometry(0.86, 2.02, 0.04), mat.fabric,
            0.44, 1.05, 0.34);
        add(new THREE.BoxGeometry(0.03, 0.5, 0.03), mat.metal, -0.05, 1.1, 0.36);
        add(new THREE.BoxGeometry(0.03, 0.5, 0.03), mat.metal, 0.05, 1.1, 0.38);

        this._finishGroup(engine, group, "WardrobeModern");
        this.AsingProps(group, engine, true);
    }
}

// ============================================================
// SALÓN
// ============================================================

/** Sofá de 3 plazas. */
export class SofaModern extends ModernProp {
    /**
     * @param {any} x
     * @param {any} y
     */
    constructor(x, y, options = {}) {
        super(x, y, 2.2, 0.95, options);
        this.indicatorHeight = options.indicatorHeight ?? 1.1;
    }

    /**
     * @param {{ THREE: any; }} engine
     */
    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = interiorMaterials(THREE, this.colors);
        const add = addFactory()(group);

        add(new THREE.BoxGeometry(2.1, 0.35, 0.85), mat.fabric, 0, 0.28, 0);
        add(new THREE.BoxGeometry(2.1, 0.55, 0.2), mat.fabric, 0, 0.68, -0.35);
        for (const dx of [-1, 1]) {
            add(new THREE.BoxGeometry(0.18, 0.5, 0.85), mat.fabric, dx * 1.0, 0.5, 0);
        }
        for (let i = -1; i <= 1; i++) {
            add(new THREE.BoxGeometry(0.6, 0.14, 0.7), mat.fabricSoft, i * 0.64, 0.52, 0.03);
            add(new THREE.BoxGeometry(0.55, 0.4, 0.12), mat.fabricSoft, i * 0.64, 0.72, -0.26);
        }
        for (const dx of [-0.95, 0.95]) {
            for (const dz of [-0.35, 0.35]) {
                add(new THREE.CylinderGeometry(0.025, 0.025, 0.12, 6), mat.metalDark,
                    dx, 0.06, dz);
            }
        }

        this._finishGroup(engine, group, "SofaModern");
        this.AsingProps(group, engine, true);
    }
}

/** TV de pantalla plana con mueble. use() enciende/apaga. */
export class TVModern extends ModernProp {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y, options = {}) {
        super(x, y, 1.7, 0.45, options);
        this.on = false;
        this.indicatorHeight = options.indicatorHeight ?? 1.5;
    }

    use() {
        this.on = !this.on;
        if (this._screenMat) {
            this._screenMat.emissive.setHex(this.on ? 0x88aacc : 0x000000);
            this._screenMat.emissiveIntensity = this.on ? 0.9 : 0;
        }
        if (this._light) this._light.intensity = this.on ? 0.5 : 0;
    }
    getState() { return { on: this.on }; }

    /**
     * @param {{ THREE: any; }} engine
     */
    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = interiorMaterials(THREE, this.colors);
        const add = addFactory()(group);

        add(new THREE.BoxGeometry(1.6, 0.4, 0.4), mat.woodDark, 0, 0.25, 0);
        add(new THREE.BoxGeometry(1.5, 0.85, 0.05), mat.metalDark, 0, 1.15, 0);
        this._screenMat = new THREE.MeshStandardMaterial({
            color: 0x05070a, roughness: 0.1, metalness: 0.4,
            emissive: 0x000000, emissiveIntensity: 0
        });
        add(new THREE.BoxGeometry(1.42, 0.78, 0.02), this._screenMat, 0, 1.15, 0.035);
        this._light = new THREE.PointLight(0x88aacc, 0, 4);
        this._light.position.set(0, 1.2, 0.5);
        group.add(this._light);

        this._finishGroup(engine, group, "TVModern");
        this.AsingProps(group, engine, true);
    }
}

/** Lámpara de pie. use() enciende/apaga. */
export class FloorLampModern extends ModernProp {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y, options = {}) {
        super(x, y, 1, 1, options);
        this.on = options.defaultOn ?? false;
        this.indicatorHeight = options.indicatorHeight ?? 1.7;
    }

    use() {
        this.on = !this.on;
        if (this._shadeMat) this._shadeMat.emissiveIntensity = this.on ? 1.2 : 0;
        if (this._light) this._light.intensity = this.on ? 0.9 : 0;
    }
    getState() { return { on: this.on }; }

    /**
     * @param {{ THREE: any; }} engine
     */
    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = interiorMaterials(THREE, this.colors);
        const add = addFactory()(group);

        add(new THREE.CylinderGeometry(0.16, 0.18, 0.04, 12), mat.metalDark, 0, 0.02, 0);
        add(new THREE.CylinderGeometry(0.02, 0.02, 1.4, 8), mat.metal, 0, 0.72, 0);

        this._shadeMat = new THREE.MeshStandardMaterial({
            color: 0xf5ead0, roughness: 0.8, side: THREE.DoubleSide,
            emissive: 0xffc070, emissiveIntensity: 0
        });
        add(new THREE.CylinderGeometry(0.16, 0.22, 0.32, 12, 1, true),
            this._shadeMat, 0, 1.55, 0);

        this._light = new THREE.PointLight(0xffc070, 0, 5);
        this._light.position.set(0, 1.5, 0);
        group.add(this._light);

        if (this.on) { this.use(); this.on = true; }

        this._finishGroup(engine, group, "FloorLampModern");
        this.AsingProps(group, engine, true);
    }
}

/** Lámpara colgante de techo. */
export class PendantLamp extends ModernProp {
    /**
     * @param {any} x
     * @param {any} y
     */
    constructor(x, y, options = {}) {
        super(x, y, 1, 1, { ...options, blocks: options.blocks ?? false });
        this.on = options.defaultOn ?? true;
        this.ceilingHeight = options.ceilingHeight ?? 2.7;
        this.indicatorHeight = options.indicatorHeight ?? 2.2;
    }

    use() {
        this.on = !this.on;
        if (this._bulbMat) this._bulbMat.emissiveIntensity = this.on ? 1.5 : 0;
        if (this._light) this._light.intensity = this.on ? 0.8 : 0;
    }
    getState() { return { on: this.on }; }

    /**
     * @param {{ THREE: any; }} engine
     */
    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = interiorMaterials(THREE, this.colors);
        const add = addFactory()(group);

        const H = this.ceilingHeight;
        add(new THREE.CylinderGeometry(0.008, 0.008, 0.6, 6), mat.metalDark, 0, H - 0.3, 0);
        add(new THREE.ConeGeometry(0.24, 0.22, 14, 1, true), mat.metalDark, 0, H - 0.68, 0);

        this._bulbMat = new THREE.MeshStandardMaterial({
            color: 0xfff4dc, emissive: 0xffc070,
            emissiveIntensity: this.on ? 1.5 : 0
        });
        add(new THREE.SphereGeometry(0.07, 10, 10), this._bulbMat, 0, H - 0.74, 0);

        this._light = new THREE.PointLight(0xffc070, this.on ? 0.8 : 0, 6);
        this._light.position.set(0, H - 0.8, 0);
        group.add(this._light);

        this._finishGroup(engine, group, "PendantLamp");
        this.AsingProps(group, engine, true);
    }
}

/** Estantería con libros instanciados. */
export class BookshelfModern extends ModernProp {
    /**
     * @param {any} x
     * @param {any} y
     */
    constructor(x, y, options = {}) {
        super(x, y, 1.3, 0.35, options);
    }

    /**
     * @param {{ THREE: any; }} engine
     */
    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = interiorMaterials(THREE, this.colors);
        const add = addFactory()(group);

        for (const dx of [-1, 1]) {
            add(new THREE.BoxGeometry(0.04, 1.8, 0.32), mat.woodLight, dx * 0.63, 0.9, 0);
        }
        for (let i = 0; i < 5; i++) {
            add(new THREE.BoxGeometry(1.26, 0.04, 0.32), mat.woodLight, 0, 0.1 + i * 0.42, 0);
        }

        const bookGeo = new THREE.BoxGeometry(0.06, 0.3, 0.22);
        const bookMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
        const books = new THREE.InstancedMesh(bookGeo, bookMat, 44);
        books.castShadow = true;
        const dummy = new THREE.Object3D();
        const rnd = this._rng();
        const col = new THREE.Color();
        let bi = 0;
        for (let shelf = 0; shelf < 4; shelf++) {
            let bx = -0.58;
            while (bx < 0.52 && bi < 44) {
                const bw = 0.05 + rnd() * 0.05;
                const bh = 0.24 + rnd() * 0.12;
                dummy.position.set(bx, 0.12 + shelf * 0.42 + bh / 2, 0);
                dummy.rotation.set(0, 0, (rnd() - 0.5) * 0.06);
                dummy.scale.set(bw / 0.06, bh / 0.3, 1);
                dummy.updateMatrix();
                books.setMatrixAt(bi, dummy.matrix);
                col.setHSL(rnd(), 0.5 + rnd() * 0.3, 0.35 + rnd() * 0.25);
                books.setColorAt(bi, col);
                bx += bw + 0.015;
                bi++;
            }
        }
        books.instanceMatrix.needsUpdate = true;
        if (books.instanceColor) books.instanceColor.needsUpdate = true;
        group.add(books);

        this._finishGroup(engine, group, "BookshelfModern");
        this.AsingProps(group, engine, true);
    }
}

/** Alfombra (no bloquea). Usa baseW/baseH (metros) — el scale la agranda. */
export class RugModern extends ModernProp {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y, options = {}) {
        const width = options.width ?? 2.4;
        const depth = options.depth ?? 1.7;
        super(x, y, width, depth, { ...options, blocks: false });
        this.rugColor = options.rugColor ?? 0xb8a888;
        this.indicatorHeight = options.indicatorHeight ?? 0.6;
    }

    /**
     * @param {{ THREE: any; }} engine
     */
    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const add = addFactory()(group);

        // NOTA: usar baseW/baseH (metros originales). group.scale → tiles.
        const W = this.baseW, D = this.baseH;

        const rugMat = new THREE.MeshStandardMaterial({ color: this.rugColor, roughness: 1 });
        add(new THREE.BoxGeometry(W, 0.02, D), rugMat, 0, 0.01, 0);

        const innerMat = new THREE.MeshStandardMaterial({
            color: this.rugColor, roughness: 1
        }).clone();
        innerMat.color.offsetHSL(0, 0.05, -0.12);
        add(new THREE.BoxGeometry(W - 0.3, 0.025, D - 0.3), innerMat, 0, 0.015, 0);

        this._finishGroup(engine, group, "RugModern");
        this.AsingProps(group, engine, true);
    }
}

// ============================================================
// COMEDOR / COCINA
// ============================================================

/** Mesa de comedor. */
export class DiningTableModern extends ModernProp {
    /**
     * @param {any} x
     * @param {any} y
     */
    constructor(x, y, options = {}) {
        const width = options.width ?? 1.8;
        const depth = options.depth ?? 0.95;
        super(x, y, width, depth, options);
        this.tableWidth = width;
        this.tableDepth = depth;
    }

    /**
     * @param {{ THREE: any; }} engine
     */
    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = interiorMaterials(THREE, this.colors);
        const add = addFactory()(group);

        const W = this.tableWidth, D = this.tableDepth;
        add(new THREE.BoxGeometry(W, 0.06, D), mat.woodLight, 0, 0.75, 0);
        for (const dx of [-1, 1]) {
            for (const dz of [-1, 1]) {
                add(new THREE.CylinderGeometry(0.03, 0.03, 0.75, 8), mat.metalDark,
                    dx * (W / 2 - 0.12), 0.375, dz * (D / 2 - 0.12));
            }
        }

        this._finishGroup(engine, group, "DiningTableModern");
        this.AsingProps(group, engine, true);
    }
}

/** Silla de interior con patas metálicas. */
export class ChairModern extends ModernProp {
    /**
     * @param {any} x
     * @param {any} y
     */
    constructor(x, y, options = {}) {
        super(x, y, 0.5, 0.5, options);
    }

    /**
     * @param {{ THREE: any; }} engine
     */
    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = interiorMaterials(THREE, this.colors);
        const add = addFactory()(group);

        add(new THREE.BoxGeometry(0.44, 0.05, 0.44), mat.woodLight, 0, 0.46, 0);
        add(new THREE.BoxGeometry(0.44, 0.5, 0.05), mat.woodLight, 0, 0.72, -0.2);
        for (const dx of [-1, 1]) {
            for (const dz of [-1, 1]) {
                add(new THREE.CylinderGeometry(0.018, 0.018, 0.46, 6), mat.metalDark,
                    dx * 0.18, 0.23, dz * 0.18);
            }
        }

        this._finishGroup(engine, group, "ChairModern");
        this.AsingProps(group, engine, true);
    }
}

/** Encimera de cocina con fregadero y placa. */
export class KitchenCounter extends ModernProp {
    /**
     * @param {any} x
     * @param {any} y
     */
    constructor(x, y, options = {}) {
        const length = options.length ?? 2.4;
        super(x, y, length, 0.65, options);
        this.counterLength = length;
    }

    /**
     * @param {{ THREE: any; }} engine
     */
    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = interiorMaterials(THREE, this.colors);
        const add = addFactory()(group);

        const L = this.counterLength;

        add(new THREE.BoxGeometry(L, 0.85, 0.6), mat.plasticWhite, 0, 0.45, 0);
        add(new THREE.BoxGeometry(L + 0.05, 0.05, 0.65), mat.metalDark, 0, 0.9, 0);
        const doors = Math.floor(L / 0.6);
        for (let i = 0; i < doors; i++) {
            add(new THREE.BoxGeometry(0.52, 0.7, 0.02), mat.woodLight,
                -L / 2 + 0.3 + i * 0.6, 0.45, 0.31);
            add(new THREE.BoxGeometry(0.16, 0.02, 0.02), mat.metal,
                -L / 2 + 0.3 + i * 0.6, 0.75, 0.33);
        }
        add(new THREE.BoxGeometry(0.5, 0.03, 0.4), mat.metal, -L * 0.25, 0.915, 0);
        add(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8), mat.metal, -L * 0.25, 1.05, -0.2);
        add(new THREE.CylinderGeometry(0.015, 0.015, 0.22, 8), mat.metal, -L * 0.25, 1.18, -0.1)
            .rotation.x = Math.PI / 2;
        add(new THREE.BoxGeometry(0.6, 0.02, 0.45), mat.screenOff, L * 0.25, 0.935, 0);
        for (const dx of [-0.15, 0.15]) {
            add(new THREE.CylinderGeometry(0.09, 0.09, 0.005, 16), mat.metalDark,
                L * 0.25 + dx, 0.948, 0);
        }

        this._finishGroup(engine, group, "KitchenCounter");
        this.AsingProps(group, engine, true);
    }
}

/** Nevera con puerta abatible animada. */
export class FridgeModern extends ModernProp {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y, options = {}) {
        super(x, y, 0.75, 0.75, options);
        this.open = false;
        this.indicatorHeight = options.indicatorHeight ?? 1.6;
    }

    use() { this.open = !this.open; }
    getState() { return { open: this.open }; }

    /**
     * @param {number} delta
     */
    animate(delta) {
        if (!this._doorPivot) return;
        const target = this.open ? -1.9 : 0;
        this._doorPivot.rotation.y +=
            (target - this._doorPivot.rotation.y) * Math.min(1, delta * 7);
    }

    /**
     * @param {{ THREE: any; }} engine
     */
    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = interiorMaterials(THREE, this.colors);
        const add = addFactory()(group);

        add(new THREE.BoxGeometry(0.7, 1.8, 0.7), mat.metal, -0.02, 0.9, -0.02);

        this._doorPivot = new THREE.Group();
        this._doorPivot.position.set(-0.35, 0, 0.33);
        group.add(this._doorPivot);
        add(new THREE.BoxGeometry(0.7, 1.78, 0.06), mat.metal, 0.35, 0.9, 0, this._doorPivot);
        add(new THREE.BoxGeometry(0.03, 0.5, 0.04), mat.metalDark, 0.66, 1.1, 0.05, this._doorPivot);
        add(new THREE.BoxGeometry(0.03, 0.3, 0.04), mat.metalDark, 0.66, 0.55, 0.05, this._doorPivot);

        this._finishGroup(engine, group, "FridgeModern");
        this.AsingProps(group, engine, true);
    }
}

/** Lavadora con tambor giratorio. use() inicia/detiene. */
export class WashingMachine extends ModernProp {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y, options = {}) {
        super(x, y, 0.65, 0.65, options);
        this.running = false;
        this.indicatorHeight = options.indicatorHeight ?? 1.2;
    }

    use() { this.running = !this.running; }
    getState() { return { running: this.running }; }

    /**
     * @param {number} delta
     */
    animate(delta) {
        if (!this._drum) return;
        if (this.running) this._drum.rotation.z += delta * 6;
    }

    /**
     * @param {{ THREE: any; }} engine
     */
    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = interiorMaterials(THREE, this.colors);
        const add = addFactory()(group);

        add(new THREE.BoxGeometry(0.6, 0.85, 0.6), mat.plasticWhite, 0, 0.425, 0);
        add(new THREE.BoxGeometry(0.5, 0.1, 0.02), mat.metalDark, 0, 0.76, 0.31);
        add(new THREE.BoxGeometry(0.12, 0.05, 0.01), mat.screenOff, 0.15, 0.76, 0.325);
        add(new THREE.TorusGeometry(0.2, 0.035, 8, 20), mat.metalDark, 0, 0.42, 0.31);
        add(new THREE.CylinderGeometry(0.18, 0.18, 0.02, 20), mat.glassShower,
            0, 0.42, 0.31).rotation.x = Math.PI / 2;

        this._drum = new THREE.Group();
        this._drum.position.set(0, 0.42, 0.25);
        group.add(this._drum);
        for (let i = 0; i < 3; i++) {
            const bar = add(new THREE.BoxGeometry(0.3, 0.03, 0.03), mat.metal,
                0, 0, 0, this._drum);
            bar.rotation.z = (i / 3) * Math.PI;
        }

        this._finishGroup(engine, group, "WashingMachine");
        this.AsingProps(group, engine, true);
    }
}

// ============================================================
// BAÑO
// ============================================================

/** Inodoro moderno. */
export class ToiletModern extends ModernProp {
    /**
     * @param {any} x
     * @param {any} y
     */
    constructor(x, y, options = {}) {
        super(x, y, 0.7, 0.7, options);
    }

    /**
     * @param {{ THREE: any; }} engine
     */
    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = interiorMaterials(THREE, this.colors);
        const add = addFactory()(group);

        add(new THREE.CylinderGeometry(0.16, 0.2, 0.35, 12), mat.ceramic, 0, 0.175, 0.05);
        add(new THREE.CylinderGeometry(0.21, 0.18, 0.14, 14), mat.ceramic, 0, 0.4, 0.08);
        add(new THREE.CylinderGeometry(0.21, 0.21, 0.03, 14), mat.ceramic, 0, 0.48, 0.08);
        add(new THREE.BoxGeometry(0.4, 0.4, 0.16), mat.ceramic, 0, 0.6, -0.24);
        add(new THREE.CylinderGeometry(0.04, 0.04, 0.01, 10), mat.metal, 0, 0.81, -0.24);

        this._finishGroup(engine, group, "ToiletModern");
        this.AsingProps(group, engine, true);
    }
}

/** Mampara de ducha con cristal. */
export class ShowerCabin extends ModernProp {
    /**
     * @param {any} x
     * @param {any} y
     */
    constructor(x, y, options = {}) {
        const size = options.size ?? 1.0;
        super(x, y, size, size, options);
        this.cabinSize = size;
    }

    /**
     * @param {{ THREE: any; }} engine
     */
    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = interiorMaterials(THREE, this.colors);
        const add = addFactory()(group);

        const S = this.cabinSize;

        add(new THREE.BoxGeometry(S, 0.08, S), mat.ceramic, 0, 0.04, 0);
        add(new THREE.BoxGeometry(S, 1.9, 0.03), mat.glassShower, 0, 1.0, -S / 2);
        add(new THREE.BoxGeometry(0.03, 1.9, S), mat.glassShower, -S / 2, 1.0, 0);
        add(new THREE.BoxGeometry(0.03, 1.9, S * 0.45), mat.glassShower,
            S / 2, 1.0, -S * 0.275);
        add(new THREE.BoxGeometry(S, 0.05, 0.05), mat.metal, 0, 1.95, -S / 2);
        add(new THREE.BoxGeometry(0.05, 1.95, 0.05), mat.metal, -S / 2, 0.98, -S / 2);
        add(new THREE.BoxGeometry(0.05, 1.95, 0.05), mat.metal, S / 2, 0.98, -S / 2);
        add(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8), mat.metal, 0, 1.7, -S / 2 + 0.15)
            .rotation.x = Math.PI / 2;
        add(new THREE.CylinderGeometry(0.09, 0.09, 0.02, 12), mat.metal, 0, 1.72, -S / 2 + 0.4);

        this._finishGroup(engine, group, "ShowerCabin");
        this.AsingProps(group, engine, true);
    }
}

// ============================================================
// OFICINA Y DECORACIÓN
// ============================================================

/** Escritorio con ordenador. use() enciende/apaga el PC. */
export class DeskComputer extends ModernProp {
    /**
     * @param {any} x
     * @param {any} y
     */
    constructor(x, y, options = {}) {
        super(x, y, 1.5, 0.75, options);
        this.on = false;
        this.indicatorHeight = options.indicatorHeight ?? 1.3;
    }

    use() {
        this.on = !this.on;
        if (this._screenMat) {
            this._screenMat.emissive.setHex(this.on ? 0x6688bb : 0x000000);
            this._screenMat.emissiveIntensity = this.on ? 0.8 : 0;
        }
    }
    getState() { return { on: this.on }; }

    /**
     * @param {{ THREE: any; }} engine
     */
    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = interiorMaterials(THREE, this.colors);
        const add = addFactory()(group);

        add(new THREE.BoxGeometry(1.45, 0.05, 0.7), mat.woodLight, 0, 0.74, 0);
        for (const dx of [-1, 1]) {
            add(new THREE.BoxGeometry(0.05, 0.74, 0.65), mat.metalDark, dx * 0.68, 0.37, 0);
        }
        add(new THREE.BoxGeometry(0.62, 0.38, 0.03), mat.metalDark, 0, 1.05, -0.2);
        this._screenMat = new THREE.MeshStandardMaterial({
            color: 0x05070a, roughness: 0.1,
            emissive: 0x000000, emissiveIntensity: 0
        });
        add(new THREE.BoxGeometry(0.58, 0.34, 0.01), this._screenMat, 0, 1.05, -0.18);
        add(new THREE.BoxGeometry(0.06, 0.12, 0.06), mat.metalDark, 0, 0.83, -0.2);
        add(new THREE.BoxGeometry(0.42, 0.02, 0.14), mat.metalDark, 0, 0.775, 0.1);
        add(new THREE.BoxGeometry(0.2, 0.42, 0.4), mat.metalDark, 0.55, 0.21, 0.05);

        this._finishGroup(engine, group, "DeskComputer");
        this.AsingProps(group, engine, true);
    }
}

/** Planta de interior en maceta. */
export class HousePlantIndoor extends ModernProp {
    /**
     * @param {any} x
     * @param {any} y
     */
    constructor(x, y, options = {}) {
        super(x, y, 1, 1, options);
        this.plantHeight = options.plantHeight ?? 1.4;
    }

    /**
     * @param {{ THREE: any; }} engine
     */
    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = interiorMaterials(THREE, this.colors);
        const add = addFactory()(group);

        const H = this.plantHeight;
        add(new THREE.CylinderGeometry(0.18, 0.14, 0.3, 12), mat.pot, 0, 0.15, 0);
        add(new THREE.CylinderGeometry(0.03, 0.05, H * 0.6, 8), mat.woodDark,
            0, 0.3 + H * 0.3, 0);
        const rnd = this._rng();
        for (let i = 0; i < 4; i++) {
            const s = add(new THREE.SphereGeometry(0.22 + rnd() * 0.12, 10, 10), mat.leaf,
                (rnd() - 0.5) * 0.3,
                0.3 + H * 0.55 + i * 0.18,
                (rnd() - 0.5) * 0.3);
            s.scale.set(1, 0.8, 1);
        }

        this._finishGroup(engine, group, "HousePlantIndoor");
        this.AsingProps(group, engine, true);
    }
}

// ============================================================
// PISO ESTRUCTURAL
// ============================================================

/**
 * Piso/tabique estructural. Geometría en metros locales [0..w, 0..d],
 * centrada desplazando los hijos. El scale del grupo la pasa a tiles.
 */
export class ApartmentShell extends ModernProp {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y, options = {}) {
        const w = options.width ?? 14;
        const d = options.depth ?? 10;
        super(x, y, w, d, options);

        this.wallHeight = options.wallHeight ?? 2.7;

        const t = 0.3;
        const px0 = w * 0.5 - 0.15;
        const px1 = w * 0.5 + 0.15;
        const py0 = d * 0.5 - 0.15;
        const py1 = d * 0.5 + 0.15;

        this._wallRects = [
            [0, 0, w * 0.44, t], [w * 0.56, 0, w, t],
            [0, d - t, w, d],
            [0, 0, t, d], [w - t, 0, w, d],
            [px0, 0, px1, d * 0.15],
            [px0, d * 0.25, px1, d * 0.65],
            [px0, d * 0.75, px1, d],
            [0, py0, w * 0.18, py1],
            [w * 0.26, py0, w * 0.68, py1],
            [w * 0.76, py0, w, py1]
        ];
    }

    // Convierte celda de mundo → coords locales (metros 0..w, 0..d).
    /**
     * @param {number} tx
     * @param {number} ty
     */
    occupies(tx, ty) {
        if (!this.blocksMovement) return false;
        // Centro del grupo en mundo = centerX/centerY. Coords locales en metros:
        const lx = (tx + 0.5 - this.centerX) / this.scale + this.baseW / 2;
        const ly = (ty + 0.5 - this.centerY) / this.scale + this.baseH / 2;
        for (const r of this._wallRects) {
            if (lx >= r[0] && lx <= r[2] && ly >= r[1] && ly <= r[3]) return true;
        }
        return false;
    }

    /**
     * @param {{ THREE: any; }} engine
     */
    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = interiorMaterials(THREE, this.colors);
        const add = addFactory()(group);

        const w = this.baseW, d = this.baseH, H = this.wallHeight;

        // Suelo (coords 0..w, 0..d, se centra luego)
        add(new THREE.BoxGeometry(w, 0.12, d), mat.woodLight, w / 2, 0.06, d / 2);

        // Muros desde _wallRects
        for (const r of this._wallRects) {
            const rw = r[2] - r[0], rd = r[3] - r[1];
            add(
                new THREE.BoxGeometry(rw, H, rd),
                mat.plasticWhite,
                r[0] + rw / 2, H / 2, r[1] + rd / 2
            );
        }

        // Centrar hijos: restar w/2, d/2 en XZ para que el centro coincida
        // con la posición del grupo (centerX/centerY).
        for (const child of group.children) {
            child.position.x -= w / 2;
            child.position.z -= d / 2;
        }

        this._finishGroup(engine, group, "ApartmentShell");
        this.AsingProps(group, engine, true);
    }
}