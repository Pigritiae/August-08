// Elementos do DOM
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se todos os elementos necessários existem
    const getElement = (id, elementName) => {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Elemento não encontrado: ${elementName} 
                (ID: ${id})`);
            throw new Error(`Elemento ${elementName} não encontrado`);
        }
        return element;
    };
    const elements = {
        canvas: getElement('mazeCanvas', 'Canvas do labirinto'),
        rowsInput: getElement('rows', 'Input de linhas'),
        colsInput: getElement('cols', 'Input de colunas'),
        algorithmSelect: getElement('algorithm', 'Seletor de algoritmo'),
        resetGridBtn: getElement('reset-grid-btn', 'Botão de redefinir'),
        clearPathBtn: getElement('clear-path-btn', 'Botão de limpar caminho'),
        solveBtn: getElement('solve-btn', 'Botão de resolver'),
        statusText: getElement('status-text', 'Texto de status')
    };
    console.log('Todos os elementos do DOM foram carregados com sucesso');
    const ctx = elements.canvas.getContext('2d');
    // Tamanho da célula foi movido para o objeto state
    // Estado do jogo
    const state = {
        // Dimensões do grid
        numRows: 0,
        numCols: 0,
        grid: [],
        // Nós de início e fim
        startNode: null,
        endNode: null,
        
        // Controle de estado
        isDrawing: false,
        isSolving: false,
        
        // Controle de animação
        animationId: null,
        animationSteps: [],
        currentStep: 0,
        finalPathToAnimate: [],
        
        // Configurações
        cellSize: 30, // Tamanho de cada célula em pixels
        animationSpeed: 10 // Velocidade da animação (1-100)
    };
    // Inicializa o estado com os valores dos inputs
    function initializeState() {
        try {
            // Obtém as dimensões dos inputs, com valores padrão caso inválidos
            state.numRows = Math.max(5, Math.min(50, parseInt
                (elements.rowsInput.value) || 15));
            state.numCols = Math.max(5, Math.min(50, parseInt
                (elements.colsInput.value) || 15));
            
            // Atualiza os inputs para refletir os valores corrigidos
            elements.rowsInput.value = state.numRows;
            elements.colsInput.value = state.numCols;
            
            // Limpa nós de início/fim e animações em andamento
            state.startNode = null;
            state.endNode = null;
            state.isDrawing = false;
            state.isSolving = false;
            
            // Cancela qualquer animação em andamento
            if (state.animationId) {
                cancelAnimationFrame(state.animationId);
                state.animationId = null;
            }
            
            console.log(`Estado inicializado com grid ${state.numRows}
                x${state.numCols}`);
            
        } catch (error) {
            console.error('Erro ao inicializar o estado:', error);
            // Define valores padrão em caso de erro
            state.numRows = 15;
            state.numCols = 15;
            elements.rowsInput.value = state.numRows;
            elements.colsInput.value = state.numCols;
        }
    }
    // Cores do jogo
    const COLORS = {
        WALL: '#333', PATH: '#fff',
        START: '#28a745', END: '#dc3545',
        VISITED: '#add8e6', FRONTIER: '#ffc107',
        SOLUTION: '#17a2b8'
    };
    /**
     * Inicializa o grid do labirinto com as dimensões atuais
     * Cria uma matriz de células vazias e redimensiona o canvas
     */
    function initializeGrid() {
        try {
            console.log('Inicializando grid...');
            
            // Inicializa o estado com os valores atuais dos inputs
            initializeState();
            const { numRows, numCols, cellSize } = state;
            
            // Limpa o grid atual e reinicia o estado de animação
            state.grid = [];
            state.animationSteps = [];
            state.finalPathToAnimate = [];
            state.currentStep = 0;
            
            // Cria um novo grid vazio
            console.log(`Criando novo grid ${numRows}x${numCols}...`);
            for (let r = 0; r < numRows; r++) {
                const row = [];
                for (let c = 0; c < numCols; c++) {
                    row.push({
                        row: r,
                        col: c,
                        type: 'path', // Tipo padrão: caminho livre
                        visited: false,
                        parent: null,
                        // Adiciona um ID único para cada célula para facilitar o debug
                        id: `${r},${c}`
                    });
                }
                state.grid.push(row);
            }
            
            // Redimensiona o canvas para caber o novo grid
            const canvas = elements.canvas;
            canvas.width = numCols * cellSize;
            canvas.height = numRows * cellSize;
            
            console.log(`Canvas redimensionado para ${canvas.width}x${canvas.height}px`);
            
            // Limpa o canvas e redesenhando o grid
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGrid();
            
            // Limpa o status
            clearStatus();
            displayStatus('Labirinto reiniciado', 'success');
            
            console.log('Grid inicializado com sucesso');
            
        } catch (error) {
            console.error('Erro ao inicializar o grid:', error);
            displayStatus('Erro ao criar o labirinto', 'error');
            
            // Tenta recuperar definindo valores padrão
            try {
                state.numRows = 15;
                state.numCols = 15;
                elements.rowsInput.value = state.numRows;
                elements.colsInput.value = state.numCols;
                initializeGrid(); // Tenta novamente com valores padrão
            } catch (recoveryError) {
                console.error('Falha na recuperação do grid:', recoveryError);
                displayStatus('Erro crítico: não foi possível inicializar o labirinto', 'error');
            }
        }
    }
    /**
     * Desenha todo o grid do labirinto
     * Limpa o canvas e redesenhando todas as células
     * @param {boolean} [preserveCursor=false] - Se verdadeiro, preserva o destaque do cursor
     */
    function drawGrid(preserveCursor = false) {
        try {
            if (!ctx) {
                console.error('Contexto do canvas não disponível');
                return;
            }
            
            const { canvas } = elements;
            if (!canvas) {
                console.error('Elemento canvas não encontrado');
                return;
            }
            
            // Limpa o canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Desenha cada célula do grid
            for (let r = 0; r < state.numRows; r++) {
                for (let c = 0; c < state.numCols; c++) {
                    drawCell(r, c);
                }
            }
            
            // Se houver uma posição de cursor salva e for para preservar o cursor, redesenha o destaque
            if (preserveCursor && state.lastCursorPos) {
                const { row, col } = state.lastCursorPos;
                if (isValidCell(row, col)) {
                    updateCursorHighlight(row, col);
                }
            }
            
        } catch (error) {
            console.error('Erro ao desenhar o grid:', error);
            displayStatus('Erro ao desenhar o labirinto', 'error');
        }
    }
    
    /**
     * Desenha uma única célula do grid
     * @param {number} r - Índice da linha
     * @param {number} c - Índice da coluna
     * @param {string} [type=null] - Tipo da célula (opcional, usa o tipo atual se não fornecido)
     * @param {string} [customColor=null] - Cor personalizada (opcional, sobrepõe a cor padrão do tipo)
     * @param {boolean} [preserveHighlight=false] - Se verdadeiro, preserva o destaque do cursor
     */
    function drawCell(r, c, type = null, customColor = null, preserveHighlight = false) {
        try {
            // Verifica se o contexto do canvas está disponível
            if (!ctx) {
                console.error('Contexto do canvas não disponível');
                return;
            }
            
            // Validação de entrada
            if (typeof r !== 'number' || typeof c !== 'number' || 
                !Number.isInteger(r) || !Number.isInteger(c)) {
                console.warn(`Coordenadas inválidas para desenho: (${r}, ${c})`);
                return;
            }
            
            // Verifica se as coordenadas são válidas
            if (!isValidCell(r, c)) {
                console.warn(`Coordenadas fora dos limites do grid: (${r}, ${c})`);
                return;
            }
            
            // Obtém a célula e seu tipo
            const row = state.grid[r];
            if (!row) {
                console.error(`Linha ${r} não encontrada no grid`);
                return;
            }
            
            const cell = row[c];
            if (!cell) {
                console.warn(`Célula não encontrada em (${r}, ${c})`);
                return;
            }
            
            // Usa o tipo fornecido ou o tipo da célula, padrão para 'path'
            const cellType = type || cell.type || 'path';
            
            // Calcula a posição e tamanho no canvas
            const x = Math.round(c * state.cellSize);
            const y = Math.round(r * state.cellSize);
            const size = Math.floor(state.cellSize);
            
            // Mapa de cores para cada tipo de célula
            const colorMap = {
                wall: COLORS.WALL,      // Parede
                start: COLORS.START,    // Início
                end: COLORS.END,        // Fim
                visited: COLORS.VISITED,// Visitado
                frontier: COLORS.FRONTIER, // Fronteira
                solution: COLORS.SOLUTION, // Solução
                path: COLORS.PATH       // Caminho livre
            };
            
            // Usa a cor personalizada ou a cor do mapa, padrão para 'path'
            const fillColor = customColor || colorMap[cellType] || COLORS.PATH;
            
            // Desenha o preenchimento da célula
            ctx.fillStyle = fillColor;
            ctx.fillRect(x, y, size, size);
            
            // Desenha a borda da célula
            ctx.strokeStyle = '#eee';
            ctx.strokeRect(x, y, state.cellSize, state.cellSize);
        } catch (error) {
            console.error(`Erro ao desenhar célula (${r}, ${c}):`, error);
        }
    }
    /**
     * Verifica se as coordenadas fornecidas são válidas para o grid atual
     * @param {number} row - Índice da linha
     * @param {number} col - Índice da coluna
     * @returns {boolean} True se as coordenadas são válidas, False caso contrário
     */
    function isValidCell(row, col) {
        // Verifica se as coordenadas são números inteiros não negativos
        if (typeof row !== 'number' || typeof col !== 'number' || 
            !Number.isInteger(row) || !Number.isInteger(col) || 
            row < 0 || col < 0) {
            return false;
        }
        
        // Verifica se as coordenadas estão dentro dos limites do grid
        return row < state.numRows && col < state.numCols;
    }
    
    /**
     * Obtém as coordenadas da célula a partir das coordenadas do mouse
     * @param {MouseEvent} event - Evento de mouse
     * @returns {Object} Objeto com as propriedades row e col da célula
     */
    function getCellCoords(event) {
        try {
            // Validação de entrada
            if (!event || !elements?.canvas) {
                console.warn('Evento ou canvas inválido');
                return { row: -1, col: -1 };
            }
            
            const canvas = elements.canvas;
            
            // Obtém a posição e tamanho do canvas na tela
            const rect = canvas.getBoundingClientRect();
            
            // Calcula os fatores de escala para lidar com redimensionamento CSS
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            
            // Ajusta as coordenadas do mouse para o sistema de coordenadas do canvas
            const x = (event.clientX - rect.left) * scaleX;
            const y = (event.clientY - rect.top) * scaleY;
            
            // Calcula a célula correspondente
            const col = Math.floor(x / state.cellSize);
            const row = Math.floor(y / state.cellSize);
            
            // Verifica se as coordenadas estão dentro dos limites do canvas
            if (x < 0 || y < 0 || x > canvas.width || y > canvas.height) {
                console.log(`Coordenadas fora dos limites do canvas: (${x}, ${y})`);
                return { row: -1, col: -1 };
            }
            
            // Verifica se as coordenadas calculadas são válidas
            if (!isValidCell(row, col)) {
                console.log(`Coordenadas inválidas calculadas: (${row}, ${col})`);
                return { row: -1, col: -1 };
            }
            
            return { row, col };
            
        } catch (error) {
            console.error('Erro ao obter coordenadas da célula:', error);
            return { row: -1, col: -1 }; // Retorna coordenadas inválidas em caso de erro
        }
    }
    function isValidCell(row, col) {
        return row >= 0 && row < state.numRows && col >= 0 && col < state.numCols;
    }
    // Funções auxiliares para manipulação de eventos
    /**
     * Manipula o evento de clique ou arrasto do mouse no canvas
     * @param {MouseEvent} e - Evento de mouse
     */
    function handleMouseDown(e) {
        try {
            if (!e || !elements?.canvas) {
                console.warn('Evento ou canvas não disponível');
                return;
            }
            
            const { row, col } = getCellCoords(e);
            if (!isValidCell(row, col)) {
                console.log(`Coordenadas fora do grid: (${row}, ${col})`);
                return;
            }
            
            // Limpa o caminho e mensagens anteriores
            clearPath();
            clearStatus();
            
            if (e.button === 0) {
                // Botão esquerdo - desenhar paredes
                console.log(`Iniciando desenho em (${row}, ${col})`);
                state.isDrawing = true;
                toggleWall(row, col);
            } else if (e.button === 2) {
                // Botão direito - definir início/fim
                console.log(`Definindo início/fim em (${row}, ${col})`);
                toggleStartEnd(row, col);
            }
        } catch (error) {
            console.error('Erro no evento mousedown:', error);
            state.isDrawing = false; // Garante que não fique travado
        }
    }
    
    // Variável para controle de otimização de desempenho
    let lastAnimationFrame = 0;
    const MOUSE_MOVE_THROTTLE_MS = 16; // ~60fps
    
    /**
     * Manipula o movimento do mouse sobre o canvas
     * @param {MouseEvent} e - Evento de movimento do mouse
     */
    function handleMouseMove(e) {
        // Otimização: Usa requestAnimationFrame para limitar as atualizações
        const now = Date.now();
        if (now - lastAnimationFrame < MOUSE_MOVE_THROTTLE_MS) {
            return; // Ignora eventos muito próximos no tempo
        }
        lastAnimationFrame = now;
        
        try {
            if (!e || !elements?.canvas) {
                console.warn('Evento ou canvas não disponível');
                return;
            }
            
            // Obtém as coordenadas atuais do mouse
            const { row, col } = getCellCoords(e);
            
            // Verifica se as coordenadas são válidas
            if (isValidCell(row, col)) {
                // Se estiver desenhando, continua desenhando paredes
                if (state.isDrawing) {
                    // Usa requestAnimationFrame para desenhar paredes de forma suave
                    requestAnimationFrame(() => {
                        toggleWall(row, col, true);
                    });
                }
                
                // Atualiza a posição da mira (célula destacada) de forma otimizada
                // Usa requestAnimationFrame para garantir atualizações suaves
                requestAnimationFrame(() => {
                    updateCursorHighlight(row, col);
                });
            } else if (state.lastCursorPos) {
                // Se o mouse saiu de uma célula válida, limpa o destaque
                requestAnimationFrame(() => {
                    const { row: lastRow, col: lastCol } = state.lastCursorPos;
                    if (isValidCell(lastRow, lastCol)) {
                        const cell = state.grid[lastRow]?.[lastCol];
                        if (cell && !['start', 'end', 'wall'].includes(cell.type)) {
                            drawCell(lastRow, lastCol, cell.type);
                        }
                    }
                    state.lastCursorPos = null;
                });
            }
        } catch (error) {
            console.error('Erro no evento mousemove:', error);
            state.isDrawing = false; // Para evitar comportamentos inesperados
            
            // Tenta restaurar o estado em caso de erro
            if (state.lastCursorPos) {
                const { row: lastRow, col: lastCol } = state.lastCursorPos;
                if (isValidCell(lastRow, lastCol)) {
                    const cell = state.grid[lastRow]?.[lastCol];
                    if (cell) {
                        drawCell(lastRow, lastCol, cell.type);
                    }
                }
                state.lastCursorPos = null;
            }
        }
    }
    
    /**
     * Atualiza o destaque da célula sob o cursor (mira)
     * @param {number} row - Índice da linha
     * @param {number} col - Índice da coluna
     */
    function updateCursorHighlight(row, col) {
        try {
            // Verifica se o canvas e o contexto estão disponíveis
            if (!ctx || !elements?.canvas) {
                console.warn('Contexto ou elemento canvas não disponível');
                return;
            }
            
            // Verifica se as coordenadas são válidas
            if (!isValidCell(row, col)) {
                // Se as coordenadas não forem válidas, remove o destaque se existir
                if (state.lastCursorPos) {
                    const { row: lastRow, col: lastCol } = state.lastCursorPos;
                    if (isValidCell(lastRow, lastCol)) {
                        // Redesenha a célula anterior sem o destaque
                        const cell = state.grid[lastRow]?.[lastCol];
                        if (cell) {
                            drawCell(lastRow, lastCol, cell.type);
                        }
                    }
                    state.lastCursorPos = null;
                }
                return;
            }
            
            // Verifica se a posição do cursor mudou
            if (state.lastCursorPos && state.lastCursorPos.row === row && state.lastCursorPos.col === col) {
                return; // Nada mudou, não precisa atualizar
            }
            
            // Remove o destaque da posição anterior, se existir
            if (state.lastCursorPos) {
                const { row: lastRow, col: lastCol } = state.lastCursorPos;
                if (isValidCell(lastRow, lastCol)) {
                    const lastCell = state.grid[lastRow]?.[lastCol];
                    if (lastCell && !['start', 'end', 'wall'].includes(lastCell.type)) {
                        drawCell(lastRow, lastCol, lastCell.type);
                    }
                }
            }
            
            // Atualiza a posição atual do cursor
            state.lastCursorPos = { row, col };
            
            // Obtém a célula atual
            const cell = state.grid[row]?.[col];
            if (!cell) {
                return;
            }
            
            // Não destaca células de início, fim ou parede
            if (['start', 'end', 'wall'].includes(cell.type)) {
                return;
            }
            
            // Desenha um destaque na célula sob o cursor
            const x = Math.round(col * state.cellSize);
            const y = Math.round(row * state.cellSize);
            const size = Math.floor(state.cellSize);
            
            // Configura o estilo do destaque
            ctx.save();
            
            // Desenha um retângulo com borda tracejada
            ctx.strokeStyle = '#00f';
            ctx.lineWidth = 2;
            ctx.setLineDash([2, 2]);
            ctx.strokeRect(x + 2, y + 2, size - 4, size - 4);
            
            // Restaura o contexto
            ctx.restore();
            
        } catch (error) {
            console.error('Erro ao atualizar o destaque do cursor:', error);
        }
    }
    
    /**
     * Manipula a liberação do botão do mouse
     */
    function handleMouseUp() {
        if (state.isDrawing) {
            console.log('Finalizando desenho');
            state.isDrawing = false;
        }
    }
    
    /**
     * Manipula o evento de clique com o botão direito (context menu)
     * @param {MouseEvent} e - Evento de clique com o botão direito
     */
    function handleContextMenu(e) {
        try {
            if (e) {
                e.preventDefault();
                console.log('Menu de contexto bloqueado');
            }
        } catch (error) {
            console.error('Erro ao manipular menu de contexto:', error);
        }
    }
    
    /**
     * Manipula o evento de entrada do mouse no canvas
     * @param {MouseEvent} e - Evento de movimento do mouse
     */
    function handleMouseEnter(e) {
        try {
            // Atualiza a posição do cursor quando o mouse entra no canvas
            if (e) {
                const { row, col } = getCellCoords(e);
                if (isValidCell(row, col)) {
                    updateCursorHighlight(row, col);
                    console.log('Mouse entrou no canvas, destaque atualizado');
                }
            }
        } catch (error) {
            console.error('Erro ao manipular entrada do mouse:', error);
        }
    }
    
    /**
     * Manipula o evento de saída do mouse do canvas
     */
    function handleMouseLeave() {
        try {
            // Limpa o destaque do cursor quando o mouse sai do canvas
            state.lastCursorPos = null;
            // Redesenha o grid para remover qualquer destaque
            drawGrid(true); // Preserva o cursor para evitar piscadas
            console.log('Mouse saiu do canvas, destaque removido');
        } catch (error) {
            console.error('Erro ao manipular saída do mouse:', error);
        }
    }
    
    // Adiciona os event listeners
    try {
        elements.canvas.addEventListener('mousedown', handleMouseDown);
        elements.canvas.addEventListener('mousemove', handleMouseMove);
        elements.canvas.addEventListener('mouseup', handleMouseUp);
        elements.canvas.addEventListener('mouseenter', handleMouseEnter);
        elements.canvas.addEventListener('mouseleave', handleMouseLeave);
        elements.canvas.addEventListener('contextmenu', handleContextMenu);
        console.log('Event listeners adicionados com sucesso');
    } catch (error) {
        console.error('Erro ao adicionar event listeners:', error);
    }
    /**
     * Alterna o estado de uma célula entre parede e caminho
     * @param {number} r - Índice da linha
     * @param {number} c - Índice da coluna
     * @param {boolean} [isDrag=false] - Indica se a ação é parte de um arrasto
     */
    function toggleWall(r, c, isDrag = false) {
        try {
            // Validação de entrada
            if (typeof r !== 'number' || typeof c !== 'number' || 
                !Number.isInteger(r) || !Number.isInteger(c)) {
                console.warn(`Coordenadas inválidas para toggleWall: (${r}, ${c})`);
                return;
            }
            
            // Verifica se as coordenadas são válidas
            if (!isValidCell(r, c)) {
                console.warn(`Coordenadas fora dos limites do grid: (${r}, ${c})`);
                return;
            }
            
            // Obtém a célula do grid
            const row = state.grid[r];
            if (!row) {
                console.error(`Linha ${r} não encontrada no grid`);
                return;
            }
            
            const cell = row[c];
            if (!cell) {
                console.error(`Célula não encontrada em (${r}, ${c})`);
                return;
            }
            
            // Não permite alterar células de início ou fim
            if (cell.type === 'start' || cell.type === 'end') {
                console.log(`Ignorando célula do tipo '${cell.type}' em (${r}, ${c})`);
                return;
            }
            
            // Se estiver arrastando, só converte caminho em parede
            if (isDrag && cell.type !== 'path') {
                return;
            }
            
            // Determina o novo tipo (alterna entre 'wall' e 'path')
            const newType = cell.type === 'wall' ? 'path' : 'wall';
            
            // Atualiza o estado da célula
            state.grid[r][c] = { ...cell, type: newType };
            
            // Redesenha apenas a célula alterada
            drawCell(r, c, newType);
            
            // Log para depuração
            console.log(`Célula (${r}, ${c}) alterada para: ${newType}${isDrag ? ' (arrasto)' : ''}`);
            
        } catch (error) {
            console.error(`Erro em toggleWall(${r}, ${c}, ${isDrag}):`, error);
        }
    }
    /**
     * Alterna entre definir/remover os pontos de início e fim no labirinto
     * @param {number} r - Índice da linha
     * @param {number} c - Índice da coluna
     */
    function toggleStartEnd(r, c) {
        try {
            // Validação de entrada
            if (typeof r !== 'number' || typeof c !== 'number' || 
                !Number.isInteger(r) || !Number.isInteger(c)) {
                console.warn(`Coordenadas inválidas para toggleStartEnd: (${r}, ${c})`);
                return;
            }
            
            // Verifica se as coordenadas são válidas
            if (!isValidCell(r, c)) {
                console.warn(`Coordenadas fora dos limites do grid: (${r}, ${c})`);
                return;
            }
            
            // Obtém a célula do grid
            const row = state.grid[r];
            if (!row) {
                console.error(`Linha ${r} não encontrada no grid`);
                return;
            }
            
            const cell = row[c];
            if (!cell) {
                console.error(`Célula não encontrada em (${r}, ${c})`);
                return;
            }
            
            // Não permite definir início/fim em paredes
            if (cell.type === 'wall') {
                console.log(`Não é possível definir início/fim em uma parede (${r}, ${c})`);
                return;
            }
            
            const { startNode, endNode } = state;
            
            // Verifica se clicou no nó de início existente
            if (startNode?.row === r && startNode?.col === c) {
                console.log(`Removendo ponto de início de (${r}, ${c})`);
                state.startNode = null;
                state.grid[r][c] = { ...cell, type: 'path' };
                drawCell(r, c, 'path');
                return;
            }
            
            // Verifica se clicou no nó de fim existente
            if (endNode?.row === r && endNode?.col === c) {
                console.log(`Removendo ponto de fim de (${r}, ${c})`);
                state.endNode = null;
                state.grid[r][c] = { ...cell, type: 'path' };
                drawCell(r, c, 'path');
                return;
            }
            
            // Se não houver início, define como início
            if (!startNode) {
                console.log(`Definindo novo ponto de início em (${r}, ${c})`);
                
                // Atualiza o estado
                state.startNode = { row: r, col: c };
                state.grid[r][c] = { ...cell, type: 'start' };
                
                // Redesenha a célula
                drawCell(r, c, 'start');
                
                // Atualiza a interface
                displayStatus(`Ponto de início definido em (${r}, ${c})`, 'success');
                return;
            }
            
            // Se já houver início e não houver fim, define como fim
            if (startNode && !endNode) {
                // Verifica se não é o mesmo ponto do início
                if (startNode.row === r && startNode.col === c) {
                    console.log('O ponto de fim não pode ser o mesmo que o ponto de início');
                    displayStatus('O ponto de fim não pode ser o mesmo que o ponto de início', 'warning');
                    return;
                }
                
                console.log(`Definindo novo ponto de fim em (${r}, ${c})`);
                
                // Atualiza o estado
                state.endNode = { row: r, col: c };
                state.grid[r][c] = { ...cell, type: 'end' };
                
                // Redesenha a célula
                drawCell(r, c, 'end');
                
                // Atualiza a interface
                displayStatus(`Ponto de fim definido em (${r}, ${c})`, 'success');
                return;
            }
            
            // Se já existirem início e fim, informa ao usuário
            console.log('Já existem pontos de início e fim definidos');
            displayStatus('Já existem pontos de início e fim definidos. Remova um para adicionar outro.', 'info');
            
        } catch (error) {
            console.error(`Erro em toggleStartEnd(${r}, ${c}):`, error);
            displayStatus('Erro ao definir ponto de início/fim', 'error');
        }
    }
    // Funções de manipulação de eventos dos botões
    function handleResetClick() {
        try {
            console.log('Reiniciando grid...');
            initializeGrid();
            displayStatus('Labirinto reiniciado', 'success');
        } catch (error) {
            console.error('Erro ao reiniciar o grid:', error);
            displayStatus('Erro ao reiniciar o labirinto', 'error');
        }
    }
    
    function handleClearPathClick() {
        try {
            console.log('Limpando caminho...');
            clearPath();
            displayStatus('Caminho limpo', 'info');
        } catch (error) {
            console.error('Erro ao limpar o caminho:', error);
            displayStatus('Erro ao limpar o caminho', 'error');
        }
    }
    
    function handleSolveClick() {
        try {
            console.log('Iniciando resolução do labirinto...');
            if (state.animationId) {
                cancelAnimationFrame(state.animationId);
                state.animationId = null;
            }
            clearPath();
            solveMaze().catch(error => {
                console.error('Erro ao resolver o labirinto:', error);
                displayStatus('Erro ao resolver o labirinto', 'error');
            });
        } catch (error) {
            console.error('Erro no clique do botão resolver:', error);
            displayStatus('Erro ao processar a solução', 'error');
        }
    }
    
    // Adiciona os event listeners aos botões
    try {
        elements.resetGridBtn.addEventListener('click', handleResetClick);
        elements.clearPathBtn.addEventListener('click', handleClearPathClick);
        elements.solveBtn.addEventListener('click', handleSolveClick);
        console.log('Event listeners dos botões adicionados com sucesso');
    } catch (error) {
        console.error('Erro ao adicionar event listeners aos botões:', error);
    }
    /**
     * Limpa o caminho de busca e solução do labirinto
     * Mantém as paredes e os pontos de início/fim
     */
    function clearPath() {
        try {
            if (!state?.grid) {
                console.error('Grid não inicializado');
                return;
            }
            
            // Salva a posição atual do cursor para restaurar após limpar
            const lastCursorPos = state.lastCursorPos;
            
            // Limpa o grid, mantendo apenas paredes, início e fim
            state.grid.forEach((row, r) => {
                row.forEach((cell, c) => {
                    if (cell && ['visited', 'frontier', 'solution'].includes(cell.type)) {
                        state.grid[r][c] = { ...cell, type: 'path', visited: false, parent: null };
                    }
                });
            });
            
            // Redesenha todo o grid, preservando o cursor
            drawGrid(true);
            
            // Restaura o destaque do cursor se existir
            if (lastCursorPos) {
                const { row, col } = lastCursorPos;
                if (isValidCell(row, col)) {
                    // Pequeno atraso para garantir que o grid foi desenhado
                    setTimeout(() => updateCursorHighlight(row, col), 0);
                }
            }
            
            // Redesenha início e fim se existirem
            if (state.startNode) {
                drawCell(state.startNode.row, state.startNode.col, 'start');
            }
            if (state.endNode) {
                drawCell(state.endNode.row, state.endNode.col, 'end');
            }
            clearStatus();
        } catch (error) {
            console.error('Erro ao limpar o caminho:', error);
            displayStatus('Erro ao limpar o caminho', 'error');
        }
    }
    function displayStatus(message, type = 'info') {
        try {
            if (!elements?.statusText) {
                console.error('Elemento de status não encontrado');
                return;
            }
            elements.statusText.textContent = message;
            elements.statusText.className = `message ${type}`;
            console.log(`[${type.toUpperCase()}] ${message}`);
        } catch (error) {
            console.error('Erro ao exibir status:', error);
        }
    }
    function clearStatus() {
        elements.statusText.textContent = '';
        elements.statusText.className = 'message';
    }
    // Algoritmos de busca
    function getNeighbors(r, c) {
        const neighbors = [];
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1] // Cima, Baixo, Esquerda, Direita
        ];
        for (const [dr, dc] of directions) {
            const nr = r + dr, nc = c + dc;
            if (isValidCell(nr, nc) && state.grid[nr][nc].type !== 'wall') {
                neighbors.push({ row: nr, col: nc });
            }
        }
        return neighbors;
    }
    async function solveMaze() {
        try {
            const { startNode, endNode } = state;
            
            // Validações iniciais
            if (!startNode || !endNode) {
                const errorMsg = !startNode && !endNode 
                    ? 'Defina os pontos de Início (Verde) e Fim (Vermelho).' 
                    : !startNode 
                        ? 'Defina o ponto de Início (Verde).' 
                        : 'Defina o ponto de Fim (Vermelho).';
                
                displayStatus(errorMsg, 'error');
                return null;
            }
            
            if (state.isSolving) {
                console.log('Já existe uma busca em andamento');
                return null;
            }
            
            state.isSolving = true;
            displayStatus('Iniciando busca...', 'info');
            
            // Resetar estado das células
            state.grid.forEach((row, r) => {
                row.forEach((cell, c) => {
                    cell.visited = false;
                    cell.parent = null;
                    if (!['wall', 'start', 'end'].includes(cell.type)) {
                        cell.type = 'path';
                        drawCell(r, c, 'path');
                    }
                });
            });
            
            // Redesenha início e fim para garantir que estão visíveis
            drawCell(startNode.row, startNode.col, 'start');
            drawCell(endNode.row, endNode.col, 'end');
            
            // Executa o algoritmo de busca selecionado
            const algorithm = elements.algorithmSelect.value;
            console.log(`Executando busca ${algorithm.toUpperCase()}...`);
            
            try {
                const foundPath = algorithm === 'bfs' ? await bfs() : await dfs();
                
                if (foundPath) {
                    console.log('Caminho encontrado!');
                    displayStatus('Caminho encontrado!', 'success');
                    await animatePath(foundPath);
                } else {
                    console.log('Nenhum caminho encontrado.');
                    displayStatus('Nenhum caminho encontrado!', 'error');
                }
                
                return foundPath;
            } catch (error) {
                console.error('Erro durante a busca:', error);
                displayStatus('Erro ao executar a busca', 'error');
                return null;
            } finally {
                state.isSolving = false;
            }
            
        } catch (error) {
            console.error('Erro inesperado em solveMaze:', error);
            displayStatus('Erro inesperado ao resolver o labirinto', 'error');
            state.isSolving = false;
            return null;
        }
    }
    // Algoritmo BFS (Busca em Largura)
    async function bfs() {
        try {
            const { startNode, endNode } = state;
            if (!startNode || !endNode) {
                throw new Error('Nós de início ou fim não definidos');
            }
            
            console.log('Iniciando BFS...');
            const startTime = performance.now();
            let nodesVisited = 0;
            
            const queue = [{ node: startNode, path: [startNode] }];
            const visited = new Set([`${startNode.row},${startNode.col}`]);
            const animationQueue = [];
            
            while (queue.length > 0) {
                // Verifica se a busca foi cancelada
                if (!state.isSolving) {
                    console.log('Busca BFS cancelada pelo usuário');
                    return null;
                }
                
                const { node: current, path } = queue.shift();
                nodesVisited++;
                
                // Adiciona à animação (exceto nós de início e fim)
                if (current !== startNode && current !== endNode) {
                    animationQueue.push({ 
                        row: current.row, 
                        col: current.col, 
                        color: COLORS.VISITED 
                    });
                }
                
                // Pequena pausa para permitir a renderização
                if (nodesVisited % 10 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 0));
                }
                
                // Verifica se chegou ao fim
                if (current.row === endNode.row && current.col === endNode.col) {
                    const endTime = performance.now();
                    console.log(`BFS concluído em ${(endTime - startTime).toFixed(2)}ms, visitou ${nodesVisited} nós`);
                    state.animationId = requestAnimationFrame(() => animateSearch(animationQueue, path));
                    return path;
                }
                
                // Explora vizinhos
                const neighbors = getNeighbors(current.row, current.col);
                for (const neighbor of neighbors) {
                    const key = `${neighbor.row},${neighbor.col}`;
                    
                    if (!visited.has(key)) {
                        visited.add(key);
                        state.grid[neighbor.row][neighbor.col].parent = current;
                        
                        const newPath = [...path, neighbor];
                        queue.push({ node: neighbor, path: newPath });
                        
                        // Atualiza animação para a fronteira (exceto o nó final)
                        if (neighbor.row !== endNode.row || neighbor.col !== endNode.col) {
                            animationQueue.push({ 
                                row: neighbor.row, 
                                col: neighbor.col, 
                                color: COLORS.FRONTIER 
                            });
                        }
                    }
                }
                
                // Atualiza a animação periodicamente
                if (animationQueue.length > 0 && animationQueue.length % 20 === 0) {
                    state.animationId = requestAnimationFrame(() => animateSearch([...animationQueue]));
                }
            }
            
            console.log(`BFS concluído sem encontrar caminho, visitou ${nodesVisited} nós`);
            state.animationId = requestAnimationFrame(() => animateSearch(animationQueue, []));
            return null;
            
        } catch (error) {
            console.error('Erro no algoritmo BFS:', error);
            displayStatus('Erro durante a busca BFS', 'error');
            return null;
        }
    }
    
    // Algoritmo DFS (Busca em Profundidade)
    async function dfs() {
        try {
            const { startNode, endNode } = state;
            if (!startNode || !endNode) {
                throw new Error('Nós de início ou fim não definidos');
            }
            
            console.log('Iniciando DFS...');
            const startTime = performance.now();
            let nodesVisited = 0;
            
            const stack = [{ node: startNode, path: [startNode] }];
            const visited = new Set([`${startNode.row},${startNode.col}`]);
            const animationQueue = [];
            
            while (stack.length > 0) {
                // Verifica se a busca foi cancelada
                if (!state.isSolving) {
                    console.log('Busca DFS cancelada pelo usuário');
                    return null;
                }
                
                const { node: current, path } = stack.pop();
                nodesVisited++;
                
                // Adiciona à animação (exceto nós de início e fim)
                if (current !== startNode && current !== endNode) {
                    animationQueue.push({ 
                        row: current.row, 
                        col: current.col, 
                        color: COLORS.VISITED 
                    });
                }
                
                // Pequena pausa para permitir a renderização
                if (nodesVisited % 10 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 0));
                }
                
                // Verifica se chegou ao fim
                if (current.row === endNode.row && current.col === endNode.col) {
                    const endTime = performance.now();
                    console.log(`DFS concluído em ${(endTime - startTime).toFixed(2)}ms, visitou ${nodesVisited} nós`);
                    state.animationId = requestAnimationFrame(() => animateSearch(animationQueue, path));
                    return path;
                }
                
                // Explora vizinhos na ordem inversa (para manter direcionalidade consistente)
                const neighbors = getNeighbors(current.row, current.col).reverse();
                for (const neighbor of neighbors) {
                    const key = `${neighbor.row},${neighbor.col}`;
                    
                    if (!visited.has(key)) {
                        visited.add(key);
                        state.grid[neighbor.row][neighbor.col].parent = current;
                        
                        const newPath = [...path, neighbor];
                        stack.push({ node: neighbor, path: newPath });
                        
                        // Atualiza animação para a fronteira (exceto o nó final)
                        if (neighbor.row !== endNode.row || neighbor.col !== endNode.col) {
                            animationQueue.push({ 
                                row: neighbor.row, 
                                col: neighbor.col, 
                                color: COLORS.FRONTIER 
                            });
                        }
                    }
                }
                
                // Atualiza a animação periodicamente
                if (animationQueue.length > 0 && animationQueue.length % 20 === 0) {
                    state.animationId = requestAnimationFrame(() => animateSearch([...animationQueue]));
                }
            }
            
            console.log(`DFS concluído sem encontrar caminho, visitou ${nodesVisited} nós`);
            state.animationId = requestAnimationFrame(() => animateSearch(animationQueue, []));
            return null;
            
        } catch (error) {
            console.error('Erro no algoritmo DFS:', error);
            displayStatus('Erro durante a busca DFS', 'error');
            return null;
        }
    }
    
    // Sistema de animação
    function animateSearch(queue, finalPath) {
        try {
            if (!queue || queue.length === 0) {
                console.log('Fila de animação vazia');
                if (finalPath && finalPath.length > 0) {
                    console.log('Iniciando animação do caminho final');
                    animatePath(finalPath).catch(console.error);
                }
                return;
            }
            
            const { startNode, endNode } = state;
            const batchSize = 20; // Processa em lotes para melhor desempenho
            const batch = queue.splice(0, batchSize);
            
            // Processa o lote atual
            batch.forEach(({ row, col, color }) => {
                try {
                    // Não sobrescreve nós de início e fim
                    if ((startNode && row === startNode.row && col === startNode.col) ||
                        (endNode && row === endNode.row && col === endNode.col)) {
                        return;
                    }
                    
                    const cell = state.grid[row]?.[col];
                    if (!cell) return;
                    
                    // Atualiza o tipo da célula com base na cor
                    if (color === COLORS.VISITED && cell.type !== 'path' && cell.type !== 'wall') {
                        cell.type = 'visited';
                        drawCell(row, col, 'visited');
                    } else if (color === COLORS.FRONTIER && cell.type !== 'path' && cell.type !== 'wall') {
                        cell.type = 'frontier';
                        drawCell(row, col, 'frontier');
                    }
                } catch (error) {
                    console.error(`Erro ao animar célula (${row}, ${col}):`, error);
                }
            });
            
            // Agenda o próximo quadro de animação se ainda houver itens na fila
            if (queue.length > 0) {
                state.animationId = requestAnimationFrame(() => animateSearch(queue, finalPath));
            } else if (finalPath && finalPath.length > 0) {
                console.log('Iniciando animação do caminho final');
                animatePath(finalPath).catch(console.error);
            }
            
        } catch (error) {
            console.error('Erro na função animateSearch:', error);
            displayStatus('Erro na animação da busca', 'error');
        }
    }
    
    async function animatePath(path) {
        if (!path || path.length === 0) {
            console.log('Caminho vazio para animação');
            return;
        }
        
        console.log(`Iniciando animação do caminho com ${path.length} células`);
        const { startNode, endNode } = state;
        const animationDelay = 30; // ms entre animações
        
        try {
            // Pula o primeiro (início) e o último (fim) nós
            for (let i = 1; i < path.length - 1; i++) {
                // Verifica se a animação foi cancelada
                if (!state.isSolving) {
                    console.log('Animação do caminho cancelada');
                    return;
                }
                
                const { row, col } = path[i];
                
                try {
                    // Verifica se a célula ainda é válida para animação
                    const cell = state.grid[row]?.[col];
                    if (!cell || cell.type === 'wall' || cell.type === 'start' || cell.type === 'end') {
                        continue;
                    }
                    
                    // Desenha o caminho
                    cell.type = 'path';
                    drawCell(row, col, 'path');
                    
                    // Pequeno atraso para a animação, mas não bloqueia a thread principal
                    if (i % 5 === 0) { // Reduz a frequência de atrasos para melhor desempenho
                        await new Promise(resolve => setTimeout(resolve, animationDelay));
                    }
                } catch (cellError) {
                    console.error(`Erro ao animar célula do caminho (${row}, ${col}):`, cellError);
                }
            }
            
            // Garante que o início e o fim estejam visíveis e corretos
            if (startNode) {
                drawCell(startNode.row, startNode.col, 'start');
            }
            if (endNode) {
                drawCell(endNode.row, endNode.col, 'end');
            }
            
            console.log('Animação do caminho concluída com sucesso');
            
        } catch (error) {
            console.error('Erro na função animatePath:', error);
            displayStatus('Erro na animação do caminho', 'error');
            
            // Tenta restaurar o estado visual em caso de erro
            try {
                if (startNode) drawCell(startNode.row, startNode.col, 'start');
                if (endNode) drawCell(endNode.row, endNode.col, 'end');
            } catch (restoreError) {
                console.error('Erro ao restaurar estado após falha na animação:', restoreError);
            }
        }
    }
    // Inicializa o grid quando o DOM estiver pronto
    initializeGrid();
});
/* Código copiado/baixado de "igormelol" por questões de tempo em relação ao tamanho do código */