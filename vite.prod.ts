import { defineConfig, loadEnv, mergeConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

import base from './vite.base';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    const prefix = env.VITE_REMOTE_PREFIX || '';

    return mergeConfig(base, {
        build: {
            sourcemap: true,
            minify: 'esbuild',
        },
        esbuild: { drop: ['console', 'debugger'] },
        define: {
            __DEV__: JSON.stringify(false),
            __DEBUG__: JSON.stringify(mode === 'debug'),
        },
        plugins: [
            VitePWA({
                registerType: 'autoUpdate',
                includeAssets: ['favicon.svg', 'robots.txt'],
                manifest: {
                    name: 'Mi App Vite',
                    short_name: 'ViteApp',
                    description: 'Mi PWA con Vite',
                    theme_color: '#0f172a',
                    background_color: '#ffffff',
                    display: 'standalone',
                    start_url: '/',
                    icons: [
                        {
                            src: '/pwa-128x128.png',
                            sizes: '128x128',
                            type: 'image/png'
                        },
                        {
                            src: '/pwa-512x512.png',
                            sizes: '512x512',
                            type: 'image/png'
                        }
                    ]
                },

                workbox: {
                    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
                    runtimeCaching: [
                        {
                            urlPattern: /^\/api\/.*$/,
                            handler: 'NetworkOnly',
                            options: {
                                backgroundSync: {
                                    name: 'api-queue',
                                    options: {
                                        maxRetentionTime: 24 * 60,
                                    },
                                },
                            },
                        },
                        {
                            urlPattern: /^\/api\/v1\/.*$/,
                            handler: 'NetworkFirst',
                            options: {
                                cacheName: 'api-v1-cache',
                                networkTimeoutSeconds: 5,
                                expiration: {
                                    maxEntries: 200,
                                    maxAgeSeconds: 60 * 60 * 24 * 7, // 7 días
                                },
                                cacheableResponse: {
                                    statuses: [0, 200],
                                },
                            },
                        },
                        {
                            urlPattern: ({ url }) =>
                                url.origin.includes('tile.openstreetmap.org'),
                            handler: 'CacheFirst',
                            options: {
                                cacheName: 'map-tiles',
                                expiration: {
                                    maxEntries: 3000,
                                    maxAgeSeconds: 60 * 60 * 24 * 30,
                                },
                            },
                        },
                        {
                            urlPattern: ({ url }) =>
                                url.origin.includes('router.project-osrm.org') &&
                                url.pathname.startsWith('/route/v1/'),
                            handler: 'NetworkFirst',
                            options: {
                                cacheName: 'osrm-routes',
                                networkTimeoutSeconds: 5,
                                expiration: {
                                    maxEntries: 500,
                                    maxAgeSeconds: 60 * 60 * 24 * 7, // 7 días
                                },
                                cacheableResponse: {
                                    statuses: [0, 200],
                                },
                            },
                        },
                    ],
                },
            }),
        ],
    })
})
