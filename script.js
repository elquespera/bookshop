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
    let bookControls = '';
    if (basket) {
        bookControls = '';
    } else {
        bookControls = 
            `<button type="button">Show more</button>
            <button type="button" onclick="addToBasket(${book.id})">Add to bag</button>`
    }
    const bookItem = document.createElement('div');
    bookItem.className = 'book-item';
    bookItem.innerHTML = 
            `<img src="./assets/images/${book.imageLink}">
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
    _basket = document.querySelector('.basket-wrapper');
    _badge = document.querySelector('.basket-count-badge');
    _items = [];
    get visible () {
        this._visible;
    }

    get basketEmpty () {
        return this._items.length === 0;
    }
    
    renderBasket = () => {
        const basketFragment = new DocumentFragment();
        if (this.basketEmpty) {
            
        } else {
            this._items.forEach((item, id) => {
                basketFragment.appendChild(createBookItem(item, true));
            });
        }
        this._basket.textContent = '';
        this._basket.appendChild(basketFragment);

        this._badge.innerHTML = this._items.length;
        this._badge.style.display = this.basketEmpty === 0 ? 'none' : 'block';
    }

    toggleBasket = () => {
        this._visible = !this._visible;
        this._basket.style.display = this._visible ? 'flex' : 'none';
        //console.log(this._visible);
    }
    addItem = (id) => {
        this._items.push(bookData[id]);
        this.renderBasket();
    }
}

let basket;

window.addEventListener("load", () => {  
    basket = new Basket(); 
})


function basketButtonClick() {
    basket.toggleBasket();
}

function addToBasket(id) {
    basket.addItem(id);
}

