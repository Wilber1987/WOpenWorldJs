//@ts-check
// --------------------------------------------------
// Sistema de Batalla

import { CharacterModel } from "../../Common/CharacterModel.js";

// --------------------------------------------------
export class BattleSystem {
    constructor(engine) {
        this.engine = engine;
        this.isActive = false;
        /**
         * @type {CharacterModel[]}
         */
        this.combatants = []; // Todos los participantes en la batalla
        this.turnOrder = [];
        this.currentTurnIndex = 0;
        this.battleLog = [];
        this.overlay = engine.shadowRoot.querySelector('#battle-overlay');
        this.battleLogEl = engine.shadowRoot.querySelector('#battle-log');
        this.turnIndicator = engine.shadowRoot.querySelector('#turn-indicator');
        this.partyCombatantsEl = engine.shadowRoot.querySelector('#party-combatants');
        this.enemyCombatantsEl = engine.shadowRoot.querySelector('#enemy-combatants');
        this.skillButtonsEl = engine.shadowRoot.querySelector('#skill-buttons');
    }

    // Iniciar una batalla
    /**
     * @param {CharacterModel[]} party
     * @param {CharacterModel[]} enemies
     * */
    startBattle(party, enemies) {
        this.isActive = true;
        this.combatants = [...party, ...enemies];
        this.battleLog = [];

        // Inicializar combatientes si no tienen estadísticas
        this.combatants.forEach(combatant => {
            combatant.Stats.maxHp = combatant.Stats.maxHp || combatant.Stats.hp || 1;
            combatant.Stats.hp = combatant.Stats.hp || combatant.Stats.maxHp;
            combatant.Stats.strength = combatant.Stats.strength || 1;
            combatant.Stats.speed = combatant.Stats.speed || 1;
            combatant.Skills = combatant.Skills || [this.createBasicAttack()];
        });

        // Calcular orden de turnos basado en velocidad
        this.calculateTurnOrder();

        // Mostrar la interfaz de batalla
        this.overlay.style.display = 'flex';

        // Actualizar la UI
        this.updateBattleUI();
        this.logBattleMessage("¡La batalla ha comenzado!");

        // Iniciar el primer turno
        this.startNextTurn();
    }

    // Calcular orden de turnos basado en velocidad
    calculateTurnOrder() {
        // Ordenar por velocidad (mayor primero)
        this.turnOrder = [...this.combatants].sort((a, b) => b.Stats.speed - a.Stats.speed);
    }

    // Iniciar el siguiente turno
    startNextTurn() {
        // Buscar el siguiente combatiente vivo
        let nextIndex = this.currentTurnIndex;
        let attempts = 0;

        do {
            nextIndex = (nextIndex + 1) % this.turnOrder.length;
            attempts++;

            if (attempts > this.turnOrder.length) {
                // No hay combatientes vivos, terminar batalla
                this.endBattle();
                return;
            }
        } while (this.turnOrder[nextIndex].hp <= 0);

        this.currentTurnIndex = nextIndex;
        const currentCombatant = this.turnOrder[this.currentTurnIndex];

        this.updateBattleUI();
        this.logBattleMessage(`Turno de ${currentCombatant.Name}`);

        // Si es un enemigo, ejecutar su turno automáticamente
        if (currentCombatant.isEnemy) {
            setTimeout(() => this.executeEnemyTurn(currentCombatant), 1000);
        } else {
            // Si es un aliado, mostrar habilidades
            this.showSkills(currentCombatant);
        }
    }

    // Ejecutar turno de enemigo
    executeEnemyTurn(enemy) {
        // Seleccionar un objetivo aleatorio vivo del grupo aliado
        const targets = this.combatants.filter(c => !c.isEnemy && c.Stats.hp > 0);

        if (targets.length === 0) {
            // No hay objetivos vivos, terminar batalla
            this.endBattle();
            return;
        }

        const target = targets[Math.floor(Math.random() * targets.length)];
        const skill = enemy.Skills[0]; // Usar la primera habilidad (ataque básico)

        this.useSkill(enemy, skill, target);
    }

    // Mostrar habilidades del combatiente actual
    showSkills(combatant) {
        this.skillButtonsEl.innerHTML = '';

        combatant.Skills.forEach(skill => {
            const button = document.createElement('button');
            button.className = 'skill-btn';
            button.textContent = skill.Name;
            button.onclick = () => {
                // Para simplificar, seleccionar el primer enemigo vivo como objetivo
                const targets = this.combatants.filter(c => c.isEnemy && c.Stats.hp > 0);
                if (this.targetEnemy && this.targetEnemy > 0) {
                    this.useSkill(combatant, skill, this.targetEnemy);
                }
                else if (targets.length > 0) {
                    this.useSkill(combatant, skill, targets[0]);

                }
                button.disabled = true;

            };
            this.skillButtonsEl.appendChild(button);
        });
    }

