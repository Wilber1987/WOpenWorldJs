//@ts-check
// --------------------------------------------------
// Models

import { CharacterModel } from "../../Common/CharacterModel.js";


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
     * @param {any} name
     * @param {number} width
     * @param {number} height
     * @param {number} floors
     */
    static GenerateDungeon(name, width, height, floors) {
        const maps = [];

        for (let f = 0; f < floors; f++) {
            const map = new GameMap(`${name}_Floor${f}`, width, height, "#222");
            map.spawnX = Math.floor(width / 2);
            map.spawnY = Math.floor(height / 2);

            // Obstáculos aleatorios
            for (let i = 0; i < (width * height) / 30; i++) {
                const ox = Math.floor(Math.random() * width);
                const oy = Math.floor(Math.random() * height);
                const ow = 1 + Math.floor(Math.random() * 3);
                const oh = 1 + Math.floor(Math.random() * 3);
                map.addObject(new BlockObject(ox, oy, ow, oh, "rock", "#555"));
            }

            // Puerta al piso anterior
            if (f > 0) {
                const doorDown = new BlockObject(1, 1, 1, 1, {
                    color: '#FFF',
                    autoTrigger: true, // teleports when character steps on it                        
                });
                doorDown.Action = (/** @type {{ GoToMap: (arg0: string) => void; }} */ engine) => {
                    engine.GoToMap(`${name}_Floor${f - 1}`);
                };
                map.addObject(doorDown);
            }

            // Puerta al piso siguiente
            if (f < floors - 1) {
                const doorUp = new BlockObject(width - 3, height - 3, 1, 1, {
                    color: '#FFF',
                    autoTrigger: true, // teleports when character steps on it                        
                });
                doorUp.Action = (/** @type {{ GoToMap: (arg0: string) => void; }} */ engine) => {
                    engine.GoToMap(`${name}_Floor${f + 1}`);
                };
                map.addObject(doorUp);
            }

            // Agregar algunos enemigos al mapa
            for (let i = 0; i < 3; i++) {
                const enemy = {
                    name: `Enemigo Piso ${f}`,
                    hp: 20 + f * 5,
                    maxHp: 20 + f * 5,
                    strength: 3 + f,
                    speed: 1 + Math.floor(f / 2),
                    isEnemy: true
                };
                map.enemies.push(enemy);
            }

            maps.push(map);
        }

        return maps;
    }

    //oficina
    /**
     * Genera una ciudad en grid con calles y edificios
     * @param {string} name
     * @param {number} width
     * @param {number} height
     * @param {{ streetWidth?: number, blockSize?: number }} options
     */
    static GenerateCity(name, width, height, options = {}) {
        const streetWidth = options.streetWidth ?? 2;
        const blockSize = options.blockSize ?? 8;

        const map = new GameMap(name, width, height, {
            spawnX: Math.floor(width / 2),
            spawnY: Math.floor(height / 2),
            bgColor: '#666'
        });

        // helper: es calle?
        const isStreet = (x, y) =>
            x % (blockSize + streetWidth) < streetWidth ||
            y % (blockSize + streetWidth) < streetWidth;

        // 1️⃣ Generar calles (bloqueadas visualmente pero transitables)
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (isStreet(x, y)) {
                    /*map.addObject(new BlockObject(x, y, 1, 1, {
                        color: '#444',
                        walkable: true
                    }));*/
                }
            }
        }

        // 2️⃣ Generar edificios por manzana
        for (let bx = 0; bx < width; bx += blockSize + streetWidth) {
            for (let by = 0; by < height; by += blockSize + streetWidth) {

                const startX = bx + streetWidth;
                const startY = by + streetWidth;

                if (startX + blockSize > width || startY + blockSize > height) continue;

                // edificio principal de la manzana
                const bw = blockSize - 1;
                const bh = blockSize - 1;

                const building = new BlockObject(startX, startY, bw, bh, {
                    color: '#8b5a2b',
                    walkable: false
                });

                map.addObject(building);

                // 3️⃣ Crear puerta (ingreso)
                const doorSide = Math.floor(Math.random() * 4);
                let dx = startX;
                let dy = startY;

                switch (doorSide) {
                    case 0: // arriba
                        dx += Math.floor(bw / 2);
                        dy -= 1;
                        break;
                    case 1: // abajo
                        dx += Math.floor(bw / 2);
                        dy += bh;
                        break;
                    case 2: // izquierda
                        dx -= 1;
                        dy += Math.floor(bh / 2);
                        break;
                    case 3: // derecha
                        dx += bw;
                        dy += Math.floor(bh / 2);
                        break;
                }

                const door = new BlockObject(dx, dy, 1, 1, {
                    color: '#FFD700',
                    autoTrigger: false,
                    Action: (engine) => {
                        alert(`Entraste a un edificio en ${name}`);
                    }
                });

                map.addObject(door);
            }
        }

        return map;
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