// ====================================================================
// ЧАСТЬ 1 ИЗ 4: ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ, ФИЗИКА И ИНИЦИАЛИЗАЦИЯ ИНТЕРФЕЙСА
// ====================================================================

const openBtn = document.getElementById('openConsoleBtn');
const consoleWidget = document.getElementById('consoleWidget');
const consoleInput = document.getElementById('consoleInput');
const consoleOutput = document.getElementById('consoleOutput');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusIndicator = document.getElementById('statusIndicator');
const scoreVal = document.getElementById('scoreVal');

const variables = {};
let engineActive = false;
let drawCubeSetting = false;
let drawSpikeSetting = false;
let gameInterval = null;

let score = 0;
const player = {
    x: 100,
    y: 150,
    w: 40,
    h: 40,
    vy: 0,
    gravity: 0.6,
    jumpForce: -11,
    isGrounded: false,
    rotation: 0
};

let spikes = [];
const floorY = 200;

openBtn.addEventListener('click', () => {
    let isOpen = consoleWidget.style.display === 'block';
    consoleWidget.style.display = isOpen ? 'none' : 'block';
    openBtn.textContent = isOpen ? 'Открыть консоль' : 'Закрыть консоль';
    if (!isOpen) {
        consoleInput.focus();
        if (engineActive) startLoop();
    } else {
        stopLoop();
    }
});

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && engineActive && player.isGrounded) {
        e.preventDefault();
        player.vy = player.jumpForce;
        player.isGrounded = false;
        statusIndicator.textContent = "JUMPING";
        statusIndicator.style.color = "#ffb86c";
    }
});

function startLoop() {
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(updatePhysicsAndGraphics, 1000 / 60);
}

function stopLoop() {
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }
}

function resetGameData() {
    score = 0;
    scoreVal.textContent = "0";
    player.y = floorY - player.h;
    player.vy = 0;
    player.isGrounded = true;
    player.rotation = 0;
    spikes = [];
}
// ====================================================================
// ЧАСТЬ 2 ИЗ 4: БАЗА ЗНАНИЙ ЧАТ-БОТА АКАДЕМИИ (12 ГЛАВ ОБУЧЕНИЯ)
// ====================================================================