    // Usar una habilidad
    useSkill(user, skill, target) {
        // Calcular daño
        const damage = skill.calculateDamage(user, target);
        target.Stats.hp = Math.max(0, target.Stats.hp - damage);

        // Registrar mensaje
        this.logBattleMessage(`${user.Name} usa ${skill.name} contra ${target.Name} y causa ${damage} de daño.`);

        // Verificar si el objetivo murió
        if (target.Stats.hp <= 0) {
            this.logBattleMessage(`¡${target.Name} ha sido derrotado!`);
        }

        // Actualizar UI
        this.updateBattleUI();

        // Pasar al siguiente turno después de un breve delay
        setTimeout(() => {
            this.startNextTurn();
        }, 1500);
    }

    // Actualizar la interfaz de batalla
    updateBattleUI() {
        // Actualizar combatientes del grupo
        this.partyCombatantsEl.innerHTML = '';
        this.enemyCombatantsEl.innerHTML = '';

        const currentCombatant = this.turnOrder[this.currentTurnIndex];
        this.turnIndicator.textContent = `Turno: ${currentCombatant.Name}`;

        // Mostrar combatientes del grupo aliado
        this.combatants
            .filter(c => !c.isEnemy)
            .forEach(combatant => {
                const combatantEl = this.createCombatantElement(combatant);
                this.partyCombatantsEl.appendChild(combatantEl);
            });

        // Mostrar enemigos
        this.combatants
            .filter(c => c.isEnemy)
            .forEach(combatant => {
                const combatantEl = this.createCombatantElement(combatant);
                combatantEl.classList += " enemyBlock"
                combatantEl.addEventListener("click", () => {
                    this.targetEnemy = combatant;
                    this.enemyCombatantsEl.querySelectorAll(".enemyBlock")?.forEach(enemyBlock => {
                        enemyBlock.style.boxShadow = "";
                    })
                    combatantEl.style.boxShadow = "0 0 5px 0 red"

                })
                this.enemyCombatantsEl.appendChild(combatantEl);
            });

        // Actualizar log de batalla
        this.battleLogEl.scrollTop = this.battleLogEl.scrollHeight;
    }

    // Crear elemento de combatiente para la UI
    createCombatantElement(combatant) {
        const el = document.createElement('div');
        el.className = 'combatant';

        if (combatant.hp <= 0) {
            el.classList.add('dead');
        }

        if (combatant === this.turnOrder[this.currentTurnIndex]) {
            el.classList.add('active');
        }

        const hpPercent = (combatant.Stats.hp / combatant.Stats.maxHp) * 100;

        el.innerHTML = `
                    <div>
                        <div>${combatant.Name}</div>
                        <div class="small">HP: ${combatant.Stats.hp}/${combatant.Stats.maxHp}</div>
                    </div>
                    <div class="hp-bar">
                        <div class="hp-fill ${hpPercent < 30 ? 'low' : ''}" style="width: ${hpPercent}%"></div>
                    </div>
                `;

        return el;
    }

    // Registrar mensaje en el log de batalla
    logBattleMessage(message) {
        this.battleLog.push(message);
        this.battleLogEl.innerHTML = this.battleLog.map(msg => `<div>${msg}</div>`).join('');
    }

    // Terminar la batalla
    endBattle() {
        const aliveParty = this.combatants.filter(c => !c.isEnemy && c.Stats.hp > 0);
        const aliveEnemies = this.combatants.filter(c => c.isEnemy && c.Stats.hp > 0);

        if (aliveParty.length > 0 && aliveEnemies.length === 0) {
            this.logBattleMessage("¡Victoria! Todos los enemigos han sido derrotados.");
        } else if (aliveParty.length === 0 && aliveEnemies.length > 0) {
            this.logBattleMessage("Derrota... Todos los miembros del grupo han caído.");
        } else {
            this.logBattleMessage("La batalla ha terminado en empate.");
        }

        // Ocultar la interfaz después de un tiempo
        setTimeout(() => {
            this.overlay.style.display = 'none';
            this.isActive = false;
        }, 3000);
    }

    // Crear ataque básico
    createBasicAttack() {
        return {
            name: "Ataque Básico",
            calculateDamage: (user, target) => {
                return Math.max(1, user.Stats.strength);
            }
        };
    }
}
