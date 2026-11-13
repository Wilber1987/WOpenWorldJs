
 // @ts-check

import { WorldObject } from "../WorldObjectModels.js";


/**
 * Caja 3D de prueba para el sistema de oclusión.
 * Las coordenadas lógicas X/Y se convierten a X/Z.
 */
export class Box extends WorldObject {
    constructor({
        x = 10,
        y = 10,
        width = 2,
        height = 2,
        depth = 2,
        color = 0x996633,
        blocksMovement = true
    } = {}) {
        super()
        this.x = x;
        this.y = y;

        this.width = width;
        this.height = height;
        this.depth = depth;

        // Compatibilidad con el sistema de GameMap.
        this.w = width;
        this.h = depth;

        this.color = color;
        this.blocksMovement = blocksMovement;

        this.visual = null;
        this.rendered = false;
        this.engine = null;
    }

    /**
     * Colisión lógica sobre el plano X/Y del mapa.
     */
    occupies(tx, ty) {
        if (!this.blocksMovement) return false;

        return (
            tx >= this.x &&
            tx < this.x + this.width &&
            ty >= this.y &&
            ty < this.y + this.depth
        );
    }

    /**
     * Construye la representación visual 3D.
     */
    render(engine) {
        if (this.rendered) return;

        const THREE = engine.THREE;

        const geometry = new THREE.BoxGeometry(
            this.width,
            this.height,
            this.depth
        );

        const material = new THREE.MeshStandardMaterial({
            color: this.color,
            roughness: 0.85,
            metalness: 0
        });

        const mesh = new THREE.Mesh(geometry, material);

        // Centro geométrico de la caja.
        mesh.position.set(
            this.x + this.width / 2,
            this.height / 2,
            this.y + this.depth / 2
        );

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        mesh.name = "WorldBox";
        mesh.userData.worldObject = this;

        engine.renderer.scene.add(mesh);

        this.AsingProps(mesh, engine, true);
    }

    /**
     * Elimina la representación visual.
     */
    destroy() {
        if (this.visual) {
            this.visual.removeFromParent();

            this.visual.geometry.dispose();

            const materials = Array.isArray(this.visual.material)
                ? this.visual.material
                : [this.visual.material];

            materials.forEach(material => material.dispose());

            this.visual = null;
        }

        this.rendered = false;
        this.engine = null;
    }
}
