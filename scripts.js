let correctGuesses = 0;
let incorrectGuesses = 0;
let totalQuestions = 0;
let maxQuestions = 6;
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
        console.log('Game ended or reached max questions');
        return; // Do nothing if the game has ended
    }

    const questionData = await fetchRandomSpell();
    await displaySpellDescription(questionData);
}


let remainingHearts = 3; // Initialize with the maximum number of hearts

function checkGuess() {
    const guessInput = document.getElementById('guessInput');
    const guess = guessInput.value.trim().toLowerCase().replace(/'/g, ''); 
    const correctAnswer = localStorage.getItem('correctAnswer').toLowerCase().replace(/'/g, '').trim();
    const heartImages = document.querySelectorAll('#heart1, #heart2, #heart3');

    console.log('Guess:', guess);
    console.log('Correct Answer:', correctAnswer);

    if (guess === correctAnswer) {
        correctGuesses++;
        console.log('Correct count: ', correctGuesses);
        document.getElementById('spellDescription').style.display = 'none'; // Hide the question
        moveToNextQuestion();
        // If the player has at least 1 heart, continue playing
        if (remainingHearts < 3) {
            remainingHearts++; // Increment the remaining hearts count
            // Update the display of heart images
            heartImages[remainingHearts - 1].style.display = 'block';
        }
    } else {
        incorrectGuesses++;
        console.log('Wrong count: ', incorrectGuesses);
        guessInput.classList.add('flash-jiggle'); // Add class to trigger flash and jiggle animations
        setTimeout(() => {
            guessInput.classList.remove('flash-jiggle'); // Remove class after animation completes
        }, 500); 

        // If the player has at least 1 heart, then remove one heart
        if (remainingHearts > 0) {
            remainingHearts--;
            heartImages[remainingHearts].style.display = 'none'; 
        }

        if (remainingHearts === 0 ) {
            endGame('outOfHearts');
        }
    }
}



// Function to end the game
function endGame(reason) {
    gameEnded = true;
    document.querySelector('.spellGuesser h2').style.display = 'none';
    document.getElementById('spellDescription').style.display = 'none';
    document.getElementById('endgameContainer').style.display = 'block';

    // Check the reason for ending the game and display appropriate message
    console.log('Reason for game ending: ', reason);
    if (reason === 'outOfHearts') {
        // Display message for losing due to running out of hearts
        document.getElementById('died').style.display ='block';
    } else {
        // Display message for reaching the maximum number of questions
        console.log('Displaying maxQuestions message');
        document.getElementById('maxq').style.display ='block';
    }
}


// Listen for click event on the Skip button
document.getElementById('skipButton').addEventListener('click', function() {
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
    console.log('Max Questions:', maxQuestions); 
    displayRandomQuestion();
});