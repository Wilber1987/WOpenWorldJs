//@ts-check

/**
 * Convierte un vector de movimiento en coordenadas de MUNDO
 * (map.x -> world.x, map.y -> world.z) a una dirección de sprite
 * relativa a la pantalla de la cámara (4 u 8 vías).
 */
export class CameraDirectionUtil {
    // Vectores temporales reutilizables (evita GC por frame)
    static _movement = null;
    static _right = null;
    static _up = null;

    /**
     * @param {any} THREE
     * @param {any} camera
     * @param {number} dx  - delta en map.x (world.x)
     * @param {number} dy  - delta en map.y (world.z)
     * @param {string} fallback
     * @param {boolean} isFullPerspective
     * @returns {string}
     */
    static getRelativeDirection(THREE, camera, dx, dy, fallback, isFullPerspective) {
        if (!THREE || !camera) return fallback;

        if (!this._movement) {
            this._movement = new THREE.Vector3();
            this._right = new THREE.Vector3();
            this._up = new THREE.Vector3();
        }

        camera.updateMatrixWorld(true);

        this._movement.set(dx, 0, dy);
        if (this._movement.lengthSq() < 1e-8) return fallback;
        this._movement.normalize();

        // Eje horizontal de pantalla proyectado al suelo
        this._right.setFromMatrixColumn(camera.matrixWorld, 0);
        this._right.y = 0;
        if (this._right.lengthSq() < 1e-8) return fallback;
        this._right.normalize();

        // Eje vertical de pantalla proyectado al suelo
        this._up.setFromMatrixColumn(camera.matrixWorld, 1);
        this._up.y = 0;
        if (this._up.lengthSq() < 1e-8) this._up.set(0, 0, -1);
        else this._up.normalize();

        const horizontal = this._movement.dot(this._right);
        const vertical = this._movement.dot(this._up);
        const angle = Math.atan2(horizontal, vertical); // 0 = arriba de pantalla

        if (isFullPerspective) {
            const names = [
                "up", "up_right", "right", "down_right",
                "down", "down_left", "left", "up_left"
            ];
            const idx = Math.round(angle / (Math.PI / 4));
            return names[((idx % 8) + 8) % 8];
        }

        const names = ["up", "right", "down", "left"];
        const idx = Math.round(angle / (Math.PI / 2));
        return names[((idx % 4) + 4) % 4];
    }

    /**
 * Vector de AVANCE en mundo (map.x, map.z) para una dirección relativa a cámara.
 * @param {any} THREE
 * @param {any} camera
 * @param {string} direction
 * @returns {{x:number, z:number}}
 */
    static getWorldAdvance(THREE, camera, direction) {
        camera.updateMatrixWorld(true);

        const sr = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
        sr.y = 0;
        if (sr.lengthSq() < 1e-8) return { x: 0, z: -1 };
        sr.normalize();

        const su = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
        su.y = 0;
        if (su.lengthSq() < 1e-8) su.set(0, 0, -1);
        else su.normalize();

        // [horizontal, vertical] en pantalla (up = +v)
        const ADVANCE = {
            up: [0, 1],
            up_right: [.707, .707],
            right: [1, 0],
            down_right: [.707, -.707],
            down: [0, -1],
            down_left: [-.707, -.707],
            left: [-1, 0],
            up_left: [-.707, .707]
        };

        const a = ADVANCE[direction] ?? ADVANCE.down;
        return {
            x: sr.x * a[0] + su.x * a[1],
            z: sr.z * a[0] + su.z * a[1]
        };
    }

    /**
     * Offset "detrás" en mundo = -avance * distancia.
     * @param {any} THREE
     * @param {any} camera
     * @param {string} direction
     * @param {number} distance
     */
    static getWorldBehind(THREE, camera, direction, distance) {
        const a = this.getWorldAdvance(THREE, camera, direction);
        return { x: -a.x * distance, z: -a.z * distance };
    }
}