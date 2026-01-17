package rdap

import (
	"log"
	"strings"
	"time"
)

// CheckAvailability simulates checking if a domain is available.
// In a real implementation, this would use a library like 'github.com/registrobr/rdap-client'.
func CheckAvailability(domain string) (bool, error) {
	log.Printf("Simulando verificação de disponibilidade para o domínio: %s", domain)
	time.Sleep(500 * time.Millisecond) // Simula latência da rede

	// Mock logic: consider a domain "taken" if it contains "dresbach" or "google".
	// This allows for testing both available and unavailable scenarios.
	domain = strings.ToLower(domain)
	if strings.Contains(domain, "dresbach") || strings.Contains(domain, "google") || strings.Contains(domain, "taken") {
		log.Printf("Domínio '%s' simulado como INDISPONÍVEL.", domain)
		return false, nil // Not available
	}

	log.Printf("Domínio '%s' simulado como DISPONÍVEL.", domain)
	return true, nil // Available
}
