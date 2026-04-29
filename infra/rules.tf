
resource "bunnynet_pullzone_edgerule" "redirect_pullzone_domain" {
	enabled     = true
	pullzone    = bunnynet_pullzone.cdn.id
	description = "Redirect pullzone domain to cdn domain."

	actions = [
		{
			type       = "Redirect"
			parameter1 = "https://${bunnynet_pullzone_hostname.knack.name}"
			parameter2 = "301"
			parameter3 = null
		}
	]

	match_type = "MatchAny"
	triggers = [
		{
			type       = "Url"
			match_type = "MatchAny"
			patterns   = [
				"https://${bunnynet_pullzone_hostname.bunnynet_cdn.name}/*"
			]
			parameter1 = null
			parameter2 = null
		}
	]
}
