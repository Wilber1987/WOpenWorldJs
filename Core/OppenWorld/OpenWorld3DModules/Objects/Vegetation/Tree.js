import { WorldObject } from "../WorldObjectModels.js";

/**
 * Opciones de configuración para Tree.
 *
 * @typedef {Object} TreeOptions
 * @property {number}  [height=6]                  - Altura total del árbol.
 * @property {number}  [trunkRadius=0.26]          - Radio del tronco en la base.
 * @property {number}  [trunkCollisionRadius=0.5]  - Radio efectivo de colisión del tronco.
 * @property {number}  [canopyRadius=2.4]          - Radio de la copa (visual, no colisiona).
 * @property {number}  [branchCount=6]             - Ramas principales del tronco.
 * @property {number}  [leafCount=0]               - Nº de hojas (0 = según quality).
 * @property {number}  [leafSize=0.30]             - Tamaño base de cada hoja.
 * @property {"low"|"medium"|"high"} [quality="high"] - Preset de resolución.
 * @property {number}  [leafColor=0x4a8a3a]         - Color base del follaje.
 * @property {number}  [colorVariation=0.16]       - Variación de tono entre hojas (0-1).
 * @property {number}  [barkColor=0x6b4a2f]         - Color de la corteza.
 * @property {boolean} [fallenLeaves=true]         - Hojas caídas alrededor de la base.
 * @property {boolean} [sway=true]                 - Balanceo suave con el viento.
 * @property {number}  [swayIntensity=1]           - Multiplicador del balanceo.
 * @property {number}  [seed]                      - Semilla fija para árboles reproducibles.
 * @property {string}  [name="Tree"]
 */

const QUALITY_PRESETS = {
    low: { leaves: 700, radial: 8, curve: 4 },
    medium: { leaves: 1500, radial: 12, curve: 6 },
    high: { leaves: 2600, radial: 16, curve: 8 }
};

export class Tree extends WorldObject {
    constructor(x, y, options = {}) {
        // Pasamos w=1, h=1 al super. La colisión real se calcula en occupies()
        // verificando si el círculo del tronco intersecta con el tile.
        super(x, y, 1, 1, options);

        this.name = options.name ?? "Tree";

        this.height = options.height ?? 6;
        this.trunkRadius = options.trunkRadius ?? 0.26;
        this.canopyRadius = options.canopyRadius ?? this.height * 0.4;
        this.branchCount = options.branchCount ?? 6;

        // Radio de colisión del tronco en unidades de mundo.
        // Default 0.5 = medio tile, suficiente para bloquear el tile central.
        this.trunkCollisionRadius = options.trunkCollisionRadius ?? 0.35;

        this.quality = options.quality ?? "high";
        this.leafCount = options.leafCount || QUALITY_PRESETS[this.quality].leaves;
        this.leafSize = options.leafSize ?? 0.30;

        this.colors = {
            leaf: options.leafColor ?? 0x4a8a3a,
            bark: options.barkColor ?? 0x6b4a2f
        };
        this.colorVariation = options.colorVariation ?? 0.16;

        this.fallenLeaves = options.fallenLeaves ?? true;
        this.sway = options.sway ?? true;
        this.swayIntensity = options.swayIntensity ?? 1;

        this.seed = options.seed ?? Math.floor(Math.random() * 1e9);
        this._phase = (this.seed % 1000) / 1000 * Math.PI * 2;

        // Centro del tronco en coordenadas de mundo.
        // El árbol está centrado en el tile (this.x, this.y),
        // por lo que su centro geométrico está en (this.x + 0.5, this.y + 0.5).
        this._trunkCenterX = this.x + 0.5;
        this._trunkCenterY = this.y + 0.5;
    }

