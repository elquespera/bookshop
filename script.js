// **** HTML Page Structure & Data ****
const nav = {
    tag: 'nav',
    children: [
        {class: 'top-menu', children: [
            {tag: 'h1', onclick: `checkout.navigate('catalog');`, content: 'Book shop'},
            {class: 'btn basket-btn', onclick: 'basket.toggle()', children: [
                {class: 'badge basket-count-badge'}
            ]}
        ]},
        {class: 'basket', ondragover: 'dropAllow(event)', ondrop: 'dropOver(event)', children: [
            {tag: 'h2', content: 'Shopping cart'},
            {class: 'basket-content'},
            {class: 'basket-controls', children: [
                {tag: 'h3', class: 'basket-total-price', content: 'Price: '},
                {tag: 'button', type: 'button', class: 'remove-all-btn btn-red', onclick: 'basket.clear()', content: 'Remove all'},
                {tag: 'button', type: 'button', class: 'checkout-basket-btn', onclick: `checkout.navigate('checkout'); basket.hide();`, content: 'Checkout'}
            ]},

        ]}
    ]
}

const header = {
    tag: 'header',
    children: [
        {class: 'circle color1 left top'},
        {class: 'circle color2 center bottom'},
        {class: 'circle color3 right top'},
        {tag: 'h2', content: 'Welcome to our bookshop'},
        {tag: 'h4', content: 'You came to the right place for book shopping'},
    ]
}
    
const main = {
    tag: 'main',
    children: [
        {class: 'catalog', children: [
            {tag: 'h2', class:'title-text', content: 'Catalog'},
            {class: 'book-wrapper'}
        ]},
        {class: 'checkout', children: [
            {tag: 'h2', class:'title-text', content: 'Checkout'},
            {class: 'checkout-wrapper', children: [
                {tag: 'form', children: [
                    {tag: 'label', for: 'user-name', content: 'Name'},
                    {children: [
                        {tag: 'input', type: 'text', id: 'user-name'},
                        {class: 'input-hint', id: 'input-hint-name', 
                        content: 'Name should be at least four characters long.'},    
                    ]},
                    {tag: 'label', for: 'user-surname', content: 'Surname'},
                    {children: [
                        {tag: 'input', type: 'text', id: 'user-surname'},
                        {class: 'input-hint', id: 'input-hint-surname', 
                        content: 'Name should be at least five characters long.'},    
                    ]},
                    {tag: 'label', for: 'user-delivery-date', content: 'Delivery date'},
                    {children: [
                        {tag: 'input', type: 'date', id: 'user-delivery-date'},
                        {class: 'input-hint', id: 'input-hint-delivery-date', 
                        content: 'Date should be tomorrow at the earliest.'},    
                    ]},
                    {tag: 'label', for: 'user-street', content: 'Street'},
                    {children: [
                        {tag: 'input', type: 'text', id: 'user-street'},
                        {class: 'input-hint', id: 'input-hint-street', 
                        content: 'Street should be at least five characters long.'},    
                    ]},
                    {tag: 'label', for: 'user-house-number', content: 'House number'},
                    {children: [
                        {tag: 'input', type: 'number', id: 'user-house-number'},
                        {class: 'input-hint', id: 'input-hint-house-number', 
                        content: 'Numbers only.'},    
                    ]},
                    {tag: 'label', for: 'user-flat-number', content: 'Flat number'},
                    {children: [
                        {tag: 'input', type: 'number', id: 'user-flat-number'},
                        {class: 'input-hint', id: 'input-hint-flat-number', 
                        content: 'Numbers or dashes only.'},    
                    ]},
                    {tag: 'label', content: 'Payment type'},
                    {children: [
                        {class:'option-group', children: [
                            {tag: 'input', type: 'radio', name: 'user-payment-type', id: 'user-payment-card'},
                            {tag: 'label', for: 'user-payment-card', content: 'Credit card'},
                            {tag: 'input', type: 'radio', name: 'user-payment-type', id: 'user-payment-cash'},
                            {tag: 'label', for: 'user-payment-cash', content: 'Cash'},
                        ]},
                        {class: 'input-hint', id: 'input-hint-payment-type', 
                        content: 'Select payment type please.'},    
                    ]},
                    {tag: 'label', content: 'Choose your gifts'},
                    {children: [
                        {class:'option-group', children: [
                            {tag: 'input', type: 'checkbox', id: 'user-gift-wrapping', name: 'user-gift-wrapping'},
                            {tag: 'label', for: 'user-gift-wrapping', content: 'Gift wrapping'},
                            {tag: 'input', type: 'checkbox', id: 'user-gift-postcard'},
                            {tag: 'label', for: 'user-gift-postcard', content: 'Postcard'},
                            {tag: 'input', type: 'checkbox', id: 'user-gift-discount'},
                            {tag: 'label', for: 'user-gift-discount', content: '2% discount for your next order'},
                            {tag: 'input', type: 'checkbox', id: 'user-gift-pen'},
                            {tag: 'label', for: 'user-gift-pen', content: 'Branded pen or pencil'},                   
                        ]},
                        {class: 'input-hint', id: 'input-hint-gift', 
                        content: 'Choose up to two gifts.'},    
                    ]},
                ]},
                {tag: 'button', type: 'button', content: 'Submit'},                
            ]}
        ]},
        {class: 'summary', children: [
            {tag: 'h2', class:'title-text', content: 'Summary'},
            {class: 'sumarry-wrapper'}
        ]},        
    ]
}

const footer = {
    tag: 'footer',
    children: [
        {class: 'circle color2 left top'},
        {class: 'circle color3 center bottom'},
        {class: 'circle color1 right top'},
    ]
}

