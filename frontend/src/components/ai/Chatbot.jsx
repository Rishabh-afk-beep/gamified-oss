import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaMicrophone, FaStop } from 'react-icons/fa';
import ChatMessage from './ChatMessage';
import Button from '../common/Button';
import Card from '../common/Card';
import { aiService } from '../../services/aiService';

const Chatbot = ({ questContext = null, taskId = null }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! 👋 I\'m your AI coding assistant. Ask me anything about the current task, concepts, or debugging.',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { 
      role: 'user', 
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiService.sendMessage(input, questContext || taskId);
      
      const aiMessage = { 
        role: 'assistant', 
        content: response.success ? response.response : (response.error || 'Sorry, something went wrong.'),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { 
        role: 'assistant', 
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in your browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
      return;
    }

    setIsRecording(true);

    recognition.onstart = () => {
      console.log('Voice input started');
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };

    recognition.start();
  };

  return (
    <Card className="flex flex-col h-[600px] gap-0 p-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 rounded-t-lg">
        <h3 className="text-lg font-bold">AI Assistant 🤖</h3>
        <p className="text-sm text-primary-100">Ask me anything about coding!</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>👋 Hi! I'm your AI coding assistant.</p>
            <p className="mt-2 text-sm">Ask me questions about your current quest or any coding topic!</p>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-600">
            <div className="animate-spin w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full"></div>
            <p className="text-sm">AI is thinking...</p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex gap-2 mb-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question... (Shift+Enter for new line)"
            className="input flex-1 resize-none"
            rows={2}
            disabled={isLoading}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()}
            variant="primary"
            className="flex-1"
            icon={<FaPaperPlane />}
          >
            Send
          </Button>
          <Button 
            onClick={handleVoiceInput}
            variant={isRecording ? 'danger' : 'secondary'}
            icon={isRecording ? <FaStop /> : <FaMicrophone />}
            title="Voice input"
          >
            {isRecording ? 'Stop' : 'Voice'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Chatbot;
