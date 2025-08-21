document.addEventListener('DOMContentLoaded', () => {
    const productListEl = document.getElementById('product-list');
    const cartItemsEl = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartTotalEl = document.getElementById('cart-total'); // Corrigido
    const clearCartBtn = document.getElementById('clear-cart-btn'); // Corrigido
    const checkoutBtn = document.getElementById('checkout-btn');

    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeMessageBtn = document.getElementById('close-message-btn');

    const products = [
        { id: 'apple', name: 'Apple', basePrice: 1.50, currentPrice: 1.50, image: 'https://placehold.co/100x100/FF5733/FFFFFF?text=MAÇA' },
        { id: 'banana', name: 'Banana', basePrice: 0.80, currentPrice: 0.80, image: 'https://placehold.co/100x100/FFC300/000000?text=BANANA' }, // Corrigido
        { id: 'bread', name: 'Bread', basePrice: 5.00, currentPrice: 5.00, image: 'https://placehold.co/100x100/8B4513/FFFFFF?text=PÃO' },
        { id: 'milk', name: 'Milk', basePrice: 3.20, currentPrice: 3.20, image: 'https://placehold.co/100x100/ADD8E6/000000?text=LEITE' },
        { id: 'cheese', name: 'Cheese', basePrice: 12.00, currentPrice: 12.00, image: 'https://placehold.co/100x100/FFD700/000000?text=QUEIJO' }, // Corrigido
        { id: 'coffee', name: 'Coffee', basePrice: 8.50, currentPrice: 8.50, image: 'https://placehold.co/100x100/6F4E37/FFFFFF?text=CAFÉ' }, // Corrigido
    ];
    let cart = [];

    const PRICE_CHANGE_INTERVAL = 3000;
    const MAX_PRICE_FLUCTUATION = 0.10;
    let marketInterval = null;

    function showMessage(message) {
        messageText.textContent = message;
        messageBox.style.display = 'flex';
    }

    function hideMessage() {
        messageBox.style.display = 'none';
    }

    function renderProducts() {
        productListEl.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.dataset.productId = product.id;

            productCard.innerHTML = `
            <img class="product-image" src="${product.image}" alt="${product.name}">
            <p class="product-name">${product.name}</p>
            <p class="product-price" id="price-${product.id}">R$ ${product.currentPrice.toFixed(2)}</p>
            <button class="action-button primary add-to-cart-btn" data-product-id="${product.id}">
            Add to Cart</button>
            `;
            productListEl.appendChild(productCard);
        });
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                addToCart(productId);
            });
        });
    }

    function updateProductPrices() {
        products.forEach(product => {
            const oldPrice = product.currentPrice;
            const fluctuation = (Math.random() * 2 - 1) * MAX_PRICE_FLUCTUATION;
            product.currentPrice = product.basePrice * (1 + fluctuation);
            product.currentPrice = parseFloat(product.currentPrice.toFixed(2));

            const priceEl = document.getElementById(`price-${product.id}`);
            if (priceEl) {
                priceEl.textContent = `R$ ${product.currentPrice.toFixed(2)}`;
                if (product.currentPrice > oldPrice) {
                    priceEl.classList.add('price-up');
                    priceEl.classList.remove('price-down');
                } else if (product.currentPrice < oldPrice) {
                    priceEl.classList.add('price-down');
                    priceEl.classList.remove('price-up');
                } else {
                    priceEl.classList.remove('price-up', 'price-down');
                }
            }
        });
        renderCart();
    }

    function renderCart() {
        cartItemsEl.innerHTML = '';

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            clearCartBtn.disabled = true;
            checkoutBtn.disabled = true;
        } else {
            emptyCartMessage.style.display = 'none';
            clearCartBtn.disabled = false;
            checkoutBtn.disabled = false;

            cart.forEach(item => {
                const cartItemEl = document.createElement('div');
                cartItemEl.classList.add('cart-item');
                cartItemEl.dataset.productId = item.productId;

                const product = products.find(p => p.id === item.productId);
                const currentProductPrice = product ? product.currentPrice : item.priceAtAddToCart;

                cartItemEl.innerHTML = `
                <div class="item-details">
                <p class="item-name">${item.quantity}x ${item.name}</p>
                <p class="item-price-quantity">
                R$ ${currentProductPrice.toFixed(2)} Each</p>
                </div>
                <div class="item-actions">
                <button class="remove-from-cart-btn" data-product-id="${item.productId}">Remove</button>
                </div>
                `;
                cartItemsEl.appendChild(cartItemEl);
            });
            document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.dataset.productId;
                    removeFromCart(productId);
                });
            });
        }
        updateCartTotal();
    }

    function addToCart(productId) {
        const productToAdd = products.find(p => p.id === productId);
        if (!productToAdd) {
            showMessage('Product not Found.');
            return;
        }
        const existingItem = cart.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity++;
            existingItem.priceAtAddToCart = productToAdd.currentPrice;
        } else {
            cart.push({
                productId: productToAdd.id,
                name: productToAdd.name,
                quantity: 1,
                priceAtAddToCart: productToAdd.currentPrice
            });
        }
        showMessage(`${productToAdd.name} Added to Cart.`);
        renderCart();
    }

    function removeFromCart(productId) {
        const itemIndex = cart.findIndex(item => item.productId === productId);

        if (itemIndex > -1) {
            const itemToRemove = cart[itemIndex];
            if (itemToRemove.quantity > 1) {
                itemToRemove.quantity--;
                showMessage(`A Unit of ${itemToRemove.name} was Removed.`);
            } else {
                cart.splice(itemIndex, 1); // Corrigido
                showMessage(`${itemToRemove.name} Removed from Cart`);
            }
            renderCart();
        }
    }

    function updateCartTotal() {
        let total = 0;
        cart.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            const priceToUse = product ? product.currentPrice : item.priceAtAddToCart;
            total += item.quantity * priceToUse;
        });
        cartTotalEl.textContent = `R$ ${total.toFixed(2)}`;
    }

    function clearCart() { // Renomeado
        if (cart.length === 0) {
            showMessage('Your Cart is Already Empty.');
            return;
        }
        if (confirm('Are you Sure you want to Clear your Cart?')) {
            cart = [];
            showMessage('Cart Cleared');
            renderCart();
        }
    }

    function checkout() {
        if (cart.length === 0) {
            showMessage('Your Cart is Empty. Add Products to it Before Finishing a Purchase.');
            return;
        }
        const total = cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.productId); // Corrigido
            return sum + (item.quantity * (product ? product.currentPrice : item.priceAtAddToCart));
        }, 0);

        if (confirm(`Finish your Purchase? Total: R$ ${total.toFixed(2)}`)) {
            showMessage(`Purchase Finished Successfully! Total: R$ ${total.toFixed(2)}. Thanks for Buying!`);
            cart = [];
            renderCart();
        }
    }

    function initializeMarket() {
        renderProducts();
        renderCart();
        marketInterval = setInterval(updateProductPrices, PRICE_CHANGE_INTERVAL);
    }

    clearCartBtn.addEventListener('click', clearCart); // Corrigido
    checkoutBtn.addEventListener('click', checkout);
    closeMessageBtn.addEventListener('click', hideMessage);
    messageBox.addEventListener('click', (e) => {
        if (e.target === messageBox) {
            hideMessage();
        }
    });
    initializeMarket();
});
/* Código Corrigido pela IA Gemini */ 