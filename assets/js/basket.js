import { $, renderBookItem } from "./page-render.js";

// Basket
export class Basket {
    _visible = false;
    _items = [];

    constructor () {
        this.renderBasket();
    }

    get visible () {
        return this._visible;
    }

    get itemsCount () {
        return this._items.reduce((total, item) => item.count ? total + item.count : total + 1, 0);
    }

    get basketEmpty () {
        return this.itemsCount === 0;
    }

    get totalPrice () {
        return this._items.reduce((total, item) => item.count ? total + item.count * item.price : total + item.price, 0);
    }

    renderBasket = () => {
        const basketFragment = new DocumentFragment();
        if (this.basketEmpty) {
            const empty = document.createElement('p');
            empty.textContent = 'Your shopping cart is empty. Please drag and drop items here or click Add to bag to get started.'
            basketFragment.appendChild(empty);
            $('.basket-total-price').textContent = '';
        } else {
            this._items.forEach((item, id) => {
                basketFragment.appendChild(renderBookItem(item, true));
            });
            $('.basket-total-price').textContent = 'Total: $' + this.totalPrice;
        }
        $('.basket-content').textContent = '';
        $('.basket-content').appendChild(basketFragment);
        $('.basket-count-badge').innerHTML = this.itemsCount;
        $('.basket-count-badge').style.display = this.basketEmpty ? 'none' : 'block';
        $('.remove-all-btn').disabled = this.basketEmpty;
        $('.checkout-basket-btn').disabled = this.basketEmpty;
    }

    toggle = () => {
        this._visible = !this._visible;
        $('.basket').style.display = this._visible ? 'flex' : 'none';
    }

    hide = () => {
        if (this.visible) {this.toggle()}
    }

    show = () => {
        if (!this.visible) {this.toggle()}
    } 


    addItem = (id) => {
        let ind = this._items.findIndex((item, i) => item.id === id);
        if (ind === -1) {
            bookData[id].count = 1;
            this._items.push(bookData[id]);
        } else {
            this._items[ind].count += 1;
        }        
        this.renderBasket();
    }

    removeItem = (id) => {
        let ind = this._items.findIndex((item, i) => item.id === id);
        if (ind !== -1) {
            this._items.splice(ind, 1);
            this.renderBasket();   
        } 
    }

    clear = () => {
        this._items = [];
        this.renderBasket();
    }
}