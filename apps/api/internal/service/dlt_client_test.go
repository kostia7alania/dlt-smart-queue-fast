package service

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestDLTClientPreservesVehicleNames(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/dlt-api1/getVehicle" {
			t.Fatalf("unexpected path: %s", r.URL.Path)
		}
		if r.URL.Query().Get("language") != "2" || r.URL.Query().Get("ve_type") != "1" {
			t.Fatalf("unexpected query: %s", r.URL.RawQuery)
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`[{"ve_id":2,"ve_name":"car"},{"ve_id":12,"ve_name":"Car and Motocycle"}]`))
	}))
	defer server.Close()

	client := NewDLTClient(server.URL, "", server.Client())
	vehicles, err := client.GetVehicles(context.Background())
	if err != nil {
		t.Fatalf("GetVehicles returned error: %v", err)
	}
	if vehicles[0].Name != "car" {
		t.Fatalf("expected preserved vehicle name car, got %q", vehicles[0].Name)
	}
	if vehicles[1].Name != "Car and Motocycle" {
		t.Fatalf("expected preserved vehicle name Car and Motocycle, got %q", vehicles[1].Name)
	}
}

func TestDLTClientPreservesSlotCountString(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/dlt-api3/siteroundopen" {
			t.Fatalf("unexpected path: %s", r.URL.Path)
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`[{"date":"2026-04-08","message":"เต็ม","color":"#FF0000","siteopen":[{"round":"08:00 - 08:30 น.","count":"เต็ม","MaxCount":2}]}]`))
	}))
	defer server.Close()

	client := NewDLTClient(server.URL, "", server.Client())
	slots, raw, err := client.GetSlots(context.Background(), 111093, "2026-04-04")
	if err != nil {
		t.Fatalf("GetSlots returned error: %v", err)
	}
	if slots[0].Message != "เต็ม" {
		t.Fatalf("expected preserved Thai message, got %q", slots[0].Message)
	}
	if slots[0].SiteOpen[0].Count != "เต็ม" {
		t.Fatalf("expected preserved Thai count, got %#v", slots[0].SiteOpen[0].Count)
	}
	if !json.Valid(raw) || !bytes.Contains(raw, []byte("เต็ม")) {
		t.Fatalf("expected raw payload to preserve upstream bytes, got %s", raw)
	}
}

func TestDLTClientReturnsStatusError(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusBadGateway)
	}))
	defer server.Close()

	client := NewDLTClient(server.URL, "", server.Client())
	_, err := client.GetOffices(context.Background())
	if err == nil {
		t.Fatal("expected error for non-2xx upstream response")
	}
}

func TestDLTClientSendsWorkFilterToken(t *testing.T) {
	const token = "configured-token"

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/dlt-api1/workfilter" {
			t.Fatalf("unexpected path: %s", r.URL.Path)
		}
		raw, err := io.ReadAll(r.Body)
		if err != nil {
			t.Fatalf("read request body: %v", err)
		}
		var body map[string]any
		if err := json.Unmarshal(raw, &body); err != nil {
			t.Fatalf("decode request body: %v", err)
		}
		if body["username"] != token {
			t.Fatalf("expected workfilter token %q, got %#v", token, body["username"])
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`[]`))
	}))
	defer server.Close()

	client := NewDLTClient(server.URL, token, server.Client())
	if _, err := client.WorkFilter(context.Background(), 47, 4, " NEW THAI"); err != nil {
		t.Fatalf("WorkFilter returned error: %v", err)
	}
}