    // --------------------------------------------------
    // OVERRIDE DE COLISIÓN: detección circular del tronco
    // --------------------------------------------------
    /**
     * Verifica si el círculo de colisión del tronco intersecta con el tile.
     * Un tile está bloqueado si cualquier parte del círculo del tronco
     * cae dentro del área del tile [tx, tx+1] × [ty, ty+1].
     *
     * @param {number} tx - Coordenada X del tile
     * @param {number} ty - Coordenada Y del tile
     * @returns {boolean}
     */
    occupies(tx, ty) {
        if (!this.blocksMovement) return false;

        // Área del tile en coordenadas de mundo
        const tileMinX = tx;
        const tileMaxX = tx + 1;
        const tileMinY = ty;
        const tileMaxY = ty + 1;

        // Punto más cercano del tile al centro del tronco
        const closestX = Math.max(tileMinX, Math.min(this._trunkCenterX, tileMaxX));
        const closestY = Math.max(tileMinY, Math.min(this._trunkCenterY, tileMaxY));

        // Distancia al cuadrado entre el centro del tronco y el punto más cercano
        const dx = closestX - this._trunkCenterX;
        const dy = closestY - this._trunkCenterY;
        const distSq = dx * dx + dy * dy;

        // El tile está bloqueado si el círculo intersecta con él
        return distSq <= this.trunkCollisionRadius * this.trunkCollisionRadius;
    }

    // RNG con semilla (mulberry32)
    _rng() {
        let a = this.seed >>> 0;
        return () => {
            a |= 0; a = (a + 0x6D2B79F5) | 0;
            let t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    _barkTexture(THREE, hex) {
        const s = 256, c = document.createElement("canvas");
        c.width = c.height = s;
        const ctx = c.getContext("2d");
        ctx.fillStyle = hex; ctx.fillRect(0, 0, s, s);

        for (let i = 0; i < 60; i++) {
            let cx = Math.random() * s;
            ctx.strokeStyle = `rgba(30,18,8,${0.15 + Math.random() * 0.4})`;
            ctx.lineWidth = 1 + Math.random() * 3;
            ctx.beginPath();
            ctx.moveTo(cx, 0);
            for (let y = 0; y < s; y += 10) {
                cx += (Math.random() - 0.5) * 4;
                ctx.lineTo(cx, y);
            }
            ctx.stroke();
        }
        for (let i = 0; i < 25; i++) {
            const x = Math.random() * s, y = Math.random() * s;
            const r = 8 + Math.random() * 20;
            const g = ctx.createRadialGradient(x, y, 0, x, y, r);
            g.addColorStop(0, "rgba(255,235,200,0.10)");
            g.addColorStop(1, "rgba(255,235,200,0)");
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        }

        const t = new THREE.CanvasTexture(c);
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(2, 3);
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
    }

    _leafGeometry(THREE, size) {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.bezierCurveTo(size * 0.55, size * 0.3, size * 0.5, size * 1.0, 0, size * 1.5);
        shape.bezierCurveTo(-size * 0.5, size * 1.0, -size * 0.55, size * 0.3, 0, 0);

        const geo = new THREE.ShapeGeometry(shape, 6);
        geo.translate(0, -size * 0.75, 0);
        return geo;
    }

    render(engine) {
        if (this.rendered) return;

        const THREE = engine.THREE;
        const rnd = this._rng();
        const group = new THREE.Group();
        const preset = QUALITY_PRESETS[this.quality];

        const H = this.height;
        const trunkH = H * 0.55;
        const canopyCenterY = H * 0.66;
        const CR = this.canopyRadius;

        const hex = n => "#" + n.toString(16).padStart(6, "0");

        const barkMat = new THREE.MeshStandardMaterial({
            map: this._barkTexture(THREE, hex(this.colors.bark)),
            color: this.colors.bark,
            roughness: 0.95
        });

        const leafMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            roughness: 0.85,
            metalness: 0.0
        });

        // =============== TRONCO ===============
        const profile = [];
        const profSteps = preset.curve + 4;
        for (let i = 0; i <= profSteps; i++) {
            const t = i / profSteps;
            const flare = 1 + 0.45 * Math.exp(-t * 9);
            const r = this.trunkRadius * (1 - t * 0.78) * flare;
            profile.push(new THREE.Vector2(Math.max(r, 0.03), t * trunkH));
        }
        const trunkGeo = new THREE.LatheGeometry(profile, preset.radial);

        const bendX = (rnd() - 0.5) * 0.6;
        const bendZ = (rnd() - 0.5) * 0.6;
        const pos = trunkGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const y = pos.getY(i);
            const k = (y / trunkH) ** 2;
            pos.setX(i, pos.getX(i) + bendX * k + Math.sin(y * 3.1) * 0.02);
            pos.setZ(i, pos.getZ(i) + bendZ * k + Math.cos(y * 2.7) * 0.02);
        }
        trunkGeo.computeVertexNormals();

