import { loadRemote, registerRemotes } from '@module-federation/runtime';
import i18next from "i18next";
import * as React from 'react'

declare const __REMOTES__: Record<string, string | { entry: string; type?: 'module' | 'script' }> | undefined

function normalizeRemoteEntry(name: string, def: string | { entry: string; type?: 'module' | 'script' }) {
    if (typeof def === 'string') {
        return { name, entry: def, type: 'module' as const }
    }
    return { name, entry: def.entry, type: 'module' as const }
}

export function registerAllRemotes() {
    const src = __REMOTES__ || {}
    const entries = Object.entries(src).map(([name, def]) => normalizeRemoteEntry(name, def))
    if (entries.length) registerRemotes(entries)
}

export function registerRemotesAtRuntime(remotes: Record<string, string | { entry: string; type?: 'module' | 'script' }>) {
    const entries = Object.entries(remotes).map(([name, def]) => normalizeRemoteEntry(name, def))
    if (entries.length) registerRemotes(entries)
}

type ErrorUIMode = 'inline' | 'toast' | 'none'

export type LoadModuleOptions = {
    timeoutMs?: number
    label?: string
    errorUI?: ErrorUIMode
    Fallback?: React.ComponentType<{ error?: unknown; retry?: () => void; spec?: string }>
    Loading?: React.ComponentType<{ label?: string }>
}
const DefaultLoading: React.FC<{ label?: string }> = ({ label }) => {
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(1px)',
                zIndex: 2000,
            }}
            aria-label={label ? `Cargando ${label}` : 'Cargando'}
            role="status"
        >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        border: '3px solid rgba(0,0,0,0.15)',
                        borderTopColor: 'rgba(0,0,0,0.55)',
                        animation: 'spin 0.8s linear infinite',
                    }}
                />
                {label ? <div style={{ fontSize: 14, color: '#333' }}>{label}</div> : null}
                <style>
                    {`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}
                </style>
            </div>
        </div>
    )
}

export async function loadModuleSafe(
    scope: string,
    exposedModule: string,
    opts?: LoadModuleOptions & { /** interno para lazyRemote */ _retry?: () => void }
): Promise<any> {
    const key = exposedModule.replace(/^(\.\/)+/, '')
    const spec = `${scope}/${key}`
    const timeoutMs = opts?.timeoutMs ?? 15_000

    const p = loadRemote(spec)
    const guarded = new Promise<any>((resolve, reject) => {
        const t = setTimeout(() => reject(new Error(`Timeout ${timeoutMs}ms: ${spec}`)), timeoutMs)
        p.then((m) => { clearTimeout(t); resolve(m) })
            .catch((e) => { clearTimeout(t); reject(e) })
    })

    try {
        return await guarded
    } catch (error) {
        console.error(`Error loading remote module`, error)
        const mode: ErrorUIMode = opts?.Fallback ? 'inline' : (opts?.errorUI ?? 'inline')
        const label = opts?.label ?? i18next.t("error_loading_module")
        const mui = await import('@mui/material').catch(() => null as any)

        const InlineDefault: React.FC = () => {
            const [open, setOpen] = React.useState(true)
            if (mode === 'toast') {
                if (mui?.Snackbar && mui?.Alert) {
                    return (
                        <mui.Snackbar
                            open={open}
                            onClose={() => setOpen(false)}
                            autoHideDuration={6000}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                            <mui.Alert onClose={() => setOpen(false)} severity="error" variant="filled" sx={{ width: '100%' }}>
                                {label} — {spec}
                            </mui.Alert>
                        </mui.Snackbar>
                    )
                }
                return null
            }

            if (mode === 'none') return null
            if (mui?.Alert && mui?.Button && mui?.Stack) {
                return (
                    <mui.Stack direction="row" alignItems="center" spacing={1}>
                        <mui.Alert severity="error" variant="outlined" sx={{ flex: 1 }}>
                            {label} — {spec}
                        </mui.Alert>
                        {opts?._retry ? <mui.Button size="small" variant="outlined" color="inherit" onClick={opts._retry}>
                                Reintentar
                            </mui.Button> : null}
                    </mui.Stack>
                )
            }

            return (
                <div style={{ padding: 8, border: '1px solid #f00', color: '#b00' }}>
                    {label} — {spec}
                    {opts?._retry ? <button style={{ marginLeft: 8 }} onClick={opts._retry}>Reintentar</button> : null}
                </div>
            )
        }

        const FallbackComp =
            typeof opts?.Fallback === 'function' && opts.Fallback
                ? () => React.createElement(opts.Fallback!, { error, retry: opts?._retry, spec })
                : InlineDefault

        return { default: FallbackComp }
    }
}

export async function loadModule(scope: string, exposedModule: string) {
    const key = exposedModule.replace(/^(\.\/)+/, '')
    return loadRemote(`${scope}/${key}`)
}

export function lazyRemote(
    scope: string,
    exposedModule: string,
    opts?: LoadModuleOptions
): React.ComponentType<any> {
    return function RemoteWrapper(props: any) {
        const [attempt, setAttempt] = React.useState(0)

        const Lazy = React.useMemo(
            () =>
                React.lazy(async () =>
                    loadModuleSafe(scope, exposedModule, {
                        ...opts,
                        _retry: () => setAttempt((n) => n + 1),
                    })
                ),
            [scope, exposedModule, attempt]
        )

        const LoadingFallback = opts?.Loading ?? DefaultLoading

        return (
            <React.Suspense fallback={<LoadingFallback label={opts?.label} />}>
                <Lazy {...props} />
            </React.Suspense>
        )
    }
}
