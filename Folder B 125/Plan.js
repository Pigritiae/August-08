document.addEventListener('DOMContentLoaded', () => {
    const destinationNameInput = document.getElementById('destination-name-input');
    const addDestinationBtn = document.getElementById('add-destination-btn');
    const baseMapImage = document.getElementById('base-map-image');
    const mapHotspotsContainer = document.getElementById('map-hotspots');
    // Correção: O ID estava com erro de digitação ("destionations-list" para "destinations-list")
    const destinationsListEl = document.getElementById('destinations-list');
    const noDestinationsMessage = document.getElementById('no-destinations-message');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeMessageBtn = document.getElementById('close-message-btn');

    let destinations = [];
    let selectedDestinationId = null;

    /**
     * @param {string} message
     */
    function showMessage(message) {
        messageText.textContent = message;
        messageBox.style.display = 'flex';
    }

    function hideMessage() {
        messageBox.style.display = 'none';
    }

    /**
     * @returns {string} A Unique ID.
     */
    function generateUUID() {
        return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function loadDestination() {
        const storedDestinations = localStorage.getItem('travelPlannerDestinations');
        if (storedDestinations) {
            destinations = JSON.parse(storedDestinations);
        }
        renderAll();
    }

    function saveDestinations() {
        localStorage.setItem('travelPlannerDestinations', JSON.stringify(destinations));
    }

    function renderDestinations() {
        destinationsListEl.innerHTML = '';
        if (destinations.length === 0) {
            noDestinationsMessage.style.display = 'block';
        } else {
            noDestinationsMessage.style.display = 'none';
            destinations.forEach(destination => {
                const destinationCard = document.createElement('div');
                destinationCard.classList.add('destination-card');
                destinationCard.dataset.destinationId = destination.id;
                destinationCard.innerHTML = `
                    <div class="destination-header">
                        <h3>${destination.name}</h3>
                        <button class="delete-destination-btn" data-destination-id="${destination.id}">Delete Destination</button>
                    </div>
                    <div class="add-checklist-item-group">
                        <input type="text" class="checklist-item-input" placeholder="New Checklist Item">
                        <button class="add-checklist-item-btn" data-destination-id="${destination.id}">Add Item</button>
                    </div>
                    <ul class="checklist-items-list" id="checklist-${destination.id}">
                    </ul>
                `;
                destinationsListEl.appendChild(destinationCard);
                renderChecklist(destination.id);
            });
        }
        attachDestinationEventListeners();
    }

    /**
     * @param {string} destinationId - The ID of the Destination
     */
    function renderChecklist(destinationId) {
        const destination = destinations.find(d => d.id === destinationId);
        if (!destination) return;
        const checklistListEl = document.getElementById(`checklist-${destinationId}`);
        if (!checklistListEl) return;
        checklistListEl.innerHTML = '';
        if (destination.checklist.length === 0) {
            const emptyItem = document.createElement('p');
            emptyItem.textContent = 'No Item at the Checklist Yet.';
            emptyItem.classList.add('empty-message');
            checklistListEl.appendChild(emptyItem);
        } else {
            destination.checklist.forEach(item => {
                const checklistItemEl = document.createElement('li');
                // Correção: A classe `.checklist-item` estava sendo adicionada ao `ul` em vez do `li`
                checklistItemEl.classList.add('checklist-item');
                if (item.completed) {
                    // Correção: A classe `.completed` estava sendo adicionada ao `ul` em vez do `li`
                    checklistItemEl.classList.add('completed');
                }
                checklistItemEl.dataset.itemId = item.id;
                checklistItemEl.innerHTML = `
                    <input type="checkbox" ${item.completed ? 'checked' : ''}
                    data-item-id="${item.id}" data-destination-id="${destination.id}">
                    <span class="checklist-item-text">${item.text}</span>
                    <button class="delete-checklist-item-btn" data-item-id="${item.id}"
                    data-destination-id="${destination.id}">X</button>
                `;
                checklistListEl.appendChild(checklistItemEl);
            });
        }
        attachChecklistEventListeners(destinationId);
    }

    function attachDestinationEventListeners() {
        document.querySelectorAll('.delete-destination-btn').forEach
            (button => {
                button.onclick = (e) => deleteDestination(e.target.dataset.destinationId);
            });

        document.querySelectorAll('.add-checklist-item-btn').forEach
            (button => {
                // Correção: O atributo no HTML estava errado ("dataa-destination-id")
                button.onclick = (e) => {
                    const destinationId = e.target.dataset.destinationId;
                    const inputEl = e.target.previousElementSibling;
                    addChecklistItem(destinationId, inputEl.value);
                    inputEl.value = '';
                };
            });
        document.querySelectorAll('.checklist-item-input').forEach
            (input => {
                input.onkeypress = (e) => {
                    if (e.key === 'Enter') {
                        const destinationId = e.target.nextElementSibling.dataset.destinationId;
                        addChecklistItem(destinationId, e.target.value);
                        e.target.value = '';
                    }
                };
            });
    }

    /**
     * @param {string} destinationId - The ID of the Destination
     */
    function attachChecklistEventListeners(destinationId) {
        const checklistListEl = document.getElementById(`checklist-${destinationId}`);
        if (!checklistListEl) return;
        checklistListEl.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.onchange = (e) => toggleChecklistItem(e.target.dataset.destinationId, e.target.dataset.itemId);
        });

        checklistListEl.querySelectorAll('.delete-checklist-item-btn').forEach(button => {
            button.onclick = (e) => deleteChecklistItem(e.target.dataset.destinationId, e.target.dataset.itemId);
        });
    }

    function renderMapHotspots() {
        mapHotspotsContainer.innerHTML = '';
        const mapWidth = baseMapImage.offsetWidth;
        const mapHeight = baseMapImage.offsetHeight;
        destinations.forEach((destination, index) => {
            if (destination.x === undefined || destination.y === undefined) {
                destination.x = Math.random();
                destination.y = Math.random();
            }
            const hotspot = document.createElement('div');
            hotspot.classList.add('map-hotspot');
            hotspot.dataset.destinationId = destination.id;
            hotspot.style.left = `${destination.x * 100}%`;
            hotspot.style.top = `${destination.y * 100}%`;
            hotspot.textContent = index + 1;
            if (selectedDestinationId === destination.id) {
                hotspot.classList.add('active');
            }
            hotspot.onclick = () => selectDestination(destination.id);

            // Make hotspot draggable
            hotspot.style.position = 'absolute';
            hotspot.style.cursor = 'grab';

            hotspot.onmousedown = function(e) {
                e.preventDefault();
                hotspot.classList.add('dragging');
                const containerRect = mapHotspotsContainer.getBoundingClientRect();
                const hotspotRect = hotspot.getBoundingClientRect();
                // Calculate offset from mouse to center of marker
                let shiftX = e.clientX - hotspotRect.left - hotspotRect.width / 2;
                let shiftY = e.clientY - hotspotRect.top - hotspotRect.height / 2;

                function moveAt(clientX, clientY) {
                    // Position relative to container
                    let x = (clientX - containerRect.left - shiftX) / containerRect.width;
                    let y = (clientY - containerRect.top - shiftY) / containerRect.height;
                    // Clamp between 0 and 1
                    x = Math.max(0, Math.min(1, x));
                    y = Math.max(0, Math.min(1, y));
                    hotspot.style.left = `${x * 100}%`;
                    hotspot.style.top = `${y * 100}%`;
                    destination.x = x;
                    destination.y = y;
                }

                function onMouseMove(e) {
                    moveAt(e.clientX, e.clientY);
                }

                document.addEventListener('mousemove', onMouseMove);

                document.onmouseup = function() {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.onmouseup = null;
                    hotspot.classList.remove('dragging');
                    saveDestinations();
                };
            };

            hotspot.ondragstart = () => false;

            mapHotspotsContainer.appendChild(hotspot);
        });
    }

    /**
     * @param {string} destinationId
     */
    function selectDestination(destinationId) {
        selectedDestinationId = destinationId;
        renderMapHotspots();
        const destinationCard = document.querySelector(`.destination-card[data-destination-id="${destinationId}"]`);
        if (destinationCard) {
            destinationCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            destinationCard.style.outline = '2px solid #007bff';
            setTimeout(() => {
                destinationCard.style.outline = 'none';
            }, 1000);
        }
    }

    function addDestination() {
        const name = destinationNameInput.value.trim();
        if (name === '') {
            showMessage('Please Type a Name for the Destination.');
            return;
        }
        const newDestination = {
            // Correção: A propriedade estava com o nome "if", que é uma palavra reservada em JS.
            // Foi alterada para "id".
            id: generateUUID(),
            name: name,
            checklist: []
        };
        destinations.push(newDestination);
        saveDestinations();
        renderAll();
        destinationNameInput.value = '';
        showMessage(`Destination "${name}" Added!`);
    }

    /**
     * @param {string} destinationId - The ID of the destination to Delete.
     */
    function deleteDestination(destinationId) {
        const destination = destinations.find(d => d.id === destinationId);
        if (!destination) return;
        if (confirm(`Are you Sure you want to Delete Destination "${destination.name}" from your Checklist?`)) {
            destinations = destinations.filter(d => d.id !== destinationId);
            if (selectedDestinationId === destinationId) {
                selectedDestinationId = null;
            }
            saveDestinations();
            renderAll();
            showMessage(`Destination "${destination.name}" excluded`);
        }
    }

    /**
     * @param {string} destinationId - The ID of the Destination
     * @param {string} itemText - The Text for the Checklist Item.
     */
    function addChecklistItem(destinationId, itemText) {
        const destination = destinations.find(d => d.id === destinationId);
        if (!destination) return;
        const text = itemText.trim();
        if (text === '') {
            showMessage('Please Type an Item for your Checklist.');
            return;
        }
        destination.checklist.push({
            // Correção: A propriedade estava com o nome "if", que é uma palavra reservada em JS.
            // Foi alterada para "id".
            id: generateUUID(),
            text: text,
            completed: false
        });
        saveDestinations();
        renderChecklist(destinationId);
        showMessage('Item Added to Checklist!');
    }

    /**
     * @param {string} destinationId - The Id of the Destination
     * @param {string} itemId - The Id of the Checklist Item
     */
    function toggleChecklistItem(destinationId, itemId) {
        const destination = destinations.find(d => d.id === destinationId);
        if (!destination) return;
        // Correção: A propriedade estava com o nome "if", que é uma palavra reservada em JS.
        // Foi alterada para "id".
        const item = destination.checklist.find(i => i.id === itemId);
        if (item) {
            item.completed = !item.completed;
            saveDestinations();
            renderChecklist(destinationId);
        }
    }

    /**
     * @param {string} destinationId - The ID of the Destination
     * @param {string} itemId - The ID of the Checklist Item
     */
    function deleteChecklistItem(destinationId, itemId) {
        const destination = destinations.find(d => d.id === destinationId);
        if (!destination) return;
        // Correção: A propriedade estava com o nome "if", que é uma palavra reservada em JS.
        // Foi alterada para "id".
        destination.checklist = destination.checklist.filter(item => item.id !== itemId);
        saveDestinations();
        renderChecklist(destinationId);
        showMessage('Checklist Item Deleted.');
    }

    function renderAll() {
        renderDestinations();
        renderMapHotspots();
    }

    addDestinationBtn.addEventListener('click', addDestination);

    destinationNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            // Correção: `addDestination` é uma função. Não se pode chamar `.click()` em uma função.
            // O correto é chamar a função diretamente: `addDestination()`.
            addDestination();
        }
    });

    closeMessageBtn.addEventListener('click', hideMessage);

    messageBox.addEventListener('click', (e) => {
        if (e.target === messageBox) {
            hideMessage();
        }
    });

    baseMapImage.onload = loadDestination;
    if (baseMapImage.complete) {
        loadDestination();
    }
});
/* Código corrigido pela IA Gemini e modificado pelo Copilot do GitHub */