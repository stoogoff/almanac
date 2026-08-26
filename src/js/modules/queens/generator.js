
import { shuffled } from 'utils/lib.js'

function placeTokens(size, rand) {
	const tokens = new Array(size).fill(-1)
	
	function tryRow(row) {
		if(row === size) return true
		
		const cols = shuffled(
			Array.from({ length: size }, (_, i) => i),
			rand
		)
		
		for(const col of cols) {
			let conflict = false
			for(let r = 0; r < row; r++) {
				if(tokens[r] === col) {
					conflict = true
					break
				}

				if(r === row - 1 && Math.abs(tokens[r] - col) <= 1) {
					conflict = true
					break
				}
			}

			if(conflict) continue
			
			tokens[row] = col

			if(tryRow(row + 1)) return true

			tokens[row] = -1
		}
		
		return false
	}
	
	return tryRow(0) ? tokens : null
}

function growRegions(size, tokens, rand, difficulty = { balancePref: 1, spreadPref: 0 }) {
	const regions = size
	const board = new Array(size * size).fill(-1)
	const idx = (r, c) => r * size + c
	const inBounds = (r, c) => r >= 0 && r < size && c >= 0 && c < size
	
	const frontiers = Array.from({ length: regions }, () => new Set())
	// Track each region's bounding box for "spread" biasing
	const bounds = Array.from({ length: regions }, () => ({
		minR: size, maxR: -1, minC: size, maxC: -1
	}))
	
	function addFrontier(region, r, c) {
		if(!inBounds(r, c)) return
		if(board[idx(r, c)] !== -1) return
		frontiers[region].add(idx(r, c))
	}
	
	function updateBounds(region, r, c) {
		const b = bounds[region]
		if(r < b.minR) b.minR = r
		if(r > b.maxR) b.maxR = r
		if(c < b.minC) b.minC = c
		if(c > b.maxC) b.maxC = c
	}
	
	tokens.forEach((col, row) => {
		const region = row
		board[idx(row, col)] = region
		updateBounds(region, row, col)
		addFrontier(region, row - 1, col)
		addFrontier(region, row + 1, col)
		addFrontier(region, row, col - 1)
		addFrontier(region, row, col + 1)
	})
	
	let remaining = size * size - regions
	const sizes = new Array(regions).fill(1)
	
	while(remaining > 0) {
		// --- Lever 1: pick which region grows this step ---
		let pickRegion = -1
		if(rand() < difficulty.balancePref) {
			// Feed the smallest region (produces even sizes)
			let minSize = Infinity
			for(let r = 0; r < regions; r++) {
				if(frontiers[r].size === 0) continue
				if(sizes[r] < minSize) {
					minSize = sizes[r]
					pickRegion = r
				}
			}
		} else {
			// Pick any region with frontier cells (produces uneven sizes)
			const available = []
			for(let r = 0; r < regions; r++) {
				if(frontiers[r].size > 0) available.push(r)
			}
			if(available.length === 0) return null
			pickRegion = available[Math.floor(rand() * available.length)]
		}
		
		if(pickRegion === -1) return null
		
		// --- Lever 2: pick which frontier cell to claim ---
		const cells = [...frontiers[pickRegion]]
		let chosen
		if(rand() < difficulty.spreadPref) {
			// Prefer cells that extend the region's bounding box
			const b = bounds[pickRegion]
			const scored = cells.map(cell => {
				const r = Math.floor(cell / size)
				const c = cell % size
				let score = 0
				if(r < b.minR || r > b.maxR) score++
				if(c < b.minC || c > b.maxC) score++
				return { cell, score }
			})
			const maxScore = Math.max(...scored.map(s => s.score))
			const best = scored.filter(s => s.score === maxScore)
			chosen = best[Math.floor(rand() * best.length)].cell
		} else {
			chosen = cells[Math.floor(rand() * cells.length)]
		}
		
		const r = Math.floor(chosen / size)
		const c = chosen % size
		
		board[chosen] = pickRegion
		sizes[pickRegion]++
		updateBounds(pickRegion, r, c)
		remaining--
		
		for(const f of frontiers) {
			f.delete(chosen)
		}
		
		addFrontier(pickRegion, r - 1, c)
		addFrontier(pickRegion, r + 1, c)
		addFrontier(pickRegion, r, c - 1)
		addFrontier(pickRegion, r, c + 1)
	}
	
	return board
}

const DIFFICULTY = {
	easy:   { balancePref: 1.0, spreadPref: 0.0 },  // your current behaviour
	medium: { balancePref: 0.7, spreadPref: 0.4 },
	hard:   { balancePref: 0.3, spreadPref: 0.8 }
}

export function generate(size, rand, difficulty = 'hard') {
	if(size < 5) throw new Error('Size must be at least 5')
	
	const profile = typeof difficulty === 'string' ? DIFFICULTY[difficulty] : difficulty
	
	const tokens = placeTokens(size, rand)
	const board = growRegions(size, tokens, rand, profile)
	
	return {
		board,
		sampleSolution: tokens.map((col, row) => row * size + col),
	}
}
