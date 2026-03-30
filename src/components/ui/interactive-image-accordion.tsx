import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

interface AccordionItem {
    id: number;
    title: string;
    description: string;
    image: string;
    tag: string;
}

const items: AccordionItem[] = [
    {
        id: 1,
        title: "Precision Engineering",
        tag: "Protocol_01",
        description: "Building the digital foundation with pixel-perfect accuracy and high-performance code architecture.",
        image: "C:\\Users\\mucho\\.gemini\\antigravity\\brain\\a457a813-ba5c-416d-bb2d-46f2ed5817dc\\accordion_luxury_interface_1772748651696.png",
    },
    {
        id: 2,
        title: "Avant-Garde Design",
        tag: "Protocol_02",
        description: "Merging artistic vision with functional excellence to create immersive, high-fidelity user experiences.",
        image: "C:\\Users\\mucho\\.gemini\\antigravity\\brain\\a457a813-ba5c-416d-bb2d-46f2ed5817dc\\accordion_abstract_sculpture_1772748664985.png",
    },
    {
        id: 3,
        title: "Cybernetic Systems",
        tag: "Protocol_03",
        description: "Orchestrating complex digital environments with advanced scalability and adaptive intelligence.",
        image: "C:\\Users\\mucho\\.gemini\\antigravity\\brain\\a457a813-ba5c-416d-bb2d-46f2ed5817dc\\accordion_cyber_architecture_1772748678645.png",
    },
    {
        id: 4,
        title: "Spatial Intelligence",
        tag: "Protocol_04",
        description: "Harnessing the power of 3D spatial computing to redefine how users interact with the digital frontier.",
        image: "C:\\Users\\mucho\\.gemini\\antigravity\\brain\\a457a813-ba5c-416d-bb2d-46f2ed5817dc\\accordion_data_hub_1772748697468.png",
    },
];

export default function InteractiveImageAccordion() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);

    return (
        <div className="w-full flex flex-col md:flex-row h-[700px] gap-2 md:gap-4 py-20">
            {items.map((item, index) => {
                const isHovered = hoveredIndex === index;
                return (
                    <motion.div
                        key={item.id}
                        className={cn(
                            "relative rounded-3xl overflow-hidden cursor-pointer border border-white/10 group bg-onyx",
                            "transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                        )}
                        initial={false}
                        animate={{
                            flex: isHovered ? 6 : 1,
                        }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(index)}
                        onClick={() => setHoveredIndex(index)}
                    >
                        {/* Background Image with Overlay */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0"
                            style={{ backgroundImage: `url('${item.image}')` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                        <div className={cn(
                            "absolute inset-0 bg-onyx/40 backdrop-blur-[1px] transition-all duration-500",
                            isHovered && "backdrop-blur-0 bg-transparent"
                        )} />

                        {/* Tag Overlay - Only visible when expanded or highly visible */}
                        <AnimatePresence>
                            {isHovered && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute top-8 left-8 z-20"
                                >
                                    <span className="font-mono text-[10px] text-gold-accent tracking-[4px] bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-gold-accent/20 uppercase">
                                        {item.tag}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Content Container */}
                        <div className={cn(
                            "absolute inset-0 flex flex-col z-10 p-6 md:p-10",
                            isHovered ? "justify-end" : "justify-end items-center"
                        )}>
                            <motion.div
                                layout
                                className={cn(
                                    "relative transition-all duration-700",
                                    !isHovered && "md:[writing-mode:vertical-lr] md:rotate-180"
                                )}
                                animate={{
                                    y: isHovered ? 0 : 0,
                                    opacity: 1,
                                }}
                            >
                                <h3 className={cn(
                                    "font-black text-white tracking-tighter transition-all duration-700 whitespace-nowrap",
                                    isHovered ? "text-3xl md:text-5xl mb-4" : "text-xl md:text-2xl opacity-70"
                                )}>
                                    {item.title}
                                </h3>
                            </motion.div>

                            <AnimatePresence>
                                {isHovered && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className="max-w-xl"
                                    >
                                        <p className="text-gray-300 text-sm md:text-lg leading-relaxed mb-4">
                                            {item.description}
                                        </p>
                                        <div className="h-[1px] w-20 bg-gold-accent/40" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Decorative Gold Edge Hover Effect */}
                        <div className={cn(
                            "absolute inset-0 border transition-all duration-700 rounded-3xl pointer-events-none",
                            isHovered ? "border-gold-accent/30 shadow-[inset_0_0_50px_rgba(212,175,55,0.1)]" : "border-white/5"
                        )} />
                    </motion.div>
                );
            })}
        </div>
    );
}
