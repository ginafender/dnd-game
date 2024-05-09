let correctGuesses = 0;
let incorrectGuesses = 0;
let right = 0;
let wrong = 0;
let skips = 0;
let totalQuestions = 0;
let maxQuestions = 11;
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
    console.log('Total Questions: ', totalQuestions);
    if (gameEnded || totalQuestions >= maxQuestions) {
        // console.log('Game ended or reached max questions');
        endGame(totalQuestions >= maxQuestions ? 'maxQuestions' : 'outOfHearts');
        return; // Do nothing if the game has ended
    }

    const questionData = await fetchRandomSpell();
    await displaySpellDescription(questionData);
}


let remainingHearts = 3; // Initialize with the maximum number of hearts

function updateHeartDisplay() {
    const heartImages = document.querySelectorAll('#heart1, #heart2, #heart3');
    heartImages.forEach((image, index) => {
        if (index < remainingHearts) {
            image.style.display = 'block'; 
            // console.log(`Heart ${index + 1} displayed`);
        } else {
            image.style.display = 'none'; 
            // console.log(`Heart ${index + 1} hidden`);
        }
    });
}



function checkGuess() {
    const guessInput = document.getElementById('guessInput');
    const guess = guessInput.value.trim().toLowerCase().replace(/'/g, ''); 
    const correctAnswer = localStorage.getItem('correctAnswer').toLowerCase().replace(/'/g, '').trim();

    // console.log('Guess:', guess);
    // console.log('Correct Answer:', correctAnswer);
    console.log('Remaining Hearts: ', remainingHearts);

    if (guess === correctAnswer) {
        correctGuesses++;
        right++
        // console.log('Correct count: ', correctGuesses);
        document.getElementById('spellDescription').style.display = 'none'; // Hide the question
        moveToNextQuestion();
        // If the player has at least 1 heart, continue playing
        if (remainingHearts < 3 && correctGuesses >= 2) {
            remainingHearts++; // Increment the remaining hearts count
            // Update the display of heart images
            correctGuesses = 0;
            updateHeartDisplay(); // Update heart display
        }
    } else {
        incorrectGuesses++;
        correctGuesses = 0;
        wrong++;
        // console.log('Wrong count: ', incorrectGuesses);
        guessInput.classList.add('flash-jiggle'); // Add class to trigger flash and jiggle animations
        setTimeout(() => {
            guessInput.classList.remove('flash-jiggle'); // Remove class after animation completes
        }, 500); 

        // If the player has at least 1 heart, then remove one heart
        if (remainingHearts > 0) {
            remainingHearts--;
            console.log('Updated remainingHearts:', remainingHearts);
            updateHeartDisplay(); // Update heart display
        }

        if (remainingHearts === 0 ) {
            endGame('outOfHearts');
        }
    }
}





function endGame(reason) {
    console.log('Right count: ', right);

    gameEnded = true;
    document.querySelector('.spellGuesser h2').style.display = 'none';
    document.getElementById('spellDescription').style.display = 'none';
    document.getElementById('endgameContainer').style.display = 'block';

    console.log('Reason for game ending: ', reason);
    if (reason === 'outOfHearts') {
        document.getElementById('died').style.display ='block';
        document.getElementById('scoreNine').style.display ='block'; // Show scoreNine
    } else {
        console.log('Displaying maxQuestions message');
        document.getElementById('maxq').style.display ='block';
        if (right === 10) {
            document.getElementById('scoreTwenty-six').style.display = 'block';
        }
    }

    // Show the intelligence score message corresponding to the number of wrong guesses
    if (wrong === 1) {
        document.getElementById('scoreEighteen').style.display = 'block';
    } else if (wrong === 2) {
        document.getElementById('scoreSixteen').style.display = 'block';
    } else if (wrong === 3) {
        document.getElementById('scoreFourteen').style.display = 'block';
    } else if (wrong === 4) {
        document.getElementById('scoreTwelve').style.display = 'block';
    }
}





// Listen for click event on the Skip button
document.getElementById('skipButton').addEventListener('click', function() {
    skips++
    checkGuess(); // Check the guess (which will also handle heart removal)
    moveToNextQuestion(); // Move to the next question
});


function moveToNextQuestion() {
    // Hide the "Correct!" message
    const correctMessage = document.querySelector('.spellGuesser h3');
    correctMessage.style.display = 'none';

    // Clear the input field
    const guessInput = document.getElementById('guessInput');
    guessInput.value = ''; 

    // Clear any previous question descriptions
    const spellDescription = document.getElementById('spellDescription');
    spellDescription.innerText = '';
    spellDescription.style.display = 'block';

    // Display a random question from the next question type
    displayRandomQuestion();
}


// Listen for "keypress" event on the input element
document.getElementById('guessInput').addEventListener('keypress', function(event) {
    // Check if Enter key is pressed
    if (event.key === 'Enter' && this.value.trim() !== '') {
        checkGuess(); 
    }
});

// Call displayRandomQuestion when the page loads
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

// settingsBtn.addEventListener("click", function() {
//     togglePopup(settingsPopup);
// });

htpBtn.addEventListener("click", function() {
    togglePopup(htpPopup);
});

closeBtns.forEach(function(btn) {
    btn.addEventListener("click", function() {
        var popup = btn.parentElement.parentElement;
        togglePopup(popup);
    });
});