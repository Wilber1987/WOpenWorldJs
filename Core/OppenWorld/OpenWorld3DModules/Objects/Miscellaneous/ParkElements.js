import { WorldObject } from "../WorldObjectModels.js";

/* =====================================================================
   LIBRERÍA DE ELEMENTOS DE PARQUE
   ---------------------------------------------------------------------
   Colección modular de objetos para construir parques urbanos y plazas.
   Cada elemento es un WorldObject independiente.
   
   Elementos disponibles:
     • ParkBench       - Banco de madera y metal
     • PicnicTable     - Mesa de picnic con bancos integrados
     • ParkFountain    - Fuente ornamental con agua animada
     • PlaygroundSlide - Tobogán infantil
     • ParkSwing       - Columpio con animación
     • Gazebo          - Cenador / glorieta
     • FlowerBed       - Macizo de flores con borde de piedra
     • ParkLamp        - Farola clásica de parque
     • ParkTrashCan    - Papelera con tapa
     • Statue          - Estatua sobre pedestal
     • ParkPath        - Sendero de adoquines
   ===================================================================== */


// ============================================================
// 🪑 ParkBench - Banco de parque
// ============================================================
export class ParkBench extends WorldObject {
    constructor(x, y, options = {}) {
        const length = options.length ?? 2.0;
        super(x, y, length, 0.6, options);
        this.length = length;
        this.woodColor = options.woodColor ?? 0x8b5a2b;
        this.metalColor = options.metalColor ?? 0x2a2a2a;
        this.withBackrest = options.withBackrest ?? true;
        this.withArmrests = options.withArmrests ?? true;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();

        const woodMat = new THREE.MeshStandardMaterial({ color: this.woodColor, roughness: 0.85 });
        const metalMat = new THREE.MeshStandardMaterial({ color: this.metalColor, roughness: 0.5, metalness: 0.7 });

        // Patas (2 soportes metálicos)
        for (const side of [-1, 1]) {
            const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.55, 0.5), metalMat);
            leg.position.set(side * (this.length / 2 - 0.15), 0.275, 0);
            leg.castShadow = true;
            group.add(leg);

