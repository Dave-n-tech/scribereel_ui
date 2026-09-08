import type { RefObject } from 'react'
import AnimatedSample, { type StyleName } from './AnimatedSample'
import UploadZone from './UploadZone'

const styles: Array<{ name: StyleName; label: string; meta: string; sample: string }> = [
  { name: 'punch', label: 'Punch', meta: '1 word · bold', sample: 'watch' },
  { name: 'classic', label: 'Classic', meta: '3 words · outline', sample: 'this is how it looks' },
  { name: 'neon', label: 'Neon', meta: '1 word · glow', sample: 'GLOW' },
  { name: 'bold', label: 'Bold Yellow', meta: '1 word · pop', sample: 'HYPE' },
  { name: 'minimal', label: 'Minimal', meta: '3 words · subtle', sample: 'quiet and clean text' },
]

type CaptionPanelProps = {
  selectedStyle: StyleName
  onStyleChange: (style: StyleName) => void
  selectedFile: string | null
  onFileChange: (name: string | null) => void
  inputRef: RefObject<HTMLInputElement | null>
}

function CaptionPanel({ selectedStyle, onStyleChange, selectedFile, onFileChange, inputRef }: CaptionPanelProps) {
  return <section className="panel active caption-panel">
    <p className="panel-intro">Drop a vertical clip and get it back with captions burned in, timed word by word.</p>
    <div className="caption-layout">
      <div className="style-section">
        <div className="panel-label">Choose a style</div>
        <div className="style-grid">
          {styles.map((style) => <button className={`style-card ${selectedStyle === style.name ? 'selected' : ''}`} key={style.name} onClick={() => onStyleChange(style.name)} type="button">
            <div className={`style-frame look-${style.name}`}><AnimatedSample style={style.name} fallback={style.sample} /></div>
            <span className="style-name">{style.label}</span><span className="style-meta">{style.meta}</span>
          </button>)}
        </div>
      </div>
      <div className="upload-section">
        <UploadZone kind="video" fileName={selectedFile} onFile={onFileChange} inputRef={inputRef} />
      </div>
    </div>
  </section>
}

export default CaptionPanel
