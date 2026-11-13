import { WorldObject } from "../WorldObjectModels.js";
import { Tree } from "../Vegetation/Tree.js";
import { Bush } from "../Vegetation/Bush.js";

/**
 * @callback VillaInteractionCallback
 * @param {ModernVilla} villa
 * @param {{ type: "door"|"window", open?: boolean, lightOn?: boolean }} state
 * @returns {void}
 */

/**
 * Opciones de configuración para ModernVilla.
 *
 * @typedef {Object} ModernVillaOptions
 * @property {number}  [width=16]                - Ancho total del terreno construido.
 * @property {number}  [depth=10]                - Profundidad total.
 * @property {number}  [floorHeight=3.2]         - Altura del primer nivel.
 * @property {number}  [fasciaHeight=1.0]        - Alto de la banda blanca horizontal.
 * @property {number}  [upperHeight=2.6]         - Alto del segundo nivel.
 * @property {number}  [porchDepth=2.6]          - Profundidad del porche cubierto.
 * @property {number}  [bodyRatio=0.68]          - Fracción del ancho del volumen cerrado.
 * @property {number}  [overhang=0.9]            - Vuelo de la losa/fascia.
 * @property {number}  [wallsColor=0xf5f4f0]     - Blanco de fascias y muros.
 * @property {number}  [concreteColor=0xb7b0a6]  - Hormigón/piedra.
 * @property {number}  [woodColor=0xb98a5a]      - Madera horizontal del porche.
 * @property {number}  [doorColor=0x8a5a33]      - Puerta de madera.
 * @property {number}  [glassColor=0x2e3a40]     - Vidrio oscuro.
 * @property {number}  [trimColor=0x2a2a2a]      - Perfiles metálicos.
 * @property {number}  [paverColor=0xd9d4c8]     - Losas del camino.
 * @property {number}  [accentColor=0xb0245e]    - Acento de flores (buganvilla).
 * @property {boolean} [garden=true]             - Camino, césped y murito de lindero.
 * @property {boolean} [street=true]             - Acera, bordillo y calzada.
 * @property {boolean} [carport=true]            - Cochera abierta a la derecha.
 * @property {number}  [interactionRadius=2.6]   - Radio de interacción.
 * @property {string}  [interactionKey="E"]      - Tecla del indicador.
 * @property {number}  [seed]                    - Semilla (jardín reproducible).
 * @property {VillaInteractionCallback} [doorAction]
 * @property {VillaInteractionCallback} [windowAction]
 * @property {string}  [name="ModernVilla"]
 */

