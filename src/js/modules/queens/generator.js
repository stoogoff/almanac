
function shuffled(arr, rand) {
	const a = [...arr]
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1))
		;[a[i], a[j]] = [a[j], a[i]]
	}
	return a
}

function placeTokens(size, rand) {
	const tokens = new Array(size).fill(-1)
	
	function tryRow(row) {
		if (row === size) return true
		
		const cols = shuffled(
			Array.from({ length: size }, (_, i) => i),
			rand
		)
		
		for (const col of cols) {
			let conflict = false
			for (let r = 0; r < row; r++) {
				if (tokens[r] === col) { conflict = true; break }
				if (r === row - 1 && Math.abs(tokens[r] - col) <= 1) {
					conflict = true; break
				}
			}
			if (conflict) continue
			
			tokens[row] = col
			if (tryRow(row + 1)) return true
			tokens[row] = -1
		}
		
		return false
	}
	
	return tryRow(0) ? tokens : null
}

function growRegions(size, tokens, rand) {
	const regions = size
	const board = new Array(size * size).fill(-1)
	const idx = (r, c) => r * size + c
	const inBounds = (r, c) => r >= 0 && r < size && c >= 0 && c < size
	
	const frontiers = Array.from({ length: regions }, () => new Set())
	
	function addFrontier(region, r, c) {
		if (!inBounds(r, c)) return
		if (board[idx(r, c)] !== -1) return
		frontiers[region].add(idx(r, c))
	}
	
	tokens.forEach((col, row) => {
		const region = row
		board[idx(row, col)] = region
		addFrontier(region, row - 1, col)
		addFrontier(region, row + 1, col)
		addFrontier(region, row, col - 1)
		addFrontier(region, row, col + 1)
	})
	
	let remaining = size * size - regions
	const sizes = new Array(regions).fill(1)
	
	while (remaining > 0) {
		let pickRegion = -1
		let minSize = Infinity
		for (let r = 0; r < regions; r++) {
			if (frontiers[r].size === 0) continue
			if (sizes[r] < minSize) {
				minSize = sizes[r]
				pickRegion = r
			}
		}
		
		if (pickRegion === -1) return null
		
		const cells = [...frontiers[pickRegion]]
		const chosen = cells[Math.floor(rand() * cells.length)]
		const r = Math.floor(chosen / size)
		const c = chosen % size
		
		board[chosen] = pickRegion
		sizes[pickRegion]++
		remaining--
		
		for (const f of frontiers) f.delete(chosen)
		
		addFrontier(pickRegion, r - 1, c)
		addFrontier(pickRegion, r + 1, c)
		addFrontier(pickRegion, r, c - 1)
		addFrontier(pickRegion, r, c + 1)
	}
	
	return board
}

export function generate(size, rand) {
	if (size < 5) throw new Error('Size must be at least 5')
	
	// A few attempts in case growRegions hits its rare null path,
	// but the happy path almost always succeeds on attempt 0.
	for (let attempt = 0; attempt < 20; attempt++) {
		//const rand = mulberry32(seed + attempt * 0x9E3779B1)
		
		const tokens = placeTokens(size, rand)
		if (!tokens) continue
		
		const board = growRegions(size, tokens, rand)
		if (!board) continue
		
		return {
			board,
			sampleSolution: tokens.map((col, row) => row * size + col),
			attempts: attempt + 1
		}
	}
	
	return null
}