        const trunk = new THREE.Mesh(trunkGeo, barkMat);
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        group.add(trunk);

        // =============== RAMAS ===============
        const branchTips = [];
        const up = new THREE.Vector3(0, 1, 0);

        const addBranch = (from, to, r0, r1) => {
            const dir = to.clone().sub(from);
            const len = dir.length();
            const geo = new THREE.CylinderGeometry(r1, r0, len, 8, 1, true);
            geo.translate(0, len / 2, 0);
            const mesh = new THREE.Mesh(geo, barkMat);
            mesh.position.copy(from);
            mesh.quaternion.setFromUnitVectors(up, dir.clone().normalize());
            mesh.castShadow = true;
            group.add(mesh);
            return mesh;
        };

        for (let i = 0; i < this.branchCount; i++) {
            const angle = (i / this.branchCount) * Math.PI * 2 + rnd() * 0.7;
            const startY = trunkH * (0.55 + rnd() * 0.35);
            const len = CR * (0.55 + rnd() * 0.45);
            const rise = 0.45 + rnd() * 0.5;

            const from = new THREE.Vector3(
                Math.cos(angle) * this.trunkRadius * 0.5,
                startY,
                Math.sin(angle) * this.trunkRadius * 0.5
            );
            const to = new THREE.Vector3(
                Math.cos(angle) * len,
                startY + len * rise,
                Math.sin(angle) * len
            );

            addBranch(from, to, this.trunkRadius * 0.35, this.trunkRadius * 0.12);
            branchTips.push(to);

            if (rnd() > 0.5) {
                const mid = from.clone().lerp(to, 0.6);
                const a2 = angle + (rnd() - 0.5) * 1.6;
                const to2 = new THREE.Vector3(
                    Math.cos(a2) * len * 0.8,
                    mid.y + len * 0.5,
                    Math.sin(a2) * len * 0.8
                );
                addBranch(mid, to2, this.trunkRadius * 0.16, this.trunkRadius * 0.06);
                branchTips.push(to2);
            }
        }

        // =============== COPA: CENTROS DE CLUSTER ===============
        const clusters = [...branchTips];
        const clusterCount = 10 + Math.floor(CR * 3);

        for (let i = 0; i < clusterCount; i++) {
            const theta = rnd() * Math.PI * 2;
            const phi = Math.acos(2 * rnd() - 1);
            const r = CR * (0.65 + rnd() * 0.4);
            clusters.push(new THREE.Vector3(
                r * Math.sin(phi) * Math.cos(theta),
                canopyCenterY + r * Math.cos(phi) * 0.85,
                r * Math.sin(phi) * Math.sin(theta)
            ));
        }

        // =============== HOJAS INSTANCIADAS ===============
        const canopy = new THREE.Group();
        canopy.position.set(0, canopyCenterY, 0);
        group.add(canopy);
        this._canopy = canopy;

        const leafGeo = this._leafGeometry(THREE, this.leafSize);
        const leaves = new THREE.InstancedMesh(leafGeo, leafMat, this.leafCount);
        leaves.castShadow = true;
        leaves.receiveShadow = true;

        const dummy = new THREE.Object3D();
        const baseColor = new THREE.Color(this.colors.leaf);
        const tmpColor = new THREE.Color();

