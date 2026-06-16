package config

import (
	"os"
)

type Config struct {
	Port               string
	DatabaseURL        string
	DLTAPIBaseURL      string
	DLTWorkFilterToken string
}

func Load() *Config {
	port := os.Getenv("API_PORT")
	if port == "" {
		port = "8080"
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://myuser:mypassword@localhost:5432/mydb?sslmode=disable"
	}

	dltAPIBaseURL := os.Getenv("DLT_API_BASE_URL")
	if dltAPIBaseURL == "" {
		dltAPIBaseURL = "https://app-gecc.theassistech.co.th"
	}

	return &Config{
		Port:               port,
		DatabaseURL:        dbURL,
		DLTAPIBaseURL:      dltAPIBaseURL,
		DLTWorkFilterToken: os.Getenv("DLT_WORKFILTER_TOKEN"),
	}
}