            // Soporte del respaldo
            if (this.withBackrest) {
                const back = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 0.08), metalMat);
                back.position.set(side * (this.length / 2 - 0.15), 0.45, -0.22);
                back.castShadow = true;
                group.add(back);
            }

            // Reposabrazos
            if (this.withArmrests) {
                const arm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.45), metalMat);
                arm.position.set(side * (this.length / 2 - 0.08), 0.72, -0.05);
                group.add(arm);
            }
        }

        // Asiento (tablones de madera)
        const seatCount = 4;
        for (let i = 0; i < seatCount; i++) {
            const plank = new THREE.Mesh(new THREE.BoxGeometry(this.length - 0.1, 0.04, 0.09), woodMat);
            plank.position.set(0, 0.52, -0.18 + i * 0.11);
            plank.castShadow = true;
            plank.receiveShadow = true;
            group.add(plank);
        }

        // Respaldo (tablones verticales)
        if (this.withBackrest) {
            const backCount = 3;
            for (let i = 0; i < backCount; i++) {
                const plank = new THREE.Mesh(new THREE.BoxGeometry(this.length - 0.1, 0.06, 0.03), woodMat);
                plank.position.set(0, 0.68 + i * 0.10, -0.24);
                plank.castShadow = true;
                group.add(plank);
            }
        }

        group.position.set(this.x + this.w / 2, 0, this.y + this.h / 2);
        group.rotation.y = this.rotation ?? 0;
        group.name = `ParkBench_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);
        this.AsingProps(group, engine, true);
    }
}


// ============================================================
// 🍽️ PicnicTable - Mesa de picnic
// ============================================================
export class PicnicTable extends WorldObject {
    constructor(x, y, options = {}) {
        const length = options.length ?? 2.4;
        super(x, y, length, 1.6, options);
        this.length = length;
        this.woodColor = options.woodColor ?? 0xa87042;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();

        const woodMat = new THREE.MeshStandardMaterial({ color: this.woodColor, roughness: 0.9 });
        const darkWood = new THREE.MeshStandardMaterial({ color: 0x5a3a1e, roughness: 0.9 });

        // Mesa superior
        const tabletop = new THREE.Mesh(new THREE.BoxGeometry(this.length, 0.06, 0.85), woodMat);
        tabletop.position.y = 0.85;
        tabletop.castShadow = tabletop.receiveShadow = true;
        group.add(tabletop);

        // Bancos laterales
        for (const side of [-1, 1]) {
            const bench = new THREE.Mesh(new THREE.BoxGeometry(this.length, 0.05, 0.32), woodMat);
            bench.position.set(0, 0.5, side * 0.7);
            bench.castShadow = bench.receiveShadow = true;
            group.add(bench);
        }

        // Soportes en A (2 en cada extremo)
        for (const side of [-1, 1]) {
            const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.95, 0.08), darkWood);
            leg1.position.set(side * (this.length / 2 - 0.3), 0.47, 0);
            leg1.castShadow = true;
            group.add(leg1);

            // Travesaño diagonal
            const cross = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.7, 0.06), darkWood);
            cross.position.set(side * (this.length / 2 - 0.3), 0.6, 0);
            cross.rotation.z = side * 0.45;
            cross.castShadow = true;
            group.add(cross);
        }

        // Travesaño central de refuerzo
        const crossBar = new THREE.Mesh(new THREE.BoxGeometry(this.length - 0.6, 0.08, 0.06), darkWood);
        crossBar.position.y = 0.45;
        crossBar.castShadow = true;
        group.add(crossBar);

        group.position.set(this.x + this.w / 2, 0, this.y + this.h / 2);
        group.rotation.y = this.rotation ?? 0;
        group.name = `PicnicTable_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);
        this.AsingProps(group, engine, true);
    }
}


// ============================================================
// ⛲ ParkFountain - Fuente ornamental con agua animada
// ============================================================
export class ParkFountain extends WorldObject {
    constructor(x, y, options = {}) {
        const radius = options.radius ?? 1.8;
        super(x, y, radius * 2, radius * 2, options);
        this.radius = radius;
        this.stoneColor = options.stoneColor ?? 0x9a928a;
        this.waterColor = options.waterColor ?? 0x4a8ab5;
        this._animRAF = null;
    }

