
import { shuffled } from 'utils/lib.js'
import { mulberry32 } from 'utils/seed.js'
import { BOARD_SIZE } from 'soduku/types.js'

const BOX = 3

// --- validity check for a candidate value at a cell -------------

function canPlace(board, idx, value) {
	const row = Math.floor(idx / BOARD_SIZE)
	const col = idx % BOARD_SIZE
	const boxRow = Math.floor(row / BOX) * BOX
	const boxCol = Math.floor(col / BOX) * BOX
	
	for(let i = 0; i < BOARD_SIZE; i++) {
		if(board[row * BOARD_SIZE + i] === value) return false
		if(board[i * BOARD_SIZE + col] === value) return false

		const br = boxRow + Math.floor(i / BOX)
		const bc = boxCol + (i % BOX)

		if(board[br * BOARD_SIZE + bc] === value) return false
	}
	return true
}

// --- stage 1: fill a complete valid board -----------------------

function fillBoard(board, rand, idx = 0) {
	if(idx === BOARD_SIZE * BOARD_SIZE) return true
	if(board[idx] !== 0) return fillBoard(board, rand, idx + 1)
	
	const values = shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9], rand)

	for(const v of values) {
		if(canPlace(board, idx, v)) {
			board[idx] = v

			if(fillBoard(board, rand, idx + 1)) return true

			board[idx] = 0
		}
	}

	return false
}

// --- stage 2: count solutions, bail at 2 ------------------------

function countSolutions(board, limit = 2) {
	const work = [...board]
	let count = 0
	
	function solve(idx) {
		if(count >= limit) return
		if(idx === BOARD_SIZE * BOARD_SIZE) {
			count++
			return
		}
		if(work[idx] !== 0) return solve(idx + 1)
		
		for(let v = 1; v <= 9; v++) {
			if(canPlace(work, idx, v)) {
				work[idx] = v
				solve(idx + 1)
				work[idx] = 0

				if(count >= limit) return
			}
		}
	}
	
	solve(0)

	return count
}

// --- stage 3: remove cells while keeping uniqueness -------------

function removeCells(board, targetClues, rand) {
	const puzzle = [...board]
	const indices = shuffled(
		Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, i) => i),
		rand
	)
	
	let remaining = BOARD_SIZE * BOARD_SIZE
	
	for(const idx of indices) {
		if(remaining <= targetClues) break
		
		const saved = puzzle[idx]

		puzzle[idx] = 0
		
		if(countSolutions(puzzle, 2) === 1) {
			remaining--
		}
		else {
			puzzle[idx] = saved
		}
	}
	
	return { puzzle, clueCount: remaining }
}

// --- main -------------------------------------------------------

export function generateBoard(difficulty, rand) {
	const solution = new Array(BOARD_SIZE * BOARD_SIZE).fill(0)

	fillBoard(solution, rand)
	
	const { puzzle, clueCount } = removeCells(solution, difficulty, rand)
	
	return {
		puzzle,
		solution,
		clueCount,
		difficulty,
	}
}
