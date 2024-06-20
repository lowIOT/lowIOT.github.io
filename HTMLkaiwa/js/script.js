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
    const feedback = document.getElementById('feedback');
    const finalScore = document.getElementById('finalScore');
    const endMessage = document.getElementById('endMessage');
    const endImage = document.getElementById('endImage');

    let score = 0;
    let attempts = 0;
    const maxAttempts = 10;
    let selectedCharacter = 1;
    let usedDialogues = [];

    const characterData = {
        1: {
            dialogues: [
                "今日は何をして過ごした？",
                "どんな食べ物が好き？",
                "どこか行きたい場所はある？",
                "趣味は何？",
                "動物は好き？",
                "好きな季節は？",
                "好きな色は？",
                "スポーツはする？",
                "旅行は好き？",
                "どんな音楽が好き？"
            ],
            choices: [
                ["読書をしてたよ。", "友達と遊んでたよ。", "特に何も。"],
                ["寿司が大好きだよ。", "ラーメンが好きかな。", "野菜はあまり好きじゃない。"],
                ["海に行きたいな。", "山に行こうかな。", "家にいたい。"],
                ["音楽を聴くことかな。", "映画を見ること。", "特にない。"],
                ["大好きだよ！", "まあまあ好きかな。", "あまり好きじゃない。"],
                ["春が好きだな。", "秋がいいね。", "冬は嫌いだ。"],
                ["青が好きだよ。", "緑もいいね。", "特にないかな。"],
                ["サッカーが好きだ。", "たまにバスケットをする。", "運動はあまりしない。"],
                ["旅行は大好きだ！", "たまにはいいね。", "あまり好きじゃない。"],
                ["ポップスが好きだよ。", "クラシックもいいね。", "音楽はあまり聴かない。"]
            ],
            images: {
                neutral: "images/character1_neutral.png",
                happy: "images/character1_happy.png",
                veryHappy: "images/character1_very_happy.png",
                negative: "images/character1_negative.png"
            },
            reward: "images/reward1.png"
        },
        2: {
            dialogues: [
                "おい、お前何見てんだよ！",
                "まあ、少しは話してやってもいいけど。",
                "ふん、一緒にいるのも悪くないかもな。",
                "お前って意外と面白いな。",
                "お前と話すのは楽しいな！",
                "どうしてそんなに興味を持ってるんだ？",
                "お前の好きなものって何だ？",
                "一緒に遊びに行かないか？",
                "もっとお前のことを知りたいんだが。",
                "お前といるとなんか安心するな。"
            ],
            choices: [
                ["見てるだけだよ。", "まあまあかな。", "何も見てないよ。"],
                ["そうだね！", "まあ、そうかもね。", "いや、違うよ。"],
                ["君って面白いね！", "まあまあかな。", "全然だめだね。"],
                ["一緒にいると楽しい！", "うん、まあね。", "そんなことないよ。"],
                ["また会いたいな！", "機会があればね。", "もういいかな。"],
                ["それが知りたいんだ。", "特に理由はない。", "別に興味はないよ。"],
                ["ゲームかな。", "アニメだね。", "特にないな。"],
                ["いいね、行こう！", "また今度ね。", "今日はやめとくよ。"],
                ["君のことも知りたいな。", "それは秘密だよ。", "あまり話したくないな。"],
                ["僕もそう感じるよ。", "そうか？", "それは嬉しいな。"]
            ],
            images: {
                neutral: "images/character2_neutral.png",
                happy: "images/character2_happy.png",
                veryHappy: "images/character2_very_happy.png",
                negative: "images/character2_negative.png"
            },
            reward: "images/reward2.png"
        },
        3: {
            dialogues: [
                "こんにちは、ごきげんよう。",
                "もう少しお話しできますか？",
                "あなたと過ごす時間がとても楽しいですわ。",
                "あなたのお話、とても興味深いですわ。",
                "あなたと話していると、とても楽しいですわ！",
                "今日は何をされていましたか？",
                "お好きな食べ物は何ですか？",
                "どこか行きたい場所はありますか？",
                "趣味は何ですか？",
                "動物はお好きですか？"
            ],
            choices: [
                ["ごきげんよう。", "そうですね。", "さようなら。"],
                ["もちろんです！", "まあ、少しなら。", "すみません、忙しいです。"],
                ["私も楽しいです。", "そうですね。", "それはどうでしょうか。"],
                ["ありがとうございます！", "まあまあですね。", "そうでもないです。"],
                ["私もです！", "そうですね。", "それはないです。"],
                ["仕事をしていました。", "読書をしていました。", "何もしていません。"],
                ["寿司が好きです。", "ラーメンが好きです。", "特にありません。"],
                ["海に行きたいです。", "山に行きたいです。", "家にいたいです。"],
                ["音楽鑑賞です。", "映画鑑賞です。", "特にありません。"],
                ["大好きです！", "まあまあ好きです。", "あまり好きではありません。"]
            ],
            images: {
                neutral: "images/character3_neutral.png",
                happy: "images/character3_happy.png",
                veryHappy: "images/character3_very_happy.png",
                negative: "images/character3_negative.png"
            },
            reward: "images/reward3.png"
        }
    };

    characterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            selectedCharacter = parseInt(e.currentTarget.getAttribute('data-character'));
            startScreen.style.display = 'none';
            gameScreen.style.display = 'block';
            score = 0;
            attempts = 0;
            usedDialogues = [];
            characterImage.src = characterData[selectedCharacter].images.neutral;
            updateGame();
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
            score = Math.max(0, score + points); // Ensure score doesn't go below 0
            feedback.textContent = points > 0 ? `好感度が${points}上がった！` : points < 0 ? `好感度が${Math.abs(points)}下がった。` : '好感度は変わらなかった。';
            feedback.style.display = 'block';
            setTimeout(() => {
                feedback.style.display = 'none';
                attempts++;
                if (attempts >= maxAttempts) {
                    endGame();
                } else {
                    updateGame(points);
                }
            }, 2000);
        });
    });

    function updateGame(points = 0) {
        const data = characterData[selectedCharacter];
        let dialogueIndex;
        do {
            dialogueIndex = Math.floor(Math.random() * data.dialogues.length);
        } while (usedDialogues.includes(dialogueIndex) && usedDialogues.length < data.dialogues.length);

        usedDialogues.push(dialogueIndex);
        dialogue.textContent = data.dialogues[dialogueIndex];
        
        let imageKey;
        if (points > 0) {
            imageKey = score > 10 ? 'veryHappy' : 'happy';
        } else if (points < 0) {
            imageKey = 'negative';
        } else {
            imageKey = score > 10 ? 'veryHappy' : score > 6 ? 'happy' : 'neutral';
        }

        characterImage.src = data.images[imageKey];
        updateChoices(data.choices[dialogueIndex]);
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
        if (score >= 10) {
            endImage.src = characterData[selectedCharacter].reward;
            endMessage.textContent = 'ご褒美画像';
        } else if (score > 6 && score <= 9) {
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
});
