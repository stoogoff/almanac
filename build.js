
import { join } from '@std/path'
import { load } from '@std/dotenv'

// remove directory and swallow errors
const clean = async dir => {
	try {
		await Deno.remove(dir, { recursive: true })
	}
	catch(error) {
		console.error(error)
	}
}

// recursively create directory structure
const create = async dir => await Deno.mkdir(dir, { recursive: true })

// recursively copy non-html files
const copy = async (source, target) => {
	for await (const file of Deno.readDir(source)) {
		if(file.isFile && !file.name.endsWith('.html')) {
			await Deno.copyFile(join(source, file.name), join(target, file.name))
		}
		else if(file.isDirectory) {
			await create(join(target, file.name))
			await copy(join(source, file.name), join(target, file.name))
		}
	}
}

// copy the HTML files and update links to media with the version
const versionHtml = async (source, target, version) => {
	for await (const file of Deno.readDir(source)) {
		if(file.isFile && file.name.endsWith('.html')) {
			const text = await Deno.readTextFile(join(source, file.name))
			const converted = text
				.replace(/href="css/g, `href="${version}/css`)
				.replace(/"\.\/js/g, `"./${version}/js`)
				.replace(/src="\/media/g, `src="${version}/media`)

			await Deno.writeTextFile(join(target, file.name), converted)
		}
	}
}

// load env vars
const _env = await load({
	envPath: '.env',
	export: true,
})

const version = Deno.env.get('VERSION')

// directories we're working with
const source = join(Deno.cwd(), 'src')
const dist = join(Deno.cwd(), 'dist')
const distVersioned = join(dist, version)

// remove and recreate the dist directory
await clean(dist)
await create(distVersioned)

// copy media files
await copy(source, distVersioned)

// copy and update HTML
await versionHtml(source, dist, version)

console.log('Done')
