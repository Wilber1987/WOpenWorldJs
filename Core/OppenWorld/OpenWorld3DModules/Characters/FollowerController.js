//@ts-check

// 👇 1. IMPORTAR EL UTILITARIO COMPARTIDO (ajusta la ruta si es necesario)
import { CameraDirectionUtil } from "./CameraDirectionUtil.js";

export class FollowerController {
    /**
     * @param {any} module
     */
    constructor(module) {
        this.module = module;
        /** @type {{x:number,y:number}|null} */
        this._lastLeaderPos = null;
        /** Estado interno por follower (histéresis). */
        this._states = new WeakMap();
    }

    /**
     * @param {any} follower
     */
    _state(follower) {
        let st = this._states.get(follower);
        if (!st) {
            st = { moving: false };
            this._states.set(follower, st);
        }
        return st;
    }

    getFollowers() {
        const engine = this.module.engine;
        const set = new Set();

        for (const character of engine.Characters ?? []) {
            if (character.isFollower) set.add(character);
        }

        for (const npc of engine.currentMap?.NPCs ?? []) {
            if (npc.isFollower) set.add(npc);
        }

        return [...set];
    }

    /** Obligatorio al cambiar de mapa / teletransportar. */
    resetTracking() {
        this._lastLeaderPos = null;
    }

    /**
     * @param {any} leader
     */
    snapToLeader(leader) {
        if (!leader) return;

        this.resetTracking();

        const spacing = this.module.options.followerSpacing ?? 1.2;

        for (const follower of this.getFollowers()) {
            if (typeof follower.follow === "function") {
                follower.follow(leader);
            } else {
                const pos = this._getPosition(
                    leader.x,
                    leader.y,
                    leader.direction ?? "down",
                    spacing
                );
                follower.x = pos.x;
                follower.y = pos.y;
            }

            follower.direction = leader.direction ?? "down";
            follower.state = "idle";
            follower.animFrame = 0;
            follower.animTimer = 0;

            // 🔑 Sin histéresis residual tras el snap
            this._state(follower).moving = false;
        }
    }

    /**
     * @param {any} leader
     * @param {number} dt
     * @param {boolean} leaderMoving
     */
    update(leader, dt, leaderMoving) {
        if (!leader) return;

        dt = Math.min(Math.max(dt, 0), 0.05);
        if (dt <= 0) return;

        const opts = this.module.options;

        const spacing = opts.followerSpacing ?? 1.2;
        const catchUp = opts.followerCatchUp ?? 1.35;
        const responsiveness = opts.followerResponsiveness ?? 8;

        // ── Umbrales de histéresis ──
        const START_SPEED = opts.followerStartSpeed ?? 0.35;
        const STOP_SPEED = opts.followerStopSpeed ?? 0.12;
        const DIR_MIN = opts.followerDirMinSpeed ?? 0.50;
        const ARRIVE_EPS = opts.followerArriveEpsilon ?? 0.04;
        const DIR_MARGIN = opts.followerDirMarginRad ?? 0.12;

        const leaderSpeed = leader.speed ?? opts.moveSpeed ?? 3;
        const maxSpeed = leaderSpeed * catchUp;

        // Velocidad real del líder (feedforward)
        const lp = this._lastLeaderPos;
        const lvx = lp ? (leader.x - lp.x) / dt : 0;
        const lvy = lp ? (leader.y - lp.y) / dt : 0;
        this._lastLeaderPos = { x: leader.x, y: leader.y };

        const leaderSettled = Math.hypot(lvx, lvy) < STOP_SPEED;

        // Cadena de seguimiento
        let prevX = leader.x;
        let prevY = leader.y;
        let prevDir = leader.direction ?? "down";

        for (const follower of this.getFollowers()) {
            const st = this._state(follower);

            const target = this._getPosition(prevX, prevY, prevDir, spacing);

            const dx = target.x - follower.x;
            const dy = target.y - follower.y;
            const dist = Math.hypot(dx, dy);

            // Resorte + feedforward
            const vx = dx * responsiveness + lvx;
            const vy = dy * responsiveness + lvy;
            const desired = Math.hypot(vx, vy);

            let speedNow = 0;

            // ── 1) SNAP DE LLEGADA ──
            if (dist <= ARRIVE_EPS && leaderSettled) {
                follower.x = target.x;
                follower.y = target.y;
                speedNow = 0;
            } else if (desired > 1e-6 && dist > 1e-6) {
                const speed = Math.min(desired, maxSpeed);
                const step = Math.min(speed * dt, dist);

                follower.x += (vx / desired) * step;
                follower.y += (vy / desired) * step;

                speedNow = step / dt;
            }

            // ── 2) HISTÉRESIS walk / idle ──
            if (!st.moving && speedNow > START_SPEED) {
                st.moving = true;
            } else if (st.moving && speedNow < STOP_SPEED) {
                st.moving = false;
            }

            // ── 3) ORIENTACIÓN ESTABLE (RELATIVA A CÁMARA) ──
            if (!st.moving) {
                // ✅ Llegó: se alinea EN EL MISMO FRAME con el de delante.
                follower.direction = prevDir;
            } else if (speedNow > DIR_MIN) {
                // 👇 Usa el utilitario compartido para dirección relativa a cámara
                const candidate = this._directionFromVector(
                    vx, vy, follower.direction
                );

                if (
                    candidate !== follower.direction &&
                    this._needsTurn(follower.direction, vx, vy, DIR_MARGIN)
                ) {
                    follower.direction = candidate;
                }
            }

            try {
                follower.updateAnimation?.(dt, st.moving);
            } catch (error) {
                console.warn("Error animación follower", follower?.Name, error);
            }

            this.module.visuals.update(follower, {
                visible: (follower.Stats?.hp ?? 1) > 0,
                height: opts.playerHeight ?? 1.6
            });

            prevX = follower.x;
            prevY = follower.y;
            prevDir = follower.direction;
        }
    }

