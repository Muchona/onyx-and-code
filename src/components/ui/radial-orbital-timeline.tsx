"use client";
import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Link } from "lucide-react";

// ── Inlined minimal Shadcn-like components to ensure zero-dependency failure ──

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase border ${className}`}>
        {children}
    </span>
);

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`rounded-xl border border-white/10 bg-onyx-light/98 shadow-2xl ${className}`}>
        {children}
    </div>
);

// ── Main Component ──

interface TimelineItem {
    id: number;
    title: string;
    date: string;
    content: string;
    category: string;
    icon: React.ComponentType<any>;
    relatedIds: number[];
    status: "completed" | "in-progress" | "pending";
    energy: number;
}

interface RadialOrbitalTimelineProps {
    timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
    timelineData,
}: RadialOrbitalTimelineProps) {
    const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({} as Record<number, boolean>);
    const [autoRotate, setAutoRotate] = useState<boolean>(true);

    const containerRef = useRef<HTMLDivElement>(null);
    const orbitRef = useRef<HTMLDivElement>(null);
    const nodeRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());

    // Use a ref for the internal rotation value to avoid state-triggered re-renders
    const rotationRef = useRef<number>(0);

    const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === containerRef.current || e.target === orbitRef.current) {
            setExpandedItems({});
            setAutoRotate(true);
        }
    };

    const toggleItem = (id: number) => {
        setExpandedItems((prev) => {
            const newState = { ...prev };
            Object.keys(newState).forEach((key) => {
                if (parseInt(key) !== id) newState[parseInt(key)] = false;
            });
            newState[id] = !prev[id];

            if (!prev[id]) {
                setAutoRotate(false);
                centerViewOnNode(id);
            } else {
                setAutoRotate(true);
            }
            return newState;
        });
    };

    useEffect(() => {
        let frameId: number;

        const animate = () => {
            if (autoRotate) {
                rotationRef.current = (rotationRef.current + 0.4) % 360; // Increased speed for visibility
                if (containerRef.current) {
                    containerRef.current.style.setProperty("--rotation-angle", `${rotationRef.current}deg`);
                }
                frameId = requestAnimationFrame(animate);
            }
        };

        if (autoRotate) {
            frameId = requestAnimationFrame(animate);
        }

        return () => cancelAnimationFrame(frameId);
    }, [autoRotate]);

    const centerViewOnNode = (nodeId: number) => {
        const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
        const totalNodes = timelineData.length;
        const targetAngle = 270 - (nodeIndex / totalNodes) * 360;

        rotationRef.current = targetAngle;
        if (containerRef.current) {
            containerRef.current.style.setProperty("--rotation-angle", `${rotationRef.current}deg`);
        }
    };

    const getStatusStyles = (status: TimelineItem["status"]): string => {
        switch (status) {
            case "completed": return "text-gold-accent border-gold-accent/50 bg-gold-accent/10";
            case "in-progress": return "text-white border-white/50 bg-white/10 animate-pulse";
            case "pending": return "text-white/40 border-white/10 bg-white/5";
            default: return "";
        }
    };

    return (
        <div
            className="w-full h-[600px] md:h-[800px] flex flex-col items-center justify-center bg-transparent overflow-hidden relative"
            ref={containerRef}
            onClick={handleContainerClick}
            style={{
                "--rotation-angle": "0deg",
                "--radius": "clamp(120px, 25vw, 240px)" // Responsive radius for mobile/tablet
            } as React.CSSProperties}
        >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-accent/5 via-transparent to-transparent pointer-events-none"></div>

            <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
                <div
                    className="absolute w-full h-full flex items-center justify-center"
                    ref={orbitRef}
                    style={{ perspective: "1200px" }}
                >
                    {/* Central Core */}
                    <div className="absolute w-16 h-16 md:w-24 md:h-24 rounded-full bg-onyx-light border border-gold-accent/50 flex items-center justify-center z-10 shadow-[0_0_60px_rgba(212,175,55,0.25)] ring-1 ring-gold-accent/40 transition-all duration-700">
                        <div className="absolute w-20 h-20 md:w-32 md:h-32 rounded-full border border-gold-accent/20 animate-[ping_4s_linear_infinite]"></div>
                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-gold-accent to-yellow-600 opacity-90 blur-[1px]"></div>
                        <div className="absolute w-4 h-4 md:w-8 md:h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30"></div>
                    </div>

                    {/* Orbit Line - Dynamic based on --radius */}
                    <div className="absolute rounded-full border-2 border-gold-accent/20 pointer-events-none transition-all duration-700 shadow-[0_0_30px_rgba(212,175,55,0.1)]"
                        style={{
                            width: "calc(var(--radius) * 2)",
                            height: "calc(var(--radius) * 2)",
                            opacity: 0.6
                        }}
                    ></div>

                    {timelineData.map((item, index) => {
                        const isExpanded = expandedItems[item.id];
                        const Icon = item.icon;
                        const baseAngle = (index / timelineData.length) * 360;

                        return (
                            <div
                                key={item.id}
                                ref={(el) => { nodeRefs.current.set(item.id, el); }}
                                className="absolute cursor-pointer group"
                                style={{
                                    "--base-angle": `${baseAngle}deg`,
                                    "--current-angle": "calc(var(--base-angle) + var(--rotation-angle))",
                                    transform: "rotate(var(--current-angle)) translate(var(--radius)) rotate(calc(-1 * var(--current-angle)))",
                                    zIndex: isExpanded ? 200 : 100,
                                    transition: "opacity 0.4s ease, transform 0s",
                                    opacity: isExpanded ? 1 : 0.9, // Higher default opacity
                                } as React.CSSProperties}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(item.id);
                                }}
                            >
                                {/* Energy Pulse - Brighter */}
                                <div
                                    className="absolute rounded-full -inset-4 bg-gold-accent/10 blur-2xl group-hover:bg-gold-accent/20 transition-colors shadow-[0_0_40px_rgba(212,175,55,0.15)]"
                                    style={{
                                        width: `${item.energy * 0.7 + 70}px`,
                                        height: `${item.energy * 0.7 + 70}px`,
                                        left: `-${(item.energy * 0.7 + 70 - 40) / 2}px`,
                                        top: `-${(item.energy * 0.7 + 70 - 40) / 2}px`,
                                    }}
                                ></div>

                                {/* Node Circle - More prominent */}
                                <div
                                    className={`
                                        w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center
                                        ${isExpanded ? "bg-gold-accent text-onyx shadow-[0_0_30px_rgba(212,175,55,0.6)]" : "bg-onyx-light text-gold-accent border-2 border-gold-accent/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]"}
                                        transition-all duration-500 transform
                                        ${isExpanded ? "scale-125 rotate-[360deg]" : "group-hover:scale-115 group-hover:border-gold-accent group-hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]"}
                                    `}
                                >
                                    {React.createElement(Icon, { size: 24, strokeWidth: 2 })}
                                </div>

                                {/* Node Label - Brighter/Bigger */}
                                <div className={`
                                    absolute top-18 left-1/2 -translate-x-1/2 whitespace-nowrap
                                    text-[11px] font-bold tracking-[3px] uppercase
                                    transition-all duration-300
                                    ${isExpanded ? "text-gold-accent scale-110 opacity-100" : "text-white/80 opacity-0 group-hover:opacity-100"}
                                `}>
                                    {item.title}
                                </div>

                                {/* Expanded Card */}
                                {isExpanded && (
                                    <Card className="absolute top-24 left-1/2 -translate-x-1/2 w-72 p-6 transition-all animate-in fade-in slide-in-from-top-2 duration-500">
                                        <div className="flex justify-between items-center mb-4">
                                            <Badge className={getStatusStyles(item.status)}>
                                                {item.status}
                                            </Badge>
                                            <span className="text-[10px] font-mono text-white/40 italic">{item.date}</span>
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-3 tracking-tight">
                                            {item.title}
                                        </h3>

                                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                                            {item.content}
                                        </p>

                                        {/* Progress Bar */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-gold-accent/60">
                                                <span>Phase Power</span>
                                                <span>{item.energy}%</span>
                                            </div>
                                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-gold-accent/40 to-gold-accent transition-all duration-1000"
                                                    style={{ width: `${item.energy}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Connections */}
                                        {item.relatedIds.length > 0 && (
                                            <div className="mt-6 pt-4 border-t border-white/5">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Link size={12} className="text-gold-accent/40" />
                                                    <span className="text-[9px] font-mono uppercase tracking-wider text-white/30">Sync Points</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {item.relatedIds.map((relId: number) => {
                                                        const related = timelineData.find((t) => t.id === relId);
                                                        return (
                                                            <button
                                                                key={relId}
                                                                onClick={(e) => { e.stopPropagation(); toggleItem(Number(relId)); }}
                                                                className="px-3 py-1 bg-white/5 border border-white/10 hover:border-gold-accent/40 rounded text-[10px] text-white/60 hover:text-gold-accent transition-all flex items-center gap-2"
                                                            >
                                                                {related?.title}
                                                                <ArrowRight size={10} />
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </Card>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
