//@ts-check
// @ts-ignore
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";
import { ThreeWorldRenderer } from "./ThreeWorldRenderer.js";
import { WorldTimeSystem } from "./WorldTimeSystem.js";
import { OpenWorldEngineView } from "../OpenWorldEngineView.js";
import { CharacterWorldModule } from "./Characters/CharacterWorldModule.js";
import { CameraDirectionUtil } from "./Characters/CameraDirectionUtil.js";

/**
 * Motor de mundo 3D mínimo. Mantiene las coordenadas lógicas X/Y de GameMap;
 * el renderer las transforma a X/Z de Three.js.
 */
export class GameEngine3D {
    /**
     * @param {OpenWorldEngineView} view OpenWorldEngineView anfitrión.
     * @param {{
     *   canvas?: HTMLCanvasElement,
     *   getCharacterTexture?: (character: any) => HTMLImageElement|HTMLCanvasElement|import("three").Texture|null,
     *   playerWidth?: number,
     *   playerHeight?: number,
     *   moveSpeed?: number,
     *   collisionRadius?: number,
     *   cameraHeight?: number,
     *   cameraRotationSpeed?: number,
     *   cameraPitchSpeed?: number,
     *   cameraRollSpeed?: number,
     * collisionPadding?: number,
     * }} [options]
     */
    constructor(view, options = {}) {
        this.view = view;
        this.canvas = options.canvas ?? view.Canvas;
        this.options = options;
        this.maps = Object.create(null);
        this.currentMap = null;
        this.Characters = view.Characters ?? [];
        this.SelectedCharacter = view.character ?? this.Characters[0] ?? null;
        this.active = false;
        this.keys = new Set();
        this.lastTime = 0;
        this.rafId = 0;
        this.disposed = false;
        this.renderer = new ThreeWorldRenderer(this.canvas, {
            cameraHeight: options.cameraHeight ?? 16
        });
        this._onKeyDown = this._onKeyDown.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
        this._onBlur = () => this.keys.clear();
        this._onWheel = (/** @type {{ preventDefault: () => void; deltaY: number; }} */ event) => {
            event.preventDefault();
            // Rueda arriba acerca; rueda abajo aleja.
            this.renderer.zoomCamera(Math.exp(-event.deltaY * 0.001));
        };
        this._onContextMenu = (/** @type {{ preventDefault: () => any; }} */ event) => event.preventDefault();

        this._rotating = false;
        this._lastMouse = { x: 0, y: 0 };
        this.mouseRotateSpeed = options.mouseRotateSpeed ?? 0.005;   // radianes por píxel
        this.mousePitchEnabled = options.mousePitchEnabled ?? false;
        this.invertMouseX = options.invertMouseX ?? false;

        this._onMouseDown = (event) => {
            if (event.button !== 2) return;          // solo clic derecho
            event.preventDefault();
            this._rotating = true;
            this._lastMouse.x = event.clientX;
            this._lastMouse.y = event.clientY;
            this.canvas.style.cursor = "grabbing";
            this.canvas.focus?.({ preventScroll: true });
        };

        this._onMouseMove = (event) => {
            if (!this._rotating) return;

            const dx = event.clientX - this._lastMouse.x;
            const dy = event.clientY - this._lastMouse.y;
            this._lastMouse.x = event.clientX;
            this._lastMouse.y = event.clientY;

            const dir = this.invertMouseX ? -1 : 1;

            this.renderer.rotateCamera(
                -dx * this.mouseRotateSpeed * dir,
                this.mousePitchEnabled ? dy * this.mouseRotateSpeed : 0,
                0
            );
        };

        this._onMouseUp = (event) => {
            if (event.button !== 2 && event.type !== "blur") return;
            this._rotating = false;
            this.canvas.style.cursor = "";
        };

        this.canvas.tabIndex = this.canvas.tabIndex >= 0 ? this.canvas.tabIndex : 0;
        this.canvas.addEventListener("keydown", this._onKeyDown);
        this.canvas.addEventListener("keyup", this._onKeyUp);
        this.canvas.addEventListener("wheel", this._onWheel, { passive: false });
        this.canvas.addEventListener("contextmenu", this._onContextMenu);
        window.addEventListener("keydown", this._onKeyDown);
        window.addEventListener("keyup", this._onKeyUp);
        window.addEventListener("blur", this._onBlur);

        this.canvas.addEventListener("mousedown", this._onMouseDown);
        window.addEventListener("mousemove", this._onMouseMove);
        window.addEventListener("mouseup", this._onMouseUp);
        window.addEventListener("blur", this._onMouseUp);

        this.THREE = THREE
        this.TimeSystem = new WorldTimeSystem({
            initialHour: 8,
            day: 1,
            gameHoursPerRealSecond: 1 / 60,
            enabled: true
        });
        this.characters = new CharacterWorldModule(this, {
            playerHeight: options.playerHeight ?? 3,
            npcHeight: options.npcHeight ?? 3,
            followerSpacing: options.followerSpacing ?? 2,
            npcInteractionRadius: options.npcInteractionRadius ?? 1.8,
            manageLeaderAnimation: false,
            managePlayerVisual: false,
            CharactersUtil: options.CharactersUtil
        });
        this._isActionExecuting = false;

        this.visualTimeHour = this.TimeSystem.getTime().hour;
        this.visualTimeSpeed = 2; // Horas de juego por segundo visual

        // Aplicar iluminación inicial de las 08:00.
        this.renderer.updateTimeLighting(
            this.TimeSystem.getTime().hour
        );
        this._interactPressed = false;
        this._interactionLock = null;
        this.interactKey = (options.interactionKey ?? "e").toLowerCase();
        this.interactionHint = null; // { object, label, key } | null
        //TODDO
        this.onInteractionHint = (hint) => {
            // hint = { object, label, key } o null
            if (hint) {
                hint.textContent = hint ? `[${hint.key}] ${hint.label}` : "";
            }
        }
    }

