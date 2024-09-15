console.log('hello world from game!');
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
console.log(choices);
const progresstext = document.getElementById('progresstext');
const scoretext = document.getElementById('score');
const progressbarfull = document.getElementById('progressbarfull');
const loader = document.getElementById('loader')
const game = document.getElementById('game')
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];
fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple").then(res => {
    return res.json();
}).then(loadedquestion => {
    console.log(loadedquestion.results);
    questions = loadedquestion.results.map(loadedquestion => {
        const formattedquestion = {
            question: loadedquestion.question
        };
        const answerchoice = [...loadedquestion.incorrect_answers];
        formattedquestion.answer = Math.floor(Math.random() * 3) + 1;
        answerchoice.splice(formattedquestion.answer - 1, 0, loadedquestion.correct_answer);
        answerchoice.forEach((choice, index) => {
            formattedquestion["choice" + (index + 1)] = choice;
        })
        return formattedquestion;
    });
    //questions=loadedquestion;

    startGame();

}).catch(err => {
    console.log(err);

})
// Constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden")
};

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        console.log('Final score:', score);
        localStorage.setItem('mostrecentscore', score)
        return window.location.assign("/end.html");
    }

    questionCounter++;
    progresstext.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;

    // Update the progress bar width
    progressbarfull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset.number;
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classtoapply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
        console.log(classtoapply);

        if (classtoapply == 'correct') {
            incrementScore(CORRECT_BONUS);
        }
        // Add class to the selected choice (for feedback)
        selectedChoice.parentElement.classList.add(classtoapply);

        // Delay for showing the result, then move to the next question
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classtoapply);
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = num => {
    score += num;
    console.log("Score after increment:", score);
    scoretext.innerText = score;
};



