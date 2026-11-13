//@ts-check
// @ts-ignore
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";
import { CameraDirectionUtil } from "./CameraDirectionUtil.js";

// Los addons de Three.js se cargan de forma diferida (solo si se usa un modelo 3D).
// Así, si el CDN o el import map fallan, el sistema de sprites sigue funcionando.
const GLTF_LOADER_URL = "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/GLTFLoader.js";
const SKELETON_UTILS_URL = "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/utils/SkeletonUtils.js";

/** @type {Promise<any> | null} */
let gltfLoaderPromise = null;
/** @type {Promise<Function | null> | null} */
let skeletonClonePromise = null;

function loadGLTFLoader() {
    if (!gltfLoaderPromise) {
        gltfLoaderPromise = import(GLTF_LOADER_URL)
            .then((module) => module.GLTFLoader)
            .catch((error) => {
                gltfLoaderPromise = null;
                throw error;
            });
    }
    return gltfLoaderPromise;
}

function loadSkeletonClone() {
    if (!skeletonClonePromise) {
        skeletonClonePromise = import(SKELETON_UTILS_URL)
            .then((module) => module.clone ?? null)
            .catch(() => null);
    }
    return skeletonClonePromise;
}

/**
 * Configuración de un modelo 3D exportado desde Blender (.glb / .gltf).
 *
 * @typedef {Object} Model3DConfig
 * @property {string} url Ruta pública del archivo (ej: "Media/assets/models/hero.glb").
 * @property {number} [height] Altura final en unidades del mundo (por defecto la altura del personaje).
 * @property {number} [scale] Multiplicador extra de escala aplicado después del ajuste de altura.
 * @property {number} [yOffset] Desplazamiento vertical en unidades del mundo (para hundir/flotar el modelo).
 * @property {number} [rotationY] Giro correctivo en radianes si el modelo no mira hacia +Z.
 * @property {Object.<string, string>} [animations] Mapa estado -> nombre exacto del clip.
 * @property {boolean} [castShadow] Si el modelo proyecta sombra (true por defecto).
 */

/**
 * Nombres alternativos de clips usados por los estados del CharacterModel.
 * @type {Object.<string, string[]>}
 */
const ANIMATION_ALIASES = {
    idle: ["idle", "stand", "standing", "breathing", "wait", "quieto", "espera"],
    walk: ["walk", "walking", "run", "running", "move", "move_forward", "caminar", "correr"],
    attack: ["attack", "attack_1", "hit", "slash", "swing", "atacar"],
    battle: ["battle", "combat", "fight", "battle_idle", "combat_idle"],
    death: ["death", "die", "dying", "dead", "morir"]
};

/**
 * Instancia viva de un modelo 3D (una por personaje).
 */
export class Model3DInstance {
    /**
     * @param {Model3DManager} manager
     * @param {any} root
     * @param {any} model
     * @param {any} mixer
     * @param {Map<string, any>} actions
     * @param {Model3DConfig} config
     * @param {{width:number,height:number,depth:number}} size
     */
    constructor(manager, root, model, mixer, actions, config, size) {
        this.manager = manager;
        this.THREE = manager.THREE;
        this.root = root;
        this.model = model;
        this.mixer = mixer;
        this.actions = actions;
        this.config = config;
        this.width = size.width;
        this.height = size.height;
        this.depth = size.depth;
        /** @type {string | null} */
        this.currentClip = null;
        this.disposed = false;
    }

    /**
     * Reproduce el clip asociado al estado del personaje (idle, walk, attack...).
     * @param {string} [state]
     */
    setState(state = "idle") {
        if (!this.mixer || this.actions.size === 0) return;

        const clipName = this._resolveClipName(state);
        if (!clipName || clipName === this.currentClip) return;

        const next = this.actions.get(clipName);
        if (!next) return;

        const previous = this.currentClip
            ? this.actions.get(this.currentClip)
            : null;

        next.reset();
        next.enabled = true;
        next.setEffectiveTimeScale(1);
        next.setEffectiveWeight(1);
        next.play();

        if (previous && previous !== next && previous.isRunning()) {
            previous.crossFadeTo(next, 0.18, false);
            next.play();
        } else {
            next.fadeIn(0.15);
        }

        this.currentClip = clipName;
    }

    /**
     * @param {number} dt
     */
    update(dt) {
        if (!this.mixer || this.disposed) return;
        this.mixer.update(dt);
    }

    /**
     * @param {boolean} visible
     */
    setVisible(visible) {
        if (this.root) this.root.visible = visible !== false;
    }

