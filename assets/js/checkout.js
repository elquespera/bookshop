import { $ } from "./page-render.js";
import { basket } from "./page-render.js";

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

        const blurOrChange = (input) => {
            this.reportValid(input); 
            this._submit.disabled = !this.checkValid();               
        }

        this._inputs.forEach(input => {
            input.addEventListener('blur', event => blurOrChange(input))});

        [...this._payment_radios, ...this._gift_checkboxes, this._inputs[2]].forEach(input => {
            input.addEventListener('change', event => blurOrChange(input))});

        this._form.addEventListener('submit', event => {
            event.preventDefault();
            $('.summary-user-name').innerHTML = `${this._inputs[0].value} ${this._inputs[1].value}`;
            $('.summary-address').innerHTML = `${this._inputs[3].value} ${this._inputs[4].value} ${this._inputs[5].value} on ${this._inputs[2].value}.`;        
            basket.clear();
            this.navigate('summary');
        });

        this._form.addEventListener('reset', _ => {
            this._hints.forEach(hint => hint.style.display = 'none');
            this._inputs.forEach(input => input.classList.remove('invalid'));
            this._submit.disabled = true;
        });
    }

    get page () {
        return this._pages[this._pageIndex];
    }

    //Navigate to a given page
    navigate = (page) => {
        let index = this._pages.indexOf(page);
        index = Math.max(0, Math.min(index, page.length)) || 0;
        this._pageIndex = index;
        if (page === 'checkout') {
            this._form.reset();
        }
        ['.checkout-basket-btn', '.remove-all-btn'].
            forEach(el => $(el).style.display = page === 'checkout' ? 'none' : 'block');
        document.querySelectorAll('.trash-btn')?.
            forEach(el => el.style.display = page === 'checkout' ? 'none' : 'block'); 
        $('.basket-btn').style.display = page === 'summary' ? 'none' : 'block';
            
        //Display current page    
        this._page_blocks.
            forEach((p, i) => p.style.display = i === index ? 'block' : 'none');        
        document.documentElement.scrollTop = 0;
    }

    //Checks if an input is valid
    //combining HTML5 validation on text inputs &
    //custom validation for date and checkboxes.
    //If no input is given, checks the validity of all inputs
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