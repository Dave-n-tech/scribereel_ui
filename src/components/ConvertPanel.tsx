import type { RefObject } from 'react'
import UploadZone from './UploadZone'

type ConvertPanelProps = {
  selectedFile: string | null
  onFileChange: (name: string | null) => void
  inputRef: RefObject<HTMLInputElement | null>
}

function ConvertPanel({ selectedFile, onFileChange, inputRef }: ConvertPanelProps) {
  return <section className="panel active">
    <p className="panel-intro">Strip the audio out of any clip and get back a clean MP3 — no captions, no re-encoding of the video.</p>
    <UploadZone kind="audio" fileName={selectedFile} onFile={onFileChange} inputRef={inputRef} />
  </section>
}

export default ConvertPanel
