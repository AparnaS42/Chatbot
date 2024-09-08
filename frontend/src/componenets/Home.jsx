import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Setup speech recognition when component mounts
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.interimResults = true;

      recognition.addEventListener('result', e => {
        const transcript = Array.from(e.results)
          .map(result => result[0].transcript)
          .join('');

        setInputText(transcript); // Update input text with the transcript
      });
    } else {
      console.error('Speech recognition not supported in this browser.');
      alert('Speech recognition is not supported in your browser.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputText.trim()) {
      return;
    }

    try {
      const newMessage = { userInput: inputText, sender: 'user' };
      setMessages([...messages, newMessage]);

      const response = await axios.post('http://localhost:3000/home/messages', { userInput: inputText });

      const botResponse = response.data.response.candidates[0].content.parts[0].text;
      const botMessage = { userInput: botResponse, sender: 'bot' };

      setMessages([...messages, botMessage]);
      setInputText(''); // Clear input field
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/');
    // Implement your logout logic here
  };

  const handleStartRecognition = () => {
    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.start();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Chatbot</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-1">
        <div className="bg-gray-600 p-4 chat-sidebar" style={{ width: '320px', maxHeight: '100%', overflowY: 'auto' }}>
          <h2 className="text-lg font-bold mb-2 mt-8">Previous Chats</h2>
          <ul>
            {messages.map((message, index) => (
              <li key={index} className={`rounded p-2 mb-2 ${message.sender === 'user' ? 'bg-white' : 'bg-gray-300'}`}>
                <span className="font-bold">{message.sender === 'user' ? 'You:' : 'Bot:'}</span> {message.userInput}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 bg-gray-300 p-4">
          <div className="messages flex-1 overflow-y-auto">
            {messages.map((message, index) => (
              <div key={index} className={`message p-2 rounded mb-2 ${message.sender === 'user' ? 'bg-white' : 'bg-gray-300'}`}>
                <span className="font-bold">{message.sender === 'user' ? 'You:' : 'Bot:'}</span> {message.userInput}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-4 flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 p-2 border border-gray-300 rounded mr-2"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors mr-2"
            >
              Send
            </button>
            <div className="text-bold text-end"> 
              <button
                id="click_to_record"
                onClick={handleStartRecognition}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors ml-2"
              >
                Voice To Text
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
