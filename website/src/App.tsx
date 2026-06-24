import { useEffect, useMemo, useState } from 'react'
import { Github, Copy, Check, Loader2 } from 'lucide-react'

type Theme = {
  name: string
  accent: string
  accent_dark: string
  accent_text: string
  secondary: string
  subtle_text: string
  muted_text: string
  dim_text: string
  danger: string
  warning: string
  tip: string
  link: string
  directory: string
  contrast: string
}

type GitHubContent = {
  name: string
  type: string
  download_url: string
}

function normalizeColor(value: string): string {
  const v = value.trim().toLowerCase()
  if (v.startsWith('#')) return v
  const num = Number(v)
  if (!Number.isNaN(num) && num >= 0 && num <= 255) {
    if (num < 16) return '#000000'
    if (num < 232) {
      const i = num - 16
      const r = Math.floor(i / 36) * 51
      const g = Math.floor((i % 36) / 6) * 51
      const b = (i % 6) * 51
      return `#${[r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')}`
    }
    const gray = (num - 232) * 10 + 8
    return `#${gray.toString(16).padStart(2, '0')}${gray.toString(16).padStart(2, '0')}${gray.toString(16).padStart(2, '0')}`
  }
  return v
}

function previewStyle(t: Theme) {
  return {
    '--accent': normalizeColor(t.accent),
    '--accent-dark': normalizeColor(t.accent_dark),
    '--accent-text': normalizeColor(t.accent_text),
    '--secondary': normalizeColor(t.secondary),
    '--subtle-text': normalizeColor(t.subtle_text),
    '--muted-text': normalizeColor(t.muted_text),
    '--dim-text': normalizeColor(t.dim_text),
    '--danger': normalizeColor(t.danger),
    '--warning': normalizeColor(t.warning),
    '--tip': normalizeColor(t.tip),
    '--link': normalizeColor(t.link),
    '--directory': normalizeColor(t.directory),
    '--contrast': normalizeColor(t.contrast),
  } as React.CSSProperties
}

function ThemePreview({ theme }: { theme: Theme }) {
  const s = previewStyle(theme)

  return (
    <div
      className="w-full rounded border-2 p-4 font-mono text-sm leading-relaxed"
      style={{ ...s, borderColor: 'var(--accent-dark)', backgroundColor: 'rgba(0,0,0,0.3)' }}
    >
      <div
        className="mb-4 inline-block px-2 py-1 font-bold"
        style={{ backgroundColor: 'var(--accent-dark)', color: 'var(--accent-text)' }}
      >
        Preview: {theme.name}
      </div>

      <div className="mb-4">
        <span className="font-bold" style={{ color: 'var(--accent)' }}>Inbox</span>
        <span style={{ color: 'var(--secondary)' }}>  Sent  Drafts</span>
        <div style={{ color: 'var(--secondary)' }}>────────────────────────────────────────</div>
      </div>

      <div className="space-y-1">
        <div>
          <span className="font-bold" style={{ color: 'var(--accent)' }}>&gt; </span>
          <span style={{ color: 'var(--dim-text)' }}>Alice  </span>
          <span style={{ color: 'var(--accent)' }}>Meeting tomorrow</span>
          <span style={{ color: 'var(--muted-text)' }}>  2m ago</span>
        </div>
        <div>
          <span style={{ color: 'var(--dim-text)' }}>  Bob    Re: Project update  1h ago</span>
        </div>
        <div>
          <span style={{ color: 'var(--dim-text)' }}>  Carol  Quick question    3h ago</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="font-bold" style={{ color: 'var(--accent)' }}>Folders</div>
        <div className="mt-1">
          <span
            className="px-1 font-bold"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--contrast)' }}
          >
            INBOX
          </span>
          <span style={{ color: 'var(--secondary)' }}>  Sent  Trash</span>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <div>
          <span className="font-bold" style={{ color: 'var(--accent)' }}>Success: </span>
          <span style={{ color: 'var(--accent)' }}>Email sent!</span>
        </div>
        <div>
          <span style={{ color: 'var(--danger)' }}>Error: Connection failed</span>
        </div>
        <div style={{ color: 'var(--warning)' }}>Update available: v2.0</div>
        <div style={{ color: 'var(--tip)', fontStyle: 'italic' }}>Tip: Press ? for help</div>
        <div style={{ color: 'var(--link)' }}>https://example.com</div>
      </div>
    </div>
  )
}

function ThemeCard({ theme, onSelect }: { theme: Theme; onSelect: (t: Theme) => void }) {
  const [copied, setCopied] = useState(false)
  const style = previewStyle(theme)
  const slug = theme.name.toLowerCase().replace(/\s+/g, '-')
  const installCommand = `matcha install theme ${slug}`

  const copy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(theme, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div
      onClick={() => onSelect(theme)}
      className="group cursor-pointer rounded-lg border border-slate-700 bg-slate-800/50 p-4 transition hover:border-slate-500 hover:bg-slate-800"
      style={style}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-slate-100">{theme.name}</h3>
        <button
          onClick={(e) => { e.stopPropagation(); copy() }}
          className="rounded p-1.5 text-slate-400 opacity-0 transition hover:text-slate-100 group-hover:opacity-100"
          title="Copy theme JSON"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <ThemePreview theme={theme} />
      <div
        className="mt-3 flex items-center gap-2 rounded border border-slate-600 bg-slate-900/50 px-2 py-1.5 font-mono text-xs text-slate-300"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="truncate">{installCommand}</span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            navigator.clipboard.writeText(installCommand)
          }}
          className="ml-auto rounded p-1 text-slate-400 hover:text-slate-100"
          title="Copy install command"
        >
          <Copy size={12} />
        </button>
      </div>
    </div>
  )
}

