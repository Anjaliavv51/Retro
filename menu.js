// adding items from menu to cart
document.addEventListener('DOMContentLoaded', function () {
    var menuContainers = document.querySelectorAll('.menu_container');
    menuContainers.forEach(function (container) {
        container.addEventListener('click', function (event) {
            if (event.target.classList.contains('butt')) {
                var item = event.target.closest('.items');
                var itemName = item.querySelector('h3').textContent;
                var itemPrice = item.querySelector('p').textContent;
                alert("Item added to cart successfully");

                // Retrieve existing cart items from localStorage
                var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

                // Add new item to the cart array
                var newItem = { name: itemName, price: itemPrice };
                cartItems.push(newItem);
                
                // Save updated cart back to localStorage
                localStorage.setItem('cartItems', JSON.stringify(cartItems));

                window.location.href = "cart.html";
            }
        });
    });
});
