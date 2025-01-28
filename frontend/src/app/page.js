"use client"
import axios from "axios"
import { useState } from "react"

export default function Home() {
  const [data, setData] = useState("")
  const [analysis, setAnalysis] = useState("") // For storing analysis response

  const send_request = async () => {
    try {
      console.log("Input for debate: " + '{prompt:"HI"}')
      // Sending the existing request to /debate
      const response = await axios.post("http://localhost:8080/debate", null, {
        params: { prompt: "Hi" },
      });
      
      console.log(response);
      setData(JSON.stringify(response.data));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const analyze_request = async () => {
    try {
      // Sending a dummy conversation for analysis to /analyze
      const dummyConversation = {
        "plastic is good": "but it increases pollution",
        "But now we have processing plants for making petrol from plastic": "but, their number is not enough"
      };

      console.log("Input for analysis: "+JSON.stringify(dummyConversation))

      // Sending the debate_text directly without wrapping it inside "data"
      const response = await axios.post("http://localhost:8080/analyze", {
        debate_text: JSON.stringify(dummyConversation) // Correct payload structure
      });

      console.log(response);
      setAnalysis(JSON.stringify(response.data)); // Store the analysis result
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="text-center">
      {/* Existing button to send prompt to /debate */}
      <button
        className="bg-white text-center text-black object-center justify-center"
        onClick={send_request}>
        Send + {data}
      </button>

      {/* New button to send dummy conversation to /analyze */}
      <button
        className="bg-white text-center text-black object-center justify-center mt-4"
        onClick={analyze_request}>
        Analyze + {analysis}
      </button>
    </div>
  )
}
