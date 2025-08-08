document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos do DOM ---
    const itemCountSpan = document.getElementById('item-count');
    const ipsCountSpan = document.getElementById('ips-count');
    const produceButton = document.getElementById('produce-button');
    const upgradesListDiv = document.getElementById('upgrades-list');
    const saveGameBtn = document.getElementById('save-game');
    const loadGameBtn = document.getElementById('load-game');
    const resetGameBtn = document.getElementById('reset-game');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeMessageBtn = document.getElementById('close-message');

    // --- Variáveis de Estado do Jogo ---
    let items = 0; // Current number of items
    let clickProduction = 1; // Items produced per click
    let automatedProductionPerSecond = 0; // Items produced automatically per second

    // --- Upgrade Definitions ---
    // Each upgrade has an ID, name, base cost, cost multiplier, base IPS gain, and current level.
    const upgrades = [
        {
            id: 'worker',
            name: 'Trabalhador',
            baseCost: 10,
            costMultiplier: 1.15,
            ipsGain: 1,
            level: 0
        },
        {
            id: 'machine',
            name: 'Máquina de Produção',
            baseCost: 100,
            costMultiplier: 1.2,
            ipsGain: 10,
            level: 0
        },
        {
            id: 'factory',
            name: 'Fábrica Automatizada',
            baseCost: 1000,
            costMultiplier: 1.25,
            ipsGain: 100,
            level: 0
        },
        {
            id: 'super_click',
            name: 'Clique Potente',
            baseCost: 50,
            costMultiplier: 1.5,
            clickGain: 1, // This upgrade increases click production
            level: 0
        }
    ];

    // --- Game Functions ---

    // Updates the display of items and IPS
    function updateDisplay() {
        itemCountSpan.textContent = Math.floor(items); // Display integer items
        ipsCountSpan.textContent = automatedProductionPerSecond.toFixed(1); // Display IPS with one decimal
        updateUpgradeButtons(); // Ensure upgrade buttons are updated based on current items
    }

    // Produces items when the button is clicked
    function produceItems() {
        items += clickProduction;
        updateDisplay();
    }

    // Calculates the current cost of an upgrade based on its level
    function getUpgradeCost(upgrade) {
        return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level));
    }

    // Calculates the total automated production per second
    function calculateTotalIPS() {
        let totalIPS = 0;
        upgrades.forEach(upgrade => {
            if (upgrade.ipsGain) { // Only for upgrades that provide IPS
                totalIPS += upgrade.ipsGain * upgrade.level;
            }
        });
        automatedProductionPerSecond = totalIPS;
    }

    // Purchases an upgrade
    function buyUpgrade(upgradeId) {
        const upgrade = upgrades.find(up => up.id === upgradeId);
        if (!upgrade) {
            showMessage('Erro: Melhoria não encontrada!');
            return;
        }

        const cost = getUpgradeCost(upgrade);

        if (items >= cost) {
            items -= cost;
            upgrade.level++;

            if (upgrade.clickGain) { // If it's a click-based upgrade
                clickProduction += upgrade.clickGain;
            } else { // If it's an IPS-based upgrade
                calculateTotalIPS();
            }
            updateDisplay();
            renderUpgrades(); // Re-render upgrades to update costs and levels
            showMessage(`${upgrade.name} comprado! Nível ${upgrade.level}`);
        } else {
            showMessage(`Itens insuficientes! Você precisa de ${cost} itens para comprar ${upgrade.name}.`);
        }
    }

    // Renders all upgrade items in the list
    function renderUpgrades() {
        upgradesListDiv.innerHTML = ''; // Clear existing upgrades
        upgrades.forEach(upgrade => {
            const upgradeDiv = document.createElement('div');
            upgradeDiv.classList.add('upgrade-item');

            const cost = getUpgradeCost(upgrade);
            const effectText = upgrade.ipsGain ? `${upgrade.ipsGain} IPS` : `${upgrade.clickGain} por clique`;

            upgradeDiv.innerHTML = `
                <h3>${upgrade.name} (Nível ${upgrade.level})</h3>
                <p>Custo: <span class="cost">${cost}</span> itens</p>
                <p>Efeito: <span class="effect">+${effectText}</span></p>
                <button class="upgrade-button" data-upgrade-id="${upgrade.id}">Comprar</button>
            `;
            upgradesListDiv.appendChild(upgradeDiv);
        });
        updateUpgradeButtons(); // Ensure button states are correct after rendering
    }

    // Updates the enabled/disabled state of upgrade buttons
    function updateUpgradeButtons() {
        document.querySelectorAll('.upgrade-button').forEach(button => {
            const upgradeId = button.dataset.upgradeId;
            const upgrade = upgrades.find(up => up.id === upgradeId);
            const cost = getUpgradeCost(upgrade);
            button.disabled = items < cost;
        });
    }

    // Game loop for automated production
    function gameLoop() {
        items += automatedProductionPerSecond / 10; // Divide by 10 for 10 updates per second
        updateDisplay();
    }

    // --- Save/Load/Reset Game ---

    // Shows a message box
    function showMessage(msg) {
        messageText.textContent = msg;
        messageBox.style.display = 'flex'; // Use flex to center
    }

    // Hides the message box
    function hideMessage() {
        messageBox.style.display = 'none';
    }

    // Saves game state to localStorage
    function saveGame() {
        const gameState = {
            items: items,
            clickProduction: clickProduction,
            upgrades: upgrades.map(up => ({
                id: up.id,
                level: up.level
            }))
        };
        localStorage.setItem('incrementalGameSave', JSON.stringify(gameState));
        showMessage('Jogo salvo com sucesso!');
    }

    // Loads game state from localStorage
    function loadGame() {
        const savedState = localStorage.getItem('incrementalGameSave');
        if (savedState) {
            const gameState = JSON.parse(savedState);
            items = gameState.items;
            clickProduction = gameState.clickProduction;

            // Update upgrade levels from saved state
            upgrades.forEach(upgrade => {
                const savedUpgrade = gameState.upgrades.find(up => up.id === upgrade.id);
                if (savedUpgrade) {
                    upgrade.level = savedUpgrade.level;
                } else {
                    upgrade.level = 0; // Reset if not found in save (new upgrade added later)
                }
            });

            calculateTotalIPS(); // Recalculate IPS based on loaded upgrades
            updateDisplay();
            renderUpgrades(); // Re-render upgrades to reflect loaded levels
            showMessage('Jogo carregado com sucesso!');
        } else {
            showMessage('Nenhum jogo salvo encontrado.');
        }
    }

    // Resets game to initial state
    function resetGame() {
        if (confirm('Tem certeza que deseja reiniciar o jogo? Todo o progresso será perdido!')) {
            items = 0;
            clickProduction = 1;
            automatedProductionPerSecond = 0;
            upgrades.forEach(upgrade => {
                upgrade.level = 0; // Reset all upgrade levels
            });
            localStorage.removeItem('incrementalGameSave'); // Clear saved game
            updateDisplay();
            renderUpgrades();
            showMessage('Jogo reiniciado!');
        }
    }

    // --- Event Listeners ---
    produceButton.addEventListener('click', produceItems);

    // Event delegation for upgrade buttons (since they are dynamically created)
    upgradesListDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains('upgrade-button')) {
            const upgradeId = e.target.dataset.upgradeId;
            buyUpgrade(upgradeId);
        }
    });

    saveGameBtn.addEventListener('click', saveGame);
    loadGameBtn.addEventListener('click', loadGame);
    resetGameBtn.addEventListener('click', resetGame);
    closeMessageBtn.addEventListener('click', hideMessage);

    // --- Initialization ---
    renderUpgrades(); // Render upgrades initially
    calculateTotalIPS(); // Calculate initial IPS
    updateDisplay(); // Update display with initial values

    // Start the game loop (10 updates per second)
    setInterval(gameLoop, 100);
});
/* código copiado de "igormelol", por questões de tempo diante do tamanho do código */