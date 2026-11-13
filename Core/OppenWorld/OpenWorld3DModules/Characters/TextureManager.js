
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

/**
 * Administra y reutiliza texturas de personajes.
 */
export class TextureManager {
    constructor() {
        this.cache = new Map();

        this.loader = new THREE.TextureLoader();
    }

    /**
     * Obtiene una textura existente o crea una nueva.
     *
     * Acepta:
     * - URL de imagen.
     * - HTMLImageElement.
     * - HTMLCanvasElement.
     * - ImageBitmap.
     * - THREE.Texture.
     *
     * @param {string | object} source
     * @returns {THREE.Texture | null}
     */
    get(source) {
        if (!source) return null;

        // Si ya es una textura Three.js, no la reconstruimos.
        if (source.isTexture) {
            return source;
        }

        // Reutilizar texturas previamente creadas.
        if (this.cache.has(source)) {
            return this.cache.get(source);
        }

        let texture;

        // Si es una URL, utilizar TextureLoader.
        if (typeof source === "string") {
            texture = this.loader.load(source);
        } else {
            // Si es una imagen, canvas o ImageBitmap.
            texture = new THREE.Texture(source);
            texture.needsUpdate = true;
        }

        // Configuración para sprites ilustrados.
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.generateMipmaps = true;

        texture.needsUpdate = true;

        this.cache.set(source, texture);

        return texture;
    }

    /**
     * Libera una textura específica.
     */
    remove(source) {
        const texture = this.cache.get(source);

        if (!texture) return;

        texture.dispose();
        this.cache.delete(source);
    }

    /**
     * Libera todas las texturas administradas.
     */
    dispose() {
        for (const texture of this.cache.values()) {
            texture.dispose();
        }

        this.cache.clear();
    }
}
