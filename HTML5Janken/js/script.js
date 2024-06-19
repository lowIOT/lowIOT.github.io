const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const nextStageButton = document.getElementById('next-stage-button');
const playerOptions = document.querySelectorAll('.player-options button:not(#special-move)');
const specialMoveButton = document.getElementById('special-move');
const playerChoiceDiv = document.getElementById('player-choice');
const cpuChoiceDiv = document.getElementById('cpu-choice');
const resultText = document.getElementById('result-text');
const stageInfo = document.getElementById('stage-info');
const winCountText = document.getElementById('win-count');
const loseCountText = document.getElementById('lose-count');
const specialMoveCountText = document.getElementById('special-move-count');

const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const bonusScreen = document.getElementById('bonus-screen');
const bonusImage = document.getElementById('bonus-image');

const choices = ['グー', 'パー', 'チョキ'];
let cpuImages = ['1', '2', '3'];
let bonusImages = ['img/bonus1.png', 'img/bonus2.png', 'img/bonus3.png'];
let currentCpuImageIndex = 0;

let winCount = 0;
let loseCount = 0;
let stage = 1;
const totalStages = 5;
const winsPerStage = 3;
const maxLosses = 3;
let specialMoveStock = 0;
const maxSpecialMoveStock = 2;

startButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
});

restartButton.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    resetGame();
    gameScreen.classList.remove('hidden');
});

nextStageButton.addEventListener('click', () => {
    bonusScreen.classList.add('hidden');
    stage++;
    if (stage > totalStages) {
        alert('ゲームクリア！おめでとうございます！');
        location.reload();
    } else {
        stageInfo.textContent = `ステージ: ${stage}`;
        resetGame();
        gameScreen.classList.remove('hidden');
    }
});

playerOptions.forEach(option => {
    option.addEventListener('click', () => {
        const playerChoice = option.textContent;
        playRound(playerChoice);
    });
});

specialMoveButton.addEventListener('click', () => {
    if (specialMoveStock > 0) {
        playRound('パー'); // 必ず勝つ特別な手
        specialMoveStock--;
        updateSpecialMoveCount();
        if (specialMoveStock === 0) {
            specialMoveButton.classList.add('hidden');
        }
    }
});

function playRound(playerChoice) {
    const cpuChoice = getCpuChoice();

    playerChoiceDiv.textContent = playerChoice;
    cpuChoiceDiv.textContent = cpuChoice;

    const result = getResult(playerChoice, cpuChoice);
    resultText.textContent = result;

    if (result === '勝ちました！') {
        winCount++;
        updateCpuImage();
        if (winCount >= winsPerStage) {
            bonusScreen.classList.remove('hidden');
            bonusImage.src = bonusImages[stage - 1];
            gameScreen.classList.add('hidden');
        }
    } else if (result === '負けました。') {
        loseCount++;
        if (specialMoveStock < maxSpecialMoveStock) {
            specialMoveStock++;
            updateSpecialMoveCount();
            specialMoveButton.classList.remove('hidden');
        }
        if (loseCount >= maxLosses) {
            gameOverScreen.classList.remove('hidden');
            gameScreen.classList.add('hidden');
        }
    }

    winCountText.textContent = `勝利数: ${winCount}`;
    loseCountText.textContent = `敗北数: ${loseCount}`;
}

function getCpuChoice() {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

function getResult(player, cpu) {
    if (player === cpu) {
        return '引き分け！';
    }

    if (
        (player === 'グー' && cpu === 'チョキ') ||
        (player === 'パー' && cpu === 'グー') ||
        (player === 'チョキ' && cpu === 'パー')
    ) {
        return '勝ちました！';
    } else {
        return '負けました。';
    }
}

function updateCpuImage() {
    currentCpuImageIndex = (currentCpuImageIndex + 1) % cpuImages.length;
    cpuChoiceDiv.textContent = `CPU ${cpuImages[currentCpuImageIndex]}`;
}

function updateSpecialMoveCount() {
    specialMoveCountText.textContent = `特別な手ストック: ${specialMoveStock}`;
}

function resetGame() {
    winCount = 0;
    loseCount = 0;
    specialMoveStock = 0;
    winCountText.textContent = `勝利数: ${winCount}`;
    loseCountText.textContent = `敗北数: ${loseCount}`;
    specialMoveCountText.textContent = `特別な手ストック: ${specialMoveStock}`;
    resultText.textContent = '';
    playerChoiceDiv.textContent = '?';
    cpuChoiceDiv.textContent = '?';
    specialMoveButton.classList.add('hidden');
}
