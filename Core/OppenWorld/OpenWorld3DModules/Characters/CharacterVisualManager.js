//@ts-check

/**
 * Gestiona la representación visual 3D de personajes.
 * Usa coordenadas lógicas x/y del mapa y las proyecta a world x/z.
 */
export class CharacterVisualManager {
    /**
     * @param {any} engine
     */
    constructor(engine) {
        this.engine = engine;
        this.THREE = engine.THREE;
        /** @type {Map<any, {mesh: any, lastSource: any, width: number, height: number}>} */
        this.visuals = new Map();

        this.group = new this.THREE.Group();
        this.group.name = "CharacterWorldVisuals";
        engine.renderer.scene.add(this.group);
    }

    /**
     * @param {any} character
     */
    has(character) {
        return this.visuals.has(character);
    }

    /**
     * @param {any} character
     */
    ensure(character) {
        if (!character) return null;

        const existing = this.visuals.get(character);
        if (existing) return existing;

        const material = new this.THREE.MeshBasicMaterial({
            transparent: true,
            alphaTest: 0.01,
            depthWrite: false,
            side: this.THREE.DoubleSide,
            toneMapped: false
        });

        const geometry = new this.THREE.PlaneGeometry(1, 1);
        geometry.translate(0, 0.5, 0);

        const mesh = new this.THREE.Mesh(geometry, material);
        mesh.userData.character = character;
        mesh.name = `Char_${character.Name ?? "unknown"}`;

        this.group.add(mesh);

        const entry = {
            mesh,
            lastSource: null,
            width: 1,
            height: 1,
            indicator: null // 👈 NUEVO: Referencia al sprite indicador
        };

        this.visuals.set(character, entry);
        return entry;
    }
    /**
     * Muestra u oculta el indicador de interacción (ej: "[E]") sobre el personaje.
     * @param {any} character
     * @param {boolean} visible
     * @param {string} key - La tecla a mostrar (ej: "E")
     */
    setIndicator(character, visible, key = "E") {
        const entry = this.visuals.get(character);
        if (!entry) return;

        // Crear el indicador la primera vez que se necesita
        if (!entry.indicator) {
            const THREE = this.THREE;
            const c = document.createElement("canvas");
            c.width = c.height = 64;
            const ctx = c.getContext("2d");

            // Fondo oscuro redondeado
            ctx.fillStyle = "rgba(10,10,14,0.85)";
            ctx.beginPath(); ctx.roundRect(6, 6, 52, 52, 12); ctx.fill();

            // Borde blanco
            ctx.strokeStyle = "rgba(255,255,255,0.9)"; ctx.lineWidth = 3; ctx.stroke();

            // Texto de la tecla
            ctx.fillStyle = "#fff";
            ctx.font = "bold 32px sans-serif";
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText(key, 32, 34);

            const tex = new THREE.CanvasTexture(c);
            tex.colorSpace = THREE.SRGBColorSpace;

            const sp = new THREE.Sprite(new THREE.SpriteMaterial({
                map: tex,
                transparent: true,
                depthWrite: false,
                opacity: 0
            }));

            // Posición: centrado en X/Z, y justo por encima de la altura del personaje
            sp.scale.set(0.6, 0.6, 1);
            sp.position.set(0, entry.height + 0.4, 0);
            sp.userData.baseY = entry.height + 0.4;
            sp.visible = false;

            entry.mesh.add(sp); // Se añade como hijo del mesh del personaje
            entry.indicator = sp;
        }

        entry.indicator.visible = visible;
    }
    /**
    * Actualiza la animación de pulso de los indicadores visibles.
    * @param {number} dt
    */
    updateIndicators(dt) {
        const t = performance.now() / 1e3;
        for (const entry of this.visuals.values()) {
            if (entry.indicator && entry.indicator.visible) {
                // Efecto de pulso de opacidad y flotación suave
                entry.indicator.material.opacity = 0.7 + Math.sin(t * 5) * 0.3;
                entry.indicator.position.y = entry.indicator.userData.baseY + Math.sin(t * 3) * 0.05;
            }
        }
    }

