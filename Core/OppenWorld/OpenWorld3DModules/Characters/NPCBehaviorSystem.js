//@ts-check

import { CameraDirectionUtil } from "./CameraDirectionUtil.js";

/**
 * Intérprete de comportamientos declarativos para NPCs.
 *
 * Nodos compuestos: schedule | sequence | selector
 * Nodos hoja:       patrol | goto | wait | wander | follow_player | say | face | script
 *
 * El estado interno vive en npc._ai (nodes por ruta del árbol),
 * y se resetea automáticamente al cambiar de rama activa.
 */
export class NPCBehaviorSystem {
    // ========================================================
    // ENTRY POINT
    // ========================================================
    /**
     * @param {any} npc
     * @param {any} engine
     * @param {number} dt
     * @param {any} mapData
     */
    static update(npc, engine, dt, mapData) {
        const root = mapData?.behavior ?? npc.behavior;
        if (!root) return;

        npc._ai ??= { nodes: new Map() };
        const ai = npc._ai;
        const ctx = this._ctx(npc, engine);

        // ── Descender el árbol hasta la hoja activa ──
        let node = root;
        let path = "";
        let guard = 0;

        while (node && this._isComposite(node) && guard++ < 8) {
            const st = this._nodeState(ai, path);
            const next = this._descend(node, st, ctx, ai, path);

            if (!next) { node = null; break; }

            path = path === "" ? String(next.index) : `${path}/${next.index}`;
            node = next.child;
        }

        if (!node) {
            npc.state = "idle";
            return;
        }

        // ── Ejecutar la hoja ──
        const st = this._nodeState(ai, path);
        const done = this._runLeaf(node, npc, engine, dt, ctx, st);

        if (done) st.done = true; // lo lee el `sequence` padre en el próximo frame
    }

    // ========================================================
    // CONTEXTO (disponible para condiciones `when`)
    // ========================================================
    static _ctx(npc, engine) {
        const t = engine.getGameTime?.() ?? { hour: 12, day: 1 };
        const player = engine.SelectedCharacter;

        return {
            npc,
            engine,
            hour: t.hour ?? 12,
            day: t.day ?? 1,
            player,
            distToPlayer: player
                ? Math.hypot(player.x - npc.x, player.y - npc.y)
                : Infinity,
            map: engine.currentMap
        };
    }

    // ========================================================
    // ÁRBOL: estado y poda
    // ========================================================
    static _isComposite(node) {
        return ["schedule", "sequence", "selector"].includes(node.type);
    }

    static _nodeState(ai, path) {
        let st = ai.nodes.get(path);
        if (!st) { st = {}; ai.nodes.set(path, st); }
        return st;
    }

    /** Borra el estado de un nodo y todos sus hijos. */
    static _prune(ai, prefix) {
        for (const key of [...ai.nodes.keys()]) {
            if (key === prefix || key.startsWith(prefix + "/")) {
                ai.nodes.delete(key);
            }
        }
    }

    static _childPath(path, index) {
        return path === "" ? String(index) : `${path}/${index}`;
    }