    _createStoneTexture(THREE) {
        const size = 256;
        const c = document.createElement("canvas");
        c.width = c.height = size;
        const ctx = c.getContext("2d");
        ctx.fillStyle = "#8a8278";
        ctx.fillRect(0, 0, size, size);
        for (let i = 0; i < 1500; i++) {
            ctx.fillStyle = `rgba(${60 + Math.random() * 60}, ${60 + Math.random() * 60}, ${60 + Math.random() * 60}, ${Math.random() * 0.3})`;
            ctx.fillRect(Math.random() * size, Math.random() * size, 1 + Math.random() * 2, 1 + Math.random() * 2);
        }
        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();

        const stoneTex = this._createStoneTexture(THREE);
        const stoneMat = new THREE.MeshStandardMaterial({ map: stoneTex, roughness: 0.95 });
        const waterMat = new THREE.MeshStandardMaterial({
            color: this.waterColor, roughness: 0.1, metalness: 0.3,
            transparent: true, opacity: 0.75
        });

        // Base circular (piscina)
        const baseOuter = new THREE.Mesh(
            new THREE.CylinderGeometry(this.radius, this.radius * 1.05, 0.5, 24),
            stoneMat
        );
        baseOuter.position.y = 0.25;
        baseOuter.castShadow = baseOuter.receiveShadow = true;
        group.add(baseOuter);

        // Hueco interior (agua)
        const water = new THREE.Mesh(
            new THREE.CylinderGeometry(this.radius - 0.15, this.radius - 0.15, 0.1, 24),
            waterMat
        );
        water.position.y = 0.42;
        group.add(water);
        this._water = water;

        // Pilar central
        const pillar = new THREE.Mesh(
            new THREE.CylinderGeometry(0.25, 0.35, 1.2, 12),
            stoneMat
        );
        pillar.position.y = 0.6 + 0.6;
        pillar.castShadow = true;
        group.add(pillar);

        // Plato superior
        const topBowl = new THREE.Mesh(
            new THREE.CylinderGeometry(0.7, 0.5, 0.2, 16),
            stoneMat
        );
        topBowl.position.y = 1.8;
        topBowl.castShadow = true;
        group.add(topBowl);

        // Agua en el plato superior
        const topWater = new THREE.Mesh(
            new THREE.CylinderGeometry(0.6, 0.6, 0.05, 16),
            waterMat
        );
        topWater.position.y = 1.88;
        group.add(topWater);
        this._topWater = topWater;

        // Chorro central
        const jetMat = new THREE.MeshStandardMaterial({
            color: 0xaaddff, transparent: true, opacity: 0.6, emissive: 0x3366aa, emissiveIntensity: 0.3
        });
        const jet = new THREE.Mesh(
            new THREE.CylinderGeometry(0.06, 0.03, 0.6, 8),
            jetMat
        );
        jet.position.y = 2.2;
        group.add(jet);
        this._jet = jet;

        // Salpicaduras (esferas pequeñas que suben y bajan)
        this._drops = [];
        for (let i = 0; i < 8; i++) {
            const drop = new THREE.Mesh(
                new THREE.SphereGeometry(0.05, 6, 6),
                jetMat
            );
            group.add(drop);
            this._drops.push({ mesh: drop, phase: (i / 8) * Math.PI * 2 });
        }

        group.position.set(this.x + this.w / 2, 0, this.y + this.h / 2);
        group.rotation.y = this.rotation ?? 0;
        group.name = `ParkFountain_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);
        this.AsingProps(group, engine, true);

        // Animación del agua
        const clock = new THREE.Clock();
        const animate = () => {
            this._animRAF = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            
            // Pulso del chorro
            const pulse = 1 + Math.sin(t * 4) * 0.08;
            this._jet.scale.set(pulse, 1 + Math.sin(t * 3) * 0.15, pulse);
            
            // Ondas en el agua
            this._water.scale.y = 1 + Math.sin(t * 2) * 0.05;
            this._topWater.scale.y = 1 + Math.sin(t * 2.5) * 0.08;
            
            // Gotas cayendo
            for (const d of this._drops) {
                const p = ((t * 2 + d.phase) % 1);
                const h = p * 0.8;
                const r = 0.15 + p * 0.4;
                d.mesh.position.set(
                    Math.cos(d.phase + t) * r,
                    1.9 + Math.sin(p * Math.PI) * 0.5 - h * 0.3,
                    Math.sin(d.phase + t) * r
                );
                d.mesh.scale.setScalar(1 - p * 0.5);
            }
        };
        animate();
    }

    destroy() {
        if (this._animRAF) cancelAnimationFrame(this._animRAF);
        super.destroy();
    }
}


// ============================================================
// 🎢 PlaygroundSlide - Tobogán infantil
// ============================================================
export class PlaygroundSlide extends WorldObject {
    constructor(x, y, options = {}) {
        super(x, y, 4, 2.5, options);
        this.height = options.height ?? 2.2;
        this.slideColor = options.slideColor ?? 0xe84040;
        this.metalColor = options.metalColor ?? 0x888888;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();

        const slideMat = new THREE.MeshStandardMaterial({ color: this.slideColor, roughness: 0.4, metalness: 0.2 });
        const metalMat = new THREE.MeshStandardMaterial({ color: this.metalColor, roughness: 0.5, metalness: 0.8 });
        const platMat = new THREE.MeshStandardMaterial({ color: 0x3a6a9a, roughness: 0.7 });

        // Plataforma superior
        const platform = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 1.2), platMat);
        platform.position.set(-1.2, this.height, 0);
        platform.castShadow = platform.receiveShadow = true;
        group.add(platform);

        // Patas de la plataforma (4)
        for (const sx of [-1, 1]) {
            for (const sz of [-1, 1]) {
                const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, this.height, 8), metalMat);
                leg.position.set(-1.2 + sx * 0.5, this.height / 2, sz * 0.5);
                leg.castShadow = true;
                group.add(leg);
            }
        }

        // Escalera
        const ladderH = this.height;
        for (let i = 0; i < 5; i++) {
            const step = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.04, 0.08), metalMat);
            step.position.set(-1.8, ladderH * (i + 1) / 5, 0);
            group.add(step);
        }
        for (const side of [-1, 1]) {
            const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, ladderH * 1.1, 6), metalMat);
            rail.position.set(-1.8, ladderH / 2, side * 0.4);
            rail.rotation.z = 0.15;
            rail.castShadow = true;
            group.add(rail);
        }

        // Tobogán (curva simple usando BoxGeometry inclinado)
        const slideLen = Math.hypot(2.5, this.height);
        const slideAngle = Math.atan2(this.height, 2.5);
        const slide = new THREE.Mesh(
            new THREE.BoxGeometry(0.9, 0.05, slideLen),
            slideMat
        );
        slide.position.set(0.2, this.height / 2, 0);
        slide.rotation.x = -slideAngle;
        slide.castShadow = slide.receiveShadow = true;
        group.add(slide);

        // Bordes del tobogán
        for (const side of [-1, 1]) {
            const edge = new THREE.Mesh(
                new THREE.BoxGeometry(0.05, 0.25, slideLen),
                slideMat
            );
            edge.position.set(0.2 + side * 0.45, this.height / 2 + 0.1, 0);
            edge.rotation.x = -slideAngle;
            group.add(edge);
        }

        // Barandilla superior
        const topRail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 6), metalMat);
        topRail.position.set(-1.2, this.height + 0.6, 0);
        topRail.rotation.z = Math.PI / 2;
        group.add(topRail);

        group.position.set(this.x + this.w / 2, 0, this.y + this.h / 2);
        group.rotation.y = this.rotation ?? 0;
        group.name = `PlaygroundSlide_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);
        this.AsingProps(group, engine, true);
    }
}


