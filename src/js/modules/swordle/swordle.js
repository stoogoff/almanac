
import { CssClass } from 'swordle/types.js'
import { words } from 'swordle/words.js'

export class Swordle {
	#guesses = 7
	#complete = () => {}
	#fail = () => {}
	#letters = []
	#currentRow = 0
	#word = []

	constructor(word, onComplete, onFail) {
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
			// TODO notify the user
			// wordle gives a little shake and raises a notification
			// it also has a little flip animation when you enter a word
			// there's a little shake when you enter a letter
			// apart from the notification this could probably all be handled in CSS
			this.applyCurrentRow((node, _index, _cell) => {
				node.classList.add('error')
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

			this.applyCurrentRow((node, _index, _cell) => {
				node.classList.add('chosen')
			})

			window.setTimeout(() => {
				this.applyCurrentRow((node, _index, _cell) => {
					node.classList.remove('chosen')
				})

				this.#currentRow++
				this.#letters = []

				if(this.#currentRow >= this.#guesses) {
					this.#fail()
				}
			}, 500)
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

		// TODO if a letter appears once in the word but twice in the guess
		// it should only be highlighted once
		// if it's in a correct position then that should take precedent

		this.applyCurrentRow((node, index, _cell) => {
			const guess = this.#letters[index].toLowerCase()
			const actual = this.#word[index]

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
		})

		return correct === this.size

		// TODO highlight keys as well
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