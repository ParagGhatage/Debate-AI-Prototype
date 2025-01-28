package main

import (
	"bytes"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

var aiServiceURL string

// Define a structure to map the incoming JSON data
type RequestData struct {
	Prompt string `json:"key1"` // Corrected struct tag to map to 'key1'
}

func main() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Load AI service URL from environment variables
	aiServiceURL = os.Getenv("AI_SERVICE_URL")
	if aiServiceURL == "" {
		log.Fatal("AI_SERVICE_URL is not set")
	}

	// Create a new multiplexer
	mux := http.NewServeMux()

	// Enable CORS
	handler := cors.Default().Handler(mux)

	// Route setup
	mux.HandleFunc("/debate", loggingMiddleware(forward_to_debate))
	mux.HandleFunc("/analyze", loggingMiddleware(forward_to_analyze))

	// Start the server
	log.Println("Gateway running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}

func loggingMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Request: %s %s", r.Method, r.URL.Path)
		next.ServeHTTP(w, r)
	}
}

// forwardRequest forwards the request to the AI service or debate service
func forward_to_debate(w http.ResponseWriter, r *http.Request) {
    // Forward URL with query parameters
    url := aiServiceURL + r.URL.Path + "?" + r.URL.RawQuery

    log.Printf("Forwarding request to: %s", url)

    // Read the incoming request body
    body, err := io.ReadAll(r.Body)
    if err != nil {
        http.Error(w, "Failed to read request body", http.StatusInternalServerError)
        return
    }

    // Prepare the request to forward
    req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(body))
    if err != nil {
        http.Error(w, "Failed to create forward request", http.StatusInternalServerError)
        return
    }

    // Copy headers from the incoming request
    req.Header = r.Header

    // Forward the request
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        http.Error(w, "Failed to connect to service", http.StatusBadGateway)
        return
    }
    defer resp.Body.Close()

    // Send back the response from the service
    respBody, err := io.ReadAll(resp.Body)
    if err != nil {
        http.Error(w, "Failed to read response body", http.StatusInternalServerError)
        return
    }

    // Set the response headers and send the body
    w.Header().Set("Content-Type", resp.Header.Get("Content-Type"))
    w.WriteHeader(resp.StatusCode)
    w.Write(respBody)
}

func forward_to_analyze(w http.ResponseWriter, r *http.Request) {
    // Define the target route for the AI service
    url := aiServiceURL + "/analyze"

    log.Printf("Forwarding request to: %s", url)

    // Read the incoming request body
    body, err := io.ReadAll(r.Body)
    if err != nil {
        http.Error(w, "Failed to read request body", http.StatusInternalServerError)
        return
    }

    // Prepare the forward request
    req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(body))
    if err != nil {
        http.Error(w, "Failed to create forward request", http.StatusInternalServerError)
        return
    }

    // Copy headers from the incoming request to the forwarded request
    req.Header = r.Header

    // Forward the request
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        http.Error(w, "Failed to connect to AI service", http.StatusBadGateway)
        return
    }
    defer resp.Body.Close()

    // Read the response body from the AI service
    respBody, err := io.ReadAll(resp.Body)
    if err != nil {
        http.Error(w, "Failed to read response body", http.StatusInternalServerError)
        return
    }

    // Set the response headers from the AI service and send the response body back
    w.Header().Set("Content-Type", resp.Header.Get("Content-Type"))
    w.WriteHeader(resp.StatusCode)
    w.Write(respBody)
}
