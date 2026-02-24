"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"

interface Social {
    name: string
    image: string
    url: string
}

interface SocialLinksProps extends React.HTMLAttributes<HTMLDivElement> {
    socials: Social[]
}

export function SocialLinks({ socials, className, ...props }: SocialLinksProps) {
    const [hoveredSocial, setHoveredSocial] = React.useState<string | null>(null)
    const [rotation, setRotation] = React.useState<number>(0)
    const [isMobile, setIsMobile] = React.useState(false)

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    return (
        <div
            className={cn("flex items-center justify-center gap-0", className)}
            {...props}
        >
            {socials.map((social, index) => (
                <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                        "relative cursor-pointer transition-opacity duration-200 block no-underline",
                        isMobile ? "px-4 py-2" : "px-3 py-1.5",
                        !isMobile && hoveredSocial && hoveredSocial !== social.name
                            ? "opacity-50"
                            : "opacity-100"
                    )}
                    key={index}
                    onMouseEnter={() => {
                        if (!isMobile) {
                            setHoveredSocial(social.name)
                            setRotation(Math.random() * 20 - 10)
                        }
                    }}
                    onMouseLeave={() => {
                        if (!isMobile) setHoveredSocial(null)
                    }}
                >
                    {/* Mobile: static icon, always visible, no animation */}
                    {isMobile && (
                        <img
                            src={social.image}
                            alt={social.name}
                            className="size-10"
                        />
                    )}

                    {/* Desktop: text label + animated hover icon */}
                    {!isMobile && (
                        <>
                            <span className="block text-sm font-medium text-white/70 hover:text-gold-accent transition-colors">
                                {social.name}
                            </span>
                            <AnimatePresence>
                                {hoveredSocial === social.name && (
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 flex h-full w-full items-center justify-center pointer-events-none"
                                    >
                                        <motion.img
                                            key={social.name}
                                            src={social.image}
                                            alt={social.name}
                                            className="size-10"
                                            initial={{
                                                y: -25,
                                                rotate: rotation,
                                                opacity: 0,
                                                filter: "blur(2px)",
                                            }}
                                            animate={{ y: -35, opacity: 1, filter: "blur(0px)" }}
                                            exit={{ y: -25, opacity: 0, filter: "blur(2px)" }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </>
                    )}
                </a>
            ))}
        </div>
    )
}
