
import { join } from '@std/path'
import { listFiles } from './utils/fs.js'
import config from "./utils/config.js"

console.log(`Deploying version: ${config.Version} to: ${config.BucketUrl}`)

const dist = join(Deno.cwd(), 'dist')
const files = await listFiles(dist)

const statusCount = {}


for(const file of files) {
  try {
    console.log(`Uploading file: ${join(config.BucketUrl, file)}`)

    const body = await Deno.readFile(join(dist, file))
    const response = await fetch(join(config.BucketUrl, file), {
       method: 'PUT',
       headers: {
         AccessKey: config.BucketAccessKey,
         ContentType: 'applicatio/octet-stream',
       },
       body,
    })

    statusCount[response.status] = (statusCount[response.status] ?? 0) + 1
  }
  catch(error) {
    console.error(error)
  }
}

console.log(statusCount)
console.log('Done')
