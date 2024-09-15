const SaveScoreButton = document.getElementById('saveScoreButtoon');
const finalscore = document.getElementById('finalscore');

const mostrecentscore = localStorage.getItem('mostrecentscore');
const username = document.getElementById('username');

const highscores = JSON.parse(localStorage.getItem("highscores")) || [];
console.log(highscores);  // Corrected

const max_high_scores = 5;

finalscore.innerText = mostrecentscore;

username.addEventListener('keyup', () => {
    console.log(username.value);
    SaveScoreButton.disabled = !username.value;
});

saveHighScore = e => {
    console.log("clicked the save button");
    e.preventDefault();
    
    const score = {
        score: Math.floor(Math.random() * 100),
        name: username.value
    };
    
    highscores.push(score);
    highscores.sort((a, b) => b.score - a.score);
    
    highscores.splice(max_high_scores);  // Keep only top 5 scores
    
    localStorage.setItem('highscores', JSON.stringify(highscores));
    // console.log(highscores);
    window.location.assign("/");
};
