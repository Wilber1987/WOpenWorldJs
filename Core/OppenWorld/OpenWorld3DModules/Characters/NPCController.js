//@ts-check

import { NPCBehaviorSystem } from "./NPCBehaviorSystem.js";
import { NPCInteractionAdapter } from "./NPCInteractionAdapter.js";

export class NPCController {
    /**
     * @param {any} module
     */
    constructor(module) {
        this.module = module;
        this.map = null;

        /** @type {Map<any, NPCInteractionAdapter>} */
        this.adapters = new Map();
    }

    /**
     * @param {any} map
     */
    onMapEntered(map) {
        this.map = map;
        this.adapters.clear();

        const npcs = map?.NPCs ?? [];

        for (const npc of npcs) {
            if (npc.isFollower) continue;

            const mapData = this._getMapData(npc);

            if (mapData) {
                npc.x = mapData.posX ?? npc.x;
                npc.y = mapData.posY ?? npc.y;
            }

            npc.state = npc.state ?? "idle";
            npc.direction =
                mapData?.direction ??
                npc.direction ??
                "down";

            this._ensureSprites(npc);

            const hasInteraction =
                mapData?.action ||
                mapData?.Action ||
                mapData?.ActionQuestion ||
                npc.Action ||
                npc.ActionQuestion;

            if (hasInteraction) {
                this.adapters.set(
                    npc,
                    new NPCInteractionAdapter(npc, mapData ?? {}, this.module)
                );
            }
        }
    }

    /**
     * @param {any} npc
     */
    _getMapData(npc) {
        if (!this.map || !npc?.MapData) return null;
        return npc.MapData.find(d => d.name === this.map.name) ?? null;
    }

    /**
     * @param {any} npc
     */
    _ensureSprites(npc) {
        if (!npc) return;

        if (npc.isBasicRegistered) {
            this.module.visuals.update(npc, {
                visible: this.isVisible(npc),
                height: this.module.options.npcHeight
            });
            return;
        }

        const isFullPerspective =
            this.module.engine.view?.Config?.isFullPerspective ?? false;

        Promise.resolve(npc.ChargeBasicSprites?.(isFullPerspective))
            .catch(err => {
                console.warn("Error cargando sprites de NPC", npc?.Name, err);
            })
            .finally(() => {
                this.module.visuals.update(npc, {
                    visible: this.isVisible(npc),
                    height: this.module.options.npcHeight
                });
            });
    }

    /**
     * @param {any} npc
     */
    isVisible(npc) {
        if (!npc) return false;
        if (npc.isFollower) return false;
        if (npc.Stats?.hp <= 0) return false;

        const mapData = this._getMapData(npc);

        if (
            mapData?.rendered instanceof Function &&
            mapData.rendered() === false
        ) {
            return false;
        }

        return true;
    }

    getVisibleNPCs() {
        return (this.map?.NPCs ?? [])
            .filter(npc => !npc.isFollower && this.isVisible(npc));
    }

    // En NPCController.js

    /**
     * @param {number} dt
     */
    update(dt) {
        const npcs = this.map?.NPCs ?? [];

        for (const npc of npcs) {
            if (npc.isFollower) continue;

            const visible = this.isVisible(npc);
            const mapData = this._getMapData(npc);

            if (visible) {
                // 1. 🧠 EJECUTAR CEREBRO (AI/Script)
                // Esto modifica npc.x, npc.y, npc.direction, npc.state
                NPCBehaviorSystem.update(npc, this.module.engine, dt, mapData);

                // 2. 🏃 ACTUALIZAR ANIMACIÓN
                // Ahora usamos el estado real (walk/idle) definido por la AI
                try {
                    const isMoving = npc.state === "walk";
                    npc.updateAnimation?.(dt, isMoving);
                } catch (error) {
                    console.warn("Error animación NPC", npc?.Name, error);
                }
            }

            // 3. 🎨 ACTUALIZAR VISUAL 3D
            this.module.visuals.update(npc, {
                visible,
                height: this.module.options.npcHeight
            });
        }

        // 4. 🖐️ ACTUALIZAR INTERACCIÓN (Proximidad)
        for (const adapter of this.adapters.values()) {
            adapter.update(this.module.engine, dt);
            // 👈 NUEVO: Mostrar indicador si está cerca y tiene una acción definida
            const showHint = adapter.isNear && adapter.hasAction();
            this.module.visuals.setIndicator(
                adapter.npc,
                showHint,
                adapter.interactionKey // Ej: "E"
            );
        }
    }

    getInteractionCandidates() {
        return [...this.adapters.values()]
            .filter(adapter => this.isVisible(adapter.npc));
    }

    clear() {
        this.adapters.clear();
        this.map = null;
    }
}