package repo

import (
	"context"
	"fmt"
	"io/fs"
	"sort"
	"strconv"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
)

type migrationFile struct {
	version int
	name    string
	sql     string
}

// loadMigrations reads *.sql files from the given filesystem, parses the
// numeric version prefix (e.g. "002_dlt_persistence.sql" -> 2), and returns
// them sorted by version. Duplicate versions are an error.
func loadMigrations(files fs.FS) ([]migrationFile, error) {
	entries, err := fs.ReadDir(files, ".")
	if err != nil {
		return nil, fmt.Errorf("read migrations dir: %w", err)
	}

	seen := map[int]string{}
	var migrations []migrationFile
	for _, entry := range entries {
		name := entry.Name()
		if entry.IsDir() || !strings.HasSuffix(name, ".sql") {
			continue
		}
		sep := strings.Index(name, "_")
		if sep <= 0 {
			return nil, fmt.Errorf("migration %q has no numeric version prefix", name)
		}
		version, err := strconv.Atoi(name[:sep])
		if err != nil {
			return nil, fmt.Errorf("migration %q has no numeric version prefix: %w", name, err)
		}
		if prev, ok := seen[version]; ok {
			return nil, fmt.Errorf("duplicate migration version %d: %q and %q", version, prev, name)
		}
		seen[version] = name

		contents, err := fs.ReadFile(files, name)
		if err != nil {
			return nil, fmt.Errorf("read migration %q: %w", name, err)
		}
		migrations = append(migrations, migrationFile{version: version, name: name, sql: string(contents)})
	}

	sort.Slice(migrations, func(i, j int) bool { return migrations[i].version < migrations[j].version })
	return migrations, nil
}

// Migrate applies pending migrations in version order, recording each one in
// schema_migrations. Every migration runs in its own transaction.
func Migrate(ctx context.Context, pool *pgxpool.Pool, files fs.FS) error {
	migrations, err := loadMigrations(files)
	if err != nil {
		return err
	}

	_, err = pool.Exec(ctx, `CREATE TABLE IF NOT EXISTS schema_migrations (
		version INTEGER PRIMARY KEY,
		name TEXT NOT NULL,
		applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
	)`)
	if err != nil {
		return fmt.Errorf("create schema_migrations: %w", err)
	}

	for _, m := range migrations {
		var applied bool
		err := pool.QueryRow(ctx,
			`SELECT EXISTS (SELECT 1 FROM schema_migrations WHERE version = $1)`, m.version).Scan(&applied)
		if err != nil {
			return fmt.Errorf("check migration %q: %w", m.name, err)
		}
		if applied {
			continue
		}

		tx, err := pool.Begin(ctx)
		if err != nil {
			return fmt.Errorf("begin migration %q: %w", m.name, err)
		}
		if _, err := tx.Exec(ctx, m.sql); err != nil {
			_ = tx.Rollback(ctx)
			return fmt.Errorf("apply migration %q: %w", m.name, err)
		}
		if _, err := tx.Exec(ctx,
			`INSERT INTO schema_migrations (version, name) VALUES ($1, $2)`, m.version, m.name); err != nil {
			_ = tx.Rollback(ctx)
			return fmt.Errorf("record migration %q: %w", m.name, err)
		}
		if err := tx.Commit(ctx); err != nil {
			return fmt.Errorf("commit migration %q: %w", m.name, err)
		}
	}

	return nil
}
