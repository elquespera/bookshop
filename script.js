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


let moreInfo;
let basket;
let checkout;

//Fetch book data
let bookData;

window.addEventListener("load", () => {  
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
        bookControls = `<div class="btn trash-btn" onclick="basket.removeItem(${book.id})"></div>`;
        if (book.count > 1) {
            countBadge = `<div class='badge amount-badge'>x${book.count}</div>`;
        }
    } else {
        bookControls = 
            `<button type="button" class="show-more-btn" onclick="moreInfo.show(${book.id})">Show more</button>
            <div class="book-more-info">
                <p>${book.description}</p>
                <button type="button" class="more-info-close-btn btn-red" onclick="moreInfo.hideAll()">Close</button>
            </div>
            <button type="button" class='add-to-bag-btn' onclick="basket.addItem(${book.id}); basket.show();">Add to bag</button>`;

        dragAndDrop = `draggable="true" ondragstart="dragStart(event, ${book.id})"`;       
    }
    const bookItem = document.createElement('div');
    bookItem.className = 'book-item';
    bookItem.innerHTML = 
            `<div class="book-left-pane" ${dragAndDrop}>
                ${countBadge}
                <img src="./assets/images/${book.imageLink}" alt="${book.title}">
            </div>
            <div class="book-right-pane"  ${dragAndDrop}>
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
    moreInfo = new MoreInfo();
    basket = new Basket(); 
    checkout = new Checkout();
}

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


// More book info class
class Checkout {
    _pages = ['catalog', 'checkout', 'summary'];
    _pdivs = this._pages.map(p => document.querySelector('.'+p));

    navigate = (page) => {
        let index = this._pages.indexOf(page);
        this._pdivs.forEach((p, i) => i === index ? p.style.display = 'block' : p.style.display = 'none');
    }

}

//Hide modals on click outside it
window.addEventListener("click", event => {  
    if (!['.basket', '.basket-btn', '.add-to-bag-btn'].
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