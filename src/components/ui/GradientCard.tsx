'use client'
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface GradientCardProps {
    children?: React.ReactNode;
    className?: string;
    containerClassName?: string;
}

export const GradientCard = ({ children, className, containerClassName }: GradientCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile on mount
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Handle mouse movement for 3D effect (desktop only)
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile || !cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setRotation({
            x: -(y / rect.height) * 5,
            y: (x / rect.width) * 5,
        });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setRotation({ x: 0, y: 0 });
    };

    return (
        <div
            className={containerClassName}
            onMouseEnter={() => !isMobile && setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
        >
            {/* Card container — 3D only on desktop */}
            <motion.div
                ref={cardRef}
                className={`relative rounded-2xl md:rounded-[32px] overflow-hidden h-full border border-white/10 ${className || ''}`}
                style={{
                    transformStyle: isMobile ? "flat" : "preserve-3d",
                    backgroundColor: "#0a0a0a",
                    boxShadow: isMobile
                        ? "0 0 30px 5px rgba(212, 175, 55, 0.08)"
                        : "0 -10px 100px 10px rgba(212, 175, 55, 0.15), 0 0 10px 0 rgba(0, 0, 0, 0.5)",
                }}
                initial={{ y: 0 }}
                animate={isMobile ? {} : {
                    y: isHovered ? -5 : 0,
                    rotateX: rotation.x,
                    rotateY: rotation.y,
                    perspective: 1000,
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                }}
            >
                {/* Glass reflection overlay — desktop only */}
                {!isMobile && (
                    <motion.div
                        className="absolute inset-0 z-[35] pointer-events-none"
                        style={{
                            background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.05) 100%)",
                            backdropFilter: "blur(2px)",
                        }}
                        animate={{
                            opacity: isHovered ? 0.7 : 0.5,
                            rotateX: -rotation.x * 0.2,
                            rotateY: -rotation.y * 0.2,
                            z: 1,
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                )}

                {/* Dark background */}
                <div
                    className="absolute inset-0 z-0"
                    style={{ background: "linear-gradient(180deg, #000000 0%, #050505 100%)" }}
                />

                {/* Noise texture — reduced opacity on mobile for performance */}
                <div
                    className="absolute inset-0 opacity-[0.15] md:opacity-30 mix-blend-overlay z-10 pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                />

                {/* Smudge texture — desktop only (expensive filter) */}
                {!isMobile && (
                    <div
                        className="absolute inset-0 opacity-10 mix-blend-soft-light z-[11] pointer-events-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='smudge'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.01' numOctaves='3' seed='5' stitchTiles='stitch'/%3E%3CfeGaussianBlur stdDeviation='10'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23smudge)'/%3E%3C/svg%3E")`,
                            backdropFilter: "blur(1px)",
                        }}
                    />
                )}

                {/* Gold glow — simplified on mobile (single gradient, lighter blur) */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-1/2 md:h-2/3 z-20 pointer-events-none"
                    style={{
                        background: isMobile
                            ? "radial-gradient(ellipse at bottom center, rgba(212, 175, 55, 0.35) 0%, rgba(180, 140, 30, 0) 70%)"
                            : `radial-gradient(ellipse at bottom right, rgba(212, 175, 55, 0.6) -10%, rgba(180, 140, 30, 0) 70%),
                               radial-gradient(ellipse at bottom left, rgba(245, 200, 80, 0.5) -10%, rgba(180, 140, 30, 0) 70%)`,
                        filter: isMobile ? "blur(25px)" : "blur(40px)",
                    }}
                />

                {/* Central gold glow — desktop only */}
                {!isMobile && (
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 h-2/3 z-[21]"
                        style={{
                            background: "radial-gradient(circle at bottom center, rgba(212, 175, 55, 0.6) -20%, rgba(180, 140, 30, 0) 60%)",
                            filter: "blur(45px)",
                        }}
                        animate={{
                            opacity: isHovered ? 0.85 : 0.75,
                            y: isHovered ? `calc(10% + ${rotation.x * 0.3}px)` : "10%",
                            z: 0
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                )}

                {/* Bottom border glow */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-[1px] md:h-[2px] z-[25] pointer-events-none"
                    style={{
                        background: "linear-gradient(90deg, rgba(212, 175, 55, 0.05) 0%, rgba(212, 175, 55, 0.5) 50%, rgba(212, 175, 55, 0.05) 100%)",
                        boxShadow: isMobile
                            ? "0 0 10px 2px rgba(212, 175, 55, 0.4)"
                            : "0 0 15px 3px rgba(212, 175, 55, 0.8), 0 0 25px 5px rgba(180, 140, 30, 0.6), 0 0 35px 7px rgba(245, 200, 80, 0.4)",
                    }}
                />

                {/* Edge glows — desktop only */}
                {!isMobile && (
                    <>
                        <motion.div
                            className="absolute bottom-0 left-0 h-1/4 w-[1px] z-[25] rounded-full"
                            style={{
                                background: "linear-gradient(to top, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.5) 20%, rgba(255, 255, 255, 0.3) 40%, rgba(255, 255, 255, 0.1) 60%, rgba(255, 255, 255, 0) 80%)",
                            }}
                            animate={{
                                boxShadow: isHovered
                                    ? "0 0 20px 4px rgba(212, 175, 55, 0.9), 0 0 30px 6px rgba(180, 140, 30, 0.7), 0 0 40px 8px rgba(245, 200, 80, 0.5)"
                                    : "0 0 15px 3px rgba(212, 175, 55, 0.8), 0 0 25px 5px rgba(180, 140, 30, 0.6), 0 0 35px 7px rgba(245, 200, 80, 0.4)",
                                opacity: isHovered ? 1 : 0.9,
                                z: 0.5
                            }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                        <motion.div
                            className="absolute bottom-0 right-0 h-1/4 w-[1px] z-[25] rounded-full"
                            style={{
                                background: "linear-gradient(to top, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.5) 20%, rgba(255, 255, 255, 0.3) 40%, rgba(255, 255, 255, 0.1) 60%, rgba(255, 255, 255, 0) 80%)",
                            }}
                            animate={{
                                boxShadow: isHovered
                                    ? "0 0 20px 4px rgba(212, 175, 55, 0.9), 0 0 30px 6px rgba(180, 140, 30, 0.7), 0 0 40px 8px rgba(245, 200, 80, 0.5)"
                                    : "0 0 15px 3px rgba(212, 175, 55, 0.8), 0 0 25px 5px rgba(180, 140, 30, 0.6), 0 0 35px 7px rgba(245, 200, 80, 0.4)",
                                opacity: isHovered ? 1 : 0.9,
                                z: 0.5
                            }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                    </>
                )}

                {/* Card content */}
                <div className="relative flex flex-col h-full p-6 md:p-8 z-40">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};
