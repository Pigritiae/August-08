document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const petImage = document.getElementById('pet-image');
    const petNameEl = document.getElementById('pet-name');

    const hungerBar = document.getElementById('hunger-bar');
    const hungerText = document.getElementById('hunger-text');
    const happinessBar = document.getElementById('happiness-bar');
    const happinessText = document.getElementById('happiness-text');
    const energyBar = document.getElementById('energy-bar');
    const energyText = document.getElementById('energy-text');
    const hygieneBar = document.getElementById('hygiene-bar');
    const hygieneText = document.getElementById('hygiene-text');

    const feedBtn = document.getElementById('feed-btn');
    const playBtn = document.getElementById('play-btn');
    const cleanBtn = document.getElementById('clean-btn');
    const sleepBtn = document.getElementById('sleep-btn');

    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeMessageBtn = document.getElementById('close-message-btn');

    // --- Pet State Variables ---
    let pet = {
        name: 'Child of The Galaxy',
        hunger: 100,    // 0 = starving, 100 = full
        happiness: 100, // 0 = miserable, 100 = ecstatic
        energy: 100,    // 0 = exhausted, 100 = full of energy
        hygiene: 100    // 0 = filthy, 100 = sparkling clean
    };

    const decayRates = {
        hunger: 0.5,    // Decreases by 0.5 every second
        happiness: 0.3, // Decreases by 0.3 every second
        energy: 0.8,    // Decreases by 0.8 every second
        hygiene: 0.2    // Decreases by 0.2 every second
    };

    const actionEffects = {
        feed: { hunger: +30, happiness: +10, energy: -5, hygiene: -5 },
        play: { hunger: -10, happiness: +30, energy: -20, hygiene: -10 },
        clean: { hunger: -5, happiness: +10, energy: -5, hygiene: +40 },
        sleep: { hunger: -10, happiness: +10, energy: +50, hygiene: -5 }
    };

    let gameInterval = null; // To store the interval for time progression

    // --- Helper Functions ---

    /**
     * Displays a message box with a given message.
     * @param {string} message - The message to display.
     */
    function showMessage(message) {
        messageText.textContent = message;
        messageBox.style.display = 'flex';
    }

    /**
     * Hides the message box.
     */
    function hideMessage() {
        messageBox.style.display = 'none';
    }

    /**
     * Clamps a value between a minimum and maximum.
     * @param {number} value - The value to clamp.
     * @param {number} min - The minimum allowed value.
     * @param {number} max - The maximum allowed value.
     * @returns {number} The clamped value.
     */
    function clamp(value, min, max) {
        return Math.max(min, Math.min(value, max));
    }

    /**
     * Updates the UI to reflect the pet's current status.
     */
    function updateUI() {
        // Corrigi a lógica para o `hygiene-bar`
        hygieneBar.style.width = `${pet.hygiene}%`;
        hygieneText.textContent = `${Math.round(pet.hygiene)}%`;
        hygieneBar.style.backgroundColor = getStatusColor(pet.hygiene);

        // A lógica do resto estava correta, apenas incluí o hygiene-bar
        hungerBar.style.width = `${pet.hunger}%`;
        hungerText.textContent = `${Math.round(pet.hunger)}%`;
        hungerBar.style.backgroundColor = getStatusColor(pet.hunger);

        happinessBar.style.width = `${pet.happiness}%`;
        happinessText.textContent = `${Math.round(pet.happiness)}%`;
        happinessBar.style.backgroundColor = getStatusColor(pet.happiness);

        energyBar.style.width = `${pet.energy}%`;
        energyText.textContent = `${Math.round(pet.energy)}%`;
        energyBar.style.backgroundColor = getStatusColor(pet.energy);


        // Update pet image based on any status reaching 50% or below
        if (pet.hunger <= 50 || pet.happiness <= 50 || pet.energy <= 50 || pet.hygiene <= 50) {
            petImage.src = "./Assets/Sad.gif"; // Sad pet
        } else {
            petImage.src = "./Assets/Neutral.gif"; // Happy pet
        }

        // Disable buttons if pet is too low on a certain stat (e.g., too tired to play)
        playBtn.disabled = pet.energy < 20;
        feedBtn.disabled = pet.hunger > 90; // Don't allow feeding if almost full
        sleepBtn.disabled = pet.energy > 80; // Don't allow sleeping if already energetic
        cleanBtn.disabled = pet.hygiene > 90; // Don't allow cleaning if already clean
    }

    /**
     * Gets a color for the status bar based on its percentage.
     * @param {number} percentage - The status percentage (0-100).
     * @returns {string} CSS color string.
     */
    function getStatusColor(percentage) {
        if (percentage > 70) return '#4caf50'; // Green
        if (percentage > 30) return '#ffeb3b'; // Yellow
        return '#f44336'; // Red
    }

    /**
     * Applies the effects of an action to the pet's status.
     * @param {Object} effects - An object containing status changes (e.g., { hunger: +30 }).
     */
    function applyActionEffects(effects) {
        for (const stat in effects) {
            if (pet.hasOwnProperty(stat)) {
                pet[stat] = clamp(pet[stat] + effects[stat], 0, 100);
            }
        }
        updateUI();
    }

    /**
     * Simulates the passage of time, decreasing pet stats.
     */
    function timeProgression() {
        pet.hunger = clamp(pet.hunger - decayRates.hunger, 0, 100);
        pet.happiness = clamp(pet.happiness - decayRates.happiness, 0, 100);
        pet.energy = clamp(pet.energy - decayRates.energy, 0, 100);
        pet.hygiene = clamp(pet.hygiene - decayRates.hygiene, 0, 100);

        updateUI();
        checkPetStatus();
    }

    /**
     * Checks the pet's status and provides feedback or consequences.
     */
    function checkPetStatus() {
        if (pet.hunger <= 0) {
            showMessage(`${pet.name} is hungry. Perform Instinct Work`);
            // Add consequences if needed, e.g., happiness drops faster
            pet.happiness = clamp(pet.happiness - 0.5, 0, 100);
        }
        if (pet.happiness <= 0) {
            showMessage(`${pet.name} is Sad, Peform Attachment Work`);
            // Consequences
            pet.energy = clamp(pet.energy - 0.5, 0, 100);
        }
        if (pet.energy <= 0) {
            showMessage(`${pet.name} is Tired, Perform Repression Work`);
            // Consequences
            pet.happiness = clamp(pet.happiness - 0.5, 0, 100);
        }
        if (pet.hygiene <= 0) {
            showMessage(`${pet.name} is Dirty, Perform Insight Work`);
            // Consequences
            pet.happiness = clamp(pet.happiness - 0.5, 0, 100);
        }
    }

    // --- Event Handlers ---

    function handleFeed() {
        if (pet.hunger > 90) {
            showMessage(`${pet.name} is not Hungry Now.`);
            return;
        }
        applyActionEffects(actionEffects.feed);
        showMessage(`${pet.name} was Fed, it is Content.`);
    }

    function handlePlay() {
        if (pet.energy < 20) {
            showMessage(`${pet.name} is too Tired to Play.`);
            return;
        }
        applyActionEffects(actionEffects.play);
        showMessage(`${pet.name} enjoyed Playing with You.`);
    }

    function handleClean() {
        if (pet.hygiene > 90) {
            showMessage(`${pet.name} is Clean Already.`);
            return;
        }
        applyActionEffects(actionEffects.clean);
        showMessage(`${pet.name} is Clean and Sparkling.`);
    }

    function handleSleep() {
        if (pet.energy > 80) {
            showMessage(`${pet.name} is not Tired Now.`);
            return;
        }
        applyActionEffects(actionEffects.sleep);
        showMessage(`${pet.name} had a Good Rest.`);
    }

    // --- Initialization ---
    function initializeGame() {
        // Remove a linha que define o texto do nome do pet
        // petNameEl.textContent = pet.name; 
        // Oculte o elemento do nome do pet para que a imagem seja o foco
        petNameEl.style.display = 'none'; 
        updateUI(); // Chama updateUI para definir a imagem inicial corretamente
        // Start the game loop (e.g., every second)
        gameInterval = setInterval(timeProgression, 1000);
    }

    // --- Event Listeners ---
    feedBtn.addEventListener('click', handleFeed);
    playBtn.addEventListener('click', handlePlay);
    cleanBtn.addEventListener('click', handleClean);
    sleepBtn.addEventListener('click', handleSleep);

    closeMessageBtn.addEventListener('click', hideMessage);
    messageBox.addEventListener('click', (e) => {
        if (e.target === messageBox) {
            hideMessage();
        }
    });

    // Start the pet simulator
    initializeGame();
});
/* Código copiado de "igormelol" e parcialmente editado, por questões de tempo diante do tamanho dele
   Códigos também corrigido pela IA Gemini */