export class ModernVilla extends WorldObject {
    constructor(x, y, options = {}) {
        const w = options.width ?? 16;
        const d = options.depth ?? 10;
        super(x, y, w, d, options);

        this.name = options.name ?? "ModernVilla";

        this.width = w;
        this.depth = d;
        this.floorHeight = options.floorHeight ?? 3.2;
        this.fasciaHeight = options.fasciaHeight ?? 1.0;
        this.upperHeight = options.upperHeight ?? 2.6;
        this.porchDepth = options.porchDepth ?? 2.6;
        this.bodyRatio = options.bodyRatio ?? 0.68;
        this.overhang = options.overhang ?? 0.9;

        this.colors = {
            walls:    options.wallsColor    ?? 0xf5f4f0,
            concrete: options.concreteColor ?? 0xb7b0a6,
            wood:     options.woodColor     ?? 0xb98a5a,
            door:     options.doorColor     ?? 0x8a5a33,
            glass:    options.glassColor    ?? 0x2e3a40,
            trim:     options.trimColor     ?? 0x2a2a2a,
            paver:    options.paverColor    ?? 0xd9d4c8,
            accent:   options.accentColor   ?? 0xb0245e
        };

        this.garden = options.garden ?? true;
        this.street = options.street ?? true;
        this.carport = options.carport ?? true;

        this.doorAction = options.doorAction ?? null;
        this.windowAction = options.windowAction ?? null;
        this.interactionRadius = options.interactionRadius ?? 2.6;
        this.interactionKey = options.interactionKey ?? "E";

        this.nearDoor = false;
        this.nearWindow = false;
        this.doorOpen = false;
        this.windowLightOn = false;

        this.seed = options.seed ?? Math.floor(Math.random() * 1e9);

        // ==========================================================
        // LAYOUT COMPARTIDO (coordenadas de TERRENO: 0..w, 0..d)
        // Lo usan render(), occupies() y createGardenVegetation().
        // ==========================================================
        const bodyW = w * this.bodyRatio;
        const porchFoot = d - this.porchDepth;      // plano de la fachada
        const woodZoneW = bodyW * 0.52;
        const woodZoneXf = 0.2 + woodZoneW / 2;
        const concZoneXf = woodZoneW + bodyW * 0.24;
        const doorXf = concZoneXf - bodyW * 0.06;
        const winXf = bodyW - bodyW * 0.10;
        const planterW = woodZoneW * 0.92;
        const planterXf = woodZoneXf;
        const planterYf = porchFoot + 1.15;

        this._L = {
            bodyW, porchFoot, woodZoneW, woodZoneXf,
            concZoneXf, doorXf, winXf, planterW, planterXf, planterYf
        };

        // ==========================================================
        // RECTÁNGULOS DE COLISIÓN (AABB en coords de terreno)
        // Solapamiento tile↔rect: ningún muro fino queda sin bloquear.
        // El porche y la cochera siguen siendo caminables.
        // ==========================================================
        this._blockRects = [
            // Volumen cerrado (incluye el tile de la fachada del porche)
            [0, 0, bodyW, porchFoot],
            // Muro pantalla derecho
            [w - 0.25, 0, w, d],
            // Fondo de cochera
            [bodyW, 0, w - 0.25, 0.2],
            // Jardinera/murete del porche
            [planterXf - planterW / 2, planterYf - 0.3,
             planterXf + planterW / 2, planterYf + 0.3]
        ];

        // Murito de lindero izquierdo (solo si hay jardín)
        if (this.garden) {
            this._blockRects.push([-2.71, d * 0.075, -2.49, d * 0.825]);
        }
    }

    /**
     * Colisión por SOLAPAMIENTO de AABBs: un tile bloquea si su área
     * [tx, tx+1] × [ty, ty+1] intersecta cualquier rectángulo de muro.
     * Así los muros finos (fachada, pantalla, murito) bloquean siempre
     * el tile que ocupan, sin "paredes invisibles" extra.
     */
    occupies(tx, ty) {
        if (!this.blocksMovement) return false;

        const x0 = tx - this.x, x1 = x0 + 1;
        const y0 = ty - this.y, y1 = y0 + 1;

        for (const r of this._blockRects) {
            if (x1 > r[0] && x0 < r[2] && y1 > r[1] && y0 < r[3]) return true;
        }
        return false;
    }

    // --------------------------------------------------
    // TEXTURAS PROCEDURALES
    // --------------------------------------------------
    _noise(THREE, hex, spots = 5000, strength = 30) {
        const s = 256, c = document.createElement("canvas");
        c.width = c.height = s;
        const ctx = c.getContext("2d");
        ctx.fillStyle = hex; ctx.fillRect(0, 0, s, s);
        for (let i = 0; i < spots; i++) {
            const v = Math.floor(Math.random() * strength - strength / 2);
            ctx.fillStyle = `rgba(${128 + v},${126 + v},${122 + v},${0.05 + Math.random() * 0.12})`;
            ctx.fillRect(Math.random() * s, Math.random() * s, 1.5, 1.5);
        }
        for (let i = 0; i < 10; i++) {
            const px = Math.random() * s, py = Math.random() * s;
            const r = 15 + Math.random() * 35;
            const g = ctx.createRadialGradient(px, py, 0, px, py, r);
            g.addColorStop(0, "rgba(90,85,78,0.14)");
            g.addColorStop(1, "rgba(90,85,78,0)");
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
        }
        const t = new THREE.CanvasTexture(c);
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(2, 2);
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
    }