function Palette({ theme }: { theme: Theme }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {Object.entries(theme).filter(([k]) => k !== 'name').map(([key, value]) => (
        <div key={key} className="flex items-center gap-2 rounded-md bg-slate-800 p-2">
          <span className="h-6 w-6 rounded border border-slate-600" style={{ backgroundColor: normalizeColor(value) }} />
          <div className="min-w-0">
            <div className="text-xs text-slate-400 capitalize">{key.replace(/_/g, ' ')}</div>
            <div className="truncate font-mono text-xs text-slate-200">{value}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

async function fetchThemes(): Promise<Theme[]> {
  const res = await fetch('https://api.github.com/repos/floatpane/matcha-themes/contents/themes?ref=master')
  if (!res.ok) throw new Error(`Failed to list themes: ${res.status}`)
  const items: GitHubContent[] = await res.json()
  const themeFiles = items.filter(item => item.type === 'file' && item.name.endsWith('.json'))
  const themes = await Promise.all(
    themeFiles.map(async file => {
      const fileRes = await fetch(file.download_url)
      if (!fileRes.ok) throw new Error(`Failed to fetch ${file.name}`)
      return fileRes.json() as Promise<Theme>
    })
  )
  return themes
}

export default function App() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Theme | null>(null)
  const [search, setSearch] = useState('')
  const filtered = useMemo(() => themes.filter(t => t.name.toLowerCase().includes(search.toLowerCase())), [themes, search])

  useEffect(() => {
    fetchThemes()
      .then(data => { setThemes(data) })
      .catch(err => { setError(err.message ?? 'Failed to load themes') })
      .finally(() => { setLoading(false) })
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Matcha logo" className="h-8 w-8" />
            <span className="font-semibold text-slate-100">Matcha Themes</span>
          </div>
          <a
            href="https://github.com/floatpane/matcha-themes"
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-slate-100"
          >
            <Github size={18} />
            GitHub
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="mb-12 text-center">
          <h1 className="mb-3 text-3xl font-bold text-slate-100">
            Community themes for Matcha
          </h1>
          <p className="mx-auto max-w-xl text-slate-400">
            Browse and install themes with the Matcha CLI. Run <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-sm text-slate-200">matcha install theme {'<'}name{'>'}</code> to install any theme below.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <a href="https://github.com/floatpane/matcha-themes#submitting-a-theme" className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-white">
              Submit a theme
            </a>
            <a href="#themes" className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-slate-100">
              Browse themes
            </a>
          </div>
        </section>

        <section id="themes">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-slate-100">Available themes</h2>
            <input
              type="text"
              placeholder="Search themes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-slate-500 sm:w-64"
            />
          </div>

          {(() => {
            if (loading) return (
              <div className="flex flex-col items-center justify-center rounded-lg border border-slate-700 p-12 text-slate-400">
                <Loader2 className="mb-3 h-6 w-6 animate-spin" />
                Loading themes...
              </div>
            )
            if (error) return (
              <div className="rounded-lg border border-red-900/50 bg-red-950/30 p-8 text-center text-red-200">
                {error}
              </div>
            )
            if (filtered.length === 0) return (
              <div className="rounded-lg border border-slate-700 p-8 text-center text-slate-400">
                No themes match "{search}".
              </div>
            )
            return (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map(t => (
                  <ThemeCard key={t.name} theme={t} onSelect={setSelected} />
                ))}
              </div>
            )
          })()}
        </section>
      </main>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setSelected(null)}>
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-100">{selected.name}</h3>
              <button onClick={() => setSelected(null)} className="rounded p-2 text-slate-400 hover:text-slate-100">✕</button>
            </div>
            <ThemePreview theme={selected} />
            <Palette theme={selected} />
            <div
              className="mt-6 rounded border border-slate-600 bg-slate-900/50 px-3 py-2 font-mono text-sm text-slate-300"
            >
              <div className="mb-1 text-xs text-slate-400">Install with Matcha CLI</div>
              <div className="flex items-center justify-between gap-2">
                <span className="truncate">{`matcha install theme ${selected.name.toLowerCase().replace(/\s+/g, '-')}`}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(`matcha install theme ${selected.name.toLowerCase().replace(/\s+/g, '-')}`)}
                  className="rounded p-1 text-slate-400 hover:text-slate-100"
                  title="Copy install command"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        Made by the Matcha community. Licensed under MIT.
      </footer>
    </div>
  )
}