    /**
     * Resuelve la imagen/frame actual del personaje.
     * @param {any} character
     */
    resolveSource(character) {
        if (!character) return null;

        const resolver = this.engine.options?.getCharacterTexture;
        let source = typeof resolver === "function"
            ? resolver(character)
            : null;

        if (source) return source;

        const state = character.state ?? "idle";

        let direction = character.direction ?? "down";

        if (typeof character._getValidDirection === "function") {
            try {
                direction = character._getValidDirection();
            } catch {
                direction = character.direction ?? "down";
            }
        }

        const frames =
            character.Sprites?.[state]?.[direction] ??
            character.Sprites?.idle?.[direction] ??
            character.Sprites?.[state]?.down ??
            character.Sprites?.idle?.down;

        if (Array.isArray(frames)) {
            const frame = Math.max(
                0,
                Math.min(
                    frames.length - 1,
                    character.animFrame ?? 0
                )
            );

            const img = frames[frame];

            if (img instanceof HTMLImageElement) {
                if (!img.complete || img.naturalWidth === 0) {
                    return null;
                }
            }

            return img ?? null;
        }

        if (frames instanceof HTMLImageElement) {
            if (!frames.complete || frames.naturalWidth === 0) {
                return null;
            }
        }

        return frames ?? null;
    }

    /**
     * Actualiza posición, textura y orientación del personaje.
     * @param {any} character
     * @param {{ visible?: boolean, height?: number, width?: number }} [options]
     */
    update(character, options = {}) {
        const entry = this.ensure(character);
        if (!entry) return;

        const visible = options.visible !== false;
        const source = visible ? this.resolveSource(character) : null;

        entry.mesh.visible = !!source;

        if (!source) return;

        if (source !== entry.lastSource) {
            const texture = this.engine.renderer.textureManager?.get(source);
            if (!texture) return;

            const image = texture.image;
            const imageWidth = image?.naturalWidth || image?.width || 3;
            const imageHeight = image?.naturalHeight || image?.height || 2;

            const aspect = imageWidth / imageHeight;

            const height =
                options.height ??
                this.engine.options?.npcHeight ??
                1.6;

            const width = options.width ?? height * aspect;

            entry.mesh.geometry.dispose();

            const geometry = new this.THREE.PlaneGeometry(width, height);
            geometry.translate(0, height / 2, 0);

            entry.mesh.geometry = geometry;
            entry.mesh.material.map = texture;
            entry.mesh.material.needsUpdate = true;

            entry.lastSource = source;
            entry.width = width;
            entry.height = height;
        }

        entry.mesh.position.set(
            character.x ?? 0,
            0,
            character.y ?? 0
        );

        const camera = this.engine.renderer.camera;

        const dx = camera.position.x - entry.mesh.position.x;
        const dz = camera.position.z - entry.mesh.position.z;

        entry.mesh.rotation.set(
            0,
            Math.atan2(dx, dz),
            0
        );
    }

    /**
     * @param {any} character
     */
    remove(character) {
        const entry = this.visuals.get(character);
        if (!entry) return;

        entry.mesh.removeFromParent();
        entry.mesh.geometry.dispose();
        entry.mesh.material.map?.dispose();
        entry.mesh.material.dispose();

        this.visuals.delete(character);
    }

    /**
     * Conserva solo los personajes indicados.
     * @param {Set<any>} keep
     */
    retainOnly(keep) {
        for (const [character] of [...this.visuals.entries()]) {
            if (!keep.has(character)) {
                this.remove(character);
            }
        }
    }

    clear() {
        for (const character of [...this.visuals.keys()]) {
            this.remove(character);
        }
    }

    dispose() {
        this.clear();
        this.group.removeFromParent();
    }
}