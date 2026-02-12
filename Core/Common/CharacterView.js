//@ts-check
import { CharacterModel } from "./CharacterModel.js";
import { ComponentsManager, html } from "../WDevCore/WModules/WComponentsTools.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
import { CharacterCard } from "./CharacterCard.js";

class CharacterView extends HTMLElement {

    /**
     * @param {CharacterModel[]} Characters
     */
    constructor(Characters) {
        super();
        this.Characters = Characters.filter(char => char.isFemale);
        this.append(this.CustomStyle);
        this.Draw();
    }
    connectedCallback() {
        ComponentsManager.modalFunction(this);
    }
    close = () => {
        ComponentsManager.modalFunction(this);
        setTimeout(() => {
            this.remove();
        }, 500);
    }
    Draw = async () => {      

        const content = html`<div class="character-view">
            <div class="close-btn" onclick="${()=> this.close()}" id="closeBtn">×</div>
            <div class="characters-container">
                ${this.Characters.map(char => new CharacterCard(char))}               
            </div>            
        </div>`
        this.append(content)
    }

    update() {
        this.Draw();
    }
    CustomStyle = css`
        w-character-view {
            position: absolute;
            opacity: 0;
            pointer-events: none;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10001;
            transition: all 1s;
            background-color: #fff;
            display: block;
            height:100vh;
        }
        .character-view {  
            .characters-container {
                background-color: #fff;
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                padding: 20px;
            }
        }        
        .close-btn {
            position: absolute;
            top: 15px;
            right: 15px;
            background: #4a5568;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-weight: bold;
            font-size: 18px;
            z-index: 10;
        }
     `
}
customElements.define('w-character-view', CharacterView);
export { CharacterView  }