/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'khmer': ['Noto Sans Khmer', 'sans-serif'],
                'mono': ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-slow': 'float 8s ease-in-out infinite',
                'float-delayed': 'float 7s ease-in-out infinite 1s',
                'drift': 'drift 60s linear infinite',
                'drift-slow': 'drift 90s linear infinite',
                'fade-in': 'fadeIn 0.3s ease-out',
                'bounce': 'bounce 1s infinite',
                'spin-slow': 'spin 20s linear infinite',
                'wing-flap': 'wingFlap 0.3s ease-in-out infinite',
                'wing-flap-fast': 'wingFlap 0.15s ease-in-out infinite',
                'bob': 'bob 0.5s ease-in-out infinite',
                'jump': 'jump 0.6s ease-out infinite',
                'twinkle': 'twinkle 2s ease-in-out infinite',
                'shake': 'shake 0.3s ease-in-out',
                'error-flash': 'errorFlash 0.15s ease-out',
                'micro-shake': 'microShake 0.15s ease-in-out',
                'pulse-subtle': 'pulseSubtle 1.5s ease-in-out infinite',
                'count-up': 'countUp 0.6s ease-out',
                'confetti': 'confetti 3s ease-out forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-15px)' },
                },
                drift: {
                    '0%': { transform: 'translateX(-5%)' },
                    '100%': { transform: 'translateX(105vw)' },
                },
                fadeIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                wingFlap: {
                    '0%, 100%': { transform: 'rotate(0deg)' },
                    '50%': { transform: 'rotate(-20deg)' },
                },
                bob: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-3px)' },
                },
                jump: {
                    '0%, 100%': { transform: 'translateY(0) scale(1)' },
                    '50%': { transform: 'translateY(-10px) scale(1.1)' },
                },
                twinkle: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.3' },
                },
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '25%': { transform: 'translateX(-2px)' },
                    '75%': { transform: 'translateX(2px)' },
                },
                errorFlash: {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
                microShake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '25%': { transform: 'translateX(-1px)' },
                    '75%': { transform: 'translateX(1px)' },
                },
                pulseSubtle: {
                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.4)' },
                    '50%': { boxShadow: '0 0 0 8px rgba(59, 130, 246, 0)' },
                },
                countUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                confetti: {
                    '0%': { transform: 'translateY(-100vh) rotate(0deg)', opacity: '1' },
                    '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
                },
            },
        },
    },
    plugins: [],
}
