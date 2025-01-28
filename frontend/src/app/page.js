"use client"
import { useEffect, useState } from "react"
import axios from "axios";

export default function Home() {
  const [data, setData] = useState("")  // For storing response from the debate
  const [analysis, setAnalysis] = useState("")  // For storing analysis response
  const [socket, setSocket] = useState(null)  // For storing the WebSocket connection
  const [isSocketOpen, setIsSocketOpen] = useState(false); // Track WebSocket connection state
  const [socketError, setSocketError] = useState(""); // Track WebSocket errors

  // Initialize WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      const socketConnection = new WebSocket("ws://localhost:8080/debate");

      socketConnection.onopen = () => {
        console.log("WebSocket Connected");
        setIsSocketOpen(true);  // Set connection state to open
        setSocketError(""); // Clear any previous errors
      };

      socketConnection.onerror = (error) => {
        console.error("WebSocket Error: ", error);
        setSocketError("WebSocket connection error"); // Store error
      };

      socketConnection.onmessage = (event) => {
        console.log("Received from AI: ", event.data);
        setData(event.data);  // Set the AI response to state
      };

      socketConnection.onclose = () => {
        console.log("WebSocket Closed");
        setIsSocketOpen(false); // Set connection state to closed
        // Attempt to reconnect after a delay if the WebSocket was closed unexpectedly
        setTimeout(connectWebSocket, 5000); // Reconnect after 5 seconds
      };

      // Save the WebSocket connection
      setSocket(socketConnection);
    };

    connectWebSocket(); // Initialize WebSocket connection

    // Cleanup on component unmount
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  // Function to send prompt through WebSocket
  const send_request = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const prompt = "Hi";
      console.log("Sending prompt: " + prompt);
      socket.send(prompt);  // Send the prompt to the backend via WebSocket
    } else {
      console.error("WebSocket is not open");
      setSocketError("WebSocket is not open"); // Display error to the user
    }
  };

  // For sending data to /analyze (no WebSocket used here)
  const analyze_request = async () => {
    try {
      const dummyConversation = {
        "plastic is good": "but it increases pollution",
        "But now we have processing plants for making petrol from plastic": "but, their number is not enough"
      };

      console.log("Input for analysis: " + JSON.stringify(dummyConversation));

      const response = await axios.post("http://localhost:8080/analyze", {
        debate_text: JSON.stringify(dummyConversation)
      });

      console.log(response);
      setAnalysis(JSON.stringify(response.data));  // Store the analysis result
    } catch (error) {
      console.error("Error:", error);
      setSocketError("Failed to analyze: " + error.message); // Display error to the user
    }
  };

  return (
    <div className="text-center">
      {/* Button to send prompt to /debate via WebSocket */}
      <button
        className="bg-white text-center text-black object-center justify-center"
        onClick={send_request}
        disabled={!isSocketOpen}> {/* Disable button if WebSocket is not open */}
        Send + {data}
      </button>

      {/* Button to send dummy conversation to /analyze */}
      <button
        className="bg-white text-center text-black object-center justify-center mt-4"
        onClick={analyze_request}>
        Analyze + {analysis}
      </button>

      {/* Display WebSocket connection status */}
      {socketError && <div className="text-red-500 mt-4">{socketError}</div>} {/* Display WebSocket error if exists */}
    </div>
  );
}
