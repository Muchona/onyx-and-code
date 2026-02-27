import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Helmet } from 'react-helmet-async';
import OnyxBadge from './components/OnyxBadge';
import { SplineScene } from './components/ui/SplineScene';
import { Spotlight } from './components/ui/Spotlight';
import { StarsCanvas } from './components/ui/StarsCanvas';

gsap.registerPlugin(ScrollTrigger);

// ─── Animated Counter ───────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!ref.current || hasAnimated.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated.current) {
                        hasAnimated.current = true;
                        gsap.fromTo(ref.current,
                            { innerText: 0 },
                            {
                                innerText: target, duration: 2, ease: 'power2.out',
                                snap: { innerText: 1 },
                                onUpdate: function () {
                                    if (ref.current) {
                                        ref.current.textContent = prefix + Math.round(Number(gsap.getProperty(ref.current, 'innerText') || 0)) + suffix;
                                    }
                                },
                            }
                        );
                    }
                });
            },
            { threshold: 0.5 }
        );
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, suffix, prefix]);

    return <span ref={ref}>{prefix}0{suffix}</span>;
}

// ─── Gold Particle Canvas ───────────────────────────────────────────
function GoldParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        const particles: Array<{
            x: number; y: number; vx: number; vy: number;
            size: number; opacity: number; targetOpacity: number; life: number; maxLife: number;
        }> = [];

        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < 60; i++) {
            particles.push({
                x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2 - 0.1,
                size: Math.random() * 2 + 0.5, opacity: 0,
                targetOpacity: Math.random() * 0.5 + 0.1, life: 0, maxLife: Math.random() * 400 + 200,
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.life++; p.x += p.vx; p.y += p.vy;
                if (p.life < 60) p.opacity = (p.life / 60) * p.targetOpacity;
                else if (p.life > p.maxLife - 60) p.opacity = ((p.maxLife - p.life) / 60) * p.targetOpacity;
                if (p.life > p.maxLife || p.x < -10 || p.x > canvas.width + 10 || p.y < -10 || p.y > canvas.height + 10) {
                    p.x = Math.random() * canvas.width; p.y = canvas.height + 10;
                    p.life = 0; p.maxLife = Math.random() * 400 + 200; p.targetOpacity = Math.random() * 0.5 + 0.1;
                }
                ctx.save(); ctx.globalAlpha = p.opacity; ctx.shadowBlur = 12; ctx.shadowColor = '#D4AF37';
                ctx.fillStyle = '#D4AF37'; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); ctx.restore();
            });
            animationId = requestAnimationFrame(animate);
        };
        animate();
        return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 z-[1] pointer-events-none" style={{ opacity: 0.5 }} />;
}

