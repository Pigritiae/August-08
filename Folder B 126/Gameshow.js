document.addEventListener('DOMContentLoaded', () => {
    const currentLevelEl = document.getElementById('current-level');
    const currentMoneyEl = document.getElementById('current-play');
    const questionTextEl = document.getElementById('question-text');
    const optionsAreaEl = document.getElementById('options-area');
    const optionButtons = document.querySelectorAll('.option-btn');
    const startGameBtn = document.getElementById('start-game-btn');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeMessageBtn = document.getElementById('close-message-btn');

    const questions = [
        {
            question: "What is the capital of France?",
            options: ["Berlin", "Madrid", "Paris", "Rome"],
            correctAnswer: "Paris",
            level: 1,
            moneyValue: 100
        },
        {
            question: "Which planet is known as the 'Red Planet'?",
            options: ["Jupiter", "Mars", "Venus", "Saturn"],
            correctAnswer: "Mars",
            level: 1,
            moneyValue: 100
        },
        {
            question: "Who wrote 'Romeo and Juliet'?",
            options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
            correctAnswer: "William Shakespeare",
            level: 1,
            moneyValue: 100
        },
        {
            question: "What is the largest ocean on Earth?",
            options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
            correctAnswer: "Pacific Ocean",
            level: 1,
            moneyValue: 100
        },
        {
            question: "What is the chemical symbol for gold?",
            options: ["Au", "Ag", "Fe", "Pb"],
            correctAnswer: "Au",
            level: 2,
            moneyValue: 500
        },
        {
            question: "In what year did the Titanic sink?",
            options: ["1912", "1905", "1918", "1923"],
            correctAnswer: "1912",
            level: 2,
            moneyValue: 500
        },
        {
            question: "Which country is home to the kangaroo?",
            options: ["Brazil", "China", "Australia", "Egypt"],
            correctAnswer: "Australia",
            level: 2,
            moneyValue: 500
        },
        {
            question: "What is the powerhouse of the cell?",
            options: ["Nucleus", "Ribosome", "Mitochondria", "Cytoplasm"],
            correctAnswer: "Mitochondria",
            level: 2,
            moneyValue: 500
        },
        {
            question: "What element is denoted by the chemical symbol 'O'?",
            options: ["Gold", "Oxygen", "Iron", "Carbon"],
            correctAnswer: "Oxygen",
            level: 3,
            moneyValue: 1000
        },
        {
            question: "How many continents are there?",
            options: ["5", "6", "7", "8"],
            correctAnswer: "7",
            level: 3,
            moneyValue: 1000
        },
        {
            question: "What is the capital of Japan?",
            options: ["Beijing", "Seoul", "Bangkok", "Tokyo"],
            correctAnswer: "Tokyo",
            level: 3,
            moneyValue: 1000
        },
        {
            question: "Which bird is a symbol of peace?",
            options: ["Eagle", "Pigeon", "Raven", "Owl"],
            correctAnswer: "Pigeon",
            level: 3,
            moneyValue: 1000
        },
        {
            question: "Who painted the Mona Lisa?",
            options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Claude Monet"],
            correctAnswer: "Leonardo da Vinci",
            level: 4,
            moneyValue: 5000
        },
        {
            question: "What is the largest land animal?",
            options: ["African Elephant", "Giraffe", "Hippopotamus", "Rhinoceros"],
            correctAnswer: "African Elephant",
            level: 4,
            moneyValue: 5000
        },
        {
            question: "Which of the following is NOT a primary color?",
            options: ["Red", "Blue", "Green", "Yellow"],
            correctAnswer: "Green",
            level: 4,
            moneyValue: 5000
        },
        {
            question: "How many states are in the United States?",
            options: ["50", "48", "51", "52"],
            correctAnswer: "50",
            level: 4,
            moneyValue: 5000
        },
        {
            question: "What is the speed of light in a vacuum?",
            options: ["299,792 km/s", "300,000 km/s", "150,000 km/s", "500,000 km/s"],
            correctAnswer: "299,792 km/s",
            level: 5,
            moneyValue: 1000000
        },
        {
            question: "What does HTML stand for?",
            options: ["HyperText Markup Language", "Hyperlink and Text Markup Language", "Home Tool Markup Language", "HyperText Multi Language"],
            correctAnswer: "HyperText Markup Language",
            level: 5,
            moneyValue: 1000000
        },
        {
            question: "What is the smallest country in the world?",
            options: ["Monaco", "Nauru", "Vatican City", "San Marino"],
            correctAnswer: "Vatican City",
            level: 5,
            moneyValue: 1000000
        },
        {
            question: "Who was the first person to walk on the moon?",
            options: ["Buzz Aldrin", "Yuri Gagarin", "Neil Armstrong", "Michael Collins"],
            correctAnswer: "Neil Armstrong",
            level: 5,
            moneyValue: 1000000
        }
    ];

    let currentLevel = 1;
    let currentMoney = 0;
    let currentQuestionIndex = 0;
    let shuffledQuestions = [];
    let gameActive = false;

    function showMessage(message) {
        messageText.textContent = message;
        messageBox.style.display = 'flex';
    }

    function hideMessage() {
        messageBox.style.display = 'none';
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function prepareQuestionsForLevel() {
        const levelQuestions = questions.filter(q => q.level === currentLevel);
        shuffledQuestions = shuffleArray(levelQuestions);
        currentQuestionIndex = 0;
    }

    function updateGameInfo() {
        currentLevelEl.textContent = currentLevel;
        currentMoneyEl.textContent = `$${currentMoney.toLocaleString('en')}`;
    }

    function displayQuestion() {
        if (currentQuestionIndex < shuffledQuestions.length) {
            const question = shuffledQuestions[currentQuestionIndex];
            questionTextEl.textContent = question.question;

            const shuffledOptions = shuffleArray([...question.options]);

            optionButtons.forEach((button, index) => {
                button.textContent = shuffledOptions[index];
                button.classList.remove('correct', 'incorrect');
                button.disabled = false;
            });
        } else {
            advanceLevel();
        }
    }

    function checkAnswer(selectedAnswer) {
        if (!gameActive) return;

        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        const isCorrect = (selectedAnswer === currentQuestion.correctAnswer);
        optionButtons.forEach(button => button.disabled = true);

        optionButtons.forEach(button => {
            if (button.textContent === currentQuestion.correctAnswer) {
                button.classList.add('correct');
            } else if (button.textContent === selectedAnswer) {
                button.classList.add('incorrect');
            }
        });

        setTimeout(() => {
            if (isCorrect) {
                currentMoney += currentQuestion.moneyValue;
                updateGameInfo();
                showMessage(`Correct! You Gained $${currentQuestion.moneyValue.toLocaleString('en')}!`);
                currentQuestionIndex++;
            } else {
                showMessage(`Wrong! The Answer was "${currentQuestion.correctAnswer}". Game Over! You ended up with $${currentMoney.toLocaleString("en")}.`);
                endGame();
                return;
            }
            setTimeout(() => {
                hideMessage();
                if (gameActive) {
                    displayQuestion();
                }
            }, 2000);
        }, 1500);
    }

    function advanceLevel() {
        currentLevel++;
        if (currentLevel > 5) {
            showMessage(`Congratulations! You are now a Millionaire! You Won $${currentMoney.toLocaleString('en')}!`);
            endGame();
        } else {
            showMessage(`Congratulations! Advancing to Level ${currentLevel}!`);
            prepareQuestionsForLevel();
            updateGameInfo();
            setTimeout(() => {
                hideMessage();
                displayQuestion();
            }, 2000);
        }
    }

    function endGame() {
        gameActive = false;
        optionButtons.forEach(button => button.disabled = true);
        startGameBtn.textContent = 'Restart Game';
        startGameBtn.classList.add('primary');
        showMessage(`Game Over! You ended up with $${currentMoney.toLocaleString('en')}.`);
    }

    function startGame() {
        currentLevel = 1;
        currentMoney = 0;
        currentQuestionIndex = 0;
        gameActive = true;

        updateGameInfo();
        prepareQuestionsForLevel();
        displayQuestion();

        startGameBtn.textContent = 'Restart Game';
        startGameBtn.classList.remove('primary');

        optionButtons.forEach(button => {
            button.classList.remove('correct', 'incorrect');
            button.disabled = false;
        });
        hideMessage();
    }

    optionButtons.forEach(button => {
        button.addEventListener('click', () => {
            checkAnswer(button.textContent);
        });
    });

    startGameBtn.addEventListener('click', startGame);
    closeMessageBtn.addEventListener('click', hideMessage);

    // Initial setup
    updateGameInfo();
    optionButtons.forEach(button => button.disabled = true);
    startGameBtn.classList.add('primary');
});
/* Código corrigido e perguntas geradas pela IA Gemini */