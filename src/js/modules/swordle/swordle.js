
import { CssClass } from 'swordle/types.js'

export class Swordle {
	#guesses = 7
	#complete = () => {}
	#letters = []
	#currentRow = 0
	#word = []

	constructor(word, onComplete) {
		this.#word = word.split('')
		this.#complete = onComplete
	}

	get size() {
		return this.#word.length
	}

	create(node) {
		node.classList.add(`grid-${this.size}`)

		const cells = this.size * this.#guesses

		for(let i = 0; i < cells; i++) {
			const span = document.createElement('span')

			span.id = `letter-${i}`
			span.classList.add('letter')
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
		if(this.#letters.length === this.size) {
			this.verifyWord()
			this.#currentRow++
			this.#letters = []

			// TODO verify word is in the dictionary
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
		console.log(this.#word, this.#letters)
		let correct = 0

		for(let i = 0; i < this.size; i++) {
			const guess = this.#letters[i].toLowerCase()
			const actual = this.#word[i]
			const cell = (this.#currentRow * this.size) + i
			const node = document.getElementById(`letter-${cell}`)

			node.classList.remove(CssClass.NEARLY, CssClass.CORRECT, CssClass.USED)

			if(guess === actual) {
				correct++
				node.classList.add(CssClass.CORRECT)
			}
			else if(this.#word.includes(guess)) {
				node.classList.add(CssClass.NEARLY)
			}
			else {
				node.classList.add(CssClass.USED)
			}
		}

		if(correct === this.size) {
			this.#complete()
		}

		// TODO highlight keys as well
	}

	draw() {
		for(let i = 0; i < this.size; i++) {
			const letter = this.#letters[i] ?? ''
			const cell = (this.#currentRow * this.size) + i
			const node = document.getElementById(`letter-${cell}`)

			node.innerText = letter
		}
	}
}