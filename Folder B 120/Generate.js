document.addEventListener('DOMContentLoaded', () => {
    const codeDataInput = document.getElementById('code-data');
    const toolButtons = document.querySelectorAll('.tool-button');
    const generateCodeBtn = document.getElementById('generate-code-btn');
    const saveCodeBtn = document.getElementById('save-code-btn');
    const clearCanvasBtn = document.getElementById('clear-canvas-btn');
    const codeCanvas = document.getElementById('code-canvas');
    const ctx = codeCanvas.getContext('2d');
    const canvasMessage = document.getElementById('canvas-message');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeMessageBtn = document.getElementById('close-message-btn');

    let selectedCodeType = 'barcode';
    const QR_CODE_SIZE = 256;
    const BARCODE_WIDTH = 400;
    const BARCODE_HEIGHT = 150;

    function showMessage(message) {
        messageText.textContent = message;
        messageBox.style.display = 'flex';
    }

    function hideMessage() {
        messageBox.style.display = 'none';
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, codeCanvas.width, codeCanvas.height);
        codeCanvas.style.display = 'none';
        canvasMessage.style.display = 'block';
    }

    async function generateCode() {
        const data = codeDataInput.value.trim();
        if (!data) {
            showMessage('Please Type the Data to Generate the Code.');
            return;
        }

        clearCanvas();
        canvasMessage.style.display = 'none';
        codeCanvas.style.display = 'block';

        if (selectedCodeType === 'barcode') {
            codeCanvas.width = BARCODE_WIDTH;
            codeCanvas.height = BARCODE_HEIGHT;
            try {
                JsBarcode(codeCanvas, data, {
                    format: "CODE128",
                    displayValue: true,
                    fontSize: 18,
                    height: BARCODE_HEIGHT * 0.7,
                    width: 2,
                    margin: 10,
                    lineColor: "#000000"
                });
                showMessage('Bar Code Generated Successfully!');
            } catch (error) {
                showMessage(`Error Generating the Bar Code: ${error.message}. Verify the Data.`);
                clearCanvas();
            }
        } else if (selectedCodeType === 'qrcode') {
            codeCanvas.width = QR_CODE_SIZE;
            codeCanvas.height = QR_CODE_SIZE;
            try {
                // Ensure a new instance of QRCode is created and rendered to the main canvas
                new QRCode(codeCanvas, {
                    text: data,
                    width: QR_CODE_SIZE,
                    height: QR_CODE_SIZE,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H,
                });
                showMessage('QR Code Generated Successfully!');
            } catch (error) {
                showMessage(`Error when Generating the QR Code: ${error.message}. Verify the Data.`);
                clearCanvas();
            }
        }
    }

    function saveCode() {
        if (!codeCanvas || codeCanvas.width === 0 || codeCanvas.height === 0 || codeCanvas.style.display === 'none') {
            showMessage('No Generated Code to Save or the Code is not Ready. Please Generate a Code First.');
            return;
        }
        const dataURL = codeCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `${selectedCodeType}_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showMessage('Image Saved Successfully!');
    }

    toolButtons.forEach(button => {
        button.addEventListener('click', () => {
            toolButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedCodeType = button.dataset.codeType;
            showMessage(`Code Type Selected: ${button.dataset.codeType}`);
            clearCanvas();
        });
    });

    generateCodeBtn.addEventListener('click', generateCode);
    saveCodeBtn.addEventListener('click', saveCode);
    clearCanvasBtn.addEventListener('click', clearCanvas);
    closeMessageBtn.addEventListener('click', hideMessage);
    messageBox.addEventListener('click', (e) => {
        if (e.target === messageBox) {
            hideMessage();
        }
    });
    
    // Initial call to generate a code when the page loads
    generateCode();
});
/* Códigos corrigod pela IA Gemini */