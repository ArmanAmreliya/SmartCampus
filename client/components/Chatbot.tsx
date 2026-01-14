import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { ChatMessage, Faculty } from '../types';
import { generateChatResponse } from '../services/geminiService';

interface ChatbotProps {
  facultyData: Faculty[];
  embedded?: boolean; // Prop to allow embedding in a page instead of floating
}

export const Chatbot: React.FC<ChatbotProps> = ({ facultyData, embedded = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', text: 'Hi! I am the SmartCampus Assistant. Ask me about faculty availability, exam forms, or campus timings.', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await generateChatResponse(userMsg.text, facultyData, []);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Sorry, I'm having trouble connecting right now.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (embedded) {
    return (
      <div className="flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden shadow-lg">
         <div className="bg-bgSecondary p-4 border-b border-border flex items-center space-x-2">
            <Bot className="w-5 h-5 text-accent" />
            <span className="font-semibold text-textPrimary">SmartCampus Assistant</span>
         </div>
         <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bgPrimary/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-transparent border border-accent text-accent rounded-br-none'
                      : 'bg-bgSecondary text-textPrimary rounded-bl-none'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
             {isLoading && (
               <div className="flex justify-start">
                  <div className="bg-bgSecondary px-4 py-2 rounded-2xl rounded-bl-none text-textSecondary text-sm">
                    Thinking...
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
         </div>
         <div className="p-4 bg-bgSecondary border-t border-border">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask query..."
                className="flex-1 bg-bgPrimary border border-border rounded-full px-4 py-2 text-sm text-textPrimary focus:outline-none focus:border-accent"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2 bg-accent text-bgPrimary rounded-full hover:bg-accentHover disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-accent text-bgPrimary rounded-full shadow-2xl hover:bg-accentHover transition-transform transform hover:scale-105 z-40 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageCircle className="w-8 h-8" />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border z-50">
          <div className="bg-bgSecondary p-4 flex justify-between items-center text-textPrimary border-b border-border">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-accent" />
              <span className="font-semibold">Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-accent p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-bgPrimary space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-transparent border border-accent text-accent rounded-br-none'
                      : 'bg-bgSecondary border border-border text-textPrimary rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                  <div className="bg-bgSecondary border border-border px-4 py-2 rounded-2xl rounded-bl-none text-textSecondary text-sm">
                    Thinking...
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-bgSecondary border-t border-border">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about faculty or exams..."
                className="flex-1 bg-bgPrimary border border-border rounded-full px-4 py-2 text-sm text-textPrimary focus:outline-none focus:border-accent"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2 bg-accent text-bgPrimary rounded-full hover:bg-accentHover disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};