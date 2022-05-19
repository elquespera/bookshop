import { Basket } from "./basket.js";
import { Checkout } from "./checkout.js";
import { MoreInfo } from "./more-info.js";
import { pageStructure } from "./page-data.js";

let moreInfo;
let basket;
let checkout;
let bookData;

//jQuery-like selector
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

//Create book info div for both main page & basket
function renderBookItem(book, basket = false) {
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
                    {tag: 'p', class: 'book-price', content: 'Price: $'+book.price}
                ]},
                {class: 'book-controls'} 
            ]},
        ]
    }
    if (basket) {
        bookItem.children[1].children[1].children = [
            {class: 'btn trash-btn', title: 'Remove from bag', onclick: `basket.removeItem(${book.id})`}
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

//Build all HTML Elements and initialize classes
function initPage () {    
    const docFragment = new DocumentFragment();
    //Overall HTML structure
    pageStructure.forEach(el => docFragment.appendChild(renderElement(el)));

    //Book Data
    const bookWrapper = $('.book-wrapper', docFragment);
    bookData.forEach(book => {
        bookWrapper.appendChild(renderBookItem(book));
    });

    $('body').appendChild(docFragment);   

    moreInfo = new MoreInfo();
    basket = new Basket(); 
    checkout = new Checkout();
}

//Fetch book data and initialize the page
document.addEventListener("DOMContentLoaded", () => {  
    fetch('./assets/books.json')
        .then(response => {
            return response.json();
        })
        .then(data => {
            bookData = data.map((x, id) => {return {...x, id: id}});
            initPage();
        });
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

export { $, renderBookItem, bookData, basket }
