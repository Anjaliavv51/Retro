function addItemToCart() {
    var itemName = localStorage.getItem('itemName');
    var itemPrice = localStorage.getItem('itemPrice');
    addToCart(itemName, itemPrice);
}

const addToCart = function(name, price){
    let cartItems = localStorage.getItem('cartItems');
    cartItems = cartItems ? JSON.parse(cartItems) : [];
    if(name == null || price == null) return;
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

let total = 0;
const calculateBill = () => {
    total = 0;  // Reset total for each calculation
    const itemPrices = document.querySelectorAll(".price");
    itemPrices.forEach(p => {
        if (p) {
            total += parseFloat(p.innerText.replace('$', ''));
        }
    });

    if (total !== 0 && !isNaN(total)) {
        document.getElementById("bill").innerText = "$" + total.toFixed(2);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    addItemToCart();
    updateCartDisplay();  // Update the display on page load
    calculateBill();  // Calculate the total on page load
});

const orderBtn = document.querySelector(".butt");
orderBtn.addEventListener("click", () => {
    if (total === 0) {
        alert("Please add something in the cart to place the order");
    } else {
        alert("Order placed!");
    }
});
