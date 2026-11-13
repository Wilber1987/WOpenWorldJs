//@ts-check

import { ModernProp, WorldObject } from "../WorldObjectModels.js";
// @ts-ignore
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";



// ============================================================
// TEXTURAS COMPARTIDAS (cache por engine)
// ============================================================
const _sharedCache = new WeakMap();

/**
 * @param {WeakKey} THREE
 */
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

    // Hormigón pulido
    const concrete = makeCanvas(256, 256, (ctx, w, h) => {
        ctx.fillStyle = "#cfcbc4"; ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < 5000; i++) {
            const v = Math.floor(Math.random() * 24 - 12);
            ctx.fillStyle = `rgba(${150 + v},${148 + v},${144 + v},0.1)`;
            ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
        }
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * w, y = Math.random() * h;
            const r = 20 + Math.random() * 40;
            const g = ctx.createRadialGradient(x, y, 0, x, y, r);
            g.addColorStop(0, "rgba(100,96,90,0.10)");
            g.addColorStop(1, "rgba(100,96,90,0)");
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        }
    });

    // Metal cepillado (aluminio)
    const metalBrushed = makeCanvas(128, 128, (ctx, w, h) => {
        ctx.fillStyle = "#b8bcc0"; ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < 400; i++) {
            const y = Math.random() * h;
            ctx.strokeStyle = `rgba(${140 + Math.random() * 80},${145 + Math.random() * 80},${150 + Math.random() * 80},0.25)`;
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y + (Math.random() - 0.5) * 2);
            ctx.stroke();
        }
    });

    // Tarima composite (pergolas, tumbonas)
    const deckWood = makeCanvas(128, 128, (ctx, w, h) => {
        ctx.fillStyle = "#8a6a4a"; ctx.fillRect(0, 0, w, h);
        const n = 6, sw = w / n;
        for (let i = 0; i < n; i++) {
            const sh = Math.floor(Math.random() * 18 - 9);
            ctx.fillStyle = `rgb(${138 + sh},${106 + sh},${74 + sh})`;
            ctx.fillRect(0, i * sw + 1, w, sw - 2);
            ctx.strokeStyle = "rgba(40,28,18,0.6)"; ctx.lineWidth = 1.5;
            ctx.strokeRect(0, i * sw + 1, w, sw - 2);
        }
    });

    // Tela técnica gris
    const fabricGray = makeCanvas(128, 128, (ctx, w, h) => {
        ctx.fillStyle = "#6a6e72"; ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < 3000; i++) {
            const v = Math.random() * 30 - 15;
            ctx.fillStyle = `rgba(${106 + v},${110 + v},${114 + v},0.2)`;
            ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
        }
    });

    const textures = { concrete, metalBrushed, deckWood, fabricGray };
    _sharedCache.set(THREE, textures);
    return textures;
}

