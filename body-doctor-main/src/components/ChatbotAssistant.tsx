import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getChatResponse } from "@/lib/symptomEngine";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatbotAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! 👋 I'm your AI Health Assistant. Ask me anything about symptoms or health concerns.\n\nTry: *\"What does headache with fever mean?\"*" },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    const userMsg: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", content: getChatResponse(text) }]);
    }, 600);
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-health shadow-xl flex items-center justify-center text-primary-foreground"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] h-[480px] rounded-2xl glass-card flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="gradient-health px-4 py-3 flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary-foreground" />
              <span className="font-display font-semibold text-primary-foreground">Health Assistant</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex items-start gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === "user" ? "bg-primary" : "gradient-health"}`}>
                    {m.role === "user" ? <User className="w-3.5 h-3.5 text-primary-foreground" /> : <Bot className="w-3.5 h-3.5 text-primary-foreground" />}
                  </div>
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                    <div className="prose prose-sm max-w-none [&>p]:m-0 [&>ul]:my-1 [&>ul]:pl-4">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border">
              <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask a health question..."
                  className="flex-1 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button type="submit" className="w-9 h-9 rounded-lg gradient-health flex items-center justify-center text-primary-foreground">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
