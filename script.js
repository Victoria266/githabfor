// Данные игры (сюжет, вопросы, картинки)
const gameData = {
    scenes: {
        start: {
            text: "🔍 О нет! Твоя любимая кружка с черным чаем исчезла! На столе лежит старинная карта. Куда отправишься сначала?",
            image: "cap.png",
            choices: [
                { text: "Открыть тумбочку", nextScene: 'question1' },
                { text: "Пойти поискать на улице", nextScene: 'question2' },
                { text: "Заглянуть в гардероб", nextScene: 'question3' },
                { text: "Заглянуть в шкаф", nextScene: 'question4' }
            ]
        },
        question1: {
            text: "Где и когда ты родился?",
            image: "family.jpg", 
            choices: [
                { text: "Рубцовск, 28.08.1953г", nextScene: 'wrong1', isCorrect: false },
                { text: "Коломыя, 20.02.1979г", nextScene: 'question2', isCorrect: true }, 
                { text: "Белгород, 09.07.1980г", nextScene: 'wrong1', isCorrect: false }
            ]
        },
        question2: {
            text: "Какую самую любимую игрушку мне подарили в детстве?",
            image: "me.jpg", 
            choices: [
                { text: "Розовый единорог", nextScene: 'wrong2', isCorrect: false },
                { text: "Плюшевый мишка", nextScene: 'wrong2', isCorrect: false },
                { text: "Пятнистая собачка тяпа", nextScene: 'question3', isCorrect: true } 
            ]
        },
        question3: {
            text: "Как зовут нашу кошку?",
            image: "cat.jpg", 
            choices: [
                { text: "Пушинка", nextScene: 'wrong3', isCorrect: false },
                { text: "Пуша", nextScene: 'question4', isCorrect: true }, 
                { text: "Кушать", nextScene: 'wrong3', isCorrect: false }
            ]
        },
        question4: {
            text: "Какая твоя любимая детская книга?",
            image: "books.jpg", 
            choices: [
                { text: "Даниэль Дэфо; Робинзон Крузо", nextScene: 'wrong4', isCorrect: false },
                { text: "Уильям Котцвинкл; Ип, инопланетянит и его приключения на Земле ", nextScene: 'final', isCorrect: true }, 
                { text: "Джек Лондон; Белый клык", nextScene: 'wrong4', isCorrect: false }
            ]
        },
        wrong1: {
            text: "😕 Не угадал... Пап, ты просто переволновался от приключений! Попробуй еще раз!",
            image: "грусть.jpg", 
            choices: [
                { text: "Попробовать снова", nextScene: 'question1' }
            ]
        },
        wrong2: {
            text: "😋 Ошибка! Но я все равно тебя люблю! Давай вернемся к вопросу.",
            image: "крот.jpg", 
            choices: [
                { text: "Вернуться к вопросу", nextScene: 'question2' }
            ]
        },
        wrong3: {
            text: "🧐 Хмм, не совсем так. Но ты близок! Попробуй другой вариант.",
            image: "некрот.jpg", 
            choices: [
                { text: "Выбрать другой ответ", nextScene: 'question3' }
            ]
        },
        wrong4: {
            text: "Немного не так. Давай еще одну попытку!",
            image: "смайл.jpg", 
            choices: [
                { text: "Вернуться к вопросу", nextScene: 'question4' }
            ]
        },
        final: {
            text: "🥳🎉 С ДНЕМ РОЖДЕНИЯ, ПАПОЧКА! Ты прошел квест и нашел главный приз, нашу любовь и поздравления! Ты лучший! ❤️",
            image: "tort.jpg", 
            choices: [
                { text: "🎂 Съесть виртуальное пирожное", nextScene: 'final', action: 'confetti' },
                { text: "🌍 Пройти квест заново", nextScene: 'start' }
            ]
        }
    }
};

// Массив для хранения отвеченных вопросов
let answeredQuestions = [];

// Функция для сброса прогресса
function resetGame() {
    answeredQuestions = [];
}

// Функция для проверки, все ли вопросы отвечены
function allQuestionsAnswered() {
    const questionScenes = ['question1', 'question2', 'question3', 'question4'];
    return questionScenes.every(q => answeredQuestions.includes(q));
}

// Функция для получения следующего неотвеченного вопроса
function getNextUnansweredQuestion() {
    const questionScenes = ['question1', 'question2', 'question3', 'question4'];
    return questionScenes.find(q => !answeredQuestions.includes(q));
}

// Функция для обновления страницы
function renderScene(sceneId) {
    const scene = gameData.scenes[sceneId];
    const storyText = document.getElementById('story-text');
    const storyImage = document.getElementById('story-image');
    const choicesDiv = document.getElementById('choices-buttons');

    if (!scene) return;

    // Обновляем текст
    storyText.innerText = scene.text;

    // Обновляем картинку
    if (scene.image && scene.image !== "") {
        storyImage.src = scene.image;
        storyImage.style.display = 'block';
        storyImage.style.margin = '0 auto'; // Центрирование
    } else {
        storyImage.style.display = 'none';
    }

    // Очищаем старые кнопки
    choicesDiv.innerHTML = '';

    // Создаем новые кнопки
    scene.choices.forEach(choice => {
        const button = document.createElement('button');
        button.innerText = choice.text;
        button.classList.add('choice-btn');
        
        button.addEventListener('click', () => {
            // Если это финальная сцена и есть действие confetti
            if (choice.action === 'confetti') {
                startConfetti();
                setTimeout(() => stopConfetti(), 3000); // Останавливаем через 3 секунды
            }

            // Если это вопрос и ответ правильный
            if (sceneId.startsWith('question') && choice.isCorrect) {
                if (!answeredQuestions.includes(sceneId)) {
                    answeredQuestions.push(sceneId);
                }
                
                // Проверяем, все ли вопросы отвечены
                if (allQuestionsAnswered()) {
                    renderScene('final');
                } else {
                    // Переходим к следующему неотвеченному вопросу
                    const nextQuestion = getNextUnansweredQuestion();
                    if (nextQuestion) {
                        renderScene(nextQuestion);
                    }
                }
            }
            // Если ответ неправильный
            else if (sceneId.startsWith('question') && choice.isCorrect === false) {
                renderScene(choice.nextScene);
            }
            // Для всех остальных случаев (начало, wrong сцены, финал)
            else {
                if (choice.nextScene === 'start') {
                    resetGame();
                }
                renderScene(choice.nextScene);
            }
        });
        
        choicesDiv.appendChild(button);
    });
}

// Анимация конфетти
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];
let animationId = null;

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height - height;
        this.size = Math.random() * 10 + 5;
        this.speedY = Math.random() * 5 + 3;
        this.speedX = Math.random() * 2 - 1;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 2 - 1;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;

        if (this.y > height + 20) {
            this.y = -20;
            this.x = Math.random() * width;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

function startConfetti() {
    if (animationId) return;
    
    particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
}

function stopConfetti() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
        ctx.clearRect(0, 0, width, height);
    }
}

// Запуск игры при загрузке страницы
window.onload = function() {
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const startBtn = document.getElementById('start-game-btn');
    
    startBtn.addEventListener('click', () => {
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        resetGame();
        renderScene('start');
    });
    
    // Предзагрузка фонового изображения (если нужно)
    const backgroundImage = new Image();
    backgroundImage.src = 'background.jpg';
};
// Регистрация Service Worker для PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('ServiceWorker зарегистрирован: ', registration.scope);
            })
            .catch(error => {
                console.log('Ошибка регистрации ServiceWorker: ', error);
            });
    });
}