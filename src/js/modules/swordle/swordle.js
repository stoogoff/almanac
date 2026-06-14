
import { getRandomInt } from 'utils/number.js'
import { CssClass } from 'swordle/types.js'
import { words } from 'swordle/words.js'

export class Swordle {
	#guesses = 6
	#complete = () => {}
	#fail = () => {}
	#letters = []
	#currentRow = 0
	#word = []

	constructor(guesses, word, onComplete, onFail) {
		this.#guesses = guesses
		this.#word = word.toLowerCase().split('')
		this.#complete = onComplete
		this.#fail = onFail
	}

	get size() {
		return this.#word.length
	}

	get guess() {
		return this.#letters.join('').toLowerCase()
	}

	get word() {
		return this.#word.join('').toLowerCase()
	}

	create(node) {
		node.classList.add(`grid-${this.size}`)

		const cells = this.size * this.#guesses

		for(let i = 0; i < cells; i++) {
			const span = document.createElement('span')

			span.id = `letter-${i}`
			//span.classList.add('letter')
			//span.innerHTML = i

			//if(i === 0) span.classList.add('used')
			//if(i === 1) span.classList.add('correct')
			//if(i === 2) span.classList.add('nearly')

			node.appendChild(span)
		}
	}

	backspace() {
		this.#letters.pop()
		this.draw()
	}

	enter() {
		if(!words.includes(this.guess)) {
			this.applyCurrentRow((node, index, _cell) => {
				window.setTimeout(() => {
					node.classList.add('error')
				}, (index * 100) + getRandomInt(200))
			})

			window.setTimeout(()  => {
				this.applyCurrentRow((node, _index, _cell) => {
					node.classList.remove('error')
				})
			}, 1000)

			return
		}

		if(this.#letters.length === this.size) {
			const result = this.verifyWord()

			if(result) {
				this.#complete(this.#currentRow + 1)
				return
			}

			this.applyCurrentRow((node, index, _cell) => {
				window.setTimeout(() => {
					node.classList.add('chosen')
				}, index * 150)
			})

			window.setTimeout(() => {
				this.applyCurrentRow((node, _index, _cell) => {
					node.classList.remove('chosen')
				})

				this.#currentRow++
				this.#letters = []

				if(this.#currentRow >= this.#guesses) {
					this.#fail(this.word)
				}
			}, 1000)
		}
	}

	type(letter) {
		if(this.#letters.length === this.size) {
			return
		}

		this.#letters.push(letter)
		this.draw()
	}

	verifyWord() {
		let correct = 0

		const correctLetters = []
		const nearlyLetters = []
		const usedLetters = []

		const actualLetterCount = {}
		const usedLetterCount = {}

		this.#word.forEach(letter => {
			if(!(letter in actualLetterCount)) {
				actualLetterCount[letter] = 0
				usedLetterCount[letter] = 0
			}

			actualLetterCount[letter]++
		})

		// loop through letters and handle correct letters only
		this.applyCurrentRow((node, index, _cell) => {
			const guess = this.#letters[index].toLowerCase()
			const actual = this.#word[index]

			node.classList.remove(CssClass.NEARLY, CssClass.CORRECT, CssClass.USED)

			if(guess === actual) {
				correct++
				node.classList.add(CssClass.CORRECT)

				usedLetterCount[guess]++
				correctLetters.push(guess)
			}
		})

		// loop through letters and handle nearly (i.e. is in the word
		// but is in the wrong place) and used letters
		// this prevents letters which occur in the word once being marked as nearly
		// when they're in the wrong place and the correct place has been selected
		this.applyCurrentRow((node, index, _cell) => {
			const guess = this.#letters[index].toLowerCase()
			const actual = this.#word[index]

			// this situation has already been handled
			if(guess === actual) {
				return
			}

			if(this.#word.includes(guess)) {
				if(usedLetterCount[guess] !== actualLetterCount[guess]) {
					node.classList.add(CssClass.NEARLY)
					nearlyLetters.push(guess)
					usedLetterCount[guess]++

					return
				}
			}

			node.classList.add(CssClass.USED)
			usedLetters.push(guess)
		})

		// highlight keyboard letters
		usedLetters.forEach(letter => {
			const node = document.getElementById(`keyboard-${letter}`)

			node.classList.add('used')
		})

		nearlyLetters.forEach(letter => {
			const node = document.getElementById(`keyboard-${letter}`)

			node.classList.add('nearly')
			node.classList.remove('used')
		})

		correctLetters.forEach(letter => {
			const node = document.getElementById(`keyboard-${letter}`)

			node.classList.add('correct')
			node.classList.remove('nearly')
			node.classList.remove('used')
		})

		return correct === this.size
	}

	applyCurrentRow(callback) {
		for(let i = 0; i < this.size; i++) {
			const cell = (this.#currentRow * this.size) + i
			const node = document.getElementById(`letter-${cell}`)

			callback(node, i, cell)
		}		
	}

	draw() {
		this.applyCurrentRow((node, index, _cell) => {
			const letter = this.#letters[index] ?? ''

			node.innerText = letter
			
			if(letter === '') {
				node.classList.remove('letter')
			}
			else {
				node.classList.add('letter')
			}
		})
	}
}