// ============================================================
// 🎐 ParkSwing - Columpio con animación
// ============================================================
export class ParkSwing extends WorldObject {
    constructor(x, y, options = {}) {
        const length = options.length ?? 2.4;
        super(x, y, length, 1.8, options);
        this.length = length;
        this.seatCount = options.seatCount ?? 2;
        this.metalColor = options.metalColor ?? 0xc8402a;
        this._animRAF = null;
        this._seats = [];
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();

        const metalMat = new THREE.MeshStandardMaterial({ color: this.metalColor, roughness: 0.5, metalness: 0.7 });
        const seatMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.8 });
        const chainMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.4, metalness: 0.9 });

        const frameH = 2.6;

        // Estructura en A (2 soportes laterales)
        for (const side of [-1, 1]) {
            for (const sx of [-1, 1]) {
                const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, frameH, 8), metalMat);
                pole.position.set(side * (this.length / 2), frameH / 2, sx * 0.5);
                pole.rotation.z = side * 0.12;
                pole.castShadow = true;
                group.add(pole);
            }
        }

        // Barra superior
        const topBar = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, this.length + 0.1, 12), metalMat);
        topBar.position.y = frameH;
        topBar.rotation.z = Math.PI / 2;
        topBar.castShadow = true;
        group.add(topBar);

        // Asientos colgantes
        const seatSpacing = this.length / (this.seatCount + 1);
        for (let i = 0; i < this.seatCount; i++) {
            const seatGroup = new THREE.Group();
            seatGroup.position.set(-this.length / 2 + seatSpacing * (i + 1), frameH, 0);

            // Cadenas (2)
            for (const sx of [-1, 1]) {
                const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.6, 6), chainMat);
                chain.position.set(sx * 0.2, -0.8, 0);
                seatGroup.add(chain);
            }

            // Asiento
            const seat = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.04, 0.22), seatMat);
            seat.position.y = -1.6;
            seat.castShadow = true;
            seatGroup.add(seat);

            group.add(seatGroup);
            this._seats.push(seatGroup);
        }

        group.position.set(this.x + this.w / 2, 0, this.y + this.h / 2);
        group.rotation.y = this.rotation ?? 0;
        group.name = `ParkSwing_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);
        this.AsingProps(group, engine, true);

        // Animación de balanceo
        const clock = new THREE.Clock();
        const animate = () => {
            this._animRAF = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            this._seats.forEach((s, i) => {
                const phase = (i / this._seats.length) * Math.PI;
                s.rotation.z = Math.sin(t * 1.5 + phase) * 0.25;
            });
        };
        animate();
    }

    destroy() {
        if (this._animRAF) cancelAnimationFrame(this._animRAF);
        super.destroy();
    }
}


// ============================================================
// 🏛️ Gazebo - Cenador / glorieta
// ============================================================
export class Gazebo extends WorldObject {
    constructor(x, y, options = {}) {
        const radius = options.radius ?? 2.2;
        super(x, y, radius * 2, radius * 2, options);
        this.radius = radius;
        this.sides = options.sides ?? 6;
        this.height = options.height ?? 3.0;
        this.woodColor = options.woodColor ?? 0xf0e8d8;
        this.roofColor = options.roofColor ?? 0x5a3a2a;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();

        const woodMat = new THREE.MeshStandardMaterial({ color: this.woodColor, roughness: 0.7 });
        const roofMat = new THREE.MeshStandardMaterial({ color: this.roofColor, roughness: 0.85 });
        const stoneMat = new THREE.MeshStandardMaterial({ color: 0x9a928a, roughness: 0.95 });

        // Base de piedra (plataforma)
        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(this.radius * 1.05, this.radius * 1.1, 0.3, this.sides),
            stoneMat
        );
        base.position.y = 0.15;
        base.castShadow = base.receiveShadow = true;
        group.add(base);

        // Suelo interior
        const floor = new THREE.Mesh(
            new THREE.CylinderGeometry(this.radius, this.radius, 0.05, this.sides),
            woodMat
        );
        floor.position.y = 0.33;
        floor.receiveShadow = true;
        group.add(floor);

        // Pilares (uno por vértice)
        const pillarH = this.height - 0.6;
        for (let i = 0; i < this.sides; i++) {
            const angle = (i / this.sides) * Math.PI * 2;
            const px = Math.cos(angle) * (this.radius - 0.15);
            const pz = Math.sin(angle) * (this.radius - 0.15);
            
            const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, pillarH, 8), woodMat);
            pillar.position.set(px, 0.3 + pillarH / 2, pz);
            pillar.castShadow = true;
            group.add(pillar);

            // Barandilla (solo en lados alternos para permitir entrada)
            if (i % 2 === 1 && i !== 0) {
                const rail = new THREE.Mesh(new THREE.BoxGeometry(this.radius * 0.6, 0.06, 0.06), woodMat);
                const midAngle = ((i - 0.5) / this.sides) * Math.PI * 2;
                rail.position.set(
                    Math.cos(midAngle) * (this.radius - 0.1),
                    1.2,
                    Math.sin(midAngle) * (this.radius - 0.1)
                );
                rail.rotation.y = -midAngle + Math.PI / 2;
                group.add(rail);
            }
        }

        // Techo cónico
        const roof = new THREE.Mesh(
            new THREE.ConeGeometry(this.radius * 1.1, 1.5, this.sides),
            roofMat
        );
        roof.position.y = 0.3 + pillarH + 0.75;
        roof.castShadow = true;
        group.add(roof);

        // Pináculo
        const finial = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), woodMat);
        finial.position.y = 0.3 + pillarH + 1.5 + 0.15;
        group.add(finial);

        group.position.set(this.x + this.w / 2, 0, this.y + this.h / 2);
        group.rotation.y = this.rotation ?? 0;
        group.name = `Gazebo_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);
        this.AsingProps(group, engine, true);
    }
}