    /**
     * @param {import("../OpenWordModules/Models.js").GameMap} map
     */
    addMap(map) {
        if (!map?.name) throw new Error("GameMap debe tener una propiedad name.");
        if (!Number.isFinite(map.w) || !Number.isFinite(map.h) || map.w <= 0 || map.h <= 0) {
            throw new Error(`Dimensiones inválidas en el mapa "${map.name}". Se esperan w y h positivos.`);
        }
        this.maps[map.name] = map;
    }

    /**
     * @param {string} name
     * @param {{x:number,y:number}} [position]
     */
    // GoToMap(name, position) {
    //     const map = this.maps[name];
    //     const nextMap = this.maps[name];

    //     if (!nextMap) {
    //         console.warn(`Mapa no encontrado: ${name}`);
    //         return;
    //     }

    //     // Retirar objetos del mapa anterior.
    //     for (const object of this.currentMap?.objects ?? []) {
    //         if (object.rendered) {
    //             object.destroy(this);
    //         }
    //     }

    //     this.currentMap = nextMap;
    //     if (!map) throw new Error(`Mapa no encontrado: ${name}`);
    //     this.currentMap = map;

    //     if (!this.SelectedCharacter) {
    //         this.SelectedCharacter = this.Characters[0] ?? { x: map.spawnX ?? 1, y: map.spawnY ?? 1, speed: 3, direction: "down" };
    //     }
    //     const x = position?.x ?? map.spawnX ?? 1;
    //     const y = position?.y ?? map.spawnY ?? 1;
    //     this.SelectedCharacter.x = this._clampX(x);
    //     this.SelectedCharacter.y = this._clampY(y);

    //     this.renderer.setMap(map);
    //     this._refreshPlayerTexture();
    //     this.renderer.updatePlayer(this.SelectedCharacter);
    //     this.renderer.render();
    //     this.keys.clear();
    //     this._interactPressed = false;
    //     this.renderMapObjects();

    // }
    /**
 * @param {string} name
 * @param {{x:number,y:number}} [position]
 */
    GoToMap(name, position) {
        const map = this.maps[name];

        if (!map) {
            console.warn(`Mapa no encontrado: ${name}`);
            return;
        }

        // Retirar objetos del mapa anterior.
        for (const object of this.currentMap?.objects ?? []) {
            if (object.rendered) {
                try {
                    object.destroy(this);
                } catch (error) {
                    console.warn("Error destruyendo objeto al cambiar mapa", error);
                }
            }
        }

        this.currentMap = map;

        this.characters.resolveLeader();

        if (!this.SelectedCharacter) {
            this.SelectedCharacter = this.Characters[0] ?? {
                x: map.spawnX ?? 1,
                y: map.spawnY ?? 1,
                speed: 3,
                direction: "down"
            };
        }

        const x = position?.x ?? map.spawnX ?? 1;
        const y = position?.y ?? map.spawnY ?? 1;

        this.SelectedCharacter.x = this._clampX(x);
        this.SelectedCharacter.y = this._clampY(y);

        this.renderer.setMap(map);

        this.characters.onMapEntered(map, {
            x: this.SelectedCharacter.x,
            y: this.SelectedCharacter.y
        });

        this._refreshPlayerTexture();
        this.renderer.updatePlayer(this.SelectedCharacter);
        this.renderer.render();

        this.keys.clear();
        this._interactPressed = false;
        this._isActionExecuting = false;

        this.renderMapObjects();
    }

