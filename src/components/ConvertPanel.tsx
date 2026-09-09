import type { RefObject } from 'react'
import { useState } from 'react'
import { convertToMp3, type JobStatus } from '../api/scribereel'
import UploadZone from './UploadZone'

type ConvertPanelProps = {
  selectedFile: File | null
  onFileChange: (file: File | null) => void
  inputRef: RefObject<HTMLInputElement | null>
}

function ConvertPanel({ selectedFile, onFileChange, inputRef }: ConvertPanelProps) {
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
      setDownloadUrl(await convertToMp3(selectedFile, setJobStatus))
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to convert video')
    } finally {
      setIsSubmitting(false)
    }
  }

  return <section className="panel active">
    <p className="panel-intro">Strip the audio out of any clip and get back a clean MP3 — no captions, no re-encoding of the video.</p>
    <UploadZone kind="audio" file={selectedFile} onFile={onFileChange} inputRef={inputRef} />
    <button className="submit-button" type="button" disabled={!selectedFile || isSubmitting} onClick={handleSubmit}>{isSubmitting ? jobStatus === 'PROCESSING' ? 'Converting...' : 'Queueing conversion...' : 'Convert to MP3'}</button>
    {error && <p className="form-error" role="alert">{error}</p>}
    {downloadUrl && <a className="result-link convert-result-link" href={downloadUrl} download>Download MP3</a>}
  </section>
}

export default ConvertPanel
