import {WORDS} from './words.js';

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]


//initialize game board
function initBoard(){
    let board = document.getElementById('game-board');

    for(let i = 0; i < NUMBER_OF_GUESSES; i++){
        let row = document.createElement('div')
        row.className = "letter-row"

        for(let j = 0; j < 5; j++){
            let box = document.createElement('div')
            box.className = "letter-box"
            row.appendChild(box)
        }
        board.appendChild(row)
    }

}
initBoard();

//accept user input via keyboard
document.addEventListener("keyup", (e) => {
    if(guessesRemaining === 0){
        return
    }

    let pressedKey = String(e.key)
    if(pressedKey === "Backspace" && nextLetter !== 0){
        deleteLetter()
        return
    }

    if(pressedKey === "Enter"){
        checkGuess()
        return
    }

    let found = pressedKey.match(/[a-z]/gi)
    if(!found || found.length > 1){
        return
    }else{
        insertLetter(pressedKey)
    }

})

//checks to see if there is space in the guess for the user input, finds appropriate row, inserts the letter in the box
function insertLetter(pressedKey){
    if(nextLetter === 5){
        return
    }
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName('letter-row')[6 - guessesRemaining]
    let box = row.children[nextLetter]
    animateCSS(box, "pulse")
    box.textContent = pressedKey
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetter += 1
}

//gets correct row, finds and empties the last box, resets the nextLetter counter
function deleteLetter(){
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ''
    box.classList.remove('filled-box')
    currentGuess.pop()
    nextLetter -= 1
}

//makes sure the guess is 5 letters, the guess is a valid list, checks and shades each letter of the word, informs user of game result
//toastr library used for on-screen notifications rather than alerts
function checkGuess(){
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let guessString = ''
    let rightGuess = Array.from(rightGuessString)

    for(const val of currentGuess){
        guessString += val
    }

    if(guessString.length !== 5){
        toastr.error('Not enough letters!')
        return
    }

    if(!WORDS.includes(guessString)){
        toastr.error('Word not found, please make another guess!')
        return
    }

    for(let i = 0; i < 5; i++){
        let letterColor = ''
        let box = row.children[i]
        let letter = currentGuess[i]

        let letterPosition = rightGuess.indexOf(currentGuess[i])
        if(letterPosition === -1){
            letterColor = 'grey'
        }else{

            if (currentGuess[i] === rightGuess[i]){
            letterColor = 'green'
                 }else{
                     letterColor = 'yellow'
                 }
                 rightGuess[letterPosition] = '#'
             }

        let delay = 250 * i
        setTimeout(() => {
            animateCSS(box, 'flipInX')
            box.style.backgroundColor = letterColor
            shadeKeyBoard(letter, letterColor)
        }, delay)
    }

    if(guessString === rightGuessString){
        toastr.success('You guessed the word! Game over!')
        guessesRemaining = 0
        return
    }else{
        guessesRemaining -= 1
        currentGuess = []
        nextLetter = 0

        if(guessesRemaining === 0){
            toastr.error("You've run out of guesses! Game over!")
            toastr.info(`The correct word was ${rightGuessString}!`)
        }

    }
   
}

//receives the letter on the on-screen keyboard to shade and the color to shade it
function shadeKeyBoard(letter, color){
    for(const elem of document.getElementsByClassName('keyboard-button')){
        if(elem.textContent === letter){
            let oldColor = elem.style.backgroundColor
            if(oldColor === 'green'){
                return
            }
            if(oldColor === 'yellow' && color !== 'green'){
                return
            }
            elem.style.backgroundColor = color
            break
        }
    }
}

//generate input for on-screen keyboard
document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target

    if(!target.classList.contains("keyboard-button")){
        return
    }

    let key = target.textContent

    if(key === "Del"){
        key = "Backspace"
    }

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

//animate css using animate.css library
const animateCSS = (element, animation, prefix = 'animate__') =>
    new Promise((res, rej) => {
        const animationName = `${prefix}${animation}`
        const node = element
        node.style.setProperty('--animate-duration', '0.3s')
        node.classList.add(`${prefix}animated`, animationName)

        function handleAnimationEnd(event){
            event.stopPropagation()
            node.classList.remove(`${prefix}animated`, animationName)
            res('Animation ended')
        }

        node.addEventListener('animationend', handleAnimationEnd, {once: true})
    })

//reset game board to play again
document.querySelector(".reset").addEventListener('click', (e) => {
    window.location.reload()
})