const lessons = {
    'help': "====================================================================\n" +
            "[Бот-Урок]: Привет! Я твой персональный чат бот-Урок!\n" +
            "Я не умею отвечать на личные вопросы как «привет» , «как дела» и тд.\n" +
            "Если хочешь узнать про язык HX HulicXous и как на нем писать, то\n" +
            "вводи команду: helpstr2\n" +
            "====================================================================",
            
    'helpstr2': "📘 ГЛАВА 2: ВЫВОД ДАННЫХ И КОНСОЛЬ\n" +
                "Основная функция для печати сообщений на экране: prit-()\n" +
                "Попробуй выполнить команду: prit-(\"Привет от HulicXous!\")\n" +
                "Чтобы перейти к следующей главе, введи: helpstr3",
                
    'helpstr3': "📘 ГЛАВА 3: СОЗДАНИЕ ПЕРЕМЕННЫХ\n" +
                "Переменные объявляются с помощью ключевого слова set и оператора ==\n" +
                "Синтаксис: set имя == \"значение\"\n" +
                "Пример: set username == \"Кирилл\"\n" +
                "Переходи дальше, пиши: helpstr4",
                
    'helpstr4': "📘 ГЛАВА 4: ЧТЕНИЕ ИЗ ПАМЯТИ\n" +
                "Для вывода ранее сохраненной переменной используется двойная скобка: prit-(имя))\n" +
                "Вызови быструю демонстрационную команду: shablon_1\n" +
                "Для изучения игровой графики переходи к команде: helpstr5",
                
    'helpstr5': "🎮 ГЛАВА 5: ПОДКЛЮЧЕНИЕ ДВИЖКА (GD ENGINE)\n" +
                "Наш язык умеет создавать игры прямо в терминале!\n" +
                "Команда ippt hxplayegon активирует графический видео-адаптер.\n" +
                "Попробуй написать её или переходи дальше к команде: helpstr6",
                
    'helpstr6': "🎮 ГЛАВА 6: ГЕНЕРАЦИЯ ПЕРСОНАЖА (КУБ)\n" +
                "Вывести кубического игрока на цену можно специальной системной функцией:\n" +
                "hxxplayeron.sxx.reps(((sxx,screin ((255,255,255)), (((100, 200, 50, 50)))))\n" +
                "Она скомпилирует модельку. Переходи к команде: helpstr7",
                
    'helpstr7': "🎮 ГЛАВА 7: СОЗДАНИЕ ПРЕПЯТСТВИЙ (ШИПЫ)\n" +
                "Для спавна опасного треугольного шипа используется команда:\n" +
                "hxxplayeron.drf,playegon(hxxpl,scps\n" +
                "Чтобы запустить готовую сборку игры, введи шаблон: shablon_2\n" +
                "Для перехода к управляющей логике пиши: helpstr8",
                
    'helpstr8': "📘 ГЛАВА 8: УСЛОВНЫЕ ОПЕРАТОРЫ\n" +
                "Вместо привычного if/else у нас работают слова check и oth.\n" +
                "Синтаксис: check условие [[ код ]] oth [[ код ]]\n" +
                "Границы блоков закрываются символами ]]. Переходи к: helpstr9",
                
    'helpstr9': "📘 ГЛАВА 9: ЦИКЛЫ И ПОВТОРЕНИЯ\n" +
                "Запустить многократное выполнение кода можно через fer on.\n" +
                "Синтаксис: fer on 10 [[ код ]]\n" +
                "Внутри цикла работает встроенный счетчик итераций с именем id. Пиши: helpstr10",
                
    'helpstr10': "📘 ГЛАВА 10: СИСТЕМА ПРЕРЫВАНИЙ\n" +
                 "Если вам необходимо досрочно остановить работу цикла при выполнении условия,\n" +
                 "используйте специальное ломающее слово: brush (аналог break).\n" +
                 "Идем дальше, пиши: helpstr11",
                 
    'helpstr11': "📘 ГЛАВА 11: АРХИТЕКТУРА ФУНКЦИЙ\n" +
                 "Собственные функции создаются словом cup (чашка), а возврат значения — rutt.\n" +
                 "Пример: cup my_func() [[ rutt 100 ]]\n" +
                 "Мы выходим на финишную прямую! Вводи: helpstr12",
                 
    'helpstr12': "🚀 ГЛАВА 12: ИСКЛЮЧЕНИЯ И СБОИ\n" +
                 "Защита кода от падений реализуется конструкцией pai и and(OHB) (try/except).\n" +
                 "Синтаксис: pai [[ опасный_код ]] and(OHB) [[ логика_ошибки ]]\n" +
                 "Поздравляем! Ты полностью изучил спецификацию среды разработки HX HulicXous!"
};
// ====================================================================
// ЧАСТЬ 3 ИЗ 4: ГРАФИЧЕСКОЕ ЯДРО И ОТРИСОВКА ИГРЫ (GEOMETRY DASH)
// ====================================================================

