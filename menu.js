// Toggle filter options visibility
document.getElementById('filterBtn').addEventListener('click', function() {
    const filterOptions = document.getElementById('filterOptions');
    if (filterOptions.style.display === 'none' || filterOptions.style.display === '') {
      filterOptions.style.display = 'block';
    } else {
      filterOptions.style.display = 'none';
    }
  });
  
  // Update price range display value
  const priceRange = document.getElementById('priceRange');
  const priceValue = document.getElementById('priceValue');
  
  priceRange.addEventListener('input', function() {
    priceValue.textContent = `$0 - $${priceRange.value}`;
  });
  
  // Submit filter options
  document.getElementById('submitBtn').addEventListener('click', function() {
    const selectedCategories = [];
    if (document.getElementById('clothing').checked) selectedCategories.push('Clothing');
    if (document.getElementById('home_decor').checked) selectedCategories.push('home_decor');
    if (document.getElementById('food').checked) selectedCategories.push('food');
  
    const selectedPriceRange = priceRange.value;
  
    // Process the selected filters (e.g., display them in the console)
    console.log('Selected Categories:', selectedCategories);
    console.log('Selected Price Range: $0 - $' + selectedPriceRange);
  });
  
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
