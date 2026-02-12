//@ts-check
import { CharacterModel } from "../Common/CharacterModel.js";
import { GameEngine } from "./GameEngine.js";
import { GameStartScreen } from "./OpenWordModules/GameStartScreen.js";
import { GameMap } from "./OpenWordModules/Models.js";
import { ComponentsManager, html, WRender } from "../WDevCore/WModules/WComponentsTools.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";



class OpenWorldEngineView extends HTMLElement {


    /**
     * @typedef {Object} ComponentsConfig 
        * @property {CharacterModel} [character] objeto
    **/
    /**
    * @param {ComponentsConfig} [Config] 
    */
    constructor(Config) {
        super();
        this.Config = Config

        if (Config?.character) {
            Config?.character.RegisterWordMapCharacter()
        }
        this.attachShadow({ mode: 'open' });
        this.shadowRoot?.append(this.CustomStyle);
        WRender.SetStyle(this, {
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            opacity: "0",
            pointerEvents: "none",
            height: "100vh"
        })
        /**@type {HTMLCanvasElement} */
        // @ts-ignore
        this.Canvas = html`<canvas id="view"></canvas>`;
        /**@type {HTMLCanvasElement} */
        // @ts-ignore
        this.MinimapCanvas = html`<canvas id="minimap"></canvas>`;
        this.Draw();
        this.GameEngine = new GameEngine(this);

    }
    connectedCallback() {
        //this.StartEngine();
        ComponentsManager.modalFunction(this);
    }
    Draw = async () => {
        const layout = html`<div id="stage-wrap">
            <div id="game">
                ${this.Canvas}
                <div id="hud"
                    style="position:absolute;left:8px;top:8px;color:#fff;font-family:monospace;background:rgba(0,0,0,0.35);padding:6px;border-radius:6px;font-size:13px">
                </div>
                <div id="battle-overlay">
                    <div id="battle-ui">
                        <div class="battle-header">¡COMBATE!</div>
                        <div class="battle-log" id="battle-log"></div>
                        <div class="turn-indicator" id="turn-indicator"></div>
                        <div class="combatants">
                            <div class="party" id="party-combatants"></div>
                            <div class="enemies" id="enemy-combatants"></div>
                        </div>
                        <div class="skills" id="skill-buttons"></div>
                    </div>
                </div>
            </div>
            <div id="ui">                
                <div class="panel">
                    <div class="row">
                        <label>Minimap</label>
                    </div>
                    ${this.MinimapCanvas}
                </div>
                <div class="panel">
                    <div class="row">
                        <label>Estado</label>
                    </div>
                    <div id="stateBox" class="small stat">Cargando...</div>
                </div>
                <div class="panel">
                    <div class="row">
                        <label>Iniciar Batalla de Prueba</label>
                    </div>
                    <button id="testBattle">Probar Batalla</button>
                </div>
            </div>
        </div>`;
        this.shadowRoot?.append(layout);
    }
    StartEngine() {
        this.GameEngine.active = true;

        const resizeCanvas = () => {
            /**@type {DOMRect} */
            // @ts-ignore
            const rect = this.Canvas.parentElement?.getBoundingClientRect();
            this.Canvas.style.width = rect.width + 'px'; this.Canvas.style.height = rect.height + 'px';
            this.Canvas.width = Math.floor(rect.width * DPR); this.Canvas.height = Math.floor(rect.height * DPR);
            this.GameEngine.cam.screenW = this.Canvas.width / DPR; this.GameEngine.cam.screenH = this.Canvas.height / DPR;
            // minimap
            this.MinimapCanvas.width = this.MinimapCanvas.clientWidth * DPR; this.MinimapCanvas.height = this.MinimapCanvas.clientHeight * DPR;
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        requestAnimationFrame(this.GameEngine.update.bind(this.GameEngine));
    }

    update() {
        this.Draw();
    }
    close = () => {
        ComponentsManager.modalFunction(this);
        setTimeout(() => {
            // @ts-ignore
            this.style.opacity = 0;
            this.style.pointerEvents = "none"
            this.GameEngine.active = false
        }, 500);
    }
    connectToDom = () => {
        ComponentsManager.modalFunction(this);
    }
    disconnectedCallback() {
        // Detener el motor
        if (this.GameEngine) {
            this.GameEngine.active = false;
        }

        // Opcional: limpiar listeners (aunque window listeners persisten)
        // Si quieres ser estricto, guarda referencias a los handlers y remuévelos.
    }
    /**
     * @param {GameMap} map
     */
    AddMap(map) {
        this.GameEngine.addMap(map);
    }
    /**
     * @param {string} mapName
     */
    GoToMap(mapName) {
        this.GameEngine.GoToMap(mapName);
    }

    Start() {
        this.shadowRoot?.append(new GameStartScreen({ OpenWorldEngine: this }))
        document.body.append(this)
    }

    CustomStyle = css`
        :root {
            --ui-h: 48px
        }

        html,
        body {
            height: 100%;
            margin: 0;
            font-family: Inter, system-ui, Arial
        }

        .app {
            display: grid;
            grid-template-rows: var(--ui-h) 1fr;
            height: 100vh
        }

        header {
            height: var(--ui-h);
            display: flex;
            align-items: center;
            padding: 6px 12px;
            gap: 12px;
            background: #111;
            color: #fff
        }

        header label {
            font-size: 13px
        }

        #stage-wrap {
            display: flex;
            gap: 12px;
            padding: 12px;
            overflow: hidden;
            background-color: #fff;
            height: 100%;
            box-sizing: border-box;
            width: 100%;
        }

        #game {
            flex: 1;
            position: relative;
            background: #222;
            border-radius: 8px;
            box-shadow: 0 6px 18px rgba(0, 0, 0, .6)
        }

        canvas {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 6px
        }

        #ui {
            width: 280px;
            flex: 0 0 280px;
            display: flex;
            flex-direction: column;
            gap: 12px
        }

        .panel {
            background: #111;
            padding: 10px;
            border-radius: 8px;
            color: #ddd
        }

        .small {
            font-size: 13px
        }

        .controls {
            display: flex;
            gap: 6px;
            flex-wrap: wrap
        }

        button,
        input,
        select {
            font-size: 13px;
            padding: 6px;
            border-radius: 6px;
            border: 1px solid #333;
            background: #0f0f0f;
            color: #eee
        }

        #minimap {
            width: 100%;
            height: 160px;
            background: #000;
            border-radius: 6px
        }

        .row {
            display: flex;
            gap: 8px
        }

        .muted {
            color: #9aa
        }

        .stat {
            font-size: 12px
        }

        /* Estilos para el sistema de batalla */
        #battle-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            z-index: 100;
            display: none;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            border-radius: 6px;
        }

        #battle-ui {
            width: 80%;
            max-width: 600px;
            background: #222;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 0 20px rgba(0, 100, 255, 0.3);
        }

        .battle-header {
            text-align: center;
            margin-bottom: 20px;
            font-size: 24px;
            color: #4af;
        }

        .battle-log {
            height: 120px;
            overflow-y: auto;
            background: #111;
            padding: 10px;
            border-radius: 6px;
            margin-bottom: 15px;
            font-size: 14px;
        }

        .combatants {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        .party,
        .enemies {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .combatant {
            padding: 8px;
            border-radius: 6px;
            background: #333;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .combatant.active {
            box-shadow: 0 0 0 2px #4af;
        }

        .combatant.dead {
            opacity: 0.5;
            background: #522;
        }

        .hp-bar {
            height: 6px;
            background: #333;
            border-radius: 3px;
            overflow: hidden;
            flex-grow: 1;
        }

        .hp-fill {
            height: 100%;
            background: #4af;
            transition: width 0.3s;
        }

        .hp-fill.low {
            background: #f44;
        }

        .skills {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-top: 10px;
        }

        .skill-btn {
            padding: 8px;
            background: #333;
            border: none;
            border-radius: 4px;
            color: white;
            cursor: pointer;
            transition: background 0.2s;
        }

        .skill-btn:hover {
            background: #444;
        }

        .skill-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .turn-indicator {
            text-align: center;
            margin: 10px 0;
            font-weight: bold;
            color: #4af;
        }          
     `
}
customElements.define('w-oppenworld-component', OpenWorldEngineView);
export { OpenWorldEngineView }


// --------------------------------------------------
// Config & Helpers
// --------------------------------------------------
export const DPR = Math.max(1, window.devicePixelRatio || 1);
export let TILE_SIZE = 32;
/**
 * @param {number} v
 * @param {number} a
 * @param {number} b
 */
export function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
/**
 * @param {number} a
 * @param {number} b
 * @param {number} t
 */
export function lerp(a, b, t) { return a + (b - a) * t; }

