const EMPTY = 0, GREEN = 1, BLUE = 2

function generateSolution(size, seed) {
	if(size % 2 !== 0) throw new Error('Size must be even')
	
	const rand = mulberry32(seed)
	const board = new Array(size * size).fill(EMPTY)
	
	// Try to fill cell at given index
	function solve(idx) {
		if(idx === size * size) return true
		
		const row = Math.floor(idx / size)
		const col = idx % size
		
		// Randomize which colour to try first (this is what the seed controls)
		const colours = rand() < 0.5 ? [GREEN, BLUE] : [BLUE, GREEN]
		
		for(const colour of colours) {
			board[idx] = colour
			if(isValid(board, size, row, col) && solve(idx + 1)) {
				return true
			}
		}
		
		board[idx] = EMPTY
		return false
	}
	
	solve(0)
	return board
}

function generatePuzzle(size, seed, cluesToKeep) {
	const solution = generateSolution(size, seed)
	const puzzle = [...solution]
	const rand = mulberry32(seed + 1)
	
	// Shuffle all indices using Fisher-Yates
	const indices = Array.from({ length: size * size }, (_, i) => i)
	for(let i = indices.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1))
		[indices[i], indices[j]] = [indices[j], indices[i]]
	}
	
	const toRemove = size * size - cluesToKeep
	for(let i = 0; i < toRemove; i++) {
		puzzle[indices[i]] = EMPTY
	}
	
	return puzzle
}

const puzzle = generatePuzzle(6, 12345, 16)
// Same seed + same size always produces the same puzzle
