function addItemToCart() {
    var itemName = localStorage.getItem('itemName');
    var itemPrice = localStorage.getItem('itemPrice');
    addToCart(itemName, itemPrice);
}

const addToCart = function(name, price){
    if (!name || !price) return;
    let cartItems = localStorage.getItem('cartItems');
    cartItems = cartItems ? JSON.parse(cartItems) : [];
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


// calculate total bill amount
const calculateBill = ()=>{
    const itemPrices = document.querySelectorAll(".price");
    let total = 0;
    for (const p of itemPrices){
        if (p!=null){
            total += parseFloat(p.innerText.replace('$',''));
        }
    }

    if(total!=0 && !isNaN(total)){
        document.getElementById("bill").innerText = "$" + total.toFixed(2)
    }
    
}

document.addEventListener('DOMContentLoaded', function () {
    addItemToCart();
});

document.addEventListener('DOMContentLoaded', function () {
    const orderBtn = document.querySelector(".butt");
    if (orderBtn) {
        orderBtn.addEventListener("click", ()=>{
            const billEl = document.getElementById("bill");
            const total = billEl ? parseFloat(billEl.innerText.replace('$','')) || 0 : 0;
            if(total==0){
               alert("Please add something in the cart to place the order");
           }
           else{
               alert("Order placed!");
           }
        });
    }
});

