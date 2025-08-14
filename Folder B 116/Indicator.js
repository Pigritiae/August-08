document.addEventListener('DOMContentLoaded', () => {
    const metricsGridEl = document.getElementById("metrics-grid");
    const messageBox = document.getElementById("message-box");
    const messageText = document.getElementById("message-text");
    const closeMessageBtn = document.getElementById("close-message-btn"); // CORREÇÃO AQUI: getElementById não usa seletor de classe

    const metrics = [
        {
            id: 'sales', // CORREÇÃO AQUI: 'if' mudado para 'id'
            title: 'Montly Sales',
            value: 12500,
            unit: 'R$',
            trend: 0,
            updateFn: (currentValue) => {
                const change = Math.random() * 500 - 250;
                return Math.max(0, currentValue + change);
            }
        },
        {
            id: 'visitors',
            title: 'Visitors Online',
            value: 850,
            unit: '',
            updateFn: (currentValue) => {
                const change = Math.random() * 50 - 25;
                return Math.max(0, Math.round(currentValue + change));
            }
        },
        {
            id: 'conversion',
            title: 'Conversion at Client',
            value: 2.5,
            unit: '%',
            trend: 0,
            updateFn: (currentValue) => {
                const change = Math.random() * 0.2 - 0.1;
                return Math.max(0, Math.min(100, parseFloat((currentValue + change).toFixed(2))));
            }
        },
        {
            id: 'support-tickets',
            title: 'Answered Tickets',
            value: 15,
            trend: 0,
            updateFn: (currentValue) => {
                const change = Math.random() * 5 - 2;
                return Math.max(0, Math.round(currentValue + change));
            }
        }
    ];

    const UPDATE_INTERVAL = 3000;
    let updateIntervalId = null;

    /**
     * Exibe uma mensagem no modal.
     * @param {string} message O texto da mensagem a ser exibida.
     */
    function showMessage(message) {
        messageText.textContent = message; // CORREÇÃO AQUI: Atribuir ao elemento messageText
        messageBox.style.display = 'flex';
    }

    function hideMessage() {
        messageBox.style.display = 'none';
    }

    function renderMetrics() {
        metricsGridEl.innerHTML = '';
        metrics.forEach(metric => {
            const metricBlock = document.createElement('div');
            metricBlock.classList.add('metric-block');
            metricBlock.dataset.metricId = metric.id;

            let trendIcon = '';
            let trendClass = '';
            if (metric.trend === 1) {
                trendIcon = '⬆️'; // Seta para cima
                trendClass = 'up';
            } else if (metric.trend === -1) {
                trendIcon = '⬇️'; // Seta para baixo
                trendClass = 'down';
            }

            metricBlock.innerHTML = `
            <h3>${metric.title}</h3>
            <p class="metric-value">${metric.unit} ${metric.value.toLocaleString('pt-BR')}</p> <p class="metric-trend ${trendClass}">${trendIcon} Last Update</p>
            `;
            metricsGridEl.appendChild(metricBlock);
        });
    }

    /**
     * Atualiza o valor e a tendência de uma métrica específica.
     * @param {Object} metric O objeto métrica a ser atualizado.
     */
    function updateMetricValue(metric) {
        const oldValue = metric.value;
        metric.value = metric.updateFn(oldValue);

        if (metric.value > oldValue) {
            metric.trend = 1;
        } else if (metric.value < oldValue) {
            metric.trend = -1;
        } else {
            metric.trend = 0;
        }

        const metricBlockEl = document.querySelector(
            `.metric-block[data-metric-id="${metric.id}"]`);
        if (metricBlockEl) {
            const valueEl = metricBlockEl.querySelector('.metric-value');
            const trendEl = metricBlockEl.querySelector('.metric-trend');

            valueEl.textContent = `${metric.unit} ${metric.value.toLocaleString('pt-BR')}`; // CORREÇÃO AQUI: Espaço entre unidade e valor

            trendEl.classList.remove('up', 'down');
            let trendIcon = '';
            if (metric.trend === 1) {
                trendIcon = '⬆️'; // Seta para cima
                trendEl.classList.add('up');
            } else if (metric.trend === -1) {
                trendIcon = '⬇️'; // Seta para baixo
                trendEl.classList.add('down');
            }
            trendEl.textContent = `${trendIcon} Last Update`; // CORREÇÃO AQUI: Fechamento da string

            metricBlockEl.classList.remove('updating');
            void metricBlockEl.offsetWidth; // Força reflow para reiniciar a animação
            metricBlockEl.classList.add('updating');
        }
    }

    function updateAllMetrics() {
        metrics.forEach(metric => {
            updateMetricValue(metric);
        });
    }

    function startUpdating() {
        if (updateIntervalId) {
            clearInterval(updateIntervalId);
        }
        updateIntervalId = setInterval(updateAllMetrics, UPDATE_INTERVAL);
        showMessage('Update in Real Time Started. ');
    }

    function stopUpdating() {
        if (updateIntervalId) {
            clearInterval(updateIntervalId);
            updateIntervalId = null;
            showMessage('Update in Real Time Paused. ⏸');
        }
    }

    // Adicione botões para iniciar/parar atualizações se desejar controlá-las manualmente
    // Exemplo:
    // const startBtn = document.createElement('button');
    // startBtn.textContent = 'Start Updates';
    // startBtn.addEventListener('click', startUpdating);
    // metricsGridEl.after(startBtn); // Adiciona após a grid

    // const stopBtn = document.createElement('button');
    // stopBtn.textContent = 'Stop Updates';
    // stopBtn.addEventListener('click', stopUpdating);
    // startBtn.after(stopBtn); // Adiciona após o botão Start

    closeMessageBtn.addEventListener('click', hideMessage);
    messageBox.addEventListener('click', (e) => {
        if (e.target === messageBox) {
            hideMessage();
        }
    });

    function initializeDashboard() {
        renderMetrics();
        startUpdating();
    }
    initializeDashboard();
});
/* Código corrigido pela IA Gemini */ 