// main.go
package main

import (
	"bytes"
	"log"
	"net/http"
	"io"
	"encoding/json"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins (change based on your security needs)
	},
}

// Define the Message struct
type Message struct {
    Role    string `json:"role"`
    Content string `json:"content"`
}

var aiServiceURL string

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	

	mux := http.NewServeMux()
	handler := cors.Default().Handler(mux)

	mux.HandleFunc("/debate", loggingMiddleware(handleWebSocket))
	// mux.HandleFunc("/analyze", loggingMiddleware(forwardToAnalyze))

	// Add the handler for /analyze route
	// Add the handler for /analyze route
	mux.HandleFunc("/analyze", loggingMiddleware(handleAnalyze))  // Correct syntax here





	log.Println("Gateway running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}

func loggingMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Request: %s %s", r.Method, r.URL.Path)
		next.ServeHTTP(w, r)
	}
}

// Function to handle /analyze requests (Updated for HTTP)
func handleAnalyze(w http.ResponseWriter, r *http.Request) {
    // Parse the incoming request body
    var requestData struct {
        Messages []Message `json:"messages"`
    }
    err := json.NewDecoder(r.Body).Decode(&requestData)
    if err != nil {
        http.Error(w, "Invalid request payload", http.StatusBadRequest)
        return
    }

    // Create the request to the AI service (assuming it’s an HTTP API)
    aiServiceRequest := struct {
        Messages []Message `json:"messages"`
    }{
        Messages: requestData.Messages,
    }

    // Convert the data to JSON
    requestPayload, err := json.Marshal(aiServiceRequest)
    if err != nil {
        http.Error(w, "Failed to marshal request data", http.StatusInternalServerError)
        return
    }

    // Send the request to the AI service (assumes AI service is HTTP-based)
    resp, err := http.Post("http://localhost:8000/analyze", "application/json", bytes.NewReader(requestPayload))
    if err != nil {
        log.Printf("Error connecting to AI service: %v", err)
        http.Error(w, "Failed to connect to AI service", http.StatusInternalServerError)
        return
    }

    defer resp.Body.Close()

    // Check if the AI service returned a successful response
    if resp.StatusCode != http.StatusOK {
        log.Printf("AI service error: %v", resp.Status)
        http.Error(w, "AI service returned an error", http.StatusInternalServerError)
        return
    }

    // Read the response body from the AI service
    responseBody, err := io.ReadAll(resp.Body)
    if err != nil {
        log.Printf("Error reading AI service response: %v", err)
        http.Error(w, "Failed to read AI service response", http.StatusInternalServerError)
        return
    }

    // Set the Content-Type header to application/json (or another appropriate type)
    w.Header().Set("Content-Type", "application/json")

    // Write the AI service response back to the frontend
    w.WriteHeader(http.StatusOK)
    w.Write(responseBody)
}


func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Error upgrading WebSocket: %v", err)
		return
	}
	defer conn.Close()

	log.Printf("Client connected: %s", r.RemoteAddr)

	// Establish a persistent connection to the AI service
	aiConn, _, err := websocket.DefaultDialer.Dial("ws://localhost:8000/debate", nil)
	if err != nil {
		log.Printf("Error connecting to AI service: %v", err)
		return
	}
	defer aiConn.Close()

	go func() {
		for {
			// Read messages from the AI service and send them back to the client
			_, response, err := aiConn.ReadMessage()
			if err != nil {
				log.Printf("Error reading from AI service: %v", err)
				break
			}
			err = conn.WriteMessage(websocket.TextMessage, response)
			if err != nil {
				log.Printf("Error sending message to client: %v", err)
				break
			}
		}
	}()

	for {
		messageType, prompt, err := conn.ReadMessage()
		if err != nil {
			log.Printf("Error reading WebSocket message: %v", err)
			break
		}

		log.Printf("Received prompt from client: %s", prompt)

		err = aiConn.WriteMessage(messageType, prompt)
		if err != nil {
			log.Printf("Error sending message to AI service: %v", err)
			continue
		}
	}
}

