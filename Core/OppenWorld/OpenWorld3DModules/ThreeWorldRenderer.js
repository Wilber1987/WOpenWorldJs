//@ts-check
// @ts-ignore
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";
import { TextureManager } from "./Characters/TextureManager.js";
import { Model3DManager } from "./Characters/Model3DManager.js";
/**
 * Renderer 3D inicial. El plano del mapa usa X/Z:
 * - map.x -> world.x
 * - map.y -> world.z
 * - world.y -> altura
 */
export class ThreeWorldRenderer {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {{ cameraHeight?: number; background?: any; cameraPitchDegrees?: any; cameraDistance?: any; cameraFov?: any; minCameraZoom?: any; maxCameraZoom?: any; cameraZoom?: any; }} options
     */
    constructor(canvas, options) {
        this.THREE = THREE
        this.canvas = canvas;
        this.options = options;
        this.objectVisuals = new Map();
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(options.background ?? "#87a9bd");
        this.textureManager = new TextureManager();

        // 🧊 Gestor de modelos 3D exportados desde Blender (glTF/GLB).
        this.model3d = new Model3DManager(this);

        /** @type {import("./Characters/Model3DManager.js").Model3DInstance | null} */
        this.playerModel = null;
        /** @type {string | null} */
        this._playerModelKey = null;
        this._playerModelToken = 0;
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: false,
            depth: true,
            powerPreference: "high-performance"
        });
        this.renderer.autoClear = true;
        this.renderer.sortObjects = true;
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        // Rotación orbital completa.
        this.cameraYaw = Math.PI / 4;

        // Inclinación respecto al plano del suelo.
        // 58 grados = vista elevada.
        // 10 grados = vista cercana al horizonte.
        this.cameraPitch = THREE.MathUtils.degToRad(
            options.cameraPitchDegrees ?? 58
        );

        // Rotación sobre el eje frontal de la cámara.
        this.cameraRoll = 0;

        this.cameraDistance = options.cameraDistance ?? 24;

        // Cámara de perspectiva real.
        this.camera = new THREE.PerspectiveCamera(
            options.cameraFov ?? 55,
            1,
            0.1,
            3000
        );

        // Rotación orbital completa.
        this.cameraYaw = Math.PI / 4;

        // Inclinación respecto al plano del suelo.
        // 58 grados = vista elevada.
        // 10 grados = vista cercana al horizonte.
        this.cameraPitch = THREE.MathUtils.degToRad(
            options.cameraPitchDegrees ?? 58
        );

        // Rotación sobre el eje frontal de la cámara.
        this.cameraRoll = 0;

        // Altura a la que enfoca la cámara cuando el zoom es máximo.
        // Debe ser aprox. la mitad de la altura del sprite (playerHeight / 2).
        this.focusHeightAtMaxZoom = options.focusHeightAtMaxZoom ?? 1.8;

        // Desde qué zoom empieza a subir el foco (1 = zoom por defecto).
        this.focusStartZoom = options.focusStartZoom ?? 1.5;

        // Altura actual suavizada del foco.

        this._focusHeight = 0;
        this.minCameraZoom = options.minCameraZoom ?? 2;
        this.maxCameraZoom = options.maxCameraZoom ?? 10;

        this.camera.zoom = options.cameraZoom ?? this.minCameraZoom;

         // Orbita esférica alrededor del objetivo: yaw controla el giro horizontal.
        // Orientación inicial de la cámara.
        // Inclinación desde el horizonte.
        // 58 grados ofrece una vista 3/4 más clara.
        this.cameraYaw = THREE.MathUtils.degToRad(0);
        this.cameraPitch = THREE.MathUtils.degToRad(25);
        this.cameraRoll = THREE.MathUtils.degToRad(0);

        this.cameraDistance = options.cameraDistance ?? 24;


       
        this.camera.updateProjectionMatrix();

        // this.scene.add(new THREE.HemisphereLight(0xffffff, 0x59634b, 2));
        //const sun = new THREE.DirectionalLight(0xffffff, 2.2);

        // Iluminación principal del mundo.
        this.ambientLight = new THREE.HemisphereLight(
            0xffffff,
            0x59634b,
            1.8
        );

        this.sunLight = new THREE.DirectionalLight(
            0xffffff,
            2.2
        );

        this._sunDir = new THREE.Vector3(0, 1, 0);
        this._setupSunShadows();
        this._createPlayerShadow();
        this.scene.fog = new THREE.Fog(0x87a9bd, 35, 140);

        this.sunLight.position.set(10, 20, 8);

        this.scene.add(
            this.ambientLight,
            this.sunLight
        );

        this.lightingKeys = [
            {
                hour: 8, ambient: 0.90, sun: 2.4, ambientColor: "#dfe9ff", groundColor: "#6a6a4a",
                sunColor: "#ffe2b8", skyColor: "#87a9bd", skyMix: 0
            },

            {
                hour: 12, ambient: 0.85, sun: 3.0, ambientColor: "#cfe1ff", groundColor: "#5f6347",
                sunColor: "#fff4e0", skyColor: "#87a9bd", skyMix: 0
            },

            {
                hour: 15, ambient: 0.80, sun: 2.7, ambientColor: "#d8e4ff", groundColor: "#665f48",
                sunColor: "#ffe3b0", skyColor: "#91a6bd", skyMix: 0.05
            },

            {
                hour: 17, ambient: 0.70, sun: 1.8, ambientColor: "#f0c9a8", groundColor: "#6e5445",
                sunColor: "#ffa563", skyColor: "#d99a70", skyMix: 0.45
            }, {
                hour: 19, ambient: 0.35, sun: 0.05, ambientColor: "#596b91", groundColor: "#202c48", sunColor: "#7186c2", skyColor: "#17233e", skyMix: 1
            },
            {
                hour: 21, ambient: 0.22, sun: 0, ambientColor: "#34415e", groundColor: "#141e34", sunColor: "#465a86", skyColor: "#0b1428", skyMix: 1
            },
            {
                hour: 24, ambient: 0.18, sun: 0, ambientColor: "#24304b", groundColor: "#10182b", sunColor: "#34466c", skyColor: "#07101f", skyMix: 1
            }
        ];


        // Convertir los colores a THREE.Color una sola vez
        for (const key of this.lightingKeys) {
            key.ambientColor = new THREE.Color(key.ambientColor);
            key.groundColor = new THREE.Color(key.groundColor);
            key.sunColor = new THREE.Color(key.sunColor);
            key.skyColor = new THREE.Color(key.skyColor);
        }

        this._tempSkyColor = new THREE.Color();

        // Luz localizada alrededor del personaje.
        // Ilumina los objetos cercanos que utilizan materiales
        // compatibles con iluminación.
        this.characterAreaLight = new THREE.PointLight(
            0xffffff, 0, 7, 2
        );

        this.characterAreaLight.position.set(0, 2.5, 0);

        this.scene.add(this.characterAreaLight);


        //#region Objeto visible del sol TODO OCULTAR DESPUES SI NO HAY SOL ACTIVO
        this.sunDistance = 45;
        this._createSunObjects();
        //#endregion

        // Colores base para interpolación día/noche.
        this.daySkyColor = new THREE.Color("#87a9bd");
        this.nightSkyColor = new THREE.Color("#101b35");

        this.dayAmbientColor = new THREE.Color("#ffffff");
        this.nightAmbientColor = new THREE.Color("#8296c4");

        this.dayGroundColor = new THREE.Color("#59634b");
        this.nightGroundColor = new THREE.Color("#202c48");

        this.daySunColor = new THREE.Color("#fff3d6");
        this.nightSunColor = new THREE.Color("#7186c2");

        this.nightFactor = 0;

        //sun.position.set(10, 20, 8);
        //this.scene.add(sun);

        /** @type {THREE.Group | null} */
        this.worldGroup = null;
        /** @type {THREE.Mesh | null} */
        this.ground = null;
        /** @type {THREE.Sprite | null} */
        this.playerSprite = null;
        /** @type {THREE.Texture | null} */
        this.playerTexture = null;
        this.mapSize = { width: 1, height: 1 };
        this.target = new THREE.Vector3();
       
        this._resizeObserver = new ResizeObserver(() => this.resize());
        this._resizeObserver.observe(canvas.parentElement ?? canvas);
        this.resize();
    }

    resize() {
        const rect = (
            this.canvas.parentElement ?? this.canvas
        ).getBoundingClientRect();

        const width = Math.max(1, Math.floor(rect.width));
        const height = Math.max(1, Math.floor(rect.height));

        this.renderer.setSize(width, height, false);

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    /**
     * Construye únicamente el suelo y una cuadrícula de referencia.
     * @param {{w:number,h:number,bgColor?:string}} map
     */
    setMap(map) {
        this.clearWorld();
        this.mapSize = { width: map.w, height: map.h };
        this._currentMapBackground = new THREE.Color(
            map.bgColor ?? "#87a9bd"
        );
        this.scene.background.copy(this._currentMapBackground);
        const group = new THREE.Group();
        group.name = "OpenWorld3D";
        const geometry = new THREE.PlaneGeometry(map.w, map.h);

        const groundTex = this._createGroundTexture();
        groundTex.repeat.set(map.w / 8, map.h / 8);

        const material = new THREE.MeshStandardMaterial({
            map: groundTex,
            color: 0xffffff,   // el color ya viene en la textura
            roughness: 1,
            metalness: 0
        });
        // const material = new THREE.MeshStandardMaterial({
        //     color: 0x719b58,
        //     roughness: 1,
        //     metalness: 0
        // });
        const ground = new THREE.Mesh(geometry, material);
        ground.rotation.x = -Math.PI / 2;
        ground.position.set(map.w / 2, 0, map.h / 2);
        ground.receiveShadow = true;
        group.add(ground);
        this.ground = ground;




        // Cuadrícula con dimensiones reales.
        // Cada celda representa una unidad del mapa.
        const gridPoints = [];
        const tileSize = 1;

        // Líneas paralelas al eje Z.
        for (let x = 0; x <= map.w; x += tileSize) {
            gridPoints.push(
                new THREE.Vector3(x, 0.018, 0),
                new THREE.Vector3(x, 0.018, map.h)
            );
        }

        // Líneas paralelas al eje X.
        for (let z = 0; z <= map.h; z += tileSize) {
            gridPoints.push(
                new THREE.Vector3(0, 0.018, z),
                new THREE.Vector3(map.w, 0.018, z)
            );
        }

        const gridGeometry = new THREE.BufferGeometry()
            .setFromPoints(gridPoints);

        const gridMaterial = new THREE.LineBasicMaterial({
            color: 0x40583a,
            transparent: true,
            opacity: 0.55
        });

        const grid = new THREE.LineSegments(
            gridGeometry,
            gridMaterial
        );

        grid.name = "WorldGrid";
        grid.visible = false;
        group.add(grid);


        this.worldGroup = group;
        this.scene.add(group);
        this.target.set(map.w / 2, 0, map.h / 2);
        this.updateCameraPose();
    }

    /**
     * Acepta HTMLImageElement, HTMLCanvasElement o THREE.Texture.(el any es la texture)
     * @param {HTMLImageElement|HTMLCanvasElement|any|null|undefined} source
     * @param {number} width
     * @param {number} height
     */

    setPlayerSprite(source, width = 2, height = 3) {
        const THREE = this.THREE;

        const texture = this.textureManager.get(source);
        if (!texture) return;

        const image = texture.image;
        const imageWidth = image?.naturalWidth || image?.width || 1;
        const imageHeight = image?.naturalHeight || image?.height || 1;

        const aspectRatio = imageWidth / imageHeight;
        const spriteHeight = height;
        const spriteWidth = spriteHeight * aspectRatio;

        if (!this.playerSprite) {
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                alphaTest: 0.01,
                depthTest: true,
                depthWrite: false,
                side: THREE.DoubleSide,
                toneMapped: false
            });

            const geometry = new THREE.PlaneGeometry(
                spriteWidth,
                spriteHeight
            );

            // El origen del plano queda en los pies.
            geometry.translate(0, spriteHeight / 2, 0);

            this.playerSprite = new THREE.Mesh(geometry, material);
            this.playerSprite.name = "PlayerVisual";

            this.scene.add(this.playerSprite);
        } else {
            this.playerSprite.geometry.dispose();

            const geometry = new THREE.PlaneGeometry(
                spriteWidth,
                spriteHeight
            );

            geometry.translate(0, spriteHeight / 2, 0);

            this.playerSprite.geometry = geometry;
            this.playerSprite.material.map = texture;
            this.playerSprite.material.needsUpdate = true;
        }

        this.playerSprite.position.y = 0;
        this.playerSprite.visible = true;

        this.updatePlayerBillboard();
    }


    updatePlayerBillboard() {
        if (!this.playerSprite) return;

        const dx = this.camera.position.x - this.playerSprite.position.x;
        const dz = this.camera.position.z - this.playerSprite.position.z;

        // Solo gira horizontalmente.
        // El personaje permanece siempre vertical.
        this.playerSprite.rotation.set(
            0,
            Math.atan2(dx, dz),
            0
        );
    }

    /**
     * Carga (o reutiliza) el modelo 3D del jugador y oculta el sprite.
     * Si la carga falla, el sprite sigue mostrándose.
     *
     * @param {any} character
     * @param {{ height?: number }} [options]
     * @returns {Promise<import("./Characters/Model3DManager.js").Model3DInstance | null>}
     */
    async loadPlayerModel(character, options = {}) {
        const config = this.model3d.normalizeConfig(
            character?.getModel3DConfig?.() ?? character?.model3d
        );

        if (!config?.url) return null;

        const height = config.height ?? options.height ?? 3;
        const key = `${config.url}|${height}`;

        if (this.playerModel && this._playerModelKey === key) {
            return this.playerModel;
        }

        this._playerModelKey = key;
        const token = ++this._playerModelToken;

        this._disposePlayerModel();

        try {
            const instance = await this.model3d.create(character, { height });

            // Otra carga (o un cambio a sprite) ocurrió mientras se descargaba.
            if (token !== this._playerModelToken) {
                instance.dispose();
                return null;
            }

            this.playerModel = instance;
            this.scene.add(instance.root);

            if (this.playerSprite) {
                this.playerSprite.visible = false;
            }

            return instance;
        } catch (error) {
            console.warn(
                "⚠️ No se pudo cargar el modelo 3D del jugador; se usará el sprite.",
                error
            );

            if (token === this._playerModelToken) {
                this._playerModelKey = null;
            }

            return null;
        }
    }

    /**
     * Elimina el modelo 3D actual del jugador y vuelve a permitir el sprite.
     */
    clearPlayerModel() {
        this._playerModelToken++;
        this._playerModelKey = null;
        this._disposePlayerModel();
    }

    _disposePlayerModel() {
        if (!this.playerModel) return;
        this.playerModel.dispose();
        this.playerModel = null;
    }

    /**
     * @param {{x:number,y:number,direction?:string,state?:string,Stats?:any}} position
     * @param {{x:number,y:number,z?:number}} [cameraTarget]
     * @param {number} [dt]
     */

    updatePlayer(position, cameraTarget, dt = 1 / 60) {
        // 🧊 Modelo 3D del jugador (si existe).
        if (this.playerModel) {
            this.playerModel.setPosition(position.x, position.y);
            this.playerModel.setYaw(
                this.model3d.resolveYaw(position, this.camera),
                dt
            );
            this.playerModel.setState(position.state ?? "idle");
            this.playerModel.setVisible((position.Stats?.hp ?? 1) > 0);
            this.playerModel.update(dt);
        }

        if (this.playerSprite) {
            this.playerSprite.position.set(
                position.x,
                0,
                position.y
            );

            // El modelo 3D sustituye al sprite del jugador.
            if (this.playerModel) {
                this.playerSprite.visible = false;
            }
        }

        const target = cameraTarget
            ? new THREE.Vector3(
                cameraTarget.x,
                cameraTarget.y,
                cameraTarget.z ?? cameraTarget.y
            )
            : new THREE.Vector3(position.x, 0, position.y);

        this.target.lerp(target, 0.14);

        this.updateCameraPose();

        if (this.playerShadow) {
            const k = 0.5 / Math.max(this._sunDir.y, 0.25); // más larga con sol bajo
            this.playerShadow.position.set(
                position.x - this._sunDir.x * k * 0.5,
                0.03,
                position.y - this._sunDir.z * k * 0.5
            );
        }
        // Importante: orientar después de actualizar la cámara.
        this.updatePlayerBillboard();
        this.updateCharacterAreaLight(position);
    }


    /**
 * Modifica los tres ejes de orientación.
 *
 * yaw: giro horizontal.
 * pitch: inclinación vertical.
 * roll: rotación sobre el eje frontal.
 */
    rotateCamera(deltaYaw = 0, deltaPitch = 0, deltaRoll = 0) {
        this.cameraYaw += deltaYaw;

        // Evitamos atravesar los polos de la cámara.
        this.cameraPitch = THREE.MathUtils.clamp(
            this.cameraPitch + deltaPitch,
            THREE.MathUtils.degToRad(2),
            THREE.MathUtils.degToRad(88)
        );
        // console.log(
        //     "Camera Pitch:",
        //     THREE.MathUtils.radToDeg(this.cameraPitch).toFixed(2),
        //     "Camera Yaw:",
        //     THREE.MathUtils.radToDeg(this.cameraYaw).toFixed(2),
        //     "Camera Roll:",
        //     THREE.MathUtils.radToDeg(this.cameraRoll).toFixed(2)
        // );

        this.cameraRoll += deltaRoll;

        this.updateCameraPose();
    }

    /**
     * Zoom óptico de cámara ortográfica, con límites configurables.
     * @param {number} factor
     */
    zoomCamera(factor) {
        this.camera.zoom = THREE.MathUtils.clamp(
            this.camera.zoom * factor,
            this.minCameraZoom,
            this.maxCameraZoom
        );

        this.camera.updateProjectionMatrix();
    }

    /** Reconstruye la posición de la cámara a partir de yaw, pitch y distancia. */
    updateCameraPose() {
        // Suavizado de la altura para evitar saltos al hacer zoom.
        this._focusHeight = THREE.MathUtils.lerp(
            this._focusHeight,
            this._getFocusHeight(),
            0.15
        );

        const focus = this.target.clone();
        focus.y += this._focusHeight;

        const horizontal =
            Math.cos(this.cameraPitch) * this.cameraDistance;

        const offset = new THREE.Vector3(
            Math.sin(this.cameraYaw) * horizontal,
            Math.sin(this.cameraPitch) * this.cameraDistance,
            Math.cos(this.cameraYaw) * horizontal
        );

        this.camera.position.copy(focus).add(offset);

        this.camera.up.set(0, 1, 0);
        this.camera.lookAt(focus);
        this.camera.rotateZ(this.cameraRoll);

        this.camera.updateMatrixWorld(true);
    }
    render() {
        this.renderer.render(this.scene, this.camera);
    }

    clearWorld() {
        if (this.worldGroup) {
            this.scene.remove(this.worldGroup);
            this.worldGroup.traverse((/** @type {{ geometry: { dispose: () => void; }; material: { forEach: (arg0: (m: any) => any) => void; dispose: () => void; }; }} */ object) => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                    if (Array.isArray(object.material)) object.material.forEach(m => m.dispose());
                    else object.material.dispose();
                }
            });
            this.worldGroup = null;
        }
        this.ground = null;
    }

    dispose() {
        this._resizeObserver.disconnect();
        this.clearWorld();
        if (this.playerSprite) {
            this.scene.remove(this.playerSprite);
            this.playerSprite.material.dispose();
            this.playerSprite = null;
        }
        this.playerTexture?.dispose();
        this.playerTexture = null;

        // 🧊 Liberar modelos 3D (jugador y NPCs).
        this.clearPlayerModel();
        this.model3d?.dispose();

        this.renderer.dispose();
        this.textureManager.dispose();

        for (const s of [this.sunMesh, this.sunGlow, this.sunRays]) {
            if (!s) continue;
            this.scene.remove(s);
            s.material.map?.dispose();
            s.material.dispose();
        }
        this.sunMesh?.material.map?.dispose();
        if (this.playerShadow) {
            this.scene.remove(this.playerShadow);
            this.playerShadow.material.map.dispose();
            this.playerShadow.material.dispose();
            this.playerShadow.geometry.dispose();
        }
    }

    // createObjectVisual(object) {
    //     switch (object.visualType) {
    //         case "house":
    //             return createHouseVisual(THREE, object);

    //         default:
    //             console.warn(
    //                 "Tipo de objeto 3D no soportado:",
    //                 object.visualType
    //             );
    //             return null;
    //     }
    // }

    // syncMapObjects(map) {
    //     if (!map?.objects) return;

    //     const currentObjects = new Set(map.objects);

    //     // Eliminar representaciones de objetos que ya no están en el mapa.
    //     for (const [object, visual] of this.objectVisuals) {
    //         if (!currentObjects.has(object)) {
    //             this.scene.remove(visual);
    //             this.objectVisuals.delete(object);
    //         }
    //     }

    //     // Crear las representaciones que todavía no existen.
    //     for (const object of map.objects) {
    //         if (this.objectVisuals.has(object)) continue;

    //         const visual = this.createObjectVisual(object);
    //         if (!visual) continue;

    //         const width = object.w ?? object.footprint?.width ?? 1;
    //         const depth = object.h ?? object.footprint?.depth ?? 1;

    //         // Coordenadas lógicas del mapa X/Y -> mundo 3D X/Z.
    //         visual.position.set(
    //             object.x + width / 2,
    //             0,
    //             object.y + depth / 2
    //         );

    //         this.scene.add(visual);
    //         this.objectVisuals.set(object, visual);
    //     }
    // }


    debugDepth() {
        if (!this.playerSprite) return;

        console.log("PLAYER:", {
            position: this.playerSprite.position.toArray(),
            depthTest: this.playerSprite.material.depthTest,
            depthWrite: this.playerSprite.material.depthWrite,
            renderOrder: this.playerSprite.renderOrder,
            visible: this.playerSprite.visible
        });
        console.log("PLAYER:", {
            position: this.playerSprite.position.toArray(),
            distanceToCamera: this.playerSprite.position.distanceTo(
                this.camera.position
            ),
            depthTest: this.playerSprite.material.depthTest,
            depthWrite: this.playerSprite.material.depthWrite
        });

        console.log("SCENE OBJECTS:");

        this.scene.traverse((/** @type {{ isMesh: any; isSprite: any; name: any; type: any; getWorldPosition: (arg0: any) => { (): any; new (): any; toArray: { (): any; new (): any; }; distanceTo: { (arg0: any): any; new (): any; }; }; renderOrder: any; material: { depthTest: any; depthWrite: any; }; visible: any; parent: { name: any; }; }} */ object) => {
            if (object.isMesh || object.isSprite) {
                console.log({
                    name: object.name,
                    type: object.type,
                    position: object.getWorldPosition(
                        new THREE.Vector3()
                    ).toArray(),
                    renderOrder: object.renderOrder,
                    depthTest: object.material?.depthTest,
                    depthWrite: object.material?.depthWrite
                });
                const material = object.material;
                console.log({
                    name: object.name,
                    type: object.type,
                    position: object.getWorldPosition(
                        new THREE.Vector3()
                    ).toArray(),
                    distanceToCamera: object.getWorldPosition(
                        new THREE.Vector3()
                    ).distanceTo(this.camera.position),
                    renderOrder: object.renderOrder,
                    depthTest: material?.depthTest,
                    depthWrite: material?.depthWrite,
                    visible: object.visible,
                    parent: object.parent?.name
                });
            }
        });

    }
    debugCameraDepth() {
        if (!this.playerSprite) return;

        this.camera.updateMatrixWorld(true);

        const playerPosition = this.playerSprite.position.clone();
        playerPosition.y += this.playerSprite.scale.y / 2;

        const playerView = playerPosition.clone()
            .applyMatrix4(this.camera.matrixWorldInverse);

        console.log("PLAYER DEPTH:", -playerView.z);

        this.scene.traverse((/** @type {{ isMesh: any; parent: any; getWorldPosition: (arg0: any) => any; }} */ object) => {
            if (!object.isMesh) return;

            const parent = object.parent;
            const worldObject = parent?.userData?.worldObject;

            if (!worldObject) return;

            const position = object.getWorldPosition(
                new THREE.Vector3()
            );

            const viewPosition = position.clone()
                .applyMatrix4(this.camera.matrixWorldInverse);

            console.log({
                house: parent.name,
                position: position.toArray(),
                depth: -viewPosition.z,
                playerDepth: -playerView.z,
                closerThanPlayer: -viewPosition.z < -playerView.z
            });
        });
    }
    getWorldMeshes() {
        /**
         * @type {any[]}
         */
        const meshes = [];

        this.scene.traverse((/** @type {{ isMesh: any; }} */ object) => {
            if (object.isMesh) {
                meshes.push(object);
            }
        });

        return meshes;
    }


    /**
     * Actualiza la iluminación según el ciclo día/noche.
     * @param {number} hour Valor entre 0 y 1.
     */
    updateTimeLighting(hour) {
        const THREE = this.THREE;

        hour = ((hour % 24) + 24) % 24;

        const keys = this.lightingKeys;

        // Encontrar los dos perfiles que rodean la hora actual
        let a = keys[0];
        let b = keys[keys.length - 1];

        for (let i = 0; i < keys.length - 1; i++) {
            if (hour >= keys[i].hour && hour <= keys[i + 1].hour) {
                a = keys[i];
                b = keys[i + 1];
                break;
            }
        }

        const range = b.hour - a.hour;

        let t = range > 0
            ? (hour - a.hour) / range
            : 0;

        // Suavizar la interpolación
        t = t * t * (3 - 2 * t);

        const lerp = (/** @type {number} */ x, /** @type {number} */ y) => THREE.MathUtils.lerp(x, y, t);

        // Intensidad de las luces
        this.ambientLight.intensity = lerp(a.ambient, b.ambient);
        this.sunLight.intensity = lerp(a.sun, b.sun);

        // Colores ambientales
        this.ambientLight.color.copy(a.ambientColor)
            .lerp(b.ambientColor, t);

        this.ambientLight.groundColor.copy(a.groundColor)
            .lerp(b.groundColor, t);

        this.sunLight.color.copy(a.sunColor)
            .lerp(b.sunColor, t);

        // Color del cielo, respetando el color original del mapa
        const skyMix = lerp(a.skyMix, b.skyMix);

        this._tempSkyColor.copy(a.skyColor)
            .lerp(b.skyColor, t);

        this.skyColor = new THREE.Color("#87ceeb");

        // if (this._currentMapBackground) {
        //     this.scene.background.copy(this._currentMapBackground)
        //         .lerp(this._tempSkyColor, skyMix);
        // }

        this.skyColor.copy(a.skyColor)
            .lerp(b.skyColor, t);

        this.scene.background.copy(this.skyColor);


        // Si el mundo tiene niebla, sincronizarla con el cielo.
        if (this.scene.fog?.color) {
            this.scene.fog.color.copy(this.skyColor);
        }

        // Movimiento del sol de este a oeste.
        // 06:00 = horizonte, 12:00 = punto más alto,
        // 18:00 = horizonte.
        const sunAngle = ((hour - 6) / 12) * Math.PI;
        const sunDistance = 30;

        this.updateSunLight(hour);

        // Intensidad de la iluminación cercana al personaje
        const nightFactor = 1 - THREE.MathUtils.clamp(
            (this.ambientLight.intensity - 0.18) / (0.9 - 0.18),
            0, 1
        );

        this.characterAreaLight.intensity = lerp(0.15, 1.0);
        this.characterAreaLight.distance = lerp(5, 7);

        // El sprite utiliza MeshBasicMaterial, así que ajustamos
        // su brillo independientemente de las luces de Three.js.
        if (this.playerSprite?.material) {
            const brightness = lerp(1.0, 1.10);

            this.playerSprite.material.color.setRGB(
                brightness,
                brightness,
                brightness
            );
        }

        this.updateSun(hour);
        if (this.playerShadow) {
            this.playerShadow.material.opacity =
                0.35 + 0.65 * THREE.MathUtils.clamp(this.sunLight.intensity / 2.5, 0, 1);
        }
    }

    /**
     * Actualiza la posición de la iluminación local.
     * @param {{ x: any; y: any; }} position
     */
    updateCharacterAreaLight(position) {
        if (!position) return;

        this.characterAreaLight.position.set(
            position.x,
            2.5,
            position.y
        );
    }
    /**
     * Crea una CanvasTexture a partir de una función por píxel.
     * @param {number} size
     * @param {{ (r: any): number[]; (r: any): number[]; (r: any, angle: any): number[]; (arg0: number, arg1: number): [any, any, any, any]; }} fn
     */
    _makeSunTexture(size, fn) {
        const THREE = this.THREE;
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (ctx == null) {
            return;
        }
        const img = ctx.createImageData(size, size);
        const d = img.data;

        for (let py = 0; py < size; py++) {
            for (let px = 0; px < size; px++) {
                // Coordenadas normalizadas: -1..1, r = 1 en el borde.
                const nx = (px + 0.5) / size * 2 - 1;
                const ny = (py + 0.5) / size * 2 - 1;
                const r = Math.hypot(nx, ny);
                const angle = Math.atan2(ny, nx);

                const [cr, cg, cb, ca] = fn(r, angle);

                // Dithering leve para evitar bandas en los degradados.
                const n = (Math.random() - 0.5) / 255 * 2;
                const i = (py * size + px) * 4;
                d[i] = Math.max(0, Math.min(255, (cr + n) * 255));
                d[i + 1] = Math.max(0, Math.min(255, (cg + n) * 255));
                d[i + 2] = Math.max(0, Math.min(255, (cb + n) * 255));
                d[i + 3] = Math.max(0, Math.min(255, (ca + n) * 255));
            }
        }

        ctx.putImageData(img, 0, 0);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        texture.needsUpdate = true;
        return texture;
    }

    /**
     * @param {number} e0
     * @param {number} e1
     * @param {number} x
     */
    _smooth(e0, e1, x) {
        const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
        return t * t * (3 - 2 * t);
    }

    /** Halo amplio y suave. */
    _createSunGlowTexture() {
        return this._makeSunTexture(512, (r) => {
            const falloff =
                0.85 * Math.exp(-r * r * 7) +
                0.25 * Math.exp(-r * 2.4);
            const edge = 1 - this._smooth(0.75, 1, r); // muere antes del borde
            return [1, 0.78, 0.5, falloff * edge];
        });
    }

    /** Disco con borde definido, oscurecimiento de limbo y corona corta. */
    _createSunDiscTexture() {
        const discR = 0.3;

        return this._makeSunTexture(512, (r) => {
            // Disco
            const discAlpha = 1 - this._smooth(discR - 0.012, discR, r);
            const k = Math.min(r / discR, 1);
            const limb = 1 - 0.28 * k * k; // más oscuro hacia el borde

            // Del blanco cálido al amarillo-naranja
            const cr = 1;
            const cg = (0.98 - 0.12 * k * k) * limb + (1 - limb) * 0.2;
            const cb = (0.90 - 0.30 * k * k) * limb;

            // Corona justo fuera del disco
            const corona =
                r > discR
                    ? 0.55 * Math.exp(-(r - discR) * 10) * (1 - this._smooth(0.8, 1, r))
                    : 0;

            const alpha = Math.max(discAlpha, corona);
            return [cr, cg, cb, alpha];
        });
    }

    /** Rayos de luz sutiles alrededor del sol. */
    _createSunRaysTexture() {
        const rays = 14;

        // @ts-ignore
        return this._makeSunTexture(512, (r, angle) => {
            const a = Math.pow(Math.abs(Math.cos(angle * rays / 2)), 18);
            const b = Math.pow(Math.abs(Math.cos(angle * 5 / 2 + 0.7)), 30);
            const pattern = a * 0.7 + b * 0.4;

            const radial =
                Math.exp(-r * 3.2) *
                this._smooth(0.12, 0.3, r) *     // no tapar el disco
                (1 - this._smooth(0.8, 1, r));

            return [1, 0.88, 0.65, pattern * radial * 0.6];
        });
    }


    /**
     * @param {number} hour
     */
    updateSun(hour) {
        const THREE = this.THREE;

        hour = ((hour % 24) + 24) % 24;

        // Movimiento del sol:
        // 06:00 amanecer
        // 12:00 mediodía
        // 18:00 ocaso
        const angle = ((hour - 6) / 12) * Math.PI;

        const x = Math.cos(angle) * this.sunDistance;
        const y = Math.sin(angle) * this.sunDistance;
        const z = 8;

        const position = new THREE.Vector3(x, y, z);

        this.sunMesh.position.copy(position);
        this.sunGlow.position.copy(position);

        // El sol desaparece gradualmente al acercarse al horizonte.
        const height = y / this.sunDistance;

        const fade = THREE.MathUtils.smoothstep(
            height,
            0.02,
            0.20
        );

        this.sunMesh.material.opacity = fade;
        this.sunGlow.material.opacity = fade * 0.75;

        this.sunMesh.visible = fade > 0.001;
        this.sunGlow.visible = fade > 0.001;

        // El tamaño del halo aumenta ligeramente cerca del horizonte.
        const glowSize = THREE.MathUtils.lerp(12, 19, 1 - fade);

        this.sunGlow.scale.set(glowSize, glowSize, 1);

        // Color del disco según su altura.
        const sunsetColor = new THREE.Color("#ff914d");
        const middayColor = new THREE.Color("#fff5d6");

        this.sunMesh.material.color.copy(sunsetColor)
            .lerp(middayColor, fade);

        this.sunGlow.material.color.copy(sunsetColor)
            .lerp(middayColor, fade);
    }

    _createSunObjects() {
        const THREE = this.THREE;

        const makeSprite = (/** @type {any} */ texture, /** @type {number} */ scale, /** @type {number} */ opacity, /** @type {number} */ order) => {
            const sprite = new THREE.Sprite(
                new THREE.SpriteMaterial({
                    map: texture,
                    transparent: true,
                    opacity,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    depthTest: false,
                    fog: false,
                    toneMapped: false
                })
            );
            sprite.scale.set(scale, scale, 1);
            sprite.renderOrder = order;
            sprite.frustumCulled = false;
            return sprite;
        };

        this.sunGlow = makeSprite(this._createSunGlowTexture(), 30, 0.55, 10);
        this.sunRays = makeSprite(this._createSunRaysTexture(), 26, 0.45, 11);
        this.sunMesh = makeSprite(this._createSunDiscTexture(), 9, 1.0, 12);

        this.scene.add(this.sunGlow, this.sunRays, this.sunMesh);
    }

    _setupSunShadows() {
        const s = this.sunLight;
        s.castShadow = true;
        s.shadow.mapSize.set(2048, 2048); // 1024 si necesitas rendimiento
        s.shadow.bias = -0.0004;
        s.shadow.normalBias = 0.03;
        s.shadow.radius = 3;

        const r = 30; // área cubierta alrededor del jugador
        const cam = s.shadow.camera;
        cam.left = -r; cam.right = r;
        cam.top = r; cam.bottom = -r;
        cam.near = 1; cam.far = 140;

        this.scene.add(s.target);
    }

    /**
     * Posiciona el sol siguiendo la cámara, con una elevación que deja sombras visibles.
     * @param {number} hour
     */
    updateSunLight(hour) {
        const angle = ((hour - 6) / 12) * Math.PI;

        // La componente z fija evita que al mediodía el sol quede vertical.
        this._sunDir.set(
            Math.cos(angle),
            Math.sin(angle) * 0.85,
            0.55
        ).normalize();

        // Redondeo para que la sombra no "tiemble" al moverse.
        const snap = 0.25;
        const tx = Math.round(this.target.x / snap) * snap;
        const tz = Math.round(this.target.z / snap) * snap;

        this.sunLight.target.position.set(tx, 0, tz);
        this.sunLight.position.set(
            tx + this._sunDir.x * 60,
            this._sunDir.y * 60,
            tz + this._sunDir.z * 60
        );
        this.sunLight.target.updateMatrixWorld();
    }

    /** Activa sombras en los objetos del mundo (casas, árboles, etc.). */
    enableShadows(root = this.scene) {
        root.traverse((/** @type {{ isMesh: any; userData: { _shadowSet: boolean; }; castShadow: boolean; receiveShadow: boolean; }} */ o) => {
            if (!o.isMesh || o === this.ground || o === this.playerSprite) return;
            if (o === this.playerShadow || o.userData._shadowSet) return;
            o.castShadow = true;
            o.receiveShadow = true;
            o.userData._shadowSet = true;
        });
    }

    /** El personaje es un plano billboard, así que usa una sombra falsa en el suelo. */
    _createPlayerShadow() {
        const THREE = this.THREE;
        const c = document.createElement("canvas");
        c.width = c.height = 128;
        const ctx = c.getContext("2d");
        if (ctx == null) {
            return
        }
        const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        g.addColorStop(0, "rgba(0,0,0,0.55)");
        g.addColorStop(0.6, "rgba(0,0,0,0.25)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 128, 128);

        this.playerShadow = new THREE.Mesh(
            new THREE.PlaneGeometry(1.1, 1.1),
            new THREE.MeshBasicMaterial({
                map: new THREE.CanvasTexture(c),
                transparent: true,
                depthWrite: false,
                toneMapped: false
            })
        );
        this.playerShadow.rotation.x = -Math.PI / 2;
        this.playerShadow.renderOrder = 1;
        this.scene.add(this.playerShadow);
    }

    /** Textura procedural para romper la uniformidad del suelo. */
    _createGroundTexture() {
        const THREE = this.THREE;
        const size = 512;
        const c = document.createElement("canvas");
        c.width = c.height = size;
        const ctx = c.getContext("2d");
        if (ctx == null) {
            return
        }
        ctx.fillStyle = "#719b58";
        ctx.fillRect(0, 0, size, size);

        for (let i = 0; i < 1800; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const r = 6 + Math.random() * 26;
            const light = Math.random() > 0.5;
            ctx.fillStyle = light
                ? `rgba(170,210,110,${0.03 + Math.random() * 0.05})`
                : `rgba(40,80,40,${0.03 + Math.random() * 0.06})`;

            // Se dibuja con wrap para que la textura sea tileable.
            for (const ox of [-size, 0, size]) {
                for (const oy of [-size, 0, size]) {
                    ctx.beginPath();
                    ctx.arc(x + ox, y + oy, r, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        return tex;
    }

    /** Altura del punto de enfoque según el zoom actual. */
    _getFocusHeight() {
        const THREE = this.THREE;

        const t = THREE.MathUtils.clamp(
            (this.camera.zoom - this.focusStartZoom) /
            (this.maxCameraZoom - this.focusStartZoom),
            0,
            1
        );

        // smoothstep para que la transición no sea brusca
        const eased = t * t * (3 - 2 * t);

        return this.focusHeightAtMaxZoom * eased;
    }

}
