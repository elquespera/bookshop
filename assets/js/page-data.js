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
                        {tag: 'input', type: 'text', id: 'user-name', pattern: '[a-zA-Z]{4,}'},
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
                        {tag: 'input', type: 'number', id: 'user-house-number', pattern: '\d+', title: 'Use numbers only.'},
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

//HTML Page Structure
export const pageStructure = [nav, header, main, footer]; 