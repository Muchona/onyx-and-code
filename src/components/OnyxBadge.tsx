import type { FC } from 'react';

const OnyxBadge: FC = () => {
    return (
        <div className="flex flex-col items-center md:items-end justify-center text-center md:text-right font-sans select-none group">
            {/* Logo Section */}
            <a
                href="https://www.onyxandcode.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mb-2 block transition-transform duration-300 md:hover:scale-105"
            >
                <span className="text-white font-extrabold tracking-[0.2em] text-sm md:text-base drop-shadow-md">
                    ONYX <span className="text-gold-accent">&</span> CODE
                </span>
            </a>

            {/* Subtext Section */}
            <div className="flex flex-col gap-0.5">
                <span className="text-[10px] md:text-[11px] text-[#4B5563] tracking-widest font-medium uppercase group-hover:text-[#6B7280] transition-colors duration-300">
                    DESIGNED AND BUILT BY
                </span>
                <a
                    href="https://www.onyxandcode.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] md:text-[11px] text-[#2563EB] tracking-widest font-medium uppercase hover:text-[#3B82F6] transition-colors duration-300 hover:underline hover:decoration-[#2563EB]/30 hover:underline-offset-4"
                >
                    WWW.ONYXANDCODE.COM
                </a>
            </div>
        </div>
    );
};

export default OnyxBadge;
