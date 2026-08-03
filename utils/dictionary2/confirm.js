// prune-words.js
import { dictionary } from '../../src/js/modules/swordle/dictionary.js'
import { words } from '../../src/js/modules/swordle/words.js'

const outputPath = Deno.args[0]

if (!outputPath) {
	console.error('Usage: deno run --allow-read --allow-write prune-words.js <output>')
	Deno.exit(1)
}

const dictSet = new Set(dictionary)
const kept = words.filter(word => dictSet.has(word))
const removed = words.filter(word => !dictSet.has(word))

await Deno.writeTextFile(
	outputPath,
	`export const words = ${JSON.stringify(kept)}`
)

console.log(`Kept ${kept.length} words, removed ${removed.length}`)
console.log(`Removed:\n  ${removed.join('\n  ')}`)