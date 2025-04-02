// Word List
const wordList = [
  'iron',
  'thor',
  'marvel',
  'hulk',
  'venom',
  'spider',
  'doctordoom',
  'galactus',
  'abomination',
  'mysterio',
  'mattmurdock',
  'wolverine'
]

//decare variables
let selectedWord = ''
let displayedWord = ''
let wrongGuesses = 0
let guessedLetters = []
const maxMistakes = 6
let wordGraveyard = []; // Stores all words guessed in previous rounds


// Start Game Function (runs everything)
function startGame (level) {
  //reset game
  wrongGuesses = 0
  guessedLetters = []

  selectedWord = getRandomWord(level)
  displayedWord = '_'.repeat(selectedWord.length)

  updateDifficultyDisplay(level)
  updateUI()
  
  //Show Game Area/Difficulty Display , hide selection buttons
  document.getElementById('gameArea').classList.remove('d-none')
  document.getElementById('gameArea').classList.add('d-block')

  document.getElementById('difficultyBox').classList.remove('d-none')
  document.getElementById('difficultyBox').classList.add('d-block')

  document.getElementById('difficultySelection').classList.add('d-none')
  //Auto-focus on input
  document.getElementById('letterInput').focus()
}

function getRandomWord (level) {
  let filteredWords = wordList.filter(word => {
    if (level === 'easy') return word.length <= 4
    if (level === 'medium') return word.length >= 5 && word.length <= 7
    if (level === 'hard') return word.length >= 8
  })
  return filteredWords[Math.floor(Math.random() * filteredWords.length)]
}

//update Difficulty Display
function updateDifficultyDisplay (level) {
  let difficultyBox = document.getElementById('difficultyBox')
  difficultyBox.classList.remove('easy', 'medium', 'hard')

  if (level === 'easy') {
    difficultyBox.textContent = 'Difficulty: Easy 🍀'
    difficultyBox.classList.add('easy')
  } else if (level === 'medium') {
    difficultyBox.textContent = 'Difficulty: Medium 🌟'
    difficultyBox.classList.add('medium')
  } else if (level === 'hard') {
    difficultyBox.textContent = 'Difficulty: Hard 💀'
    difficultyBox.classList.add('hard')
  }
}

function updateUI() {
  document.getElementById('wordDisplay').textContent = displayedWord.split('').join('  ') // Show word progress with spaces
}

function guessLetter () {
  let inputField = document.getElementById('letterInput') // Get input field
  let guessedLetter = inputField.value.toLowerCase() // Convert input to lowercase

  //Check if input is a valid letter (A-Z)
  if (!guessedLetter.match(/^[a-z]$/)){
    alert('Please enter a valid letter (A-Z)!') // Alert user if invalid input
    inputField.value = '' // Clear input field
    return // Exit function
  }
  

  //Check if letter was already guessed
  if(guessedLetters.includes(guessedLetter)){
    alert(`You already guessed '${guessedLetter}'. Try a different letter!`)
    inputField.value = '' // Clear input field
    return
  }

  //Store guessed letter
  guessedLetters.push(guessedLetter)

  //Check if guessed letter is in the selected word
  if (selectedWord.includes(guessedLetter)){
    updateCorrectGuess(guessedLetter)
  } else {
    updateWrongGuess(guessedLetter)
  }

  inputField.value = '' // Clear input field
  document.getElementById('letterInput').focus() // Refocus input field for next guess

}

function updateWrongGuess(guessedLetter){ 
  wrongGuesses++;
  document.getElementById('wrongLetters').textContent += `${guessedLetter} `;

  // Play wrong guess sound effect
  document.getElementById('wrongSound').play();
  
  // Hide the corresponding health image for the wrong guess
  if (wrongGuesses <= maxMistakes) {
    document.getElementById(`life${wrongGuesses}`).style.display = 'none';  // Hide one clover image
  }

  // Check if the max mistakes are reached
  if (wrongGuesses === maxMistakes) {
    endGame(false);
  }
}

function updateCorrectGuess(guessedLetter){
  let newDisplayedWord =''

  for (let i=0; i < selectedWord.length; i++){
    if (selectedWord[i] === guessedLetter){
      newDisplayedWord += guessedLetter // Replace underscore with correct letter
    }else{
    newDisplayedWord += displayedWord[i] // Keep existing correct letters
    }
  }

  displayedWord = newDisplayedWord
  updateUI()


   // Play correct guess sound effect
   document.getElementById('correctSound').play();

  //  Check if the player has guessed all letters
  if (!displayedWord.includes('_')) {
    endGame(true)
  }

}

