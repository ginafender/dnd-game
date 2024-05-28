let correctGuesses = 0;
let incorrectGuesses = 0;
let right = 0;
let wrong = 0;
let skips = 0;
let totalQuestions = 0;
let maxQuestions = 11;
let askedQuestions = [];
let gameEnded = false;

async function fetchRandomSpell() {
    const response = await fetch('https://www.dnd5eapi.co/api/spells');
    const data = await response.json();
    const randomSpell = data.results[Math.floor(Math.random() * data.results.length)];
    const spellResponse = await fetch(`https://www.dnd5eapi.co${randomSpell.url}`);
    const spellData = await spellResponse.json();
    return spellData;
}

async function displaySpellDescription(spellData) {
    const spellDescription = spellData.desc[0];
    document.getElementById('spellDescription').innerText = spellDescription;
    localStorage.setItem('correctAnswer', spellData.name);

    // console.log('Data: ', spellDescription);
    console.log('Correct answer: ', spellData.name);
}

async function displayRandomQuestion() {
    totalQuestions++
    // console.log('Total Questions: ', totalQuestions);
    if (gameEnded || totalQuestions >= maxQuestions) {
        // console.log('Game ended or reached max questions');
        endGame(totalQuestions >= maxQuestions ? 'maxQuestions' : 'outOfHearts');
        return;
    }

    let questionData;
    let questionAlreadyAsked = true;

    while (questionAlreadyAsked) {
        questionData = await fetchRandomSpell();
        if (!askedQuestions.includes(questionData.name)) {
            questionAlreadyAsked = false;
            askedQuestions.push(questionData.name);
        }
    }

    await displaySpellDescription(questionData);
}

let remainingHearts = 3;
function updateHeartDisplay() {
    const heartImages = document.querySelectorAll('#heart1, #heart2, #heart3');
    heartImages.forEach((image, index) => {
        if (index < remainingHearts) {
            image.style.visibility = 'visible'; 
            // console.log(`Heart ${index + 1} displayed`);
        } else {
            image.style.visibility = 'hidden'; 
            // console.log(`Heart ${index + 1} hidden`);
        }
    });
}


function checkGuess() {
    const guessInput = document.getElementById('guessInput');
    const guess = guessInput.value.trim().toLowerCase().replace(/'/g, ''); 
    const correctAnswer = localStorage.getItem('correctAnswer').toLowerCase().replace(/'/g, '').trim();
    const correctMessage = document.getElementById('correctMessage');

    // console.log('Guess:', guess);
    // console.log('Correct Answer:', correctAnswer);
    // console.log('Remaining Hearts: ', remainingHearts);

    if (guess === correctAnswer) {
        correctGuesses++;
        right++
        correctMessage.style.display = 'block';
        // console.log('Correct count: ', correctGuesses);
        setTimeout(() => {
            moveToNextQuestion();
        }, 1500); 
        
        if (remainingHearts < 3) {
            remainingHearts++;
            correctGuesses = 0;
            updateHeartDisplay(); 
        }
    } else {
        incorrectGuesses++;
        correctGuesses = 0;
        wrong++;
        // console.log('Wrong count: ', incorrectGuesses);
        guessInput.classList.add('flash-jiggle')
        setTimeout(() => {
            guessInput.classList.remove('flash-jiggle'); 
        }, 500); 

        if (remainingHearts > 0) {
            remainingHearts--;
            // console.log('Updated remainingHearts:', remainingHearts);
            updateHeartDisplay();
        }

        if (remainingHearts === 0 ) {
            endGame('outOfHearts');
        }
    }
}

function endGame(reason) {
    // console.log('Right count: ', right);

    gameEnded = true;
    setTimeout(() => {
        document.querySelector('.spellGuesser h2').style.display = 'none';
        document.getElementById('spellDescription').style.display = 'none';
        document.getElementById('endgameContainer').style.display = 'block';
    }, 1500);


    console.log('Reason for game ending: ', reason);
    if (reason === 'outOfHearts') {
        document.getElementById('died').style.display ='block';
        document.getElementById('scoreNine').style.display ='block'; 
    } else {
        console.log('Displaying maxQuestions message');
        document.getElementById('maxq').style.display ='block';
        if (right === 10) {
            document.getElementById('scoreTwenty-six').style.display = 'block';
        }
    }
    if (right === 9) {
        document.getElementById('scoreTwenty').style.display = 'block';
    } else if (right === 8) {
        document.getElementById('scoreEighteen').style.display = 'block';
    } else if (right === 7) {
        document.getElementById('scoreSixteen').style.display = 'block';
    } else if (right === 6) {
        document.getElementById('scoreFourteen').style.display = 'block';
    } else if (right === 5) {
        document.getElementById('scoreTwelve').style.display = 'block';
    } else if (right === 4) {
        document.getElementById('scoreTen').style.display = 'block';
    }
}


const skipButton = document.getElementById('skipButton');
skipButton.addEventListener('click', function() {
    if (!gameEnded) {
        skips++;
        checkGuess(); 
        const displayAnswer = document.getElementById('displayAnswer');
        const correctAnswer = localStorage.getItem('correctAnswer');
        displayAnswer.innerText = correctAnswer;
        displayAnswer.style.display = 'block';

        // Disable the skip button
        skipButton.disabled = true;

        setTimeout(() => {
            moveToNextQuestion(); 
            skipButton.disabled = false;
        }, 1500);
    }
});


function moveToNextQuestion() {
    const correctMessage = document.querySelector('.spellGuesser h3');
    correctMessage.style.display = 'none';

    const guessInput = document.getElementById('guessInput');
    guessInput.value = ''; 

    const spellDescription = document.getElementById('spellDescription');
    spellDescription.innerText = '';
    spellDescription.style.display = 'block';

    document.getElementById('displayAnswer').style.display = 'none';

    displayRandomQuestion();

    guessInput.focus();
}

document.addEventListener('DOMContentLoaded', function() {
    // console.log('Max Questions:', maxQuestions); 
    displayRandomQuestion();
    updateHeartDisplay();
    document.getElementById('guessInput').focus();
});

document.addEventListener('DOMContentLoaded', function() {
    // console.log('Max Questions:', maxQuestions); 
    displayRandomQuestion();
    updateHeartDisplay();
});

// BUTTONS
var aboutBtn = document.getElementById("aboutBtn");
var settingsBtn = document.getElementById("settingsBtn");
var htpBtn = document.getElementById("htpBtn");

var aboutPopup = document.getElementById("aboutPopup");
var settingsPopup = document.getElementById("settingsPopup");
var htpPopup = document.getElementById("htpPopup");

var closeBtns = document.querySelectorAll(".close");

function togglePopup(popup) {
    popup.classList.toggle("show");
}

aboutBtn.addEventListener("click", function() {
    togglePopup(aboutPopup);
});

htpBtn.addEventListener("click", function() {
    togglePopup(htpPopup);
});

closeBtns.forEach(function(btn) {
    btn.addEventListener("click", function() {
        var popup = btn.parentElement.parentElement;
        togglePopup(popup);
    });
});