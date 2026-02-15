import { useEffect, useRef } from 'react';
import Typed from 'typed.js';

interface TypewriterTextProps {
    strings: string[];
    className?: string;
}

export default function TypewriterText({ strings, className = '' }: TypewriterTextProps) {
    const el = useRef<HTMLSpanElement>(null);
    const typed = useRef<Typed | null>(null);

    useEffect(() => {
        const options = {
            strings: strings,
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 1000,
            startDelay: 1000,
            loop: true,
            showCursor: true,
            cursorChar: '|',
        };

        if (el.current) {
            typed.current = new Typed(el.current, options);
        }

        return () => {
            if (typed.current) {
                typed.current.destroy();
            }
        };
    }, [strings]);

    return <span ref={el} className={className} />;
}