    /**
     * @param {import("../../Common/CharacterModel.js").CharacterModel} character
     */
    // async RegisterCharacter(character) {
    //     if (!character) return;
    //     if (!this.Characters.includes(character)) this.Characters.push(character);
    //     if (!this.SelectedCharacter) this.SelectedCharacter = character;
    //     if (typeof character.RegisterWordMapCharacter === "function") {
    //         await character.RegisterWordMapCharacter(this.view.Config?.isFullPerspective ?? false);
    //     }
    // }
    async RegisterCharacter(character) {
        await this.characters.registerCharacter(
            character,
            this.view.Config?.isFullPerspective ?? false
        );
    }

    start() {
        if (this.disposed || this.active) return;
        this.active = true;
        this.lastTime = 0;
        this.canvas.focus?.({ preventScroll: true });
        this.rafId = requestAnimationFrame((time) => this._frame(time));
        this.renderMapObjects();
    }
    renderMapObjects() {
        if (!this.currentMap) return;

        for (const object of this.currentMap.objects ?? []) {
            if (object.rendered) continue;

            object.render(this);
            object.rendered = true;
            this.renderer.enableShadows();
        }
    }

    stop() {
        this.active = false;
        this.keys.clear();
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.rafId = 0;
    }

    pause() { this.stop(); }

    resume() { this.start(); }

    setSize() { this.renderer.resize(); }

    /**
     * @param {{ key: string; preventDefault: () => void; }} event
     */
    _onKeyDown(event) {
        const key = event.key.toLowerCase();

        if (key === this.interactKey) {
            const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName ?? "");
            if (!typing && !event.repeat) this._interactPressed = true;
            return;
        }

