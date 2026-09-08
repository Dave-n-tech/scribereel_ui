import { useEffect, useRef, useState, type RefObject } from 'react'
import { AlignLeft, Music2, Upload } from 'lucide-react'
import './App.css'

type Mode = 'caption' | 'convert' | 'transcribe'
type StyleName = 'punch' | 'classic' | 'neon' | 'bold' | 'minimal'

const styles: Array<{ name: StyleName; label: string; meta: string; sample: string }> = [
  { name: 'punch', label: 'Punch', meta: '1 word · bold', sample: 'watch' },
  { name: 'classic', label: 'Classic', meta: '3 words · outline', sample: 'this is how it looks' },
  { name: 'neon', label: 'Neon', meta: '1 word · glow', sample: 'GLOW' },
  { name: 'bold', label: 'Bold Yellow', meta: '1 word · pop', sample: 'HYPE' },
  { name: 'minimal', label: 'Minimal', meta: '3 words · subtle', sample: 'quiet and clean text' },
]

const animatedWords: Record<string, string[]> = {
  punch: ['watch', 'this', 'now'],
  neon: ['GLOW', 'VIBE', 'FLOW'],
  bold: ['HYPE', 'GO', 'WOW'],
}

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

        {mode === 'caption' && <section className="panel active caption-panel">
          <p className="panel-intro">Drop a vertical clip and get it back with captions burned in, timed word by word.</p>
          <div className="caption-layout">
            <div className="style-section">
              <div className="panel-label">Choose a style</div>
              <div className="style-grid">
                {styles.map((style) => <button className={`style-card ${selectedStyle === style.name ? 'selected' : ''}`} key={style.name} onClick={() => setSelectedStyle(style.name)} type="button">
                  <div className={`style-frame look-${style.name}`}><AnimatedSample style={style.name} fallback={style.sample} /></div>
                  <span className="style-name">{style.label}</span><span className="style-meta">{style.meta}</span>
                </button>)}
              </div>
            </div>
            <div className="upload-section">
              <UploadZone kind="video" fileName={selectedFile} onFile={setSelectedFile} inputRef={inputRef} />
            </div>
          </div>
        </section>}

        {mode === 'convert' && <section className="panel active">
          <p className="panel-intro">Strip the audio out of any clip and get back a clean MP3 — no captions, no re-encoding of the video.</p>
          <UploadZone kind="audio" fileName={selectedFile} onFile={setSelectedFile} inputRef={inputRef} />
        </section>}

        {mode === 'transcribe' && <section className="panel active">
          <p className="panel-intro">Get a plain-text transcript from a video or audio file — for show notes, subtitles you'll edit yourself, or quick reference.</p>
          <UploadZone kind="transcript" fileName={selectedFile} onFile={setSelectedFile} inputRef={inputRef} />
          <div className="panel-label">Output preview</div>
          <div className="transcript-preview">Wait for it — this is ScribeReel. Drop a clip and get the words back as plain text<span className="cursor" /></div>
        </section>}
        <p className="footer-note">Files are processed and deleted automatically. Nothing is stored.</p>
      </div>
    </main>
  )
}

function AnimatedSample({ style, fallback }: { style: StyleName; fallback: string }) {
  const [index, setIndex] = useState(0)
  const words = animatedWords[style]
  useEffect(() => {
    if (!words) return
    const interval = window.setInterval(() => setIndex((current) => (current + 1) % words.length), 900)
    return () => window.clearInterval(interval)
  }, [words])
  return <span className={`style-caption-word ${style === 'punch' && index === 1 ? 'hot' : ''}`}>{words?.[index] ?? fallback}</span>
}

function UploadZone({ kind, fileName, onFile, inputRef }: { kind: 'video' | 'audio' | 'transcript'; fileName: string | null; onFile: (name: string | null) => void; inputRef: RefObject<HTMLInputElement | null> }) {
  const isTranscript = kind === 'transcript'
  const icon = isTranscript ? <AlignLeft size={18} /> : kind === 'audio' ? <Music2 size={18} /> : <Upload size={18} />
  const title = fileName ?? (isTranscript ? 'Drop a file, or click to browse' : 'Drop a video, or click to browse')
  const subtitle = isTranscript ? 'MP4, MOV, MP3, WAV, M4A, or AAC' : 'MP4 or MOV, up to 60 seconds'
  const output = isTranscript ? 'OUTPUT: TEXT' : kind === 'audio' ? 'OUTPUT: MP3' : '9:16 RECOMMENDED'
  const chooseFile = (file?: File) => { if (file) onFile(file.name) }
  return <>
    <div className="panel-label">{isTranscript ? 'Upload a video or audio file' : 'Upload a video'}</div>
    <button className="dropzone" type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); chooseFile(event.dataTransfer.files[0]) }}>
      <span className="dropzone-icon">{icon}</span><span className="dropzone-title">{title}</span><span className="dropzone-sub">{fileName ? 'Ready to process' : subtitle}</span>
      <span className="dropzone-meta"><span>MAX 100MB</span><span>·</span><span>{output}</span></span>
    </button>
    <input ref={inputRef} className="file-input" type="file" accept={isTranscript ? 'video/*,audio/*' : 'video/mp4,video/quicktime'} onChange={(event) => chooseFile(event.target.files?.[0])} />
  </>
}

export default App
