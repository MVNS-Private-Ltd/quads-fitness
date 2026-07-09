import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { buildApiUrl } from '../lib/apiBase'

const faqs = [
  { q: "What are your timings?", a: "We're open Mon–Sat: 5 AM – 10 PM and Sunday: 7 AM – 7 PM. 💪" },
  { q: "Do you offer a free trial?", a: "Yes! Your first class is absolutely FREE. Just walk in or WhatsApp us to book your slot. 🎉" },
  { q: "What programs do you offer?", a: "We offer Strength Training, HIIT, Yoga, Zumba, CrossFit, Boxing, and Personal Training. 🏋️" },
  { q: "Monthly membership price?", a: "Plans start from ₹999/month. We also have 3-month and yearly packages with great discounts! 📋" },
  { q: "Where are you located?", a: "We're located in Ludhiana, Punjab. WhatsApp us for the exact address and directions! 📍" },
]

const botIntro = "Hey there! 👋 I'm the **Quads AI Assistant**. How can I help you today?"

const SYSTEM_PROMPT = `You are the Quads Fitness AI Assistant.
Your job:
- Answer questions using ONLY live data from the Quads Fitness system.
- Always use the latest information stored in the database.
- Never rely on your own assumptions; treat the Quads database as the single source of truth.

DATA ACCESS RULES:
1) Fetch live data before answering anything about programs, plans, trainers, offers, or gym details (settings).
2) Never invent data (program names, prices, timings, trainers, etc.).

API CONTRACT:
Use the provided tools to fetch JSON from APIs:
- getPrograms: list of current programs
- getPlans: list of membership plans
- getTrainers: trainers and their specialties
- getOffers: active offers/announcements
- getSettings: gym name, address, contact info, opening hours

If data is not present, say it honestly. Keep answers brief, friendly, and aggressive-gym themed.`;

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ from: 'bot', text: botIntro }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [pulse, setPulse] = useState(true)
  const endRef = useRef(null)

  const conversation = useRef([
    { role: 'system', content: SYSTEM_PROMPT }
  ])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])
  useEffect(() => { const t = setTimeout(() => setPulse(false), 4000); return () => clearTimeout(t) }, [])

  const fetchGroq = async (msgs, tools) => {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: msgs,
        tools: tools,
        tool_choice: 'auto',
        max_tokens: 300,
        temperature: 0.1
      })
    });
    if (!res.ok) throw new Error("Groq API error");
    return res.json();
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return
    setMessages(m => [...m, { from: 'user', text }])
    setInput('')
    setTyping(true)

    conversation.current.push({ role: 'user', content: text });

    try {
      let apiMessages = [...conversation.current];

      const tools = [
        { type: "function", function: { name: "getPrograms", description: "Get list of gym programs" } },
        { type: "function", function: { name: "getPlans", description: "Get list of membership plans" } },
        { type: "function", function: { name: "getTrainers", description: "Get list of trainers" } },
        { type: "function", function: { name: "getOffers", description: "Get active offers" } },
        { type: "function", function: { name: "getSettings", description: "Get gym settings, location, contact info, timings" } }
      ];

      let data = await fetchGroq(apiMessages, tools);
      let message = data.choices[0].message;

      // Handle tool calls
      if (message.tool_calls) {
        apiMessages.push(message); // append the assistant's tool call request

        for (const toolCall of message.tool_calls) {
          const fnName = toolCall.function.name;
          let result = "No data";
          try {
            const apiRoute = fnName.replace('get', '').toLowerCase(); // e.g. getPrograms -> programs
            const res = await fetch(buildApiUrl(apiRoute), { cache: 'no-store' });
            if (res.ok) {
              const resData = await res.json();
              result = JSON.stringify(resData);
            }
          } catch (e) {
            result = "Error fetching data";
          }
          apiMessages.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: fnName,
            content: result
          });
        }

        // Fetch final answer
        data = await fetchGroq(apiMessages, tools);
        message = data.choices[0].message;
      }

      conversation.current = apiMessages;
      conversation.current.push(message);

      setMessages(m => [...m, { from: 'bot', text: message.content }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(m => [...m, { from: 'bot', text: "I'm having trouble reaching the gym data right now. You can still contact the gym directly for exact details! 🔧" }]);
    } finally {
      setTyping(false);
    }
  }

  return (
    <>
      {/* FAB Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Tooltip bubble */}
        <AnimatePresence>
          {pulse && !open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white text-brand-dark text-sm font-semibold px-4 py-2 rounded-2xl rounded-br-none shadow-xl whitespace-nowrap"
            >
              💬 Chat with us!
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => { setOpen(o => !o); setPulse(false) }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 rounded-full bg-brand-orange shadow-2xl shadow-orange-500/50 flex items-center justify-center relative"
          aria-label="Open chat"
        >
          {/* Ping ring */}
          {!open && (
            <span className="absolute inset-0 rounded-full bg-brand-orange animate-ping opacity-40" />
          )}
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} className="text-white text-2xl font-bold leading-none">✕</motion.span>
            ) : (
              <motion.svg key="chat" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-7 h-7">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-[#111] border border-white/10 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col"
            style={{ maxHeight: '520px' }}
          >
            {/* Header */}
            <div className="bg-brand-orange px-5 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">🤖</div>
              <div>
                <p className="text-white font-bold text-sm">Quads AI Assistant</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-white/80 text-xs">Online • Replies instantly</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0" style={{ maxHeight: '280px' }}>
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.from === 'user'
                      ? 'bg-brand-orange text-white rounded-br-sm'
                      : 'bg-white/8 text-white/90 rounded-bl-sm border border-white/5'
                    }`}>
                    {m.text.replace(/\*\*(.*?)\*\*/g, '$1')}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-white/8 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} className="w-2 h-2 rounded-full bg-white/50"
                        animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Quick replies */}
            <div className="px-4 pb-2 flex gap-2 flex-wrap">
              {faqs.slice(0, 3).map(f => (
                <button
                  key={f.q}
                  onClick={() => sendMessage(f.q)}
                  className="text-xs text-brand-orange border border-brand-orange/30 hover:bg-brand-orange/10 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
                >
                  {f.q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/5 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                placeholder="Ask anything..."
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-brand-orange/50 transition-colors"
              />
              <button
                onClick={() => sendMessage(input)}
                className="w-10 h-10 rounded-full bg-brand-orange hover:bg-orange-500 flex items-center justify-center transition-colors flex-shrink-0"
                aria-label="Send message"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
