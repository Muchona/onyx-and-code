"use client"

import React, { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"

interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
    containerClassName?: string
}

export const GradientCard = ({ children, className, containerClassName, ...props }: GradientCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = useState(false)
    const [rotation, setRotation] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect()
            const x = e.clientX - rect.left - rect.width / 2
            const y = e.clientY - rect.top - rect.height / 2

            const rotateX = -(y / rect.height) * 10
            const rotateY = (x / rect.width) * 10

            setRotation({ x: rotateX, y: rotateY })
        }
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        setRotation({ x: 0, y: 0 })
    }

    return (
        <div
            className={cn("relative group cursor-pointer h-full", containerClassName)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
        >
            <motion.div
                ref={cardRef}
                className={cn(
                    "relative h-full rounded-[32px] overflow-hidden border border-white/10 transition-colors duration-500",
                    isHovered ? "border-gold-accent/40" : "border-white/10",
                    className
                )}
                style={{
                    transformStyle: "preserve-3d",
                    backgroundColor: "#050505",
                    boxShadow: isHovered
                        ? "0 -10px 100px 10px rgba(212, 175, 55, 0.15), 0 0 10px 0 rgba(0, 0, 0, 0.5)"
                        : "none",
                }}
                animate={{
                    rotateX: rotation.x,
                    rotateY: rotation.y,
                    perspective: 1000,
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                }}
                {...props}
            >
                {/* Subtle glass reflection overlay */}
                <motion.div
                    className="absolute inset-0 z-30 pointer-events-none"
                    style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.03) 100%)",
                    }}
                    animate={{
                        opacity: isHovered ? 1 : 0.5,
                    }}
                />

                {/* Noise texture overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-10 pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                />

                {/* Gold glow effect matching the site aesthetic */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-2/3 z-20 pointer-events-none"
                    style={{
                        background: `
              radial-gradient(ellipse at bottom right, rgba(212, 175, 55, 0.2) -10%, rgba(212, 175, 55, 0) 70%),
              radial-gradient(ellipse at bottom left, rgba(212, 175, 55, 0.15) -10%, rgba(212, 175, 55, 0) 70%)
            `,
                        filter: "blur(40px)",
                    }}
                    animate={{
                        opacity: isHovered ? 1 : 0,
                        y: isHovered ? rotation.x * 0.5 : 20,
                    }}
                    transition={{ duration: 0.4 }}
                />

                {/* Subtle bottom border glow */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[1px] z-25 pointer-events-none"
                    style={{
                        background: "linear-gradient(90deg, rgba(212, 175, 55, 0) 0%, rgba(212, 175, 55, 0.5) 50%, rgba(212, 175, 55, 0) 100%)",
                    }}
                    animate={{
                        opacity: isHovered ? 1 : 0,
                        scaleX: isHovered ? 1 : 0.5,
                    }}
                />

                {/* Card content */}
                <div className="relative h-full z-40">
                    {children}
                </div>
            </motion.div>
        </div>
    )
}