const pageStructure = [nav, header, main, footer]; 

//jQuery-style selector
const $ = (selector, from) => from ? from.querySelector(selector) : document.querySelector(selector);

//Renders an Element from Data
function renderElement(el) {
    el.tag = el.tag ?? 'div';
    const item = document.createElement(el.tag);
    for (const prop in el) {
        if (prop === 'children') {
            el.children.forEach(child => item.appendChild(renderElement(child)));
        } 
        else if (prop.slice(0, 2) === 'on') {
            item.addEventListener(prop.slice(2), _ => eval(el[prop]));
        }
        else if (prop === 'content') {
            item.innerHTML = el[prop];
        }
        else if (prop !== 'tag') {
            item.setAttribute(prop, el[prop]);
        }
    }
    return item;
}


// **** Class Declarations ****

// More book info class
class MoreInfo {
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

// Basket
class Basket {
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
                basketFragment.appendChild(createBookItem(item, true));
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


// More book info class
class Checkout {
    _pages = ['catalog', 'checkout', 'summary'];
    _page_blocks = this._pages.map(p => $('.'+p));
    _pageIndex = 0;

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
        if (this.isCheckout) {this.clearForm()}
        this._page_blocks.forEach((p, i) => i === index ? p.style.display = 'block' : p.style.display = 'none');
        $('.checkout-basket-btn').style.display = this.isCheckout ? 'none' : 'block';
    }

    clearForm = () => {

    }

}


let moreInfo;
let basket;
let checkout;
let bookData;

//Fetch book data
window.addEventListener("load", () => {  
    fetch('./assets/books.json')
        .then(response => {
            return response.json();
        })
        .then(data => {
            bookData = data.map((x, id) => {return {...x, id: id}});
            initPage();
        });      
});


//Build all HTML Elements and initialize classes
function initPage () {    
    const docFragment = new DocumentFragment();
    //Overall HTML structure
    pageStructure.forEach(el => docFragment.appendChild(renderElement(el)));

    //Book Data
    const bookWrapper = $('.book-wrapper', docFragment);
    bookData.forEach(book => {
        bookWrapper.appendChild(createBookItem(book));
    });

    $('body').appendChild(docFragment);   

    moreInfo = new MoreInfo();
    basket = new Basket(); 
    checkout = new Checkout();
}

//Create book info div for both main page & basket
function createBookItem(book, basket = false) {
    const bookItem = {
        class: 'book-item',
        children: [
            {class: 'book-left-pane', children: [
                {tag: 'img', src: `./assets/images/${book.imageLink}`, alt: book.title}
            ]},
            {class: 'book-right-pane', children: [
                {class: 'book-info', children: [
                    {tag: 'h4', content: book.author},
                    {tag: 'h3', content: book.title},
                    {tag: 'p', class: 'book-price', content: 'Price: '+book.author}
                ]},
                {class: 'book-controls'} 
            ]},
        ]
    }
    if (basket) {
        bookItem.children[1].children[1].children = [
            {class: 'btn trash-btn', onclick: `basket.removeItem(${book.id})`}
        ];
        if (book.count > 1) {
            bookItem.children[0].children.unshift({
                class: 'badge amount-badge', content: 'x' + book.count
        })}
    } else {
        bookItem.children[1].children[1].children = [
            {tag: 'button', type: 'button', class: 'show-more-btn',
             onclick: `moreInfo.show(${book.id})`, content: 'Show more'},
            {class: 'book-more-info', children: [
                {tag: 'p', content: book.description},
                {tag: 'button', type: 'button', class: 'more-info-close-btn btn-red',
                 onclick: 'moreInfo.hideAll()', content: 'Close'}
            ]},
            {tag: 'button', type: 'button', class: 'add-to-bag-btn',
             onclick: `basket.addItem(${book.id}); basket.show();`, content: 'Add to bag'}
        ];
        bookItem.children[0].draggable = 'true';
        bookItem.children[0].ondragstart = `dragStart(event, ${book.id})`;
    }
    return renderElement(bookItem);  
}

//Hide modals on click outside it
window.addEventListener("click", event => {  
    if (!['.basket', '.basket-btn', '.add-to-bag-btn', '.trash-btn'].
        some(c => event.target.closest(c))) {
        basket.hide();
    }
    if (!['.show-more-btn', '.book-more-info'].
        some(c => event.target.closest(c))) {
        moreInfo.hideAll();
    }    
});

//Hide modals on ESC key press
window.addEventListener("keydown", event => {
    if (event.key == 'Escape') {
        basket.hide();
        moreInfo.hideAll()
    }
});

// Drag & Drop

function dragStart(event, id) {
    event.dataTransfer.setData("id", id);
    basket.show();
}

function dropAllow(event) {
    event.preventDefault();
}

function dropOver(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData("id");
    basket.addItem(parseInt(id));
}



// Get & Set CSS variables
const getCSSVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name);
 const setCSSVar = (name, value) => document.documentElement.style.setProperty(name, value);

// Change navbar background transparency on scroll
document.addEventListener("scroll", () => {
    const navbar = $('nav');
    const currentPosition = document.documentElement.scrollTop;
    const headerHeight = parseInt(getCSSVar('--header-height')) + parseInt(getCSSVar('--navbar-height'));
    const opacity = Math.min(0.95, (currentPosition / headerHeight).toFixed(2));    
    let color = getComputedStyle($('header')).backgroundColor;
    color = color.match(/[\.\d]+/g);
    navbar.style.backgroundColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
});