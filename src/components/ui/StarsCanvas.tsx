'use client';
import { useEffect, useRef } from 'react';

interface StarsCanvasProps {
    transparent?: boolean;       // Background transparency
    maxStars?: number;           // Total number of stars
    hue?: number;                // Color hue for the stars
    brightness?: number;         // Overall star brightness (0–1)
    speedMultiplier?: number;    // Global animation speed multiplier
    twinkleIntensity?: number;   // How often stars twinkle
    className?: string;          // Custom class for the canvas
    paused?: boolean;            // Pause animation toggle
}

export function StarsCanvas({
    transparent = true,
    maxStars = 800,
    hue = 45, // Gold hue (~45-50)
    brightness = 2,
    speedMultiplier = 0.5,
    twinkleIntensity = 50,
    className = '',
    paused = false,
}: StarsCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationRef = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d')!;
        let w = (canvas.width = canvas.offsetWidth);
        let h = (canvas.height = canvas.offsetHeight);

        let stars: any[] = [];
        let count = 0;

        const canvas2 = document.createElement('canvas');
        const ctx2 = canvas2.getContext('2d')!;
        canvas2.width = 100;
        canvas2.height = 100;
        const half = canvas2.width / 2;
        const gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
        gradient2.addColorStop(0.025, '#fff');
        gradient2.addColorStop(0.1, `hsl(${hue}, 80%, 60%)`);
        gradient2.addColorStop(0.25, `hsl(${hue}, 80%, 20%)`);
        gradient2.addColorStop(1, 'transparent');
        ctx2.fillStyle = gradient2;
        ctx2.beginPath();
        ctx2.arc(half, half, half, 0, Math.PI * 2);
        ctx2.fill();

        const random = (min: number, max?: number) => {
            if (max === undefined) {
                max = min;
                min = 0;
            }
            if (min > max) [min, max] = [max, min];
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        const maxOrbit = (x: number, y: number) => {
            const max = Math.max(x, y);
            const diameter = Math.round(Math.sqrt(max * max + max * max));
            return diameter / 2;
        };

        class Star {
            orbitRadius: number;
            radius: number;
            orbitX: number;
            orbitY: number;
            timePassed: number;
            speed: number;
            alpha: number;

            constructor() {
                this.orbitRadius = random(maxOrbit(w, h));
                this.radius = random(60, this.orbitRadius) / 10;
                this.orbitX = w / 2;
                this.orbitY = h / 2;
                this.timePassed = random(0, maxStars);
                this.speed = (random(this.orbitRadius) / 100000) * speedMultiplier;
                this.alpha = (random(2, 10) / 10) * brightness;
                count++;
                stars[count] = this;
            }

            draw() {
                const x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX;
                const y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY;
                const twinkle = random(twinkleIntensity);

                if (twinkle === 1 && this.alpha > 0) {
                    this.alpha -= 0.05;
                } else if (twinkle === 2 && this.alpha < 1) {
                    this.alpha += 0.05;
                }

                ctx.globalAlpha = this.alpha;
                ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
                this.timePassed += this.speed;
            }
        }

        for (let i = 0; i < maxStars; i++) new Star();

        const animate = () => {
            if (paused) return;

            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = transparent ? 'rgba(0, 0, 0, 0)' : 'rgba(15, 15, 15, 1)';
            ctx.clearRect(0, 0, w, h);
            ctx.fillRect(0, 0, w, h);

            ctx.globalCompositeOperation = 'lighter';
            for (let i = 1; i < stars.length; i++) {
                stars[i].draw();
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        const handleResize = () => {
            if (!canvas) return;
            w = canvas.width = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
            // Recalculate star orbits on resize if needed or just let them stay
            stars = [];
            count = 0;
            for (let i = 0; i < maxStars; i++) new Star();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            window.removeEventListener('resize', handleResize);
        };
    }, [transparent, maxStars, hue, brightness, speedMultiplier, twinkleIntensity, paused]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 pointer-events-none ${className}`}
            style={{ display: 'block', width: '100%', height: '100%' }}
        />
    );
}
