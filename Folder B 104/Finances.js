document.addEventListener('DOMContentLoaded', () => {
    const transactionForm = document.getElementById('transaction-form');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const typeSelect = document.getElementById('type');
    const categorySelect = document.getElementById('category');
    const addCategoryBtn = document.getElementById('add-category-btn');
    const currentBalanceSpan = document.getElementById('current-balance');
    const transactionsList = document.getElementById('transactions-list');

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let categories = JSON.parse(localStorage.getItem('categories')) || ['Food', 'Transport', 'Salary', 'Bills', 'Entertainment'];

    function saveTransactions() {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    function saveCategories() {
        localStorage.setItem('categories', JSON.stringify(categories));
    }

    function formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function populateCategories() {
        categorySelect.innerHTML = '<option value="">Select a Category</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    addCategoryBtn.addEventListener('click', () => {
        const newCategory = prompt('Enter new category name:');
        if (newCategory) {
            const trimmedCategory = newCategory.trim();
            if (trimmedCategory && !categories.includes(trimmedCategory)) {
                categories.push(trimmedCategory);
                saveCategories();
                populateCategories();
                categorySelect.value = trimmedCategory;
            } else if (trimmedCategory) {
                alert('This Category Already Exists or is Empty');
            }
        }
    });

    function updateBalance() {
        const totalBalance = transactions.reduce((sum, transaction) => {
            return sum + (transaction.type === 'income' ? transaction.amount : -transaction.amount);
        }, 0);
        currentBalanceSpan.textContent = formatCurrency(totalBalance);
    }

    function renderTransactions() {
        transactionsList.innerHTML = '';

        const sortedForDisplay = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedForDisplay.forEach(transaction => {
            const listItem = document.createElement('li');
            listItem.classList.add(transaction.type);

            const amountSign = transaction.type === 'income' ? '+' : '-';
            const formattedAmount = formatCurrency(transaction.amount);
            const transactionDate = new Date(transaction.date).toLocaleDateString('pt-BR');

            listItem.innerHTML = `
                <div class="transaction-content">
                    <div class="transaction-details">
                        <div class="description">${transaction.description}</div>
                        <span class="category">${transaction.category}</span>
                    </div>
                    <span class="date">${transactionDate}</span>
                    <div class="amount-container">
                        <span class="amount">${amountSign} ${formattedAmount}</span>
                        <button class="delete-btn" data-id="${transaction.id}">x</button>
                    </div>
                </div>
            `;

            transactionsList.appendChild(listItem);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const idToDelete = parseInt(e.currentTarget.dataset.id);
                transactions = transactions.filter(t => t.id !== idToDelete);
                saveTransactions();
                updateBalance();
                renderTransactions();
            });
        });
    }

    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newTransaction = {
            id: Date.now(),
            description: descriptionInput.value.trim(),
            amount: parseFloat(amountInput.value),
            type: typeSelect.value,
            category: categorySelect.value || 'Others',
            date: new Date().toISOString()
        };

        if (newTransaction.description === '' || isNaN(newTransaction.amount) || newTransaction.amount <= 0) {
            alert('Please Fill all the Fields Correctly (Value must be Positive).');
            return;
        }

        if (newTransaction.category === '') {
            alert('Please Select or Add a Category.');
            return;
        }

        transactions.push(newTransaction);
        saveTransactions();
        updateBalance();
        renderTransactions();

        descriptionInput.value = '';
        amountInput.value = '';
        typeSelect.value = 'expense';
        categorySelect.value = '';
    });

    function initializeApp() {
        populateCategories();
        updateBalance();
        renderTransactions();
    }

    initializeApp();
});
/* Codigo corrigido pela IA Gemini, corrigidos erros de sintaxe, lógica e digitação */