// **** HTML Page Structure & Data ****
const nav = {
    tag: 'nav',
    children: [
        {className: 'top-menu', children: [
            {tag: 'h1', onclick: `checkout.navigate('catalog');`, innerHTML: 'Book shop'},
            {className: 'btn basket-btn', onclick: 'basket.toggle()', children: [
                {className: 'badge basket-count-badge'}
            ]}
        ]},
        {className: 'basket', ondragover: 'dropAllow(event)', ondrop: 'dropOver(event)', children: [
            {tag: 'h2', innerHTML: 'Shopping cart'},
            {className: 'basket-content'},
            {className: 'basket-controls', children: [
                {tag: 'h3', className: 'basket-total-price', innerHTML: 'Price: '},
                {tag: 'button', type: 'button', className: 'remove-all-btn btn-red', onclick: 'basket.clear()', innerHTML: 'Remove all'},
                {tag: 'button', type: 'button', className: 'checkout-basket-btn', onclick: `checkout.navigate('checkout')`, innerHTML: 'Checkout'}
            ]},

        ]}
    ]
}

const header = {
    tag: 'header',
    children: [
        {className: 'circle color1 left top'},
        {className: 'circle color2 center bottom'},
        {className: 'circle color3 right top'},
        {tag: 'h2', innerHTML: 'Welcome to our bookshop'},
        {tag: 'h4', innerHTML: 'You came to the right place for book shopping'},
    ]
}
    
const main = {
    tag: 'main',
    children: [
        {className: 'catalog', children: [
            {tag: 'h2', className:'title-text', innerHTML: 'Catalog'},
            {className: 'book-wrapper'}
        ]},
        {className: 'checkout', children: [
            {tag: 'h2', className:'title-text', innerHTML: 'Checkout'},
            {className: 'checkout-wrapper'}
        ]},
        {className: 'summary', children: [
            {tag: 'h2', className:'title-text', innerHTML: 'Summary'},
            {className: 'sumarry-wrapper'}
        ]},        
    ]
}

const footer = {
    tag: 'footer',
    children: [
        {className: 'circle color2 left top'},
        {className: 'circle color3 center bottom'},
        {className: 'circle color1 right top'},
    ]
}

const pageStructure = [nav, header, main, footer]; 

//Renders an Element from Data
function renderElement(el) {
    el.tag = el.tag ?? 'div';
    const item = document.createElement(el.tag);
    for (const prop in el) {
        if (prop === 'children') {
            el.children.forEach(child => item.appendChild(renderElement(child)));
        } 
        else if (prop.slice(0, 2) === 'on') {
            item.addEventListener(prop.slice(2), event => eval(el[prop]));
        }
        else if (prop !== 'tag') {
            item[prop] = el[prop]
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
    _basket = document.querySelector('.basket');
    _basket_content = document.querySelector('.basket-content');
    _removeAllButton = document.querySelector('.remove-all-btn');
    _checkoutButton = document.querySelector('.checkout-basket-btn');
    _badge = document.querySelector('.basket-count-badge');
    _totalPrice = document.querySelector('.basket-total-price');
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
            this._totalPrice.textContent = '';
        } else {
            this._items.forEach((item, id) => {
                basketFragment.appendChild(createBookItem(item, true));
            });
            this._totalPrice.textContent = 'Total: $' + this.totalPrice;
        }
        this._basket_content.textContent = '';
        this._basket_content.appendChild(basketFragment);
        this._badge.innerHTML = this.itemsCount;
        this._badge.style.display = this.basketEmpty ? 'none' : 'block';
        this._removeAllButton.disabled = this.basketEmpty;
        this._checkoutButton.disabled = this.basketEmpty;
    }

    toggle = () => {
        this._visible = !this._visible;
        this._basket.style.display = this._visible ? 'flex' : 'none';
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
    _pdivs = this._pages.map(p => document.querySelector('.'+p));
    _pageIndex = 0;
    _checkoutBasketBtn = document.querySelector('.checkout-basket-btn');

    get page () {
        return this._pages[this._pageIndex];
    }

    navigate = (page) => {
        let index = this._pages.indexOf(page);
        index = Math.max(0, Math.min(index, page.length)) || 0;
        this._pageIndex = index;
        this._pdivs.forEach((p, i) => i === index ? p.style.display = 'block' : p.style.display = 'none');
        this._checkoutBasketBtn.style.display = this.page === 'checkout' ? 'none' : 'block';
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
    const bookWrapper = docFragment.querySelector('.book-wrapper');
    bookData.forEach((book) => {
        bookWrapper.appendChild(createBookItem(book));
    });

    document.querySelector('body').appendChild(docFragment);   

    moreInfo = new MoreInfo();
    basket = new Basket(); 
    checkout = new Checkout();
}

//Create book info div for both main page & basket
function createBookItem(book, basket = false) {
    const bookItem = {
        className: 'book-item',
        children: [
            {className: 'book-left-pane', children: [
                {tag: 'img', src: `./assets/images/${book.imageLink}`, alt: book.title}
            ]},
            {className: 'book-right-pane', children: [
                {className: 'book-info', children: [
                    {tag: 'h4', innerHTML: book.author},
                    {tag: 'h3', innerHTML: book.title},
                    {tag: 'p', className: 'book-price', innerHTML: 'Price: '+book.author}
                ]},
                {className: 'book-controls'} 
            ]},
        ]
    }
    if (basket) {
        bookItem.children[1].children[1].children = [
            {className: 'btn trash-btn', onclick: `basket.removeItem(${book.id})`}
        ];
        if (book.count > 1) {
            bookItem.children[1].children.unshift({
                className: 'badge amount-badge', innerHTML: 'x' + book.count
        })}
    } else {
        bookItem.children[1].children[1].children = [
            {tag: 'button', type: 'button', className: 'show-more-btn',
             onclick: `moreInfo.show(${book.id})`, innerHTML: 'Show more'},
            {className: 'book-more-info', children: [
                {tag: 'p', innerHTML: book.description},
                {tag: 'button', type: 'button', className: 'more-info-close-btn btn-red',
                 onclick: 'moreInfo.hideAll()', innerHTML: 'Close'}
            ]},
            {tag: 'button', type: 'button', className: 'add-to-bag-btn',
             onclick: `basket.addItem(${book.id}); basket.show();`, innerHTML: 'Add to bag'}
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
    const navbar = document.querySelector('nav');
    const currentPosition = document.documentElement.scrollTop;
    const headerHeight = parseInt(getCSSVar('--header-height')) + parseInt(getCSSVar('--navbar-height'));
    const opacity = Math.min(0.95, (currentPosition / headerHeight).toFixed(2));    
    let color = getComputedStyle(document.querySelector('header')).backgroundColor;
    color = color.match(/[\.\d]+/g);
    navbar.style.backgroundColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
});