function updatePhysicsAndGraphics() {
    // 1. Очистка экрана (неоновый киберпанк стиль)
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Отрисовка линии горизонта (земли)
    ctx.strokeStyle = '#6272a4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.lineTo(canvas.width, floorY);
    ctx.stroke();

    if (!engineActive) return;

    // 3. Расчет гравитации и прыжка игрока
    player.vy += player.gravity;
    player.y += player.vy;

    if (player.y >= floorY - player.h) {
        player.y = floorY - player.h;
        player.vy = 0;
        player.isGrounded = true;
        player.rotation = 0; 
        statusIndicator.textContent = "RUNNING";
        statusIndicator.style.color = "#50fa7b";
    }

    // 4. Отрисовка куба с вращением во время прыжка
    if (drawCubeSetting) {
        ctx.save();
        ctx.translate(player.x + player.w / 2, player.y + player.h / 2);
        if (!player.isGrounded) {
            player.rotation += 0.07;
            ctx.rotate(player.rotation);
        }
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#50fa7b';
        ctx.shadowBlur = 12;
        ctx.fillRect(-player.w / 2, -player.h / 2, player.w, player.h);
        ctx.restore();
    }

    // 5. Автоматическая генерация и движение шипов
    if (drawSpikeSetting) {
        if (spikes.length === 0 || spikes[spikes.length - 1].x < canvas.width - 240) {
            if (Math.random() < 0.015) {
                spikes.push({ x: canvas.width, y: floorY, w: 30, h: 40 });
            }
        }
    }

    // Движение шипов, отрисовка и проверка столкновений
    for (let i = spikes.length - 1; i >= 0; i--) {
        let s = spikes[i];
        s.x -= 4.5; // Скорость движения локации

        // Рисуем красный шип
        ctx.fillStyle = '#ff5555';
        ctx.shadowColor = '#ff5555';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + s.w / 2, s.y - s.h);
        ctx.lineTo(s.x + s.w, s.y);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;

        // Проверка коллизии куба с шипом
        if (player.x < s.x + s.w &&
            player.x + player.w > s.x &&
            player.y + player.h > s.y - s.h) {
            
            // Столкновение! Game Over
            statusIndicator.textContent = "CRASH DETECTED";
            statusIndicator.style.color = "#ff5555";
            consoleOutput.textContent += "\n[Движок]: БУМ! Столкновение с препятствием. Игра перезапущена!\n";
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
            resetGameData();
            break;
        }

        // Подсчет очков за успешное преодоление
        if (s.x + s.w < player.x && !s.passed) {
            s.passed = true;
            score += 10;
            scoreVal.textContent = score;
        }

        // Удаление улетевших за экран шипов
        if (s.x + s.w < 0) {
            spikes.splice(i, 1);
        }
    }
}
// ====================================================================
// ЧАСТЬ 4 ИЗ 4: ИНТЕРПРЕТАТОР ЯЗЫКА HX, ШАБЛОНЫ И ОБРАБОТКА ВВОДА
// ====================================================================

// Парсинг базовых строковых команд интерпретатора HX
function executeSingleLine(line) {
    line = line.trim();
    if (!line) return "";

    // Обработка присвоения переменной set X == Y
    if (line.startsWith('set ')) {
        const expr = line.substring(4).split('==');
        if (expr.length === 2) {
            const varName = expr[0].trim();
            let varVal = expr[1].trim();
            if (varVal.startsWith('"') || varVal.startsWith('\'') || varVal.startsWith('«') || varVal.startsWith('“')) {
                varVal = varVal.substring(1, varVal.length - 1);
            }
            variables[varName] = varVal;
            return `[Система]: Переменная "${varName}" сохранена в ядро.`;
        }
        return "Ошибка синтаксиса: Используйте 'set имя == значение'";
    }

    // Обработка печати данных prit-()
    if (line.startsWith('prit-(')) {
        let inside = line.substring(6);
        if (inside.endsWith('))')) inside = inside.substring(0, inside.length - 2);
        else if (inside.endsWith(')')) inside = inside.substring(0, inside.length - 1);
        inside = inside.trim();

        if (inside.startsWith('"') || inside.startsWith('\'') || inside.startsWith('«') || inside.startsWith('“')) {
            return inside.substring(1, inside.length - 1);
        } else {
            if (variables.hasOwnProperty(inside)) return variables[inside];
            return `Ошибка: Ссылка на необъявленную переменную "${inside}"`;
        }
    }

    return null;
}

