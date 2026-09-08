import { useRef, useState } from 'react'
import './App.css'
import CaptionPanel from './components/CaptionPanel'
import ConvertPanel from './components/ConvertPanel'
import TranscribePanel from './components/TranscribePanel'
import type { StyleName } from './components/AnimatedSample'

type Mode = 'caption' | 'convert' | 'transcribe'

function App() {
  const [mode, setMode] = useState<Mode>('caption')
  const [selectedStyle, setSelectedStyle] = useState<StyleName>('punch')
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <main className="app-shell">
      <div className="wrap">
        <header className="site-header"><span className="logo-mark" aria-hidden="true" /><span className="site-title">ScribeReel</span></header>
        <nav className="mode-switcher" aria-label="ScribeReel tools">
          {(['caption', 'convert', 'transcribe'] as Mode[]).map((item) => (
            <button className={`mode-btn ${mode === item ? 'active' : ''}`} key={item} onClick={() => { setMode(item); setSelectedFile(null) }} type="button">
              {item === 'caption' ? 'Caption' : item === 'convert' ? 'Convert to MP3' : 'Transcribe'}
            </button>
          ))}
        </nav>

        {mode === 'caption' && <CaptionPanel selectedStyle={selectedStyle} onStyleChange={setSelectedStyle} selectedFile={selectedFile} onFileChange={setSelectedFile} inputRef={inputRef} />}
        {mode === 'convert' && <ConvertPanel selectedFile={selectedFile} onFileChange={setSelectedFile} inputRef={inputRef} />}
        {mode === 'transcribe' && <TranscribePanel selectedFile={selectedFile} onFileChange={setSelectedFile} inputRef={inputRef} />}
        <p className="footer-note">Files are processed and deleted automatically. Nothing is stored.</p>
      </div>
    </main>
  )
}

export default App
