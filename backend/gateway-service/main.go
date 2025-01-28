package main

import (
	"bytes"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins (change based on your security needs)
	},
}

var aiServiceURL string

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
	mux.HandleFunc("/debate", loggingMiddleware(handleWebSocket)) // WebSocket endpoint
	mux.HandleFunc("/analyze", loggingMiddleware(forwardToAnalyze)) // Analysis endpoint

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

// handleWebSocket upgrades the HTTP connection to a WebSocket and forwards the message to the AI service
func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	// Upgrade HTTP connection to WebSocket
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Error upgrading WebSocket: %v", err)
		return
	}
	defer conn.Close()

	log.Printf("Client connected: %s", r.RemoteAddr)

	// Read the incoming message from the client (expecting the debate prompt)
	_, prompt, err := conn.ReadMessage()
	if err != nil {
		log.Printf("Error reading WebSocket message: %v", err)
		return
	}
	log.Printf("Received prompt from client: %s", prompt)

	// Forward the prompt to the AI service
	response, err := forwardToAIService("ws://localhost:8000/debate", prompt)
	if err != nil {
		log.Printf("Error forwarding to AI service: %v", err)
		return
	}

	// Send the AI response back to the client via WebSocket
	err = conn.WriteMessage(websocket.TextMessage, response)
	if err != nil {
		log.Printf("Error sending WebSocket message: %v", err)
	}
}

// forwardToAIService forwards the prompt to the AI service and returns the response
// forwardToAIService now uses WebSocket to forward the message to the AI service
func forwardToAIService(url string, body []byte) ([]byte, error) {
    // Establish a WebSocket connection to the AI service
    aiConn, _, err := websocket.DefaultDialer.Dial(url, nil)
    if err != nil {
        return nil, err
    }
    defer aiConn.Close()

    // Send the body (prompt) to the AI service
    err = aiConn.WriteMessage(websocket.TextMessage, body)
    if err != nil {
        return nil, err
    }

    // Read the response from the AI service
    _, response, err := aiConn.ReadMessage()
    if err != nil {
        return nil, err
    }

    // Return the response from the AI service
    return response, nil
}


// forwardToAnalyze forwards the analysis request to the AI service
func forwardToAnalyze(w http.ResponseWriter, r *http.Request) {
	url :="http://localhost:8000/analyze"
	log.Printf("Forwarding analysis request to: %s", url)

	// Read the incoming request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error reading request body: %v", err)
		http.Error(w, "Failed to read request body", http.StatusInternalServerError)
		return
	}

	// Prepare the forward request
	req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(body))
	if err != nil {
		log.Printf("Error creating forward request: %v", err)
		http.Error(w, "Failed to create forward request", http.StatusInternalServerError)
		return
	}

	// Copy headers from the incoming request to the forwarded request
	req.Header = r.Header

	// Forward the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error forwarding to AI service: %v", err)
		http.Error(w, "Failed to connect to AI service", http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	// Read the response body from the AI service
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Error reading response body: %v", err)
		http.Error(w, "Failed to read response body", http.StatusInternalServerError)
		return
	}

	// Set the response headers from the AI service and send the response body back
	w.Header().Set("Content-Type", resp.Header.Get("Content-Type"))
	w.WriteHeader(resp.StatusCode)
	w.Write(respBody)
}