function endGame(won){
  let messageBox = document.getElementById('endMessage');
  let message = won
    ? '🎉 Congratulations! You guessed the word! 🍀'
    : `❌ Game Over! The word was "${selectedWord}".`;

  messageBox.textContent = message;
  messageBox.classList.remove('d-none');
  messageBox.classList.add('d-block');


  // Add guessed word to graveyard
  wordGraveyard.push(selectedWord);
  updateGraveyard();


  //  disable the input field
  document.getElementById('letterInput').disabled = true;

}



// Restart Game - Resets everything
function restartGame() {
  // Clear displayed elements
  document.getElementById('wordDisplay').textContent = '';
  document.getElementById('wrongLetters').textContent = '';

  // Hide end message
  document.getElementById('endMessage').classList.add('d-none');
  document.getElementById('endMessage').classList.remove('d-block');
  document.getElementById('endMessage').textContent = ''; // Clear message

  // Reset wrong guesses and guessed letters
  wrongGuesses = 0;
  guessedLetters = [];

  // Hide the game area and difficulty box, show difficulty selection buttons
  document.getElementById('gameArea').classList.remove('d-block');
  document.getElementById('gameArea').classList.add('d-none');
  
  document.getElementById('difficultyBox').classList.remove('d-block');
  document.getElementById('difficultyBox').classList.add('d-none');
  
  document.getElementById('difficultySelection').classList.remove('d-none');
  document.getElementById('difficultySelection').classList.add('d-block');

  // Restore all health images (shamrocks) to visible
  for (let i = 1; i <= maxMistakes; i++) {
    document.getElementById(`life${i}`).style.display = 'inline';  // Show all images
  }

  // Clear the Word Graveyard
  document.getElementById('graveyardList').innerHTML = '';  // This clears the graveyard


  // Enable the input field again
  document.getElementById('letterInput').disabled = false;
  document.getElementById('letterInput').value = ''; // Clear the input field
  document.getElementById('letterInput').focus(); // Refocus the input field


  

  // Optionally, reset the difficulty display text
  document.getElementById('difficultyBox').textContent = ''; // Clear any difficulty text
}

// Added event listener to detect "Enter" key press in the input
document.getElementById('letterInput').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    guessLetter(); // Calls the guessLetter function when Enter is pressed
  }
});


// Declare variables for Word Graveyard
let guessedLettersGraveyard = [];

function updateGraveyard() {
  let graveyardList = document.getElementById('graveyardList');
  graveyardList.innerHTML = ''; // Clear list before updating

  wordGraveyard.forEach(word => {
    let listItem = document.createElement('li');
    listItem.textContent = word;
    graveyardList.appendChild(listItem);



// Apply styling based on correctness
if (word === selectedWord && !displayedWord.includes('_')) {
  listItem.style.backgroundColor = 'lightgreen'; // Correctly guessed word
} else {
  listItem.style.backgroundColor = 'lightcoral'; // Incorrectly guessed word
}

  });
}

// Modify guessLetter function to include updating the graveyard
function guessLetter() {
  let inputField = document.getElementById('letterInput'); // Get input field
  let guessedLetter = inputField.value.toLowerCase(); // Convert input to lowercase

  // Check if input is a valid letter (A-Z)
  if (!guessedLetter.match(/^[a-z]$/)) {
    alert('Please enter a valid letter (A-Z)!') // Alert user if invalid input
    inputField.value = '' // Clear input field
    return // Exit function
  }

  // Check if letter was already guessed
  if (guessedLetters.includes(guessedLetter)) {
    alert(`You already guessed '${guessedLetter}'. Try a different letter!`)
    inputField.value = '' // Clear input field
    return
  }

  // Store guessed letter
  guessedLetters.push(guessedLetter);

  // Add guessed letter to the graveyard
  updateGraveyard(guessedLetter); // Add to Word Graveyard

  // Check if guessed letter is in the selected word
  if (selectedWord.includes(guessedLetter)) {
    updateCorrectGuess(guessedLetter);
  } else {
    updateWrongGuess(guessedLetter);
  }

  inputField.value = ''; // Clear input field
  document.getElementById('letterInput').focus(); // Refocus input field for next guess
}
