// ============================================================
// 🌷 FlowerBed - Macizo de flores con borde de piedra
// ============================================================
export class FlowerBed extends WorldObject {
    constructor(x, y, options = {}) {
        const width = options.width ?? 3;
        const depth = options.depth ?? 2;
        super(x, y, width, depth, { blocks: false, ...options });
        this.width = width;
        this.depth = depth;
        this.flowerColors = options.flowerColors ?? [0xd94060, 0xe6a840, 0xc060d0, 0xffffff, 0xffe600];
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();

        const stoneMat = new THREE.MeshStandardMaterial({ color: 0x8a8278, roughness: 0.95 });
        const soilMat = new THREE.MeshStandardMaterial({ color: 0x3a2815, roughness: 1.0 });
        const grassMat = new THREE.MeshStandardMaterial({ color: 0x4a7030, roughness: 1.0 });

        // Borde de piedra
        const borderH = 0.18;
        const borderW = 0.15;
        
        // 4 lados del borde
        const sides = [
            { w: this.width, d: borderW, x: 0, z: this.depth / 2 - borderW / 2 },
            { w: this.width, d: borderW, x: 0, z: -this.depth / 2 + borderW / 2 },
            { w: borderW, d: this.depth, x: this.width / 2 - borderW / 2, z: 0 },
            { w: borderW, d: this.depth, x: -this.width / 2 + borderW / 2, z: 0 },
        ];
        
        for (const s of sides) {
            const b = new THREE.Mesh(new THREE.BoxGeometry(s.w, borderH, s.d), stoneMat);
            b.position.set(s.x, borderH / 2, s.z);
            b.castShadow = b.receiveShadow = true;
            group.add(b);
        }

        // Tierra interior
        const soil = new THREE.Mesh(
            new THREE.BoxGeometry(this.width - borderW * 2, 0.05, this.depth - borderW * 2),
            soilMat
        );
        soil.position.y = borderH - 0.02;
        soil.receiveShadow = true;
        group.add(soil);

        // Flores distribuidas aleatoriamente
        const flowerCount = Math.floor(this.width * this.depth * 4);
        const stemGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.25, 4);
        const headGeo = new THREE.SphereGeometry(0.06, 6, 6);
        
