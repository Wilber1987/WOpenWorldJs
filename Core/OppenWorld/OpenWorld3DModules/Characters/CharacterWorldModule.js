//@ts-check

import { CharacterVisualManager } from "./CharacterVisualManager.js";
import { NPCController } from "./NPCController.js";
import { FollowerController } from "./FollowerController.js";

/**
 * Módulo separado para NPCs, followers y visuales de personajes 3D.
 */
export class CharacterWorldModule {
    /**
     * @param {any} engine
     * @param {{
     *   playerHeight?: number,
     *   npcHeight?: number,
     *   followerSpacing?: number,
     *   npcInteractionRadius?: number,
     *   manageLeaderAnimation?: boolean,
     *   managePlayerVisual?: boolean,
     *   CharactersUtil?: any
     * }} [options]
     */
    constructor(engine, options = {}) {
        this.engine = engine;

        this.options = {
            playerHeight:
                options.playerHeight ??
                engine.options?.playerHeight ??
                3,

            npcHeight:
                options.npcHeight ??
                engine.options?.npcHeight ??
                3,

            followerSpacing:
                options.followerSpacing ??
                1.2,

            npcInteractionRadius:
                options.npcInteractionRadius ??
                1.8,

            // Por ahora el motor 3D sigue gestionando al jugador.
            manageLeaderAnimation:
                options.manageLeaderAnimation ?? false,

            managePlayerVisual:
                options.managePlayerVisual ?? false,

            CharactersUtil: options.CharactersUtil ?? null,

            ...options
        };

        this.visuals = new CharacterVisualManager(engine);
        this.npcs = new NPCController(this);
        this.followers = new FollowerController(this);

        this.leader = engine.SelectedCharacter ?? null;
    }

    updateIndicators(dt) {
        this.visuals.updateIndicators(dt);
    }

    resolveLeader() {
        const characters = this.engine.Characters ?? [];

        let leader = null;

        if (this.options.CharactersUtil?.getLeader) {
            leader = this.options.CharactersUtil.getLeader(characters);
        }

        if (!leader) {
            leader =
                characters.find(c =>
                    !c.isFollower &&
                    (c.Stats?.hp ?? 1) > 0
                ) ??
                characters[0] ??
                null;
        }

        this.leader = leader;
        this.engine.SelectedCharacter = leader;

        return leader;
    }

    /**
     * @param {any} character
     * @param {boolean} [isFullPerspective]
     */
    async registerCharacter(character, isFullPerspective) {
        if (!character) return;

        if (!this.engine.Characters.includes(character)) {
            this.engine.Characters.push(character);
        }

        if (!this.leader) {
            this.resolveLeader();
        }

        const perspective =
            isFullPerspective ??
            this.engine.view?.Config?.isFullPerspective ??
            false;

        await character.RegisterWordMapCharacter?.(perspective);
    }

    /**
     * @param {any} map
     * @param {{x:number,y:number}} [position]
     */
    onMapEntered(map, position) {
        this.resolveLeader();

        if (this.leader && position) {
            this.leader.x = position.x;
            this.leader.y = position.y;
        }

        this.npcs.onMapEntered(map);
        this.followers.snapToLeader(this.leader);

        const keep = new Set([
            this.leader,
            ...this.followers.getFollowers(),
            ...this.npcs.getVisibleNPCs()
        ]);

        this.visuals.retainOnly(keep);

        if (this.options.managePlayerVisual && this.leader) {
            this.visuals.update(this.leader, {
                visible: (this.leader.Stats?.hp ?? 1) > 0,
                height: this.options.playerHeight
            });
        }
    }

    /**
     * @param {number} dt
     * @param {boolean} moving
     */
    update(dt, moving) {
        if (this.options.manageLeaderAnimation && this.leader) {
            try {
                this.leader.updateAnimation?.(dt, moving);
            } catch (error) {
                console.warn("Error animando líder", error);
            }
        }

        this.followers.update(this.leader, dt, moving);
        this.npcs.update(dt);

        if (this.options.managePlayerVisual && this.leader) {
            this.visuals.update(this.leader, {
                visible: (this.leader.Stats?.hp ?? 1) > 0,
                height: this.options.playerHeight
            });
        }
    }

    getInteractionCandidates() {
        return this.npcs.getInteractionCandidates();
    }

    dispose() {
        this.npcs.clear();
        this.visuals.dispose();
    }
}