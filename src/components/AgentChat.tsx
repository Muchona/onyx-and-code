import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

interface Message {
    id: number;
    type: 'user' | 'agent';
    text: string;
}

export default function AgentChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, type: 'agent', text: 'Protocol initialized. Agent CORE online. How can I assist you with your digital architecture?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const toggleChat = () => setIsOpen(!isOpen);

    useEffect(() => {
        if (chatRef.current) {
            if (isOpen) {
                gsap.to(chatRef.current, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });
            } else {
                gsap.to(chatRef.current, { scale: 0.9, opacity: 0, duration: 0.3, ease: "power2.in" });
            }
        }
    }, [isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now(), type: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate Agent Response
        setTimeout(() => {
            const agentResponses = [
                "Analyzing request parameters...",
                "Accessing Onyx secure database...",
                "That is within our operational capabilities.",
                "I can schedule a briefing with the Chairman.",
                "Deploying visualization protocols."
            ];
            const randomResponse = agentResponses[Math.floor(Math.random() * agentResponses.length)];

            const agentMsg: Message = { id: Date.now() + 1, type: 'agent', text: randomResponse };
            setMessages(prev => [...prev, agentMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
            {/* Chat Window */}
            <div
                ref={chatRef}
                className="w-80 md:w-96 bg-onyx-light/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 origin-bottom-right opacity-0 transform scale-90 transition-all"
                style={{ display: isOpen ? 'flex' : 'none' }} // Simple toggle for now, GSAP handles anim
            >
                <div className="flex flex-col h-[400px] w-full">
                    {/* Header */}
                    <div className="bg-black/50 p-4 border-b border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="font-mono text-xs text-gold-accent tracking-widest">AGENT_CORE_V1</span>
                        </div>
                        <button onClick={toggleChat} className="text-gray-400 md:hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 text-sm rounded-lg ${msg.type === 'user'
                                    ? 'bg-gold-accent text-black font-semibold'
                                    : 'bg-white/10 text-gray-200 border border-white/5'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 p-3 rounded-lg flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-black/30">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Enter directive..."
                                className="flex-1 bg-transparent border-none text-white placeholder-gray-600 text-sm focus:ring-0 outline-none"
                            />
                            <button type="submit" className="text-gold-accent md:hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={toggleChat}
                className="group relative w-14 h-14 rounded-full bg-onyx border border-white/20 shadow-lg md:hover:border-gold-accent transition-all duration-300 flex items-center justify-center overflow-hidden"
            >
                <div className="absolute inset-0 bg-gold-accent/10 group-hover:bg-gold-accent/20 transition-colors"></div>
                <div className={`w-8 h-8 transition-transform duration-300 ${isOpen ? 'rotate-90 scale-0 opacity-0 absolute' : 'scale-100 opacity-100'}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white w-full h-full">
                        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" />
                    </svg>
                </div>
                <div className={`w-6 h-6 transition-transform duration-300 ${!isOpen ? '-rotate-90 scale-0 opacity-0 absolute' : 'rotate-0 scale-100 opacity-100'}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold-accent w-full h-full">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </div>
            </button>
        </div>
    );
}
