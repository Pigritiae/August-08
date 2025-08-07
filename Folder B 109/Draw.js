document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos do DOM ---
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d'); // Contexto de renderização 2D do canvas

    const toolButtons = document.querySelectorAll('.tool-button');
    const colorPicker = document.getElementById('color-picker');
    const lineWidthInput = document.getElementById('line-width');
    const lineWidthValueSpan = document.getElementById('line-width-value');
    const clearCanvasBtn = document.getElementById('clear-canvas');
    const saveImageBtn = document.getElementById('save-image');

    // --- Variáveis de Estado do Desenho ---
    let isDrawing = false; // Indica se o mouse está clicado e arrastando
    let currentTool = 'pen'; // Ferramenta ativa (pen, eraser, rectangle, circle, line)
    let currentColor = '#000000'; // Cor atual do desenho
    let currentWidth = 5; // Espessura atual da linha
    let lastX = 0; // Última posição X do mouse
    let lastY = 0; // Última posição Y do mouse
    let startX = 0; // Posição X inicial para desenhar formas
    let startY = 0; // Posição Y inicial para desenhar formas
    let snapshot = null; // Armazena o estado do canvas antes de desenhar uma forma

    // --- Configuração Inicial do Canvas ---
    // Define o tamanho do canvas para corresponder ao seu estilo CSS (ou um tamanho fixo)
    // É importante definir width e height como atributos do elemento canvas, não via CSS,
    // para evitar distorção do desenho.
    canvas.width = 800; // Largura padrão
    canvas.height = 600; // Altura padrão

    // Configurações iniciais do contexto de desenho
    ctx.strokeStyle = currentColor; // Cor da linha
    ctx.lineWidth = currentWidth; // Espessura da linha
    ctx.lineCap = 'round'; // Estilo da ponta da linha (arredondada)
    ctx.lineJoin = 'round'; // Estilo da junção da linha (arredondada)

    // --- Funções de Desenho ---

    // Função para desenhar com a caneta ou borracha
    function draw(e) {
        if (!isDrawing) return; // Só desenha se o mouse estiver clicado

        ctx.beginPath(); // Inicia um novo caminho de desenho
        ctx.moveTo(lastX, lastY); // Move para a última posição
        ctx.lineTo(e.offsetX, e.offsetY); // Desenha uma linha até a posição atual do mouse
        ctx.stroke(); // Renderiza a linha

        // Atualiza a última posição para o próximo segmento da linha
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    // Função para desenhar um retângulo
    function drawRectangle(e) {
        ctx.putImageData(snapshot, 0, 0); // Restaura o canvas para o estado antes de começar a forma
        ctx.beginPath();
        ctx.rect(startX, startY, e.offsetX - startX, e.offsetY - startY); // Desenha o retângulo
        ctx.stroke();
    }

    // Função para desenhar um círculo
    function drawCircle(e) {
        ctx.putImageData(snapshot, 0, 0); // Restaura o canvas
        ctx.beginPath();
        const radius = Math.sqrt(Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2)); // Calcula o raio
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI); // Desenha o círculo
        ctx.stroke();
    }

    // Função para desenhar uma linha reta
    function drawLine(e) {
        ctx.putImageData(snapshot, 0, 0); // Restaura o canvas
        ctx.beginPath();
        ctx.moveTo(startX, startY); // Ponto de início da linha
        ctx.lineTo(e.offsetX, e.offsetY); // Ponto final da linha
        ctx.stroke();
    }

    // --- Manipuladores de Eventos do Mouse/Touch ---

    // Quando o mouse é clicado (ou toque inicia)
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY]; // Define a posição inicial para caneta/borracha
        [startX, startY] = [e.offsetX, e.offsetY]; // Define a posição inicial para formas

        // Se a ferramenta atual for uma forma, salva o estado atual do canvas
        if (currentTool === 'rectangle' || currentTool === 'circle' || currentTool === 'line') {
            snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
        }
    });

    // Quando o mouse se move (ou toque se move)
    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;

        // Desenha de forma diferente dependendo da ferramenta
        if (currentTool === 'pen' || currentTool === 'eraser') {
            draw(e);
        } else if (currentTool === 'rectangle') {
            drawRectangle(e);
        } else if (currentTool === 'circle') {
            drawCircle(e);
        } else if (currentTool === 'line') {
            drawLine(e);
        }
    });

    // Quando o mouse é solto (ou toque termina)
    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
        snapshot = null; // Limpa o snapshot após a forma ser finalizada
    });

    // Quando o mouse sai do canvas (para parar de desenhar se o botão ainda estiver pressionado)
    canvas.addEventListener('mouseout', () => {
        isDrawing = false;
        snapshot = null;
    });

    // --- Suporte a Touch (para dispositivos móveis) ---
    canvas.addEventListener('touchstart', (e) => {
        // Previne o comportamento padrão de rolagem/zoom do navegador
        e.preventDefault(); 
        // Obtém as coordenadas do toque em relação ao canvas
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const offsetX = touch.clientX - rect.left;
        const offsetY = touch.clientY - rect.top;

        // Simula um evento de mouse para reutilizar a lógica existente
        canvas.dispatchEvent(new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY,
            offsetX: offsetX,
            offsetY: offsetY,
            buttons: 1 // Simula o botão esquerdo do mouse pressionado
        }));
    }, { passive: false }); // { passive: false } permite chamar preventDefault

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const offsetX = touch.clientX - rect.left;
        const offsetY = touch.clientY - rect.top;

        canvas.dispatchEvent(new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY,
            offsetX: offsetX,
            offsetY: offsetY,
            buttons: 1
        }));
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
        canvas.dispatchEvent(new MouseEvent('mouseup'));
    });

    canvas.addEventListener('touchcancel', () => {
        canvas.dispatchEvent(new MouseEvent('mouseup'));
    });


    // --- Manipuladores de Eventos dos Controles ---

    // Seleção de Ferramenta
    toolButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove a classe 'active' de todos os botões e adiciona ao clicado
            toolButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentTool = button.dataset.tool; // Atualiza a ferramenta ativa

            // Ajusta a cor para a borracha (cor do fundo)
            if (currentTool === 'eraser') {
                ctx.strokeStyle = '#ffffff'; // Cor de fundo do canvas
            } else {
                ctx.strokeStyle = currentColor; // Volta para a cor selecionada
            }
        });
    });

    // Seleção de Cor
    colorPicker.addEventListener('input', (e) => {
        currentColor = e.target.value;
        if (currentTool !== 'eraser') { // Não muda a cor da borracha
            ctx.strokeStyle = currentColor;
        }
    });

    // Seleção de Espessura da Linha
    lineWidthInput.addEventListener('input', (e) => {
        currentWidth = e.target.value;
        ctx.lineWidth = currentWidth;
        lineWidthValueSpan.textContent = `${currentWidth}px`; // Atualiza o valor exibido
    });

    // Limpar Canvas
    clearCanvasBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa toda a área do canvas
    });

    // Salvar Imagem
    saveImageBtn.addEventListener('click', () => {
        const dataURL = canvas.toDataURL('image/png'); // Converte o conteúdo do canvas para uma URL de dados (PNG)
        const link = document.createElement('a'); // Cria um link temporário
        link.href = dataURL; // Define o href do link como a URL de dados
        link.download = 'meu-desenho.png'; // Define o nome do arquivo para download
        document.body.appendChild(link); // Adiciona o link ao DOM
        link.click(); // Simula um clique no link para iniciar o download
        document.body.removeChild(link); // Remove o link do DOM
    });
});
/* Código copiado de "igormelol", por questões de tempo diante do tamanho do código */