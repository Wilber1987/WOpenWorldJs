//@ts-check

/**
 * Adapta un NPC al contrato de interacción del motor 3D,
 * comportándose exactamente igual que un ModernProp.
 */
export class NPCInteractionAdapter {
    /**
     * @param {any} npc
     * @param {any} mapData
     * @param {any} module
     */
    constructor(npc, mapData, module) {
        this.npc = npc;
        this.mapData = mapData ?? {};
        this.module = module;

        this.rendered = true;
        this.isNear = false;
        this.interactionDistance = Infinity;

        // Configuración de interacción (con fallbacks al NPC o valores por defecto)
        this.interactionKey = this.mapData.interactionKey ?? module.engine.interactKey?.toUpperCase?.() ?? "E";
        this.label = this.mapData.interactionLabel ?? this.mapData.label ?? npc.Name ?? "NPC";
        this.radius = this.mapData.interactionRadius ?? module.options.npcInteractionRadius ?? 1.8;
        
        this.width = this.mapData.interactionWidth ?? npc.width ?? 1;
        this.depth = this.mapData.interactionDepth ?? npc.depth ?? npc.width ?? 1;

        // 🔑 NUEVO: Soporte para Auto-Trigger (idéntico a ModernProp)
        this.automaticTrigger = this.mapData.automaticTrigger ?? false;
        this.interactionCooldown = this.mapData.interactionCooldown ?? 1.5;
        this._armed = false;       // se arma cuando el jugador sale del radio
        this._lastTrigger = -999;
    }

    /**
     * @param {any} engine
     * @param {number} dt
     */
    update(engine, dt) {
        const player = engine.getPlayerWorldPosition?.(); // Devuelve {x, y:0, z}

        if (!player) {
            this.isNear = false;
            this.interactionDistance = Infinity;
            return;
        }

        // 1. Cálculo de distancia al FOOTPRINT (idéntico a ModernProp._distanceToFootprint)
        // player.z es la coordenada Y del mapa del jugador
        const dx = Math.max(this.npc.x - player.x, 0, player.x - (this.npc.x + this.width));
        const dz = Math.max(this.npc.y - player.z, 0, player.z - (this.npc.y + this.depth));
        
        this.interactionDistance = Math.hypot(dx, dz);
        this.isNear = this.interactionDistance <= this.radius;

        // 2. Lógica de Auto-Trigger (idéntica a ModernProp.update)
        if (!this.isNear) {
            this._armed = true; // salió del radio: se rearma para la próxima
        } else if (
            this.automaticTrigger && 
            this.hasAction() && 
            this._armed && 
            !engine.isInteracting // El motor no está ejecutando otra acción
        ) {
            const now = performance.now() / 1e3;
            if (now - this._lastTrigger > this.interactionCooldown) {
                this._armed = false; // no vuelve a disparar hasta que el jugador salga
                this._lastTrigger = now;
                engine.runInteraction(this, () => this.interact());
            }
        }
    }

    getInteractionHint() {
        if (!this.isNear) return null;
        if (!this.hasAction()) return null;
        return this.label;
    }

    hasAction() {
        return Boolean(
            this.mapData.action ??
            this.mapData.Action ??
            this.npc.Action ??
            this.mapData.ActionQuestion ??
            this.npc.ActionQuestion
        );
    }

    async interact() {
        if (!this.isNear) return false;

        const engine = this.module.engine;

        // 1. Evaluar ActionQuestion si existe
        const actionQuestion = this.mapData.ActionQuestion ?? this.npc.ActionQuestion;
        if (typeof actionQuestion === "function") {
            const result = actionQuestion(this.npc, engine);
            const ok = result instanceof Promise ? await result : result;
            if (!ok) return false;
        }

        // 2. Ejecutar Action
        const action = this.mapData.action ?? this.mapData.Action ?? this.npc.Action;
        if (typeof action !== "function") return false;

        const result = action(this.npc, engine);
        if (result instanceof Promise) {
            await result;
        }

        return true;
    }
}