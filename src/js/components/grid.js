
export class Grid {
	#width = 0
	#height = 0
	#size = 0

	constructor(width, height) {
		this.#width = width
		this.#height = height
		this.#size = width * height
	}

	get width() {
		return this.#width
	}

	get height() {
		return this.#height
	}

	get size() {
		return this.#size
	}

	rowIndices(i) {
		const start = Math.floor(i / this.width) * this.width
		return Array.from({ length: this.width }, (_, k) => start + k)
	}

	rowIndicesExclusive(i) {
		return this.rowIndices(i).filter(idx => idx !== i)
	}

	columnIndices(i) {
		const col = i % this.width
		return Array.from({ length: this.height }, (_, k) => col + k * this.width)
	}

	columnIndicesExclusive(i) {
		return this.columnIndices(i).filter(idx => idx !== i)
	}

	firstInRow(i) {
		return Math.floor(i / this.width) * this.width
	}

	firstInColumn(i) {
		return i % this.width
	}

	neighbours(i) {
		return [...this.neighboursExclusive(i), i]
	}

	neighboursExclusive(i) {
		const row = Math.floor(i / this.width)
		const col = i % this.width
		const result = []

		for(let dr = -1; dr <= 1; dr++) {
			for(let dc = -1; dc <= 1; dc++) {
				if(dr === 0 && dc === 0) continue

				const r = row + dr
				const c = col + dc

				if(r >= 0 && r < this.height && c >= 0 && c < this.width) {
					result.push(r * this.width + c);
				}
			}
		}

		return result
	}
}