function sharedMaterials(THREE, colors = {}) {
    const tex = getSharedTextures(THREE);
    return {
        concrete: new THREE.MeshStandardMaterial({
            map: tex.concrete, color: colors.concrete ?? 0xd8d4cc, roughness: 0.9
        }),
        concreteDark: new THREE.MeshStandardMaterial({
            map: tex.concrete, color: colors.concreteDark ?? 0x8a8680, roughness: 0.95
        }),
        aluminum: new THREE.MeshStandardMaterial({
            map: tex.metalBrushed, color: colors.aluminum ?? 0xc8ccd0,
            roughness: 0.35, metalness: 0.7
        }),
        metalDark: new THREE.MeshStandardMaterial({
            color: colors.metalDark ?? 0x2a2c2e, roughness: 0.45, metalness: 0.6
        }),
        deck: new THREE.MeshStandardMaterial({
            map: tex.deckWood, color: colors.deck ?? 0x9a7a58, roughness: 0.8
        }),
        fabric: new THREE.MeshStandardMaterial({
            map: tex.fabricGray, color: colors.fabric ?? 0x7a7e82,
            roughness: 0.95, side: THREE.DoubleSide
        }),
        glassDark: new THREE.MeshStandardMaterial({
            color: colors.glassDark ?? 0x22303a, roughness: 0.08, metalness: 0.7,
            transparent: true, opacity: 0.55
        }),
        water: new THREE.MeshStandardMaterial({
            color: colors.water ?? 0x2a8ab8, roughness: 0.05, metalness: 0.15,
            transparent: true, opacity: 0.78,
            emissive: 0x0a2a3a, emissiveIntensity: 0.25
        }),
        plasticWhite: new THREE.MeshStandardMaterial({
            color: colors.plasticWhite ?? 0xe8e8e6, roughness: 0.6
        }),
        ledWarm: new THREE.MeshStandardMaterial({
            color: 0xfff0d0, emissive: 0xffc070, emissiveIntensity: 1.4
        }),
        ledCool: new THREE.MeshStandardMaterial({
            color: 0xf0f8ff, emissive: 0xb0d8ff, emissiveIntensity: 1.3
        }),
        ledRed: new THREE.MeshStandardMaterial({
            color: 0xff2020, emissive: 0xff0000, emissiveIntensity: 1.2
        }),
        blade: new THREE.MeshStandardMaterial({
            color: 0x4e7a2a, roughness: 0.9, side: THREE.DoubleSide
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
// VEHÍCULO Y MOVILIDAD
// ============================================================

/** Coche moderno low-poly. */
export class ModernCar extends ModernProp {
    constructor(x, y, options = {}) {
        super(x, y, 4.4, 1.9, options);
        this.carColor = options.carColor ?? 0x3a3f45;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const body = new THREE.MeshStandardMaterial({
            color: this.carColor, roughness: 0.25, metalness: 0.6
        });

        add(new THREE.BoxGeometry(4.2, 0.55, 1.8), body, 0, 0.62, 0);
        add(new THREE.BoxGeometry(2.1, 0.5, 1.62), mat.glassDark, -0.15, 1.12, 0);
        add(new THREE.BoxGeometry(2.0, 0.08, 1.58), body, -0.15, 1.4, 0);
        add(new THREE.BoxGeometry(0.18, 0.3, 1.84), mat.metalDark, 2.08, 0.5, 0);
        add(new THREE.BoxGeometry(0.18, 0.3, 1.84), mat.metalDark, -2.08, 0.5, 0);

        for (const dz of [-0.6, 0.6]) {
            add(new THREE.BoxGeometry(0.06, 0.12, 0.4), mat.ledCool, 2.12, 0.75, dz);
            add(new THREE.BoxGeometry(0.06, 0.12, 0.4), mat.ledRed, -2.12, 0.75, dz);
        }

        for (const dx of [-1.35, 1.35]) {
            for (const dz of [-0.92, 0.92]) {
                const wheel = add(new THREE.CylinderGeometry(0.34, 0.34, 0.24, 14),
                    mat.metalDark, dx, 0.34, dz);
                wheel.rotation.x = Math.PI / 2;
                const hub = add(new THREE.CylinderGeometry(0.16, 0.16, 0.26, 10),
                    mat.aluminum, dx, 0.34, dz);
                hub.rotation.x = Math.PI / 2;
            }
        }

        for (const dz of [-0.95, 0.95]) {
            add(new THREE.BoxGeometry(0.1, 0.08, 0.18), body, 0.85, 1.15, dz);
        }

        this._finishGroup(engine, group, "ModernCar");
        this.AsingProps(group, engine, true);
    }
}

/** Bicicleta apoyada. */
export class Bicycle extends ModernProp {
    constructor(x, y, options = {}) {
        super(x, y, 1.8, 0.6, options);
        this.frameColor = options.frameColor ?? 0xc8502a;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const frame = new THREE.MeshStandardMaterial({
            color: this.frameColor, roughness: 0.4, metalness: 0.5
        });

        for (const dx of [-0.62, 0.62]) {
            const wheel = add(new THREE.TorusGeometry(0.34, 0.035, 8, 18),
                mat.metalDark, dx, 0.34, 0);
            wheel.rotation.y = Math.PI / 2;
        }

        const tube = (x1, y1, x2, y2) => {
            const dx = x2 - x1, dy = y2 - y1;
            const len = Math.hypot(dx, dy);
            const t = add(new THREE.CylinderGeometry(0.025, 0.025, len, 6), frame,
                (x1 + x2) / 2, (y1 + y2) / 2, 0);
            t.rotation.z = Math.atan2(dx, dy);
        };
        tube(-0.62, 0.34, -0.1, 0.95);
        tube(-0.1, 0.95, 0.45, 0.9);
        tube(0.45, 0.9, 0.62, 0.34);
        tube(-0.1, 0.95, 0.1, 0.34);
        tube(0.1, 0.34, 0.45, 0.9);
        tube(-0.62, 0.34, 0.1, 0.34);

        add(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6), mat.metalDark,
            0.45, 1.05, 0).rotation.x = Math.PI / 2;
        add(new THREE.BoxGeometry(0.22, 0.06, 0.14), mat.metalDark, -0.12, 1.02, 0);

        this._finishGroup(engine, group, "Bicycle");
    }
}

// ============================================================
// MOBILIARIO EXTERIOR
// ============================================================

/** Tumbona / hamaca de jardín. */
export class SunLounger extends ModernProp {
    constructor(x, y, options = {}) {
        super(x, y, 2.0, 0.7, options);
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        add(new THREE.BoxGeometry(1.35, 0.1, 0.62), mat.fabric, 0.25, 0.38, 0);
        const back = add(new THREE.BoxGeometry(0.75, 0.09, 0.62), mat.fabric,
            -0.62, 0.62, 0);
        back.rotation.z = 0.65;
        for (const dx of [-0.7, 0.1, 0.85]) {
            for (const dz of [-0.26, 0.26]) {
                add(new THREE.CylinderGeometry(0.025, 0.025, 0.34, 6), mat.aluminum,
                    dx, 0.17, dz);
            }
        }

        this._finishGroup(engine, group, "SunLounger");
    }
}

/** Parasol cuadrado moderno. NO bloquea. */
export class ParasolModern extends ModernProp {
    constructor(x, y, options = {}) {
        super(x, y, 1, 1, { ...options, blocks: options.blocks ?? false });
        this.canopySize = options.canopySize ?? 2.6;
        this.canopyColor = options.canopyColor ?? 0xe8e4dc;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const S = this.canopySize;
        const canopyMat = new THREE.MeshStandardMaterial({
            color: this.canopyColor, roughness: 0.9, side: THREE.DoubleSide
        });

        add(new THREE.CylinderGeometry(0.25, 0.28, 0.1, 12), mat.concreteDark, 0, 0.05, 0);
        add(new THREE.CylinderGeometry(0.035, 0.035, 2.4, 8), mat.aluminum, 0, 1.25, 0);

        const canopy = add(new THREE.ConeGeometry(S * 0.72, 0.4, 4), canopyMat,
            0, 2.55, 0);
        canopy.rotation.y = Math.PI / 4;

        this._finishGroup(engine, group, "ParasolModern");
    }
}

/** Barbacoa / grill moderno. */
export class BBQGrill extends ModernProp {
    constructor(x, y, options = {}) {
        super(x, y, 1.2, 0.7, options);
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        add(new THREE.BoxGeometry(0.95, 0.4, 0.55), mat.metalDark, 0, 0.85, 0);
        add(new THREE.BoxGeometry(0.98, 0.22, 0.58), mat.aluminum, 0, 1.16, 0);
        add(new THREE.BoxGeometry(0.4, 0.03, 0.03), mat.metalDark, 0, 1.32, 0.2);
        for (const dx of [-0.4, 0.4]) {
            for (const dz of [-0.22, 0.22]) {
                add(new THREE.CylinderGeometry(0.025, 0.025, 0.65, 6), mat.metalDark,
                    dx, 0.32, dz);
            }
        }
        add(new THREE.BoxGeometry(0.3, 0.03, 0.5), mat.aluminum, 0.62, 0.9, 0);
        for (let i = -1; i <= 1; i++) {
            const knob = add(new THREE.CylinderGeometry(0.03, 0.03, 0.04, 8), mat.aluminum,
                i * 0.2, 0.85, 0.29);
            knob.rotation.x = Math.PI / 2;
        }

        this._finishGroup(engine, group, "BBQGrill");
    }
}

/** Jardinera cúbica de hormigón con plantas. */
export class PlanterModern extends ModernProp {
    constructor(x, y, options = {}) {
        const size = options.size ?? 0.9;
        super(x, y, size, size, options);
        this.planterSize = size;
        this.plantHeight = options.plantHeight ?? 0.9;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const S = this.planterSize;

        add(new THREE.BoxGeometry(S, S * 0.62, S), mat.concrete, 0, S * 0.31, 0);
        add(new THREE.BoxGeometry(S - 0.12, 0.05, S - 0.12), mat.concreteDark,
            0, S * 0.6, 0);

        const bladeGeo = new THREE.ConeGeometry(0.04, this.plantHeight, 4, 1);
        bladeGeo.translate(0, this.plantHeight / 2, 0);
        const blades = new THREE.InstancedMesh(bladeGeo, mat.blade, 22);
        blades.castShadow = true;
        const dummy = new THREE.Object3D();
        const rnd = this._rng();
        for (let i = 0; i < 22; i++) {
            dummy.position.set(
                (rnd() - 0.5) * (S - 0.3),
                S * 0.6,
                (rnd() - 0.5) * (S - 0.3)
            );
            dummy.rotation.set((rnd() - 0.5) * 0.4, rnd() * Math.PI * 2, (rnd() - 0.5) * 0.4);
            dummy.scale.set(0.6 + rnd() * 0.4, 0.5 + rnd() * 0.9, 0.25);
            dummy.updateMatrix();
            blades.setMatrixAt(i, dummy.matrix);
        }
        blades.instanceMatrix.needsUpdate = true;
        group.add(blades);

        this._finishGroup(engine, group, "PlanterModern");
    }
}

// ============================================================
// INFRAESTRUCTURA Y SERVICIOS
// ============================================================

/** Contenedores de reciclaje (set de 2-3). */
export class TrashBinSet extends ModernProp {
    constructor(x, y, options = {}) {
        const count = options.count ?? 3;
        super(x, y, count * 0.62, 0.7, options);
        this.binCount = count;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const binColors = [0x3a7a3a, 0x2a5a9a, 0x5a5a5e];
        const startX = -((this.binCount - 1) * 0.62) / 2;

        for (let i = 0; i < this.binCount; i++) {
            const bx = startX + i * 0.62;
            const binMat = new THREE.MeshStandardMaterial({
                color: binColors[i % binColors.length], roughness: 0.6
            });

            add(new THREE.BoxGeometry(0.52, 0.95, 0.6), binMat, bx, 0.52, 0);
            add(new THREE.BoxGeometry(0.55, 0.12, 0.63), binMat, bx, 1.05, 0);
            for (const dz of [-0.24, 0.24]) {
                const wheel = add(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 8),
                    mat.metalDark, bx - 0.2, 0.08, dz);
                wheel.rotation.x = Math.PI / 2;
            }
            add(new THREE.BoxGeometry(0.06, 0.18, 0.3), mat.metalDark, bx + 0.28, 0.95, 0);
        }

        this._finishGroup(engine, group, "TrashBinSet");
    }
}

/** Unidad exterior de aire acondicionado. */
export class ACUnit extends ModernProp {
    constructor(x, y, options = {}) {
        super(x, y, 1.0, 0.45, options);
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        add(new THREE.BoxGeometry(0.9, 0.6, 0.35), mat.plasticWhite, 0, 0.42, 0);
        add(new THREE.TorusGeometry(0.22, 0.02, 6, 16), mat.metalDark, 0, 0.42, 0.18);
        for (let i = 0; i < 3; i++) {
            const blade = add(new THREE.BoxGeometry(0.36, 0.06, 0.02), mat.metalDark,
                0, 0.42, 0.18);
            blade.rotation.z = (i / 3) * Math.PI;
        }
        for (let i = 0; i < 5; i++) {
            add(new THREE.BoxGeometry(0.02, 0.4, 0.3), mat.plasticWhite,
                -0.3 + i * 0.15, 0.42, -0.19);
        }
        for (const dx of [-0.35, 0.35]) {
            add(new THREE.BoxGeometry(0.08, 0.12, 0.3), mat.metalDark, dx, 0.06, 0);
        }

        this._finishGroup(engine, group, "ACUnit");
    }
}

/** Panel solar con soporte. */
export class SolarPanel extends ModernProp {
    constructor(x, y, options = {}) {
        super(x, y, 1.7, 1.2, options);
        this.tilt = options.tilt ?? 0.5;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const panelMat = new THREE.MeshStandardMaterial({
            color: 0x14243e, roughness: 0.15, metalness: 0.75
        });

        const panel = add(new THREE.BoxGeometry(1.6, 0.05, 1.0), panelMat, 0, 0.85, 0);
        panel.rotation.x = -this.tilt;

        const frame = add(new THREE.BoxGeometry(1.66, 0.07, 1.06), mat.aluminum, 0, 0.84, 0);
        frame.rotation.x = -this.tilt;

        for (let i = 1; i < 4; i++) {
            const line = add(new THREE.BoxGeometry(0.02, 0.06, 1.0), mat.aluminum,
                -0.8 + i * 0.4, 0.86, 0);
            line.rotation.x = -this.tilt;
        }

        for (const dx of [-0.6, 0.6]) {
            add(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 6), mat.aluminum, dx, 0.35, 0.3);
            add(new THREE.CylinderGeometry(0.03, 0.03, 1.0, 6), mat.aluminum, dx, 0.5, -0.25);
        }

        this._finishGroup(engine, group, "SolarPanel");
    }
}

/** Cargador de vehículo eléctrico. */
export class EVCharger extends ModernProp {
    constructor(x, y, options = {}) {
        super(x, y, 0.5, 0.5, options);
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        add(new THREE.BoxGeometry(0.16, 1.4, 0.16), mat.metalDark, 0, 0.7, 0);
        add(new THREE.BoxGeometry(0.26, 0.4, 0.14), mat.plasticWhite, 0, 1.35, 0);
        add(new THREE.BoxGeometry(0.16, 0.12, 0.02), mat.ledCool, 0, 1.42, 0.08);
        const cable = add(new THREE.TorusGeometry(0.22, 0.02, 6, 12, Math.PI), mat.metalDark,
            0.14, 1.05, 0);
        cable.rotation.z = Math.PI / 2;
        add(new THREE.CylinderGeometry(0.035, 0.035, 0.14, 8), mat.metalDark, 0.36, 0.95, 0);

        this._finishGroup(engine, group, "EVCharger");
    }
}

/** Buzón moderno sobre poste. */
export class MailboxModern extends ModernProp {
    constructor(x, y, options = {}) {
        super(x, y, 0.5, 0.5, options);
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        add(new THREE.CylinderGeometry(0.04, 0.05, 1.1, 8), mat.metalDark, 0, 0.55, 0);
        add(new THREE.BoxGeometry(0.42, 0.28, 0.3), mat.aluminum, 0, 1.24, 0);
        add(new THREE.BoxGeometry(0.3, 0.03, 0.02), mat.metalDark, 0, 1.32, 0.16);
        add(new THREE.BoxGeometry(0.03, 0.16, 0.08), mat.ledRed, 0.23, 1.42, 0);

        this._finishGroup(engine, group, "MailboxModern");
    }
}

/** Placa de número de casa (texto procedural). */
export class HouseNumberSign extends ModernProp {
    constructor(x, y, options = {}) {
        super(x, y, 1, 1, { ...options, blocks: false });
        this.number = options.number ?? 42;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const c = document.createElement("canvas");
        c.width = 128; c.height = 64;
        const ctx = c.getContext("2d");
        ctx.fillStyle = "#1e2226"; ctx.fillRect(0, 0, 128, 64);
        ctx.fillStyle = "#f0f0f0";
        ctx.font = "bold 44px sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(String(this.number), 64, 34);
        const tex = new THREE.CanvasTexture(c);
        tex.colorSpace = THREE.SRGBColorSpace;

        const plateMat = new THREE.MeshStandardMaterial({
            map: tex, roughness: 0.5, metalness: 0.3,
            emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.25
        });

        add(new THREE.CylinderGeometry(0.03, 0.04, 1.2, 8), mat.metalDark, 0, 0.6, 0);
        add(new THREE.BoxGeometry(0.5, 0.26, 0.04), plateMat, 0, 1.3, 0);

        this._finishGroup(engine, group, "HouseNumberSign");
    }
}

// ============================================================
// ILUMINACIÓN Y SEGURIDAD
// ============================================================

/** Farola moderna de LED. */
export class StreetLampModern extends ModernProp {
    constructor(x, y, options = {}) {
        super(x, y, 1, 1, options);
        this.lampHeight = options.height ?? 4;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const H = this.lampHeight;

        add(new THREE.CylinderGeometry(0.06, 0.09, H, 10), mat.metalDark, 0, H / 2, 0);
        add(new THREE.BoxGeometry(0.7, 0.06, 0.06), mat.metalDark, 0.32, H - 0.05, 0);
        add(new THREE.BoxGeometry(0.5, 0.08, 0.22), mat.metalDark, 0.6, H - 0.12, 0);
        add(new THREE.BoxGeometry(0.42, 0.03, 0.16), mat.ledCool, 0.6, H - 0.17, 0);

        const light = new THREE.PointLight(0xd8e8ff, 0.7, 9);
        light.position.set(0.6, H - 0.3, 0);
        group.add(light);

        this._finishGroup(engine, group, "StreetLampModern");
    }
}

/** Baliza de camino. */
export class PathBollard extends ModernProp {
    constructor(x, y, options = {}) {
        super(x, y, 1, 1, options);
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        add(new THREE.CylinderGeometry(0.05, 0.06, 0.75, 8), mat.metalDark, 0, 0.375, 0);
        add(new THREE.CylinderGeometry(0.055, 0.055, 0.12, 8), mat.ledWarm, 0, 0.68, 0);
        add(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 8), mat.metalDark, 0, 0.77, 0);

        this._finishGroup(engine, group, "PathBollard");
    }
}

