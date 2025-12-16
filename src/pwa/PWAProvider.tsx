import { createContext, useContext } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

type PWAContextType = {
    offlineReady: boolean
    needRefresh: boolean
    update: () => void
}

const PWAContext = createContext<PWAContextType | null>(null)

export function PWAProvider({ children }: { children: React.ReactNode }) {
    const {
        offlineReady: [offlineReady],
        needRefresh: [needRefresh],
        updateServiceWorker
    } = useRegisterSW({
        onRegistered() {
            console.log('✅ Service Worker registrado')
        },
        onRegisterError(error) {
            console.error('❌ Error registrando SW', error)
        }
    })

    const update = () => {
        sessionStorage.removeItem('pwa-update-toast')
        void updateServiceWorker(true)
    }

    return (
        <PWAContext.Provider
            value={{
                offlineReady,
                needRefresh,
                update
            }}
        >
            {children}
        </PWAContext.Provider>
    )
}

export function usePWA() {
    const ctx = useContext(PWAContext)
    if (!ctx) {
        throw new Error('usePWA must be used inside PWAProvider')
    }
    return ctx
}
