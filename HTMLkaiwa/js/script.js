document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('startScreen');
    const gameScreen = document.getElementById('gameScreen');
    const endScreen = document.getElementById('endScreen');
    const characterButtons = document.querySelectorAll('.character-button');
    const endButton = document.getElementById('endButton');
    const restartButton = document.getElementById('restartButton');
    const choiceButtons = document.querySelectorAll('.choice-button');
    const characterImage = document.getElementById('characterImage');
    const dialogue = document.getElementById('dialogue');
    const finalScore = document.getElementById('finalScore');
    const endMessage = document.getElementById('endMessage');
    const endImage = document.getElementById('endImage');

    let score = 0;
    let attempts = 0;
    const maxAttempts = 10;
    let selectedCharacter = 1;

    const characterData = {
        1: {
            dialogues: [
                "こんにちは、どうぞよろしくね！",
                "もっとお話ししたいな。",
                "君と一緒にいると楽しいね！",
                "君と話すのが本当に楽しいよ！",
                "こんなに楽しいのは久しぶりだよ！"
            ],
            choices: [
                ["選択肢1-1", "選択肢1-2", "選択肢1-3"],
                ["選択肢2-1", "選択肢2-2", "選択肢2-3"],
                ["選択肢3-1", "選択肢3-2", "選択肢3-3"],
                ["選択肢4-1", "選択肢4-2", "選択肢4-3"],
                ["選択肢5-1", "選択肢5-2", "選択肢5-3"]
            ],
            images: [
                "images/character1_neutral.png",
                "images/character1_happy.png",
                "images/character1_very_happy.png"
            ]
        },
        2: {
            dialogues: [
                "おい、お前何見てんだよ！",
                "まあ、少しは話してやってもいいけど。",
                "ふん、一緒にいるのも悪くないかもな。",
                "お前って意外と面白いな。",
                "お前と話すのは楽しいな！"
            ],
            choices: [
                ["選択肢1-1", "選択肢1-2", "選択肢1-3"],
                ["選択肢2-1", "選択肢2-2", "選択肢2-3"],
                ["選択肢3-1", "選択肢3-2", "選択肢3-3"],
                ["選択肢4-1", "選択肢4-2", "選択肢4-3"],
                ["選択肢5-1", "選択肢5-2", "選択肢5-3"]
            ],
            images: [
                "images/character2_neutral.png",
                "images/character2_happy.png",
                "images/character2_very_happy.png"
            ]
        },
        3: {
            dialogues: [
                "こんにちは、ごきげんよう。",
                "もう少しお話しできますか？",
                "あなたと過ごす時間がとても楽しいですわ。",
                "あなたのお話、とても興味深いですわ。",
                "あなたと話していると、とても楽しいですわ！"
            ],
            choices: [
                ["選択肢1-1", "選択肢1-2", "選択肢1-3"],
                ["選択肢2-1", "選択肢2-2", "選択肢2-3"],
                ["選択肢3-1", "選択肢3-2", "選択肢3-3"],
                ["選択肢4-1", "選択肢4-2", "選択肢4-3"],
                ["選択肢5-1", "選択肢5-2", "選択肢5-3"]
            ],
            images: [
                "images/character3_neutral.png",
                "images/character3_happy.png",
                "images/character3_very_happy.png"
            ]
        }
    };

    characterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            selectedCharacter = parseInt(e.currentTarget.getAttribute('data-character'));
            startScreen.style.display = 'none';
            gameScreen.style.display = 'block';
            score = 0;
            attempts = 0;
            updateGame();
            randomizeChoices();
        });
    });

    endButton.addEventListener('click', () => {
        endGame();
    });

    restartButton.addEventListener('click', () => {
        endScreen.style.display = 'none';
        startScreen.style.display = 'block';
    });

    choiceButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const points = parseInt(e.target.getAttribute('data-points'));
            score = Math.min(10, score + points);
            attempts++;
            if (score >= 10) {
                showReward();
            } else if (attempts >= maxAttempts) {
                endGame();
            } else {
                updateGame();
                randomizeChoices();
            }
        });
    });

    function updateGame() {
        const data = characterData[selectedCharacter];
        const dialogueIndex = Math.min(Math.floor(score / 2), data.dialogues.length - 1);
        dialogue.textContent = data.dialogues[dialogueIndex];
        characterImage.src = data.images[Math.min(Math.floor(score / 4), data.images.length - 1)];
        updateChoices(data.choices[dialogueIndex]);
    }

    function randomizeChoices() {
        const choicePoints = [2, 0, -1];
        const shuffledPoints = choicePoints.sort(() => Math.random() - 0.5);
        choiceButtons.forEach((button, index) => {
            button.setAttribute('data-points', shuffledPoints[index]);
        });
    }

    function updateChoices(choices) {
        choiceButtons.forEach((button, index) => {
            button.textContent = choices[index];
        });
    }

    function endGame() {
        gameScreen.style.display = 'none';
        endScreen.style.display = 'block';
        finalScore.textContent = `最終好感度: ${score}`;
        if (score > 6 && score <= 9) {
            endImage.src = 'images/gameover_A.png';
            endMessage.textContent = 'ゲームオーバーA';
        } else if (score > 3 && score <= 6) {
            endImage.src = 'images/gameover_B.png';
            endMessage.textContent = 'ゲームオーバーB';
        } else {
            endImage.src = 'images/gameover_C.png';
            endMessage.textContent = 'ゲームオーバーC';
        }
    }

    function showReward() {
        gameScreen.style.display = 'none';
        endScreen.style.display = 'block';
        finalScore.textContent = `最終好感度: ${score}`;
        endImage.src = 'images/reward.png';
        endMessage.textContent = 'ご褒美画像';
    }
});