        for (let i = 0; i < this.leafCount; i++) {
            let px, py, pz;

            if (i < this.leafCount * 0.75) {
                const c = clusters[Math.floor(rnd() * clusters.length)];
                const gr = () => (rnd() + rnd() + rnd() - 1.5) * 0.55;
                px = c.x + gr() * CR * 0.5;
                py = c.y + gr() * CR * 0.45;
                pz = c.z + gr() * CR * 0.5;
            } else {
                const theta = rnd() * Math.PI * 2;
                const phi = Math.acos(2 * rnd() - 1);
                const r = CR * (0.95 + rnd() * 0.15);
                px = r * Math.sin(phi) * Math.cos(theta);
                py = canopyCenterY + r * Math.cos(phi) * 0.85;
                pz = r * Math.sin(phi) * Math.sin(theta);
            }

            dummy.position.set(px, py - canopyCenterY, pz);
            dummy.rotation.set(rnd() * Math.PI * 2, rnd() * Math.PI * 2, rnd() * Math.PI * 2);
            dummy.scale.setScalar(0.75 + rnd() * 0.6);
            dummy.updateMatrix();
            leaves.setMatrixAt(i, dummy.matrix);

            tmpColor.copy(baseColor).offsetHSL(
                (rnd() - 0.5) * 0.07,
                (rnd() - 0.5) * this.colorVariation,
                (rnd() - 0.5) * this.colorVariation * 1.4
            );
            leaves.setColorAt(i, tmpColor);
        }

        leaves.instanceMatrix.needsUpdate = true;
        if (leaves.instanceColor) leaves.instanceColor.needsUpdate = true;
        canopy.add(leaves);

        // =============== HOJAS CAÍDAS ===============
        if (this.fallenLeaves) {
            const fallenCount = 70;
            const fallen = new THREE.InstancedMesh(leafGeo, leafMat, fallenCount);
            fallen.receiveShadow = true;

            for (let i = 0; i < fallenCount; i++) {
                const a = rnd() * Math.PI * 2;
                const r = CR * (0.3 + rnd() * 0.9);
                dummy.position.set(Math.cos(a) * r, 0.02 + rnd() * 0.02, Math.sin(a) * r);
                dummy.rotation.set(-Math.PI / 2 + (rnd() - 0.5) * 0.3, 0, rnd() * Math.PI * 2);
                dummy.scale.setScalar(0.8 + rnd() * 0.5);
                dummy.updateMatrix();
                fallen.setMatrixAt(i, dummy.matrix);

                tmpColor.copy(baseColor).offsetHSL(-0.03, -0.15, -0.12 - rnd() * 0.1);
                fallen.setColorAt(i, tmpColor);
            }
            fallen.instanceMatrix.needsUpdate = true;
            if (fallen.instanceColor) fallen.instanceColor.needsUpdate = true;
            group.add(fallen);
        }

        // =============== POSICIÓN FINAL ===============
        // IMPORTANTE: el tronco está centrado en el tile (this.x, this.y),
        // por lo que su posición en mundo es (this.x + 0.5, this.y + 0.5).
        // Esto coincide con _trunkCenterX/Y usado en occupies().
        group.position.set(this.x + 0.5, 0, this.y + 0.5);
        group.rotation.y = this.rotation ?? rnd() * Math.PI * 2;
        group.name = `Tree_${this.x}_${this.y}`;
        group.userData.worldObject = this;

        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }

    update(engine, delta = 0.016) {
        if (!this.visual || !this.sway || !this._canopy) return;
        const t = performance.now() / 1000 + this._phase;
        const k = this.swayIntensity;
        this._canopy.rotation.z = Math.sin(t * 0.9) * 0.022 * k;
        this._canopy.rotation.x = Math.cos(t * 0.7) * 0.016 * k;
    }

    destroy() {
        if (this.visual) {
            this.visual.removeFromParent();
            this.visual.traverse(child => {
                if (child.isMesh) {
                    child.geometry.dispose();
                    const mats = Array.isArray(child.material)
                        ? child.material : [child.material];
                    mats.forEach(m => { m.map?.dispose(); m.dispose(); });
                }
            });
            this.visual = null;
        }
        this._canopy = null;
        this.rendered = false;
        this.engine = null;
        super.destroy();
    }
}