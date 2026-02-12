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

        this.MapData = []
        Object.assign(this, props);
        // @ts-ignore
        this.Name =  this.Name ?? this.__proto__.constructor.name.replace("Model", "");
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
        this.tileHeight = undefined;        
        this.isNPC = false;
        this.Action = ()=> {} //TODO action de mapa;
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
        const translated = translate.find(x => x.old == text)?.new;
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

    /**
     * @param {string} src
     
    _loadSprite(src) {
        const img = new Image();
        img.src = src;
        return img;
    }*/

    static SpriteCache = new Map();

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

        const fps = this.animFPS[this.state] ?? 6;
        const frameTime = 1 / fps;

        this.animTimer += dt;
        while (this.animTimer >= frameTime) {
            this.animTimer -= frameTime;
            const frames = this.Sprites[this.state][this.direction];
            this.animFrame = (this.animFrame + 1) % frames.length;
        }
    }


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

    setLocation(arg0, arg1) {
        return "TODO";
    }
    SetNeedItem(arg0) {
        return "TODO";
    }

    GetNeedItem(arg0) {
        return "TODO";
    }

    GetLocation() {
        return "TODO";
    }

}