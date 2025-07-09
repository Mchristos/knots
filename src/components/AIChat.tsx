import React, { useState, useEffect, useRef } from 'react';
import { MockAIService } from '../services/aiService'; // Using MockAIService for demonstration
import { Knot } from '../types'; // Assuming Knot type is defined in types.ts

/**
 * Defines the structure for a chat message.
 * @property {string} text - The content of the message.
 * @property {'user' | 'ai'} sender - Indicates who sent the message (user or AI).
 * @property {Knot[]} [knots] - Optional array of suggested knots, relevant for AI messages.
 */
interface Message {
  text: string;
  sender: 'user' | 'ai';
  knots?: Knot[];
}

/**
 * AIChat component provides an interactive chat interface for users to ask questions
 * about knots and receive AI-powered suggestions.
 * It uses a mock AI service for demonstration purposes, which can be swapped out
 * for real AI API integrations (e.g., Gemini, OpenAI, Claude).
 */
const AIChat: React.FC = () => {
  // State to store all chat messages
  const [messages, setMessages] = useState<Message[]>([]);
  // State to manage the current input field value
  const [input, setInput] = useState<string>('');
  // Ref for the chat messages container to enable auto-scrolling
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize the AI service. Replace MockAIService with a real AI service
  // (e.g., new GeminiAIService(API_KEY)) when integrating actual AI APIs.
  const aiService = new MockAIService();

  /**
   * Scrolls the chat messages container to the bottom whenever new messages are added.
   */
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]); // Dependency array ensures this effect runs when 'messages' state changes

  /**
   * Handles sending a message from the user.
   * - Adds the user's message to the chat.
   * - Clears the input field.
   * - Calls the AI service to get a response.
   * - Adds the AI's response (explanation and suggested knots) to the chat.
   * - Handles potential errors during the AI service call.
   */
  const handleSendMessage = async () => {
    if (input.trim()) { // Ensure input is not empty or just whitespace
      const userMessage: Message = { text: input, sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput(''); // Clear input field immediately

      try {
        // Get suggestions from the AI service
        const aiResponse = await aiService.getKnotSuggestions(input);
        const aiMessage: Message = {
          text: aiResponse.explanation,
          sender: 'ai',
          knots: aiResponse.knots,
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } catch (error) {
        console.error('Error getting AI response:', error);
        // Display an error message to the user if the AI service fails
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Sorry, something went wrong. Please try again.', sender: 'ai' },
        ]);
      }
    }
  };

  /**
   * Handles key press events in the input field.
   * Triggers message sending when the 'Enter' key is pressed.
   * @param {React.KeyboardEvent<HTMLInputElement>} e - The keyboard event.
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="ai-chat-container">
      <h3>Knot AI Assistant</h3>
      <div className="chat-messages" ref={chatContainerRef}>
        {/* Render each message in the chat history */}
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <p>{message.text}</p>
            {/* Display suggested knots if available in the AI message */}
            {message.knots && message.knots.length > 0 && (
              <div className="suggested-knots">
                <h4>Suggested Knots:</h4>
                <ul>
                  {message.knots.map((knot) => (
                    <li key={knot.id}>
                      {/* Link to the knot details using hash-based routing */}
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
          aria-label="Ask about knots"
        />
        <button onClick={handleSendMessage} aria-label="Send message">
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChat;