        if ([
            "w", "a", "s", "d",
            "arrowup", "arrowdown", "arrowleft", "arrowright",
            "q", "z", "c", "e"
            //, "r", "f", "t", "g"
        ].includes(key)) {
            event.preventDefault();
            this.keys.add(key);
        }
    }
    /**
     * @param {{ key: string; }} event
     */
    _onKeyUp(event) {
        this.keys.delete(event.key.toLowerCase());
    }

    _readInput() {
        const left = this.keys.has("a") || this.keys.has("arrowleft");
        const right = this.keys.has("d") || this.keys.has("arrowright");
        const up = this.keys.has("w") || this.keys.has("arrowup");
        const down = this.keys.has("s") || this.keys.has("arrowdown");
        let x = Number(right) - Number(left);
        let y = Number(down) - Number(up);
        const length = Math.hypot(x, y);
        if (length > 0) { x /= length; y /= length; }
        return { x, y, moving: length > 0 };
    }



    /**
     * Convierte el desplazamiento del mundo a una
     * de las ocho direcciones visibles de la cámara.
     *
     * @param {number} dx
     * @param {number} dz
     * @returns {string}
     */
    _getCameraRelativeDirection(dx, dz) {
        return CameraDirectionUtil.getRelativeDirection(
            THREE,
            this.renderer.camera,
            dx,
            dz,
            "down",
            this.view?.Config?.isFullPerspective ?? false
        );
        // const camera = this.renderer.camera;

        // camera.updateMatrixWorld(true);

        // // Movimiento real sobre el suelo.
        // const movement = new THREE.Vector3(dx, 0, dz);

        // if (movement.lengthSq() < 0.000001) {
        //     return "down";
        // }

        // movement.normalize();

        // // Eje horizontal de la pantalla.
        // const screenRight = new THREE.Vector3()
        //     .setFromMatrixColumn(camera.matrixWorld, 0);

        // screenRight.y = 0;
        // screenRight.normalize();

        // // Eje vertical de la pantalla proyectado sobre el suelo.
        // const screenUp = new THREE.Vector3()
        //     .setFromMatrixColumn(camera.matrixWorld, 1);

        // screenUp.y = 0;

        // // Evitamos una proyección degenerada.
        // if (screenUp.lengthSq() < 0.000001) {
        //     screenUp.set(0, 0, -1);
        // } else {
        //     screenUp.normalize();
        // }

        // // Coordenadas de movimiento relativas a la pantalla.
        // const horizontal = movement.dot(screenRight);
        // const vertical = movement.dot(screenUp);

        // // Ángulo respecto a la dirección up.
        // const angle = Math.atan2(horizontal, vertical);

        // // Ocho sectores de 45 grados.
        // const directions = [
        //     "up",
        //     "up_right",
        //     "right",
        //     "down_right",
        //     "down",
        //     "down_left",
        //     "left",
        //     "up_left"
        // ];

        // const sector = Math.round(
        //     angle / (Math.PI / 4)
        // );

        // return directions[
        //     (sector + 8) % 8
        // ];
    }


    /**
     * @param {number} dt
     */
    _update(dt) {
        const player = this.SelectedCharacter;

        // Si hay una acción en ejecución o batalla activa,
        // bloqueamos movimiento del mundo.
        const blocked =
            this._isActionExecuting ||
            this.battleSystem?.isActive === true;

        // Q/E giran la cámara de forma continua mientras se mantienen pulsadas.
        const rotationSpeed =
            this.options.cameraRotationSpeed ?? 1.8;

        const pitchSpeed =
            this.options.cameraPitchSpeed ?? 1.2;

        const rollSpeed =
            this.options.cameraRollSpeed ?? 1.5;

        // Giro horizontal.
        const yaw =
            Number(this.keys.has("c")) -
            Number(this.keys.has("z"));

        // Inclinación vertical.
        const pitch =
            Number(this.keys.has("r")) -
            Number(this.keys.has("f"));

        // Rotación sobre el eje frontal.
        const roll =
            Number(this.keys.has("t")) -
            Number(this.keys.has("g"));

        // Opción A: congelar también cámara durante acciones.
        // Si prefieres que el jugador pueda girar cámara mientras habla,
        // quita el !blocked de esta condición.
        if (!blocked && (yaw || pitch || roll)) {
            this.renderer.rotateCamera(
                yaw * rotationSpeed * dt,
                pitch * pitchSpeed * dt,
                roll * rollSpeed * dt
            );
        }

        const input = this._readInput();

        // Solo se mueve si:
        // 1. existe jugador,
        // 2. hay input de movimiento,
        // 3. no hay acción en ejecución,
        // 4. no hay batalla activa.
        const canMove =
            Boolean(player) &&
            input.moving &&
            !blocked;

        if (canMove) {
            const speed = this.options.moveSpeed ?? player.speed ?? 3;
            const camera = this.renderer.camera;
            camera.updateMatrixWorld(true);

            // Avance proyectado sobre el suelo según la orientación de cámara.
            const forward = new THREE.Vector3();
            camera.getWorldDirection(forward);
            forward.y = 0;
            if (forward.lengthSq() > 0) forward.normalize();

            const right = new THREE.Vector3()
                .crossVectors(forward, new THREE.Vector3(0, 1, 0))
                .normalize();

            const direction = new THREE.Vector3();
            direction.addScaledVector(forward, -input.y);
            direction.addScaledVector(right, input.x);
            if (direction.lengthSq() > 0) direction.normalize();

            const distance = speed * dt;
            const dx = direction.x * distance;
            const dy = direction.z * distance;
            const nextX = player.x + dx;
            const nextY = player.y + dy;

            // Comprobación por ejes: permite deslizarse junto a paredes.
            if (this._canOccupy(nextX, player.y)) player.x = nextX;
            if (this._canOccupy(player.x, nextY)) player.y = nextY;

            // Dirección visual relativa a la cámara.
            player.direction = this._getCameraRelativeDirection(
                dx,
                dy
            );
        }

        // Para animación:
        // Si está blocked, movingForAnimation será false.
        // Así el jugador no se queda animando "walk" durante una acción.
        const movingForAnimation = canMove;

        if (player) {
            if (typeof player.updateAnimation === "function") {
                player.updateAnimation(dt, movingForAnimation);
            }

            this._refreshPlayerTexture();
            this.renderer.updatePlayer(player);
        }

        // NPCs y followers.
        // Les pasamos el movimiento efectivo del líder.
        this.characters.update(dt, movingForAnimation);

        // 👈 NUEVO: Animar los indicadores de interacción de personajes
        this.characters.updateIndicators(dt);


        this._updateInteractions(dt);
    }


    /**
     * @param {number} x
     * @param {number} y
     */
    _canOccupy(x, y) {
        const map = this.currentMap;

        const radius = this.options.collisionRadius ?? 0.12;
        const padding = this.options.collisionPadding ?? 0.10;

        if (!map) return false;

        // Radio efectivo: colisión física + margen de seguridad.
        const effectiveRadius = radius + padding;

        if (
            x - effectiveRadius < 0 ||
            y - effectiveRadius < 0 ||
            x + effectiveRadius >= map.w ||
            y + effectiveRadius >= map.h
        ) {
            return false;
        }

        if (typeof map.isBlocked === "function") {
            try {
                const minX = Math.floor(x - effectiveRadius);
                const maxX = Math.floor(x + effectiveRadius);
                const minY = Math.floor(y - effectiveRadius);
                const maxY = Math.floor(y + effectiveRadius);

                for (let tx = minX; tx <= maxX; tx++) {
                    for (let ty = minY; ty <= maxY; ty++) {
                        if (map.isBlocked(tx, ty, 1)) {
                            return false;
                        }
                    }
                }
            } catch (error) {
                console.warn(
                    "GameMap.isBlocked falló; se aplica solo el límite del mapa.",
                    error
                );
            }
        }

        return true;
    }


    /**
     * @param {number} x
     */
    _clampX(x) { return Math.max(0.12, Math.min((this.currentMap?.w ?? 1) - 0.12, x)); }
    /**
     * @param {number} y
     */
    _clampY(y) { return Math.max(0.12, Math.min((this.currentMap?.h ?? 1) - 0.12, y)); }


    _refreshPlayerTexture() {
        const player = this.SelectedCharacter;
        if (!player) return;

        const resolver = this.options.getCharacterTexture;

        const state = player.state ?? "idle";
        const direction = player.direction ?? "down";

        let source = typeof resolver === "function"
            ? resolver(player)
            : null;

        if (!source) {
            const directionalSprites =
                player.Sprites?.[state]?.[direction]
                ?? player.Sprites?.idle?.[direction]
                ?? player.Sprites?.[state]?.down
                ?? player.Sprites?.idle?.down;

            if (Array.isArray(directionalSprites)) {
                const frame = Math.max(
                    0,
                    Math.min(
                        directionalSprites.length - 1,
                        player.animFrame ?? 0
                    )
                );

                source = directionalSprites[frame];
            } else {
                source = directionalSprites;
            }
        }

        if (!source) return;

        // Solo reconstruimos la textura cuando cambia el frame.
        if (source !== this._lastTextureSource) {
            this.renderer.setPlayerSprite(
                source,
                this.options.playerWidth ?? 2,
                this.options.playerHeight ?? 3
            );
            // @ts-ignore
            this._lastTextureSource = source;
        }
    }


    dispose() {
        this.stop();
        this.disposed = true;
        this.characters?.dispose();
        this.canvas.removeEventListener("keydown", this._onKeyDown);
        this.canvas.removeEventListener("keyup", this._onKeyUp);
        this.canvas.removeEventListener("wheel", this._onWheel);
        this.canvas.removeEventListener("contextmenu", this._onContextMenu);
        window.removeEventListener("keydown", this._onKeyDown);
        window.removeEventListener("keyup", this._onKeyUp);
        window.removeEventListener("blur", this._onBlur);
        this.renderer.dispose();

        this.canvas.removeEventListener("mousedown", this._onMouseDown);
        window.removeEventListener("mousemove", this._onMouseMove);
        window.removeEventListener("mouseup", this._onMouseUp);
        window.removeEventListener("blur", this._onMouseUp);
    }
    /**
     * Adelanta el tiempo del mundo.
     * @param {number} hours
     */
    advanceTime(hours) {
        this.TimeSystem.advanceTime(hours);

        this.renderer.render();
    }

    /**
     * Obtiene el tiempo actual del mundo.
     */
    getGameTime() {
        return this.TimeSystem.getTime();
    }

    /**
     * Activa o desactiva el avance automático.
     * @param {any} enabled
     */
    setTimeRunning(enabled) {
        this.TimeSystem.enabled = Boolean(enabled);
    }

    /**
     * @param {number} timestamp
     */
    _frame(timestamp) {
        if (!this.active || this.disposed) return;

        const dt = this.lastTime
            ? Math.min((timestamp - this.lastTime) / 1000, 0.05)
            : 0;

        this.lastTime = timestamp;

        // Avance automático del reloj.
        this.TimeSystem.update(dt);

        this._updateVisualTime(dt);

        if (this.currentMap && this.SelectedCharacter) {
            this._update(dt);
        }

        this.renderer.render();

        this.rafId = requestAnimationFrame(
            (time) => this._frame(time)
        );
    }

    /**
     * @param {number} dt
     */
    _updateVisualTime(dt) {
        const targetHour = this.TimeSystem.getTime().hour;

        // Diferencia más corta entre dos horas de un reloj de 24 h.
        let difference =
            ((targetHour - this.visualTimeHour + 36) % 24) - 12;

        const maxStep = this.visualTimeSpeed * dt;

        const step = THREE.MathUtils.clamp(
            difference,
            -maxStep,
            maxStep
        );

        this.visualTimeHour =
            (this.visualTimeHour + step + 24) % 24;

        this.renderer.updateTimeLighting(this.visualTimeHour);
    }

    /** Posición del jugador en coordenadas de MUNDO (map.y -> z). */
    getPlayerWorldPosition() {
        const p = this.SelectedCharacter;
        return p ? { x: p.x, y: 0, z: p.y } : null;
    }

    get isInteracting() { return this._interactionLock !== null; }

    /**
     * Ejecuta una interacción de forma exclusiva; el candado se libera al terminar (aunque sea async).
     * Ejecuta una interacción de forma exclusiva; el candado se libera al terminar.
     * @param {any} source
     * @param {{ (): any; (): any; }} fn
     */
    async runInteraction(source, fn) {
        if (this._interactionLock) return false;

        this._interactionLock = source;
        this._isActionExecuting = true;
        this.keys.clear();

        try {
            const result = await fn();
            return result !== false;
        } catch (error) {
            console.error("Error en interacción:", error);
            return false;
        } finally {
            this._isActionExecuting = false;
            this._interactionLock = null;
        }
    }

    _updateInteractions(dt) {
        const map = this.currentMap;
        if (!map) return;

        let best = null;
        let bestDist = Infinity;

        // 1. Obtener candidatos de objetos y de personajes (NPCs)
        const objectCandidates = [...(map.objects ?? [])];
        const characterCandidates = this.characters?.getInteractionCandidates?.() ?? [];

        // 2. Iterar sobre TODOS los candidatos
        for (const obj of [...objectCandidates, ...characterCandidates]) {
            if (!obj.rendered || typeof obj.getInteractionHint !== "function") continue;

            if (objectCandidates.includes(obj)) {
                const isObject = true;
            }
            if (characterCandidates.includes(obj)) {
                const isPlayer = true;
                //console.log(isPlayer, obj);                
            }

            // Actualizar estado de proximidad del candidato
            obj.update?.(this, dt);

            // Si la interacción cambió de mapa, abortar
            if (this.currentMap !== map) {
                this._interactPressed = false;
                return;
            }

            // Si está cerca y tiene hint, evaluar distancia
            if (obj.isNear && obj.getInteractionHint()) {
                const d = obj.interactionDistance ?? 0;
                if (d < bestDist) {
                    bestDist = d;
                    best = obj;
                }
            }
        }

        // 3. Gestionar el hint visual
        this._setInteractionHint(best);

        // 4. Ejecutar interacción si se presionó la tecla
        const pressed = this._interactPressed;
        this._interactPressed = false; // Resetear inmediatamente

        if (pressed && best) {
            this.runInteraction(best, () => best.interact());
        }
    }

    _setInteractionHint(obj) {
        const label = obj?.getInteractionHint() ?? null;
        const prev = this.interactionHint;
        if (prev?.object === obj && prev?.label === label) return;

        this.interactionHint = obj
            ? { object: obj, label, key: obj.interactionKey ?? "E" }
            : null;

        this.options.onInteractionHint?.(this.interactionHint);
    }

}