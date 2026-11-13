import { WorldObject } from "../WorldObjectModels.js";

/* =====================================================================
   GUÍA RÁPIDA DE AJUSTE MANUAL
   ---------------------------------------------------------------------
   • CFG (inicio de render()): todas las dimensiones globales centralizadas.
   • Ejes locales del grupo:  +Z = fachada frontal · +Y = arriba · +X = derecha.
     El origen del grupo queda en (this.x + w/2, 0, this.y + d/2).
   • Para MOVER una pieza: cambia (x, y, z) en su llamada addBox/addMesh.
   • Para ABRIR/CERRAR huecos: edita frontHoles / backHoles / leftHoles.
     La pared Y los tablones se recortan solos con esos datos.
   • Planos Z de referencia (fachada):
       wallFrontZ = cara de la pared   |   facadeZ = cara de los tablones
     Todo lo que deba verse debe estar ENTRE wallFrontZ y facadeZ (empotrado)
     o POR DELANTE de facadeZ (sobresaliente).
   • HUMO: se construye en _createSmoke() (llamada al final de render()).
     Desactivar: options { smoke: false }, this.smokeEnabled = false,
     house.setSmoke(false), o elimina/comenta la llamada.
   ===================================================================== */

export class House extends WorldObject {
    constructor(x, y, options = {}) {
        super(x, y, options.width ?? 6, options.depth ?? 5, options);

        this.name = options.name ?? "House";

        this.width = options.width ?? 6;
        this.depth = options.depth ?? 5;
        this.height = options.height ?? 4.5;

        this.colors = {
            walls: options.wallsColor ?? 0xd8c3a5,
            roof: options.roofColor ?? 0x713c32,
            door: options.doorColor ?? 0x593b2b,
            window: options.windowColor ?? 0x83b9cf
        };

        // >>> INTERRUPTOR DEL HUMO (también en runtime: house.setSmoke(false))
        this.smokeEnabled = options.smoke ?? true;
    }

    // --------------------------------------------------
    // TEXTURAS PROCEDURALES
    // --------------------------------------------------
    _createWoodTexture(THREE, baseColor = "#b77b42", darkColor = "#6b3e1f", scale = 1) {
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, size, size);

        const veinCount = Math.floor(40 * scale);
        for (let i = 0; i < veinCount; i++) {
            let cx = Math.random() * size;
            ctx.strokeStyle = `rgba(60, 30, 10, ${0.1 + Math.random() * 0.35})`;
            ctx.lineWidth = 1 + Math.random() * 2;
            ctx.beginPath();
            ctx.moveTo(cx, 0);
            for (let y = 0; y < size; y += 8) {
                cx += (Math.random() - 0.5) * 2;
                ctx.lineTo(cx, y);
            }
            ctx.stroke();
        }

