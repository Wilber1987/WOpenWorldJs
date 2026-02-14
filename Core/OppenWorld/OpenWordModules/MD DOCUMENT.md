#MD DOCUMENT


```javascript
//@ts-check

import { OpenWorldEngineView } from "../OpenWorldEngineView.js";

import { ComponentsManager, html } from "../../WDevCore/WModules/WComponentsTools.js";
import { css } from "../../WDevCore/WModules/WStyledRender.js";
import { BannerStyle } from "./BannerStyle.js";

export class GameStartScreen extends HTMLElement {
    /**
     * @typedef {Object} GameStartScreenConfig 
        * @property {OpenWorldEngineView} OpenWorldEngine objeto
    **/
    /**
     * @param { GameStartScreenConfig } Config
     */
    constructor(Config) {
        super();
        this.Config = Config
        this.gameEngine = this.Config.OpenWorldEngine.GameEngine;
        this.attachShadow({ mode: 'open' });
        this.initializeComponent();
    }

    connectedCallback() {
        this.show();
    }

    initializeComponent() {
        // Crear botones como propiedades del componente
        this.newGameBtn = html`<button class="menu-button new-game" 
            onclick="${() => this.handleNewGame()}">NEW GAME</button>`;

        this.continueBtn = html`<button class="menu-button continue" 
            onclick="${() => this.handleContinueGame()}">CONTINUE</button>`;

        this.saveBtn = html`<button class="menu-button save" 
            onclick="${() => this.handleSaveGame()}">SAVE GAME</button>`;

        this.optionsBtn = html`<button class="menu-button options" 
            onclick="${() => this.handleOpenOptions()}">OPTIONS</button>`;

        // Crear estructura HTML
        const container = html`<div class="container banner-body">
            ${BannerStyle}
            ${this.Banner}
            <div class="options-container">
                <h1 class="game-title">OPEN WORLD ENGINE</h1>
                <div class="menu-container">
                    ${this.newGameBtn}
                    ${this.continueBtn}
                    ${this.saveBtn}
                    ${this.optionsBtn}
                </div>  
            </div>            
            <div class="version-info">v1.0.0</div>
        </div>`;

        // Agregar al shadow DOM
        this.shadowRoot?.appendChild(this.Style);
        this.shadowRoot?.appendChild(container);
    }

    // Handlers para los botones
    handleNewGame() {
        this.hide()
        this.setupGameEngineIntegration()
    }

    handleContinueGame() {
    }

    handleSaveGame() {
    }

    handleOpenOptions() { }

    // Métodos públicos para control externo

    enableButton() { }

    disableButton() { }

    show() {
        ComponentsManager.modalFunction(this);
    }

    hide() {
        ComponentsManager.modalFunction(this);
        setTimeout(() => {
            this.remove();
        }, 500);
    }

    initializeGameEngine() {
        this.setupGameEngineIntegration();
    }

    setupGameEngineIntegration() {
        const firstMap = Object.keys(this.Config.OpenWorldEngine.GameEngine.maps)[0]
        this.Config.OpenWorldEngine?.StartEngine()
        this.Config.OpenWorldEngine?.GoToMap(firstMap);

    }

    Style = css`
        :host {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            font-family: 'Arial', sans-serif;
            color: #fff;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            z-index: 1000;
            display: none;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            border-radius: 6px;
        }

        .container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;    
            gap: 100px;       
        }

        .game-title {
            font-size: 8rem;
            color: #FFF;
            color: rgba(0, 0, 0, 0.6);
            text-align: center;
            font-family: "lato", sans-serif;
            font-weight: 300;
            font-size: 50px;
            letter-spacing: 10px;
            line-height: 1.15;
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
        }
        .options-container {
            display: flex;
            gap: 100px;

        }

        .menu-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            width: 300px;
        }

        .menu-button {
            padding: 1.2rem 2rem;
            font-size: 1.2rem;
            font-weight: bold;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
            color: #fff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            text-align: center;
            width: 100%;
        }

        .menu-button:hover {
            background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
        }

        .menu-button:active {
            transform: translateY(0);
        }

        .menu-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .menu-button.new-game {
            background: linear-gradient(135deg, #38a169 0%, #276749 100%);
        }

        .menu-button.new-game:hover:not(:disabled) {
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
        }

        .menu-button.continue {
            background: linear-gradient(135deg, #2b6cb0 0%, #2c5282 100%);
        }

        .menu-button.continue:hover:not(:disabled) {
            background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
        }

        .menu-button.save {
            background: linear-gradient(135deg, #dd6b20 0%, #c05621 100%);
        }

        .menu-button.save:hover:not(:disabled) {
            background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%);
        }

        .menu-button.options {
            background: linear-gradient(135deg, #718096 0%, #4a5568 100%);
        }

        .menu-button.options:hover:not(:disabled) {
            background: linear-gradient(135deg, #a0aec0 0%, #718096 100%);
        }

        .version-info {
            margin-top: 2rem;
            font-size: 0.9rem;
            color: rgba(0, 0, 0, 0.6);
            position: absolute;
            bottom: 30px;
        }
    `;
    Banner = html`<div class='wrap'>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
        <div class='tri'></div>
    </div>`
}

// Registrar el webcomponent
customElements.define('game-start-screen', GameStartScreen);

``` 

```javascript


import { TILE_SIZE, clamp, lerp } from "./OpenWorldEngineView.js";

//CORE

export class Camera {
    /**
     * @param {number} viewW
     * @param {number} viewH
     */
    constructor(viewW, viewH) {
        this.x = 0; this.y = 0; this.screenW = viewW; this.screenH = viewH; this.smooth = 0.12; this.zoom = 2.5;
    }
    /**
     * @param {{ x: any; y: any; }} target
     * @param {{ w: number; h: number; }} map
     */
    follow(target, map) {
        const halfW = (this.screenW / TILE_SIZE) / (2 * this.zoom);
        const halfH = (this.screenH / TILE_SIZE) / (2 * this.zoom);
        let tx = target.x, ty = target.y;
        tx = clamp(tx, halfW, map.w - halfW);
        ty = clamp(ty, halfH, map.h - halfH);
        this.x = lerp(this.x, tx, this.smooth);
        this.y = lerp(this.y, ty, this.smooth);
    }
}

```

```javascript

//@ts-check

import { vnEngine } from "../VisualNovel/VisualNovelEngine.js";
import { Character, Dialogue, Flow } from "../VisualNovel/VisualNovelModules.js";

const translate = JSON.parse(localStorage.getItem("translate") ?? "[]");

let TILE_SIZE = 32;
export class CharacterModel {
    /**
     * @param {Partial<CharacterModel>} [props]
     */
    constructor(props) {
        /**
         * @type {any[]}
         */
        this.MapData = []
        Object.assign(this, props);
        // @ts-ignore
        this.Name = this.Name ?? this.__proto__.constructor.name.replace("Model", "");
        //esta propiedad refleja la ruta imagen que debe usar segun cada estado
        /**@type {Object.<string, any>} */
        this.Sprites = {
            Angry: `Scene/sprites/${this.Name}/Angry.png`,
            Fear: `Scene/sprites/${this.Name}/Fear.png`,
            Happy: `Scene/sprites/${this.Name}/Happy.png`,
            Normal: `Scene/sprites/${this.Name}/Normal.png`,
            idle: { down: [], up: [], left: [], right: [] },
            walk: { down: [], up: [], left: [], right: [] },
            attack: { down: [], up: [], left: [], right: [] }
        };
        //estado del personaje
        this.x = 2;
        this.y = 2;
        this.speed = 6;
        this.state = 'idle'; // idle, walk, attack, etc.
        this.direction = 'down'; // up, down, left, right
        this.scale = 3; // factor de tamaño (1 = 1 bloque)
        //estadisticas del persaonaje
        /**@type {Object.<string, any>} */
        this.Stats = {
            hp: 30,
            maxHp: 30,
            strength: 5,
            speed: 5 // Para batalla
        }

        this.animFrame = 0;
        this.animTimer = 0;

        // Habilidades del personaje
        this.Skills = [
            { name: "Ataque Fuerte", description: "Un ataque poderoso que inflige daño extra", level: Math.floor(Math.random() * 5) + 1 },
            { name: "Defensa", description: "Aumenta la defensa temporalmente", level: Math.floor(Math.random() * 5) + 1 },
            { name: "Curación", description: "Restaura puntos de vida", level: Math.floor(Math.random() * 5) + 1 }
        ];

        // Historia del personaje
        this.Backstory = `Este es ${name}, un ${this.isFemale ? 'valiente heroína' : 'valiente héroe'} con una historia fascinante. Ha recorrido muchos lugares y enfrentado numerosos desafíos para llegar hasta donde está ahora.`;
        // Estado actual
        this.currentState = "Normal";
        // Nivel y experiencia
        this.Level = Math.floor(Math.random() * 50) + 1;
        this.Experience = Math.floor(Math.random() * 1000);
        // Inventario simulado
        this.Inventory = [
            { name: "Espada", type: "Arma", rarity: "Común" },
            { name: "Poción de Vida", type: "Consumible", rarity: "Común" },
            { name: "Amuleto Mágico", type: "Accesorio", rarity: "Raro" }
        ];
        /**
         * @type {number | undefined}
         */
        this.tileHeight = undefined;
        this.isNPC = false;
        this.Action = () => { } //TODO action de mapa;
        this.width = 1;
        this.height = 1.5;
        Object.assign(this, props);
        vnEngine.RegisterCharacter(this);        
    }

    RegisterWordMapCharacter = async () => {
        this.ChargeBasicSprites()
        this.Sprites.walk = {
            down: this._loadSpriteSequence(
                `Media/Scene/sprites/${this.Name}/walk_down`, 36
            ),
            up: this._loadSpriteSequence(
                `Media/Scene/sprites/${this.Name}/walk_up`, 36
            ),
            left: this._loadSpriteSequence(
                `Media/Scene/sprites/${this.Name}/walk_left`, 36
            ),
            right: this._loadSpriteSequence(
                `Media/Scene/sprites/${this.Name}/walk_right`, 36
            ),
        };

        this.Sprites.attack = {
            down: this._loadSpriteSequence(
                `Media/Scene/sprites/${this.Name}/attack_down`, 1
            ),
            up: this._loadSpriteSequence(
                `Media/Scene/sprites/${this.Name}/attack_up`, 1
            ),
            left: this._loadSpriteSequence(
                `Media/Scene/sprites/${this.Name}/attack_left`, 1
            ),
            right: this._loadSpriteSequence(
                `Media/Scene/sprites/${this.Name}/attack_right`, 1
            ),
        };
    }

    ChargeBasicSprites = async () => {
        this.Sprites.idle = {
            down: this._loadSpriteSequence(
                `Media/Scene/sprites/${this.Name}/idle_down`, 1
            ),
            up: this._loadSpriteSequence(
                `Media/Scene/sprites/${this.Name}/idle_up`, 1
            ),
            left: this._loadSpriteSequence(
                `Media/Scene/sprites/${this.Name}/idle_left`, 1
            ),
            right: this._loadSpriteSequence(
                `Media/Scene/sprites/${this.Name}/idle_right`, 1
            ),
        };
    }

    isFemale = false
    /**
     * Carga una secuencia de sprites numerados automáticamente
     * Ej: walk_down1.png ... walk_down4.png
     *
     * @param {string} basePath  Ruta SIN el número final
     * @param {number} frameCount Número de frames
     * @param {string} ext Extensión (png, webp, etc)
     * @param {number} startIndex Índice inicial (default = 1)
     * @returns {HTMLImageElement[]}
     */
    _loadSpriteSequence(basePath, frameCount, ext = 'png', startIndex = 1) {
        const frames = [];
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = `${basePath} (${startIndex + i}).${ext}`;
            frames.push(img);
        }
        return frames;
    }
    /**
     * @param {any} text
     * @param {any|undefined} audio
     */
    Say(text, audio = undefined) {
        const translated = translate.find((/** @type {{ old: any; }} */ x) => x.old == text)?.new;
        return Dialogue.Say(this.Name, text, audio, this.isFemale);
    }
    /**
     * @param {string | number} name
     */
    GetVar(name) {
        this.Stats[name] = vnEngine.variables[name];
        return this.Stats[name];
    }
    /**
     * @param {string | number} name
    * @param {any} value
     */
    SetVar(name, value) {
        return Flow.Set(this.Name + name, value);
    }

    /**
     * @param {string} name
     */
    SetLocation(name) {
        this.Stats[this.Name + "_In_Location"] = name
        vnEngine.variables[this.Name + "_In_Location"] = name
        //return Flow.Set(this.Name + "_In_Location", name);
    }
    /**
     * @param {string} name
     */
    isLocation = (name) => {
        console.log(this.GetVar(this.Name + "_In_Location") == name);
        return this.GetVar(this.Name + "_In_Location") == name;
    }

    Show(state = "Normal", position = "center") {
        return Character.Show(this.Name, this.Sprites[state] ?? this.Sprites["Normal"], position)
    }
    /**
     * @param {string | undefined} state
     */
    ShowR(state = "Normal") {
        return this.Show(state, "right");
    }
    /**
     * @param {string | undefined} state
     */
    ShowL(state = "Normal") {
        return this.Show(state, "left");
    }
    Hide() {
        return Character.Hide(this.Name);
    }

    //acciones de openworl
    static SpriteCache = new Map();
    /**
     * @param {string} src
    */
    _loadSprite(src) {
        if (CharacterModel.SpriteCache.has(src)) {
            return CharacterModel.SpriteCache.get(src);
        }
        const img = new Image();
        img.src = src;
        CharacterModel.SpriteCache.set(src, img);
        return img;
    }
    animFPS = {
        idle: 2,
        walk: 24,
        attack: 10
    };
    /**
     * @param {number} dt
     * @param {boolean} moving
     */
    updateAnimation(dt, moving) {
        const nextState = moving ? 'walk' : 'idle';

        if (this.state !== nextState) {
            this.state = nextState;
            this.animFrame = 0;
            this.animTimer = 0;
        }

        // @ts-ignore
        const fps = this.animFPS[this.state] ?? 6;
        const frameTime = 1 / fps;

        this.animTimer += dt;
        while (this.animTimer >= frameTime) {
            this.animTimer -= frameTime;
            const frames = this.Sprites[this.state][this.direction];
            this.animFrame = (this.animFrame + 1) % frames.length;
        }
    }


    /**
     * @param {{ drawImage: (arg0: any, arg1: number, arg2: number, arg3: number, arg4: number) => void; }} ctx
     * @param {{ x: number; zoom: number; screenW: number; y: number; screenH: number; }} cam
     */
    draw(ctx, cam) {
        const spriteList = this.Sprites[this.state][this.direction];
        const img = spriteList[this.animFrame];
        if (!img || !img.complete || img.naturalWidth === 0) return;

        const px = (this.x - cam.x) * TILE_SIZE * cam.zoom + cam.screenW / 2;
        const py = (this.y - cam.y) * TILE_SIZE * cam.zoom + cam.screenH / 2;

        const tileHeight = this.tileHeight ?? 1.5;

        const drawH = TILE_SIZE * cam.zoom * tileHeight;
        const aspect = img.naturalWidth / img.naturalHeight;
        const drawW = drawH * aspect;
        ctx.drawImage(
            img,
            px - drawW / 2,
            py - drawH / 2,
            drawW,
            drawH
        );
    }

    // En CharacterModel.js - método occupies() mejorado
    /**
     * Verifica si el NPC ocupa una posición específica en el grid
     * @param {number} tx - Coordenada X en tiles
     * @param {number} ty - Coordenada Y en tiles
     * @param {Object<string, any>} mapData
     * @returns {boolean}
     */
    occupies(tx, ty, mapData) {
        const npcTileX = Math.floor(mapData.posX);
        const npcTileY = Math.floor(mapData.posY);

        // Tamaño del NPC en tiles (por defecto 1x1)
        const width = this.width ?? 1;
        const height = this.height ?? 1.5;

        // Verificar si la posición está dentro del área del NPC
        return tx >= npcTileX && tx < npcTileX + width &&
            ty >= npcTileY && ty < npcTileY + height;
    }


    //------------

    /**
     * @param {any} arg0
     * @param {any} arg1
     */
    setLocation(arg0, arg1) {
        return "TODO";
    }
    /**
     * @param {any} arg0
     */
    SetNeedItem(arg0) {
        return "TODO";
    }
    /**
     * @param {any} arg0
     */
    GetNeedItem(arg0) {
        return "TODO";
    }

    GetLocation() {
        return "TODO";
    }

}

//@ts-check
// --------------------------------------------------
// Models

import { CharacterModel } from "../../Common/CharacterModel.js";

```

```javascript

// --------------------------------------------------
export class BlockObject {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {Object<string, any>} opts
     */
    constructor(x, y, w, h, opts) {
        this.x = x; this.y = y; this.w = w; this.h = h;
        this.durability = opts.durability ?? 100;
        this.weight = opts.weight ?? 1;
        this.movable = opts.movable ?? true;
        this.color = opts.color;
        this.Action = opts.Action || null; // function(engine)
        this.ActionQuestion = opts.ActionQuestion || null; // function(engine) -> bool|Promise
        this.autoTrigger = opts.autoTrigger ?? true; // if true, action runs when player steps on it (onEnter)
        this._lastTriggered = 0;
        this.icon = opts.icon
    }
    /**
     * @param {number} tx
     * @param {number} ty
     */
    occupies(tx, ty) {
        return tx >= this.x && tx < this.x + this.w && ty >= this.y && ty < this.y + this.h;
    }
}

export class GameMap {
    /**
     * @param {string} name
     * @param {any} w 64/48/32
     * @param {any} h 36/27/18
     */
    constructor(name, w, h, opts = {}) {
        this.name = name;
        this.w = w; this.h = h;
        /**
         * @type {any[]}
         */
        this.objects = [];
        this.bgColor = opts.bgColor || '#4aa3ff';
        this.bgImage = null;
        this.spawnX = opts.spawnX ?? 2;
        this.spawnY = opts.spawnY ?? 2;
        this.enemies = opts.enemies || []; // Enemigos disponibles en este mapa
        /**@type {Array<CharacterModel>} */
        this.NPCs = opts.NPCs ?? []; // Nuevo array independiente para NPCs agregado en options si no esta disponible cra un array vacio
        this.NPCs.forEach(npc => {
            npc.ChargeBasicSprites()
        });
        this.backgroundImage = null
        if (opts.backgroundImage) {
            this.setBackgroundImage(opts.backgroundImage)
        }
    }
    /**
     * @param {BlockObject} mapObject
     */
    addObject(mapObject) {
        if (typeof mapObject.icon === 'string') {
            const img = new Image();
            img.src = mapObject.icon;
            mapObject.icon = img;
        }
        this.objects.push(mapObject);

    }
    /**
     * @param {number} tx
     * @param {number} ty
     */
    // En Models.js - método isBlocked() actualizado
    /**
     * @param {number} tx
     * @param {number} ty
     */
    isBlocked(tx, ty) {
        if (tx < 0 || ty < 0 || tx >= this.w || ty >= this.h) return true;

        // 1. Verificar objetos bloqueantes
        for (const o of this.objects) {
            if (o.occupies(tx, ty)) return true;
        }

        // 2. Verificar NPCs con colisión (usando SOLO MapData, sin recursión)
        if (this.NPCs) {
            for (const npc of this.NPCs) {
                // Skip NPCs sin colisión
                if (npc.collision === false || npc.noCollision === true) continue;

                // Obtener posición DIRECTAMENTE desde MapData
                let npcX, npcY;
                if (npc.MapData) {
                    const mapData = npc.MapData.find(d => d.name === this.name);
                    if (mapData) {
                        npcX = mapData.posX;
                        npcY = mapData.posY;
                    }
                    if (npc.occupies(tx, ty, mapData)) return true;
                }
            }
        }

        return false;
    }    
    /**
    * @param {CharacterModel} npc
    */
    addNPC(npc) {
        // Crear una copia del NPC para este mapa (evitar modificar el original)
        const npcInstance = { ...npc };
        npcInstance.isNPC = true;

        // Buscar datos del mapa para este NPC
        let mapData = null;
        if (npc.MapData) {
            mapData = npc.MapData.find(data => data.name === this.name);
        }

        if (mapData) {
            // Intentar colocar en la posición especificada
            let finalX = mapData.posX;
            let finalY = mapData.posY;

            // Verificar si la posición está bloqueada y recalcular si es necesario
            if (this._isPositionBlocked(finalX, finalY)) {
                finalX = this._findAlternativePosition(finalX, finalY);
            }

            npcInstance.x = finalX;
            npcInstance.y = finalY;

            // Asignar la acción si existe
            if (mapData.action) {
                npcInstance.Action = mapData.action;
            }
        } else {
            // Sin MapData, colocar en posición aleatoria
            const randomPos = this._findRandomUnblockedPosition();
            npcInstance.x = randomPos.x;
            npcInstance.y = randomPos.y;
        }

        this.NPCs.push(npcInstance);
    }

    /**
     * Verifica si una posición está bloqueada (incluyendo otros NPCs)
     * @param {number} x 
     * @param {number} y 
     * @returns {boolean}
     */
    _isPositionBlocked(x, y) {
        const tileX = Math.floor(x);
        const tileY = Math.floor(y);

        // Verificar límites del mapa
        if (tileX < 0 || tileY < 0 || tileX >= this.w || tileY >= this.h) {
            return true;
        }

        // Verificar objetos bloqueantes
        if (this.isBlocked(tileX, tileY)) {
            return true;
        }

        return false;
    }

    /**
     * Encuentra una posición alternativa cerca de la posición original
     * @param {number} originalX 
     * @param {number} originalY 
     * @returns {{x: number, y: number}}
     */
    _findAlternativePosition(originalX, originalY) {
        const offsets = [
            [0, -1], [0, 1], [-1, 0], [1, 0], // direcciones cardinales
            [-1, -1], [-1, 1], [1, -1], [1, 1] // diagonales
        ];

        // Probar posiciones adyacentes
        for (const [dx, dy] of offsets) {
            const testX = originalX + dx;
            const testY = originalY + dy;

            if (!this._isPositionBlocked(testX, testY)) {
                return { x: testX, y: testY };
            }
        }

        // Si no se encuentra posición adyacente, usar posición aleatoria
        return this._findRandomUnblockedPosition();
    }

    /**
     * Encuentra una posición aleatoria no bloqueada en el mapa
     * @returns {{x: number, y: number}}
     */
    _findRandomUnblockedPosition() {
        let attempts = 0;
        const maxAttempts = 100;

        while (attempts < maxAttempts) {
            const x = Math.random() * this.w;
            const y = Math.random() * this.h;

            if (!this._isPositionBlocked(x, y)) {
                return { x, y };
            }
            attempts++;
        }

        // Si todo falla, retornar posición por defecto
        return { x: this.spawnX, y: this.spawnY };
    }

    /**
     * Función pública para verificar si un NPC se puede colocar correctamente
     * @param {number} x 
     * @param {number} y 
     * @returns {boolean}
     */
    canPlaceNPCAt(x, y) {
        return !this._isPositionBlocked(x, y);
    }

    setBackgroundImage(imgOrUrl) {
        if (typeof imgOrUrl === 'string') {
            const img = new Image();
            img.src = imgOrUrl;
            this.backgroundImage = img;
        } else if (imgOrUrl instanceof HTMLImageElement) {
            this.backgroundImage = imgOrUrl;
        }
    }

    /**
 * Obtiene la posición real del NPC desde MapData
 * @param {CharacterModel} npc
 * @param {GameMap} map
 * @returns {{ x: number, y: number, action: Function|null, ActionQuestion: Function|null }}
 */
    // En GameEngine.js - método _getNPCPosition() actualizado
    _getNPCPosition(npc, map) {
        // Buscar datos del mapa para este NPC
        let mapData = null;
        if (npc.MapData) {
            mapData = npc.MapData.find(data => data.name === map.name);
        }

        if (mapData && typeof mapData.posX === 'number' && typeof mapData.posY === 'number') {
            // 👉 ELIMINAR verificación de posición bloqueada para evitar recursión
            // Simplemente usar la posición del MapData
            return {
                x: mapData.posX,
                y: mapData.posY,
                action: mapData.action || null,
                ActionQuestion: mapData.ActionQuestion || null,
                hasMapData: true
            };
        } else {
            // Sin MapData válido, colocar en posición aleatoria
            const randomPos = map._findRandomUnblockedPosition();
            return {
                x: randomPos.x,
                y: randomPos.y,
                action: null,
                ActionQuestion: null,
                hasMapData: false
            };
        }
    }


}

```


```javascript

//@ts-check
import { CharacterModel } from "../Common/CharacterModel.js";
import { BattleSystem } from "./OpenWordModules/BattleSystem.js";
import { clamp, DPR, OpenWorldEngineView, TILE_SIZE } from "./OpenWorldEngineView.js";
import { Camera } from "./Camera.js";
import { GameMap } from "./OpenWordModules/Models.js";

/**
 * @typedef {Object} MapObject
 * @property {number} x - La posición X del objeto en el mapa.
 * @property {number} y - La posición Y del objeto en el mapa.
 * @property {number} w - El ancho del objeto en el mapa (en tiles).
 * @property {number} h - La altura del objeto en el mapa (en tiles).
 * @property {string} [color] - El color del objeto para dibujado básico.
 * @property {HTMLImageElement | undefined} [icon] - El ícono del objeto (si es una imagen).
 * @property {number} [iconWidth] - El ancho del ícono (si es diferente al tamaño del tile).
 * @property {number} [iconHeight] - La altura del ícono (si es diferente al tamaño del tile).
 * @property {function(GameEngine): void} [Action] - La función de acción a ejecutar cuando se interactúa con el objeto.
 * @property {function(GameEngine): (boolean | Promise<boolean>)} [ActionQuestion] - La función de pregunta de acción a ejecutar.
 * @property {function(number, number): boolean} occupies - Método para verificar si el objeto ocupa un tile dado.
 * @property {number} [_lastTriggered] - Marca de tiempo del último trigger (para debounce).
 */

/**
 * @typedef {Object} NpcMapData
 * @property {string} name - El nombre del mapa al que se aplica esta configuración de NPC.
 * @property {number} posX - La posición X del NPC en este mapa.
 * @property {number} posY - La posición Y del NPC en este mapa.
 * @property {function(GameEngine): void} [action] - La función de acción específica para este NPC en este mapa.
 * @property {function(GameEngine): (boolean | Promise<boolean>)} [ActionQuestion] - La función de pregunta de acción específica para este NPC en este mapa.
 */

/**
 * @typedef {CharacterModel} NPC
 * @property {boolean} [isNPC] - Indica si el personaje es un NPC.
 * @property {Array<NpcMapData>} [MapData] - Datos específicos de posición y acción del NPC por mapa.
 * @property {string} [state] - El estado actual de la animación del NPC (e.g., 'idle').
 * @property {'up'|'down'|'left'|'right'} [direction] - La dirección actual del NPC (e.g., 'down').
 * @property {number} [animFrame] - El frame actual de la animación del NPC.
 * @property {number} [animTimer] - El temporizador de animación del NPC.
 * @property {Object.<string, Object.<string, HTMLImageElement[]>>} [Sprites] - Sprites del NPC por estado y dirección.
 * @property {number} [tileHeight] - Altura del NPC en unidades de tile.
 * @property {function(GameEngine): void} [Action] - La función de acción a ejecutar cuando se interactúa con el NPC (si no está en MapData).
 * @property {function(GameEngine): (boolean | Promise<boolean>)} [ActionQuestion] - La función de pregunta de acción a ejecutar cuando se interactúa con el NPC (si no está en MapData).
 */

/**
 * @typedef {Object} NpcPositionData
 * @property {number} x - La posición X calculada del NPC.
 * @property {number} y - La posición Y calculada del NPC.
 * @property {function(GameEngine): void | null} [action] - La función de acción del NPC.
 * @property {function(GameEngine): (boolean | Promise<boolean>) | null} [ActionQuestion] - La función de pregunta de acción del NPC.
 * @property {boolean} hasMapData - Indica si la posición se obtuvo de MapData o fue aleatoria.
 */

/**
 * @typedef {Object} AlertTarget
 * @property {number} x - La posición X del objetivo de la alerta.
 * @property {number} y - La posición Y del objetivo de la alerta.
 * @property {function(GameEngine): void | null} [Action] - La función de acción del objetivo.
 * @property {function(GameEngine): (boolean | Promise<boolean>) | null} [ActionQuestion] - La función de pregunta de acción del objetivo.
 * @property {boolean} isNPC - Indica si el objetivo es un NPC.
 * @property {MapObject} [objRef] - Referencia al objeto del mapa (si no es NPC).
 * @property {NPC} [npcRef] - Referencia al NPC (si es NPC).
 */

// --------------------------------------------------
// Engine
// --------------------------------------------------
export class GameEngine {
    /**
    * @param {OpenWorldEngineView} openWorldInstance
    */
    constructor(openWorldInstance) {
        /** @type {OpenWorldEngineView} */
        this.OpenWorldInstance = openWorldInstance;
        /** @type {Object.<string, GameMap>} */
        this.maps = {};
        /**@type {GameMap | null} */
        this.currentMap = null;
        /** @type {CharacterModel} */
        this.SelectedCharacter = openWorldInstance.Config?.character ?? new CharacterModel();
        /** @type {Camera} */
        this.cam = new Camera(100, 100);
        /** @type {Object.<string, boolean>} */
        this.keys = {};
        /** @type {number} */
        this.lastTs = 0;
        /** @type {Set<MapObject>} */
        this.overlaps = new Set(); // objects currently overlapped  

        /** @type {HTMLElement} */        
        // @ts-ignore
        this.hud = this.OpenWorldInstance.shadowRoot?.querySelector('#hud');
        /** @type {HTMLCanvasElement} */

        this.minimapCanvas = this.OpenWorldInstance.MinimapCanvas;
        /** @type {CanvasRenderingContext2D} */
        // @ts-ignore
        this.minictx = this.minimapCanvas?.getContext('2d');
        // Sistema de batalla
        /** @type {BattleSystem} */
        this.battleSystem = new BattleSystem(openWorldInstance);
        // En constructor de GameEngine
        /** @type {number} */
        this.minZoom = 0.4; // valor por defecto
        /** @type {number} */
        this.maxZoom = 2.5; // valor por defecto
        // input
        // En GameEngine.constructor()
        /** @type {boolean} */
        this.active = true;
        this._bindInputs();

        // Sistema de alertas
        /** @type {boolean} */
        this.alertVisible = false;
        /** @type {AlertTarget | null} */
        this.alertTarget = null;
        /** @type {number} */
        this.alertRadius = 2;  // Aumentar radio para probar
        /** @type {{x: number, y: number}} */
        this.alertOffset = { x: 0, y: -20 };
    }

    /**
     * Agrega un mapa al diccionario de mapas del motor.
     * @param {GameMap} map - El objeto GameMap a agregar.
     */
    addMap(map) { this.maps[map.name] = map; }

    /**
     * Cambia al mapa especificado y posiciona al personaje. Actualiza la cámara.
     * @param {string} name - El nombre del mapa al que ir.
     * @param {{x: number, y: number}} [pos] - La posición (x, y) opcional para el personaje en el nuevo mapa. Si no se proporciona, usa el spawn del mapa.
     */
    GoToMap(name, pos) {
        const target = this.maps[name];
        if (!target) { console.warn('Mapa no encontrado:', name); return; }
        this.currentMap = target;

        if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
            this.SelectedCharacter.x = pos.x;
            this.SelectedCharacter.y = pos.y;
        } else {
            this.SelectedCharacter.x = target.spawnX;
            this.SelectedCharacter.y = target.spawnY;
        }

        // reset overlaps y teclas
        this.overlaps.clear();
        this.keys = {}; // 👈 importante para que no "herede" teclas apretadas
        // centrar cámara
        this.cam.x = this.SelectedCharacter.x;
        this.cam.y = this.SelectedCharacter.y;

        // 👇 Actualizar límites de zoom según el mapa
        this.minZoom = 1.2
        console.log(`this.minZoom ${this.minZoom}`);
        this.maxZoom = 2.5;
        // Asegurar que el zoom actual esté dentro de los nuevos límites
        this.cam.zoom = clamp(this.cam.zoom, this.minZoom, this.maxZoom);

        // Centrar cámara en el jugador
        this.cam.x = this.SelectedCharacter.x;
        this.cam.y = this.SelectedCharacter.y;

        this._setState(`Entró a: ${target.name}`);


    }

    /**
     * Configura los escuchadores de eventos para la entrada del usuario (teclado, rueda del ratón, clic en minimapa).
     * @private
     */
    _bindInputs() {
        window.addEventListener('keydown', (e) => {
            const k = e.key.toLowerCase();
            // movement keys & action keys
            if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', 'z', 'x'].includes(k)) {
                e.preventDefault();
            }
            this.keys[k] = true;
            if (k === 'z') {
                this._onActionKey();
            }
        });
        window.addEventListener('keyup', (e) => { this.keys[e.key.toLowerCase()] = false; });

        // canvas wheel -> zoom
        const canvasEl = this.OpenWorldInstance.shadowRoot?.querySelector('#view');
        if (canvasEl) { // Added null check
            canvasEl.addEventListener('wheel', (e) => {
                e.preventDefault();
                // @ts-ignore
                const delta = -Math.sign(e.deltaY) * 0.12;
                this.cam.zoom = clamp(this.cam.zoom + delta, this.minZoom, this.maxZoom);
            }, { passive: false });
        }

        // minimap click to center
        if (this.minimapCanvas) { // Added null check
            this.minimapCanvas.addEventListener('click', (e) => {
                const r = this.minimapCanvas.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width;
                const y = (e.clientY - r.top) / r.height;
                if (this.currentMap) { this.cam.x = x * this.currentMap.w; this.cam.y = y * this.currentMap.h; }
            });
        }
    }

    /**
     * Maneja la acción del usuario (tecla 'z') para interactuar con objetos o NPCs cercanos.
     * @private
     */
    _onActionKey() {
        // Si hay una batalla activa, no procesar otras acciones
        if (this.battleSystem.isActive) return;
        if (!this.currentMap) return; // Add null check for currentMap

        // Primero: objetos regulares
        const tileX = Math.floor(this.SelectedCharacter.x);
        const tileY = Math.floor(this.SelectedCharacter.y);
        for (const mapObject of this.currentMap.objects) {
            if (!mapObject) continue;

            let isNow = mapObject.occupies(tileX, tileY);
            if (!isNow) isNow = mapObject.occupies(tileX + 1, tileY + 1);
            if (!isNow) isNow = mapObject.occupies(tileX - 1, tileY - 1);
            if (!isNow) isNow = mapObject.occupies(tileX, tileY + 1);
            if (!isNow) isNow = mapObject.occupies(tileX, tileY - 1);
            if (!isNow) isNow = mapObject.occupies(tileX - 1, tileY);
            if (!isNow) isNow = mapObject.occupies(tileX + 1, tileY);

            if (!isNow) continue;
            if (mapObject.ActionQuestion) {
                try {
                    const res = mapObject.ActionQuestion(this);
                    if (res instanceof Promise) {
                        res.then(ok => { if (ok && mapObject.Action) mapObject.Action(this); });
                    } else {
                        if (res && mapObject.Action) mapObject.Action(this);
                    }
                } catch (err) { console.error('Error in ActionQuestion', err); }
            } else if (mapObject.Action) {
                mapObject.Action(this);
            }
        }
        // Segundo: NPCs (interacción por proximidad) - usando solo posiciones desde MapData
        if (this.currentMap.NPCs) {
            for (const npc of this.currentMap.NPCs) {
                // 👉 USAR MÉTODO DEL MAPA
                const npcPositionData = this.currentMap._getNPCPosition(npc, this.currentMap);
                const npcTileX = Math.floor(npcPositionData.x);
                const npcTileY = Math.floor(npcPositionData.y);

                // Verificar si el jugador está adyacente al NPC
                const isAdjacent = Math.abs(tileX - npcTileX) <= 1 && Math.abs(tileY - npcTileY) <= 1;

                if (isAdjacent && npcPositionData.action) {
                    try {
                        if (npcPositionData.ActionQuestion) {
                            const res = npcPositionData.ActionQuestion(this);
                            if (res instanceof Promise) {
                                res.then(ok => { if (ok && npcPositionData.action) npcPositionData.action(this); });
                            } else {
                                if (res && npcPositionData.action) npcPositionData.action(this);
                            }
                        } else {
                            npcPositionData.action(this);
                        }
                    } catch (err) { console.error('Error in NPC Action', err); }
                }
            }
        }
    }
    /**
     * Actualiza el estado del juego en cada fotograma.
     * @param {number} ts - Marca de tiempo del fotograma actual.
     */
    update(ts) {
        if (!this.active) return; // 👈 detener si no está activo
        if (!this.lastTs) this.lastTs = ts; const dt = (ts - this.lastTs) / 1000; this.lastTs = ts;
        if (!this.currentMap) { requestAnimationFrame(this.update.bind(this)); return; }

        // Si hay una batalla activa, no procesar movimiento
        if (!this.battleSystem.isActive) {
            // movement
            // movimiento
            let dx = 0, dy = 0;
            if (this.keys["arrowup"] || this.keys["w"]) { dy = -1; this.SelectedCharacter.direction = "up"; }
            if (this.keys["arrowdown"] || this.keys["s"]) { dy = 1; this.SelectedCharacter.direction = "down"; }
            if (this.keys["arrowleft"] || this.keys["a"]) { dx = -1; this.SelectedCharacter.direction = "left"; }
            if (this.keys["arrowright"] || this.keys["d"]) { dx = 1; this.SelectedCharacter.direction = "right"; }

            if (dx !== 0 && dy !== 0) { const inv = 1 / Math.sqrt(2); dx *= inv; dy *= inv; }

            const moving = (dx || dy) !== 0;
            this.SelectedCharacter.updateAnimation(dt, moving);
            if (dx || dy) {
                const sp = this.SelectedCharacter.speed * dt;
                const nx = this.SelectedCharacter.x + dx * sp;
                const ny = this.SelectedCharacter.y + dy * sp;
                // simple collision: check destination tile
                if (!this.currentMap.isBlocked(Math.floor(nx), Math.floor(ny))) {
                    this.SelectedCharacter.x = nx; this.SelectedCharacter.y = ny;
                }
            }

            // overlap detection: onEnter triggers
            const tileX = Math.floor(this.SelectedCharacter.x);
            const tileY = Math.floor(this.SelectedCharacter.y);
            // 👇 NUEVO: Verificar proximidad para alertas
            this._checkAlertProximity();
        }

        // camera follow
        this.cam.follow(this.SelectedCharacter, this.currentMap);

        // draw
        this.draw();
        requestAnimationFrame(this.update.bind(this));
    }

    /**
     * Intenta activar una acción para un objeto si no se ha activado recientemente.
     * @param {MapObject} o - El objeto del mapa.
     * @param {number} [ts] - Marca de tiempo opcional para el debounce.
     * @private
     */
    _tryTrigger(o, ts) {
        const now = ts || performance.now();
        if (now - (o._lastTriggered || 0) < 300) return; // tiny debounce
        o._lastTriggered = now;
        if (o.Action) o.Action(this);
    }

    /**
     * Dibuja todos los elementos del juego en el canvas (fondo, cuadrícula, objetos, NPCs, jugador, HUD, minimapa, alertas).
     */
    draw() {
        const canvas = /** @type {HTMLCanvasElement | null | undefined} */(this.OpenWorldInstance.shadowRoot?.querySelector('#view'));
        if (!canvas) return; // Add null check for canvas

        const ctx = /** @type {CanvasRenderingContext2D | null | undefined} */(canvas.getContext('2d'));
        if (!ctx) return; // Add null check for ctx

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.scale(DPR, DPR);

        // background
        ctx.fillStyle = this.currentMap?.bgColor;
        ctx.fillRect(0, 0, this.cam.screenW, this.cam.screenH);

        // grid (optional subtle)
        const leftTile = Math.floor(this.cam.x - (this.cam.screenW / TILE_SIZE) / (2 * this.cam.zoom)) - 1;
        const rightTile = Math.ceil(this.cam.x + (this.cam.screenW / TILE_SIZE) / (2 * this.cam.zoom)) + 1;
        const topTile = Math.floor(this.cam.y - (this.cam.screenH / TILE_SIZE) / (2 * this.cam.zoom)) - 1;
        const bottomTile = Math.ceil(this.cam.y + (this.cam.screenH / TILE_SIZE) / (2 * this.cam.zoom)) + 1;
        ctx.lineWidth = 1 / this.cam.zoom; ctx.strokeStyle = 'rgba(0,0,0,0.12)';
        for (let tx = leftTile; tx <= rightTile; tx++) {
            for (let ty = topTile; ty <= bottomTile; ty++) {
                if (!this.currentMap) continue; // Added null check for currentMap
                if (tx < 0 || ty < 0 || tx >= this.currentMap.w || ty >= this.currentMap.h) continue;
                const px = (tx - this.cam.x) * TILE_SIZE * this.cam.zoom + this.cam.screenW / 2;
                const py = (ty - this.cam.y) * TILE_SIZE * this.cam.zoom + this.cam.screenH / 2;
                ctx.strokeRect(px, py, TILE_SIZE * this.cam.zoom, TILE_SIZE * this.cam.zoom);
            }
        }

        const bg = this.currentMap;
        if (!bg) return; // Add null check for bg

        // Dentro de draw(), justo antes de dibujar el fondo:
        const offsetX = -this.cam.x * TILE_SIZE * this.cam.zoom + this.cam.screenW / 2;
        const offsetY = -this.cam.y * TILE_SIZE * this.cam.zoom + this.cam.screenH / 2;
        // Dibujar fondo
        if (bg.backgroundImage && bg.backgroundImage.complete) {
            const mapPxW = bg.w * TILE_SIZE;
            const mapPxH = bg.h * TILE_SIZE;

            ctx.drawImage(
                bg.backgroundImage,
                0, 0,
                bg.backgroundImage.naturalWidth, bg.backgroundImage.naturalHeight,
                offsetX, offsetY,                 // 👈 posición relativa a la cámara
                mapPxW * this.cam.zoom,
                mapPxH * this.cam.zoom
            );
        } else {
            ctx.fillStyle = bg.bgColor;
            ctx.fillRect(0, 0, this.cam.screenW, this.cam.screenH);
        }

        // objects
        this.BuildObjects(ctx);

        // NPCs (dibujados después para que aparezcan encima de los objetos)
        this.BuildNPCs(ctx);

        // player
        const Character = this.SelectedCharacter;
        const ppx = (Character.x - this.cam.x) * TILE_SIZE * this.cam.zoom + this.cam.screenW / 2;
        const ppy = (Character.y - this.cam.y) * TILE_SIZE * this.cam.zoom + this.cam.screenH / 2;
       
        ctx.fillStyle = '#4af'; ctx.beginPath(); ctx.arc(ppx, ppy, 8 * this.cam.zoom, 0, Math.PI * 2);
        ctx.fill();
        this.SelectedCharacter.draw(ctx, this.cam);        
        // HUD text
        if (this.hud) { // Add null check for hud
            this.hud.innerText = `Pos: ${Character.x.toFixed(2)}, ${Character.y.toFixed(2)}
                        Map: ${this.currentMap?.name} • Zoom: ${this.cam.zoom.toFixed(2)}
                        Overlaps: ${this.overlaps.size}`;
        }
        // minimap
        this._drawMinimap();

        // 👉 NUEVO: Dibujar alerta ÚLTIMO (encima de todo)
        this._drawAlertIcon(ctx);

        // HUD text (ya existe)
        if (this.hud) { // Add null check for hud
            this.hud.innerText = `Pos: ${Character.x.toFixed(2)}, ${Character.y.toFixed(2)}
                    Map: ${this.currentMap?.name} • Zoom: ${this.cam.zoom.toFixed(2)}
                    Overlaps: ${this.overlaps.size}
                    ${this.alertVisible ? '💡 Z para interactuar' : ''}`;
        }
    }   

    // Método BuildNPCs actualizado - usa solo MapData, nunca las propiedades x/y del personaje
    // En GameEngine.js - método BuildNPCs() actualizado
    /**
     * Dibuja todos los NPCs en el canvas.
     * @param {CanvasRenderingContext2D} ctx - El contexto de renderizado 2D del canvas.
     * @private
     */
    BuildNPCs(ctx) {
        if (!this.currentMap?.NPCs) return;

        for (const npc of this.currentMap.NPCs) {
            // Obtener posición desde MapData
            let npcX = npc.x, npcY = npc.y; // Fallback to npc.x/y if MapData not found/valid
            if (this.currentMap) { // Added null check for currentMap
                const mapData = npc.MapData?.find(d => d.name === this.currentMap?.name); // Added null check for currentMap
                if (mapData) {
                    npcX = mapData.posX;
                    npcY = mapData.posY;
                }
            }

            // Verificar que el NPC tenga sprites cargados
            if (!npc.Sprites || !npc.Sprites.idle || !npc.Sprites.idle.down) {
                // Dibujar círculo de respaldo centrado en el tile
                const px = (npcX - this.cam.x) * TILE_SIZE * this.cam.zoom + this.cam.screenW / 2;
                const py = (npcY - this.cam.y) * TILE_SIZE * this.cam.zoom + this.cam.screenH / 2;
                ctx.fillStyle = '#ff6b6b';
                ctx.beginPath();
                ctx.arc(px, py, 8 * this.cam.zoom, 0, Math.PI * 2);
                ctx.fill();
                continue;
            }

            // Estado y dirección actual
            const currentState = npc.state || 'idle';
            const currentDirection = npc.direction || 'down';

            if (npc.Sprites[currentState] && npc.Sprites[currentState][currentDirection]) {
                const spriteList = npc.Sprites[currentState][currentDirection];
                const animFrame = npc.animFrame || 0;

                if (spriteList[animFrame]) {
                    const img = spriteList[animFrame];
                    if (img && img.complete && img.naturalWidth > 0) {
                        const px = (npcX - this.cam.x) * TILE_SIZE * this.cam.zoom + this.cam.screenW / 2;
                        const py = (npcY - this.cam.y) * TILE_SIZE * this.cam.zoom + this.cam.screenH / 2;

                        const tileHeight = npc.tileHeight ?? 1.5;
                        const drawH = TILE_SIZE * this.cam.zoom * tileHeight;
                        const aspect = img.naturalWidth / img.naturalHeight;
                        const drawW = drawH * aspect;

                        // ✅ CORRECTO: Pies centrados en el tile
                        ctx.drawImage(
                            img,
                            px + drawW / 3 ,  // Centrado horizontal
                            py,      // Anclado por pies
                            drawW,
                            drawH
                        );
                    }
                } 
            }
        }
    }
    // Método auxiliar para dibujar punto básico de NPC
    /**
     * Dibuja un punto básico para un NPC en el minimapa.
     * @param {{x: number, y: number}} npcPosition - La posición del NPC.
     * @param {CanvasRenderingContext2D} ctx - El contexto de renderizado 2D del canvas.
     * @private
     */
    BasicNpcPoint(npcPosition, ctx) {
        const px = (npcPosition.x - this.cam.x) * TILE_SIZE * this.cam.zoom + this.cam.screenW / 2;
        const py = (npcPosition.y - this.cam.y) * TILE_SIZE * this.cam.zoom + this.cam.screenH / 2;
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(px, py, 8 * this.cam.zoom, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Agrega un NPC al juego. Si el NPC tiene MapData, intenta posicionarlo según el mapa, de lo contrario, lo coloca aleatoriamente.
     * @param {NPC} npc - El objeto NPC a agregar.
     */
    addNPC(npc) {
        // Importante: NO crear una copia superficial, usar el mismo objeto NPC
        // o crear una instancia adecuada que mantenga las referencias a sprites
        const npcInstance = npc;
        npcInstance.isNPC = true;

        // Buscar datos del mapa para este NPC
        let mapData = null;
        if (npc.MapData) {
            // @ts-ignore // this.name is not defined in GameEngine
            mapData = npc.MapData.find(data => data.name === this.name); 
        }

        if (mapData && this.currentMap) { // Add null check for currentMap
            // Intentar colocar en la posición especificada
            let finalX = mapData.posX;
            let finalY = mapData.posY;

            // Verificar si la posición está bloqueada y recalcular si es necesario
            if (this.currentMap._isPositionBlocked(finalX, finalY)) {
                finalX = this.currentMap._findAlternativePosition(finalX, finalY);
            }

            npcInstance.x = finalX;
            npcInstance.y = finalY;

            // Asignar la acción si existe
            if (mapData.action) {
                npcInstance.Action = mapData.action;
            }
        } else if (this.currentMap) { // Add null check for currentMap
            // Sin MapData, colocar en posición aleatoria
            const randomPos = this.currentMap._findRandomUnblockedPosition();
            npcInstance.x = randomPos.x;
            npcInstance.y = randomPos.y;
        }
        // @ts-ignore // NPCs property is not defined on GameEngine, likely belongs to GameMap
        this.NPCs.push(npcInstance); // This is likely an error. NPCs should be part of currentMap
        
        // Inicializar el estado de animación para el NPC
        npcInstance.state = 'idle';
        npcInstance.direction = 'down';
        npcInstance.animFrame = 0;
        npcInstance.animTimer = 0;
       
        // Sistema de alertas (integrado, sin clases separadas)
        this.alertVisible = false;
        this.alertTarget = null; // BlockObject o NPC con acción
        this.alertRadius = 1.5;  // Radio en tiles para mostrar alerta
        this.alertOffset = { x: 0, y: -20 }; // Posición relativa al jugador (arriba)
    }

    /**
     * Dibuja todos los objetos del mapa en el canvas.
     * @param {CanvasRenderingContext2D} ctx - El contexto de renderizado 2D del canvas.
     * @private
     */
    BuildObjects(ctx) {
        if (!this.currentMap) return; // Add null check
        for (const mapObject of this.currentMap.objects) {
            const px = (mapObject.x - this.cam.x) * TILE_SIZE * this.cam.zoom + this.cam.screenW / 2;
            const py = (mapObject.y - this.cam.y) * TILE_SIZE * this.cam.zoom + this.cam.screenH / 2;

            if (mapObject.icon instanceof Image) {
                if (!mapObject.icon.complete || mapObject.icon.naturalWidth === 0) continue;

                const w = (mapObject.iconWidth ?? mapObject.w * TILE_SIZE) * this.cam.zoom;
                const h = (mapObject.iconHeight ?? mapObject.h * TILE_SIZE) * this.cam.zoom;

                ctx.drawImage(mapObject.icon, px, py, w, h);

            } else {
                // Solo dibujar si tiene un color definido

                if (mapObject.color && mapObject.color !== '') {
                    ctx.fillStyle = mapObject.color;
                    ctx.fillRect(
                        px,
                        py,
                        mapObject.w * TILE_SIZE * this.cam.zoom,
                        mapObject.h * TILE_SIZE * this.cam.zoom
                    );

                    if (this.overlaps.has(mapObject)) {
                        ctx.strokeStyle = '#fff';
                        ctx.lineWidth = 2 / this.cam.zoom;
                        ctx.strokeRect(
                            px,
                            py,
                            mapObject.w * TILE_SIZE * this.cam.zoom,
                            mapObject.h * TILE_SIZE * this.cam.zoom
                        );
                    }
                }
                // Si no hay color, no se dibuja nada → objeto "invisible"
                // ¡Pero sigue existiendo en this.currentMap.objects!
            }
        }
    }


    // Actualizar el minimapa para usar solo posiciones desde MapData
    /**
     * Dibuja el minimapa en el canvas dedicado.
     * @private
     */
    _drawMinimap() {
        const c = /** @type {HTMLCanvasElement | null | undefined} */(this.minimapCanvas);
        const ctx = /** @type {CanvasRenderingContext2D | null | undefined} */(this.minictx);
        if (!c || !ctx || !this.currentMap) return; // Add null checks

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.scale(DPR, DPR);
        ctx.fillStyle = '#0b0b0b';
        ctx.fillRect(0, 0, c.width / DPR, c.height / DPR);
        const px = (c.width / DPR) / this.currentMap.w;
        const py = (c.height / DPR) / this.currentMap.h;

        // Objetos regulares
        for (const o of this.currentMap.objects) {
            ctx.fillStyle = o.color;
            ctx.fillRect(o.x * px, o.y * py, o.w * px, o.h * py);
        }

        // NPCs en el minimapa - usando solo posiciones desde MapData
        if (this.currentMap.NPCs) {
            for (const npc of this.currentMap.NPCs) {
                const npcPositionData = this.currentMap._getNPCPosition(npc, this.currentMap);
                ctx.fillStyle = '#ff6b6b'; // Color distintivo para NPCs
                ctx.fillRect(npcPositionData.x * px - 1, npcPositionData.y * py - 1, 2, 2);
            }
        }

        // Jugador
        ctx.fillStyle = '#4af';
        ctx.fillRect(this.SelectedCharacter.x * px - 2, this.SelectedCharacter.y * py - 2, 4, 4);

        const camPW = (this.cam.screenW / TILE_SIZE) / this.cam.zoom;
        const camPH = (this.cam.screenH / TILE_SIZE) / this.cam.zoom;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect((this.cam.x - camPW / 2) * px, (this.cam.y - camPH / 2) * py, camPW * px, camPH * py);
    }

    /**
     * Establece el texto en la caja de estado del HUD.
     * @param {string} text - El texto a mostrar.
     * @private
     */
    _setState(text) {
        const el = this.OpenWorldInstance.shadowRoot?.querySelector('#stateBox');
        if (el) { // Add null check
            // @ts-ignore
            el.innerText = text || '...';
        }
    }
    // En GameEngine.js - nuevo método
    // Nuevo método: verificar objetos/NPCs interactivos cercanos
    /**
     * Verifica la proximidad del personaje a objetos o NPCs interactivos y actualiza el estado de la alerta.
     * @private
     */
    _checkAlertProximity() {
        if (!this.currentMap || !this.SelectedCharacter) {
            this.alertVisible = false;
            return;
        }

        const playerX = this.SelectedCharacter.x;
        const playerY = this.SelectedCharacter.y;
        let closestTarget = null;
        let closestDist = this.alertRadius;
        // 1. Verificar BlockObjects con Action/ActionQuestion
        for (const obj of this.currentMap.objects) {
            if (obj.Action || obj.ActionQuestion) {
                const dx = obj.x - playerX;
                const dy = obj.y - playerY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist <= this.alertRadius && dist < closestDist) {
                    closestDist = dist;
                    closestTarget = {
                        x: obj.x,
                        y: obj.y,
                        Action: obj.Action,
                        ActionQuestion: obj.ActionQuestion,
                        isNPC: false,
                        objRef: obj
                    };
                }
            }
        }

        // 2. Verificar NPCs con acciones en MapData
        if (this.currentMap.NPCs) {
            for (const npc of this.currentMap.NPCs) {
                const mapData = npc.MapData?.find(data => data.name === this.currentMap?.name);
                if (mapData && (mapData.action || mapData.ActionQuestion)) {
                    const npcPos = this.currentMap._getNPCPosition(npc, this.currentMap);
                    const dx = npcPos.x - playerX;
                    const dy = npcPos.y - playerY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist <= this.alertRadius && dist < closestDist) {
                        closestDist = dist;
                        closestTarget = {
                            x: npcPos.x,
                            y: npcPos.y,
                            Action: mapData.action,
                            ActionQuestion: mapData.ActionQuestion,
                            isNPC: true,
                            npcRef: npc
                        };
                    }
                }
            }
        }
        // Actualizar estado
        this.alertVisible = !!closestTarget;
        this.alertTarget = closestTarget;
    }
    // Nuevo método privado
    // Nuevo método: dibujar icono de alerta
    // Método actualizado: dibujar icono de alerta discreto
    /**
     * Dibuja el icono de alerta sobre el personaje cuando hay un objetivo interactivo cercano.
     * @param {CanvasRenderingContext2D} ctx - El contexto de renderizado 2D del canvas.
     * @private
     */
    _drawAlertIcon(ctx) {
        if (!this.alertVisible || !this.SelectedCharacter) return;

        // Calcular posición del jugador en pantalla
        const playerPx = (this.SelectedCharacter.x - this.cam.x) * TILE_SIZE * this.cam.zoom + this.cam.screenW / 2;
        const playerPy = (this.SelectedCharacter.y - this.cam.y) * TILE_SIZE * this.cam.zoom + this.cam.screenH / 2;

        // Calcular tamaño del sprite del jugador
        const tileHeight = this.SelectedCharacter.tileHeight ?? 1.5;
        const drawH = TILE_SIZE * this.cam.zoom * tileHeight;
        const drawW = drawH * 0.7; // Asumiendo aspect ratio aproximado

        // Posicionar icono en esquina superior izquierda del sprite
        // Offset adicional para que no quede pegado al sprite
        const offsetX = -drawW / 2 + 4 * this.cam.zoom;
        const offsetY = -drawH + 2 * this.cam.zoom;

        const px = playerPx + offsetX;
        const py = playerPy + (offsetY / 2);

        // Círculo blanco discreto
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(px, py, 6 * this.cam.zoom, 0, Math.PI * 2);
        ctx.fill();

        // Borde gris ligero
        ctx.strokeStyle = 'rgba(180, 180, 180, 0.7)';
        ctx.lineWidth = 1.5 * this.cam.zoom;
        ctx.stroke();

        // Signo de interrogación pequeño y sutil
        ctx.fillStyle = 'rgba(60, 60, 60, 0.9)';
        ctx.font = `bold ${10 * this.cam.zoom}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', px, py);

        // Efecto de parpadeo muy sutil
        const pulse = 0.08 * Math.sin(Date.now() / 200);
        ctx.globalAlpha = 0.7 + pulse;
        ctx.globalAlpha = 1.0;
    }
}

```


```javascript
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


```

```javascript
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

```




**USOS**
```JAVASCRIPT
//@ts-check

import { CharacterModel } from "../../Core/Common/CharacterModel.js";
import { BlockObject, GameMap } from "../../Core/OppenWorld/OpenWordModules/Models.js";
import { OpenWorldEngineView } from "../../Core/OppenWorld/OpenWorldEngineView.js";
import { vnEngine } from "../../Core/VisualNovel/VisualNovelEngine.js";
import { Dialogue, Flow, Scene } from "../../Core/VisualNovel/VisualNovelModules.js";
import { DanaCharacter } from "../Characters/DanaCharacter.js";

const getAsset = (/** @type {string} */ asset) => "./Media/assets/Maps/" + asset;

const npc1 = new CharacterModel({
    Name: "Mage",
    MapData: [
        {
            name: "Ciudad1", posX: 10, posY: 15, action: () => {
                vnEngine.startScene("npc1Chat");
            }
        }
    ]
});

vnEngine.defineScene("npc1Chat", [
    Scene.Show("Scene/Mage_Scene.png"),
    DanaCharacter.Say("..."),
    npc1.Show(),
    Flow.Choice([
        Flow.Action("Saludar", [
            DanaCharacter.Say("Hola"),
            Dialogue.Say("Mage", "Hola"),
            () => vnEngine.Disconnect()
        ])
    ])
]);

const oppenWorld = new OpenWorldEngineView({
    character: DanaCharacter
});


const npc2 = new CharacterModel({
    Name: "Mage",
    MapData: [
        { name: "Ciudad1", posX: 70, posY: 10, action: () => alert("Mantén la calma y sigue tu camino.") }
    ]
});

// --- Crear el mapa Ciudad1 ---
const ciudad1 = new GameMap('Ciudad1', 24, 24, {
    //const ciudad1 = new GameMap('Ciudad1', 46, 27, {
    //const ciudad1 = new GameMap('Ciudad1', 46, 27, {
    spawnX: 1,   // Punto de inicio del jugador
    spawnY: 1,
    bgColor: '#666', // Calle gris
    NPCs: [npc1, npc2], // <-- Aquí se pasan los NPCs desde la creación
    backgroundImage: getAsset("City1/MAP_CITY_01-01.png")
});

// --- Agregar edificios (bloques marrones) ---
// Edificio 1
ciudad1.addObject(new BlockObject(2, 2, 4, 4, {
    color: '#8B4513', // Marrón oscuro
    autoTrigger: true,
    icon: getAsset("City1/EDIFICIO (2).png")
}));

// Puerta del edificio 1 (amarilla)
ciudad1.addObject(new BlockObject(7, 9, 1, 1, {
    color: '#FFD700', // Amarillo
    autoTrigger: true,
    Action: () => {
        alert("Puerta del edificio 1. Próximamente: interior.");
    }
}));

// Pero como tu fondo ya es gris, quizás solo necesites dejar espacios libres.
// --- Añadir el mapa al motor ---
oppenWorld.AddMap(ciudad1);

// --- Ir al mapa ---
//oppenWorld.GoToMap("Ciudad1");

// --- Crear NPC's ---
export const goToCity1 = () => {
    oppenWorld.Start();// lo envia al primer mapa registrado
}
```

```JAVASCRIPT 
//@ts-check
import "./Maps/MainMap.js";
import { goToCity1 } from "./Maps/MainMap.js";


goToCity1();
```