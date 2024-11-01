function addItemToCart() {
    var itemName = localStorage.getItem('itemName');
    var itemPrice = localStorage.getItem('itemPrice');
    addToCart(itemName, itemPrice);
}

const addToCart = function(name, price) {
    let cartItems = localStorage.getItem('cartItems');
    cartItems = cartItems ? JSON.parse(cartItems) : [];
    if (name == null || price == null) return; // Changed && to || for better null handling

    const existingItem = cartItems.find(item => item.name === name);
    if (!existingItem) {
        cartItems.push({ name, price });
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        console.log(cartItems);
    }

    updateCartDisplay();
    calculateBill();
}

const updateCartDisplay = function() {
    const cartBody = document.querySelector(".items");
    cartBody.innerHTML = '';
    let cartItems = localStorage.getItem('cartItems');
    cartItems = cartItems ? JSON.parse(cartItems) : [];
    
    cartItems.forEach(item => {
        const cartRow = document.createElement("tr");
        const cartItemName = document.createElement("td");
        const cartItemPrice = document.createElement("td");
        cartItemName.innerText = item.name;
        cartItemPrice.innerText = item.price;
        cartItemPrice.classList.add("price");
        cartRow.appendChild(cartItemName);
        cartRow.appendChild(cartItemPrice);
        cartBody.appendChild(cartRow);
    });
}

let total = 0; // Moved total initialization here to reset it every time bill is calculated
const calculateBill = () => {
    total = 0; // Reset total before calculation
    const itemPrices = document.querySelectorAll(".price");
    itemPrices.forEach(p => {
        if (p != null) {
            total += parseFloat(p.innerText.replace('$', ''));
        }
    });

    console.log(total);
    if (total !== 0 && !isNaN(total)) {
        document.getElementById("bill").innerText = "$" + total.toFixed(2);
    } else {
        document.getElementById("bill").innerText = "$0.00"; // Reset bill display if total is zero
    }
}

document.addEventListener('DOMContentLoaded', function() {
    addItemToCart();
});

let orderBtn = document.querySelector(".butt");
orderBtn.addEventListener("click", () => {
    if (total === 0) {
        alert("Please add something to the cart to place the order");
    } else {
        alert("Order placed!");
    }
});

// Prioritizing Image Loading
const criticalImages = document.querySelectorAll('.critical-image');
const lazyImages = document.querySelectorAll('img[data-src]');

// Load critical images immediately
criticalImages.forEach(image => {
    image.src = image.dataset.src;
});

// Use Intersection Observer for lazy loading
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.src = entry.target.dataset.src;
            observer.unobserve(entry.target);
        }
    });
});

lazyImages.forEach(image => observer.observe(image));
