package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Config struct {
	Port               string
	DatabaseURL        string
	DatabaseRequired   bool
	DBMaxConns         int32
	CORSAllowedOrigins []string
	DLTAPIBaseURL      string
	DLTWorkFilterToken string
	DLTMaxConcurrency  int
}

func Load() (*Config, error) {
	port := os.Getenv("PORT")
	if port == "" {
		port = os.Getenv("API_PORT")
	}
	if port == "" {
		port = "8080"
	}

	databaseRequired, err := boolEnv("DATABASE_REQUIRED", false)
	if err != nil {
		return nil, err
	}
	dbMaxConns, err := positiveIntEnv("DB_MAX_CONNS", 5)
	if err != nil {
		return nil, err
	}
	dltMaxConcurrency, err := positiveIntEnv("DLT_MAX_CONCURRENCY", 4)
	if err != nil {
		return nil, err
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		if databaseRequired {
			return nil, fmt.Errorf("DATABASE_URL is required when DATABASE_REQUIRED=true")
		}
		dbURL = "postgres://myuser:mypassword@localhost:5432/mydb?sslmode=disable"
	}

	dltAPIBaseURL := os.Getenv("DLT_API_BASE_URL")
	if dltAPIBaseURL == "" {
		dltAPIBaseURL = "https://app-gecc.theassistech.co.th"
	}

	return &Config{
		Port:               port,
		DatabaseURL:        dbURL,
		DatabaseRequired:   databaseRequired,
		DBMaxConns:         int32(dbMaxConns),
		CORSAllowedOrigins: csvEnv("CORS_ALLOWED_ORIGINS", "http://localhost:3000"),
		DLTAPIBaseURL:      dltAPIBaseURL,
		DLTWorkFilterToken: os.Getenv("DLT_WORKFILTER_TOKEN"),
		DLTMaxConcurrency:  dltMaxConcurrency,
	}, nil
}

func boolEnv(name string, fallback bool) (bool, error) {
	raw := os.Getenv(name)
	if raw == "" {
		return fallback, nil
	}
	value, err := strconv.ParseBool(raw)
	if err != nil {
		return false, fmt.Errorf("%s must be true or false: %w", name, err)
	}
	return value, nil
}

func positiveIntEnv(name string, fallback int) (int, error) {
	raw := os.Getenv(name)
	if raw == "" {
		return fallback, nil
	}
	value, err := strconv.Atoi(raw)
	if err != nil || value <= 0 {
		return 0, fmt.Errorf("%s must be a positive integer", name)
	}
	return value, nil
}

func csvEnv(name, fallback string) []string {
	raw := os.Getenv(name)
	if raw == "" {
		raw = fallback
	}
	var values []string
	for _, value := range strings.Split(raw, ",") {
		if trimmed := strings.TrimSpace(value); trimmed != "" {
			values = append(values, trimmed)
		}
	}
	return values
}