    /**
     * Coloca el modelo en coordenadas de mundo (map.x -> world.x, map.y -> world.z).
     * @param {number} x
     * @param {number} z
     */
    setPosition(x, z) {
        if (!this.root) return;
        this.root.position.set(x ?? 0, 0, z ?? 0);
    }

    /**
     * Orienta el modelo hacia una dirección teniendo en cuenta la cámara.
     * @param {number} yaw
     * @param {number} [dt] Si es mayor que 0, interpola suavemente.
     */
    setYaw(yaw, dt = 0) {
        if (!this.root) return;

        if (dt > 0) {
            let delta = yaw - this.root.rotation.y;
            delta = Math.atan2(Math.sin(delta), Math.cos(delta));
            this.root.rotation.y += delta * Math.min(1, dt * 12);
        } else {
            this.root.rotation.y = yaw;
        }
    }

    dispose() {
        if (this.disposed) return;
        this.disposed = true;

        if (this.mixer) {
            this.mixer.stopAllAction();
            this.mixer.uncacheRoot(this.model);
        }

        this.root?.removeFromParent();
        this.manager.instances.delete(this);
    }

    /**
     * @param {string} state
     * @returns {string | null}
     */
    _resolveClipName(state) {
        const mapping = this.config?.animations ?? {};

        if (mapping[state]) {
            const explicit = this._findClipName(mapping[state]);
            if (explicit) return explicit;
        }

        const aliases = ANIMATION_ALIASES[state] ?? [state];
        for (const alias of aliases) {
            const found = this._findClipName(alias);
            if (found) return found;
        }

        return this._findClipName(state);
    }

    /**
     * @param {string | undefined | null} name
     * @returns {string | null}
     */
    _findClipName(name) {
        if (!name) return null;
        if (this.actions.has(name)) return name;

        const lower = String(name).toLowerCase();

        for (const key of this.actions.keys()) {
            if (key.toLowerCase() === lower) return key;
        }
        for (const key of this.actions.keys()) {
            if (key.toLowerCase().includes(lower)) return key;
        }

        return null;
    }
}

/**
 * Carga, cachea y clona modelos glTF/GLB exportados desde Blender.
 * Cada personaje recibe una instancia independiente con su propio AnimationMixer.
 */
export class Model3DManager {
    /**
     * @param {any} engine
     */
    constructor(engine) {
        this.engine = engine;
        this.THREE = engine?.THREE ?? THREE;

        /** @type {any | null} */
        this.loader = null;

        /** @type {Map<string, Promise<any>>} */
        this.cache = new Map();
        /** @type {Set<Model3DInstance>} */
        this.instances = new Set();
    }

    /**
     * Normaliza la propiedad `model3d` del CharacterModel.
     * Acepta un string (ruta) o un objeto de configuración.
     * @param {string | Model3DConfig | null | undefined} model3d
     * @returns {Model3DConfig | null}
     */
    normalizeConfig(model3d) {
        if (!model3d) return null;

        if (typeof model3d === "string") {
            return model3d.trim().length > 0 ? { url: model3d } : null;
        }

        if (typeof model3d === "object" && typeof model3d.url === "string" && model3d.url.length > 0) {
            return { ...model3d };
        }

        return null;
    }

    /**
     * Carga el glTF/GLB (cacheado por URL).
     * @param {string} url
     * @returns {Promise<any>}
     */
    async load(url) {
        if (!url) {
            throw new Error("Model3DManager: URL de modelo vacía.");
        }

        let cached = this.cache.get(url);
        if (!cached) {
            const GLTFLoader = await loadGLTFLoader();

            if (!this.loader) {
                this.loader = new GLTFLoader();
            }

            cached = this.loader.loadAsync(url).catch((error) => {
                this.cache.delete(url);
                throw error;
            });
            this.cache.set(url, cached);
        }

        return cached;
    }

    /**
     * Crea una instancia del modelo del personaje.
     * @param {any} character
     * @param {{ height?: number }} [options]
     * @returns {Promise<Model3DInstance>}
     */
    async create(character, options = {}) {
        const config = this.normalizeConfig(
            character?.getModel3DConfig?.() ?? character?.model3d
        );

        if (!config) {
            throw new Error("Model3DManager: el personaje no tiene un modelo 3D válido.");
        }

        const height = config.height ?? options.height ?? 3;

        const [gltf, cloneFn] = await Promise.all([
            this.load(config.url),
            loadSkeletonClone()
        ]);

        return this.createInstance(gltf, config, height, cloneFn);
    }