        for (let i = 0; i < flowerCount; i++) {
            const fx = (Math.random() - 0.5) * (this.width - borderW * 3);
            const fz = (Math.random() - 0.5) * (this.depth - borderW * 3);
            
            // Tallo
            const stem = new THREE.Mesh(stemGeo, grassMat);
            stem.position.set(fx, borderH + 0.12, fz);
            group.add(stem);
            
            // Cabeza de flor
            const color = this.flowerColors[Math.floor(Math.random() * this.flowerColors.length)];
            const head = new THREE.Mesh(headGeo, new THREE.MeshStandardMaterial({
                color, roughness: 0.6, emissive: color, emissiveIntensity: 0.1
            }));
            head.position.set(fx, borderH + 0.28, fz);
            head.castShadow = true;
            group.add(head);
        }

        group.position.set(this.x + this.w / 2, 0, this.y + this.h / 2);
        group.rotation.y = this.rotation ?? 0;
        group.name = `FlowerBed_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);
        this.AsingProps(group, engine, true);
    }
}


// ============================================================
// 💡 ParkLamp - Farola clásica de parque
// ============================================================
export class ParkLamp extends WorldObject {
    constructor(x, y, options = {}) {
        super(x, y, 0.4, 0.4, options);
        this.height = options.height ?? 2.8;
        this.lampColor = options.lampColor ?? 0xfff0b0;
        this.poleColor = options.poleColor ?? 0x2a2a2a;
        this.addLight = options.addLight ?? true;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();

        const poleMat = new THREE.MeshStandardMaterial({ color: this.poleColor, roughness: 0.5, metalness: 0.7 });

        // Poste (curvado en la parte superior)
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, this.height, 8), poleMat);
        pole.position.y = this.height / 2;
        pole.castShadow = true;
        group.add(pole);

        // Base
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 0.1, 12), poleMat);
        base.position.y = 0.05;
        group.add(base);

        // Brazo curvo
        const arm = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.03, 8, 12, Math.PI / 2), poleMat);
        arm.position.set(0.3, this.height, 0);
        arm.rotation.z = Math.PI;
        group.add(arm);

        // Lámpara (esfera luminosa)
        const lampMat = new THREE.MeshStandardMaterial({
            color: this.lampColor,
            emissive: this.lampColor,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.9,
            roughness: 0.3
        });
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), lampMat);
        lamp.position.set(0.6, this.height - 0.1, 0);
        group.add(lamp);

        // Cúpula metálica
        const cap = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.15, 12), poleMat);
        cap.position.set(0.6, this.height + 0.05, 0);
        group.add(cap);

        // PointLight
        if (this.addLight) {
            const light = new THREE.PointLight(this.lampColor, 0.8, 6);
            light.position.set(0.6, this.height - 0.1, 0);
            group.add(light);
        }

        group.position.set(this.x + this.w / 2, 0, this.y + this.h / 2);
        group.rotation.y = this.rotation ?? 0;
        group.name = `ParkLamp_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);
        this.AsingProps(group, engine, true);
    }
}


