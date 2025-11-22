import React, { useState, useRef, useEffect } from 'react';
import { aiService } from '../services/aiService';
import { 
  PaperAirplaneIcon,
  LightBulbIcon,
  BookOpenIcon,
  BugAntIcon,
  CodeBracketIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  ClipboardDocumentIcon,
  TrashIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import { 
  ChatBubbleBottomCenterIcon,
  LightBulbIcon as LightBulbSolid,
  SparklesIcon as SparklesSolid
} from '@heroicons/react/24/solid';

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "👋 Hello! I'm your AI coding assistant powered by Google Gemini!\n\nI can help you with:\n✨ Programming concepts and explanations\n🐛 Code debugging and optimization\n💡 Problem-solving hints and guidance\n📚 Learning new technologies\n🎯 Code reviews and best practices\n\nWhat would you like to explore today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [darkMode, setDarkMode] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (type, text) => {
    setMessages(prev => [...prev, {
      id: Date.now() + Math.random(),
      type,
      text,
      timestamp: new Date()
    }]);
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Send chat message via backend
  const sendChatMessage = async () => {
    if (!input.trim() || loading) return;

    try {
      setLoading(true);
      const userMessage = input;
      addMessage('user', userMessage);
      setInput('');

      // Use backend service instead of direct API call
      const response = await aiService.sendMessage(userMessage, context);
      
      // Handle response safely
      if (response && response.success && response.response) {
        addMessage('bot', response.response);
      } else if (response && response.message) {
        addMessage('bot', response.message);
      } else {
        addMessage('bot', '❌ Sorry, I received an empty response. Please try again.');
      }
    } catch (error) {
      console.error('Chat error:', error);
      addMessage('bot', `❌ Error: ${error.message || 'Something went wrong. Please try again.'}`);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  // Get hint using backend
  const getHint = async () => {
    if (!context.trim()) {
      addMessage('bot', '💡 Please add some context about what you need help with in the context box above!');
      return;
    }

    try {
      setLoading(true);
      addMessage('user', '💡 Give me a hint for this problem');

      const response = await aiService.getHint('Current Problem', context, 'beginner');
      
      if (response.success) {
        addMessage('bot', `💡 **Hint:**\n\n${response.hint}`);
      } else {
        addMessage('bot', '❌ Error getting hint. Please try again.');
      }
    } catch (error) {
      console.error('Hint error:', error);
      addMessage('bot', `❌ Error getting hint: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Explain code using backend
  const explainCode = async () => {
    if (!input.trim()) {
      addMessage('bot', '📝 Please paste your code in the input box first!');
      return;
    }

    try {
      setLoading(true);
      addMessage('user', `📝 Please explain this code:\n\`\`\`\n${input}\n\`\`\``);
      
      const response = await aiService.explainCode(input, 'javascript'); // You can detect language
      
      if (response.success) {
        addMessage('bot', response.explanation);
      } else {
        addMessage('bot', '❌ Error explaining code. Please try again.');
      }
      setInput('');
    } catch (error) {
      console.error('Explain error:', error);
      addMessage('bot', `❌ Error explaining code: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Debug code using backend
  const debugCode = async () => {
    if (!input.trim()) {
      addMessage('bot', '🐛 Please paste your code in the input box first!');
      return;
    }

    try {
      setLoading(true);
      addMessage('user', `🐛 Help me debug this code:\n\`\`\`\n${input}\n\`\`\``);

      const response = await aiService.reviewCode(input, 'javascript', 'Debug this code');
      
      if (response.success) {
        addMessage('bot', response.advice);
      } else {
        addMessage('bot', '❌ Error debugging code. Please try again.');
      }
      setInput('');
    } catch (error) {
      console.error('Debug error:', error);
      addMessage('bot', `❌ Error debugging code: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Learn concept using backend
  const learnConcept = async () => {
    if (!input.trim()) {
      addMessage('bot', '📚 Please tell me what concept you want to learn about!');
      return;
    }

    try {
      setLoading(true);
      addMessage('user', `📚 Teach me about: ${input}`);

      const response = await aiService.explainConcept(input, 'beginner');
      
      if (response.success) {
        addMessage('bot', response.content);
      } else {
        addMessage('bot', '❌ Error fetching lesson. Please try again.');
      }
      setInput('');
    } catch (error) {
      console.error('Learn error:', error);
      addMessage('bot', `❌ Error fetching lesson: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (activeTab === 'chat') {
        sendChatMessage();
      }
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        text: "👋 Chat cleared! I'm here to help with any coding questions you have.",
        timestamp: new Date()
      }
    ]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse ${
          darkMode ? 'bg-purple-500' : 'bg-purple-300'
        }`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2s ${
          darkMode ? 'bg-cyan-500' : 'bg-cyan-300'
        }`}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className={`backdrop-blur-md rounded-3xl p-6 mb-6 border transition-colors ${
          darkMode 
            ? 'bg-white/10 border-white/20 text-white' 
            : 'bg-white/70 border-white/40 text-gray-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <SparklesSolid className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Assistant</h1>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Powered by Google Gemini
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className={`p-2 rounded-xl transition-colors ${
                  darkMode 
                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                title="Clear chat"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-xl transition-colors ${
                  darkMode 
                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                title="Toggle theme"
              >
                {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={`backdrop-blur-md rounded-2xl p-2 mb-6 border transition-colors ${
          darkMode 
            ? 'bg-white/5 border-white/10' 
            : 'bg-white/50 border-white/30'
        }`}>
          <div className="flex gap-2">
            <button 
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                activeTab === 'chat'
                  ? darkMode 
                    ? 'bg-white/20 text-white shadow-lg' 
                    : 'bg-white text-gray-800 shadow-lg'
                  : darkMode
                    ? 'text-gray-400 hover:text-white hover:bg-white/10'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/30'
              }`}
              onClick={() => setActiveTab('chat')}
            >
              <ChatBubbleBottomCenterIcon className="w-5 h-5" />
              Chat
            </button>
            <button 
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                activeTab === 'tools'
                  ? darkMode 
                    ? 'bg-white/20 text-white shadow-lg' 
                    : 'bg-white text-gray-800 shadow-lg'
                  : darkMode
                    ? 'text-gray-400 hover:text-white hover:bg-white/10'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/30'
              }`}
              onClick={() => setActiveTab('tools')}
            >
              <WrenchScrewdriverIcon className="w-5 h-5" />
              Tools
            </button>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className={`backdrop-blur-md rounded-3xl border transition-colors ${
          darkMode 
            ? 'bg-white/5 border-white/10' 
            : 'bg-white/50 border-white/30'
        }`}>
          
          {/* Context Input */}
          <div className="p-6 border-b border-white/10">
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Context (optional)
            </label>
            <textarea
              placeholder="Add context about what you're working on..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows="2"
              className={`w-full rounded-xl border transition-colors resize-none ${
                darkMode 
                  ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' 
                  : 'bg-white/70 border-white/40 text-gray-800 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent p-3`}
            />
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ${
                  msg.type === 'user' ? 'ml-auto' : 'mr-auto'
                }`}>
                  <div className={`rounded-2xl p-4 ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white ml-auto'
                      : darkMode
                        ? 'bg-white/10 text-white'
                        : 'bg-white/70 text-gray-800'
                  }`}>
                    <div className="whitespace-pre-wrap break-words">
                      {msg.text}
                    </div>
                    <div className={`text-xs mt-2 ${
                      msg.type === 'user' 
                        ? 'text-white/70' 
                        : darkMode 
                          ? 'text-gray-400' 
                          : 'text-gray-500'
                    }`}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                  {msg.type === 'bot' && (
                    <button
                      onClick={() => copyToClipboard(msg.text)}
                      className={`mt-2 text-xs px-2 py-1 rounded-lg transition-colors ${
                        darkMode 
                          ? 'text-gray-400 hover:text-white hover:bg-white/10' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                      }`}
                    >
                      <ClipboardDocumentIcon className="w-4 h-4 inline mr-1" />
                      Copy
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className={`rounded-2xl p-4 ${
                  darkMode ? 'bg-white/10' : 'bg-white/70'
                }`}>
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-white/10">
            <div className="flex flex-col gap-4">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={activeTab === 'chat' 
                  ? "Ask me anything about coding..." 
                  : "Paste your code here..."}
                disabled={loading}
                rows="3"
                className={`w-full rounded-xl border transition-colors resize-none ${
                  darkMode 
                    ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' 
                    : 'bg-white/70 border-white/40 text-gray-800 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent p-4`}
              />

              {/* Action Buttons */}
              {activeTab === 'chat' ? (
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={sendChatMessage}
                    disabled={loading || !input.trim()}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium py-3 px-6 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                    Send
                  </button>
                  <button
                    onClick={getHint}
                    disabled={loading || !context.trim()}
                    className={`flex items-center gap-2 font-medium py-3 px-6 rounded-xl transition-all ${
                      darkMode 
                        ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' 
                        : 'bg-white/70 hover:bg-white text-gray-800 border border-white/40'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <LightBulbIcon className="w-5 h-5" />
                    Get Hint
                  </button>
                  <button
                    onClick={learnConcept}
                    disabled={loading || !input.trim()}
                    className={`flex items-center gap-2 font-medium py-3 px-6 rounded-xl transition-all ${
                      darkMode 
                        ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' 
                        : 'bg-white/70 hover:bg-white text-gray-800 border border-white/40'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <BookOpenIcon className="w-5 h-5" />
                    Learn Concept
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={explainCode}
                    disabled={loading || !input.trim()}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium py-3 px-6 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <CodeBracketIcon className="w-5 h-5" />
                    Explain Code
                  </button>
                  <button
                    onClick={debugCode}
                    disabled={loading || !input.trim()}
                    className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium py-3 px-6 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <BugAntIcon className="w-5 h-5" />
                    Debug Code
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
