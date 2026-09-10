import type { RefObject } from 'react'
import { useState } from 'react'
import { transcribe, type JobStatus, type LimitsResponseDto } from '../api/scribereel'
import UploadZone from './UploadZone'

type TranscribePanelProps = {
  selectedFile: File | null
  onFileChange: (file: File | null) => void
  inputRef: RefObject<HTMLInputElement | null>
  limits: LimitsResponseDto | null
}

function TranscribePanel({ selectedFile, onFileChange, inputRef, limits }: TranscribePanelProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [transcriptText, setTranscriptText] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!selectedFile) return
    setIsSubmitting(true)
    setJobStatus('PENDING')
    setError(null)
    setTranscriptText(null)
    try {
      setTranscriptText(await transcribe(selectedFile, setJobStatus))
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to transcribe file')
    } finally {
      setIsSubmitting(false)
    }
  }

  return <section className="panel active">
    <p className="panel-intro">Get a plain-text transcript from a video or audio file — for show notes, subtitles you'll edit yourself, or quick reference.</p>
    <UploadZone kind="transcript" file={selectedFile} onFile={onFileChange} inputRef={inputRef} maxFileSizeMb={limits?.maxFileSizeMb ?? null} featureLimits={limits?.transcribe ?? null} />
    <button className="submit-button" type="button" disabled={!selectedFile || isSubmitting} onClick={handleSubmit}>{isSubmitting ? jobStatus === 'PROCESSING' ? 'Transcribing...' : 'Queueing transcription...' : 'Transcribe file'}</button>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="panel-label">Output preview</div>
    <textarea
      className="transcript-preview"
      aria-label="Transcript result"
      value={transcriptText ?? ''}
      placeholder="Drop a clip and get the words back as plain text"
      onChange={(event) => setTranscriptText(event.target.value)}
    />
  </section>
}

export default TranscribePanel
