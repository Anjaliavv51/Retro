document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();
    updateBadgeCount(); // Update badge on load
    if (document.getElementById('cart-items')) {
        document.getElementById('cart-items').addEventListener('click', (event) => {
            if (event.target.classList.contains('increase-quantity')) {
                updateQuantity(event.target, 1);
            } else if (event.target.classList.contains('decrease-quantity')) {
                updateQuantity(event.target, -1);
            }
            updateCart(); // Update total price when quantity changes
        });
    }

    const cartTable = document.getElementById('cart-table');

    // Function to update the total individual price and bill
    function updateCart() {
        const cartItems = document.querySelectorAll('.cart-item');
        let totalAmount = 0;

        cartItems.forEach(item => {
            const price = parseFloat(item.dataset.productPrice);
            const quantityElement = item.querySelector('.quantity');
            const quantity = parseInt(quantityElement.textContent, 10);
            const totalIndividualPrice = price * quantity;

            // Add or update the total individual price column
            let totalCell = item.querySelector('.total-individual-price');
            if (!totalCell) {
                totalCell = document.createElement('td');
                totalCell.classList.add('total-individual-price');
                item.appendChild(totalCell);
            }
            totalCell.textContent = `$${totalIndividualPrice.toFixed(2)}`;

            totalAmount += totalIndividualPrice;
        });

        // Update the cart total
        document.getElementById('cart-total').textContent = `Total: $${totalAmount.toFixed(2)}`;
    }

    // Initial update on page load
    updateCart();
});

function loadCartFromLocalStorage() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = ''; // Clear existing items

        cartItems.forEach(item => {
            const cartItemRow = document.createElement('tr');
            cartItemRow.className = 'cart-item';
            cartItemRow.setAttribute('data-product-id', item.id);
            cartItemRow.setAttribute('data-product-price', item.price);
            cartItemRow.innerHTML = `
                <td>${item.name}</td>  <!-- Correctly load and display the name -->
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
            name: item.querySelector('td').textContent, // Fetch the item name from the first <td>
            price: parseFloat(item.getAttribute('data-product-price')),
            quantity: parseInt(item.querySelector('.quantity').textContent)
        });
    });
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateBadgeCount(); // Update badge count after saving
}

// Function to generate a random coupon code
const generateCouponCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let couponCode = '';
    for (let i = 0; i < 8; i++) {
        couponCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return couponCode;
};

// Check if it's the user's first order and apply discount
const applyFirstTimeDiscount = () => {
    let couponCode = localStorage.getItem('couponCode');
    if (!couponCode) {
        couponCode = generateCouponCode();
        localStorage.setItem('couponCode', couponCode);
    }
    if (document.getElementById('couponCode')) {
        document.getElementById('couponCode').innerHTML = `Use coupon code <span style="font-weight: bold;"> ${couponCode} </span> for 30% off!`;
        alert(`Congratulations! Your coupon code is ${couponCode}. You've received a 30% discount on your first order.`);
    }
};

window.onload = applyFirstTimeDiscount;

function updateBadgeCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('badgeCount').innerText = totalQuantity;
}