/** Cámara de seguridad con parpadeo. */
export class SecurityCamera extends ModernProp {
    constructor(x, y, options = {}) {
        super(x, y, 1, 1, { ...options, blocks: false });
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        add(new THREE.BoxGeometry(0.06, 0.25, 0.06), mat.metalDark, 0, 2.3, 0);
        add(new THREE.BoxGeometry(0.05, 0.05, 0.3), mat.metalDark, 0, 2.42, 0.12);
        const body = add(new THREE.CylinderGeometry(0.07, 0.07, 0.28, 10), mat.plasticWhite,
            0, 2.42, 0.3);
        body.rotation.x = Math.PI / 2 - 0.25;
        add(new THREE.CylinderGeometry(0.05, 0.05, 0.03, 10), mat.metalDark,
            0, 2.38, 0.45).rotation.x = Math.PI / 2;
        this._led = add(new THREE.SphereGeometry(0.02, 6, 6), mat.ledRed,
            0.06, 2.46, 0.4);

        this._finishGroup(engine, group, "SecurityCamera");
    }

    update() {
        if (!this._led) return;
        this._led.visible = Math.floor(performance.now() / 900) % 2 === 0;
    }
}

// ============================================================
// OCIO Y ESTRUCTURAS
// ============================================================

/** Piscina moderna enterrada con coronación. */
export class PoolModern extends ModernProp {
    constructor(x, y, options = {}) {
        const width = options.width ?? 6;
        const depth = options.depth ?? 3;
        super(x, y, width, depth, options);
        this.poolWidth = width;
        this.poolDepth = depth;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const W = this.poolWidth, D = this.poolDepth;

        add(new THREE.BoxGeometry(W, 1.2, D), mat.concreteDark, 0, -0.6, 0);
        add(new THREE.BoxGeometry(W - 0.1, 0.1, D - 0.1), mat.water, 0, -0.06, 0);

        const cw = 0.35;
        add(new THREE.BoxGeometry(W + cw * 2, 0.12, cw), mat.concrete, 0, 0.02, D / 2 + cw / 2);
        add(new THREE.BoxGeometry(W + cw * 2, 0.12, cw), mat.concrete, 0, 0.02, -D / 2 - cw / 2);
        add(new THREE.BoxGeometry(cw, 0.12, D), mat.concrete, W / 2 + cw / 2, 0.02, 0);
        add(new THREE.BoxGeometry(cw, 0.12, D), mat.concrete, -W / 2 - cw / 2, 0.02, 0);

        for (const dx of [-0.3, 0.3]) {
            add(new THREE.CylinderGeometry(0.025, 0.025, 1.1, 8), mat.aluminum,
                W / 2 - 0.25, -0.25, dx);
        }
        for (let i = 0; i < 3; i++) {
            add(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8), mat.aluminum,
                W / 2 - 0.25, -0.15 - i * 0.28, 0).rotation.x = Math.PI / 2;
        }

