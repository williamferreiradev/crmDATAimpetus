import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './app.vue',
        './error.vue'
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#00E096', // Neon Green
                    500: '#00E096',
                    600: '#00B378',     // Hover
                    glow: '#00E09666'   // Glow effect
                },
                dark: {
                    bg: '#050505',      // Absolute Background
                    surface: '#121212', // Cards/Modals
                    border: '#1F1F1F',  // Subtle Borders
                    text: '#FFFFFF',
                    muted: '#9CA3AF'
                }
            },
            boxShadow: {
                'neon': '0 0 20px rgba(0, 224, 150, 0.4)', // Neon glow effect
            }
        }
    }
}
