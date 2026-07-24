package config

import (
	"reflect"
	"testing"
)

func TestLoadDefaults(t *testing.T) {
	for _, name := range []string{
		"PORT",
		"API_PORT",
		"DATABASE_URL",
		"DATABASE_REQUIRED",
		"DB_MAX_CONNS",
		"CORS_ALLOWED_ORIGINS",
		"DLT_API_BASE_URL",
		"DLT_WORKFILTER_TOKEN",
		"DLT_MAX_CONCURRENCY",
	} {
		t.Setenv(name, "")
	}

	cfg, err := Load()
	if err != nil {
		t.Fatalf("Load returned error: %v", err)
	}
	if cfg.Port != "8080" || cfg.DatabaseRequired || cfg.DBMaxConns != 5 || cfg.DLTMaxConcurrency != 4 {
		t.Fatalf("unexpected defaults: %+v", cfg)
	}
	if !reflect.DeepEqual(cfg.CORSAllowedOrigins, []string{"http://localhost:3000"}) {
		t.Fatalf("unexpected CORS defaults: %#v", cfg.CORSAllowedOrigins)
	}
}

func TestLoadProductionOverrides(t *testing.T) {
	t.Setenv("PORT", "9090")
	t.Setenv("API_PORT", "8081")
	t.Setenv("DATABASE_URL", "postgres://production")
	t.Setenv("DATABASE_REQUIRED", "true")
	t.Setenv("DB_MAX_CONNS", "7")
	t.Setenv("CORS_ALLOWED_ORIGINS", "https://example.com, https://www.example.com,")
	t.Setenv("DLT_API_BASE_URL", "https://upstream.example")
	t.Setenv("DLT_WORKFILTER_TOKEN", "secret")
	t.Setenv("DLT_MAX_CONCURRENCY", "3")

	cfg, err := Load()
	if err != nil {
		t.Fatalf("Load returned error: %v", err)
	}
	if cfg.Port != "9090" || cfg.DatabaseURL != "postgres://production" ||
		!cfg.DatabaseRequired || cfg.DBMaxConns != 7 || cfg.DLTMaxConcurrency != 3 {
		t.Fatalf("unexpected overrides: %+v", cfg)
	}
	wantOrigins := []string{"https://example.com", "https://www.example.com"}
	if !reflect.DeepEqual(cfg.CORSAllowedOrigins, wantOrigins) {
		t.Fatalf("expected origins %#v, got %#v", wantOrigins, cfg.CORSAllowedOrigins)
	}
}

func TestLoadRejectsInvalidValues(t *testing.T) {
	tests := []struct {
		name  string
		value string
	}{
		{name: "DATABASE_REQUIRED", value: "sometimes"},
		{name: "DB_MAX_CONNS", value: "0"},
		{name: "DLT_MAX_CONCURRENCY", value: "many"},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			for _, name := range []string{"DATABASE_REQUIRED", "DB_MAX_CONNS", "DLT_MAX_CONCURRENCY"} {
				t.Setenv(name, "")
			}
			t.Setenv(test.name, test.value)
			if _, err := Load(); err == nil {
				t.Fatalf("expected %s=%q to fail", test.name, test.value)
			}
		})
	}
}

func TestLoadRequiresExplicitDatabaseURLInProduction(t *testing.T) {
	t.Setenv("DATABASE_REQUIRED", "true")
	t.Setenv("DATABASE_URL", "")

	if _, err := Load(); err == nil {
		t.Fatal("expected missing production DATABASE_URL to fail")
	}
}
