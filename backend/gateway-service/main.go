package main

import (
	"io"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

var aiServiceURL string

func main() {
	
	err := godotenv.Load()

	if err != nil {
		log.Fatal("Error loading .env file")
	}
	
	// Load AI service URL from environment variables
	aiServiceURL = os.Getenv("AI_SERVICE_URL")
	if aiServiceURL == "" {
		log.Fatal("AI_SERVICE_URL is not set")
	}

	// Route setup
	http.HandleFunc("/debate-with-ai", loggingMiddleware(forwardToAI))
	http.HandleFunc("/analyze-debate", loggingMiddleware(forwardToAI))

	// Start the server
	log.Println("Gateway running on https://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}


// loggingMiddleware logs each incoming request
func loggingMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Request: %s %s", r.Method, r.URL.Path)
		next.ServeHTTP(w, r)
	}
}


// forwardToAI forwards the request to the AI service
func forwardToAI(w http.ResponseWriter, r *http.Request) {
	url := aiServiceURL + r.URL.Path

	log.Println("forwarded request to ai-service")
	log.Println("ai-service url : "+url)
	// Forward request
	resp, err := http.Post(url, r.Header.Get("Content-Type"), r.Body)
	if err != nil {
		http.Error(w, "Failed to connect to AI service", http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	// Send back the response from AI service
	body, _ := io.ReadAll(resp.Body)
	w.WriteHeader(resp.StatusCode)
	w.Write(body)
}
