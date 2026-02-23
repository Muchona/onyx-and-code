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
    const [clicked, setClicked] = React.useState<boolean>(false)

    const animation = {
        scale: clicked ? [1, 1.3, 1] : 1,
        transition: { duration: 0.3 },
    }

    React.useEffect(() => {
        const handleClick = () => {
            setClicked(true)
            setTimeout(() => {
                setClicked(false)
            }, 200)
        }
        window.addEventListener("click", handleClick)
        return () => window.removeEventListener("click", handleClick)
    }, [clicked])

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
                        "relative cursor-pointer px-3 py-1.5 transition-opacity duration-200 block no-underline",
                        hoveredSocial && hoveredSocial !== social.name
                            ? "opacity-50"
                            : "opacity-100"
                    )}
                    key={index}
                    onMouseEnter={() => {
                        setHoveredSocial(social.name)
                        setRotation(Math.random() * 20 - 10)
                    }}
                    onMouseLeave={() => setHoveredSocial(null)}
                    onClick={() => {
                        setClicked(true)
                    }}
                >
                    <span className="hidden md:block text-sm font-medium text-white/70 group-hover:text-gold-accent transition-colors">
                        {social.name}
                    </span>
                    <AnimatePresence>
                        {(hoveredSocial === social.name || (typeof window !== 'undefined' && window.innerWidth < 768)) && (
                            <motion.div
                                className="static md:absolute bottom-0 left-0 right-0 flex h-full w-full items-center justify-center pointer-events-none"
                                animate={animation}
                            >
                                <motion.img
                                    key={social.name}
                                    src={social.image}
                                    alt={social.name}
                                    className="size-10"
                                    initial={hoveredSocial === social.name ? {
                                        y: -25,
                                        rotate: rotation,
                                        opacity: 0,
                                        filter: "blur(2px)",
                                    } : { opacity: 1 }}
                                    animate={hoveredSocial === social.name ? { y: -35, opacity: 1, filter: "blur(0px)" } : { opacity: 1 }}
                                    exit={{ y: -25, opacity: 0, filter: "blur(2px)" }}
                                    transition={{ duration: 0.2 }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </a>
            ))}
        </div>
    )
}
