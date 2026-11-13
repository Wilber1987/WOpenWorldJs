import { WorldObject } from "../WorldObjectModels.js";

/**
 * Opciones de configuración para Bush.
 *
 * @typedef {Object} BushOptions
 * @property {number}  [height=1.1]                 - Altura del arbusto.
 * @property {number}  [radius=0]                   - Radio de la copa (0 = automático: height * 0.65).
 * @property {"round"|"cone"|"box"} [shape="round"] - Forma del arbusto (topiario).
 * @property {number}  [leafCount=0]                - Nº de hojas (0 = según quality).
 * @property {number}  [leafSize=0.16]              - Tamaño de cada hoja.
 * @property {"low"|"medium"|"high"} [quality="high"] - Preset de resolución.
 * @property {number}  [leafColor=0x3f7a33]         - Color base del follaje.
 * @property {number}  [colorVariation=0.18]        - Variación de tono entre hojas.
 * @property {number}  [flowerColor=null]           - Color de flores (null = sin flores).
 * @property {number}  [flowerCount=40]             - Nº de flores si flowerColor está definido.
 * @property {number}  [collisionRadius=0.3]        - Radio de colisión de la base.
 * @property {boolean} [blocks=true]                - Si bloquea movimiento (false = decorativo).
 * @property {boolean} [sway=true]                  - Balanceo suave con el viento.
 * @property {number}  [swayIntensity=1]            - Multiplicador del balanceo.
 * @property {number}  [seed]                       - Semilla fija para arbustos reproducibles.
 * @property {string}  [name="Bush"]
 */

const BUSH_QUALITY = {
    low:    { leaves: 260 },
    medium: { leaves: 520 },
    high:   { leaves: 900 }
};

export class Bush extends WorldObject {
    constructor(x, y, options = {}) {
        //_bbox mínima: la colisión real la calcula occupies() de forma circular
        super(x, y, 1, 1, options);

        this.name = options.name ?? "Bush";

        this.height = options.height ?? 1.1;
        this.radius = options.radius ?? this.height * 0.65;
        this.shape = options.shape ?? "round";

        this.quality = options.quality ?? "high";
        this.leafCount = options.leafCount || BUSH_QUALITY[this.quality].leaves;
        this.leafSize = options.leafSize ?? 0.16;

        this.colors = {
            leaf: options.leafColor ?? 0x3f7a33,
            flower: options.flowerColor ?? null,
            stem: options.stemColor ?? 0x5d4028
        };
        this.colorVariation = options.colorVariation ?? 0.18;
        this.flowerCount = options.flowerCount ?? 40;

        // Colisión: solo la base del arbusto (misma lógica que Tree)
        this.collisionRadius = options.collisionRadius ?? 0.3;
        this._centerX = this.x + 0.5;
        this._centerY = this.y + 0.5;

        this.sway = options.sway ?? true;
        this.swayIntensity = options.swayIntensity ?? 1;

        this.seed = options.seed ?? Math.floor(Math.random() * 1e9);
        this._phase = (this.seed % 1000) / 1000 * Math.PI * 2;
    }

    // --------------------------------------------------
    // COLISIÓN CIRCULAR (solo la base, igual que Tree)
    // --------------------------------------------------
    occupies(tx, ty) {
        if (!this.blocksMovement) return false;

        const tileMinX = tx, tileMaxX = tx + 1;
        const tileMinY = ty, tileMaxY = ty + 1;

        const closestX = Math.max(tileMinX, Math.min(this._centerX, tileMaxX));
        const closestY = Math.max(tileMinY, Math.min(this._centerY, tileMaxY));

        const dx = closestX - this._centerX;
        const dy = closestY - this._centerY;

        return dx * dx + dy * dy <= this.collisionRadius * this.collisionRadius;
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

    // --------------------------------------------------
    // GEOMETRÍAS
    // --------------------------------------------------
    _leafGeometry(THREE, size) {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.bezierCurveTo(size * 0.55, size * 0.3, size * 0.5, size * 1.0, 0, size * 1.5);
        shape.bezierCurveTo(-size * 0.5, size * 1.0, -size * 0.55, size * 0.3, 0, 0);
        const geo = new THREE.ShapeGeometry(shape, 5);
        geo.translate(0, -size * 0.75, 0);
        return geo;
    }

    // Muestrea un punto sobre la superficie según la forma del arbusto
    _samplePoint(rnd, R, H) {
        if (this.shape === "cone") {
            const t = Math.pow(rnd(), 0.65);              // más denso en la base
            const y = 0.08 + t * (H - 0.08);
            const ringR = R * (1 - t * 0.88) * (0.85 + rnd() * 0.3);
            const a = rnd() * Math.PI * 2;
            return [Math.cos(a) * ringR, y, Math.sin(a) * ringR];
        }

        if (this.shape === "box") {
            const hw = R * 0.85;
            const y0 = 0.10, y1 = H;
            const face = Math.floor(rnd() * 5);          // 4 laterales + topo
            if (face === 4) {
                return [(rnd() * 2 - 1) * hw, y1 - rnd() * 0.08, (rnd() * 2 - 1) * hw];
            }
            const u = (rnd() * 2 - 1) * hw;
            const y = y0 + rnd() * (y1 - y0) * 0.96;
            if (face === 0) return [hw, y, u];
            if (face === 1) return [-hw, y, u];
            if (face === 2) return [u, y, hw];
            return [u, y, -hw];
        }

        // "round": cascarón elipsoidal
        const theta = rnd() * Math.PI * 2;
        const phi = Math.acos(2 * rnd() - 1);
        const r = R * (0.72 + rnd() * 0.33);
        const y = Math.max(H * 0.52 + r * Math.cos(phi) * 0.88, 0.08);
        return [
            r * Math.sin(phi) * Math.cos(theta),
            y,
            r * Math.sin(phi) * Math.sin(theta)
        ];
    }

    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------
    render(engine) {
        if (this.rendered) return;

        const THREE = engine.THREE;
        const rnd = this._rng();
        const group = new THREE.Group();

        const H = this.height;
        const R = this.radius;

        const leafMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            roughness: 0.85,
            metalness: 0.0
        });