        this._finishGroup(engine, group, "PoolModern");
    }
}

/** Pérgola de lamas. NO bloquea. */
export class PergolaModern extends ModernProp {
    constructor(x, y, options = {}) {
        const width = options.width ?? 4;
        const depth = options.depth ?? 3;
        super(x, y, width, depth, { ...options, blocks: options.blocks ?? false });
        this.pergolaWidth = width;
        this.pergolaDepth = depth;
        this.pergolaHeight = options.height ?? 2.5;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const W = this.pergolaWidth, D = this.pergolaDepth, H = this.pergolaHeight;

        for (const dx of [-1, 1]) {
            for (const dz of [-1, 1]) {
                add(new THREE.BoxGeometry(0.12, H, 0.12), mat.metalDark,
                    dx * (W / 2 - 0.06), H / 2, dz * (D / 2 - 0.06));
            }
        }
        add(new THREE.BoxGeometry(W, 0.16, 0.08), mat.deck, 0, H - 0.08, D / 2 - 0.06);
        add(new THREE.BoxGeometry(W, 0.16, 0.08), mat.deck, 0, H - 0.08, -D / 2 + 0.06);

        const slatCount = Math.floor(W / 0.35);
        for (let i = 0; i < slatCount; i++) {
            add(new THREE.BoxGeometry(0.07, 0.1, D), mat.deck,
                -W / 2 + 0.2 + i * ((W - 0.4) / (slatCount - 1)), H + 0.05, 0);
        }

        this._finishGroup(engine, group, "PergolaModern");
    }
}

