document.addEventListener("DOMContentLoaded", async function () {
    const recommendationContainer = document.querySelector(".recommendation-container");

    if (!recommendationContainer) {
        console.error("Recommendation container not found!");
        return;
    }

    async function fetchProducts() {
        try {
            const response = await fetch("http://localhost:5000/productget");
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            const products = await response.json();

            if (!Array.isArray(products) || products.length === 0) {
                recommendationContainer.innerHTML = "<p>No products available.</p>";
                return;
            }

            // Shuffle array and pick up to 4 random products
            const shuffledProducts = [...products].sort(() => Math.random() - 0.5).slice(0, 4);
            
            displayProducts(shuffledProducts);
        } catch (error) {
            console.error("Error fetching products:", error);
            recommendationContainer.innerHTML = "<p>Error loading products. Please try again later.</p>";
        }
    }

    function displayProducts(products) {
        recommendationContainer.innerHTML = ""; 

        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");

            productCard.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p><strong>Price:</strong> $${parseFloat(product.price).toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product._id}" data-name="${product.name}" data-price="${product.price}">
                    Add to Cart
                </button>
            `;

            recommendationContainer.appendChild(productCard);
        });

        attachCartEventListeners();
    }

    function attachCartEventListeners() {
        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", function () {
                const productId = this.getAttribute("data-id");
                const productName = this.getAttribute("data-name");
                const productPrice = parseFloat(this.getAttribute("data-price"));

                let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

                const existingItem = cartItems.find(item => item.id === productId);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cartItems.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
                }

                localStorage.setItem("cartItems", JSON.stringify(cartItems));
                alert(`${productName} added to cart!`);
            });
        });
    }

    fetchProducts();
});
