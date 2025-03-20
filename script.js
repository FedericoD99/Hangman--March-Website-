// Word List
const wordList= [
    'gold',
    'luck',
    'clover',
    'rain',
    'charm',
    'parade',
    'leprechaun',
    'treasure',
    'celebration',
    'greenery',
    'shenanigans',
    'tradition',
]
// declare variables
let selectedWord = ''
let displayWord =''
let wrongGuesses = 0
let guessedLetters =[]
const maxMistakes = 6

// Start Game function (runs everything)
function startGame(level){
    // reset game
    wrongGuesses = 0
    guessedLetters = []

    selectedWord = getRandomWord(level) 
    displayWord = '_'.repeat(selectedWord.length)

    updateDifficultyDisplay(level)
    updateUI()
    
    //show game area and difficulty display, hide selection button
    document.getElementById('gameArea').classList.remove('d-none')
    document.getElementById('gameArea').classList.add('d-block')

    document.getElementById('difficultyBox').classList.remove('d-none')
    document.getElementById('difficultyBox').classList.add('d-block')

    document.getElementById('difficultySelection').classList.add('d-none')
//auto focus on input
    document.getElementById('letterInput').focus()

}

function getRandomWord (level) {
    let filteredWords = wordList.filter ( word => {
        if(level === 'easy') return word.length <= 4
        if(level === 'medium') return word.length >= 5 && word.length <= 7
        if(level === 'hard') return word.length >= 8
     }) 
   
     return filteredWords[Math.floor(Math.random()*filteredWords.length)]



}

//update difficulty display
function updateDifficultyDisplay(level){
    let difficultyBox = document.getElementById('difficultyBox')
    difficultyBox.classList.remove('easy', 'medium', 'hard')

    if(level === 'easy'){
        difficultyBox.textContent='Difficulty: Easy'
        difficultyBox.classList.add('easy')
    }else if(level === 'medium'){
        difficultyBox.textContent='Difficulty: Medium'
        difficultyBox.classList.add('medium')
    } else if(level === 'hard'){
        difficultyBox.textContent='Difficulty: Hard'
        difficultyBox.classList.add('hard')
    }
}

function updateUI() {
    document.getElementById('wordDisplay').textContent = displayWord.split('').join('  ') //show word with spaces between it
    
}

function guessedLetter () {
    let inputField = document.getElementById('letterInput')// get input field
    let guessedLetter = inputField.value.toLowerCase()// convert input to lowercase 


    //check if input is a valid letter (A-I)
    if(!guessedLetter.match(/^[a-z]$/)){
        alert('Please enter a valid letter (A-Z)!') //alert user if invalid input
        inputField.value = ''//clear input field
        return //exit function
    }

//check if letter was already guessed
if(guessedLetters.includes(guessedLetter)){
    alert(`You already guessed '${guessedLetter}'.Try a different letter!`)
    inputField.value = '' // Clear input field
    return
}

//stored guessed letters
    guessedLetters.push(guessedLetter)

    if (selectedWord.includes(guessedLetter)){
        updateCorrectGuess(guessedLetter)

    }else {
        updateWrongGuess(guessedLetter)
    }

    inputField.value = ''// clear input field
    document.getElementById('letterInput').focus()//refocus input field for next guess
}