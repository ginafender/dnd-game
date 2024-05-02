// Define an array to hold the different question types
let currentQuestionIndex = 0;
let correctGuesses = 0;
let incorrectGuesses = 0;

async function fetchRandomSpell() {
    const response = await fetch('https://www.dnd5eapi.co/api/spells');
    const data = await response.json();
    const randomSpell = data.results[Math.floor(Math.random() * data.results.length)];
    const spellResponse = await fetch(`https://www.dnd5eapi.co${randomSpell.url}`);
    const spellData = await spellResponse.json();
    return spellData;
}

async function fetchRandomFeat() {
    const response = await fetch('https://www.dnd5eapi.co/api/feats');
    const data = await response.json();

    // Filter out ability score improvements
    const filteredFeats = data.results.filter(feat => feat.name !== "Ability Score Improvement");
    const randomFeat = filteredFeats[Math.floor(Math.random() * filteredFeats.length)];
    const featResponse = await fetch(`https://www.dnd5eapi.co${randomFeat.url}`);
    const featData = await featResponse.json();
    return featData;
}

async function fetchRandomFeature() {
    const response = await fetch('https://www.dnd5eapi.co/api/features');
    const data = await response.json();

    // Filter out ability score improvements
    const filteredFeatures = data.results.filter(feature => feature.name !== "Ability Score Improvement");
    const randomFeature = filteredFeatures[Math.floor(Math.random() * filteredFeatures.length)];
    const featureResponse = await fetch(`https://www.dnd5eapi.co${randomFeature.url}`);
    const featureData = await featureResponse.json();
    return featureData;
}




async function displaySpellDescription(spellData) {
    const spellDescription = spellData.desc[0];
    document.getElementById('spellDescription').innerText = spellDescription;
    localStorage.setItem('correctAnswer', spellData.name);

    console.log('Correct answer: ', spellData.name)
}

async function displayFeatDescription(featData) {
    const featDescription = featData.desc.join('\n'); // Concatenate all lines in the 'desc' array
    document.getElementById('featDescription').innerText = featDescription;
    localStorage.setItem('correctAnswer', featData.name);

    console.log('Correct answer: ', featData.name);
}


async function displayClassDescription(featureData) {
    const featureDescription = featureData.desc.join('\n'); // Concatenate all lines in the 'desc' array
    document.getElementById('classDescription').innerText = featureDescription;
    localStorage.setItem('correctAnswer', featureData.class.name);

    console.log('Correct answer: ', featureData.class.name);
}

async function displayRandomQuestion() {
    let randomFunction;
    let displayFunction;

    if (gameEnded) {
        return; // Do nothing if the game has ended
    }


    switch (currentQuestionIndex) {
        case 0:
            randomFunction = fetchRandomSpell;
            displayFunction = displaySpellDescription;
            break;
        case 1:
            randomFunction = fetchRandomFeat;
            displayFunction = displayFeatDescription;
            break;
        case 2:
            randomFunction = fetchRandomFeature;
            displayFunction = displayClassDescription;
            break;
        default:
            console.error('Invalid question type');
            return;
    }

    const questionData = await randomFunction();
    await displayFunction(questionData);
}

function checkGuess() {
    const guessInput = document.getElementById('guessInput');
    const guess = guessInput.value.trim().toLowerCase().replace(/'/g, ''); 
    const correctAnswer = localStorage.getItem('correctAnswer').toLowerCase().replace(/'/g, ''); 

    if (guess === correctAnswer) {
        const correctMessage = document.querySelector('.spellGuesser h3');
        correctMessage.style.display = 'block'; // Show the correct message
        document.getElementById('spellDescription').style.display = 'none'; // Hide the question
        correctGuesses++;
        // moveToNextQuestion(); // Move to the next question
    } else {
        guessInput.classList.add('flash-jiggle'); // Add class to trigger flash and jiggle animations
        setTimeout(() => {
            guessInput.classList.remove('flash-jiggle'); // Remove class after animation completes
        }, 500); 

        incorrectGuesses++;
        // Remove one heart image from display
        const heartImages = document.querySelectorAll('#heart1, #heart2, #heart3');
        heartImages[incorrectGuesses - 1].style.display = 'none';

        // Check if incorrectGuesses counter reaches 3
        if (incorrectGuesses === 3) {
            endGame();
            return;
        }
    }

    // Check if it's the third question, then end the game
    if (currentQuestionIndex === 2) {
        endGame();
        return;
    }
}


let gameEnded = false;
function endGame (){
    gameEnded = true;
    died = document.getElementById('endgameContainer');
    died.style.display = 'block';
}


// // Listen for click event on the Skip button
// document.getElementById('skipButton').addEventListener('click', function() {
//         checkGuess(); // Check the guess (which will also handle heart removal)
//         moveToNextQuestion(); // Move to the next question
// });

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

    const featDescription = document.getElementById('featDescription');
    featDescription.innerText = '';

    const classDescription = document.getElementById('classDescription');
    classDescription.innerText = '';

    // Reset the current question index if it's the third question
    if (currentQuestionIndex === 2) {
        currentQuestionIndex = 0;
    } else {
        currentQuestionIndex++; // Move to the next question index
    }

    // Display a random question from the next question type
    displayRandomQuestion();
}



// Listen for "keypress" event on the input element
document.getElementById('guessInput').addEventListener('keypress', function(event) {
    // Check if Enter key is pressed
    if (event.key === 'Enter') {
        checkGuess(); 
    }
});

// Call displayRandomQuestion when the page loads
document.addEventListener('DOMContentLoaded', function() {
    displayRandomQuestion();
});