    // ========================================================
    // COMPUESTOS
    // ========================================================
    static _descend(node, st, ctx, ai, path) {
        switch (node.type) {
            // ── Por hora del mundo ──
            case "schedule": {
                const idx = this._scheduleIndex(node, ctx.hour);

                if (idx === -1) {
                    if (!node.fallback) return null;
                    if (st.index !== "f") {
                        st.index = "f";
                        this._prune(ai, this._childPath(path, "f"));
                    }
                    return { index: "f", child: node.fallback };
                }

                if (st.index !== idx) {
                    st.index = idx;
                    this._prune(ai, this._childPath(path, idx)); // estado fresco
                }

                return { index: idx, child: node.schedule[idx].run };
            }

            // ── Pasos en orden ──
            case "sequence": {
                st.step ??= 0;

                const childPath = this._childPath(path, st.step);
                const childState = ai.nodes.get(childPath);

                if (childState?.done) {
                    ai.nodes.delete(childPath);
                    st.step++;

                    if (st.step >= node.steps.length) {
                        if (node.loop) {
                            this._prune(ai, path);
                            st.step = 0;
                        } else {
                            st.done = true;
                            return null;
                        }
                    }
                }

                return { index: st.step, child: node.steps[st.step] };
            }

            // ── Primera condición verdadera ──
            case "selector": {
                const idx = node.conditions.findIndex(c => c.when?.(ctx));

                if (idx === -1) {
                    if (!node.fallback) return null;
                    if (st.index !== "f") {
                        st.index = "f";
                        this._prune(ai, this._childPath(path, "f"));
                    }
                    return { index: "f", child: node.fallback };
                }

                if (st.index !== idx) {
                    st.index = idx;
                    this._prune(ai, this._childPath(path, idx));
                }

                return { index: idx, child: node.conditions[idx].run };
            }
        }

        return null;
    }

    /** Soporta rangos que cruzan medianoche (22 → 6). */
    static _scheduleIndex(node, hour) {
        return node.schedule.findIndex(e =>
            e.from <= e.to
                ? (hour >= e.from && hour < e.to)
                : (hour >= e.from || hour < e.to)
        );
    }

    // ========================================================
    // HOJAS
    // ========================================================
    static _runLeaf(node, npc, engine, dt, ctx, st) {
        if (!st.entered) {
            st.entered = true;
            node.onEnter?.(npc, engine, ctx);
        }

        switch (node.type) {
            case "wait":
                return this._leafWait(npc, dt, node, st);

            case "goto":
                if (st.tx === undefined) {
                    const a = this._adjustPoint(engine.currentMap, npc, node.x, node.y);
                    st.tx = a.x; st.ty = a.y;
                }
                return this._moveToward(npc, st.tx, st.ty, node.speed ?? 2, dt, engine);
            case "patrol":
                return this._leafPatrol(npc, engine, dt, node, st);

            case "wander":
                return this._leafWander(npc, engine, dt, node, st);

            case "follow_player":
                return this._leafFollow(npc, engine, dt, node, ctx);

            case "say":
                return this._leafSay(npc, dt, node, st);

            case "face":
                npc.direction = node.direction ?? npc.direction;
                npc.state = "idle";
                return true;

            case "script":
                node.tick?.(npc, engine, dt, ctx);
                return node.done?.(npc, ctx) ?? false;

            default:
                npc.state = "idle";
                return true;
        }
    }

    // ── wait: descanso puro ──
    static _leafWait(npc, dt, node, st) {
        st.t ??= node.seconds ?? 2;
        npc.state = node.anim ?? "idle";
        if (node.direction) npc.direction = node.direction;
        if (!Number.isFinite(st.t)) return false;
        st.t -= dt;
        return st.t <= 0;
    }