// ============================================================
// 🗑️ ParkTrashCan - Papelera con tapa
// ============================================================
export class ParkTrashCan extends WorldObject {
    constructor(x, y, options = {}) {
        super(x, y, 0.5, 0.5, options);
        this.color = options.color ?? 0x3a5a2a;
        this.hasTape = options.hasTape ?? true;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();

        const bodyMat = new THREE.MeshStandardMaterial({ color: this.color, roughness: 0.7, metalness: 0.3 });
        const metalMat = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.5, metalness: 0.8 });

        // Cuerpo cilíndrico
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.9, 12), bodyMat);
        body.position.y = 0.45;
        body.castShadow = true;
        group.add(body);

        // Tapa
        const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.06, 12), metalMat);
        lid.position.y = 0.93;
        group.add(lid);

        // Asa
        const handle = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.015, 6, 12), metalMat);
        handle.position.y = 1.0;
        handle.rotation.x = Math.PI / 2;
        group.add(handle);

        // Base
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.04, 12), metalMat);
        base.position.y = 0.02;
        group.add(base);

        group.position.set(this.x + this.w / 2, 0, this.y + this.h / 2);
        group.rotation.y = this.rotation ?? 0;
        group.name = `ParkTrashCan_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);
        this.AsingProps(group, engine, true);
    }
}


// ============================================================
// 🗿 Statue - Estatua sobre pedestal
// ============================================================
export class Statue extends WorldObject {
    constructor(x, y, options = {}) {
        super(x, y, 1.2, 1.2, options);
        this.style = options.style ?? "abstract"; // "abstract" | "figure" | "obelisk"
        this.stoneColor = options.stoneColor ?? 0xb8b0a6;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();

        const stoneMat = new THREE.MeshStandardMaterial({ color: this.stoneColor, roughness: 0.8, metalness: 0.1 });
        const darkStone = new THREE.MeshStandardMaterial({ color: 0x6a6258, roughness: 0.9 });

        // Base escalonada
        const base1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.25, 1.2), darkStone);
        base1.position.y = 0.125;
        base1.castShadow = base1.receiveShadow = true;
        group.add(base1);

        const base2 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.9), stoneMat);
        base2.position.y = 0.55;
        base2.castShadow = true;
        group.add(base2);

        // Estatua según estilo
        if (this.style === "abstract") {
            // Formas geométricas apiladas
            const s1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.5), stoneMat);
            s1.position.y = 1.3;
            s1.castShadow = true;
            group.add(s1);

            const s2 = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), stoneMat);
            s2.position.y = 2.1;
            s2.castShadow = true;
            group.add(s2);

            const s3 = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.6, 8), stoneMat);
            s3.position.y = 2.7;
            s3.castShadow = true;
            group.add(s3);
        } else if (this.style === "figure") {
            // Figura humanoide estilizada
            // Torso
            const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.9, 8), stoneMat);
            torso.position.y = 1.3;
            torso.castShadow = true;
            group.add(torso);

            // Cabeza
            const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), stoneMat);
            head.position.y = 1.95;
            head.castShadow = true;
            group.add(head);

            // Brazos extendidos
            for (const side of [-1, 1]) {
                const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.7, 6), stoneMat);
                arm.position.set(side * 0.4, 1.5, 0);
                arm.rotation.z = side * Math.PI / 3;
                arm.castShadow = true;
                group.add(arm);
            }
        } else {
            // Obelisco
            const obelisk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.3, 2.2, 4), stoneMat);
            obelisk.position.y = 1.95;
            obelisk.castShadow = true;
            group.add(obelisk);

            const tip = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.4, 4), stoneMat);
            tip.position.y = 3.25;
            tip.castShadow = true;
            group.add(tip);
        }

        // Placa conmemorativa
        const plaque = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.18, 0.04),
            new THREE.MeshStandardMaterial({ color: 0x8a6a3a, metalness: 0.8, roughness: 0.3 })
        );
        plaque.position.set(0, 0.55, 0.46);
        group.add(plaque);

        group.position.set(this.x + this.w / 2, 0, this.y + this.h / 2);
        group.rotation.y = this.rotation ?? 0;
        group.name = `Statue_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);
        this.AsingProps(group, engine, true);
    }
}


