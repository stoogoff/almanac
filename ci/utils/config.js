
import { load } from '@std/dotenv'

// load env vars from file
// existing env vars take precedence over those in the file
const _env = await load({
	envPath: '.env',
	export: true,
})

export default {
	Version: Deno.env.get('VERSION'),
	BucketAccessKey: Deno.env.get('BUCKET_ACCESS_KEY'),
	BucketUrl: Deno.env.get('BUCKET_URL'),
}
