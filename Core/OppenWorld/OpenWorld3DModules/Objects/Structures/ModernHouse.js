import { WorldObject } from "../WorldObjectModels.js";

/**
 * Callback de interacción (puerta / ventana).
 *
 * @callback InteractionCallback
 * @param {ModernHouse} house  - Instancia de la casa.
 * @param {{ type: "door"|"window", open?: boolean, lightOn?: boolean }} state
 * @returns {void}
 */

/**
 * Opciones de configuración para ModernHouse.
 *
 * @typedef {Object} ModernHouseOptions
 * @property {number}  [width=9]               - Ancho total.
 * @property {number}  [depth=7]               - Profundidad total.
 * @property {number}  [height=3.6]            - Altura del muro (sin techo).
 * @property {number}  [wallsColor=0xf2f0ec]   - Color del enlucido/hormigón.
 * @property {number}  [wallsSecondaryColor=0x2a2a2a] - Color de marcos y metal.
 * @property {number}  [roofColor=0x232323]    - Color de la losa de techo.
 * @property {number}  [windowColor=0x9fb8c4]  - Tinte del vidrio.
 * @property {number}  [woodColor=0xc98d4f]    - Color de la lama de madera (porche).
 * @property {number}  [doorColor=0xd9a05b]    - Color de la puerta de madera.
 * @property {number}  [accentColor=0xc95a2a]  - Acentos (macetas, flores).
 * @property {number}  [porchRatio=0.44]       - Fracción del frente ocupada por el porche.
 * @property {number}  [porchDepth=0.7]        - Profundidad del nicho de entrada.
 * @property {boolean} [garden=true]           - Césped, arbustos y flores.
 * @property {boolean} [fence=true]            - Valla lateral de madera.
 * @property {boolean} [street=true]           - Acera y calzada delante.
 * @property {boolean} [chimney=false]         - Chimenea moderna con humo.
 * @property {boolean} [smoke=true]            - Humo (si hay chimenea).
 * @property {number}  [interactionRadius=2.6] - Distancia para poder interactuar.
 * @property {string}  [interactionKey="E"]    - Tecla mostrada en el indicador.
 * @property {InteractionCallback} [doorAction]   - Se ejecuta al interactuar con la puerta.
 * @property {InteractionCallback} [windowAction] - Se ejecuta al interactuar con la ventana.
 * @property {string}  [name="ModernHouse"]
 */

export class ModernHouse extends WorldObject {
    constructor(x, y, options = {}) {
        super(x, y, options.width ?? 9, options.depth ?? 7, options);

        this.name = options.name ?? "ModernHouse";

        this.width = options.width ?? 9;
        this.depth = options.depth ?? 7;
        this.height = options.height ?? 3.6;

        this.colors = {
            walls: options.wallsColor ?? 0xf2f0ec,
            trim: options.wallsSecondaryColor ?? 0x2a2a2a,
            roof: options.roofColor ?? 0x232323,
            window: options.windowColor ?? 0x9fb8c4,
            wood: options.woodColor ?? 0xc98d4f,
            door: options.doorColor ?? 0xd9a05b,
            accent: options.accentColor ?? 0xc95a2a
        };

        this.porchRatio = options.porchRatio ?? 0.44;
        this.porchDepth = options.porchDepth ?? 0.7;

        this.garden = options.garden ?? true;
        this.fence = options.fence ?? true;
        this.street = options.street ?? true;
        this.chimney = options.chimney ?? false;
        this.smokeEnabled = options.smoke ?? true;

        // >>> INTERACCIÓN
        this.doorAction = options.doorAction ?? null;
        this.windowAction = options.windowAction ?? null;
        this.interactionRadius = options.interactionRadius ?? 2.6;
        this.interactionKey = options.interactionKey ?? "E";

        // Estado de interacción (legible desde tu UI)
        this.nearDoor = false;
        this.nearWindow = false;
        this.doorOpen = false;
        this.windowLightOn = false;
    }

    // --------------------------------------------------
    // TEXTURAS PROCEDURALES
    // --------------------------------------------------
    _stucco(THREE, hex) {
        const s = 256, c = document.createElement("canvas");
        c.width = c.height = s;
        const ctx = c.getContext("2d");
        ctx.fillStyle = hex; ctx.fillRect(0, 0, s, s);
        for (let i = 0; i < 5000; i++) {
            const v = Math.floor(Math.random() * 30 - 15);
            ctx.fillStyle = `rgba(${130 + v},${130 + v},${128 + v},${0.06 + Math.random() * 0.1})`;
            ctx.fillRect(Math.random() * s, Math.random() * s, 1, 1);
        }
        const t = new THREE.CanvasTexture(c);
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(2, 2);
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
    }

