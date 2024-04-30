async function fetchRandomSpell() {
    const response = await fetch('https://www.dnd5eapi.co/api/spells'); // Replace this URL with the actual API endpoint
    const data = await response.json();
    const randomSpell = data.results[Math.floor(Math.random() * data.results.length)];
    const spellResponse = await fetch(`https://www.dnd5eapi.co${randomSpell.url}`);
    const spellData = await spellResponse.json();
    return spellData;
}

async function displayRandomSpell() {
    const spell = await fetchRandomSpell();
    const spellDescription = spell.desc[0]; // Access the first element of the 'desc' array
    document.getElementById('spellDescription').innerText = spellDescription; // Display spell description
    // Store the correct answer for later comparison
    localStorage.setItem('correctAnswer', spell.name);
}

// Define the checkGuess function
function checkGuess() {
    const guessInput = document.getElementById('guessInput');
    const guess = guessInput.value.trim().toLowerCase().replace(/'/g, ''); // Remove apostrophes and convert to lowercase
    const correctAnswer = localStorage.getItem('correctAnswer').toLowerCase().replace(/'/g, ''); // Remove apostrophes and convert to lowercase

    // Listen for "keypress" event on the input element
    document.getElementById('guessInput').addEventListener('keypress', function(event) {
        // Check if Enter key is pressed
        if (event.key === 'Enter') {
            checkGuess(); // Call the function to check the guess
        }
    });

    if (guess === correctAnswer) {
        const correctMessage = document.querySelector('.spellGuesser p:last-child');
        correctMessage.style.display = 'block'; // Show the correct message
        document.getElementById('spellDescription').style.display = 'none'; // Hide the spell description
    } else {
        guessInput.classList.add('flash-jiggle'); // Add class to trigger flash and jiggle animations
        setTimeout(() => {
            guessInput.classList.remove('flash-jiggle'); // Remove class after animation completes
        }, 500); // Adjust duration as needed
    }
}


// Listen for "keypress" event on the input element
document.getElementById('guessInput').addEventListener('keypress', function(event) {
    // Check if Enter key is pressed
    if (event.key === 'Enter') {
        checkGuess(); // Call the function to check the guess
    }
});

// Call displayRandomSpell when the page loads
document.addEventListener('DOMContentLoaded', function() {
    displayRandomSpell();
});

