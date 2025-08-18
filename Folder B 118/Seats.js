document.addEventListener('DOMContentLoaded', () => {
    // Declarações de elementos do DOM
    const eventTitle = document.getElementById('event-title');
    const eventDescription = document.getElementById('event-description');
    const timeSlotsContainer = document.getElementById('time-slots-container');
    const selectedTimeDisplay = document.getElementById('selected-time-display');
    const seatsGrid = document.getElementById('seats-grid');
    const selectedSeatsDisplay = document.getElementById('selected-seats-display');
    const totalPriceDisplay = document.getElementById('total-price-display');
    const clearSectionBtn = document.getElementById('clear-section-btn');
    const reserveBtn = document.getElementById('reserve-btn');

    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeMessageBtn = document.getElementById('close-message-btn');

    const seatPrice = 15.00;
    const totalRows = 5;
    const totalSeatsPerRow = 8;

    let eventsData = {
        currentEventId: 'jazz_night',
        details: {
            'jazz_night': {
                name: 'Epic Saxx Guy at the Culture Festival',
                description: 'Epic Saxx Guy Makes his Return, limited Seats.',
                slots: {}
            }
        }
    };

    let currentSelectedTimeSlotId = null;
    let selectedSeats = [];

    // Funções do sistema
    /**
     * Cria e retorna uma matriz de objetos de assento com status inicial 'available'.
     * @returns {Array<Object>} Uma matriz de objetos de assento.
     */
    function createInitialSeats() {
        const seats = [];
        for (let r = 0; r < totalRows; r++) {
            for (let c = 0; c < totalSeatsPerRow; c++) {
                const seatId = String.fromCharCode(65 + r) + (c + 1);
                seats.push({ id: seatId, status: 'available' });
            }
        }
        return seats;
    }

    /**
     * Exibe um modal de mensagem na tela.
     * @param {string} message A mensagem de texto a ser exibida.
     */
    function showMessage(message) {
        messageText.textContent = message;
        messageBox.style.display = 'flex';
    }

    /**
     * Oculta o modal de mensagem.
     */
    function hideMessage() {
        messageBox.style.display = 'none';
    }

    /**
     * Salva os dados do evento no Local Storage.
     */
    function saveData() {
        localStorage.setItem('eventBookingData', JSON.stringify(eventsData));
    }

    /**
     * Carrega os dados do evento do Local Storage ou inicializa se não existirem.
     */
    function loadData() {
        const savedData = localStorage.getItem('eventBookingData');
        if (savedData) {
            eventsData = JSON.parse(savedData);
        } else {
            // Se não houver dados salvos, inicializa com assentos disponíveis
            eventsData.details.jazz_night.slots = {
                'slot_1900': { time: '19:00 - 20:00', seats: createInitialSeats() },
                'slot_2100': { time: '21:00 - 22:30', seats: createInitialSeats() }
            };
        }
    }

    /**
     * Renderiza as informações do evento na página.
     */
    function renderEventInfo() {
        const event = eventsData.details[eventsData.currentEventId];
        eventTitle.textContent = event.name;
        eventDescription.textContent = event.description;
    }

    /**
     * Renderiza os botões de horários de assentos.
     */
    function renderTimeSlots() {
        timeSlotsContainer.innerHTML = '';
        const event = eventsData.details[eventsData.currentEventId];

        const sortedSlotKeys = Object.keys(event.slots).sort((a, b) => {
            const timeA = event.slots[a].time.split(':')[0];
            const timeB = event.slots[b].time.split(':')[0];
            return timeA.localeCompare(timeB);
        });

        sortedSlotKeys.forEach(slotId => {
            const slot = event.slots[slotId];
            const button = document.createElement('button');
            button.classList.add('time-slot-button');
            button.textContent = slot.time;
            button.dataset.slotId = slotId;

            button.addEventListener('click', () => handleTimeSlotSelection(slotId));
            timeSlotsContainer.appendChild(button);
        });

        if (!currentSelectedTimeSlotId) {
            currentSelectedTimeSlotId = sortedSlotKeys[0];
        }
        updateTimeSlotActiveState(currentSelectedTimeSlotId);
    }

    /**
     * Atualiza o estado visual do botão de horário ativo.
     * @param {string} activeSlotId O ID do horário que deve ser marcado como ativo.
     */
    function updateTimeSlotActiveState(activeSlotId) {
        document.querySelectorAll('.time-slot-button').forEach(button => {
            button.classList.remove('active');
            if (button.dataset.slotId === activeSlotId) {
                button.classList.add('active');
            }
        });
        selectedTimeDisplay.textContent = eventsData.details[eventsData.currentEventId].slots[activeSlotId].time;
    }

    /**
     * Renderiza a grade de assentos com base no horário selecionado.
     */
    function renderSeats() {
        seatsGrid.innerHTML = '';
        const currentSlot = eventsData.details[eventsData.currentEventId].slots[currentSelectedTimeSlotId];
        seatsGrid.style.gridTemplateColumns = `repeat(${totalSeatsPerRow}, 1fr)`;

        currentSlot.seats.forEach(seat => {
            const seatDiv = document.createElement('div');
            seatDiv.classList.add('seat', seat.status);
            seatDiv.textContent = seat.id;
            seatDiv.dataset.seatId = seat.id;

            if (seat.status === 'available' || seat.status === 'selected') {
                seatDiv.addEventListener('click', () => handleSeatSelection(seat.id));
            }
            seatsGrid.appendChild(seatDiv);
        });

        updateBookingSummary();
        updateReserveButtonState();
    }

    /**
     * Atualiza o resumo de assentos selecionados e o preço total.
     */
    function updateBookingSummary() {
        if (selectedSeats.length === 0) {
            selectedSeatsDisplay.textContent = 'None';
        } else {
            selectedSeatsDisplay.textContent = selectedSeats.join(', ');
        }
        totalPriceDisplay.textContent = `R$ ${(selectedSeats.length * seatPrice).toFixed(2)}`;
    }

    /**
     * Habilita ou desabilita o botão de reserva com base na seleção de assentos.
     */
    function updateReserveButtonState() {
        if (selectedSeats.length > 0) {
            reserveBtn.disabled = false;
        } else {
            reserveBtn.disabled = true;
        }
    }

    /**
     * Gerencia a mudança de horário, desmarcando assentos previamente selecionados.
     * @param {string} slotId O ID do novo horário selecionado.
     */
    function handleTimeSlotSelection(slotId) {
        if (currentSelectedTimeSlotId === slotId) return;

        if (selectedSeats.length > 0) {
            const previousSlot = eventsData.details[eventsData.currentEventId].slots[currentSelectedTimeSlotId];
            selectedSeats.forEach(seatId => {
                const seat = previousSlot.seats.find(s => s.id === seatId);
                if (seat && seat.status === 'selected') {
                    seat.status = 'available';
                }
            });
            selectedSeats = [];
        }

        currentSelectedTimeSlotId = slotId;
        updateTimeSlotActiveState(slotId);
        renderSeats();
    }

    /**
     * Gerencia a seleção e deseleção de assentos.
     * @param {string} seatId O ID do assento clicado.
     */
    function handleSeatSelection(seatId) {
        const currentSlot = eventsData.details[eventsData.currentEventId].slots[currentSelectedTimeSlotId];
        const seat = currentSlot.seats.find(s => s.id === seatId);

        if (!seat || seat.status === 'reserved') {
            showMessage("This Seat is Already Reserved");
            return;
        }

        if (seat.status === 'available') {
            seat.status = 'selected';
            selectedSeats.push(seatId);
        } else if (seat.status === 'selected') {
            seat.status = 'available';
            selectedSeats = selectedSeats.filter(id => id !== seatId);
        }
        saveData();
        renderSeats();
    }

    /**
     * Gerencia o processo de reserva de assentos selecionados.
     */
    function handleReserveSeats() {
        if (selectedSeats.length === 0) {
            showMessage('Please select at least 1 seat to reserve.');
            return;
        }

        if (confirm(`Confirm the reservation of ${selectedSeats.length} for R$ ${(selectedSeats.length * seatPrice).toFixed(2)}?`)) {
            const currentSlot = eventsData.details[eventsData.currentEventId].slots[currentSelectedTimeSlotId];

            selectedSeats.forEach(seatId => {
                const seat = currentSlot.seats.find(s => s.id === seatId);
                if (seat && seat.status === 'selected') {
                    seat.status = 'reserved';
                }
            });

            selectedSeats = [];
            saveData();
            renderSeats();
            showMessage('Seats reserved successfully!');
        }
    }

    /**
     * Limpa a seleção de todos os assentos.
     */
    function handleClearSelection() {
        if (selectedSeats.length === 0) {
            showMessage('No seats selected to clear.');
            return;
        }

        if (confirm('Are you sure you want to clear the selected seats?')) {
            const currentSlot = eventsData.details[eventsData.currentEventId].slots[currentSelectedTimeSlotId];
            selectedSeats.forEach(seatId => {
                const seat = currentSlot.seats.find(s => s.id === seatId);
                if (seat && seat.status === 'selected') {
                    seat.status = 'available';
                }
            });

            selectedSeats = [];
            saveData();
            renderSeats();
            showMessage('Selection cleared successfully!');
        }
    }

    // Adição de Event Listeners
    reserveBtn.addEventListener('click', handleReserveSeats);
    clearSectionBtn.addEventListener('click', handleClearSelection);
    closeMessageBtn.addEventListener('click', hideMessage);
    messageBox.addEventListener('click', (e) => {
        if (e.target === messageBox) {
            hideMessage();
        }
    });

    // Inicialização da aplicação
    loadData();
    renderEventInfo();
    renderTimeSlots();
    renderSeats();
});
/* Códigos corrigidos pela IA Gemini */