/** Panel de valla moderna. */
export class FenceModernPanel extends ModernProp {
    constructor(x, y, options = {}) {
        const length = options.length ?? 3;
        super(x, y, length, 1, options);
        this.panelLength = length;
        this.panelHeight = options.height ?? 1.6;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        const L = this.panelLength, H = this.panelHeight;

        add(new THREE.BoxGeometry(0.1, H + 0.15, 0.1), mat.metalDark, -L / 2 + 0.05, (H + 0.15) / 2, 0);
        add(new THREE.BoxGeometry(0.1, H + 0.15, 0.1), mat.metalDark, L / 2 - 0.05, (H + 0.15) / 2, 0);

        const slatCount = Math.floor(H / 0.28);
        for (let i = 0; i < slatCount; i++) {
            add(new THREE.BoxGeometry(L - 0.1, 0.18, 0.04), mat.deck,
                0, 0.2 + i * 0.28, 0);
        }

        this._finishGroup(engine, group, "FenceModernPanel");
    }
}

/** Fire pit moderno (cuenco con fuego animado). */
export class FirePitModern extends ModernProp {
    constructor(x, y, options = {}) {
        super(x, y, 1.2, 1.2, options);
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();
        const mat = sharedMaterials(THREE, this.colors);
        const add = addMeshFactory()(group);

        add(new THREE.CylinderGeometry(0.55, 0.4, 0.4, 16), mat.concreteDark, 0, 0.2, 0);
        add(new THREE.CylinderGeometry(0.48, 0.42, 0.06, 16), mat.metalDark, 0, 0.38, 0);

        this._fire = add(new THREE.ConeGeometry(0.28, 0.5, 8),
            new THREE.MeshStandardMaterial({
                color: 0xff8820, emissive: 0xff5500, emissiveIntensity: 1.6,
                transparent: true, opacity: 0.85
            }),
            0, 0.62, 0);

        this._light = new THREE.PointLight(0xff7730, 0.9, 6);
        this._light.position.set(0, 0.8, 0);
        group.add(this._light);

        this._finishGroup(engine, group, "FirePitModern");
    }

