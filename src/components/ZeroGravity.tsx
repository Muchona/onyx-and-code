import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import gsap from 'gsap';

const ZeroGravity = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<any>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // --- 1. CONFIGURATION ---
        // --- 1. CONFIGURATION ---
        const isMobile = window.innerWidth < 768;

        const ITEMS = isMobile ? [
            { w: 120, h: 60, label: "Gemini", tech: "AI-1.5" },
            { w: 100, h: 100, label: "Physics", tech: "Matter" },
            { w: 140, h: 80, label: "Visuals", tech: "GSAP" },
            { w: 110, h: 110, label: "Design", tech: "Figma" },
            { w: 130, h: 50, label: "Deploy", tech: "Vercel" }
        ] : [
            { w: 200, h: 100, label: "Gemini", tech: "AI-1.5" },
            { w: 150, h: 150, label: "Physics", tech: "Matter.js" },
            { w: 250, h: 120, label: "Visuals", tech: "GSAP" },
            { w: 180, h: 180, label: "Design", tech: "Figma" },
            { w: 220, h: 80, label: "Deploy", tech: "Vercel" },
            { w: 140, h: 140, label: "Code", tech: "VS Code" }
        ];

        // --- 2. MATTER.JS SETUP ---
        const Engine = Matter.Engine,
            Render = Matter.Render,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Events = Matter.Events,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint;

        const engine = Engine.create();
        engine.gravity.y = 0; // ZERO GRAVITY
        engine.gravity.x = 0;

        // --- 3. DOM GENERATION ---
        // Clear previous children if any (React strict mode duplicate mount fix)
        containerRef.current.innerHTML = '';

        const domEntities: { body: Matter.Body; element: HTMLDivElement }[] = [];

        const bodies = ITEMS.map((item) => {
            const x = window.innerWidth / 2 + (Math.random() - 0.5) * 50;
            const y = window.innerHeight / 2 + (Math.random() - 0.5) * 50;

            // Create Physics Body
            const body = Bodies.rectangle(x, y, item.w, item.h, {
                restitution: 0.9,
                frictionAir: 0.02,
                chamfer: { radius: 12 },
                angle: (Math.random() - 0.5) * 1
            });

            // Create DOM Element
            const el = document.createElement('div');
            el.className = 'phys-item absolute cursor-grab active:cursor-grabbing flex flex-col items-center justify-center text-center backdrop-blur-md bg-white/10 border border-white/10 rounded-xl shadow-2xl select-none';
            el.style.width = `${item.w}px`;
            el.style.height = `${item.h}px`;
            el.style.willChange = 'transform';
            el.innerHTML = `
                <div style="pointer-events: none;">
                    <div class="font-bold text-lg text-white">${item.label}</div>
                    <div class="text-xs font-mono text-gray-400 tracking-wider">${item.tech}</div>
                </div>
            `;

            if (containerRef.current) {
                containerRef.current.appendChild(el);
            }

            domEntities.push({ body, element: el });
            return body;
        });

        Composite.add(engine.world, bodies);

        // --- 4. BOUNDARIES ---
        const createBoundaries = () => {
            const thickness = 100;
            const width = window.innerWidth;
            const height = window.innerHeight;

            return [
                Bodies.rectangle(width / 2, -thickness / 2, width, thickness, { isStatic: true }), // Top
                Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, { isStatic: true }), // Bottom
                Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, { isStatic: true }), // Right
                Bodies.rectangle(-thickness / 2, height / 2, thickness, height, { isStatic: true }) // Left
            ];
        };

        let walls = createBoundaries();
        Composite.add(engine.world, walls);

        // Resize Handler
        const handleResize = () => {
            Composite.remove(engine.world, walls);
            walls = createBoundaries();
            Composite.add(engine.world, walls);
        };
        window.addEventListener('resize', handleResize);

        // --- 5. INTERACTIVITY (MOUSE) ---
        // Invisible canvas for mouse interaction
        const render = Render.create({
            element: containerRef.current || document.body,
            engine: engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
                background: 'transparent'
            }
        });

        // Make canvas invisible but clickable
        render.canvas.style.position = 'absolute';
        render.canvas.style.inset = '0';
        render.canvas.style.opacity = '0';
        render.canvas.style.pointerEvents = 'auto';

        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });

        Composite.add(engine.world, mouseConstraint);
        render.mouse = mouse;

        // --- 6. DRIFT PROTOCOL (Brownian Motion) ---
        Events.on(engine, 'beforeUpdate', () => {
            bodies.forEach(body => {
                if (!body.isStatic) {
                    Matter.Body.applyForce(body, body.position, {
                        x: (Math.random() - 0.5) * 0.0005,
                        y: (Math.random() - 0.5) * 0.0005
                    });
                }
            });
        });

        // --- 7. RENDER LOOP (Sync DOM to Physics) ---
        // Start engine runner
        const runner = Matter.Runner.create();
        Matter.Runner.run(runner, engine);

        // Custom loop for DOM sync
        const updateDOM = () => {
            domEntities.forEach(({ body, element }) => {
                const { x, y } = body.position;
                const angle = body.angle;
                const w = parseFloat(element.style.width);
                const h = parseFloat(element.style.height);

                // Translate to center (Matter.js uses center, DOM uses top-left)
                element.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px) rotate(${angle}rad)`;
            });
            sceneRef.current = requestAnimationFrame(updateDOM);
        };
        updateDOM();

        // --- 8. GSAP ANIMATION ---
        gsap.fromTo(".phys-item",
            { scale: 0, opacity: 0, y: 100 },
            {
                duration: 1.2,
                scale: 1,
                opacity: 1,
                y: 0,
                stagger: 0.1,
                ease: "back.out(1.7)",
                delay: 0.5
            }
        );

        // --- CLEANUP ---
        return () => {
            window.removeEventListener('resize', handleResize);
            if (sceneRef.current) cancelAnimationFrame(sceneRef.current);
            Matter.Runner.stop(runner);
            Matter.Composite.clear(engine.world, false);
            Matter.Engine.clear(engine);
            render.canvas.remove();
            render.canvas = null as any;
            render.context = null as any;
            render.textures = {};
        };
    }, []);



    return (
        <div className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden">
            {/* Grain Overlay */}
            <div className="fixed inset-0 opacity-[0.04] pointer-events-none z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            {/* Physics Container */}
            <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none"></div>

            {/* UI Overlay */}
            <div className="absolute top-10 left-10 z-50 pointer-events-none">
                <h1 className="text-4xl font-bold text-white tracking-tighter mb-2">ZERO-G LABS</h1>
                <p className="text-gray-400 font-mono text-xs">EXPERIMENTAL PHYSICS PROTOCOL</p>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50">
                <button
                    onClick={() => window.location.href = '/'}
                    className="px-8 py-3 bg-white/5 border border-white/10 text-white font-mono text-xs tracking-widest uppercase hover:bg-white/10 transition-colors rounded-full backdrop-blur-md"
                >
                    Return to Base
                </button>
            </div>
        </div>
    );
};

export default ZeroGravity;
