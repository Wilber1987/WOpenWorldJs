//@ts-check
const translate = JSON.parse(localStorage.getItem("translate") ?? "[]");

const domainUrl = "./Media";
export class Scene {
    /**
     * Extrae del string de una escena las cláusulas de Ren'Py que NO forman
     * parte de la ruta de la imagen:
     *
     *   `scene foo with Dissolve(0.3)`  -> effect: { name: "Dissolve", duration: 0.3 }
     *   `scene foo with pushdown`       -> effect: { name: "pushdown", duration: undefined }
     *   `scene foo at force_zoom(2)`    -> transform: { name: "force_zoom", args: ["2"] }
     *
     * Devuelve siempre `{ cleanUrl, sceneEffect, sceneTransform }`.
     *
     * @param {string} url
     * @returns {{ cleanUrl: string, sceneEffect: { name: string, duration?: number, args: string[] } | null, sceneTransform: { name: string, args: string[], raw: string } | null }}
     */
    static ParseUrl(url) {
        if (typeof url !== "string") {
            return { cleanUrl: url, sceneEffect: null, sceneTransform: null };
        }

        let cleanUrl = url;
        /** @type {{ name: string, duration?: number, args: string[] } | null} */
        let sceneEffect = null;
        /** @type {{ name: string, args: string[], raw: string } | null} */
        let sceneTransform = null;

        // `with <Nombre>(<args>)` — normalmente al final del string.
        // Acepta un `:` residual que deja el decompilador (ej. "black with fade:").
        const withRe = /\s+with\s+([A-Za-z_][A-Za-z0-9_]*)(?:\s*\(([^)]*)\))?\s*:?\s*$/;
        // `at <transform>(<args>)` — puede aparecer antes o después de `with`.
        const atRe = /\s+at\s+([A-Za-z_][A-Za-z0-9_]*)(?:\s*\(([^)]*)\))?\s*$/;

        // Extraer en bucle para soportar `at ... with ...` y `with ... at ...`,
        // y por si el decompilador dejó más de una cláusula.
        let changed = true;
        while (changed) {
            changed = false;

            const withMatch = cleanUrl.match(withRe);
            if (withMatch) {
                if (!sceneEffect) {
                    const args = withMatch[2]
                        ? withMatch[2].split(",").map((s) => s.trim()).filter(Boolean)
                        : [];
                    const numeric = args.length > 0 ? Number(args[0]) : NaN;
                    sceneEffect = {
                        name: withMatch[1],
                        duration: Number.isFinite(numeric) ? numeric : undefined,
                        args
                    };
                }
                cleanUrl = cleanUrl.slice(0, withMatch.index).trim();
                changed = true;
                continue;
            }

            const atMatch = cleanUrl.match(atRe);
            if (atMatch) {
                if (!sceneTransform) {
                    const args = atMatch[2]
                        ? atMatch[2].split(",").map((s) => s.trim()).filter(Boolean)
                        : [];
                    sceneTransform = {
                        name: atMatch[1],
                        args,
                        raw: atMatch[0].trim()
                    };
                }
                cleanUrl = cleanUrl.slice(0, atMatch.index).trim();
                changed = true;
            }
        }

        return { cleanUrl, sceneEffect, sceneTransform };
    }

    /**
     * @param {string} url
     * @param {string|undefined} [audio]
     */
    static Show(url, audio, loopAudio = true, isAffectedByTime = false) {
        const { cleanUrl, sceneEffect, sceneTransform } = Scene.ParseUrl(url);
        return {
            type: "scene",
            image: `${domainUrl}/${cleanUrl}`,
            audio: audio ? `${domainUrl}/${audio}` : null,
            isAffectedByTime: isAffectedByTime,
            loopAudio,
            sceneEffect,
            sceneTransform
        };
    }
    /**
     * @param {any} url
     * @param {any} [audio]
     */
    static ShowV(url, audio, loopScene = true, loopAudio = true) {
        return {
            type: "scene",
            video: `${domainUrl}/${url}`,
            audio: audio ? `${domainUrl}/${audio}` : null,
            loopScene,
            loopAudio
        };
    }
}

export class Character {
    static GetKey() {
        //throw new Error("Method not implemented.");
    }
    /**
     * @param {any} who
     * @param {any} image
     */
    static Show(who, image, position = "center") {
        return {
            type: "show", who,
            image: typeof image === "string" ? `${domainUrl}/${image}` : image.map((/** @type {String} */ img) => Character.getURI(img)),
            position
        };
    }

    /**
     * @param {string|Image} img
     */
    static getURI(img) {
        // @ts-ignore
        if (img.__proto__ == Image.prototype) {
            // @ts-ignore
            return img.src;
        }
        return `${domainUrl}/${img}`;
    }

    /**
     * @param {any} who
     * @param {any} image
     */
    static ShowR(who, image) {
        return this.Show(who, image, "right");
    }

    /**
     * @param {any} who
     * @param {any} image
     */
    static ShowL(who, image) {
        return this.Show(who, image, "left");
    }

    /**
     * @param {any} who
     */
    static Hide(who) {
        return { type: "hide", who };
    }
}

export class Dialogue {
    /**
     * @param {string} name
     * @param {string} text
     * @param {null | undefined} [audio]
     */
    static Say(name, text, audio, isFemale = false) {
        return { type: "say", name, text, audio: audio ? `${domainUrl}/${audio}` : null, isFemale };
    }

    /**
     * @param {string} text
     */
    static Narrate(text, audio = null) {
        return this.Say("", text, audio);
    }
}