    _woodPlanks(THREE, hex, horizontal = true) {
        const s = 256, c = document.createElement("canvas");
        c.width = c.height = s;
        const ctx = c.getContext("2d");
        ctx.fillStyle = hex; ctx.fillRect(0, 0, s, s);
        const n = 8, sw = s / n;
        const r0 = parseInt(hex.slice(1, 3), 16);
        const g0 = parseInt(hex.slice(3, 5), 16);
        const b0 = parseInt(hex.slice(5, 7), 16);
        for (let i = 0; i < n; i++) {
            const sh = Math.floor(Math.random() * 28 - 14);
            ctx.fillStyle = `rgb(${r0 + sh},${g0 + sh},${b0 + sh})`;
            if (horizontal) {
                ctx.fillRect(0, i * sw + 1, s, sw - 2);
                ctx.strokeStyle = "rgba(40,22,10,0.6)"; ctx.lineWidth = 2;
                ctx.strokeRect(0, i * sw + 1, s, sw - 2);
            } else {
                ctx.fillRect(i * sw + 1, 0, sw - 2, s);
                ctx.strokeStyle = "rgba(40,22,10,0.6)"; ctx.lineWidth = 2;
                ctx.strokeRect(i * sw + 1, 0, sw - 2, s);
            }
            for (let v = 0; v < 10; v++) {
                ctx.strokeStyle = `rgba(50,28,12,${0.06 + Math.random() * 0.12})`;
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                if (horizontal) {
                    const yy = i * sw + Math.random() * sw;
                    ctx.moveTo(0, yy); ctx.lineTo(s, yy + (Math.random() - 0.5) * 3);
                } else {
                    const xx = i * sw + Math.random() * sw;
                    ctx.moveTo(xx, 0); ctx.lineTo(xx + (Math.random() - 0.5) * 3, s);
                }
                ctx.stroke();
            }
        }
        const t = new THREE.CanvasTexture(c);
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
    }

    _interior(THREE) {
        const s = 256, c = document.createElement("canvas");
        c.width = c.height = s;
        const ctx = c.getContext("2d");
        const g = ctx.createLinearGradient(0, 0, 0, s);
        g.addColorStop(0, "#7a6a52"); g.addColorStop(1, "#4a3c2a");
        ctx.fillStyle = g; ctx.fillRect(0, 0, s, s);
        ctx.fillStyle = "#332a1e"; ctx.fillRect(0, s * 0.8, s, s * 0.2);
        ctx.fillStyle = "#d8d2c2"; ctx.fillRect(0, 0, s * 0.18, s * 0.82);
        ctx.fillStyle = "#5a6a5a"; ctx.fillRect(s * 0.35, s * 0.62, s * 0.35, s * 0.16);
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
    }

    _grass(THREE) {
        const s = 256, c = document.createElement("canvas");
        c.width = c.height = s;
        const ctx = c.getContext("2d");
        ctx.fillStyle = "#4d7a35"; ctx.fillRect(0, 0, s, s);
        for (let i = 0; i < 6000; i++) {
            const v = Math.floor(Math.random() * 60 - 30);
            ctx.fillStyle = `rgba(${75 + v},${125 + v},${50 + v},0.5)`;
            ctx.fillRect(Math.random() * s, Math.random() * s, 2, 2);
        }
        const t = new THREE.CanvasTexture(c);
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(8, 8);
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
    }

