import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageSquare, X, Send, Bot, User, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { aiApi } from '../../services/api';
import { getProductImage } from '../../utils/imageHelper';

const AiShoppingBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "👋 Hi there! I'm your **ShopSphere AI Shopping Concierge**. Ask me anything like *'Best shoes for running'*, *'Phone with great camera'*, or *'Gifts under ₹5000'*!",
      products: []
    }
  ]);

  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "🔥 What's trending?",
    "👟 Running shoes",
    "📱 Best 5G Phone",
    "🎧 Noise cancelling earbuds",
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Global event listener for mobile bottom nav AI button
  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    window.addEventListener('toggle-ai-shopping-bot', handleToggle);
    window.addEventListener('open-ai-shopping-bot', handleOpen);
    window.addEventListener('close-ai-shopping-bot', handleClose);

    return () => {
      window.removeEventListener('toggle-ai-shopping-bot', handleToggle);
      window.removeEventListener('open-ai-shopping-bot', handleOpen);
      window.removeEventListener('close-ai-shopping-bot', handleClose);
    };
  }, []);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query, products: [] };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await aiApi.getAssistant(query);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: res.data?.aiAnswer || "Here are some great options matching your query!",
        products: res.data?.recommendedProducts || []
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: "I couldn't fetch live recommendations right now. Please browse our catalog filters or try again!",
          products: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-3 sm:right-6 z-50">
      {/* Floating Trigger Button (Desktop View) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="hidden lg:flex group relative items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white rounded-full shadow-2xl hover:shadow-emerald-500/25 transition-all transform hover:scale-105 active:scale-95 border border-white/20"
        >
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-xs font-bold tracking-wide">AI Assistant</span>
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300"></span>
          </span>
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-[92vw] sm:w-96 h-[540px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-5 py-4 flex items-center justify-between text-white border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-slate-950">
                <Bot className="w-4 h-4 font-bold" />
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-wide flex items-center gap-1.5">
                  <span>ShopSphere AI Assistant</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-semibold">Online</span>
                </h3>
                <p className="text-[10px] text-slate-400">Natural language product finder</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap text-[10px] font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full transition-all shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className="max-w-[82%] space-y-2">
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Recommended Products Carousel/Cards */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {msg.products.map((p) => (
                        <div
                          key={p.id}
                          className="bg-white border border-slate-200/80 rounded-xl p-2 flex items-center gap-2.5 shadow-sm hover:border-emerald-500 transition-all"
                        >
                          <img
                            src={getProductImage(p)}
                            alt={p.name}
                            className="w-11 h-11 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-slate-900 truncate">{p.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] font-black text-emerald-600">₹{p.price?.toLocaleString('en-IN')}</span>
                              <span className="text-[10px] text-amber-500 flex items-center gap-0.5 font-semibold">
                                <Star className="w-2.5 h-2.5 fill-amber-500" />
                                {p.averageRating}
                              </span>
                            </div>
                          </div>
                          <Link
                            to={`/product/${p.slug || p.id}`}
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-lg transition-colors shrink-0"
                            title="View Product"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-slate-400 text-xs italic">
                <Bot className="w-4 h-4 text-indigo-500 animate-spin" />
                <span>Thinking & querying catalog...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for recommendations..."
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AiShoppingBot;