    _slats(THREE, hex, vertical = true) {
        const s = 128, c = document.createElement("canvas");
        c.width = c.height = s;
        const ctx = c.getContext("2d");
        ctx.fillStyle = hex; ctx.fillRect(0, 0, s, s);
        const n = 10, sw = s / n;
        for (let i = 0; i < n; i++) {
            const shade = Math.floor(Math.random() * 26 - 13);
            const r = parseInt(hex.slice(1, 3), 16) + shade;
            const g = parseInt(hex.slice(3, 5), 16) + shade;
            const b = parseInt(hex.slice(5, 7), 16) + shade;
            if (vertical) {
                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(i * sw + 1, 0, sw - 2, s);
                ctx.strokeStyle = "rgba(0,0,0,0.55)"; ctx.lineWidth = 1.5;
                ctx.strokeRect(i * sw + 1, 0, sw - 2, s);
            } else {
                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(0, i * sw + 1, s, sw - 2);
                ctx.strokeStyle = "rgba(0,0,0,0.55)"; ctx.lineWidth = 1.5;
                ctx.strokeRect(0, i * sw + 1, s, sw - 2);
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

        // Pared cálida
        const g = ctx.createLinearGradient(0, 0, 0, s);
        g.addColorStop(0, "#8a6a48"); g.addColorStop(1, "#5e4630");
        ctx.fillStyle = g; ctx.fillRect(0, 0, s, s);

        // Suelo
        ctx.fillStyle = "#3e2e1e"; ctx.fillRect(0, s * 0.78, s, s * 0.22);

        // Cortinas laterales
        ctx.fillStyle = "#e8e2d4";
        ctx.fillRect(0, 0, s * 0.22, s * 0.8);
        ctx.fillRect(s * 0.78, 0, s * 0.22, s * 0.8);
        ctx.strokeStyle = "rgba(120,110,90,0.5)"; ctx.lineWidth = 3;
        for (let i = 0; i < 4; i++) {
            ctx.beginPath(); ctx.moveTo(s * 0.05 + i * s * 0.045, 0);
            ctx.lineTo(s * 0.05 + i * s * 0.045, s * 0.8); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(s * 0.82 + i * s * 0.045, 0);
            ctx.lineTo(s * 0.82 + i * s * 0.045, s * 0.8); ctx.stroke();
        }

        // Sofá
        ctx.fillStyle = "#4a6a52";
        ctx.fillRect(s * 0.3, s * 0.6, s * 0.4, s * 0.18);
        ctx.fillRect(s * 0.28, s * 0.5, s * 0.44, s * 0.12);

        // Planta
        ctx.fillStyle = "#2e4a2a";
        ctx.beginPath(); ctx.arc(s * 0.68, s * 0.45, s * 0.06, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#7a4a2a";
        ctx.fillRect(s * 0.655, s * 0.5, s * 0.05, s * 0.08);

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
        t.repeat.set(6, 6);
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
    }

    _indicator(THREE, key) {
        const s = 96, c = document.createElement("canvas");
        c.width = c.height = s;
        const ctx = c.getContext("2d");
        ctx.fillStyle = "rgba(10,10,14,0.85)";
        ctx.beginPath();
        ctx.roundRect(8, 8, s - 16, s - 16, 18);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.9)"; ctx.lineWidth = 4;
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 46px sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(key, s / 2, s / 2 + 3);
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
    }

    _smokeTexture(THREE) {
        const c = document.createElement("canvas");
        c.width = c.height = 64;
        const ctx = c.getContext("2d");
        const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        g.addColorStop(0, "rgba(235,235,235,0.9)");
        g.addColorStop(1, "rgba(180,180,180,0)");
        ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(c);
    }

    _createSmoke(THREE, parent, origin) {
        const tex = this._smokeTexture(THREE);
        const group = new THREE.Group();
        group.position.copy(origin);
        parent.add(group);
        const puffs = [];
        for (let i = 0; i < 12; i++) {
            const sp = new THREE.Sprite(new THREE.SpriteMaterial({
                map: tex, transparent: true, depthWrite: false, opacity: 0
            }));
            group.add(sp);
            puffs.push({
                sprite: sp, t: i / 12,
                speed: 0.2 + Math.random() * 0.12,
                sway: 0.12 + Math.random() * 0.2,
                phase: Math.random() * Math.PI * 2,
                grow: 0.4 + Math.random() * 0.4
            });
        }
        this._smoke = { group, puffs, tex };
        const clock = new THREE.Clock();
        const tick = () => {
            this._smokeRAF = requestAnimationFrame(tick);
            const dt = Math.min(clock.getDelta(), 0.1);
            if (!this.smokeEnabled) {
                for (const p of puffs) p.sprite.material.opacity = 0;
                return;
            }
            for (const p of puffs) {
                p.t += dt * p.speed;
                if (p.t >= 1) { p.t -= 1; p.phase = Math.random() * Math.PI * 2; }
                p.sprite.position.set(
                    Math.sin(p.phase + p.t * 6) * p.sway * p.t,
                    p.t * 2.4,
                    Math.cos(p.phase + p.t * 4) * p.sway * p.t * 0.6
                );
                const sc = 0.22 + p.t * p.grow;
                p.sprite.scale.set(sc, sc, 1);
                p.sprite.material.opacity = Math.sin(p.t * Math.PI) * 0.3;
            }
        };
        tick();
    }

    setSmoke(on) { this.smokeEnabled = on; }

    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------
    render(engine) {
        if (this.rendered) return;

        const THREE = engine.THREE;
        const group = new THREE.Group();

        // =============== DIMENSIONES ===============
        const w = this.width, d = this.depth, wallH = this.height;
        const found = 0.25;
        const Y0 = found;
        const zF = d / 2;                    // plano de fachada
        const porchD = this.porchDepth;
        const zB = zF - porchD;              // fondo del porche

        const porchW = w * this.porchRatio;
        const leftW = w - porchW;
        const porchX0 = -w / 2 + leftW;      // inicio del porche en X
        const porchCX = porchX0 + porchW / 2;

        const hex = n => "#" + n.toString(16).padStart(6, "0");

        // =============== MATERIALES ===============
        const mat = {
            wall: new THREE.MeshStandardMaterial({
                map: this._stucco(THREE, hex(this.colors.walls)),
                color: this.colors.walls, roughness: 0.9
            }),
            trim: new THREE.MeshStandardMaterial({
                color: this.colors.trim, roughness: 0.4, metalness: 0.4
            }),
            roof: new THREE.MeshStandardMaterial({
                color: this.colors.roof, roughness: 0.6, metalness: 0.2
            }),
            slats: new THREE.MeshStandardMaterial({
                map: this._slats(THREE, hex(this.colors.wood), true),
                color: this.colors.wood, roughness: 0.75
            }),
            door: new THREE.MeshStandardMaterial({
                map: this._slats(THREE, hex(this.colors.door), false),
                color: this.colors.door, roughness: 0.6
            }),
            glass: new THREE.MeshStandardMaterial({
                color: this.colors.window, roughness: 0.08, metalness: 0.6,
                transparent: true, opacity: 0.35
            }),
            interior: new THREE.MeshStandardMaterial({
                map: this._interior(THREE), roughness: 0.9,
                emissive: 0xffb060, emissiveIntensity: 0.15
            }),
            grass: new THREE.MeshStandardMaterial({
                map: this._grass(THREE), roughness: 1
            }),
            stone: new THREE.MeshStandardMaterial({ color: 0xcfc9bd, roughness: 0.95 }),
            asphalt: new THREE.MeshStandardMaterial({ color: 0x35353a, roughness: 1 }),
            accent: new THREE.MeshStandardMaterial({
                color: this.colors.accent, roughness: 0.6
            }),
            leaf: new THREE.MeshStandardMaterial({ color: 0x3f6d2e, roughness: 1 }),
            lamp: new THREE.MeshStandardMaterial({
                color: 0xfff2d0, emissive: 0xffc870, emissiveIntensity: 1.1
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
        addBox(w + 0.3, found, d + 0.3, mat.stone, 0, found / 2, 0);

        // =============== VOLUMEN SELLADO (no se puede entrar) ===============
        // Cuerpo principal (llega hasta el fondo del porche)
        addBox(w, wallH, d - porchD, mat.wall, 0, Y0 + wallH / 2, -porchD / 2);

        // Bloque frontal izquierdo (cierra el porche por la izquierda)
        addBox(leftW, wallH, porchD, mat.wall,
            -w / 2 + leftW / 2, Y0 + wallH / 2, zF - porchD / 2);

        // Muro derecho del porche
        addBox(0.18, wallH, porchD, mat.wall,
            w / 2 - 0.09, Y0 + wallH / 2, zF - porchD / 2);

        // Techo del porche
        addBox(porchW, 0.18, porchD, mat.wall,
            porchCX, Y0 + wallH - 0.09, zF - porchD / 2);

        // Losa de techo plana (fascia oscura)
        addBox(w + 0.5, 0.2, d + 0.5, mat.roof, 0, Y0 + wallH + 0.1, 0);

        // =============== VENTANA FRONTAL (marco que sobresale) ===============
        const winX = -w / 2 + leftW * 0.52;
        const winW = leftW * 0.62;
        const winH = wallH * 0.46;
        const winY = Y0 + wallH * 0.44;
        const bandH = wallH * 0.16;   // banda de lama sobre la ventana

        // Marco oscuro perimetral (región ventana + banda)
        const regH = winH + bandH + 0.36;
        const regY = winY + bandH / 2 + 0.02;
        const fD = 0.14;
        addBox(winW + 0.5, 0.16, fD, mat.trim, winX, regY + regH / 2 - 0.08, zF + 0.06);
        addBox(winW + 0.5, 0.16, fD, mat.trim, winX, regY - regH / 2 + 0.08, zF + 0.06);
        addBox(0.16, regH, fD, mat.trim, winX - winW / 2 - 0.17, regY, zF + 0.06);
        addBox(0.16, regH, fD, mat.trim, winX + winW / 2 + 0.17, regY, zF + 0.06);

        // Banda de lama vertical sobre la ventana
        addBox(winW + 0.18, bandH, 0.05, mat.slats,
            winX, winY + winH / 2 + 0.1 + bandH / 2, zF + 0.03);

        // Interior (panel sólido: la casa sigue sellada)
        addBox(winW, winH, 0.02, mat.interior, winX, winY, zF + 0.02);

        // Mainelles
        addBox(0.06, winH, 0.05, mat.trim, winX - winW / 6, winY, zF + 0.06);
        addBox(0.06, winH, 0.05, mat.trim, winX + winW / 6, winY, zF + 0.06);

        // Vidrio
        addBox(winW, winH, 0.02, mat.glass, winX, winY, zF + 0.09);

        // Alféizar
        addBox(winW + 0.5, 0.08, 0.22, mat.trim, winX, winY - winH / 2 - 0.1, zF + 0.08);

        // =============== PORCHE: LAMA + PUERTA ===============
        // Revestimiento de lama en el fondo del porche
        addBox(porchW - 0.1, wallH - 0.25, 0.05, mat.slats,
            porchCX, Y0 + (wallH - 0.25) / 2, zB + 0.03);

        const doorW = Math.min(1.15, porchW * 0.34);
        const doorH = wallH * 0.66;
        const doorX = porchX0 + porchW * 0.42;
        const doorZ = zB + 0.09;

        // Marco de puerta
        addBox(doorW + 0.22, 0.1, 0.1, mat.trim, doorX, Y0 + doorH + 0.05, doorZ);
        addBox(0.1, doorH + 0.1, 0.1, mat.trim, doorX - doorW / 2 - 0.05, Y0 + doorH / 2, doorZ);
        addBox(0.1, doorH + 0.1, 0.1, mat.trim, doorX + doorW / 2 + 0.05, Y0 + doorH / 2, doorZ);

        // PIVOTE de la puerta (bisagra en el lado izquierdo)
        const pivot = new THREE.Group();
        pivot.position.set(doorX - doorW / 2, 0, doorZ);
        group.add(pivot);
        this._doorPivot = pivot;

        const doorSlab = addBox(doorW, doorH, 0.07, mat.door,
            doorW / 2, Y0 + doorH / 2, 0, pivot);

        // Inserciones de vidrio en la puerta (columna vertical)
        for (let i = 0; i < 3; i++) {
            addBox(doorW * 0.34, doorH * 0.12, 0.02, mat.glass,
                doorW * 0.42, Y0 + doorH * (0.78 - i * 0.17), 0.045, pivot);
        }

        // Manija
        addBox(0.03, doorH * 0.28, 0.05, mat.trim,
            doorW * 0.86, Y0 + doorH * 0.5, 0.06, pivot);

        // Ventana estrecha junto a la puerta
        const nwX = porchX0 + porchW * 0.78;
        const nwW = porchW * 0.16, nwH = doorH * 0.8;
        addBox(nwW + 0.16, nwH + 0.16, 0.08, mat.trim, nwX, Y0 + doorH * 0.55, zB + 0.06);
        addBox(nwW, nwH, 0.02, mat.interior, nwX, Y0 + doorH * 0.55, zB + 0.08);
        addBox(nwW, nwH, 0.02, mat.glass, nwX, Y0 + doorH * 0.55, zB + 0.12);

        // Luz del porche
        addBox(0.1, 0.22, 0.08, mat.lamp, doorX, Y0 + doorH + 0.35, zB + 0.12);
        const porchLight = new THREE.PointLight(0xffc870, 0.7, 5);
        porchLight.position.set(doorX, Y0 + doorH + 0.3, zB + 0.4);
        group.add(porchLight);

        // Maceta con topiario en el porche
        const potX = porchX0 + porchW * 0.94;
        addMesh(new THREE.CylinderGeometry(0.22, 0.18, 0.35, 12), mat.accent,
            potX, Y0 + 0.17, zB + 0.35);
        addMesh(new THREE.SphereGeometry(0.3, 12, 12), mat.leaf,
            potX, Y0 + 0.62, zB + 0.35);

        // Escalones
        addBox(porchW + 0.4, 0.14, 0.45, mat.stone, porchCX, 0.18, zF + 0.2);
        addBox(porchW + 0.7, 0.12, 0.45, mat.stone, porchCX, 0.07, zF + 0.6);

        // =============== CHIMENEA OPCIONAL ===============
        if (this.chimney) {
            const chX = -w * 0.3, chZ = -d * 0.25;
            const chH = Y0 + wallH + 1.1;
            addMesh(new THREE.CylinderGeometry(0.16, 0.16, chH, 14), mat.trim,
                chX, chH / 2, chZ);
            addMesh(new THREE.ConeGeometry(0.26, 0.22, 14), mat.trim,
                chX, chH + 0.11, chZ);
            if (this.smokeEnabled) {
                this._createSmoke(THREE, group, new THREE.Vector3(chX, chH + 0.3, chZ));
            }
        }

        // =============== JARDÍN / VALLA / CALLE ===============
        if (this.garden) {
            addBox(w + 7, 0.06, d + 8, mat.grass, 0, 0.03, 1.5);

            const bushes = [
                [-w / 2 - 1.2, zF + 1.2], [-w / 2 - 0.4, zF + 2.2],
                [-w * 0.18, zF + 1.6], [w / 2 + 1.2, zF + 1.4],
                [w / 2 + 0.5, zF + 2.4], [-w * 0.35, zF + 2.6]
            ];
            for (const [bx, bz] of bushes) {
                const b = addMesh(new THREE.SphereGeometry(0.45, 10, 10), mat.leaf,
                    bx, 0.3, bz);
                b.scale.set(1.2, 0.7, 1.2);
                if (Math.random() > 0.4) {
                    addMesh(new THREE.SphereGeometry(0.07, 6, 6), mat.accent,
                        bx + 0.2, 0.5, bz + 0.15);
                }
            }
        }

        // Camino de entrada
        addBox(porchW + 0.7, 0.08, 2.4, mat.stone, porchCX, 0.05, zF + 2.0);

        if (this.street) {
            addBox(w + 10, 0.1, 1.5, mat.stone, 0, 0.06, zF + 3.9);   // acera
            addBox(w + 10, 0.09, 2.6, mat.asphalt, 0, 0.05, zF + 5.9); // calzada
        }

        if (this.fence) {
            for (const side of [-1, 1]) {
                const fx = side * (w / 2 + 3.0);
                const runLen = d + 5;
                const posts = Math.floor(runLen / 1.4);
                for (let i = 0; i <= posts; i++) {
                    const z = -d / 2 - 1 + (runLen / posts) * i;
                    addBox(0.1, 1.15, 0.1, mat.trim, fx, 0.57, z);
                }
                const planks = Math.floor(runLen / 0.18);
                for (let i = 0; i < planks; i++) {
                    const z = -d / 2 - 1 + (runLen / planks) * (i + 0.5);
                    addBox(0.04, 0.95, 0.13, mat.slats, fx, 0.55, z);
                }
            }
        }

        // =============== INDICADORES DE INTERACCIÓN ===============
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
        this._doorIndicator = makeIndicator(doorX, Y0 + doorH + 0.75, doorZ + 0.3);
        this._windowIndicator = makeIndicator(winX, winY + winH / 2 + 0.75, zF + 0.3);

        // =============== ANCLAS DE INTERACCIÓN (espacio local) ===============
        this._anchors = {
            door: new THREE.Vector3(doorX, Y0 + doorH / 2, doorZ + 0.2),
            window: new THREE.Vector3(winX, winY, zF + 0.2)
        };

        // =============== POSICIÓN FINAL ===============
        group.position.set(this.x + w / 2, 0, this.y + d / 2);
        group.rotation.y = this.rotation ?? 0;
        group.name = `ModernHouse_${this.x}_${this.y}`;
        group.userData.worldObject = this;

        engine.renderer.scene.add(group);
        group.updateMatrixWorld(true);

        this.AsingProps(group, engine, true);
    }

    // --------------------------------------------------
    // INTERACCIÓN
    // --------------------------------------------------

    /** Intenta localizar al jugador dentro del engine (varias APIs comunes). */
    _getPlayerPosition(engine) {
        const p = engine.getPlayerWorldPosition?.();
        if (p) return p;
        const c = [
            engine.player?.position, engine.character?.position,
            engine.playerController?.position, engine.getPlayer?.()?.position
        ];
        return c.find(q => q && typeof q.x === "number") ?? null;
    }

    _worldAnchor(key) {
        return this.visual.localToWorld(this._anchors[key].clone());
    }

    /** Distancias horizontales → actualiza nearDoor / nearWindow. */
    checkProximity(worldPos) {
        if (!this.visual || !this._anchors) return;

        const dist = key => {
            const a = this._worldAnchor(key);
            return Math.hypot(worldPos.x - a.x, worldPos.z - a.z);
        };

        const dDoor = dist("door");
        const dWin = dist("window");

        this.nearDoor = dDoor < this.interactionRadius;
        this.nearWindow = !this.nearDoor && dWin < this.interactionRadius;
        this.isNear = this.nearDoor || this.nearWindow;
        this.interactionDistance = this.nearDoor ? dDoor : dWin;
    }

    /**
     * Llámalo cada frame (si tu engine no llama update() de los WorldObject).
     * Anima la puerta y los indicadores.
     */
    update(engine, delta = 0.016) {
        if (!this.visual) return;

        // Animación de apertura de puerta
        if (this._doorPivot) {
            const target = this.doorOpen ? -1.85 : 0;
            this._doorPivot.rotation.y +=
                (target - this._doorPivot.rotation.y) * Math.min(1, delta * 8);
        }

        // Proximidad automática si el engine expone al jugador
        const p = engine ? this._getPlayerPosition(engine) : null;
        if (p) this.checkProximity(p);

        // Indicadores pulsantes
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

    /** Ejecuta la acción disponible (llámalo al pulsar la tecla de interacción). */
    async interact() {
        if (this.nearDoor) {
            this.doorOpen = !this.doorOpen;
            await this.doorAction?.(this, { type: "door", open: this.doorOpen });
            return "door";
        }
        if (this.nearWindow) {
            this.windowLightOn = !this.windowLightOn;
            if (this._interiorMat) {
                this._interiorMat.emissiveIntensity = this.windowLightOn ? 0.7 : 0.15;
            }
            await this.windowAction?.(this, { type: "window", lightOn: this.windowLightOn });
            return "window";
        }
        return null;
    }
    /** Para tu UI: "door" | "window" | null */
    getInteractionHint() {
        if (this.nearDoor) return "door";
        if (this.nearWindow) return "window";
        return null;
    }

    // --------------------------------------------------
    // DESTROY
    // --------------------------------------------------
    destroy() {
        if (this._smokeRAF) cancelAnimationFrame(this._smokeRAF);
        if (this._smoke) { this._smoke.tex.dispose(); this._smoke = null; }

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