    // ── patrol: ruta cíclica con pausas ──
    static _leafPatrol(npc, engine, dt, node, st) {
        const path = node.path;
        if (!path?.length) return true;

        st.i ??= 0;
        st.rounds ??= 0;
        st.phase ??= "move";
        if (!st.pathAdj) {
            st.pathAdj = node.path.map(p =>
                this._adjustPoint(engine.currentMap, npc, p.x, p.y)
            );
        }


        // Fase de pausa (en waypoint o aleatoria)
        if (st.phase === "pause") {
            st.t -= dt;
            npc.state = "idle";
            if (node.pauseDirection) npc.direction = node.pauseDirection;
            if (st.t <= 0) st.phase = "move";
            return false;
        }

        //const target = path[st.i];
        const target = st.pathAdj[st.i];
        const arrived = this._moveToward(
            npc, target.x, target.y, node.speed ?? 2, dt, engine
        );

        if (!arrived) {
            // Pausa aleatoria en pleno trayecto
            if (node.randomPause && st.phase === "move") {
                const chance = (node.randomPause.chancePerSec ?? 0.05) * dt;
                if (Math.random() < chance) {
                    st.phase = "pause";
                    st.t = this._rand(node.randomPause.min ?? 0.8, node.randomPause.max ?? 2);
                    npc.state = "idle";
                }
            }
            return false;
        }

        // Llegó al waypoint: pausa configurada o siguiente punto
        if (node.pauseAtWaypoints && !st.pausedHere) {
            st.pausedHere = true;
            st.phase = "pause";
            const p = node.pauseAtWaypoints;
            st.t = Array.isArray(p) ? this._rand(p[0], p[1]) : this._rand(p.min ?? 1, p.max ?? 3);
            npc.state = "idle";
            return false;
        }

        st.pausedHere = false;
        st.i++;

        if (st.i >= path.length) {
            st.i = 0;
            st.rounds++;
            if (node.rounds && st.rounds >= node.rounds) return true;
        }

        return false;
    }

    // ── wander: deambular alrededor de su punto inicial ──
    static _leafWander(npc, engine, dt, node, st) {
        st.home ??= { x: npc.x, y: npc.y };
        st.mode ??= "wait";
        st.t ??= this._rand(0.5, 2);

        if (node.duration != null) {
            st.elapsed = (st.elapsed ?? 0) + dt;
            if (st.elapsed >= node.duration) return true;
        }

        if (st.mode === "wait") {
            st.t -= dt;
            npc.state = "idle";
            if (st.t <= 0) {
                const range = node.range ?? 4;
                const raw = {
                    x: st.home.x + (Math.random() - 0.5) * range * 2,
                    y: st.home.y + (Math.random() - 0.5) * range * 2
                };
                st.target = this._adjustPoint(engine.currentMap, npc, raw.x, raw.y);
                st.mode = "move";
            }
            return false;
        }

        const arrived = this._moveToward(
            npc, st.target.x, st.target.y, node.speed ?? 1, dt, engine
        );

        if (arrived) {
            st.mode = "wait";
            st.t = this._rand(node.pauseMin ?? 1, node.pauseMax ?? 3);
        }

        return false;
    }

    // ── follow_player ──
    static _leafFollow(npc, engine, dt, node, ctx) {
        const player = ctx.player;
        if (!player) return false;

        const keep = node.distance ?? 3;

        if (ctx.distToPlayer > keep) {
            this._moveToward(npc, player.x, player.y, node.speed ?? 3.2, dt, engine);
        } else {
            npc.state = "idle";
            npc.direction = this._dirFromVector(
                player.x - npc.x, player.y - npc.y, npc.direction, engine
            );
        }

        return false;
    }

    // ── say: mensaje flotante con duración ──
    static _leafSay(npc, dt, node, st) {
        st.t ??= node.duration ?? 2;
        if (!st.said) {
            st.said = true;
            npc.SayIW?.(node.text ?? "...", st.t * 1000);
        }
        npc.state = "idle";
        st.t -= dt;
        return st.t <= 0;
    }

    // ========================================================
    // MOVIMIENTO CON COLISIÓN (sin auto-colisión)
    // ========================================================
    /**
     * Mueve al NPC hacia (tx,ty). Desliza por ejes. Devuelve true si llegó.
     * NUNCA consulta map.isBlocked(): evaluaría al NPC contra sí mismo.
     */
    static _moveToward(npc, tx, ty, speed, dt, engine) {
        const dx = tx - npc.x;
        const dy = ty - npc.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 0.08) {
            npc.state = "idle";
            return true;
        }

        const step = Math.min(speed * dt, dist);
        const nx = npc.x + (dx / dist) * step;
        const ny = npc.y + (dy / dist) * step;

        const map = engine.currentMap;
        let movedX = false, movedY = false;

