import { pageStructure } from "./page-data.js";
import { $, renderElement, renderBookItem } from "./page-render.js";
import { Basket } from "./basket.js";
import { Checkout } from "./checkout.js";
import { MoreInfo } from "./more-info.js";


// **** Class Declarations ****



let moreInfo;
let basket;
let checkout;
let bookData;

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

// Change navbar background transparency on scroll
document.addEventListener("scroll", () => {
    const headerHeight = parseInt(getCSSVar('--header-height')) + parseInt(getCSSVar('--navbar-height'));
    const opacity = Math.min(0.95, (document.documentElement.scrollTop / headerHeight).toFixed(2));    
    let color = getComputedStyle($('header')).backgroundColor;
    color = color.match(/[\.\d]+/g);
    $('nav').style.backgroundColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
});