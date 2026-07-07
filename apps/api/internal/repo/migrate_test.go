package repo

import (
	"testing"
	"testing/fstest"
)

func TestLoadMigrationsSortsByVersion(t *testing.T) {
	files := fstest.MapFS{
		"010_later.sql":  {Data: []byte("SELECT 10;")},
		"002_second.sql": {Data: []byte("SELECT 2;")},
		"001_first.sql":  {Data: []byte("SELECT 1;")},
		"README.md":      {Data: []byte("not a migration")},
	}

	migrations, err := loadMigrations(files)
	if err != nil {
		t.Fatalf("loadMigrations returned error: %v", err)
	}
	if len(migrations) != 3 {
		t.Fatalf("expected 3 migrations, got %d", len(migrations))
	}
	for i, want := range []int{1, 2, 10} {
		if migrations[i].version != want {
			t.Fatalf("position %d: expected version %d, got %d", i, want, migrations[i].version)
		}
	}
	if migrations[2].name != "010_later.sql" || migrations[2].sql != "SELECT 10;" {
		t.Fatalf("unexpected migration contents: %+v", migrations[2])
	}
}

func TestLoadMigrationsRejectsDuplicateVersions(t *testing.T) {
	files := fstest.MapFS{
		"001_a.sql": {Data: []byte("SELECT 1;")},
		"001_b.sql": {Data: []byte("SELECT 1;")},
	}

	if _, err := loadMigrations(files); err == nil {
		t.Fatal("expected duplicate version error, got nil")
	}
}

func TestLoadMigrationsRejectsMissingVersionPrefix(t *testing.T) {
	files := fstest.MapFS{
		"init.sql": {Data: []byte("SELECT 1;")},
	}

	if _, err := loadMigrations(files); err == nil {
		t.Fatal("expected version prefix error, got nil")
	}
}
