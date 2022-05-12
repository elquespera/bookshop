import { $ } from "./page-render.js";

// More book info class
export class MoreInfo {
    _infoCards = document.querySelectorAll('.book-more-info');

    show = (id) => {
        this.hideAll();
        this._infoCards[id].style.display = 'flex';
    }
    hide = (id) => {
        this._infoCards[id].style.display = 'none';
    }
    hideAll = () => {
        this._infoCards.forEach((_, i) => this.hide(i));
    }
}