// ═════════════════════════════════════════════════════════════════════
// MAIN CINEMATIC PAGE
// ═════════════════════════════════════════════════════════════════════
export default function LocalMagnet() {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const heroContentRef = useRef<HTMLDivElement>(null);

    // ── Split text into letters ──
    const splitText = useCallback((text: string) => {
        return text.split('').map((char, i) => (
            <span key={i} className="cinema-letter inline-block" style={{ display: char === ' ' ? 'inline' : 'inline-block' }}>
                {char === ' ' ? '\u00A0' : char}
            </span>
        ));
    }, []);

    // ── GSAP Cinematic Timeline ──
    useEffect(() => {
        if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

            // Hero content animation
            tl.fromTo('.cinema-letter',
                { y: 80, opacity: 0, rotateX: -60 },
                { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.025, ease: 'back.out(1.4)' }, 0.5
            )
                .fromTo('.cinema-block-line',
                    { y: 60, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }, 1.2
                )
                .fromTo('.hero-subtitle',
                    { y: 30, opacity: 0, filter: 'blur(8px)' },
                    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2 }, 1.6
                )
                .fromTo('.hero-cta',
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, 2.2
                )
                .fromTo('.hero-badge',
                    { opacity: 0, scale: 0.8 },
                    { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1 }, 2.5
                );

            // Scroll reveals
            gsap.utils.toArray<HTMLElement>('.reveal-section').forEach((section) => {
                gsap.fromTo(section,
                    { y: 80, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
                        scrollTrigger: { trigger: section, start: 'top 85%' }
                    }
                );
            });

            gsap.fromTo('.service-card',
                { y: 60, opacity: 0, scale: 0.95 },
                {
                    y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out',
                    scrollTrigger: { trigger: '.services-grid', start: 'top 80%' }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="bg-onyx text-white font-sans min-h-screen selection:bg-gold-accent selection:text-black overflow-hidden">
            <Helmet>
                <title>Web Design Monaghan | High-Performance Digital Architecture | Onyx & Code</title>
                <meta name="description" content="The premier web design agency in Monaghan, Ireland. We build luxury websites, 3D interactive experiences, and high-performance digital solutions for businesses." />
                <meta name="keywords" content="Web Design Monaghan, Monaghan Web Developer, Website Design Monaghan, SEO Monaghan, Digital Agency Monaghan, Onyx and Code" />
                <link rel="canonical" href="https://www.onyxandcode.com/web-design-monaghan" />
            </Helmet>

            {/* Background Systems */}
            <GoldParticles />
            <div className="fixed inset-0 w-full h-full opacity-[0.04] pointer-events-none z-[2] mix-blend-overlay"
                style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }}></div>

            {/* ═══════════════════════════════════════════════════════════════
          HERO: LEFT CONTENT + RIGHT 3D SPLINE
          ═══════════════════════════════════════════════════════════════ */}
            <section className="relative z-10 min-h-screen">
                <div className="w-full min-h-screen bg-black/[0.96] relative overflow-hidden">
                    <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#D4AF37" />

                    <div className="flex flex-col md:flex-row h-screen">
                        {/* ── LEFT: Content ── */}
                        <div ref={heroContentRef} className="flex-1 px-8 md:px-16 lg:px-20 relative z-10 flex flex-col justify-center py-24 md:py-0">

                            {/* Logo - Reverting to premium PNG but fixing background visibility */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-20 h-20 relative">
                                    <img src="/favicon.png" alt="Onyx & Code" className="w-full h-full object-contain mix-blend-screen brightness-125" />
                                </div>
                                <div className="hero-badge flex items-center gap-3 opacity-0">
                                    <div className="w-2 h-2 rounded-full bg-gold-accent animate-pulse"></div>
                                    <span className="font-mono text-[10px] tracking-[4px] text-gold-accent uppercase">Monaghan Digital Studio</span>
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tighter leading-[0.95] mb-8" style={{ perspective: '1000px' }}>
                                <div className="overflow-hidden py-1 md:py-2">
                                    {splitText('Premier')}
                                </div>
                                <div className="overflow-hidden py-1 md:py-2">
                                    <span className="cinema-block-line inline-block text-transparent bg-clip-text bg-gradient-to-r from-gold-accent via-amber-300 to-gold-accent">
                                        Web Design
                                    </span>
                                </div>
                            </h1>

                            {/* Subtitle */}
                            <div className="hero-subtitle opacity-0 mb-10">
                                <p className="text-lg md:text-xl text-gray-400 max-w-lg leading-relaxed">
                                    We architect <span className="text-white font-semibold">high-performance digital experiences</span> for
                                    businesses in Monaghan. Where luxury design meets cutting-edge engineering.
                                </p>
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => navigate('/#contact')}
                                    className="hero-cta opacity-0 group relative px-8 py-4 overflow-hidden rounded-lg"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-gold-accent to-amber-400 rounded-lg"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-gold-accent to-amber-400 rounded-lg blur-xl opacity-30 group-hover:opacity-60 transition-opacity"></div>
                                    <span className="relative z-10 text-black font-bold uppercase tracking-widest text-xs md:text-sm">Start Your Project</span>
                                </button>

                                <button
                                    onClick={() => navigate('/#portfolio')}
                                    className="hero-cta opacity-0 px-8 py-4 border border-white/20 rounded-lg font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-white/5 hover:border-white/40 transition-all"
                                >
                                    View Our Work
                                </button>
                            </div>

                            {/* Tech badges */}
                            <div className="flex flex-wrap gap-3 mt-10">
                                {['React', 'Next.js', 'Three.js', 'GSAP'].map((tech) => (
                                    <span key={tech} className="hero-badge opacity-0 px-3 py-1.5 border border-white/10 rounded-full text-[10px] font-mono text-gray-600 tracking-widest hover:border-gold-accent/30 hover:text-gray-400 transition-all cursor-default">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* ── RIGHT: Interactive 3D ── */}
                        <div className="flex-1 relative hidden md:block">
                            <SplineScene
                                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
          ACT 3: SCROLL-DRIVEN SHOWCASE
          ═══════════════════════════════════════════════════════════════ */}
            <main className="relative z-10">
                <div className="container mx-auto px-6 md:px-12 max-w-7xl">

                    {/* ── Stats ── */}
                    <section className="py-24 reveal-section">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                            {[
                                { value: 5, suffix: '+', label: 'Projects Delivered' },
                                { value: 100, suffix: '%', label: 'Client Retention' },
                                { value: 2, prefix: '<', suffix: 's', label: 'Load Time Average' },
                                { value: 60, suffix: 'fps', label: 'Animation Standard' },
                            ].map((stat, i) => (
                                <div key={i} className="text-center group">
                                    <div className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-2">
                                        <AnimatedCounter target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                                    </div>
                                    <div className="text-xs md:text-sm font-mono tracking-widest text-gray-600 uppercase group-hover:text-gold-accent transition-colors">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── Manifesto ── */}
                    <section className="py-24 reveal-section relative overflow-hidden">
                        <StarsCanvas
                            maxStars={400}
                            speedMultiplier={1.2}
                            twinkleIntensity={40}
                            hue={45}
                            className="opacity-30"
                        />
                        <div className="max-w-4xl mx-auto text-center relative z-10">
                            <span className="font-mono text-xs text-gold-accent opacity-80 tracking-[6px] block mb-8">// OUR_PHILOSOPHY</span>
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 tracking-tight">
                                We don't build <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-accent to-amber-300">websites</span>.
                                <br />We architect <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">digital dominance</span>.
                            </h2>
                            <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                                Every Monaghan business deserves more than a template. We engineer bespoke digital experiences
                                that convert visitors into customers and establish market authority.
                            </p>
                        </div>
                    </section>

                    {/* ── Services Grid ── */}
                    <section className="py-20 services-grid">
                        <span className="font-mono text-xs text-gold-accent opacity-80 tracking-[6px] block mb-12 text-center">// CORE_CAPABILITIES</span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    id: '01', title: 'High-End Web Design',
                                    desc: 'Luxury websites that redefine your brand. Custom-built with React, Next.js, and premium GSAP animations that make your competitors look outdated.',
                                    icon: (<svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-current stroke-[1.5]"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>),
                                },
                                {
                                    id: '02', title: '3D Interactive Experiences',
                                    desc: 'Immersive WebGL environments powered by Three.js. Product configurators, virtual showrooms, and spatial designs that captivate your audience.',
                                    icon: (<svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-current stroke-[1.5]"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>),
                                },
                                {
                                    id: '03', title: 'Brand Architecture',
                                    desc: 'Strategic brand identity systems. From logo design to full visual language, we create cohesive brand experiences that establish market presence.',
                                    icon: (<svg viewBox="0 0 24 24" className="w-8 h-8 fill-none stroke-current stroke-[1.5]"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>),
                                },
                            ].map((service) => (
                                <div key={service.id}
                                    className="service-card group relative bg-white/[0.02] border border-white/10 rounded-2xl p-8 md:p-10 hover:border-gold-accent/40 hover:bg-white/[0.04] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(212,175,55,0.08)] cursor-default"
                                >
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="relative z-10">
                                        <span className="font-mono text-gold-accent text-xs tracking-widest block mb-6 px-3 py-1.5 bg-gold-accent/10 w-fit rounded-md group-hover:bg-gold-accent group-hover:text-black transition-colors">
                                            {service.id}_MODULE
                                        </span>
                                        <div className="text-gold-accent mb-6 group-hover:scale-110 transition-transform origin-left">{service.icon}</div>
                                        <h3 className="text-xl md:text-2xl font-bold mb-4 tracking-tight group-hover:text-gold-accent transition-colors">{service.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">{service.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── Local Authority ── */}
                    <section className="py-24 reveal-section">
                        <div className="relative bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 rounded-3xl p-10 md:p-16 overflow-hidden">
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold-accent/[0.05] rounded-full blur-[120px] pointer-events-none"></div>
                            <div className="relative z-10 max-w-3xl">
                                <span className="font-mono text-xs text-gold-accent opacity-80 tracking-[6px] block mb-6">// LOCAL_PRESENCE</span>
                                <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight leading-tight">
                                    Rooted in Monaghan.<br /><span className="text-gray-500">Built for the world.</span>
                                </h2>
                                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                    Our digital laboratory at Dr Mckenna Terrace is where we transform Monaghan businesses into
                                    market leaders. We combine local market intelligence with world-class engineering.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <div className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-gray-500 tracking-wider">📍 54.2492°N, 6.9683°W</div>
                                    <div className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-gray-500 tracking-wider">🇮🇪 Co. Monaghan, Ireland</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── Final CTA ── */}
                    <section className="py-32 reveal-section">
                        <div className="text-center">
                            <h2 className="text-4xl md:text-7xl font-extrabold tracking-tighter mb-6">
                                Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-accent to-amber-300">dominate</span>
                                <br />Monaghan?
                            </h2>
                            <p className="text-gray-500 text-lg mb-12 max-w-xl mx-auto">Join the businesses that chose architecture over templates.</p>
                            <button onClick={() => navigate('/#contact')}
                                className="group relative p-[2px] rounded-xl overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.15)] hover:shadow-[0_0_60px_rgba(212,175,55,0.3)] transition-shadow duration-500"
                            >
                                <div className="absolute inset-[-200%] w-[500%] h-[500%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent,#D4AF37,transparent_40%)]"></div>
                                <div className="relative z-10 bg-onyx px-12 py-5 rounded-[10px] border border-white/5">
                                    <span className="font-bold text-sm tracking-[3px] uppercase text-white group-hover:text-gold-accent transition-colors">Initialize Protocol</span>
                                </div>
                            </button>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <footer className="border-t border-white/10 py-12 bg-onyx-light/30 relative">
                    <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <p className="text-gray-600 text-xs font-mono tracking-widest uppercase">© {new Date().getFullYear()} ONYX & CODE — MONAGHAN WEB DESIGN.</p>
                            <p className="text-gray-700 text-[10px] tracking-widest opacity-50 mt-1">DIGITAL ARCHITECTURE STUDIO</p>
                        </div>
                        <OnyxBadge />
                    </div>
                </footer>
            </main>
        </div>
    );
}
