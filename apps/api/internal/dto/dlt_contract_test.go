package dto

import "testing"

func TestDLTPreservedContractStrings(t *testing.T) {
	strings := []string{
		"Car and Motocycle",
		"car",
		"New thai driving license.",
		"Renew thai driving license.",
		" NEW THAI",
		" RENEW THAI",
		"เต็ม",
		"[empty]",
	}

	for _, value := range strings {
		if value == "" {
			t.Fatalf("preserved DLT contract string must not be empty")
		}
	}
}