// ============================================================
// 🟫 ParkPath - Sendero de adoquines
// ============================================================
export class ParkPath extends WorldObject {
    constructor(x, y, options = {}) {
        const width = options.width ?? 2;
        const depth = options.depth ?? 6;
        super(x, y, width, depth, { blocks: false, ...options });
        this.width = width;
        this.depth = depth;
        this.color = options.color ?? 0x9a8878;
    }

    _createCobblestoneTexture(THREE) {
        const size = 512;
        const c = document.createElement("canvas");
        c.width = c.height = size;
        const ctx = c.getContext("2d");

        // Fondo de arena
        ctx.fillStyle = "#8a7a6a";
        ctx.fillRect(0, 0, size, size);

        // Adoquines irregulares
        const stoneCount = 60;
        for (let i = 0; i < stoneCount; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const r = 25 + Math.random() * 35;
            const points = 6 + Math.floor(Math.random() * 3);
            
            ctx.beginPath();
            for (let p = 0; p < points; p++) {
                const a = (p / points) * Math.PI * 2;
                const rr = r * (0.7 + Math.random() * 0.5);
                const px = x + Math.cos(a) * rr;
                const py = y + Math.sin(a) * rr;
                p === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            }
            ctx.closePath();
            
            const s = 110 + Math.floor(Math.random() * 60);
            ctx.fillStyle = `rgb(${s}, ${s - 10}, ${s - 20})`;
            ctx.fill();
            ctx.strokeStyle = "#4a3a2a";
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(this.width / 2, this.depth / 2);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
    }

    render(engine) {
        if (this.rendered) return;
        const THREE = engine.THREE;
        const group = new THREE.Group();

        const tex = this._createCobblestoneTexture(THREE);
        const mat = new THREE.MeshStandardMaterial({
            map: tex,
            color: this.color,
            roughness: 0.95
        });

        const path = new THREE.Mesh(new THREE.BoxGeometry(this.width, 0.05, this.depth), mat);
        path.position.y = 0.025;
        path.receiveShadow = true;
        group.add(path);

        group.position.set(this.x + this.w / 2, 0, this.y + this.h / 2);
        group.rotation.y = this.rotation ?? 0;
        group.name = `ParkPath_${this.x}_${this.y}`;
        group.userData.worldObject = this;
        engine.renderer.scene.add(group);
        this.AsingProps(group, engine, true);
    }
}