    update() {
        if (!this._fire) return;
        const t = performance.now() / 1000;
        const flick = 1 + Math.sin(t * 11) * 0.12 + Math.sin(t * 23) * 0.06;
        this._fire.scale.set(flick, 1 + Math.sin(t * 9) * 0.18, flick);
        this._light.intensity = 0.8 + Math.sin(t * 13) * 0.2;
    }
}

// ============================================================
// HELPER: escena exterior moderna completa
// ============================================================

/**
 * Compone una escena exterior moderna coherente.
 *
 * ⚠️ Las posiciones (baseX, baseY, offsets) están en TILES. Como los
 * objetos ahora ocupan más tiles (escala ×1.667), algunos pueden
 * solaparse. Si ves solapamientos, separa más los offsets o reduce
 * METERS_TO_TILES globalmente.
 */
export function buildModernScene(map, baseX, baseY) {
    const pieces = [];
    const place = (p) => { map.place(p); pieces.push(p); };

    // ---------- ENTRADA / DRIVEWAY ----------
    place(new ModernCar(baseX, baseY, { carColor: 0x2a3a5a, seed: 101 }));
    place(new EVCharger(baseX + 9, baseY + 2, { seed: 102 }));       // +9 en vez de +5
    place(new TrashBinSet(baseX + 10, baseY - 2, { count: 3, seed: 103 }));
    place(new MailboxModern(baseX - 2, baseY + 6, { seed: 104 }));
    place(new HouseNumberSign(baseX - 3, baseY + 6, { number: 42, seed: 105 }));
    place(new StreetLampModern(baseX - 5, baseY + 3, { seed: 106 }));
    place(new SecurityCamera(baseX + 11, baseY + 4, { seed: 107 }));

    for (let i = 0; i < 4; i++) {
        place(new PathBollard(baseX + 2 + i * 2.5, baseY + 8, { seed: 110 + i }));
    }

    // ---------- PATIO TRASERO ----------
    const py = baseY + 16;                                            // +16 en vez de +10
    place(new PoolModern(baseX, py, { width: 6, depth: 3, seed: 201 }));
    place(new SunLounger(baseX + 1, py + 6, { seed: 202 }));
    place(new SunLounger(baseX + 5, py + 6, { seed: 203 }));
    place(new ParasolModern(baseX + 3, py + 8, { canopyColor: 0xe8e4dc, seed: 204 }));
    place(new PergolaModern(baseX + 10, py + 4, { width: 4, depth: 3, seed: 205 }));
    place(new BBQGrill(baseX + 11, py + 1, { seed: 206 }));
    place(new FirePitModern(baseX + 11, py + 8, { seed: 207 }));

    place(new PlanterModern(baseX - 3, py + 3, { seed: 208 }));
    place(new PlanterModern(baseX - 3, py + 7, { seed: 209 }));

    for (let i = 0; i < 4; i++) {
        place(new FenceModernPanel(baseX + 14, py - 2 + i * 5, {
            length: 3, rotation: Math.PI / 2, seed: 210 + i
        }));
    }

    place(new Bicycle(baseX + 12, py - 2, { rotation: Math.PI / 2, seed: 220 }));

    return {
        pieces,
        update: () => pieces.forEach(p => p.update?.())
    };
}