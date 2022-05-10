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

//Fetch book data
let bookData;

window.addEventListener("DOMContentLoaded", () => {  
    fetch('./assets/books.json')
        .then(response => {
            return response.json();
        })
        .then(data => {
            bookData = data.map((x, id) => {return {...x, id: id}});
            parseBookData();
        });      
})

//function 

function createBookItem(book, basket = false) {
    let bookControls;
    let countBadge = '';
    let dragAndDrop = '';
    if (basket) {
        bookControls = `<div class="btn trash-btn" onclick="removeItemFromBasketClick(${book.id})"></div>`;
        if (book.count > 1) {
            countBadge = `<div class='badge amount-badge'>x${book.count}</div>`;
        }
    } else {
        bookControls = 
            `<button type="button">Show more</button>
            <button type="button" onclick="addToBasketClick(${book.id})">Add to bag</button>`;
        dragAndDrop = `draggable="true" ondragstart="dragStart(event)" id="${book.id}"`;            
    }
    const bookItem = document.createElement('div');
    bookItem.className = 'book-item';
    bookItem.innerHTML = 
            `<div class="book-left-pane">
                ${countBadge}
                <img src="./assets/images/${book.imageLink}" alt="${book.title}" ${dragAndDrop}>
            </div>
            <div class="book-right-pane">
                <div class="book-info">
                    <h4 class="book-authors">${book.author}</h4>
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-price">Price: $${book.price}</p>
                </div>
                <div class="book-controls">
                    ${bookControls}
                </div>
            </div>`;  
    return bookItem;  
}

function parseBookData () {
    const bookFragment = new DocumentFragment();
    bookData.forEach((book) => {
        bookFragment.appendChild(createBookItem(book));
    });
    const bookWrapper = document.querySelector('.book-wrapper');
    bookWrapper.appendChild(bookFragment);
}


// Basket

class Basket {
    _visible = false;
    _basket = document.querySelector('.basket');
    _basket_content = document.querySelector('.basket-content');
    _removeAllButton = document.querySelector('.remove-all-btn');
    _checkoutButton = document.querySelector('.checkout-btn');
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
        console.log(this._items);
    }
}

let basket;

window.addEventListener("load", () => {  
    basket = new Basket(); 
})

window.addEventListener("click", () => {  
    //  if (basket.visible) {basket.toggle()}
})

function basketButtonClick() {
    basket.toggle();
}

function addToBasketClick(id) {
    basket.addItem(id);
    basket.show();
}

function removeItemFromBasketClick(id) {
    basket.removeItem(id);
}

function removeAllClick() {
    basket.clear();
}


// Drag & Drop

function dragStart(event) {
    event.dataTransfer.setData("id", event.target.id);
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
