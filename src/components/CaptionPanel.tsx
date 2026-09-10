import type { RefObject } from 'react'
import { useState } from 'react'
import { createCaption, type JobStatus, type LimitsResponseDto } from '../api/scribereel'
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
  selectedFile: File | null
  onFileChange: (file: File | null) => void
  inputRef: RefObject<HTMLInputElement | null>
  limits: LimitsResponseDto | null
}

function CaptionPanel({ selectedStyle, onStyleChange, selectedFile, onFileChange, inputRef, limits }: CaptionPanelProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!selectedFile) return
    setIsSubmitting(true)
    setJobStatus('PENDING')
    setError(null)
    setDownloadUrl(null)
    try {
      setDownloadUrl(await createCaption(selectedFile, selectedStyle, setJobStatus))
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to create captions')
    } finally {
      setIsSubmitting(false)
    }
  }

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
        <UploadZone kind="video" file={selectedFile} onFile={onFileChange} inputRef={inputRef} maxFileSizeMb={limits?.maxFileSizeMb ?? null} featureLimits={limits?.caption ?? null} />
        <button className="submit-button" type="button" disabled={!selectedFile || isSubmitting} onClick={handleSubmit}>{isSubmitting ? jobStatus === 'PROCESSING' ? 'Processing captions...' : 'Queueing captions...' : 'Create captions'}</button>
        {error && <p className="form-error" role="alert">{error}</p>}
        {downloadUrl && <a className="result-link caption-result-link" href={downloadUrl} download>Download captioned video</a>}
      </div>
    </div>
  </section>
}

export default CaptionPanel
