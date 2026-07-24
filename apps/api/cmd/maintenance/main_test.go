package main

import "testing"

func TestLoadRetentionDefaults(t *testing.T) {
	t.Setenv("SLOT_SNAPSHOT_RETENTION_DAYS", "")
	t.Setenv("FETCH_LOG_RETENTION_DAYS", "")

	cfg, err := loadRetention()
	if err != nil {
		t.Fatalf("loadRetention returned error: %v", err)
	}
	if cfg.slotDays != 365 || cfg.fetchDays != 30 {
		t.Fatalf("unexpected defaults: %+v", cfg)
	}
}

func TestLoadRetentionOverrides(t *testing.T) {
	t.Setenv("SLOT_SNAPSHOT_RETENTION_DAYS", "180")
	t.Setenv("FETCH_LOG_RETENTION_DAYS", "14")

	cfg, err := loadRetention()
	if err != nil {
		t.Fatalf("loadRetention returned error: %v", err)
	}
	if cfg.slotDays != 180 || cfg.fetchDays != 14 {
		t.Fatalf("unexpected overrides: %+v", cfg)
	}
}

func TestLoadRetentionRejectsInvalidValues(t *testing.T) {
	t.Setenv("SLOT_SNAPSHOT_RETENTION_DAYS", "0")
	if _, err := loadRetention(); err == nil {
		t.Fatal("expected zero retention to fail")
	}
}
