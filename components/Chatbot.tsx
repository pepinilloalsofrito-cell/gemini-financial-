
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getChatbotResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { MessageCircleIcon, XIcon, SendIcon, UserIcon, BotIcon } from './Icons';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  useEffect(() => {
    if(isOpen) {
        setMessages([{ role: 'model', content: "Hello! I'm Gemini Finance, your AI assistant. How can I help you with your finances today?" }]);
    }
  }, [isOpen]);

  const handleSendMessage = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getChatbotResponse(input);
      const modelMessage: ChatMessage = { role: 'model', content: response };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: ChatMessage = { role: 'model', content: 'Sorry, something went wrong. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-full p-4 shadow-lg transform hover:scale-110 transition-all duration-200"
          aria-label="Toggle chatbot"
        >
          {isOpen ? <XIcon className="w-8 h-8" /> : <MessageCircleIcon className="w-8 h-8" />}
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-sm h-[60vh] bg-slate-800 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-slate-700">
          <header className="bg-slate-900/70 p-4 flex justify-between items-center border-b border-slate-700">
            <h3 className="font-bold text-lg text-slate-100">Gemini Finance Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <XIcon className="w-6 h-6" />
            </button>
          </header>

          <main className="flex-1 p-4 overflow-y-auto chatbot-messages">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center"><BotIcon className="w-5 h-5 text-cyan-400" /></div>}
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-cyan-600 text-white rounded-br-none'
                        : 'bg-slate-700 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm break-words" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br />') }} />
                  </div>
                   {msg.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center"><UserIcon className="w-5 h-5 text-slate-200" /></div>}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center"><BotIcon className="w-5 h-5 text-cyan-400" /></div>
                    <div className="bg-slate-700 text-slate-200 rounded-2xl rounded-bl-none px-4 py-3">
                       <div className="flex items-center space-x-1">
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75"></span>
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></span>
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-300"></span>
                       </div>
                    </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </main>

          <footer className="p-4 border-t border-slate-700 bg-slate-800">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-slate-700 border border-slate-600 rounded-full py-2 px-4 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-full p-2 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                disabled={isLoading || !input.trim()}
              >
                <SendIcon className="w-5 h-5" />
              </button>
            </form>
          </footer>
        </div>
      )}
    </>
  );
};

export default Chatbot;
