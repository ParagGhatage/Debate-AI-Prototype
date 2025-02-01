import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input"; 
import { useLocation } from 'react-router-dom';
import SmoothScroll from "@/components/ui/SmoothScroll"; 

type Message = {
  role: 'user' | 'ai';
  content: string;
};

const Debate: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const topic = searchParams.get('topic') || 'Unknown Topic';

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const socket = new WebSocket('ws://localhost:8080/debate');  // Corrected WebSocket URL

    socket.onopen = () => {
      console.log('WebSocket connection established');
      // Send initial message to start the debate
      socket.send(`Let's begin our debate on "${topic}". What's your opening argument?`);
    };

    socket.onmessage = (event) => {
      setMessages(prev => [...prev, { role: 'ai', content: event.data }]);
      setIsTyping(false);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [topic]);

  const handleSendMessage = () => {
    if (input.trim() && ws?.readyState === WebSocket.OPEN) {  // Check WebSocket is open before sending
      setMessages(prev => [...prev, { role: 'user', content: input }]);
      setInput('');
      setIsTyping(true);
      
      ws.send(input);
    } else {
      console.error('WebSocket is not open');
    }
  };

  // Function to send chat history to the /analyze route
  

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="bg-gradient-to-r from-black to-gray-800 text-white p-6 shadow-lg rounded-b-lg">
        <h1 className="text-3xl font-semibold">{`Debating: ${topic}`}</h1>
      </header>
      <div className="flex-grow p-4 custom-scrollbar smooth-scroll" >

      <SmoothScroll >
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-lg max-w-[80%] mb-4 ${
                message.role === 'user'
                  ? 'bg-black text-white ml-auto shadow-lg hover:bg-gray-900 transition-colors'
                  : 'bg-gray-100 text-black border border-gray-300 shadow-sm hover:bg-gray-200 transition-colors'
              }`}
            >
              {message.content}
            </motion.div>
          ))}
        </AnimatePresence>
      </SmoothScroll>
      </div>
      

      <div className="p-6 bg-gray-100 border-t border-gray-200 flex flex-col space-y-2">
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 rounded-lg max-w-[80%] mb-4 bg-gray-200 text-black border border-gray-300 italic text-sm shadow-sm typing-indicator"
          >
            AI is typing...
          </motion.div>
        )}

        <div className="flex space-x-3 items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your argument here..."
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            autoFocus
            className="border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-md transition-all duration-200 ease-in-out px-4 py-2 w-full"
          />
          <Button
            onClick={handleSendMessage}
            className="bg-black text-white hover:bg-gray-800 transition-all duration-300 rounded-lg p-2 shadow-lg"
          >
            Send
          </Button>
        </div>

        
      </div>
    </div>
  );
};

export default Debate;