export class FlowData {  
    /**@type {String?} */
    type = null
    /**@type {String?} */
    var = null
    /**@type {String?} */
    operator = null
    /**@type {any?} */
    value = null
}

export class Flow {
    /**
     * @param {string} target
     */
    static Jump(target) {
        return { type: "jump", target };
    }
    /**
    * @param {string} text
    * @param {Array<any>} action
    * @param {{ icon?: string, typeMenu?: string, 
    * render?: FlowData | boolean | Function,
    * position?: { xpos: number, ypos: number, heightPercent?: number, widthPercent?: number} }} [config] 
    * @returns {import("./VisualNovelEngine").ChoiceOption}
    */
    static Action(text, action, config) {
        if (config?.position?.heightPercent) {
            console.log(config);
        }
        const translated = translate.filter((/** @type {null | undefined} */ x) => x != null &&  x != undefined).find((/** @type {{ old: string; }} */ x) => x.old == text)?.new;
        return {
            text: translated ?? text,
            action,
            icon: config?.icon ? `./Media/${config?.icon}` : undefined,
            typeMenu: config?.typeMenu,
            xpos: config?.position?.xpos,
            ypos: config?.position?.ypos,
            heightPercent: config?.position?.heightPercent,
            widthPercent: config?.position?.widthPercent,
            render: config?.render
        };
    }

    /**
     * @param {( import("./VisualNovelEngine").SceneCommand 
     * | Function)[] } commands
     */
    static Block(commands) {
        return { type: "block", commands: commands };
    }

    /**
     * @param {any[]} options
     */
    static Choice(options) {
        return { type: "choice", options };
    }

    /**
     * @param {any} condition
     * @param {any} thenBlock
     * @param {any} [elseBlock]
     */
    static If(condition, thenBlock, elseBlock = []) {
        return { type: "if", condition, then: thenBlock, else: elseBlock };
    }

    /**
     * @param {string} variable
     * @param {string | number | boolean | undefined} [value]
     * @returns {import("./VisualNovelEngine").SceneCommand}
     */
    static Set(variable, value) {
        return { type: "set", var: variable, value };
    }

    /**
     * @param {any} duration
     */
    static Wait(duration) {
        return { type: "wait", duration };
    }

    // Operadores para condiciones
    /**
     * @param {string} name
     * @param {string | undefined} [operator]
     * @param {number | boolean | undefined | string} [value]
      *  @returns {import("./VisualNovelEngine").SceneCommand}
     */
    static Var(name, operator, value) {
        return { type: "variable", var: name, operator: operator ?? "==", value: value ?? true };
    }

    // Operadores para condiciones
    /**
     * @param {string} name
     * @param {number} [value]
      *  @returns {import("./VisualNovelEngine").SceneCommand}
     */
    static Sum(name, value) {
        return { type: "sum", var: name, operator: "+", value: value ?? 1 };
    }
    /**
    * @param {string} name
    * @param {number} [value]
     *  @returns {import("./VisualNovelEngine").SceneCommand}
    */
    static Substract(name, value) {
        return { type: "substrac", var: name, operator: "-", value: value ?? 1 };
    }

    /**
     * @param {FlowData[]} conditions
     */
    static And(...conditions) {
        return { type: "and", conditions };
    }
    /**
         * @param {FlowData[]} conditions
         */
    static Or(...conditions) {
        return { type: "or", conditions };
    }

    /**
     * @param {import("./VisualNovelEngine").SceneCommand} condition
     */
    static Not(condition) {
        return { type: "not", condition };
    }
    /**
     * @param {any[]} options
     * @param {Object<string, any>} config
     */
    static Menu(options, config = {}) {
        return {
            type: 'choice',
            options: options.map(option => ({
                ...option,
                typeMenu: config.typeMenu || 'FLOATING'
            }))
        };
    }
    /**
     * @param {string} hourOperator
     * @param {number} hourValue
     */
    static Time(hourOperator, hourValue) {
        return { type: "time", operator: hourOperator, value: hourValue };
    }
    /**
     * @param {string} audio
     */
    static PlayAudio(audio, loopAudio = true) {
        return {
            type: "audio",
            audio: audio ? `${domainUrl}/${audio}` : null,
            loopAudio
        };
    }
}
const mapBack = Flow.Action("", [Flow.Jump('MainMap')], { typeMenu: "TAB", icon: "Icons/map" });

export class MapScene {
    /**
     * @param {string} MapName
     * @param {any[]} Options
     * @param {{ type: string; audio: string | null; loopAudio: boolean; }} audio
     */
    // @ts-ignore
    static Go(MapName, Options, OptionalsMenus = [], audio, isAffectedByTime = false, aditionalBlocks = []) {
        //Options?.forEach();
        return [
            Scene.Show(MapName, undefined, true, isAffectedByTime),
            ...OptionalsMenus,
            Flow.Choice([mapBack, ...Options]),
            ...aditionalBlocks,
            audio
        ]
    }
}

const roomBack = Flow.Action("", [Flow.Jump('MainMap')], { typeMenu: "TAB", icon: "Icons/map" });

export class RoomScene {
    /**
     * @param {string} RoomName
     * @param {any} Commands
     * @param {any[]} Options
     * @param {undefined} audio
     * @param {boolean | undefined} isAffectedByTime
     */
    static Go(RoomName, Commands, Options, audio, isAffectedByTime) {
        Options?.forEach(option => {
            if (!option.position) {
                option.typeMenu = 'TAB'
            }
        });
        return [
            Scene.Show(RoomName, audio, true, isAffectedByTime),
            ...Commands,
            Flow.Choice([roomBack, ...Options])
        ]
    }
}
