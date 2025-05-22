import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindScrollbar from "tailwind-scrollbar";

export default {
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1400px'
			}
		},
		screens: {
			'xs': '360px',
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1536px',
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				chat: {
					'user': '#3b82f6',
					'assistant': '#4f46e5',
					'info': '#10b981'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '0.3' },
					'50%': { opacity: '0.7' }
				},
				'cursor-blink': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0' }
				},
				'pulse-fast': {
					'0%, 100%': { opacity: '0.6', height: '20%' },
					'50%': { opacity: '1', height: '100%' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-down': {
					'0%': { transform: 'translateY(-10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-out': {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'scale-out': {
					'0%': { transform: 'scale(1)', opacity: '1' },
					'100%': { transform: 'scale(0.95)', opacity: '0' }
				},
				'morph-to-mic': {
					'0%': { borderRadius: '0.375rem' },
					'100%': { borderRadius: '9999px' }
				},
				'wave-1': {
					'0%, 100%': { height: '12px' },
					'50%': { height: '6px' }
				},
				'wave-2': {
					'0%, 100%': { height: '16px' },
					'25%': { height: '8px' },
					'75%': { height: '14px' }
				},
				'wave-3': {
					'0%, 100%': { height: '20px' },
					'35%': { height: '10px' },
					'65%': { height: '18px' }
				},
				'wave-4': {
					'0%, 100%': { height: '24px' },
					'45%': { height: '14px' },
					'55%': { height: '22px' }
				},
				'wave-5': {
					'0%, 100%': { height: '20px' },
					'40%': { height: '12px' },
					'60%': { height: '18px' }
				},
				'wave-6': {
					'0%, 100%': { height: '16px' },
					'35%': { height: '10px' },
					'65%': { height: '14px' }
				},
				'wave-7': {
					'0%, 100%': { height: '12px' },
					'30%': { height: '8px' },
					'70%': { height: '10px' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-slow': 'pulse-slow 1.5s ease-in-out infinite',
				'cursor-blink': 'cursor-blink 0.4s ease-in-out infinite',
				'pulse-fast': 'pulse-fast 1s ease-in-out infinite',
				'slide-up': 'slide-up 0.2s ease-out',
				'slide-down': 'slide-down 0.2s ease-out',
				'fade-in': 'fade-in 0.2s ease-out',
				'fade-out': 'fade-out 0.2s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'scale-out': 'scale-out 0.2s ease-out',
				'morph-to-mic': 'morph-to-mic 0.2s ease-out forwards',
				'wave-1': 'wave-1 1.2s ease-in-out infinite',
				'wave-2': 'wave-2 1.2s ease-in-out infinite 0.1s',
				'wave-3': 'wave-3 1.2s ease-in-out infinite 0.2s',
				'wave-4': 'wave-4 1.2s ease-in-out infinite 0.3s',
				'wave-5': 'wave-5 1.2s ease-in-out infinite 0.4s',
				'wave-6': 'wave-6 1.2s ease-in-out infinite 0.5s',
				'wave-7': 'wave-7 1.2s ease-in-out infinite 0.6s'
			}
		}
	},
	plugins: [tailwindcssAnimate, tailwindScrollbar],
} satisfies Config;
