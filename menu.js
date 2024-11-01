document.addEventListener('DOMContentLoaded', function () {
    var menuContainers = document.querySelectorAll('.menu_container');
    
    menuContainers.forEach(function (container) {
        container.addEventListener('click', function (event) {
            // Check if the clicked element is a button
            if (event.target.classList.contains('butt')) {
                var item = event.target.closest('.items');
                
                // Ensure that the item exists
                if (item) {
                    var itemName = item.querySelector('h3').textContent;
                    var itemPrice = item.querySelector('p').textContent;

                    // Notify the user
                    alert("Item added to cart successfully");

                    // Retrieve existing cart items from localStorage
                    var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

                    // Add new item to the cart array
                    var newItem = { name: itemName, price: itemPrice };
                    cartItems.push(newItem);
                    
                    // Save updated cart back to localStorage
                    localStorage.setItem('cartItems', JSON.stringify(cartItems));

                    // Redirect to cart page
                    window.location.href = "cart.html";
                }
            }
        });
    });
});