        if (!map || !this._blockedAt(map, npc, nx, npc.y)) { npc.x = nx; movedX = true; }
        if (!map || !this._blockedAt(map, npc, npc.x, ny)) { npc.y = ny; movedY = true; }

        if (!movedX && !movedY) {
            npc._aiStuck = (npc._aiStuck ?? 0) + dt;
            npc.state = "idle";
            // Si llevamos ~0.4 s sin poder avanzar, asumimos "llegó al borde seguro"
            if (npc._aiStuck >= 0.4) { npc._aiStuck = 0; return true; }
            return false;
        }

        npc._aiStuck = 0;
        npc.direction = this._dirFromVector(
            movedX ? dx : 0,
            movedY ? dy : 0,
            npc.direction,
            engine
        );
        npc.state = "walk";

        return dist <= step + 0.05;
    }

    /**
     * Colisión del NPC contra el mundo, CON zona anti-oclusión.
     * Igual que GameEngine3D._canOccupy: radio efectivo = físico + padding.
     * @param {any} map
     * @param {any} self
     * @param {number} x
     * @param {number} y
     */
    static _blockedAt(map, self, x, y) {
        const radius =
            (self.collisionRadius ?? 0.20) +
            (self.collisionPadding ?? map.__npcPadding ?? 0.01);

        // Límites del mapa con el radio efectivo (como el jugador)
        if (
            x - radius < 0 ||
            y - radius < 0 ||
            x + radius >= map.w ||
            y + radius >= map.h
        ) return true;

        const minX = Math.floor(x - radius);
        const maxX = Math.floor(x + radius);
        const minY = Math.floor(y - radius);
        const maxY = Math.floor(y + radius);

        // 1) Objetos estáticos expandidos por el radio
        for (let tx = minX; tx <= maxX; tx++) {
            for (let ty = minY; ty <= maxY; ty++) {
                for (const o of map.objects ?? []) {
                    if (typeof o.occupies === "function" && o.occupies(tx, ty))
                        return true;
                }
            }
        }

        // 2) NPC vs NPC por círculos (excluyéndose a sí mismo)
        if (self.collision === false) return false;
        const r1 = self.collisionRadius ?? 0.35;

        for (const other of map.NPCs ?? []) {
            if (other === self) continue;
            if (other.isFollower) continue;
            if (other.collision === false) continue;
            if ((other.Stats?.hp ?? 1) <= 0) continue;

            const r2 = other.collisionRadius ?? 0.35;
            const rr = r1 + r2;
            const dx = x - other.x;
            const dy = y - other.y;
            if (dx * dx + dy * dy < rr * rr) return true;
        }

        return false;
    }
    /**
     * Mueve (x,y) al punto libre más cercano según _blockedAt (con radio).
     * Se llama UNA VEZ al iniciar la hoja, no cada frame.
     * @returns {{x:number,y:number}}
     */
    static _adjustPoint(map, self, x, y) {
        if (!map) return { x, y };
        if (!this._blockedAt(map, self, x, y)) return { x, y };

        const step = 0.25;
        const maxR = 3;
        const dirs = 16;

        for (let r = step; r <= maxR + 1e-6; r += step) {
            for (let i = 0; i < dirs; i++) {
                const a = (i / dirs) * Math.PI * 2;
                const nx = x + Math.cos(a) * r;
                const ny = y + Math.sin(a) * r;
                if (!this._blockedAt(map, self, nx, ny)) return { x: nx, y: ny };
            }
        }
        return { x, y }; // fallback: deja el original (el timeout lo saltará)
    }
    static _dirFromVector(dx, dy, fallback, engine) {
        return CameraDirectionUtil.getRelativeDirection(
            engine?.THREE,
            engine?.renderer?.camera,
            dx,
            dy,
            fallback,
            engine?.view?.Config?.isFullPerspective ?? false
        );
       
    }

    static _rand(min, max) { return min + Math.random() * (max - min); }
}