    /**
     * ¿El vector de movimiento se salió del sector de la dirección actual
     * más un margen? (histéresis angular, AHORA RELATIVA A CÁMARA)
     * @param {string} currentDir
     * @param {number} vx
     * @param {number} vy
     * @param {number} marginRad
     */
    _needsTurn(currentDir, vx, vy, marginRad) {
        const len = Math.hypot(vx, vy);
        if (len < 1e-6) return false;

        const engine = this.module.engine;
        const camera = engine.renderer.camera;
        const THREE = engine.THREE;

        // 1. Proyectar vector de movimiento a coordenadas de pantalla
        const movement = new THREE.Vector3(vx, 0, vy);
        if (movement.lengthSq() < 1e-8) return false;
        movement.normalize();

        const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
        right.y = 0; right.normalize();

        const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
        up.y = 0;
        if (up.lengthSq() < 1e-8) up.set(0, 0, -1);
        else up.normalize();

        // Componentes del movimiento en el espacio de la cámara
        const cx = movement.dot(right);
        const cy = movement.dot(up);

        // 2. Calcular ángulo relativo a pantalla (0 = arriba, horario positivo)
        const angle = Math.atan2(cx, -cy);
        const center = this._angleOf(currentDir);

        let delta = angle - center;
        while (delta > Math.PI) delta -= 2 * Math.PI;
        while (delta < -Math.PI) delta += 2 * Math.PI;

        const full = engine.view?.Config?.isFullPerspective ?? false;
        const halfSector = full ? Math.PI / 8 : Math.PI / 4; // 22.5° u 45°

        return Math.abs(delta) > halfSector + marginRad;
    }

    /**
     * Ángulo central de cada dirección (0 = up, horario positivo).
     * @param {string} dir
     */
    _angleOf(dir) {
        switch (dir) {
            case "up": return 0;
            case "up_right": return Math.PI / 4;
            case "right": return Math.PI / 2;
            case "down_right": return 3 * Math.PI / 4;
            case "down": return Math.PI;
            case "down_left": return -3 * Math.PI / 4;
            case "left": return -Math.PI / 2;
            case "up_left": return -Math.PI / 4;
            default: return 0;
        }
    }

    /**
     * Dirección del sprite RELATIVA A CÁMARA (delegado al utilitario compartido).
     * @param {number} dx - delta en map.x
     * @param {number} dy - delta en map.y (world.z)
     * @param {string} fallback
     */
    _directionFromVector(dx, dy, fallback) {
        return CameraDirectionUtil.getRelativeDirection(
            this.module.engine.THREE,
            this.module.engine.renderer.camera,
            dx,
            dy,
            fallback,
            this.module.engine.view?.Config?.isFullPerspective ?? false
        );
    }

    /**
     * Posición objetivo del follower DETRÁS del anterior en PANTALLA,
     * expresada en coordenadas de mundo (map.x, map.y→z).
     * @param {number} leaderX
     * @param {number} leaderY
     * @param {string} direction  - dirección RELATIVA A CÁMARA
     * @param {number} offsetTiles
     */
    _getPosition(leaderX, leaderY, direction, offsetTiles) {
        const engine = this.module.engine;
        const off = CameraDirectionUtil.getWorldBehind(
            engine.THREE,
            engine.renderer.camera,
            direction,
            offsetTiles
        );
        return { x: leaderX + off.x, y: leaderY + off.z };
    }
}