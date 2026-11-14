
import { join } from '@std/path'
import { create, clean, isDir } from './utils/fs.js'
import config from './utils/config.js'

// recursively copy non-html files
const copy = async (source, target) => {
	if(!isDir(target)) {
		create(target)
	}

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

const copyFile = async (source, target) => await Deno.copyFile(source, target)

// copy the HTML files and update links to media with the version
const versionHtml = async (source, target, version) => {
	for await (const file of Deno.readDir(source)) {
		if(file.isFile && file.name.endsWith('.html')) {
			const text = await Deno.readTextFile(join(source, file.name))
			const converted = text
				.replace(/href="css/g, `href="${version}/css`)
				.replace(/"\.\/js/g, `"./${version}/js`)
				.replace('$VERSION', version)

			await Deno.writeTextFile(join(target, file.name), converted)
		}
	}
}

const versionServiceWorker = async (source, target, version) => {
	const text = await Deno.readTextFile(source)
	const converted = text
		.replace(/'\/css\//g, `'/${version}/css/`)
		.replace(/'\/js\//g, `'/${version}/js/`)
		.replace('~VERSION~', version)

	await Deno.writeTextFile(target, converted)
}

const version = config.Version

console.log(`Building version: ${version}`)

// directories we're working with
const source = join(Deno.cwd(), 'src')
const dist = join(Deno.cwd(), 'dist')
const distVersioned = join(dist, version)

// remove and recreate the dist directory
await clean(dist)
await create(distVersioned)

// copy versioned media files
await copy(join(source, 'js'), join(distVersioned, 'js'))
await copy(join(source, 'css'), join(distVersioned, 'css'))

// copy unversioned media files
await copy(join(source, 'media'), join(dist, 'media'))

// copy and update HTML
await versionHtml(source, dist, version)

// copy and update sw.js
await versionServiceWorker(join(source, 'sw.js'), join(dist, 'sw.js'), version)

// copy other files from root dir
const rootFiles = ['manifest.json']

await Promise.all(rootFiles.map(file => copyFile(join(source, file), join(dist, file)))) 

console.log('Done')
