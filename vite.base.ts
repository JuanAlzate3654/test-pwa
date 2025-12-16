import { federation } from '@module-federation/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'

import pkg from './package.json'

const deps = (pkg as any).dependencies

export default defineConfig({
  build: { target: 'chrome89' },
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA(),
    federation({
      name: 'oime_shell_admin',
      filename: 'remoteEntry.js',
      remotes: {},
      exposes: {},
      shared: {
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
        '@mui/material': { singleton: true, requiredVersion: deps['@mui/material'] },
        '@mui/system': { singleton: true, requiredVersion: deps['@mui/system'] },
        '@mui/icons-material': { singleton: true, requiredVersion: deps['@mui/icons-material'] },
        '@mui/utils': { singleton: true, requiredVersion: deps['@mui/utils'] },
        '@emotion/react': { singleton: true, requiredVersion: deps['@emotion/react'] },
        '@emotion/styled': { singleton: true, requiredVersion: deps['@emotion/styled'] },
        'react-router-dom': { singleton: true, requiredVersion: deps['react-router-dom'] },
        '@reduxjs/toolkit': { singleton: true, requiredVersion: deps['@reduxjs/toolkit'] },
        'react-redux': { singleton: true, requiredVersion: deps['react-redux'] },
        redux: { singleton: true, requiredVersion: deps['redux'] },
        'redux-saga': { singleton: true, requiredVersion: deps['redux-saga'] },
        'react-toastify': { singleton: true, requiredVersion: deps['react-toastify'] },
        'i18next': { singleton: true, requiredVersion: deps['i18next'] },
        'i18next-browser-languagedetector': { singleton: true, requiredVersion: deps['i18next-browser-languagedetector'] },
        'react-i18next': { singleton: true, requiredVersion: deps['react-i18next'] },
      },
    }),
  ],
})
