document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos do DOM
    const productCatalogEl = document.getElementById('product-catalog');
    const cartItemsEl = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    // Adicionei um ID ao elemento HTML para exibir o total do carrinho,
    // corrigindo a falta de um elemento para a variável `cartTotalEl`.
    const cartTotalEl = document.getElementById('cart-total');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeMessageBtn = document.getElementById('close-message-btn');

    // Dados dos produtos
    const products = [
        { id: 'laptop', name: 'Laptop', price: 3500, initialStock: 5, currentStock: 5, image: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=LAPTOP' },
        { id: 'mouse', name: 'Mouse', price: 80, initialStock: 20, currentStock: 20, image: 'https://placehold.co/100x100/808080/FFFFFF?text=MOUSE' },
        { id: 'keyboard', name: 'Keyboard', price: 250, initialStock: 10, currentStock: 10, image: 'https://placehold.co/100x100/606060/FFFFFF?text=KEYBOARD' },
        // Corrigi os nomes dos produtos 'Monitor' e 'Headset' que estavam em branco.
        { id: 'monitor', name: 'Monitor', price: 1200, initialStock: 3, currentStock: 3, image: 'https://placehold.co/100x100/404040/FFFFFF?text=MONITOR' },
        { id: 'headset', name: 'Headset', price: 150, initialStock: 15, currentStock: 15, image: 'https://placehold.co/100x100/202020/FFFFFF?text=HEADSET' }
    ];

    let cart = [];

    // Funções de manipulação da UI
    function showMessage(message) {
        messageText.textContent = message;
        messageBox.style.display = 'flex';
    }

    function hideMessage() {
        messageBox.style.display = 'none';
    }

    function renderProductsCatalog() {
        productCatalogEl.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.dataset.productId = product.id;

            const stockMessage = product.currentStock > 0 ? `Stock: ${product.currentStock}` : 'Sold Out!';
            const stockClass = product.currentStock <= 3 && product.currentStock > 0 ? 'low-stock' : '';
            const addButtonDisabled = product.currentStock === 0 ? 'disabled' : '';

            // Corrigi a sintaxe do `product.toFixed(2)` para `product.price.toFixed(2)` para
            // garantir que o método seja chamado na propriedade correta.
            productCard.innerHTML = `
                <img class="product-image" src="${product.image}" alt="${product.name}">
                <p class="product-name">${product.name}</p>
                <p class="product-price">R$ ${product.price.toFixed(2)}</p>
                <p class="product-stock ${stockClass}">${stockMessage}</p>
                <button class="action-button primary add-to-cart-btn" data-product-id="${product.id}" ${addButtonDisabled}>Add to Cart</button>
            `;
            productCatalogEl.appendChild(productCard);
        });

        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                addToCart(productId);
            });
        });
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
                const product = products.find(p => p.id === item.productId);
                if (!product) return;

                // Corrigi a declaração duplicada da variável `cartItemsEl` e a forma como o elemento é anexado ao pai.
                // Agora, a variável `cartItemEl` é criada e adicionada corretamente ao `cartItemsEl` global.
                const cartItemEl = document.createElement('div');
                cartItemEl.classList.add('cart-item');
                cartItemEl.dataset.productId = item.productId;

                // Corrigi os erros de digitação nos atributos `data-product-id` e na classe `adjust-quantity-btn`.
                // A sintaxe agora está correta.
                cartItemEl.innerHTML = `
                    <div class="item-details">
                        <p class="item-name">${item.quantity}x ${product.name}</p>
                        <p class="item-price-quantity">R$ ${product.price.toFixed(2)} each</p>
                    </div>
                    <div class="item-actions">
                        <button class="adjust-quantity-btn" data-product-id="${item.productId}" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="adjust-quantity-btn" data-product-id="${item.productId}" data-action="increase">+</button>
                        <button class="remove-all-btn" data-product-id="${item.productId}">Remove</button>
                    </div>
                `;
                cartItemsEl.appendChild(cartItemEl);
            });

            // Corrigi a sintaxe dos laços `forEach` para que os event listeners sejam adicionados corretamente.
            document.querySelectorAll('.adjust-quantity-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.dataset.productId;
                    const action = e.target.dataset.action;
                    if (action === 'increase') {
                        addToCart(productId);
                    } else {
                        removeFromCart(productId);
                    }
                });
            });

            document.querySelectorAll('.remove-all-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.dataset.productId;
                    removeAllFromCart(productId);
                });
            });
        }
        updateCartTotal();
    }

    /**
     * @param {string} productId
     */
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) {
            showMessage('Product Not Found at Catalogue.');
            return;
        }

        if (product.currentStock <= 0) {
            showMessage(`Sorry, "${product.name}" is Out of Stock.`);
            return;
        }

        const existingItem = cart.find(item => item.productId === productId);
        if (existingItem) {
            if (product.currentStock > 0) {
                existingItem.quantity++;
                product.currentStock--;
                showMessage(`Another "${product.name}" Added to Cart.`);
            } else {
                showMessage(`You Already Added the Maximum Stock Possible of "${product.name}".`);
            }
        } else {
            cart.push({
                productId: product.id,
                quantity: 1
            });
            product.currentStock--;
            showMessage(`"${product.name}" Added to Cart!`);
        }
        renderProductsCatalog();
        renderCart();
    }

    /**
     * @param {string} productId
     */
    function removeFromCart(productId) {
        const itemIndex = cart.findIndex(item => item.productId === productId);
        const product = products.find(p => p.id === productId);

        if (itemIndex > -1) {
            const itemToRemove = cart[itemIndex];
            itemToRemove.quantity--;
            product.currentStock++;

            // Corrigi a lógica para remover o item do carrinho quando a quantidade chega a zero.
            // Agora, se a quantidade for menor ou igual a zero, o item é removido do array `cart`.
            if (itemToRemove.quantity <= 0) {
                cart.splice(itemIndex, 1);
                showMessage(`All Units of "${product.name}" have been Removed from Cart.`);
            } else {
                showMessage(`A Unit of "${product.name}" has been Removed from Cart.`);
            }

            renderProductsCatalog();
            renderCart();
        }
    }

    /**
     * @param {string} productId
     */
    function removeAllFromCart(productId) {
        const itemIndex = cart.findIndex(item => item.productId === productId);
        const product = products.find(p => p.id === productId);

        if (itemIndex > -1) {
            const itemToRemove = cart[itemIndex];
            product.currentStock += itemToRemove.quantity;
            // Corrigi o erro de digitação `cart [itemIndex]` para `cart[itemIndex]`.
            cart.splice(itemIndex, 1);
            showMessage(`All Units of "${product.name}" have been Removed from Cart.`);

            renderProductsCatalog();
            renderCart();
        }
    }

    function updateCartTotal() {
        let total = 0;
        cart.forEach(item => {
            // Corrigi o erro de digitação `item.productId` no método find para que a busca seja correta.
            const product = products.find(p => p.id === item.productId);
            if (product) {
                total += item.quantity * product.price;
            }
        });
        
        // Criei um elemento para o total se ele ainda não existir no DOM.
        const cartSummaryEl = document.querySelector('.cart-summary');
        let totalElement = document.getElementById('cart-total');
        if (!totalElement) {
            totalElement = document.createElement('span');
            totalElement.id = 'cart-total';
            cartSummaryEl.insertBefore(totalElement, checkoutBtn);
            const totalLabel = document.createElement('span');
            totalLabel.textContent = 'Total: ';
            cartSummaryEl.insertBefore(totalLabel, totalElement);
        }

        cartTotalEl.textContent = `R$ ${total.toFixed(2)}`;
    }

    function clearAllCart() {
        if (cart.length === 0) {
            showMessage('Your Cart is Already Empty.');
            return;
        }

        if (confirm('Are you Sure you Want to Clear your Cart?')) {
            cart.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                if (product) {
                    product.currentStock += item.quantity;
                }
            });
            cart = [];
            showMessage('Cart Cleared.');
            renderProductsCatalog();
            renderCart();
        }
    }

    function checkout() {
        if (cart.length === 0) {
            showMessage('Your Cart is Already Empty. Add more Products before Finishing your Purchase.');
            return;
        }

        const total = cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.productId);
            // Adicionei uma verificação para garantir que o produto existe antes de tentar acessá-lo.
            if (product) {
                return sum + (item.quantity * product.price);
            }
            return sum;
        }, 0);

        if (confirm(`Finish your Purchase? Total: R$ ${total.toFixed(2)}`)) {
            cart = [];
            showMessage(`Purchase Finished Successfully! Total : R$ ${total.toFixed(2)}. Thanks for Buying!`);
            renderProductsCatalog();
            renderCart();
        }
    }

    function initializeStore() {
        renderProductsCatalog();
        renderCart();
    }

    // Adicionando os event listeners aos botões
    clearCartBtn.addEventListener('click', clearAllCart);
    checkoutBtn.addEventListener('click', checkout);
    closeMessageBtn.addEventListener('click', hideMessage);
    messageBox.addEventListener('click', (e) => {
        if (e.target === messageBox) {
            hideMessage();
        }
    });

    // Inicia a aplicação
    initializeStore();
});
/* Código corrigido pela IA Gemini */