    /**
     * @param {any} gltf
     * @param {Model3DConfig} config
     * @param {number} targetHeight
     * @param {Function | null} [cloneFn] Clonador con esqueleto (SkeletonUtils.clone)
     * @returns {Model3DInstance}
     */
    createInstance(gltf, config, targetHeight, cloneFn = null) {
        const THREE = this.THREE;

        const root = new THREE.Group();
        root.name = `Model3D_${String(config.url).split("/").pop()}`;

        // Clonamos para que varios NPCs puedan usar el mismo .glb.
        const model = cloneFn
            ? cloneFn(gltf.scene)
            : gltf.scene.clone(true);

        root.add(model);

        // 1) Ajuste de escala según la altura pedida.
        const rawBox = new THREE.Box3().setFromObject(model);
        const rawSize = rawBox.getSize(new THREE.Vector3());
        const rawHeight = rawSize.y > 0 ? rawSize.y : 1;
        const fitScale = (targetHeight / rawHeight) * (config.scale ?? 1);
        model.scale.multiplyScalar(fitScale);

        // 2) Apoyar los pies en y = 0 y centrar el modelo en X/Z.
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.set(
            model.position.x - center.x,
            model.position.y - box.min.y + (config.yOffset ?? 0),
            model.position.z - center.z
        );

        // 3) Sombras y ajustes de malla.
        model.traverse((/** @type {any} */ object) => {
            if (!object.isMesh) return;
            object.castShadow = config.castShadow !== false;
            object.receiveShadow = false;
            // Los SkinnedMesh animados pueden salir del bounding box original.
            if (object.isSkinnedMesh) object.frustumCulled = false;
        });

        // 4) Animaciones.
        const mixer = new THREE.AnimationMixer(model);
        /** @type {Map<string, any>} */
        const actions = new Map();

        for (const clip of gltf.animations ?? []) {
            actions.set(clip.name, mixer.clipAction(clip));
        }

        const instance = new Model3DInstance(
            this,
            root,
            model,
            mixer,
            actions,
            config,
            {
                width: size.x || 1,
                height: size.y || targetHeight,
                depth: size.z || 1
            }
        );

        this.instances.add(instance);

        return instance;
    }

    /**
     * Calcula el giro (radianes) del modelo a partir de la dirección del personaje.
     * La dirección del CharacterModel es relativa a la cámara, por lo que se
     * proyecta al mundo antes de orientar el modelo.
     *
     * @param {any} character
     * @param {any} [camera]
     * @returns {number}
     */
    resolveYaw(character, camera) {
        const raw = character?.model3d;
        const offset =
            raw && typeof raw === "object" && typeof raw.rotationY === "number"
                ? raw.rotationY
                : 0;

        const direction = character?.direction ?? "down";

        if (camera && this.THREE) {
            try {
                const advance = CameraDirectionUtil.getWorldAdvance(
                    this.THREE,
                    camera,
                    direction
                );
                if (Math.abs(advance.x) > 1e-6 || Math.abs(advance.z) > 1e-6) {
                    return Math.atan2(advance.x, advance.z) + offset;
                }
            } catch (error) {
                // Sin cámara válida usamos la tabla cardinal.
            }
        }

        const fallback = {
            up: Math.PI,
            up_right: Math.PI * 0.75,
            right: Math.PI / 2,
            down_right: Math.PI / 4,
            down: 0,
            down_left: -Math.PI / 4,
            left: -Math.PI / 2,
            up_left: -Math.PI * 0.75
        };

        // @ts-ignore
        return (fallback[direction] ?? 0) + offset;
    }

    /**
     * ¿El personaje tiene un modelo 3D utilizable?
     * @param {any} character
     */
    hasModel(character) {
        if (!character) return false;

        if (typeof character.Is3DModel === "function") {
            try {
                return character.Is3DModel() === true;
            } catch {
                return false;
            }
        }

        return this.normalizeConfig(character.model3d) != null;
    }

    dispose() {
        for (const instance of [...this.instances]) {
            instance.dispose();
        }
        this.instances.clear();

        for (const gltfPromise of this.cache.values()) {
            gltfPromise
                .then((gltf) => this._disposeGltf(gltf))
                .catch(() => { /* la carga ya falló */ });
        }
        this.cache.clear();
    }

    /**
     * @param {any} gltf
     */
    _disposeGltf(gltf) {
        gltf?.scene?.traverse((/** @type {any} */ object) => {
            if (!object.isMesh) return;
            object.geometry?.dispose?.();
            const materials = Array.isArray(object.material)
                ? object.material
                : [object.material];
            for (const material of materials) {
                if (!material) continue;
                material.map?.dispose?.();
                material.normalMap?.dispose?.();
                material.dispose?.();
            }
        });
    }
}
