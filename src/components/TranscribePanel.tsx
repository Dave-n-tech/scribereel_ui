import type { RefObject } from 'react'
import { useState } from 'react'
import { transcribe } from '../api/scribereel'
import UploadZone from './UploadZone'

type TranscribePanelProps = {
  selectedFile: File | null
  onFileChange: (file: File | null) => void
  inputRef: RefObject<HTMLInputElement | null>
}

function TranscribePanel({ selectedFile, onFileChange, inputRef }: TranscribePanelProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [transcriptText, setTranscriptText] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!selectedFile) return
    setIsSubmitting(true)
    setError(null)
    setTranscriptText(null)
    try {
      setTranscriptText(await transcribe(selectedFile))
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to transcribe file')
    } finally {
      setIsSubmitting(false)
    }
  }

  return <section className="panel active">
    <p className="panel-intro">Get a plain-text transcript from a video or audio file — for show notes, subtitles you'll edit yourself, or quick reference.</p>
    <UploadZone kind="transcript" file={selectedFile} onFile={onFileChange} inputRef={inputRef} />
    <button className="submit-button" type="button" disabled={!selectedFile || isSubmitting} onClick={handleSubmit}>{isSubmitting ? 'Transcribing...' : 'Transcribe file'}</button>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="panel-label">Output preview</div>
    <div className="transcript-preview">{transcriptText ?? 'Wait for it — this is ScribeReel. Drop a clip and get the words back as plain text'}{!transcriptText && <span className="cursor" />}</div>
  </section>
}

export default TranscribePanel