        const stemMat = new THREE.MeshStandardMaterial({
            color: this.colors.stem,
            roughness: 0.95
        });

        // =============== TALLOS (solo forma redonda) ===============
        if (this.shape === "round") {
            const stemCount = 3 + Math.floor(rnd() * 3);
            const up = new THREE.Vector3(0, 1, 0);
            for (let i = 0; i < stemCount; i++) {
                const a = (i / stemCount) * Math.PI * 2 + rnd() * 0.8;
                const len = H * (0.35 + rnd() * 0.25);
                const tilt = 0.25 + rnd() * 0.3;

                const dir = new THREE.Vector3(
                    Math.cos(a) * tilt, 1, Math.sin(a) * tilt
                ).normalize();

                const geo = new THREE.CylinderGeometry(0.015, 0.035, len, 6, 1, true);
                geo.translate(0, len / 2, 0);
                const stem = new THREE.Mesh(geo, stemMat);
                stem.position.set(Math.cos(a) * 0.05, 0, Math.sin(a) * 0.05);
                stem.quaternion.setFromUnitVectors(up, dir);
                stem.castShadow = true;
                group.add(stem);
            }
        } else {
            // Base leñosa discreta para topiarios
            const base = new THREE.Mesh(
                new THREE.CylinderGeometry(R * 0.18, R * 0.26, 0.12, 8),
                stemMat
            );
            base.position.y = 0.06;
            base.castShadow = true;
            group.add(base);
        }

        // =============== HOJAS INSTANCIADAS ===============
        // Pivote de balanceo en la base (un arbusto se mece desde el suelo)
        const canopy = new THREE.Group();
        canopy.position.set(0, 0.05, 0);
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
            const [px, py, pz] = this._samplePoint(rnd, R, H);

            dummy.position.set(px, py - 0.05, pz);
            dummy.rotation.set(
                rnd() * Math.PI * 2,
                rnd() * Math.PI * 2,
                rnd() * Math.PI * 2
            );
            dummy.scale.setScalar(0.75 + rnd() * 0.55);
            dummy.updateMatrix();
            leaves.setMatrixAt(i, dummy.matrix);

            tmpColor.copy(baseColor).offsetHSL(
                (rnd() - 0.5) * 0.06,
                (rnd() - 0.5) * this.colorVariation,
                (rnd() - 0.5) * this.colorVariation * 1.5
            );
            leaves.setColorAt(i, tmpColor);
        }

        leaves.instanceMatrix.needsUpdate = true;
        if (leaves.instanceColor) leaves.instanceColor.needsUpdate = true;
        canopy.add(leaves);

        // =============== FLORES OPCIONALES ===============
        if (this.colors.flower) {
            const flowerGeo = new THREE.IcosahedronGeometry(this.leafSize * 0.35, 0);
            const flowerMat = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.6,
                emissive: this.colors.flower,
                emissiveIntensity: 0.12
            });
            const flowers = new THREE.InstancedMesh(flowerGeo, flowerMat, this.flowerCount);
            flowers.castShadow = true;

            const flowerBase = new THREE.Color(this.colors.flower);

            for (let i = 0; i < this.flowerCount; i++) {
                // Ligeramente por fuera del follaje para que sean visibles
                const [px, py, pz] = this._samplePoint(rnd, R, H);
                const push = 1.06;
                dummy.position.set(px * push, py - 0.05 + 0.02, pz * push);
                dummy.rotation.set(rnd() * Math.PI, rnd() * Math.PI, 0);
                dummy.scale.setScalar(0.8 + rnd() * 0.6);
                dummy.updateMatrix();
                flowers.setMatrixAt(i, dummy.matrix);

                tmpColor.copy(flowerBase).offsetHSL(
                    (rnd() - 0.5) * 0.04,
                    (rnd() - 0.5) * 0.15,
                    (rnd() - 0.5) * 0.2
                );
                flowers.setColorAt(i, tmpColor);
            }

            flowers.instanceMatrix.needsUpdate = true;
            if (flowers.instanceColor) flowers.instanceColor.needsUpdate = true;
            canopy.add(flowers);
        }

        // =============== POSICIÓN FINAL ===============
        // Centrado en su tile, coherente con occupies()
        group.position.set(this.x + 0.5, 0, this.y + 0.5);
        group.rotation.y = this.rotation ?? rnd() * Math.PI * 2;
        group.name = `Bush_${this.x}_${this.y}`;
        group.userData.worldObject = this;

        engine.renderer.scene.add(group);

        this.AsingProps(group, engine, true);
    }

    // --------------------------------------------------
    // BALANCEO (pivote en la base)
    // --------------------------------------------------
    update(engine, delta = 0.016) {
        if (!this.visual || !this.sway || !this._canopy) return;
        const t = performance.now() / 1000 + this._phase;
        const k = this.swayIntensity;
        this._canopy.rotation.z = Math.sin(t * 1.3) * 0.015 * k;
        this._canopy.rotation.x = Math.cos(t * 1.1) * 0.011 * k;
    }

    // --------------------------------------------------
    // DESTROY
    // --------------------------------------------------
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