import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  Sparkles,
  User,
  ExternalLink,
  ChevronDown,
  CornerDownLeft,
} from 'lucide-react';
import { chatWithAi } from '../../services/api';

export default function AiAssistantWidget({ profile, isOpen: externalIsOpen, onToggle: externalOnToggle }) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const toggleOpen = () => {
    if (externalOnToggle) {
      externalOnToggle(!isOpen);
    } else {
      setInternalIsOpen(!isOpen);
    }
  };

  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text:
        profile?.ai_welcome_message ||
        "Hello! I am Vikash's AI Twin powered by Google Gemini. Feel free to ask me anything about Vikash's 5+ years of software experience, 3D WebGL projects, tech stack, or booking a consultation.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "What are Vikash's top projects?",
    "Tell me about his backend & 2FA stack",
    "How can I hire or collaborate with him?",
    "Show his 3D WebGL experience",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await chatWithAi(query, historyPayload);

      const assistantMsg = {
        sender: 'assistant',
        text: res.reply || 'I am happy to assist you with any questions regarding Vikash!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: res.source,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text:
            "Vikash specializes in full-stack architecture (React 19, Laravel 11, Three.js, MySQL 8.0, 2FA security). You can reach him directly via the contact form on this page or email him at " +
            (profile?.email || 'vikash@example.com'),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop when open */}
      {isOpen && (
        <div
          onClick={toggleOpen}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 md:hidden"
        />
      )}

      {/* Expanded Chat Window (Native Bottom Sheet on Mobile, Floating Card on Desktop) */}
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 md:inset-auto md:bottom-20 md:right-6 z-50 w-full md:w-[410px] h-[90vh] md:h-[540px] max-h-[92vh] md:max-h-[82vh] bg-[#0e0408]/95 backdrop-blur-2xl border-t md:border border-white/15 rounded-t-[32px] md:rounded-3xl shadow-2xl shadow-red-950/80 flex flex-col overflow-hidden text-white transition-all duration-300 animate-slideUp md:animate-fadeIn">
          {/* Header */}
          <div className="px-5 py-4 bg-[#14060c] border-b border-white/10 text-white flex flex-col shadow-md">
            {/* Mobile Drag Indicator Bar */}
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-3 md:hidden" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-red-500/15 border border-red-400/40 flex items-center justify-center font-bold text-sm shadow-inner">
                    <Sparkles className="w-5 h-5 text-red-400" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#14060c]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                    Vikash AI Assistant
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 font-mono font-medium">
                      Gemini API
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Direct Digital Twin &amp; Portfolio Guide
                  </p>
                </div>
              </div>

              <button
                onClick={toggleOpen}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#090305]/90">
            {messages.map((m, idx) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      isUser
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white'
                        : 'bg-gradient-to-br from-red-500 to-rose-600 text-white'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-[13px] leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-tr-none'
                        : 'bg-[#180810] border border-white/10 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                    <span
                      className={`text-[9px] block mt-1 text-right font-mono ${
                        isUser ? 'text-red-200' : 'text-slate-400'
                      }`}
                    >
                      {m.time}
                    </span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-red-400 text-xs px-2 py-1">
                <div className="w-6 h-6 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3.5 py-2.5 bg-[#12050a] border-t border-white/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="whitespace-nowrap text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/5 hover:bg-red-500/15 text-slate-300 hover:text-red-300 border border-white/10 hover:border-red-400/40 transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#12050a] border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about Vikash..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-red-400 focus:bg-slate-900 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-500/20 transition-transform active:scale-95 disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating 3D Hologram Toggle Button (Desktop Only: on mobile, bottom dock provides it) */}
      <button
        onClick={toggleOpen}
        className="hidden md:flex fixed bottom-6 right-6 z-40 group items-center gap-3 px-4 py-3 rounded-full bg-[#0e0408]/92 backdrop-blur-2xl border border-red-500/30 text-white shadow-2xl shadow-red-950/80 hover:border-red-400/60 hover:shadow-red-500/25 transition-all duration-300 hover:scale-105 cursor-pointer ring-1 ring-white/10"
      >
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-500/20 to-rose-500/20 border border-red-400/40 flex items-center justify-center shadow-inner">
            <Sparkles className="w-4 h-4 text-red-400 group-hover:rotate-12 transition-transform" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-400 border border-[#0e0408]" />
          </span>
        </div>

        <div className="text-left hidden sm:block pr-1">
          <span className="text-xs font-bold block leading-tight text-white group-hover:text-red-400 transition-colors">Chat with Vikash</span>
          <span className="text-[10px] text-red-400 font-mono flex items-center gap-1">
            <Bot className="w-2.5 h-2.5 text-red-400" />
            Gemini AI Twin
          </span>
        </div>
      </button>
    </>
  );
}
