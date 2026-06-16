package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humachi"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/starter/api/internal/config"
	myhttp "github.com/starter/api/internal/http"
	"github.com/starter/api/internal/service"
)

func main() {
	cfg := config.Load()

	router := chi.NewRouter()
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)

	// Provide CORS middleware for local dev
	router.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}
			next.ServeHTTP(w, r)
		})
	})

	apiConfig := huma.DefaultConfig("AI Starter API", "1.0.0")
	api := humachi.New(router, apiConfig)

	svc := service.NewAIService(cfg.DLTAPIBaseURL, cfg.DLTWorkFilterToken)

	myhttp.RegisterRoutes(api, svc)

	addr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("Server starting on %s...", addr)
	log.Printf("OpenAPI docs available at http://localhost%s/docs", addr)
	if err := http.ListenAndServe(addr, router); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
