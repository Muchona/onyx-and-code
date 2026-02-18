import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';

export default function Success() {
    useEffect(() => {
        gsap.to(".success-card", {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: "power4.out",
            delay: 0.3
        });
    }, []);

    return (
        <div className="min-h-screen w-full bg-onyx text-white font-sans flex items-center justify-center p-6 relative overflow-hidden">
            <Helmet>
                <title>Protocol Initialized | Onyx & Code</title>
                <meta name="robots" content="noindex" />
                <link rel="canonical" href="https://www.onyxandcode.com/success" />
            </Helmet>
            {/* Background Noise with higher contrast */}
            <div className="fixed inset-0 w-full h-full opacity-[0.03] pointer-events-none z-[9999] mix-blend-overlay"
                style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }}></div>

            <div className="success-card opacity-0 translate-y-8 bg-onyx-light border border-white/10 rounded-[28px] p-8 md:p-16 max-w-2xl w-full flex flex-col items-center justify-center text-center relative z-10 shadow-2xl shadow-black/50 backdrop-blur-md">
                <span className="font-mono text-gold-accent text-xs tracking-[4px] block mb-6 drop-shadow-[0_0_5px_rgba(212,175,55,0.4)]">
          // TRANSMISSION_COMPLETE
                </span>

                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-none mb-6 drop-shadow-xl">
                    Protocol<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-accent to-white drop-shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                        Initialized.
                    </span>
                </h1>

                <p className="text-gray-400 text-lg font-light leading-relaxed mb-12 max-w-md">
                    Your strategic brief has been received. Our systems are orchestrating a deployment plan. Expect a direct transmission within 24 hours.
                </p>

                <Link to="/" className="group relative w-full md:w-auto block">
                    <div className="absolute inset-[-2px] rounded-xl bg-gradient-to-r from-transparent via-gold-accent to-transparent opacity-50 group-hover:opacity-100 blur-sm transition-opacity duration-500 animate-[spin_4s_linear_infinite]"></div>
                    <div className="relative bg-black border border-white/10 rounded-xl px-10 py-4 font-bold uppercase tracking-widest text-sm md:hover:bg-onyx-light transition-colors group-hover:text-gold-accent">
                        Return to Command Center
                    </div>
                </Link>
            </div>

            {/* Footer Element */}
            <div className="absolute bottom-8 left-0 w-full text-center opacity-30">
                <span className="font-mono text-[10px] tracking-[0.3em]">SECURED BY ANTIGRAVITY</span>
            </div>
        </div>
    );
}
