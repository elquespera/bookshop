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

export { $, renderElement, renderBookItem }
