import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Mail, Copy, Check, Compass, Sparkles, ExternalLink, Send, X } from 'lucide-react';

interface EmailDraftData {
    subject: string;
    projectScope: string;
    estimatedBudget?: string;
}

interface Message {
    id: number;
    type: 'user' | 'agent';
    text: string;
    emailDraft?: EmailDraftData;
    navSection?: {
        id: string;
        label: string;
    };
    projectHighlight?: {
        name: string;
        url: string;
    };
}

const FOUNDER_EMAIL = "mamikon@onyxandcode.com";

export default function AgentChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            type: 'agent',
            text: 'Hello! I am Emily, your digital architecture agent. I can guide you through our work, estimate your project, or prepare a direct email brief for Mamikon.'
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [copiedId, setCopiedId] = useState<number | null>(null);

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

    useEffect(scrollToBottom, [messages, isTyping]);

    const handleCopy = (msgId: number, textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy);
        setCopiedId(msgId);
        setTimeout(() => setCopiedId(null), 2500);
    };

    const navigateToSection = (sectionId: string) => {
        const el = document.getElementById(sectionId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleQuickAction = (promptText: string) => {
        setInput(promptText);
        // trigger direct submit simulation
        executePrompt(promptText);
    };

    const executePrompt = async (userInput: string) => {
        if (!userInput.trim()) return;

        const userMsg: Message = { id: Date.now(), type: 'user', text: userInput };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

            if (apiKey && apiKey !== 'YOUR_API_KEY_HERE') {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({
                    model: "gemini-2.5-flash",
                    tools: [{
                        functionDeclarations: [
                            {
                                name: "prepare_email_draft",
                                description: "Prepare a formatted direct email brief to send to founder Mamikon (mamikon@onyxandcode.com) whenever the client asks for a quote, pricing estimate, wants to email, or wants to get in touch.",
                                parameters: {
                                    type: SchemaType.OBJECT,
                                    properties: {
                                        subject: { type: SchemaType.STRING, description: "Punchy, clear email subject line" },
                                        projectScope: { type: SchemaType.STRING, description: "Concise bullet-points or summary of the client request (e.g. 3D Dental Website with AI Agent)" },
                                        estimatedBudget: { type: SchemaType.STRING, description: "Budget estimate or tier if relevant (e.g. €999+ Essential, €1,999+ Studio 3D, or €3,499+ Custom AI)" }
                                    },
                                    required: ["subject", "projectScope"]
                                }
                            },
                            {
                                name: "navigate_website",
                                description: "Scroll the user to a specific section on the page (portfolio, pricing, process, about, contact) or showcase relevant work.",
                                parameters: {
                                    type: SchemaType.OBJECT,
                                    properties: {
                                        section: {
                                            type: SchemaType.STRING,
                                            description: "Target section id: portfolio, pricing, process, about, or contact"
                                        }
                                    },
                                    required: ["section"]
                                }
                            }
                        ]
                    }]
                });

                const historyStr = messages
                    .slice(-6)
                    .map(m => `${m.type === 'user' ? 'Client' : 'Emily'}: ${m.text}`)
                    .join('\n');

                const systemContext = `
You are "Emily", the intelligent digital architecture specialist for "Onyx & Code", founded by Mamikon.
Onyx & Code crafts ultra-premium web systems, 3D interactive experiences (Three.js/Spline), and custom autonomous AI Agents.

OUR KEY WORK:
- Precision Denture Clinic: 3D interactive dental portal
- Slice of Italy: High-converting luxury Italian restaurant platform
- Roberto's Coffee: Immersive 3D specialty coffee roaster
- The Batch Loaf & Jimmy's Bar: Modern hospitality web apps
- Gray Solicitors: High-trust corporate legal platform
- B3D Designs & An Nead: Innovative digital architectures

KEY RULES:
1. Be polite, authoritative, and concise (under 45 words).
2. DO NOT repeatedly say "Hi" or "Hello".
3. When the user asks about getting a quote, starting a project, or getting in touch, ALWAYS call the "prepare_email_draft" tool to give them a 1-click email button to Mamikon (mamikon@onyxandcode.com). Do NOT ask them to book a phone call.
4. When they ask to see projects, portfolio, pricing, or process, call "navigate_website".
`;

                const fullPrompt = `${systemContext}\n\nRecent History:\n${historyStr}\n\nClient: ${userInput}\nEmily:`;

                const result = await model.generateContent(fullPrompt);
                const response = result.response;

                let responseText = "";
                try {
                    responseText = response.text() || "";
                } catch {
                    responseText = "";
                }

                const functionCalls = response.functionCalls();

                let emailDraft: EmailDraftData | undefined = undefined;
                let navSection: { id: string; label: string } | undefined = undefined;
                let projectHighlight: { name: string; url: string } | undefined = undefined;

                if (functionCalls && functionCalls.length > 0) {
                    const call = functionCalls[0];
                    if (call.name === "prepare_email_draft") {
                        const args = call.args as any;
                        emailDraft = {
                            subject: args.subject || "Project Inquiry - Onyx & Code",
                            projectScope: args.projectScope || "Discussing web development and AI agent solutions.",
                            estimatedBudget: args.estimatedBudget
                        };
                        if (!responseText) {
                            responseText = "I've generated a project brief for you. You can review the scope and send it straight to Mamikon's inbox below:";
                        }
                    } else if (call.name === "navigate_website") {
                        const args = call.args as any;
                        const section = args.section?.toLowerCase() || "portfolio";
                        navSection = {
                            id: section,
                            label: section.charAt(0).toUpperCase() + section.slice(1)
                        };
                        navigateToSection(section);
                        if (!responseText) {
                            responseText = `Navigating you to our ${navSection.label} section now!`;
                        }
                    }
                }

                // If user asked about precision dental clinic, highlight it
                const lower = userInput.toLowerCase();
                if (lower.includes("dental") || lower.includes("denture") || lower.includes("precision")) {
                    projectHighlight = {
                        name: "Precision Denture Clinic",
                        url: "https://muchona.github.io/precision-denture-portal/"
                    };
                    navigateToSection("portfolio");
                }

                setMessages(prev => [
                    ...prev,
                    {
                        id: Date.now() + 1,
                        type: 'agent',
                        text: responseText || "I'm ready to assist. Would you like me to prepare a direct email brief for Mamikon?",
                        emailDraft,
                        navSection,
                        projectHighlight
                    }
                ]);
            } else {
                // Smart Fallback when API key is missing or testing
                const lower = userInput.toLowerCase();
                let replyText = "I'm here to help you scope your project or connect directly with Mamikon.";
                let emailDraft: EmailDraftData | undefined = undefined;
                let navSection: { id: string; label: string } | undefined = undefined;
                let projectHighlight: { name: string; url: string } | undefined = undefined;

                if (lower.includes("price") || lower.includes("cost") || lower.includes("quote") || lower.includes("email") || lower.includes("hire") || lower.includes("contact")) {
                    replyText = "I've structured a project brief for you. You can review the details and email Mamikon with one click:";
                    emailDraft = {
                        subject: "Project Inquiry & Quote Request - Onyx & Code",
                        projectScope: "High-performance web architecture with modern interactive design and AI agent capabilities.",
                        estimatedBudget: "Studio Tier (€1,999+)"
                    };
                } else if (lower.includes("portfolio") || lower.includes("work") || lower.includes("dental") || lower.includes("denture")) {
                    replyText = "Taking you straight to our live portfolio showcase!";
                    navSection = { id: "portfolio", label: "Portfolio" };
                    projectHighlight = {
                        name: "Precision Denture Clinic",
                        url: "https://muchona.github.io/precision-denture-portal/"
                    };
                    navigateToSection("portfolio");
                } else if (lower.includes("pricing") || lower.includes("tier")) {
                    replyText = "Here are our transparent investment tiers:";
                    navSection = { id: "pricing", label: "Pricing Tiers" };
                    navigateToSection("pricing");
                }

                setMessages(prev => [
                    ...prev,
                    {
                        id: Date.now() + 1,
                        type: 'agent',
                        text: replyText,
                        emailDraft,
                        navSection,
                        projectHighlight
                    }
                ]);
            }
        } catch (error: any) {
            console.error("AI Error:", error);
            // Graceful fallback to guarantee positive user experience
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    type: 'agent',
                    text: "I can prepare a direct inquiry for Mamikon at Onyx & Code right now:",
                    emailDraft: {
                        subject: "Direct Project Inquiry - Onyx & Code",
                        projectScope: userInput || "Custom website architecture & digital solutions."
                    }
                }
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        executePrompt(input);
    };

    return (
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] flex flex-col items-end gap-3 font-sans">
            {/* Chat Window */}
            <div
                ref={chatRef}
                className="w-[90vw] max-w-[420px] bg-black/90 backdrop-blur-2xl border border-gold-accent/30 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] origin-bottom-right opacity-0 transform scale-90 transition-all"
                style={{ display: isOpen ? 'flex' : 'none' }}
            >
                <div className="flex flex-col h-[520px] w-full">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-black via-onyx to-black p-4 border-b border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping absolute inset-0 opacity-75"></div>
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full relative"></div>
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-xs font-bold text-gold-accent tracking-widest">EMILY AI</span>
                                    <Sparkles className="w-3 h-3 text-gold-accent" />
                                </div>
                                <p className="text-[10px] text-gray-400 tracking-wider">Autonomous Architecture Agent</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleChat}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                            aria-label="Close chat"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] p-3.5 text-xs md:text-sm rounded-xl leading-relaxed ${msg.type === 'user'
                                    ? 'bg-gradient-to-r from-gold-accent to-yellow-500 text-black font-semibold shadow-md'
                                    : 'bg-white/[0.07] text-gray-200 border border-white/10 backdrop-blur-md'
                                    }`}>
                                    {msg.text}
                                </div>

                                {/* Rich Tool Action: Email Draft Card */}
                                {msg.emailDraft && (
                                    <div className="w-[92%] mt-2.5 p-3.5 rounded-xl bg-gradient-to-b from-onyx-light/90 to-black border border-gold-accent/40 shadow-xl text-left">
                                        <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2.5">
                                            <div className="flex items-center gap-1.5 text-gold-accent text-xs font-mono font-bold">
                                                <Mail className="w-3.5 h-3.5" />
                                                <span>DIRECT INQUIRY BRIEF</span>
                                            </div>
                                            <span className="text-[10px] font-mono text-gray-400">to: {FOUNDER_EMAIL}</span>
                                        </div>

                                        <div className="space-y-1.5 text-xs text-gray-300 mb-3">
                                            <div>
                                                <span className="text-gray-500 font-mono text-[11px]">Subject: </span>
                                                <span className="font-semibold text-white">{msg.emailDraft.subject}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 font-mono text-[11px]">Scope: </span>
                                                <span className="text-gray-200">{msg.emailDraft.projectScope}</span>
                                            </div>
                                            {msg.emailDraft.estimatedBudget && (
                                                <div>
                                                    <span className="text-gray-500 font-mono text-[11px]">Tier: </span>
                                                    <span className="text-gold-accent font-semibold">{msg.emailDraft.estimatedBudget}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col sm:flex-row gap-2 pt-1">
                                            {/* 1-Click Mailto */}
                                            <a
                                                href={`mailto:${FOUNDER_EMAIL}?subject=${encodeURIComponent(msg.emailDraft.subject)}&body=${encodeURIComponent(
                                                    `Hi Mamikon,\n\nI was chatting with Emily on the Onyx & Code website and wanted to discuss this project:\n\nScope:\n${msg.emailDraft.projectScope}\n\nEstimated Budget: ${msg.emailDraft.estimatedBudget || 'Flexible / To discuss'}\n\nLooking forward to your reply!\n\nBest regards,`
                                                )}`}
                                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gold-accent hover:bg-yellow-400 text-black font-bold text-xs transition-all shadow-md active:scale-95 text-center"
                                            >
                                                <Mail className="w-3.5 h-3.5" />
                                                <span>Email Mamikon</span>
                                            </a>

                                            {/* Copy to Clipboard */}
                                            <button
                                                onClick={() => {
                                                    const body = `To: ${FOUNDER_EMAIL}\nSubject: ${msg.emailDraft?.subject}\n\nScope:\n${msg.emailDraft?.projectScope}\nBudget: ${msg.emailDraft?.estimatedBudget || 'Flexible'}`;
                                                    handleCopy(msg.id, body);
                                                }}
                                                className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 text-xs transition-all border border-white/10"
                                            >
                                                {copiedId === msg.id ? (
                                                    <>
                                                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                                                        <span className="text-emerald-400 font-medium">Copied!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Pill */}
                                {msg.navSection && (
                                    <button
                                        onClick={() => navigateToSection(msg.navSection!.id)}
                                        className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-gold-accent/20 border border-gold-accent/30 text-gold-accent text-xs transition-colors"
                                    >
                                        <Compass className="w-3 h-3" />
                                        <span>Jump to {msg.navSection.label}</span>
                                    </button>
                                )}

                                {/* Project Highlight Pill */}
                                {msg.projectHighlight && (
                                    <a
                                        href={msg.projectHighlight.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-accent/10 hover:bg-gold-accent/20 border border-gold-accent/40 text-white text-xs transition-colors"
                                    >
                                        <ExternalLink className="w-3 h-3 text-gold-accent" />
                                        <span>View {msg.projectHighlight.name}</span>
                                    </a>
                                )}
                            </div>
                        ))}

                        {/* Quick Prompts under first message */}
                        {messages.length === 1 && (
                            <div className="pt-2 space-y-1.5">
                                <p className="text-[11px] text-gray-500 font-mono uppercase tracking-wider">Suggested Actions:</p>
                                <div className="flex flex-col gap-1.5">
                                    <button
                                        onClick={() => handleQuickAction("Can I get a quote and email Mamikon for my project?")}
                                        className="text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-gold-accent/15 border border-white/10 text-xs text-gray-300 hover:text-white transition-colors flex items-center justify-between group"
                                    >
                                        <span>✉️ Email Mamikon for a custom quote</span>
                                        <span className="text-gold-accent opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                    </button>
                                    <button
                                        onClick={() => handleQuickAction("Show me your 3D Dental Clinic project")}
                                        className="text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-gold-accent/15 border border-white/10 text-xs text-gray-300 hover:text-white transition-colors flex items-center justify-between group"
                                    >
                                        <span>🦷 View Precision Dental 3D Portal</span>
                                        <span className="text-gold-accent opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                    </button>
                                    <button
                                        onClick={() => handleQuickAction("What are your web development pricing tiers?")}
                                        className="text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-gold-accent/15 border border-white/10 text-xs text-gray-300 hover:text-white transition-colors flex items-center justify-between group"
                                    >
                                        <span>💰 Explore Pricing & Investment Tiers</span>
                                        <span className="text-gold-accent opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {isTyping && (
                            <div className="flex items-center gap-2 p-2 text-xs text-gray-400">
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-gold-accent rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-gold-accent rounded-full animate-bounce delay-100"></span>
                                    <span className="w-1.5 h-1.5 bg-gold-accent rounded-full animate-bounce delay-200"></span>
                                </div>
                                <span className="font-mono text-[11px] text-gray-500">Emily is formulating brief...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-black/60 backdrop-blur-md">
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 focus-within:border-gold-accent/60 rounded-xl px-3 py-1.5 transition-all">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask Emily or request an email brief..."
                                className="flex-1 bg-transparent border-none text-white placeholder-gray-500 text-xs md:text-sm focus:ring-0 outline-none"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="p-1.5 rounded-lg text-gold-accent hover:text-white disabled:opacity-30 disabled:hover:text-gold-accent transition-colors"
                                aria-label="Send message"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Floating Trigger Button */}
            <button
                onClick={toggleChat}
                className="group relative w-14 h-14 rounded-full bg-onyx border border-white/20 shadow-2xl hover:border-gold-accent transition-all duration-300 flex items-center justify-center overflow-hidden hover:scale-105"
                aria-label="Open AI Assistant"
            >
                <div className="absolute inset-0 bg-gold-accent/15 group-hover:bg-gold-accent/25 transition-colors"></div>
                <div className={`w-7 h-7 transition-transform duration-300 ${isOpen ? 'rotate-90 scale-0 opacity-0 absolute' : 'scale-100 opacity-100'}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white w-full h-full">
                        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" />
                    </svg>
                </div>
                <div className={`w-6 h-6 transition-transform duration-300 ${!isOpen ? '-rotate-90 scale-0 opacity-0 absolute' : 'rotate-0 scale-100 opacity-100'}`}>
                    <X className="w-6 h-6 text-gold-accent" />
                </div>
            </button>
        </div>
    );
}
