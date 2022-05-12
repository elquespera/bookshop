import { $ } from "./page-render.js";
// More book info class
export class Checkout {
    _pages = ['catalog', 'checkout', 'summary'];
    _page_blocks = this._pages.map(p => $('.'+p));
    _pageIndex = 0;
    _inputs = ['name', 'surname', 'delivery-date', 'street', 
    'house-number', 'flat-number'];    

    get page () {
        return this._pages[this._pageIndex];
    }

    get isCheckout () {
        return this.page === 'checkout';
    }

    navigate = (page) => {
        let index = this._pages.indexOf(page);
        index = Math.max(0, Math.min(index, page.length)) || 0;
        this._pageIndex = index;
        if (this.isCheckout) {
            $('form').reset();
        }
        this._page_blocks.forEach((p, i) => i === index ? p.style.display = 'block' : p.style.display = 'none');
        $('.checkout-basket-btn').style.display = this.isCheckout ? 'none' : 'block';
        document.documentElement.scrollTop = 0;
    }

}