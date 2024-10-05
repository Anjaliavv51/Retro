
function rateItem(button, rating) {
    const starButtons = button.parentElement.querySelectorAll('.star-button');

    starButtons.forEach((starButton, index) => {
        if (index < rating) {
            starButton.classList.add('rated');
        } else {
            starButton.classList.remove('rated');
        }
    });
}

document.querySelectorAll('.add-to-cart-button').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.getAttribute('data-product-id');
        const productName = this.getAttribute('data-product-name');
        const productPrice = parseFloat(this.getAttribute('data-product-price'));

        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        // Check if the item already exists in the cart
        const existingItemIndex = cartItems.findIndex(item => item.id === productId);
        if (existingItemIndex !== -1) {
            // If it exists, increment the quantity
            cartItems[existingItemIndex].quantity += 1;
        } else {
            // If it does not exist, add new item
            cartItems.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1
            });
        }

        // Save updated cart to localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        addedToCartDisplay(productId) ;
        
        // Optionally, you can show a message or confirmation
        //alert(`Item has been added to the cart successfully.`);
    });
});

const addedMessageTimeouts = {} ;

function addedToCartDisplay(productId){
    let matchingProductId ;
    document.querySelectorAll(`.js-added-to-cart`).forEach((item) => {
        const currentProductId = item.dataset.productId ;
        if(currentProductId === productId){
            matchingProductId = productId ;
            item.classList.add('js-display-added-to-cart') ;
        }
    });
    const prevTimeoutId = addedMessageTimeouts[matchingProductId] ;
    if(prevTimeoutId){
        clearTimeout(prevTimeoutId) ;
    }
    
    const timeoutId = setTimeout(()=> {
        document.querySelectorAll(`.js-added-to-cart`).forEach((item) => {
            const currentProductId = item.dataset.productId ;
            if(currentProductId === productId){
                matchingProductId = productId ;
                item.classList.remove('js-display-added-to-cart') ;
            }
        });
    },2000);

    addedMessageTimeouts[matchingProductId] = timeoutId ;

}

