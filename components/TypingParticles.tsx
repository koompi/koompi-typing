import React, { useEffect, useRef, useCallback } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;
    type: 'spark' | 'star' | 'confetti';
}

interface TypingParticlesProps {
    active: boolean;
    intensity: 'low' | 'medium' | 'high';
    theme?: 'sky' | 'sunset' | 'forest' | 'space' | 'paper' | 'modern';
    triggerX?: number;
    triggerY?: number;
    combo?: number;
}

const THEME_COLORS: Record<string, string[]> = {
    sky: ['#60A5FA', '#3B82F6', '#FBBF24', '#F59E0B'],
    sunset: ['#F97316', '#FB923C', '#FBBF24', '#EC4899'],
    forest: ['#10B981', '#34D399', '#6EE7B7', '#FBBF24'],
    space: ['#A78BFA', '#8B5CF6', '#EC4899', '#F472B6'],
    paper: ['#D97706', '#B45309', '#78350F', '#FBBF24'],
    modern: ['#6366F1', '#8B5CF6', '#64748B', '#94A3B8'],
};

const STREAK_COLORS = {
    blue: ['#00FFFF', '#38BDF8', '#60A5FA', '#FFFFFF'], // Blue Flame
    rainbow: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF'], // Rainbow
};

export const TypingParticles: React.FC<TypingParticlesProps> = ({
    active,
    intensity,
    theme = 'sky',
    triggerX,
    triggerY,
    combo = 0,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number>(0);
    const lastTriggerRef = useRef<{ x: number; y: number } | null>(null);

    // Determine active colors based on streak
    let activeColors = THEME_COLORS[theme] || THEME_COLORS.sky;
    if (combo >= 50) {
        activeColors = STREAK_COLORS.rainbow;
    } else if (combo >= 10) {
        activeColors = STREAK_COLORS.blue;
    }

    const createParticle = useCallback((x: number, y: number): Particle => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 4;
        const types: ('spark' | 'star' | 'confetti')[] = ['spark', 'star', 'confetti'];

        // Recalculate colors inside callback to capture latest prop values if needed, 
        // but since we reuse 'activeColors' computed in render, we need to make sure 
        // the dependency array is correct or we use a ref. 
        // Simpler: Just rely on the prop update re-triggering this.

        return {
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2,
            life: 1,
            maxLife: 0.5 + Math.random() * 0.5,
            size: 3 + Math.random() * 4,
            color: activeColors[Math.floor(Math.random() * activeColors.length)],
            type: types[Math.floor(Math.random() * types.length)],
        };
    }, [activeColors]);

    const spawnParticles = useCallback((x: number, y: number) => {
        const count = intensity === 'high' ? 12 : intensity === 'medium' ? 8 : 4;
        for (let i = 0; i < count; i++) {
            particlesRef.current.push(createParticle(x, y));
        }
    }, [intensity, createParticle]);

    // Trigger particles when position changes
    useEffect(() => {
        if (!active || triggerX === undefined || triggerY === undefined) return;

        const newTrigger = { x: triggerX, y: triggerY };
        if (
            lastTriggerRef.current &&
            lastTriggerRef.current.x === triggerX &&
            lastTriggerRef.current.y === triggerY
        ) {
            return;
        }

        lastTriggerRef.current = newTrigger;
        spawnParticles(triggerX, triggerY);
    }, [active, triggerX, triggerY, spawnParticles]);

    // Animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current = particlesRef.current.filter(p => {
                p.life -= 0.02;
                if (p.life <= 0) return false;

                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.1; // gravity
                p.vx *= 0.99; // friction

                const alpha = p.life / p.maxLife;
                ctx.globalAlpha = alpha;
                ctx.fillStyle = p.color;

                if (p.type === 'star') {
                    drawStar(ctx, p.x, p.y, p.size, 5);
                } else if (p.type === 'confetti') {
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.life * 10);
                    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                    ctx.restore();
                } else {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                }

                return true;
            });

            ctx.globalAlpha = 1;
            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-50"
            style={{ mixBlendMode: 'screen' }}
        />
    );
};

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, points: number) {
    const outerRadius = size;
    const innerRadius = size / 2;

    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / points - Math.PI / 2;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
}
