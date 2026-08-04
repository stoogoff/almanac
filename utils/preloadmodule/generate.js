// generate-preloads.js
const entry = Deno.args[0]
const cmd = new Deno.Command('deno', {
	args: ['info', '--json', entry]
})
const { stdout } = await cmd.output()
const info = JSON.parse(new TextDecoder().decode(stdout))

const modules = info.modules
	.map(m => m.specifier)
	.filter(s => s.startsWith('file://') || s.startsWith('http'))

for (const m of modules) {
	console.log(`<link rel="modulepreload" href="${m}" />`)
}
