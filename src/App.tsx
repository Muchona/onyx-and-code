import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
const Scene3D = lazy(() => import('./components/Scene3D'));
import AgentChat from './components/AgentChat';
import OnyxBadge from './components/OnyxBadge';
import TypewriterText from './components/TypewriterText';
import { insforge } from './lib/insforge';
import { Helmet } from 'react-helmet-async';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const heroRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Refs for staggers
  const processRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  interface Project {
    id: string;
    name: string;
    description: string;
    image_url: string;
    live_url: string;
    has_3d: boolean;
    demo_url?: string;
  }

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await insforge.database
          .from('projects')
          .select('*')
          .order('created_at', { ascending: true });

        if (data) {
          setProjects(data as Project[]);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const leadData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
      status: 'New'
    };

    try {
      // 1. Save to InsForge Database
      const { error: dbError } = await insforge.database
        .from('leads')
        .insert(leadData);

      if (dbError) throw dbError;

      // 2. Dual-post to Formspree for Email Notifications (Zoho/Gmail)
      const emailResponse = await fetch("https://formspree.io/f/mbddjynj", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (emailResponse.ok) {
        navigate('/success');
      } else {
        console.warn("Email dispatch delayed, lead secured in database.");
        navigate('/success'); // Still proceed as DB is the source of truth
      }
    } catch (error) {
      console.error("Transmission error:", error);
      alert("System error. Please contact directly via WhatsApp.");
    }
  };

  useEffect(() => {
    // Aggressive scroll-to-top on refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    window.scrollTo(0, 0);
    const scrollTimeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);

    const ctx = gsap.context(() => {
      // 1. Hero Sequence (Load Animation)
      const tl = gsap.timeline();

      tl.fromTo(navRef.current,
        { y: -100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power4.out',
          delay: 0.2
        }
      )
        .fromTo("h1 .line-inner",
          { y: 120, opacity: 0, skewY: 7 },
          {
            y: 0,
            opacity: 1,
            skewY: 0,
            duration: 1.5,
            stagger: 0.1,
            ease: 'power4.out'
          }, "-=0.5")
        .fromTo(".hero-desc",
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out"
          }, "-=1")
        .fromTo(".hero-scroll-btn",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out"
          }, "-=1");

      // 4. Contact Section Reveal
      gsap.fromTo("#contact-content",
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: "#contact",
            start: "top 75%",
          },
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power4.out"
        }
      );

    });

    return () => {
      ctx.revert();
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <div className="bg-onyx text-white font-sans min-h-screen selection:bg-gold-accent selection:text-black overflow-hidden">
      <Helmet>
        <title>Onyx & Code | High-Performance Web Development Agency Ireland</title>
        <meta name="description" content="Onyx & Code: Monaghan-based digital architects building premium 3D websites, e-commerce platforms, and scalable web applications. Transform your digital presence." />
        <meta name="keywords" content="web design ireland, monaghan web developer, 3d website design, nextjs developer, react agency, high performance websites" />
        <link rel="canonical" href="https://onyxandcode.com/" />
      </Helmet>

      {/* Background Noise with higher contrast */}
      <div className="fixed inset-0 w-full h-full opacity-[0.03] pointer-events-none z-[9999] mix-blend-overlay"
        style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }}></div>

      {/* Navigation */}
      <nav ref={navRef} className="fixed top-0 w-full px-6 md:px-16 py-6 flex justify-between items-center z-50 backdrop-blur-2xl bg-onyx/80 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] opacity-0">
        <div
          className="font-extrabold text-lg tracking-[2px] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] z-50 relative cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ONYX <span className="text-gold-accent drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">&</span> CODE
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-10 absolute left-1/2 -translate-x-1/2">
          {['ABOUT', 'PROCESS', 'PORTFOLIO', 'CONTACT', 'LABS'].map((item) => (
            <li key={item}>
              <a href={item === 'LABS' ? '/labs' : item === 'PORTAL' ? '/login' : `#${item.toLowerCase()}`} className="text-xs font-bold tracking-[2px] text-gray-400 md:hover:text-white transition-all duration-300 md:hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] md:hover:scale-110 inline-block cursor-pointer">
                {item}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-6">
          <a href="#contact" className="hidden md:inline-block group relative p-[1px] rounded-lg overflow-hidden cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-shadow duration-500">
            <div className="absolute inset-[-100%] w-[300%] h-[300%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent,var(--color-gold-accent),transparent_50%)] group-hover:bg-[conic-gradient(from_0deg,transparent,#fff,transparent_50%)]"></div>
            <div className="relative z-10 bg-onyx-light px-6 py-2.5 rounded-[7px] text-xs font-bold uppercase tracking-wider text-white group-hover:bg-black transition-colors border border-white/5">
              Start Project
            </div>
          </a>

          {/* Mobile Burger Button */}
          <button
            className="md:hidden text-white z-[100] relative w-8 h-8 flex flex-col justify-center gap-1.5"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={`block w-full h-0.5 bg-gold-accent transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-full h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-full h-0.5 bg-gold-accent transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay (Moved Outside Nav) */}
      <div className={`fixed inset-0 bg-onyx/90 backdrop-blur-3xl z-[40] transition-all duration-500 flex flex-col justify-center items-center gap-10 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        {/* Menu Branding - Optional since Nav is visible, but good for focus */}
        <div className="font-extrabold text-2xl tracking-[4px] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] mb-8">
          ONYX <span className="text-gold-accent drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">&</span> CODE
        </div>

        {['ABOUT', 'PROCESS', 'PORTFOLIO', 'CONTACT', 'LABS'].map((item) => (
          <a
            key={item}
            href={item === 'LABS' ? '/labs' : item === 'PORTAL' ? '/login' : `#${item.toLowerCase()}`}
            className="text-4xl font-extrabold tracking-[2px] text-white/70 md:hover:text-white transition-all duration-300 md:hover:scale-105"
            onClick={() => setIsMenuOpen(false)}
          >
            {item}
          </a>
        ))}
      </div>

      {/* GLOBAL 3D LAYER - Preserved across scroll and menu states */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Mobile: Centered. Desktop: Right Side */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[60vh] md:top-0 md:left-auto md:right-0 md:translate-x-0 md:translate-y-0 md:w-1/2 md:h-full">
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </div>
      </div>

      {/* Main Content Wrapper - Fades out when menu is open */}
      <main className={`relative z-10 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="container mx-auto px-6 md:px-12 max-w-7xl relative">
          {/* Hero Section */}
          <section className="pt-32 md:pt-48 pb-20 relative" ref={heroRef}>

            <h1 className="text-5xl md:text-9xl font-extrabold tracking-tighter leading-tight drop-shadow-2xl relative z-20 mb-12">
              <div className="overflow-hidden py-2">
                <span className="line-inner block opacity-0">Architecting</span>
              </div>
              <div className="overflow-hidden py-2 min-h-[1.2em]">
                <TypewriterText
                  strings={['Luxury Websites', 'Web Design', 'Brands', '3D Experiences', 'Animations']}
                  className="line-inner inline-block text-transparent bg-clip-text bg-gradient-to-r from-gold-accent to-white drop-shadow-[0_0_30px_rgba(212,175,55,0.15)]"
                />
              </div>
            </h1>

            <div className="overflow-hidden">
              <div className="overflow-hidden">
                <p className="hero-desc opacity-0 max-w-2xl text-xl md:text-2xl text-gray-400 leading-relaxed border-l-2 border-gold-accent pl-6 mb-8">
                  Forging immersive digital experiences that redefine interaction.
                  <br />
                  Where precision engineering meets avant-garde design.
                </p>
              </div>
            </div>
          </section>

          {/* Service Cards Marquee - Mintora Style */}
          <div
            className="relative py-12 mt-8 mb-32 opacity-0 hero-scroll-btn"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 12.5%, black 87.5%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12.5%, black 87.5%, transparent 100%)'
            }}
          >

            <div className="flex gap-4 animate-scroll w-max hover:[animation-play-state:paused]" style={{ animationDuration: '60s', animationTimingFunction: 'linear' }}>
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  {[
                    // Framer Design
                    {
                      icon: <svg viewBox="0 0 24 24" className="w-[25px] h-[25px] fill-current"><path d="M4 0h16v8h-8zM4 8h8l8 8h-8zM4 16h8v8z" /></svg>,
                      label: 'Framer Design'
                    },
                    // Web Design (Monitor/Screen)
                    {
                      icon: <svg viewBox="0 0 24 24" className="w-[25px] h-[25px] fill-none stroke-current stroke-[1.5]"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>,
                      label: 'Web Design'
                    },
                    // Brand Identity (Layers/Cards)
                    {
                      icon: <svg viewBox="0 0 24 24" className="w-[25px] h-[25px] fill-none stroke-current stroke-[1.5]"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 17 7 7 7 7 2 17 2"></polyline></svg>,
                      label: 'Brand Identity'
                    },
                    // Graphic Design (Pen)
                    {
                      icon: <svg viewBox="0 0 24 24" className="w-[25px] h-[25px] fill-none stroke-current stroke-[1.5]"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>,
                      label: 'Graphic Design'
                    },
                    // System Arch (Command)
                    {
                      icon: <svg viewBox="0 0 24 24" className="w-[25px] h-[25px] fill-none stroke-current stroke-[1.5]"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>,
                      label: 'System Arch'
                    }
                  ].map((service, idx) => (
                    <div
                      key={`${service.label}-${idx}`}
                      className="flex items-center gap-[15px] py-[20px] px-[30px] bg-[#0f0f0f] rounded-[15px] whitespace-nowrap shadow-[inset_0px_1px_20px_0px_rgba(255,255,255,0.07)] border border-white/5 transition-colors duration-300 md:hover:border-white/10 group cursor-default"
                    >
                      <span className="text-white group-hover:text-gold-accent transition-colors duration-300 flex items-center justify-center">
                        {service.icon}
                      </span>

                      <span className="font-medium text-[19px] text-white tracking-wide">
                        {service.label}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* About Section */}
          <section id="about" className="py-20 md:py-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <span className="font-mono text-xs text-gold-accent opacity-80 tracking-[4px] block mb-6 drop-shadow-[0_0_5px_rgba(212,175,55,0.4)]">
                    // ORIGIN_STORY
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 leading-tight">
                  We Forge <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Digital Reality.</span>
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6 text-lg">
                  Based in Monaghan, Ireland, Onyx & Code is a full-stack web development and design agency. We are not just designers; we are architects and software engineers of the virtual frontier.
                </p>
                <p className="text-gray-400 leading-relaxed text-lg">
                  Merging high-fidelity 3D environments with robust, scalable engineering, we build web experiences that feel less like pages and more like places.
                </p>
              </div>
              <div className="relative h-full min-h-[400px]">
                {/* Placeholder for About Imagery/Graphic - Enhanced Glass */}
                <div className="absolute inset-0 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] flex items-center justify-center overflow-hidden group md:hover:border-gold-accent/40 transition-all duration-700">
                  <div className="absolute inset-0 bg-gold-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="h-full w-full absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-accent/20 via-transparent to-transparent opacity-60"></div>

                  {/* Decorative Elements inside Glass */}
                  <div className="absolute top-10 right-10 w-20 h-20 border-r-2 border-t-2 border-white/20 rounded-tr-3xl"></div>
                  <div className="absolute bottom-10 left-10 w-20 h-20 border-l-2 border-b-2 border-white/20 rounded-bl-3xl"></div>

                  <span className="font-mono text-6xl text-white/5 group-hover:text-gold-accent/40 transition-colors uppercase tracking-widest font-black -rotate-90 select-none">
                    Onyx
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Blueprint / Process Cards */}
          <section id="process" className="pt-20" ref={processRef}>
            <span className="font-mono text-xs text-gold-accent opacity-80 tracking-[4px] block mb-8 drop-shadow-[0_0_5px_rgba(212,175,55,0.4)]">
                // CORE_PROTOCOL_01
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {[
                { id: '01', title: 'Strategic Discovery', desc: 'Dissecting business models to build foundations for high-traffic AI interactions.' },
                { id: '02', title: 'Precision Design', desc: 'Executive-standard builds using optimized frameworks and immersive 3D spatial orchestration.' },
                { id: '03', title: 'Visual Excellence', desc: 'Polishing user journeys with physics, motion, and lighting that defines the premium brand.' }
              ].map((step) => (
                <div key={step.id} className="process-card h-full bg-onyx-light p-12 md:p-12 border border-white/10 md:hover:border-gold-accent/50 transition-all duration-500 md:hover:-translate-y-2 md:hover:scale-[1.02] shadow-lg md:hover:shadow-2xl md:hover:shadow-gold-accent/10 rounded-xl backdrop-blur-sm group flex flex-col justify-center cursor-pointer">
                  <span className="font-mono text-gold-accent text-xs tracking-widest block mb-6 px-3 py-1 bg-gold-accent/10 w-fit rounded group-hover:bg-gold-accent group-hover:text-black transition-colors">
                    {step.id}_PHASE
                  </span>
                  <h3 className="text-2xl font-bold mb-4 tracking-tight text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{step.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Portfolio Section */}
          <section id="portfolio" className="pt-40" ref={portfolioRef}>
            <h2 className="text-4xl font-bold tracking-tight mb-16 border-l-4 border-gold-accent pl-6 drop-shadow-lg">
              Selected Systems
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              {isLoadingProjects ? (
                // Loading Skeletons
                [...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="w-full aspect-video bg-white/5 rounded-2xl mb-6"></div>
                    <div className="h-6 bg-white/5 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-white/5 rounded w-1/2"></div>
                  </div>
                ))
              ) : (
                projects.map((project) => (
                  <div key={project.id} className="project-card group block">
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="block relative">
                      <div className="w-full aspect-video bg-onyx-light border border-white/10 rounded-2xl overflow-hidden mb-6 relative shadow-2xl transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] group-hover:border-white/20">
                        <div className="absolute inset-0 bg-gold-accent/0 group-hover:bg-gold-accent/5 transition-colors duration-500 z-10"></div>
                        <img
                          src={project.image_url}
                          alt={project.name}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out grayscale group-hover:grayscale-0"
                        />

                        {/* 3D Badge if applicable */}
                        {project.has_3d && (
                          <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-gold-accent animate-pulse"></div>
                            <span className="text-[10px] font-bold tracking-widest text-white uppercase">3D Interactive</span>
                          </div>
                        )}
                      </div>
                    </a>

                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-gold-accent transition-colors drop-shadow-md">
                          <a href={project.live_url} target="_blank" rel="noopener noreferrer">{project.name}</a>
                        </h3>
                        <p className="text-gray-500 text-sm group-hover:text-gray-300 transition-colors mb-4">{project.description}</p>
                      </div>

                      {/* Quick Action for 3D Demo */}
                      {project.has_3d && project.demo_url && (
                        <button
                          onClick={() => navigate(project.demo_url!)}
                          className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-gold-accent hover:text-black hover:border-gold-accent transition-all duration-300 group/btn"
                        >
                          <span className="text-[10px] font-bold tracking-widest uppercase">Launch Demo</span>
                          <svg className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Seamless Collaboration Section (New) */}
          <section className="py-20 md:py-32">
            <div className="bg-onyx-light border border-white/5 rounded-3xl p-8 md:p-16 overflow-hidden relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="relative z-10">
                  <span className="font-mono text-xs text-gold-accent opacity-80 tracking-[4px] block mb-6 drop-shadow-[0_0_5px_rgba(212,175,55,0.4)]">
                      // SYNC_PROTOCOL
                  </span>
                  <h2 className="text-3xl md:text-5xl font-bold mb-6">Seamless collaboration</h2>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    Work directly with our expert designers via Slack, Trello, or Notion. Get updates, share feedback, and launch faster than ever. We ensure smooth and fast communication.
                  </p>
                </div>

                {/* Icon Grid - Original Colors & Animation */}
                <div className="relative">
                  <div className="grid grid-cols-4 gap-4 mask-image-gradient relative z-20">
                    {[
                      { name: 'Figma', color: '#F24E1E', icon: <path d="M8.33 12.36a3.63 3.63 0 0 1-3.64-3.64 3.63 3.63 0 0 1 3.64-3.63 3.63 3.63 0 0 1 3.63 3.63v3.64H8.33zm0 7.27a3.63 3.63 0 0 1-3.64-3.64c0-2.01 1.63-3.64 3.64-3.64h3.63v3.64a3.63 3.63 0 0 1-3.63 3.64zM15.6 5.09a3.63 3.63 0 1 1 0 7.27h-3.64V5.09h3.64zm0-3.64H8.33a3.63 3.63 0 1 0 0 7.27h3.64V5.09a3.63 3.63 0 1 0 3.63-3.64z" /> },
                      { name: 'React', color: '#61DAFB', icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" /> }, // Simplified React
                      { name: 'Tailwind', color: '#38B2AC', icon: <path d="M11.6 12.4c1.1-1.3 1.1-3.5 0-4.8 1.6 1.4 4.5 2.1 6.5.1 1.1-1.1 1.5-2.6 1.3-4.1.8.8 1.5 2 1.5 3.5 0 2.2-1.6 4.1-3.7 4.5-1.9.4-3.7-.6-4.5-1.9-.3-.5-.7-.8-1.1-.8-.4 0-.8.3-1 .8-.8 1.3-2.6 2.3-4.5 1.9-2.2-.4-3.7-2.3-3.7-4.5 0-1.5.7-2.7 1.5-3.5-.2 1.4.2 2.9 1.3 4.1 2 2 4.9 1.3 6.5-.1 1.1 1.3 1.1 3.5 0 4.8 0 0 0 0 0 0z" /> },
                      { name: 'Gemini', color: '#8E75B2', icon: <path d="M11.96 24l-1.39-1.4c-3.66-3.66-3.66-9.58 0-13.24L11.96 8l1.39 1.36c3.66 3.66 3.66 9.58 0 13.24L11.96 24z M4 11.96l1.4-1.39c3.66-3.66 9.58-3.66 13.24 0L20 11.96l-1.36 1.39c-3.66 3.66-9.58 3.66-13.24 0L4 11.96z" /> }, // Abstract Star
                      { name: 'ChatGPT', color: '#74AA9C', icon: <path d="M20.9 9.3c.3-.9.4-1.9.1-2.9-.5-2.5-2.7-4.3-5.3-4.3h-.3c-1.3-.8-2.8-1.1-4.3-.8-2.6.5-4.5 2.6-4.9 5.2-.8.2-1.7.6-2.4 1.2-1.9 1.6-2.3 4.4-.9 6.5.7.9 1.7 1.6 2.8 2 .3.9.4 1.9.1 2.9-.5 2.5-2.7 4.3-5.3 4.3H.2c-1.3.8-2.8 1.1-4.3.8-2.6-.5-4.5-2.6-4.9-5.2.8-.2 1.7-.6 2.4-1.2 1.9-1.6 2.3-4.4.9-6.5-.8-1.1-1.8-1.8-2.9-2.1z" /> }, // Simplified Swirl
                      { name: 'Notion', color: '#FFFFFF', icon: <path d="M4.46 2L2 3.64v15.17L4.92 22h14.54L22 20.36V5.4L19.54 2H4.46zM14.65 17.65h-2.1l-4.7-8.3v8.3H5.95V6.35h2.1l4.7 8.3V6.35h1.9v11.3z" /> },
                      { name: 'Slack', color: '#E01E5A', icon: <path d="M5.04 14.55a2.52 2.52 0 1 1 2.52-2.52v2.52H5.04zM5.04 8.24a2.52 2.52 0 1 1 2.52 2.52h-2.52V8.24zm6.27-3.2a2.52 2.52 0 1 1-2.52 2.52V5.04h2.52zm3.2 3.2a2.52 2.52 0 1 1 2.52-2.52v2.52h-2.52zm3.2 6.27a2.52 2.52 0 1 1-2.52-2.52v-2.52h2.52zm-3.2 3.2a2.52 2.52 0 1 1-2.52-2.52v2.52h2.52zM8.79 17.75a2.52 2.52 0 1 1 2.52 2.52h-2.52v-2.52zM8.79 11.48a2.52 2.52 0 1 1-2.52-2.52h2.52v2.52z" /> },
                      { name: 'GitHub', color: '#FFFFFF', icon: <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" /> },
                      { name: 'Trello', color: '#0079BF', icon: <path d="M19.3 2H4.7C3.2 2 2 3.2 2 4.7v14.6C2 20.8 3.2 22 4.7 22h14.6c1.5 0 2.7-1.2 2.7-2.7V4.7C22 3.2 20.8 2 19.3 2zM9.8 17.6H5.4V5.7h4.4v11.9zm8.8-5.3h-4.4V5.7h4.4v6.6z" /> },
                      { name: 'NextJS', color: '#FFFFFF', icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.8 14.4L9.6 8.3V16H8V8h2.05l7.2 8.1V8h1.6v8.4h-2.05z" /> },
                      { name: 'Linear', color: '#5E6AD2', icon: <path d="M11.6 2C6.3 2 2 6.3 2 11.6s4.3 9.6 9.6 9.6 9.6-4.3 9.6-9.6S16.9 2 11.6 2zm0 17.6c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z M12.5 7.5c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z" /> },
                      { name: 'Vercel', color: '#FFFFFF', icon: <path d="M12 1L24 22H0L12 1z" /> }
                    ].map((tool) => (
                      <div
                        key={tool.name}
                        className="aspect-square bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-3xl group relative transition-all duration-500 md:hover:border-white/30 md:hover:bg-white/10"
                        title={tool.name}
                      >
                        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current transition-all duration-300 group-hover:scale-110" style={{ color: tool.color }}>
                          {tool.icon}
                        </svg>

                        {/* Glow Effect on Hover */}
                        <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 rounded-xl pointer-events-none" style={{ color: tool.color }}></div>
                      </div>
                    ))}
                  </div>
                  {/* Fade Overlay for Left-to-Right Fade Look */}
                  <div className="absolute inset-0 bg-gradient-to-r from-onyx-light via-transparent to-transparent z-30 pointer-events-none"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Features / Scale Section (New) */}
          <section className="py-20 md:py-32">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">Your scalable,<br />dedicated design team</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Get a professional website without the upfront costs. We design, optimize, and maintain, so you can focus on growing your business.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1: Scale as you grow */}
              <div className="bg-onyx-light border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-white/20 transition-all h-[500px] flex flex-col">
                <h3 className="text-2xl font-bold mb-4">Scale as you grow</h3>
                <p className="text-gray-400 mb-8">Upgrade anytime—whether you need a landing page or a website.</p>

                {/* Graphic: Chart */}
                <div className="mt-auto bg-black/40 rounded-xl p-6 border border-white/5 relative h-64 flex items-end justify-between px-8 pb-8">
                  <div className="absolute top-4 left-4 text-xs font-bold bg-white/10 px-2 py-1 rounded">+42%</div>
                  <div className="w-8 bg-blue-500/30 rounded-t-lg h-[40%]"></div>
                  <div className="w-8 bg-blue-500/50 rounded-t-lg h-[60%]"></div>
                  <div className="w-8 bg-blue-500/70 rounded-t-lg h-[50%]"></div>
                  <div className="w-8 bg-blue-500 rounded-t-lg h-[80%]"></div>

                  {/* Pie Chart Mini */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-onyx border-4 border-onyx-light rounded-full flex overflow-hidden">
                    <div className="w-1/2 h-full bg-blue-500"></div>
                    <div className="w-1/2 h-full bg-gold-accent"></div>
                  </div>
                </div>
              </div>

              {/* Card 3: Strategic Partnership */}
              <div className="bg-onyx-light border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-white/20 transition-all h-[500px] flex flex-col">
                <h3 className="text-2xl font-bold mb-4">Strategic Partnership</h3>
                <p className="text-gray-400 mb-8">We partner with you to ensure your digital presence evolves with your business.</p>

                {/* Graphic: Chat Bubbles */}
                <div className="mt-auto flex flex-col gap-4">
                  {/* Bubble 1 (Req) */}
                  <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-sm p-4 text-sm text-gray-300 self-start max-w-[90%]">
                    Ready for the next phase?
                  </div>
                  {/* Bubble 2 (Resp) */}
                  <div className="bg-gold-accent/10 border border-gold-accent/20 rounded-2xl rounded-br-sm p-4 text-sm text-white self-end max-w-[90%] text-right">
                    Always. System optimized and ready to scale.
                  </div>

                  <div className="flex gap-2 items-center mt-2 opacity-50">
                    <div className="w-6 h-6 rounded-full bg-white/20"></div>
                    <div className="h-1 flex-1 bg-white/5 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-32">
            <span className="font-mono text-xs text-gold-accent opacity-80 tracking-[4px] block mb-12 text-center drop-shadow-[0_0_5px_rgba(212,175,55,0.4)]">
                 // PROTOCOL_ACCESS
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {/* Card 1: Landing Page */}
              <div className="group relative bg-onyx-light border border-white/10 p-10 rounded-2xl overflow-hidden md:hover:border-gold-accent/50 transition-all duration-500 md:hover:shadow-[0_0_50px_rgba(212,175,55,0.1)]">
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gold-accent"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>

                <h3 className="text-3xl font-bold mb-4 text-white">Project Fee</h3>
                <p className="text-gray-400 mb-6">Full ownership of your digital infrastructure. One-time purchase.</p>

                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-4xl font-bold text-white">2500 €</span>
                  <span className="text-gray-500">- 5000 €</span>
                </div>

                <ul className="space-y-4 mb-10 text-sm text-gray-300">
                  <li className="flex items-center gap-3"><span className="text-gold-accent">✓</span> Custom React Architecture</li>
                  <li className="flex items-center gap-3"><span className="text-gold-accent">✓</span> High-Fidelity 3D Elements</li>
                  <li className="flex items-center gap-3"><span className="text-gold-accent">✓</span> Fluid GSAP Animations</li>
                  <li className="flex items-center gap-3"><span className="text-gold-accent">✓</span> Full Source Code Ownership</li>
                </ul>

                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full py-4 border border-white/20 rounded-lg md:hover:bg-white md:hover:text-black font-bold tracking-widest uppercase transition-all"
                >
                  Start Project
                </button>
              </div>

              {/* Card 2: Multi-page Website (New) */}
              <div className="group relative bg-onyx-light border border-white/10 p-10 rounded-2xl overflow-hidden md:hover:border-gold-accent/50 transition-all duration-500 md:hover:shadow-[0_0_50px_rgba(212,175,55,0.1)]">
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gold-accent"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>

                <h3 className="text-3xl font-bold mb-4 text-white">Website as a Service</h3>
                <p className="text-gray-400 mb-6">Total digital management. Premium presence with zero upfront risk.</p>

                <div className="flex flex-col gap-1 mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">250 €</span>
                    <span className="text-gray-500">/ month</span>
                  </div>
                  <span className="text-gold-accent font-mono text-[10px] tracking-widest uppercase">0 € Upfront Cost</span>
                </div>

                <ul className="space-y-4 mb-10 text-sm text-gray-300">
                  <li className="flex items-center gap-3"><span className="text-gold-accent">✓</span> Hosting, Secuity & Performance</li>
                  <li className="flex items-center gap-3"><span className="text-gold-accent">✓</span> Interactive 3D & GSAP Motion</li>
                  <li className="flex items-center gap-3"><span className="text-gold-accent">✓</span> AI-Driven Content Updates</li>
                  <li className="flex items-center gap-3"><span className="text-gold-accent">✓</span> Priority Design Support</li>
                </ul>

                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full py-4 bg-gold-accent text-black rounded-lg md:hover:bg-white transition-all font-bold tracking-widest uppercase"
                >
                  Subscribe Now
                </button>
              </div>

              {/* Card 3: Enterprise Plans (Updated Minimalist) */}
              <div className="group relative bg-[#0a0a0a] border border-white/10 p-10 rounded-2xl overflow-hidden md:hover:border-white/20 transition-all duration-500 flex flex-col justify-center">
                <h3 className="text-3xl font-bold mb-6 text-white">Enterprise Plans</h3>
                <p className="text-gray-400 mb-12 text-lg leading-relaxed">
                  Custom solutions tailored to your business needs—contact us.
                </p>

                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold tracking-widest uppercase rounded-lg md:hover:bg-white md:hover:text-black transition-all"
                >
                  Contact sales
                </button>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-24 md:py-48 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
            <div id="contact-content">
              <h2 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] mb-8 drop-shadow-2xl">
                Ready for<br />Deployment?
              </h2>
              <p className="text-gray-400 max-w-sm leading-relaxed text-lg mb-12">
                Upload your assets or project specifications to initialize the protocol.
                Our agents are standing by.
              </p>

              {/* Direct Contact Channels */}
              <div className="flex flex-col gap-4">
                {/* Phone */}
                <a href="tel:+353894459967" className="group flex items-center gap-5 bg-white/5 border border-white/10 p-5 rounded-xl hover:bg-white/10 hover:border-gold-accent/40 transition-all duration-300 w-fit cursor-pointer overflow-hidden relative">
                  {/* Glass Shine Effect */}
                  <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-0 left-0 w-[50%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shine"></div>
                  </div>

                  <div className="w-12 h-12 bg-onyx rounded-full flex items-center justify-center border border-white/10 group-hover:border-gold-accent/50 group-hover:scale-110 transition-all shadow-lg relative z-10">
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-gold-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="relative z-10">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-0.5 group-hover:text-gold-accent transition-colors">Direct Line</div>
                    <div className="text-xl font-bold text-white group-hover:text-white transition-colors tracking-wide">+353 89 445 9967</div>
                  </div>
                </a>

                {/* WhatsApp */}
                <a href="https://wa.me/353894459967" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-5 bg-white/5 border border-white/10 p-5 rounded-xl hover:bg-[#25D366]/10 hover:border-[#25D366]/50 transition-all duration-300 w-fit cursor-pointer overflow-hidden relative">
                  {/* Glass Shine Effect */}
                  <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-0 left-0 w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shine delay-75"></div>
                  </div>

                  <div className="w-12 h-12 bg-onyx rounded-full flex items-center justify-center border border-white/10 group-hover:border-[#25D366]/50 group-hover:scale-110 transition-all shadow-lg relative z-10">
                    <svg className="w-5 h-5 text-gray-300 group-hover:text-[#25D366] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </div>
                  <div className="relative z-10">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-0.5 group-hover:text-[#25D366] transition-colors">Start Chat</div>
                    <div className="text-xl font-bold text-white group-hover:text-white transition-colors tracking-wide">WhatsApp</div>
                  </div>
                </a>
              </div>

            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8" id="contact-form">
              <div className="group">
                <input type="text" name="name" placeholder="Authorized Name" required className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder-gray-500 outline-none focus:border-gold-accent focus:bg-white/[0.02] transition-colors text-lg" />
              </div>

              <div className="group">
                <input type="email" name="email" placeholder="Business Email" required className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder-gray-500 outline-none focus:border-gold-accent focus:bg-white/[0.02] transition-colors text-lg" />
              </div>
              <div className="group">
                <textarea name="message" rows={4} placeholder="System Requirements / Brief..." required className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder-gray-500 outline-none focus:border-gold-accent focus:bg-white/[0.02] transition-colors text-lg resize-none"></textarea>
              </div>

              <label className="border border-dashed border-white/20 hover:border-gold-accent/60 bg-white/5 hover:bg-white/10 rounded-xl p-10 text-center cursor-pointer transition-all duration-300 group shadow-inner">
                <span className="text-sm text-gray-500 group-hover:text-white transition-colors">Attach 3D Blueprints / Brief (PDF, ZIP, OBJ)</span>
                <input type="file" name="upload" className="hidden" />
              </label>

              <button type="submit" className="w-fit shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_35px_rgba(212,175,55,0.4)] transition-shadow duration-500 rounded-lg">
                <div className="relative group overflow-hidden rounded-lg p-[1px]">
                  <div className="absolute inset-[-100%] w-[300%] h-[300%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent,var(--color-gold-accent),transparent_50%)]"></div>
                  <div className="relative bg-onyx px-10 py-4 rounded-[7px] border border-white/10">
                    <span className="font-bold text-sm tracking-widest uppercase text-white group-hover:text-gold-accent transition-colors">
                      Initialize Protocol
                    </span>
                  </div>
                </div>
              </button>
            </form>
          </section>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 py-12 bg-onyx-light/30 relative overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">

            {/* Left: Copyright & Security (Original Content) */}
            <div className="text-center md:text-left flex flex-col gap-2">
              <p className="text-gray-600 text-xs font-mono tracking-widest uppercase">
                © {new Date().getFullYear()} ONYX & CODE — MONAGHAN, IRELAND.
              </p>
              <p className="text-gray-700 text-[10px] tracking-widest opacity-50">
                SECURED BY ANTIGRAVITY
              </p>
            </div>

            {/* Right: The Badge */}
            <div className="relative z-10">
              <OnyxBadge />
            </div>

          </div>
        </footer>

        <AgentChat />
      </main>
    </div>
  );
}