        const knots = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < knots; i++) {
            const x = Math.random() * size, y = Math.random() * size;
            const r = 4 + Math.random() * 6;
            const g = ctx.createRadialGradient(x, y, 0, x, y, r);
            g.addColorStop(0, darkColor);
            g.addColorStop(1, "rgba(60,30,10,0)");
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(scale, scale);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
    }

    _createStoneTexture(THREE) {
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#888480";
        ctx.fillRect(0, 0, size, size);

        for (let i = 0; i < 40; i++) {
            const x = Math.random() * size, y = Math.random() * size;
            const r = 12 + Math.random() * 20;
            const points = 8 + Math.floor(Math.random() * 4);
            ctx.beginPath();
            for (let p = 0; p < points; p++) {
                const a = (p / points) * Math.PI * 2;
                const rr = r * (0.8 + Math.random() * 0.4);
                const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr;
                p === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            }
            ctx.closePath();
            const s = 90 + Math.floor(Math.random() * 50);
            ctx.fillStyle = `rgb(${s},${s - 5},${s - 10})`;
            ctx.fill();
            ctx.strokeStyle = "#4a4843"; ctx.lineWidth = 2; ctx.stroke();
        }

        for (let i = 0; i < 3000; i++) {
            ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.3})`;
            ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
    }

    _createRoofTexture(THREE) {
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#5a3a28";
        ctx.fillRect(0, 0, size, size);

        const th = 24, tw = 40;
        for (let row = 0; row < size / th; row++) {
            const off = (row % 2) * (tw / 2);
            for (let col = -1; col < size / tw + 1; col++) {
                const x = col * tw + off, y = row * th;
                const s = 70 + Math.floor(Math.random() * 40);
                ctx.fillStyle = `rgb(${s + 15},${s - 10},${s - 25})`;
                ctx.beginPath();
                ctx.arc(x + tw / 2, y + th, tw / 2, Math.PI, Math.PI * 2);
                ctx.lineTo(x + tw, y + th);
                ctx.lineTo(x, y + th);
                ctx.closePath(); ctx.fill();
                ctx.strokeStyle = "#2a1a10"; ctx.lineWidth = 1.5; ctx.stroke();
            }
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(3, 3);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
    }

    _createPlankTexture(THREE) {
        const size = 128;
        const canvas = document.createElement("canvas");
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#96602f";
        ctx.fillRect(0, 0, size, size);

        const n = 4, ph = size / n;
        for (let i = 0; i < n; i++) {
            const y = i * ph, s = Math.floor(Math.random() * 30);
            ctx.fillStyle = `rgb(${130 + s},${85 + s},${40 + s})`;
            ctx.fillRect(0, y, size, ph - 2);
            ctx.strokeStyle = "#3a1f0f"; ctx.lineWidth = 2;
            ctx.strokeRect(0, y, size, ph - 2);
            for (let v = 0; v < 8; v++) {
                ctx.strokeStyle = `rgba(50,25,10,${0.1 + Math.random() * 0.2})`;
                ctx.lineWidth = 0.5;
                const vx = Math.random() * size;
                ctx.beginPath(); ctx.moveTo(vx, y);
                ctx.lineTo(vx + (Math.random() - 0.5) * 4, y + ph); ctx.stroke();
            }
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
    }

    _createSmokeTexture(THREE) {
        const c = document.createElement("canvas");
        c.width = c.height = 64;
        const ctx = c.getContext("2d");
        const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        g.addColorStop(0, "rgba(235,235,235,0.9)");
        g.addColorStop(0.5, "rgba(205,205,205,0.45)");
        g.addColorStop(1, "rgba(180,180,180,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(c);
    }

    // --------------------------------------------------
    // PARED CON HUECOS REALES
    // --------------------------------------------------
    _createWallWithHoles(THREE, width, height, thickness, holes = []) {
        const shape = new THREE.Shape();
        shape.moveTo(-width / 2, 0);
        shape.lineTo(width / 2, 0);
        shape.lineTo(width / 2, height);
        shape.lineTo(-width / 2, height);
        shape.lineTo(-width / 2, 0);

        for (const h of holes) {
            const p = new THREE.Path();
            p.moveTo(h.x - h.w / 2, h.y - h.h / 2);
            p.lineTo(h.x + h.w / 2, h.y - h.h / 2);
            p.lineTo(h.x + h.w / 2, h.y + h.h / 2);
            p.lineTo(h.x - h.w / 2, h.y + h.h / 2);
            p.lineTo(h.x - h.w / 2, h.y - h.h / 2);
            shape.holes.push(p);
        }

        return new THREE.ExtrudeGeometry(shape, {
            depth: thickness,
            bevelEnabled: false
        });
    }

    // --------------------------------------------------
    // HUMO DE LA CHIMENEA  >>>  AQUÍ SE CONSTRUYE
    // --------------------------------------------------
    _createSmoke(THREE, parent, origin) {
        const tex = this._createSmokeTexture(THREE);
        const group = new THREE.Group();
        group.position.copy(origin);
        parent.add(group);

        const puffs = [];
        const COUNT = 12; // nº de bocanadas simultáneas

        for (let i = 0; i < COUNT; i++) {
            const mat = new THREE.SpriteMaterial({
                map: tex,
                transparent: true,
                depthWrite: false,
                opacity: 0
            });
            const sprite = new THREE.Sprite(mat);
            group.add(sprite);
            puffs.push({
                sprite,
                t: i / COUNT,                        // fase escalonada
                speed: 0.22 + Math.random() * 0.15,  // vidas por segundo
                sway: 0.15 + Math.random() * 0.25,
                phase: Math.random() * Math.PI * 2,
                grow: 0.5 + Math.random() * 0.5
            });
        }

        this._smoke = { group, puffs, tex };

        const clock = new THREE.Clock();
        const tick = () => {
            this._smokeRAF = requestAnimationFrame(tick);
            const dt = Math.min(clock.getDelta(), 0.1);

            if (!this.smokeEnabled) {                 // apagado: ocultar y parar
                for (const p of puffs) p.sprite.material.opacity = 0;
                return;
            }

            for (const p of puffs) {
                p.t += dt * p.speed;
                if (p.t >= 1) { p.t -= 1; p.phase = Math.random() * Math.PI * 2; }
                const t = p.t;
                p.sprite.position.set(
                    Math.sin(p.phase + t * 6) * p.sway * t,
                    t * 2.2,
                    Math.cos(p.phase + t * 4) * p.sway * t * 0.6
                );
                const s = 0.25 + t * p.grow;
                p.sprite.scale.set(s, s, 1);
                p.sprite.material.opacity = Math.sin(t * Math.PI) * 0.35;
            }
        };
        tick();
    }

    setSmoke(enabled) {
        this.smokeEnabled = enabled;
    }

    // --------------------------------------------------
    // RENDER PRINCIPAL
    // --------------------------------------------------
    render(engine) {
        if (this.rendered) return;

        const THREE = engine.THREE;
        const group = new THREE.Group();

        // =============== CFG: AJUSTES GLOBALES ===============
        const CFG = {
            foundationHeight: 0.25,   // alto del cimiento de piedra
            wallHeightRatio: 0.55,    // proporción de muro vs altura total
            wallThickness: 0.18,      // grosor de pared (profundidad de huecos)
            plankDepth: 0.03,         // grosor de la capa de tablones
            plankFill: 0.92,          // 1 = tablones pegados, <1 = separación
            roofOverhang: 0.45,       // vuelo del alero
            roofThickness: 0.12,
            frameProtrude: 0.05,      // cuánto sobresalen marcos de la fachada
            doorWidthRatio: 0.24,
            doorHeightRatio: 0.72,
            windowWidthRatio: 0.20,
            windowHeightRatio: 0.30,
            windowYRatio: 0.55        // altura de ventanas dentro del muro
        };

        // =============== DIMENSIONES DERIVADAS ===============
        const w = this.width;
        const d = this.depth;

        const foundationHeight = CFG.foundationHeight;
        const wallHeight = this.height * CFG.wallHeightRatio;
        const roofHeight = this.height - wallHeight - foundationHeight;

        const wallBase = foundationHeight;
        const wallTop = wallBase + wallHeight;

        const wallThickness = CFG.wallThickness;
        const plankDepth = CFG.plankDepth;

        const wallFrontZ = d / 2;                 // cara exterior de la pared
        const facadeZ = wallFrontZ + plankDepth + 0.1;  // cara exterior de tablones

        // =============== HUECOS (edita aquí puertas/ventanas) ===============
        const doorWidth = w * CFG.doorWidthRatio;
        const doorHeight = wallHeight * CFG.doorHeightRatio;
        const doorY = wallBase + doorHeight / 2;

        const windowWidth = w * CFG.windowWidthRatio;
        const windowHeight = wallHeight * CFG.windowHeightRatio;
        const windowY = wallBase + wallHeight * CFG.windowYRatio;

        const frontHoles = [
            { x: 0, y: doorY, w: doorWidth, h: doorHeight },
            { x: -w * 0.30, y: windowY, w: windowWidth, h: windowHeight },
            { x: w * 0.30, y: windowY, w: windowWidth, h: windowHeight }
        ];

        const backHoles = [
            { x: -w * 0.25, y: windowY, w: windowWidth * 0.7, h: windowHeight * 0.8 },
            { x: w * 0.25, y: windowY, w: windowWidth * 0.7, h: windowHeight * 0.8 }
        ];

        const leftHoles = [
            { x: 0, y: windowY, w: windowWidth * 0.9, h: windowHeight * 0.85 }
        ];

        // =============== TEXTURAS Y MATERIALES ===============
        const woodTex = this._createWoodTexture(THREE, "#b07840", "#5a2f14", 2);
        const woodTexLight = this._createWoodTexture(THREE, "#d49562", "#7a4520", 2);
        const woodTexDark = this._createWoodTexture(THREE, "#6b3a1f", "#2a1508", 1.5);
        const stoneTex = this._createStoneTexture(THREE);
        const roofTex = this._createRoofTexture(THREE);
        const plankTex = this._createPlankTexture(THREE);

        const materials = {
            wood: new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.85 }),
            woodLight: new THREE.MeshStandardMaterial({ map: woodTexLight, roughness: 0.8 }),
            woodDark: new THREE.MeshStandardMaterial({ map: woodTexDark, roughness: 0.9 }),
            plank: new THREE.MeshStandardMaterial({ map: plankTex, roughness: 0.85 }),
            door: new THREE.MeshStandardMaterial({ map: woodTexDark, color: 0x704020, roughness: 0.7 }),
            roof: new THREE.MeshStandardMaterial({ map: roofTex, roughness: 0.9 }),
            stone: new THREE.MeshStandardMaterial({ map: stoneTex, roughness: 1.0 }),
            glass: new THREE.MeshStandardMaterial({
                color: 0xa5d5e5, roughness: 0.05, metalness: 0.3,
                transparent: true, opacity: 0.7,
                emissive: 0x405060, emissiveIntensity: 0.25
            }),
            metal: new THREE.MeshStandardMaterial({ color: 0xd4a857, roughness: 0.3, metalness: 0.8 }),
            metalDark: new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.4, metalness: 0.7 }),
            grass: new THREE.MeshStandardMaterial({ color: 0x4a7030, roughness: 1.0 }),
            shutter: new THREE.MeshStandardMaterial({ map: woodTexDark, color: 0x4a3020, roughness: 0.8 }),
            soil: new THREE.MeshStandardMaterial({ color: 0x3a2815, roughness: 1.0 }),
            mat: new THREE.MeshStandardMaterial({ color: 0x8b6b3d, roughness: 1.0 })
        };

        // =============== HELPERS ===============
        const addMesh = (geo, mat, x, y, z, parent = group) => {
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(x, y, z);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            parent.add(mesh);
            return mesh;
        };

        const addBox = (bw, bh, bd, mat, x, y, z, parent = group) =>
            addMesh(new THREE.BoxGeometry(bw, bh, bd), mat, x, y, z, parent);

        // Recorta una columna de tablón alrededor de los huecos que cruza.
        // `cuts` = lista de [y0, y1] en world-Y que esa columna debe evitar.
        const cutSegments = (a, b, cuts) => {
            let segs = [[a, b]];
            for (const [c0, c1] of cuts) {
                const next = [];
                for (const [s0, s1] of segs) {
                    if (c1 <= s0 || c0 >= s1) { next.push([s0, s1]); continue; }
                    if (c0 > s0) next.push([s0, c0]);
                    if (c1 < s1) next.push([c1, s1]);
                }
                segs = next;
            }
            return segs.filter(s => s[1] - s[0] > 0.03);
        };

        const cutsForColumn = (cx, cw, holes) =>
            holes
                .filter(h => cx + cw / 2 > h.x - h.w / 2 && cx - cw / 2 < h.x + h.w / 2)
                .map(h => [h.y - h.h / 2, h.y + h.h / 2]);

        // =============== CIMIENTO ===============
        addBox(w + 0.3, foundationHeight, d + 0.3, materials.stone, 0, foundationHeight / 2, 0);
        addBox(w + 0.35, 0.06, d + 0.35, materials.woodDark, 0, foundationHeight + 0.03, 0);

        // =============== PAREDES CON HUECOS ===============
        addMesh(
            this._createWallWithHoles(THREE, w, wallHeight, wallThickness, frontHoles),
            materials.wood, 0, wallBase, wallFrontZ - wallThickness
        );

        addMesh(
            this._createWallWithHoles(THREE, w, wallHeight, wallThickness, backHoles),
            materials.wood, 0, wallBase, -d / 2
        );

        // Lateral izquierda (con ventana). Rotada +90° en Y.
        const leftWall = addMesh(
            this._createWallWithHoles(THREE, d, wallHeight, wallThickness, leftHoles),
            materials.wood, -w / 2, wallBase, 0
        );
        leftWall.rotation.y = Math.PI / 2;

        // Lateral derecha (ciega). CORREGIDO: antes estaba desplazada d/2 en Z.
        const rightWall = addMesh(
            this._createWallWithHoles(THREE, d, wallHeight, wallThickness, []),
            materials.wood, w / 2 - wallThickness, wallBase, 0
        );
        rightWall.rotation.y = Math.PI / 2;

        // =============== TABLONES RECORTADOS (ya no tapan huecos) ===============
        const plankCount = Math.max(6, Math.floor(w / 0.18));
        const plankWidth = w / plankCount;

        for (let i = 0; i < plankCount; i++) {
            const px = -w / 2 + plankWidth * (i + 0.5);

            // Frontal
            for (const [a, b] of cutSegments(wallBase, wallTop, cutsForColumn(px, plankWidth, frontHoles))) {
                addBox(plankWidth * CFG.plankFill, b - a, plankDepth, materials.plank,
                    px, (a + b) / 2, wallFrontZ + plankDepth / 2);
            }
            // Trasera
            for (const [a, b] of cutSegments(wallBase, wallTop, cutsForColumn(px, plankWidth, backHoles))) {
                addBox(plankWidth * CFG.plankFill, b - a, plankDepth, materials.plank,
                    px, (a + b) / 2, -wallFrontZ - plankDepth / 2);
            }
        }

        const sidePlankCount = Math.max(4, Math.floor(d / 0.22));
        const sidePlankWidth = d / sidePlankCount;

        for (let i = 0; i < sidePlankCount; i++) {
            const pz = -d / 2 + sidePlankWidth * (i + 0.5);

            // Izquierda (recortada por su ventana)
            for (const [a, b] of cutSegments(wallBase, wallTop, cutsForColumn(pz, sidePlankWidth, leftHoles))) {
                addBox(plankDepth, b - a, sidePlankWidth * CFG.plankFill, materials.plank,
                    -w / 2 - plankDepth / 2, (a + b) / 2, pz);
            }
            // Derecha (sin huecos)
            addBox(plankDepth, wallHeight * 0.98, sidePlankWidth * CFG.plankFill, materials.plank,
                w / 2 + plankDepth / 2, wallBase + wallHeight / 2, pz);
        }

        // =============== VIGAS Y CORNISA ===============
        const beamSize = 0.16;
        for (const x of [-w / 2, w / 2]) {
            for (const z of [-d / 2, d / 2]) {
                addBox(beamSize, wallHeight + 0.1, beamSize, materials.woodDark,
                    x, wallBase + wallHeight / 2, z);
            }
        }
        addBox(w + 0.1, 0.14, 0.14, materials.woodDark, 0, wallTop - 0.07, d / 2 + 0.02);
        addBox(w + 0.1, 0.14, 0.14, materials.woodDark, 0, wallTop - 0.07, -d / 2 - 0.02);
        addBox(0.14, 0.14, d + 0.1, materials.woodDark, -w / 2 - 0.02, wallTop - 0.07, 0);
        addBox(0.14, 0.14, d + 0.1, materials.woodDark, w / 2 + 0.02, wallTop - 0.07, 0);

        // =============== PUERTA (ahora visible y empotrada) ===============
        // Plano de la puerta: ligeramente rehundida respecto a la fachada.
        const doorSlabZ = wallFrontZ - wallThickness / 2;

        addBox(doorWidth - 0.02, doorHeight - 0.02, 0.09, materials.door,
            0, wallBase + doorHeight / 2, doorSlabZ);

        // Tablones verticales de la puerta
        const doorPlankCount = 5;
        const doorPlankWidth = (doorWidth * 0.9) / doorPlankCount;
        for (let i = 0; i < doorPlankCount; i++) {
            addBox(doorPlankWidth * 0.95, doorHeight * 0.92, 0.025, materials.woodDark,
                -doorWidth * 0.45 + doorPlankWidth * (i + 0.5),
                wallBase + doorHeight / 2,
                doorSlabZ + 0.055);
        }

        // Crucetas en X
        const braceLen = Math.hypot(doorWidth * 0.85, doorHeight * 0.45);
        const braceAng = Math.atan2(doorHeight * 0.45, doorWidth * 0.85);
        for (const flip of [1, -1]) {
            const brace = addBox(braceLen, 0.06, 0.02, materials.woodLight,
                0, wallBase + doorHeight * 0.5, doorSlabZ + 0.075);
            brace.rotation.z = flip * braceAng;
        }

        // Marco que SOBRESALE de la fachada (hace legible el hueco)
        const frameDepth = wallThickness + 0.12 + CFG.frameProtrude;
        const frameZ = wallFrontZ - wallThickness / 2 + CFG.frameProtrude;

        addBox(doorWidth + 0.28, 0.14, frameDepth, materials.woodDark,
            0, wallBase + doorHeight + 0.07, frameZ);
        for (const x of [-doorWidth / 2 - 0.07, doorWidth / 2 + 0.07]) {
            addBox(0.14, doorHeight + 0.14, frameDepth, materials.woodDark,
                x, wallBase + doorHeight / 2, frameZ);
        }

        // Pomo y cerradura: por DELANTE de facadeZ para que se vean siempre
        addMesh(new THREE.SphereGeometry(0.05, 16, 16), materials.metal,
            doorWidth * 0.30, wallBase + doorHeight * 0.48, facadeZ + 0.04);
        addBox(0.08, 0.16, 0.05, materials.metalDark,
            doorWidth * 0.30, wallBase + doorHeight * 0.48, facadeZ + 0.01);

        // =============== VENTANAS FRONTALES ===============
        for (const x of [-w * 0.30, w * 0.30]) {
            // Marco perimetral que sobresale (4 piezas, no tapa el cristal)
            const fw = windowWidth + 0.24, fh = windowHeight + 0.24;
            addBox(fw, 0.12, frameDepth, materials.woodDark, x, windowY + windowHeight / 2 + 0.06, frameZ);
            addBox(fw, 0.12, frameDepth, materials.woodDark, x, windowY - windowHeight / 2 - 0.06, frameZ);
            addBox(0.12, fh, frameDepth, materials.woodDark, x - windowWidth / 2 - 0.06, windowY, frameZ);
            addBox(0.12, fh, frameDepth, materials.woodDark, x + windowWidth / 2 + 0.06, windowY, frameZ);

            // Cristal rehundido dentro del hueco (sus bordes quedan embebidos
            // en el muro, así no hay rendijas)
            addBox(windowWidth + 0.06, windowHeight + 0.06, 0.03, materials.glass,
                x, windowY, wallFrontZ - 0.05);

            // Cruceta delante del cristal, aún rehundida
            addBox(0.045, windowHeight * 0.95, 0.05, materials.woodDark, x, windowY, wallFrontZ - 0.02);
            addBox(windowWidth * 0.95, 0.045, 0.05, materials.woodDark, x, windowY, wallFrontZ - 0.02);

            // Alféizar de piedra sobresaliente
            addBox(windowWidth + 0.34, 0.09, 0.22, materials.stone,
                x, windowY - windowHeight / 2 - 0.05, facadeZ + 0.04);

            // Postigos con tablillas
            const shutterWidth = windowWidth * 0.52;
            const shutterHeight = windowHeight + 0.05;
            for (const side of [-1, 1]) {
                const sg = new THREE.Group();
                sg.position.set(
                    x + side * (windowWidth / 2 + shutterWidth / 2 + 0.04),
                    windowY,
                    facadeZ + 0.04
                );
                sg.rotation.y = side * 0.3;

                const body = new THREE.Mesh(
                    new THREE.BoxGeometry(shutterWidth, shutterHeight, 0.06),
                    materials.shutter
                );
                body.castShadow = body.receiveShadow = true;
                sg.add(body);

                const louvers = 6, lh = shutterHeight / louvers;
                for (let i = 0; i < louvers; i++) {
                    const lv = new THREE.Mesh(
                        new THREE.BoxGeometry(shutterWidth * 0.85, lh * 0.6, 0.03),
                        materials.woodLight
                    );
                    lv.position.set(0, -shutterHeight / 2 + lh * (i + 0.5), 0.04);
                    lv.rotation.x = 0.3;
                    lv.castShadow = true;
                    sg.add(lv);
                }

                for (const yy of [-shutterHeight * 0.35, shutterHeight * 0.35]) {
                    const hinge = new THREE.Mesh(
                        new THREE.BoxGeometry(0.04, 0.08, 0.04), materials.metalDark
                    );
                    hinge.position.set(-side * shutterWidth / 2, yy, 0);
                    sg.add(hinge);
                }

                group.add(sg);
            }

            // Jardinera con flores
            const pg = new THREE.Group();
            pg.position.set(x, windowY - windowHeight / 2 - 0.20, facadeZ + 0.14);

            const box = new THREE.Mesh(
                new THREE.BoxGeometry(windowWidth + 0.1, 0.18, 0.22), materials.woodDark
            );
            box.castShadow = box.receiveShadow = true;
            pg.add(box);

            const soil = new THREE.Mesh(
                new THREE.BoxGeometry(windowWidth + 0.05, 0.05, 0.2), materials.soil
            );
            soil.position.y = 0.08;
            pg.add(soil);

            const flowerColors = [0xd94060, 0xe6a840, 0xd060d0, 0xf0f060, 0xffffff];
            for (let i = 0; i < 5; i++) {
                const fx = (Math.random() - 0.5) * windowWidth * 0.7;
                const stem = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.01, 0.01, 0.15, 6), materials.grass
                );
                stem.position.set(fx, 0.15, (Math.random() - 0.5) * 0.15);
                pg.add(stem);

                const fc = flowerColors[i % flowerColors.length];
                const flower = new THREE.Mesh(
                    new THREE.SphereGeometry(0.04, 8, 8),
                    new THREE.MeshStandardMaterial({
                        color: fc, emissive: fc, emissiveIntensity: 0.15, roughness: 0.7
                    })
                );
                flower.position.set(fx, 0.24, stem.position.z);
                flower.castShadow = true;
                pg.add(flower);
            }
            group.add(pg);
        }

        // =============== VENTANAS TRASERAS Y LATERAL ===============
        for (const x of [-w * 0.25, w * 0.25]) {
            const bw = windowWidth * 0.7, bh = windowHeight * 0.8;
            addBox(bw + 0.2, 0.1, 0.2, materials.woodDark, x, windowY + bh / 2 + 0.05, -wallFrontZ - 0.02);
            addBox(bw + 0.2, 0.1, 0.2, materials.woodDark, x, windowY - bh / 2 - 0.05, -wallFrontZ - 0.02);
            addBox(0.1, bh + 0.2, 0.2, materials.woodDark, x - bw / 2 - 0.05, windowY, -wallFrontZ - 0.02);
            addBox(0.1, bh + 0.2, 0.2, materials.woodDark, x + bw / 2 + 0.05, windowY, -wallFrontZ - 0.02);
            addBox(bw + 0.05, bh + 0.05, 0.03, materials.glass, x, windowY, -wallFrontZ + 0.05);
        }

        // Ventana lateral izquierda (marco perimetral + cristal)
        const lw = windowWidth * 0.9, lh2 = windowHeight * 0.85;
        addBox(0.2, 0.1, lw + 0.2, materials.woodDark, -w / 2 - 0.02, windowY + lh2 / 2 + 0.05, 0);
        addBox(0.2, 0.1, lw + 0.2, materials.woodDark, -w / 2 - 0.02, windowY - lh2 / 2 - 0.05, 0);
        addBox(0.2, lh2 + 0.2, 0.1, materials.woodDark, -w / 2 - 0.02, windowY, -lw / 2 - 0.05);
        addBox(0.2, lh2 + 0.2, 0.1, materials.woodDark, -w / 2 - 0.02, windowY, lw / 2 + 0.05);
        addBox(0.03, lh2 + 0.05, lw + 0.05, materials.glass, -w / 2 + 0.05, windowY, 0);

        // =============== TECHO ===============
        const halfWidth = w / 2 + CFG.roofOverhang;
        const slopeLength = Math.hypot(halfWidth, roofHeight);
        const roofAngle = Math.atan2(roofHeight, halfWidth);
        const roofCenterY = wallTop + roofHeight / 2;

        const leftRoof = addBox(slopeLength, CFG.roofThickness, d + CFG.roofOverhang * 2,
            materials.roof, -halfWidth / 2, roofCenterY, 0);
        leftRoof.rotation.z = roofAngle;

        const rightRoof = addBox(slopeLength, CFG.roofThickness, d + CFG.roofOverhang * 2,
            materials.roof, halfWidth / 2, roofCenterY, 0);
        rightRoof.rotation.z = -roofAngle;

        // Gabletes triangulares
        const gableShape = new THREE.Shape();
        gableShape.moveTo(-w / 2, 0);
        gableShape.lineTo(w / 2, 0);
        gableShape.lineTo(0, roofHeight);
        gableShape.lineTo(-w / 2, 0);
        const gableGeo = new THREE.ExtrudeGeometry(gableShape, {
            depth: wallThickness, bevelEnabled: false
        });
        addMesh(gableGeo, materials.wood, 0, wallTop, wallFrontZ - wallThickness);
        addMesh(gableGeo.clone(), materials.wood, 0, wallTop, -d / 2);

        // Buhardilla en el gablete frontal (sobresale para verse)
        const aw = w * 0.15, ah = roofHeight * 0.35;
        const ay = wallTop + roofHeight * 0.4;
        addBox(aw + 0.12, ah + 0.12, 0.10, materials.woodDark, 0, ay, wallFrontZ + 0.03);
        addBox(aw, ah, 0.04, materials.glass, 0, ay, wallFrontZ + 0.09);
        addBox(0.04, ah * 0.95, 0.05, materials.woodDark, 0, ay, wallFrontZ + 0.115);
        addBox(aw * 0.95, 0.04, 0.05, materials.woodDark, 0, ay, wallFrontZ + 0.115);

        // Cumbrera
        addBox(0.18, 0.18, d + CFG.roofOverhang * 2, materials.woodDark,
            0, wallTop + roofHeight + 0.02, 0);

        // Canecillos bajo el alero
        const soffitCount = Math.max(3, Math.floor(d / 0.6));
        for (let i = 0; i < soffitCount; i++) {
            const z = -d / 2 + (d / (soffitCount - 1)) * i;
            for (const side of [-1, 1]) {
                addBox(0.08, 0.16, 0.08, materials.woodDark,
                    side * halfWidth * 0.95, wallTop + 0.05, z);
            }
        }

        // =============== CHIMENEA (altura calculada para salir del techo) ===============
        const chimneyX = -w * 0.28;
        const chimneyZ = -d * 0.22;
        const chimneyW = 0.6, chimneyD = 0.5;
        const roofAtX = wallTop + roofHeight * (1 - Math.abs(chimneyX) / (w / 2));
        const chimneyHeight = roofAtX + 0.7;   // sobresale 0.7 sobre el techo

        const cg = new THREE.Group();
        cg.position.set(chimneyX, 0, chimneyZ);

        const cBody = new THREE.Mesh(
            new THREE.BoxGeometry(chimneyW, chimneyHeight, chimneyD), materials.stone
        );
        cBody.position.y = chimneyHeight / 2;
        cBody.castShadow = cBody.receiveShadow = true;
        cg.add(cBody);

        const cCrown = new THREE.Mesh(
            new THREE.BoxGeometry(chimneyW + 0.15, 0.12, chimneyD + 0.15), materials.stone
        );
        cCrown.position.y = chimneyHeight + 0.06;
        cCrown.castShadow = true;
        cg.add(cCrown);

        const cHole = new THREE.Mesh(
            new THREE.BoxGeometry(chimneyW * 0.6, 0.15, chimneyD + 0.05), materials.metalDark
        );
        cHole.position.y = chimneyHeight + 0.16;
        cg.add(cHole);

        group.add(cg);

        // >>> HUMO: llamada de construcción. Coméntala para eliminarlo del todo.
        if (this.smokeEnabled) {
            this._createSmoke(
                THREE,
                group,
                new THREE.Vector3(chimneyX, chimneyHeight + 0.3, chimneyZ)
            );
        }

        // =============== ESCALONES Y FELPUDO ===============
        const steps = 2, stepH = foundationHeight / steps, stepD = 0.3;
        for (let i = 0; i < steps; i++) {
            const sy = foundationHeight - stepH * (i + 1) + stepH / 2;
            const sz = d / 2 + 0.3 + stepD * (steps - i - 1);
            addBox(doorWidth + 0.3 + i * 0.1, stepH, stepD, materials.stone, 0, sy, sz);
            addBox(doorWidth + 0.35 + i * 0.1, 0.03, 0.03, materials.woodDark,
                0, sy + stepH / 2 - 0.015, sz + stepD / 2 - 0.015);
        }
        addBox(doorWidth * 0.8, 0.02, 0.4, materials.mat, 0, foundationHeight + 0.01, d / 2 + 0.5);

        // =============== FAROL ===============
        const lg = new THREE.Group();
        lg.position.set(doorWidth / 2 + 0.45, 0, facadeZ + 0.25);

        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.5, 8), materials.metalDark);
        pole.position.y = 0.75; pole.castShadow = true;
        lg.add(pole);

        const lBase = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.18), materials.metalDark);
        lBase.position.y = 1.5; lg.add(lBase);

        const lGlass = new THREE.Mesh(
            new THREE.BoxGeometry(0.14, 0.25, 0.14),
            new THREE.MeshStandardMaterial({
                color: 0xfff0b0, emissive: 0xffaa40, emissiveIntensity: 0.8,
                transparent: true, opacity: 0.6, roughness: 0.3
            })
        );
        lGlass.position.y = 1.65; lg.add(lGlass);

        const lTop = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.15, 4), materials.metalDark);
        lTop.position.y = 1.85; lTop.rotation.y = Math.PI / 4;
        lg.add(lTop);

        const light = new THREE.PointLight(0xffaa40, 0.8, 4);
        light.position.y = 1.65;
        lg.add(light);

        group.add(lg);

        // =============== POSICIÓN FINAL ===============
        group.position.set(this.x + w / 2, 0, this.y + d / 2);
        group.rotation.y = this.rotation ?? 0;
        group.name = `House_${this.x}_${this.y}`;
        group.userData.worldObject = this;

        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }

    destroy() {
        if (this._smokeRAF) cancelAnimationFrame(this._smokeRAF);
        if (this._smoke) {
            this._smoke.tex.dispose();
            this._smoke = null;
        }

        if (this.visual) {
            this.visual.removeFromParent();
            this.visual.traverse(child => {
                if (child.isMesh || child.isSprite) {
                    child.geometry?.dispose();
                    const mats = Array.isArray(child.material) ? child.material : [child.material];
                    mats.forEach(m => {
                        if (m.map) m.map.dispose();
                        m.dispose();
                    });
                }
            });
            this.visual = null;
        }

        this.rendered = false;
        this.engine = null;
        super.destroy();
    }
}