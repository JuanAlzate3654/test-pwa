import { defineConfig, loadEnv, mergeConfig } from 'vite'

import base from './vite.base'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    const domain = env.VITE_DOMAIN || 'localhost'

    return mergeConfig(base, {

        server: {
            port: 7007,
            host: true,
            proxy: { '/api': `http://localhost:9003` },
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,OPTIONS',
                'Access-Control-Allow-Headers': 'Origin,Content-Type,Accept,Range'
            }
        },

        define: {
            __DEV__: JSON.stringify(true),
            __DEBUG__: JSON.stringify(mode === 'debug')
        }
    })
})