    _indicator(THREE, key) {
        const s = 96, c = document.createElement("canvas");
        c.width = c.height = s;
        const ctx = c.getContext("2d");
        ctx.fillStyle = "rgba(10,10,14,0.85)";
        ctx.beginPath(); ctx.roundRect(8, 8, s - 16, s - 16, 18); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.9)"; ctx.lineWidth = 4; ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 46px sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(key, s / 2, s / 2 + 3);
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
    }

    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------
    render(engine) {
        if (this.rendered) return;

        const THREE = engine.THREE;
        const group = new THREE.Group();
        const L = this._L;

        const w = this.width, d = this.depth;
        const h1 = this.floorHeight;
        const fasciaH = this.fasciaHeight;
        const h2 = this.upperHeight;
        const porchD = this.porchDepth;
        const ov = this.overhang;

        const found = 0.25;
        const fasciaTop = found + h1 + fasciaH;

        // Terreno → local (origen del grupo = centro del footprint)
        const fx = f => f - w / 2;
        const fz = f => f - d / 2;

        const hex = n => "#" + n.toString(16).padStart(6, "0");

        const mat = {
            white: new THREE.MeshStandardMaterial({
                map: this._noise(THREE, hex(this.colors.walls), 3000, 18),
                color: this.colors.walls, roughness: 0.85
            }),
            concrete: new THREE.MeshStandardMaterial({
                map: this._noise(THREE, hex(this.colors.concrete)),
                color: this.colors.concrete, roughness: 0.9
            }),
            wood: new THREE.MeshStandardMaterial({
                map: this._woodPlanks(THREE, hex(this.colors.wood), true),
                color: this.colors.wood, roughness: 0.75
            }),
            door: new THREE.MeshStandardMaterial({
                map: this._woodPlanks(THREE, hex(this.colors.door), false),
                color: this.colors.door, roughness: 0.6
            }),
            glass: new THREE.MeshStandardMaterial({
                color: this.colors.glass, roughness: 0.08, metalness: 0.7,
                transparent: true, opacity: 0.5
            }),
            interior: new THREE.MeshStandardMaterial({
                map: this._interior(THREE), roughness: 0.9,
                emissive: 0xffb060, emissiveIntensity: 0.15
            }),
            trim: new THREE.MeshStandardMaterial({
                color: this.colors.trim, roughness: 0.4, metalness: 0.5
            }),
            paver: new THREE.MeshStandardMaterial({
                color: this.colors.paver, roughness: 0.95
            }),
            grass: new THREE.MeshStandardMaterial({
                map: this._grass(THREE), roughness: 1
            }),
            asphalt: new THREE.MeshStandardMaterial({ color: 0x35353a, roughness: 1 }),
            blade: new THREE.MeshStandardMaterial({
                color: 0x4e7a2a, roughness: 0.9, side: THREE.DoubleSide
            }),
            lamp: new THREE.MeshStandardMaterial({
                color: 0xfff2d0, emissive: 0xffc870, emissiveIntensity: 1.2
            })
        };
        this._interiorMat = mat.interior;

        const addMesh = (geo, m, x, y, z, parent = group) => {
            const mesh = new THREE.Mesh(geo, m);
            mesh.position.set(x, y, z);
            mesh.castShadow = true; mesh.receiveShadow = true;
            parent.add(mesh);
            return mesh;
        };
        const addBox = (bw, bh, bd, m, x, y, z, parent = group) =>
            addMesh(new THREE.BoxGeometry(bw, bh, bd), m, x, y, z, parent);

        // =============== CIMIENTO ===============
        addBox(w + 0.4, found, d + 0.4, mat.concrete, 0, found / 2, 0);

        // =============== VOLUMEN CERRADO ===============
        addBox(L.bodyW, h1, d - porchD, mat.white,
            fx(L.bodyW / 2), found + h1 / 2, fz((d - porchD) / 2));

        // =============== FACHADA DEL PORCHE ===============
        addBox(L.woodZoneW, h1 * 0.88, 0.06, mat.wood,
            fx(L.woodZoneXf), found + h1 * 0.46, fz(L.porchFoot) + 0.04);

        addBox(L.bodyW * 0.44, h1 * 0.92, 0.05, mat.concrete,
            fx(L.concZoneXf), found + h1 * 0.48, fz(L.porchFoot) + 0.035);

        // Vidrio estrecho (interactuable)
        const winW = 0.55, winH = h1 * 0.82;
        addBox(winW + 0.18, winH + 0.18, 0.1, mat.trim,
            fx(L.winXf), found + winH / 2 + 0.1, fz(L.porchFoot) + 0.06);
        addBox(winW, winH, 0.02, mat.interior,
            fx(L.winXf), found + winH / 2 + 0.1, fz(L.porchFoot) + 0.08);
        addBox(winW, winH, 0.02, mat.glass,
            fx(L.winXf), found + winH / 2 + 0.1, fz(L.porchFoot) + 0.12);

        // =============== PUERTA PIVOTANTE ===============
        const doorW = 1.25, doorH = h1 * 0.78;
        const doorZ = fz(L.porchFoot) + 0.09;

        addBox(doorW + 0.24, 0.1, 0.12, mat.trim,
            fx(L.doorXf), found + doorH + 0.05, doorZ);
        addBox(0.1, doorH + 0.1, 0.12, mat.trim,
            fx(L.doorXf) - doorW / 2 - 0.05, found + doorH / 2, doorZ);
        addBox(0.1, doorH + 0.1, 0.12, mat.trim,
            fx(L.doorXf) + doorW / 2 + 0.05, found + doorH / 2, doorZ);

        const pivot = new THREE.Group();
        pivot.position.set(fx(L.doorXf) - doorW / 2, 0, doorZ);
        group.add(pivot);
        this._doorPivot = pivot;

        addBox(doorW, doorH, 0.08, mat.door, doorW / 2, found + doorH / 2, 0, pivot);
        addBox(0.035, doorH * 0.55, 0.05, mat.trim,
            doorW * 0.82, found + doorH * 0.5, 0.07, pivot);

        addBox(0.08, 0.3, 0.06, mat.lamp,
            fx(L.doorXf) + doorW / 2 + 0.35, found + doorH * 0.72, doorZ + 0.05);

        // =============== JARDINERA CON SANSEVIERIAS (bloquea movimiento) ===============
        addBox(L.planterW, 0.55, 0.6, mat.white,
            fx(L.planterXf), found + 0.275, fz(L.planterYf));
        addBox(L.planterW - 0.1, 0.06, 0.5, mat.concrete,
            fx(L.planterXf), found + 0.56, fz(L.planterYf));

        const bladeGeo = new THREE.ConeGeometry(0.045, 1.0, 4, 1);
        bladeGeo.translate(0, 0.5, 0);
        const blades = new THREE.InstancedMesh(bladeGeo, mat.blade, 46);
        blades.castShadow = true;
        const dummy = new THREE.Object3D();
        for (let i = 0; i < 46; i++) {
            dummy.position.set(
                fx(L.planterXf) + (Math.random() - 0.5) * (L.planterW - 0.3),
                found + 0.55,
                fz(L.planterYf) + (Math.random() - 0.5) * 0.35
            );
            dummy.rotation.set(
                (Math.random() - 0.5) * 0.35,
                Math.random() * Math.PI * 2,
                (Math.random() - 0.5) * 0.35
            );
            dummy.scale.set(0.5 + Math.random() * 0.4, 0.6 + Math.random() * 0.8, 0.25);
            dummy.updateMatrix();
            blades.setMatrixAt(i, dummy.matrix);
        }
        blades.instanceMatrix.needsUpdate = true;
        group.add(blades);

        // =============== COCHERA ABIERTA ===============
        if (this.carport) {
            const carW = w - L.bodyW - 0.3;
            const carCX = fx((L.bodyW + (w - 0.3)) / 2);
            addBox(carW, 0.08, d - porchD - 0.3, mat.concrete,
                carCX, found + 0.04, fz((d - porchD) / 2));
            addBox(carW, h1, 0.2, mat.concrete,
                carCX, found + h1 / 2, fz(0.1));
        }

        // Muro pantalla derecho
        addBox(0.25, h1 + fasciaH, d, mat.white,
            fx(w - 0.125), (h1 + fasciaH) / 2, 0);

        // =============== FASCIA / LOSA PRINCIPAL ===============
        addBox(w + ov * 2, fasciaH, d + ov * 2, mat.white,
            0, found + h1 + fasciaH / 2, 0);

        for (let i = 0; i < 4; i++) {
            addMesh(new THREE.CylinderGeometry(0.09, 0.09, 0.04, 12), mat.lamp,
                fx(L.bodyW * (0.15 + i * 0.24)), found + h1 - 0.02,
                fz(L.porchFoot) + porchD * 0.55);
        }
        const porchLight = new THREE.PointLight(0xffc870, 0.7, 8);
        porchLight.position.set(
            fx(L.bodyW / 2), found + h1 - 0.3, fz(L.porchFoot) + porchD * 0.5
        );
        group.add(porchLight);

        // =============== SEGUNDO NIVEL ===============
        const volW = w * 0.52, volD = d * 0.55;
        const volXf = w / 2 - w * 0.04, volYf = d / 2 - d * 0.10;

        addBox(volW, h2, volD, mat.concrete,
            fx(volXf), fasciaTop + h2 / 2, fz(volYf));
        addBox(volW + 0.5, 0.55, volD + 0.5, mat.white,
            fx(volXf), fasciaTop + h2 + 0.275, fz(volYf));

        const uWinW = volW * 0.30, uWinH = 0.75;
        addBox(uWinW + 0.16, uWinH + 0.16, 0.1, mat.trim,
            fx(volXf + volW * 0.28), fasciaTop + h2 * 0.55, fz(volYf) + volD / 2 + 0.05);
        addBox(uWinW, uWinH, 0.02, mat.interior,
            fx(volXf + volW * 0.28), fasciaTop + h2 * 0.55, fz(volYf) + volD / 2 + 0.07);
        addBox(uWinW, uWinH, 0.02, mat.glass,
            fx(volXf + volW * 0.28), fasciaTop + h2 * 0.55, fz(volYf) + volD / 2 + 0.11);

        // =============== ESCALONES ===============
        addBox(2.6, 0.14, 0.55, mat.paver, fx(L.doorXf), 0.16, fz(L.porchFoot) + 0.9);
        addBox(3.0, 0.12, 0.55, mat.paver, fx(L.doorXf), 0.07, fz(L.porchFoot) + 1.45);

        // =============== JARDÍN ARQUITECTÓNICO (sin vegetación propia) ===============
        if (this.garden) {
            addBox(w + 9, 0.06, d + 10, mat.grass, 0, 0.03, 2);

            for (let i = 0; i < 5; i++) {
                addBox(3.4, 0.08, 1.1, mat.paver,
                    fx(L.doorXf) + 1.5, 0.06, fz(d / 2) + 1.2 + i * 1.45);
            }

            // Murito de lindero izquierdo (con colisión propia)
            addBox(0.22, 1.9, d * 0.75, mat.white,
                fx(-2.6), 0.95, fz(d * 0.45));
        }

        if (this.street) {
            addBox(w + 12, 0.1, 1.6, mat.paver, 0, 0.06, fz(d / 2) + 8.6);
            addBox(w + 12, 0.14, 0.35, mat.paver, 0, 0.09, fz(d / 2) + 9.5);
            addBox(w + 12, 0.09, 3.0, mat.asphalt, 0, 0.05, fz(d / 2) + 11.2);
        }

        // =============== INDICADORES ===============
        const indTex = this._indicator(THREE, this.interactionKey);
        const makeIndicator = (x, y, z) => {
            const sp = new THREE.Sprite(new THREE.SpriteMaterial({
                map: indTex, transparent: true, depthWrite: false, opacity: 0
            }));
            sp.position.set(x, y, z);
            sp.scale.set(0.55, 0.55, 1);
            sp.userData.baseY = y;
            sp.visible = false;
            group.add(sp);
            return sp;
        };
        this._doorIndicator = makeIndicator(fx(L.doorXf), found + doorH + 0.7, doorZ + 0.4);
        this._windowIndicator = makeIndicator(fx(L.winXf), found + winH + 0.7, fz(L.porchFoot) + 0.4);

        this._anchors = {
            door: new THREE.Vector3(fx(L.doorXf), found + doorH / 2, doorZ + 0.3),
            window: new THREE.Vector3(fx(L.winXf), found + winH / 2, fz(L.porchFoot) + 0.3)
        };

        // =============== POSICIÓN FINAL ===============
        group.position.set(this.x + w / 2, 0, this.y + d / 2);
        group.rotation.y = this.rotation ?? 0;
        group.name = `ModernVilla_${this.x}_${this.y}`;
        group.userData.worldObject = this;

        engine.renderer.scene.add(group);
        group.updateMatrixWorld(true);

        this.AsingProps(group, engine, true);
    }

    // --------------------------------------------------
    // JARDÍN REUTILIZANDO Tree Y Bush
    // --------------------------------------------------
    /**
     * Crea la vegetación del jardín usando las clases Tree y Bush ya
     * existentes (posicionadas relativas a la villa). Devuelve los
     * objetos SIN renderizar: añádelos al mundo con world.add(...).
     *
     * @param {Object} [overrides] - { tree?: TreeOptions, bush?: BushOptions }
     * @returns {(Tree|Bush)[]}
     */
    createGardenVegetation(overrides = {}) {
        const L = this._L;
        const w = this.width, d = this.depth;
        const s = this.seed;
        const list = [];

        // Árbol de sombra donde antes estaba la palmera izquierda
        list.push(new Tree(this.x - 3, this.y + d + 1, {
            seed: s + 1, height: 6.5, ...overrides.tree
        }));

        // Buganvilla magenta (arbusto redondo teñido)
        list.push(new Bush(this.x - 1.2, this.y + d + 0.4, {
            seed: s + 2,
            height: 0.9,
            leafColor: 0x9a2050,
            colorVariation: 0.3,
            blocks: false,
            ...overrides.bush
        }));
        list.push(new Bush(this.x - 2.4, this.y + d + 1.2, {
            seed: s + 3,
            height: 0.7,
            leafColor: 0x8a1e46,
            colorVariation: 0.3,
            blocks: false,
            ...overrides.bush
        }));

        // Topiarios cónicos flanqueando la entrada
        list.push(new Bush(this.x + L.doorXf - 2.4, this.y + d + 0.2, {
            seed: s + 4, shape: "cone", height: 1.6, radius: 0.45
        }));
        list.push(new Bush(this.x + L.doorXf + 2.4, this.y + d + 0.2, {
            seed: s + 5, shape: "cone", height: 1.6, radius: 0.45
        }));

        // Seto cuadrado con flores donde antes estaban los rosales
        for (let i = 0; i < 5; i++) {
            list.push(new Bush(this.x + w + 1.2, this.y + 1 + i * 1.4, {
                seed: s + 10 + i,
                shape: "box",
                height: 1.0,
                radius: 0.55,
                flowerColor: this.colors.accent,
                flowerCount: 25
            }));
        }

        // Árbol trasero derecho
        list.push(new Tree(this.x + w + 2, this.y - 3, {
            seed: s + 20, height: 5.5, ...overrides.tree
        }));

        return list;
    }

    // --------------------------------------------------
    // INTERACCIÓN
    // --------------------------------------------------
    _getPlayerPosition(engine) {
        const c = [
            engine.player?.position,
            engine.character?.position,
            engine.playerController?.position,
            engine.getPlayer?.()?.position,
            engine.player?.visual?.position,
            engine.character?.visual?.position
        ];
        return c.find(p => p && typeof p.x === "number") ?? null;
    }

    _worldAnchor(key) {
        return this.visual.localToWorld(this._anchors[key].clone());
    }

    checkProximity(worldPos) {
        if (!this.visual || !this._anchors) return;
        const test = key => {
            const a = this._worldAnchor(key);
            return Math.hypot(worldPos.x - a.x, worldPos.z - a.z) < this.interactionRadius;
        };
        this.nearDoor = test("door");
        this.nearWindow = !this.nearDoor && test("window");
    }

    update(engine, delta = 0.016) {
        if (!this.visual) return;

        if (this._doorPivot) {
            const target = this.doorOpen ? -1.75 : 0;
            this._doorPivot.rotation.y +=
                (target - this._doorPivot.rotation.y) * Math.min(1, delta * 8);
        }

        const p = engine ? this._getPlayerPosition(engine) : null;
        if (p) this.checkProximity(p);

        const t = performance.now() / 1000;
        for (const [sp, near] of [
            [this._doorIndicator, this.nearDoor],
            [this._windowIndicator, this.nearWindow]
        ]) {
            if (!sp) continue;
            sp.visible = near;
            if (near) {
                sp.material.opacity = 0.75 + Math.sin(t * 5) * 0.25;
                sp.position.y = sp.userData.baseY + Math.sin(t * 3) * 0.06;
            }
        }
    }

    interact() {
        if (this.nearDoor) {
            this.doorOpen = !this.doorOpen;
            this.doorAction?.(this, { type: "door", open: this.doorOpen });
            return "door";
        }
        if (this.nearWindow) {
            this.windowLightOn = !this.windowLightOn;
            if (this._interiorMat) {
                this._interiorMat.emissiveIntensity = this.windowLightOn ? 0.7 : 0.15;
            }
            this.windowAction?.(this, { type: "window", lightOn: this.windowLightOn });
            return "window";
        }
        return null;
    }

    getInteractionHint() {
        if (this.nearDoor) return "door";
        if (this.nearWindow) return "window";
        return null;
    }

    // --------------------------------------------------
    // DESTROY
    // --------------------------------------------------
    destroy() {
        if (this.visual) {
            this.visual.removeFromParent();
            this.visual.traverse(child => {
                if (child.isMesh || child.isSprite) {
                    child.geometry?.dispose();
                    const mats = Array.isArray(child.material)
                        ? child.material : [child.material];
                    mats.forEach(m => { m.map?.dispose(); m.dispose(); });
                }
            });
            this.visual = null;
        }
        this._doorPivot = null;
        this._doorIndicator = null;
        this._windowIndicator = null;
        this.rendered = false;
        this.engine = null;
        super.destroy();
    }
}