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

const parseBookData = () => {
    const bookFragment = new DocumentFragment();
    bookData.forEach(book => {
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
                        <button type="button">Show more</button>
                        <button type="button">Add to bag</button>
                    </div>
                </div>`;
        bookFragment.appendChild(bookItem);
    });
    const bookWrapper = document.querySelector('.book-wrapper');
    bookWrapper.appendChild(bookFragment);
}

window.addEventListener("load", () => {  
    fetch('./assets/books.json')
        .then(response => {
            return response.json();
        })
        .then(data => {
            bookData = data;
            parseBookData();
        });
})

