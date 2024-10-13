//CODE FOR TABLE OF ADD TO CART
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();
    updateBadgeCount() ; // update badge on load
    if (document.getElementById('cart-items')){
        document.getElementById('cart-items').addEventListener('click', (event) => {
            if (event.target.classList.contains('increase-quantity')) {
                updateQuantity(event.target, 1);
            } else if (event.target.classList.contains('decrease-quantity')) {
                updateQuantity(event.target, -1);
            }
        });
    }
});

function loadCartFromLocalStorage() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    if(cartItemsContainer){
        cartItemsContainer.innerHTML = ''; // Clear existing items

        cartItems.forEach(item => {
            const cartItemRow = document.createElement('tr');
            cartItemRow.className = 'cart-item';
            cartItemRow.setAttribute('data-product-id', item.id);
            cartItemRow.setAttribute('data-product-price', item.price);
            cartItemRow.innerHTML = `
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td class="quantity">${item.quantity}</td>
                <td>
                    <button class="decrease-quantity">-</button>
                    <button class="increase-quantity">+</button>
                </td>
            `;
            cartItemsContainer.appendChild(cartItemRow);
        });

        updateTotal();
    }
}

function updateQuantity(button, change) {
    const cartItemRow = button.parentElement.parentElement;
    const quantityElement = cartItemRow.querySelector('.quantity');
    const newQuantity = parseInt(quantityElement.textContent) + change;
    if (newQuantity > 0) {
        quantityElement.textContent = newQuantity;
    } else {
        cartItemRow.remove();
    }
    updateTotal();
    saveCartToLocalStorage();
}

function updateTotal() {
    const cartItems = document.querySelectorAll('.cart-item');
    let total = 0;
    cartItems.forEach(item => {
        const price = parseFloat(item.getAttribute('data-product-price'));
        const quantity = parseInt(item.querySelector('.quantity').textContent);
        total += price * quantity;
    });
    document.getElementById('cart-total').textContent = `Total: $${total.toFixed(2)}`;
}

function saveCartToLocalStorage() {
    const cartItems = [];
    document.querySelectorAll('.cart-item').forEach(item => {
        cartItems.push({
            id: item.getAttribute('data-product-id'),
            price: parseFloat(item.getAttribute('data-product-price')),
            quantity: parseInt(item.querySelector('.quantity').textContent)
        });
    });
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateBadgeCount(); // update badge count after saving
}
//CODE FOR COUPON RECEIVED ON CLICKING ORDER NOW
  // Function to generate a random coupon code
  const generateCouponCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let couponCode = '';
    for (let i = 0; i < 8; i++) {
        couponCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return couponCode;
}
// Check if it's the user's first order and apply discount
const applyFirstTimeDiscount = () => {
    let couponCode = localStorage.getItem('couponCode');
    if (!couponCode) {
        couponCode = generateCouponCode();
        localStorage.setItem('couponCode', couponCode);
    }
    if (document.getElementById('couponCode')) {
        document.getElementById('couponCode').innerHTML = `Use coupon code <span style="font-weight: bold;">${couponCode}</span> for 30% off!`;
        
        // Display the custom modal
        document.getElementById('couponDisplay').innerText = couponCode; // Show the coupon code
        document.getElementById('customAlert').style.display = "block"; // Show the modal
    }
}

// Close the modal when the user clicks on the <span> (x)
document.getElementById('closeModal').onclick = function() {
    document.getElementById('customAlert').style.display = "none";
}

// Close the modal when the user clicks the OK button
document.getElementById('okButton').onclick = function() {
    document.getElementById('customAlert').style.display = "none";
}

// Close the modal when the user clicks anywhere outside of the modal
window.onclick = function(event) {
    if (event.target == document.getElementById('customAlert')) {
        document.getElementById('customAlert').style.display = "none";
    }
}

window.onload = applyFirstTimeDiscount;

function updateBadgeCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('badgeCount').innerText = totalQuantity;
}