// Главная шина распределения команд терминала
consoleInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const inputCommand = consoleInput.value.trim();
        if (!inputCommand) return;

        // Эхо-вывод команды в консоль
        consoleOutput.textContent += `\nHX_CORE> ${inputCommand}`;
        let lower = inputCommand.toLowerCase();
        let logResponse = "";

        // Фильтрация личных сообщений бота
        if (['привет', 'как дела', 'ку', 'че делаешь', 'ты кто'].includes(lower)) {
            logResponse = "[Бот-Урок]: Ошибка! Я не умею отвечать на личные вопросы. Моя задача — обучать тебя коду. Напиши команду: help";
        }
        // Запрос к учебным материалам
        else if (lessons[lower]) {
            logResponse = lessons[lower];
        }
        // Вызов шаблона базовой логики
        else if (lower === 'shablon_1') {
            logResponse = "[Система]: Готовый шаблон загружен. Нажми ENTER.";
            consoleInput.value = 'set my_code == "Работает!"; prit-(my_code))';
            consoleOutput.textContent += `\n${logResponse}\n`;
            return;
        }
        // Вызов шаблона игры Geometry Dash
        else if (lower === 'shablon_2') {
            logResponse = "[Система]: Готовый игровой пакет инициализирован. Нажми ENTER для сборки.";
            consoleInput.value = 'ippt hxplayegon; hxxplayeron.sxx.reps(((sxx,screin ((255,255,255)), (((100, 200, 50, 50))))); hxxplayeron.drf,playegon(hxxpl,scps';
            consoleOutput.textContent += `\n${logResponse}\n`;
            return;
        }
        // Очистить рабочую область терминала
        else if (lower === 'очистить') {
            consoleOutput.textContent = 'Терминал очищен. Ядро HX готово к работе. Для вызова бота введите help.';
            canvas.style.display = 'none';
            document.getElementById('gameHud').style.display = 'none';
            engineActive = false;
            drawCubeSetting = false;
            drawSpikeSetting = false;
            stopLoop();
            resetGameData();
            consoleInput.value = '';
            return;
        }
        // Выполнение команд компиляции графики
        else if (inputCommand.includes('hxplayegon') || inputCommand.includes('hxxplayeron')) {
            let subCommands = inputCommand.split(';');
            let outputs = [];

            subCommands.forEach(sc => {
                let cmdClean = sc.trim();
                if (!cmdClean) return;

                if (cmdClean === 'ippt hxplayegon') {
                    engineActive = true;
                    canvas.style.display = 'block';
                    document.getElementById('gameHud').style.display = 'flex';
                    statusIndicator.textContent = "RUNNING";
                    startLoop();
                    resetGameData();
                    outputs.push("[Движок]: Графическое ядро hxplayegon подключено. Экран развернут.");
                } else if (cmdClean.includes('hxxplayeron.sxx.reps')) {
                    if (engineActive) {
                        drawCubeSetting = true;
                        outputs.push("[Графика]: Белый куб успешно отрисован на позиции (100, 150).");
                    } else {
                        outputs.push("Ошибка: Невозможно сгенерировать графику куба без ippt hxplayegon");
                    }
                } else if (cmdClean.includes('hxxplayeron.drf,playegon')) {
                    if (engineActive) {
                        drawSpikeSetting = true;
                        outputs.push("[Графика]: Спавнер опасных треугольных шипов переведен в режим ACTIVE.");
                    } else {
                        outputs.push("Ошибка: Невозможно сгенерировать графику шипа без ippt hxplayegon");
                    }
                } else {
                    let baseRes = executeSingleLine(cmdClean);
                    if (baseRes) outputs.push(baseRes);
                    else outputs.push(`Ошибка синтаксиса компилятора: неизвестная подкоманда "${cmdClean}"`);
                }
            });
            logResponse = outputs.join('\n');
        }
        // Выполнение стандартного текстового синтаксиса
        else {
            let results = [];
            let separated = inputCommand.split(';');
            separated.forEach(sCmd => {
                let lineRes = executeSingleLine(sCmd);
                if (lineRes) results.push(lineRes);
            });
            logResponse = results.length > 0 ? results.join('\n') : `Ошибка компиляции: выражение "${inputCommand}" не распознано. Наберите help для вызова справки.`;
        }

        // Вывод лога на экран, очистка строки и прокрутка
        consoleOutput.textContent += `\n${logResponse}\n`;
        consoleInput.value = '';
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }
});

// Первичный холостой рендеринг рамки до старта движка
updatePhysicsAndGraphics();
