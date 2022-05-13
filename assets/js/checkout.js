import { $ } from "./page-render.js";

// More book info class
export class Checkout {
    _pages = ['catalog', 'checkout', 'summary'];
    _page_blocks = this._pages.map(p => $('.'+p));
    _pageIndex = 0;
    _form = $('.checkout-form');
    _inputs = ['name', 'surname', 'delivery-date', 'street', 
    'house-number', 'flat-number'].map(n => $('#user-' + n));
    _payment_radios = ['card', 'cash'].map(n => $('#user-payment-' + n));
    _gift_checkboxes = ['wrapping', 'postcard', 'discount', 'pen'].map(n => $('#user-gift-' + n));
    _all_inputs = [...this._inputs, ...this._payment_radios, ...this._gift_checkboxes];
    _hints = document.querySelectorAll('.input-hint');
    _submit = $('#submit-btn');

    constructor () {
        [...this._inputs, ...this._payment_radios].forEach(input => {
            input.addEventListener('invalid', event => {         
                event.preventDefault();
            });
        });

        this._inputs.forEach(input => {
            input.addEventListener('blur', event => {   
                this.reportValid(input); 
                this._submit.disabled = !this.checkValid();             
            })
        });
        [...this._payment_radios, ...this._gift_checkboxes, this._inputs[2]].forEach(checkbox => {
            checkbox.addEventListener('change', event => {
                this.reportValid(checkbox);
                this._submit.disabled = !this.checkValid();   
            });
        });

        this._form.addEventListener('reset', _ => {
            console.log('reset');
            this._hints.forEach(hint => hint.style.display = 'none');
            this._inputs.forEach(input => input.classList.remove('invalid'));
            this._submit.disabled = true;
        });
    }

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

    //Checks if a field is valid
    checkValid = (input) => {
        if (input) { 
            let valid;
            if (this._gift_checkboxes.some(x => input.isSameNode(x))) {
                valid = this._gift_checkboxes.reduce((t, x) => t + Number(x.checked), 0) <= 2;
            } else if (input.id === 'user-delivery-date') {
                const today = new Date();
                today.setHours(23, 59, 59, 998);
                return new Date(input.value) > today;            
            } else {
                valid = input.checkValidity();
            }
            return valid;
        } else {
            return this._all_inputs.every(input => this.checkValid(input));
        }
        
    }
    //Updates styles based on validity
    reportValid = (input) => {
        const hint = $('.input-hint', input.parentElement) || $('.input-hint', input.parentElement.parentElement);
        if (this.checkValid(input)) {
            hint.style.display = 'none';
            input.classList.remove('invalid');
        } else {
            hint.style.display = 'block';
            input.classList.add('invalid');
        }
    }
}