document.addEventListener('DOMContentLoaded', () => {
    const playerNameEl = document.getElementById('player-name');
    const playerHealthBar = document.getElementById('player-health-bar');
    const playerHealthText = document.getElementById('player-health-text');
    const playerImage = document.getElementById('player-image');
    const playerAbilitiesContainer = document.getElementById('player-abilities');
    const monsterNameEl = document.getElementById('monster-name');
    const monsterHealthBar = document.getElementById('monster-health-bar');
    const monsterHealthText = document.getElementById('monster-health-text');
    const monsterImage = document.getElementById('monster-image');
    const combatLogEl = document.getElementById('combat-log');
    const gameOverModal = document.getElementById('game-over-modal');
    const gameOverTitle = document.getElementById('game-over-title');
    const gameOverMessage = document.getElementById('game-over-message');
    const restartGameBtn = document.getElementById('restart-game-btn');

    let player = {};
    let monster = {};
    let currentTurn = 'player';
    let gameEnded = false;

    const playerBase = {
        name: 'Head Hooligan',
        maxHp: 100,
        currentHp: 100,
        attack: 15,
        defense: 3,
        abilities: [
            { name: 'Heavy Strike', damage: 20, effect: null,
                description: 'A Strong Hit with your Bat.' 
            },
            { name: 'Guard', damage: 0,
                effect: 'defense-boost', description: 'Brace yourself, Reducing Damage Taken this Turn.'
            },
            { name: 'Hit', damage: 10,
                effect: 'double-attack', description: 'Hit Twice with your Bat, Dealing 2 Hits.'
            }
        ],
        effects: {
            defense_boost: 0
        }
    };
    const monsterBase = {
        name: 'Peccatulum Irae',
        maxHp: 80,
        attack: 12,
        defense: 3,
        abilities: [
            { name: 'Explosive Wrath', damage: 18, effect: null },
            { name: 'Growl', damage: 0, effect: 'weaken_player' }
        ],
        effects: {
            weaken_player: 0
        }
    };
    function initializeGame() {
        player = JSON.parse(JSON.stringify(playerBase));
        monster = JSON.parse(JSON.stringify(monsterBase));
        currentTurn = 'player';
        gameEnded = false;
        combatLogEl.innerHTML = '';
        gameOverModal.style.display = 'none';
        updateUi();
        addLogMessage('The Fight is On!', 'game-event');
        enablePlayerAbilities(true);
    }
    function updateUi () {
        playerNameEl.textContent = player.name;
        playerHealthBar.style.width = `${(player.currentHp / player.maxHp) * 100}%`;
        playerHealthText.textContent = `${player.currentHp}/${player.maxHp} HP`;
        playerHealthBar.style.backgroundColor = getHealthColor(player.currentHp, player.maxHp);
        monsterNameEl.textContent = monster.name;
        monsterHealthBar.style.width = `${(monster.currentHp / monster.maxHp) * 100}%`;
        monsterHealthText.textContent = `${monster.currentHp}/${monster.maxHp} HP`;
        monsterHealthBar.style.backgroundColor = getHealthColor(monster.currentHp, monster.maxHp);
    }
    function getHealthColor(currentHp, maxHp) {
        const percentage = (currentHp / maxHp) * 100;
        if (percentage > 50) return '#2ecc/1';
        if (percentage > 20) return '#f1c40f';
        return '#e74c3c';
    }
    /**
     * @param {number} currentHp
     * @param {number} maxHp
     * @returns {string}
     */
    function addLogMessage(message, type) {
        const logEntry = document.createElement('p');
        logEntry.classList.add('log-message', type);
        logEntry.textContent = message;
        combatLogEl.appendChild(logEntry);
        combatLogEl.scrollTop = combatLogEl.scrollHeight;
    }
    /**
     * @param {boolean} enable
     */
    function enablePlayerAbilities(enable) {
        playerAbilitiesContainer.querySelectorAll('.ability-button').forEach(button => {
            button.disabled = !enable;
        });
    }
    /**
     * @returns {boolean} 
     */
    function checkGameEnd() {
        if (player.currentHp <= 0) {
            player.currentHp = 0;
            updateUi();
            endGame('Defeat!', 'You Have been Defeated by the Peccatulum!');
            return true;
        }
        if (monster.currentHp <= 0) {
            monster.currentHp = 0;
            updateUi();
            endGame('Victory!', 'You Have Defeated the Peccatulum!');
            return true;
        }
        return false;
    }
    /**
     * @param {string} title
     * @param {string} message
    */
   function endGame(title, message) {
    gameEnded = true;
    enablePlayerAbilities(false);
    gameOverTitle.textContent = title;
    gameOverMessage.textContent = message;
    gameOverModal.style.display = 'flex';
   }
   /**
    * @param {Object} ability
    */
   async function playerAttack(ability) {
    if (currentTurn !== 'player' || gameEnded) return;
    enablePlayerAbilities(false);
    addLogMessage(`${player.name} used ${ability.name}.`, 'player-turn');
    let damageDealt = ability.damage;
    let actualDamage = Math.max(0, damageDealt - monster.defense);
    if (ability.effect === 'defense_boost') {
        player.effects.defense_boost = 2;
        addLogMessage(`${player.name} Braces for Impact.`, 'player-turn');
        actualDamage = 0;
    } else if (ability.effect === 'double-attack') {
        monster.currentHp -= actualDamage;
        addLogMessage(`${player.name} Dealt ${actualDamage} Damage`, 'player-turn');
        updateUi();
        if (checkGameEnd()) return;
        await new Promise(resolve => setTimeout(resolve, 700));
        addLogMessage(`${player.name} Strikes Again.`, 'player-turn');
        actualDamage = Math.max(0, ability.damage - monster.defense);
        monster.currentHp -= actualDamage;
        addLogMessage(`${player.name} Dealt ${actualDamage} Damage.`, 'player-turn');
    } else {
        monster.currentHp -= actualDamage;
        addLogMessage(`${player.name} Dealt ${actualDamage} Damage.`, 'player-turn');
    }
    updateUi();
    if (checkGameEnd()) return;
    applyEffects();

    await new Promise(resolve => setTimeout(resolve, 1500));
    currentTurn = 'monster';
    monsterTurn();
   }
   async function monsterTurn() {
    if (gameEnded) return;

    addLogMessage(`${monster.name}'s Turn.`, 'monster-turn');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const randomAbility = monster.abilities[Math.floor(Math.random() * monster.abilities.length)];
    addLogMessage(`${monster.name} Used ${randomAbility.name}.`, 'monster-turn');
    let damageDealt = randomAbility.damage;
    let actualDamage = Math.max(0, damageDealt - player.defense);
    if (player.effects.defense_boost > 0) {
        const boostedDamage = Math.floor(actualDamage * 0.5);
        addLogMessage(`${player.name} Blocked Part of the Attack. (-${actualDamage - boostedDamage} Damage)`, 'player-turn');
        actualDamage = boostedDamage;
    }
    if (randomAbility.effect === 'weaken_player') {
        player.effects.weaken_player = 2;
        addLogMessage(`${monster.name} Weakens ${player.name}.`, 'monster-turn');
        actualDamage = 0;
    } else {
        player.currentHp -= actualDamage;
        addLogMessage(`${monster.name} Dealt ${actualDamage} Damage.`, 'monster-turn');
    }
    updateUi() ;
    if (checkGameEnd()) return;
    applyEffects();
    await new Promise(resolve => setTimeout(resolve, 1500));
    currentTurn = 'player';
    enablePlayerAbilities(true);
   }
   function applyEffects() {
    if (player.effects.defense_boost > 0) {
        player.effects.defense_boost--;
        if (player.effects.defense_boost === 0) {
            addLogMessage(`${player.name}'s Guard has Ended.`, 'game-event');
        }
    }
    if (player.effects.weaken_player > 0) {
        player.effects.weaken_player--;
        if (player.effects.weaken_player === 0) {
            addLogMessage(`${player.name} Is no longer Weakened.`, 'game-event');
        }
    }
   }
   playerBase.abilities.forEach(ability => {
    const button = document.createElement('button');
    button.classList.add('ability-button');
    button.textContent = ability.name;
    button.title = ability.description;
    button.addEventListener('click', () => playerAttack(ability));
    playerAbilitiesContainer.appendChild(button);
   });
   restartGameBtn.addEventListener('click', initializeGame);

   initializeGame();
});