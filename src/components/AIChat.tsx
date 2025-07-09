import React, { useState, useEffect, useRef } from 'react';
import { MockAIService } from '../services/aiService';
import { Knot } from '../types'; // Assuming Knot type is defined here

interface Message {
  text: string;
  sender: 'user' | 'ai';
  knots?: Knot[];
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const aiService = new MockAIService(); // Use MockAIService for now

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const userMessage: Message = { text: input, sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput('');

      try {
        const aiResponse = await aiService.getKnotSuggestions(input);
        const aiMessage: Message = {
          text: aiResponse.explanation,
          sender: 'ai',
          knots: aiResponse.knots,
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } catch (error) {
        console.error('Error getting AI response:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Sorry, something went wrong. Please try again.', sender: 'ai' },
        ]);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="ai-chat-container">
      <h3>Knot AI Assistant</h3>
      <div className="chat-messages" ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <p>{message.text}</p>
            {message.knots && message.knots.length > 0 && (
              <div className="suggested-knots">
                <h4>Suggested Knots:</h4>
                <ul>
                  {message.knots.map((knot) => (
                    <li key={knot.id}>
                      <a href={`#${knot.id}`}>{knot.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about knots..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default AIChat;
