import type { RefObject } from 'react'
import UploadZone from './UploadZone'

type TranscribePanelProps = {
  selectedFile: string | null
  onFileChange: (name: string | null) => void
  inputRef: RefObject<HTMLInputElement | null>
}

function TranscribePanel({ selectedFile, onFileChange, inputRef }: TranscribePanelProps) {
  return <section className="panel active">
    <p className="panel-intro">Get a plain-text transcript from a video or audio file — for show notes, subtitles you'll edit yourself, or quick reference.</p>
    <UploadZone kind="transcript" fileName={selectedFile} onFile={onFileChange} inputRef={inputRef} />
    <div className="panel-label">Output preview</div>
    <div className="transcript-preview">Wait for it — this is ScribeReel. Drop a clip and get the words back as plain text<span className="cursor" /></div>
  </section>
}

export default TranscribePanel
