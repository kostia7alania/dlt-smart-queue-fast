// Package migrations embeds the SQL migration files so the API can apply
// them at startup without external tooling.
package migrations

import "embed"

//go:embed *.sql
var Files embed.FS
