import { AlignLeft, Music2, Upload } from 'lucide-react'
import type { RefObject } from 'react'
import type { FeatureLimitsDto } from '../api/scribereel'

export type UploadKind = 'video' | 'audio' | 'transcript'

type UploadZoneProps = {
  kind: UploadKind
  file: File | null
  onFile: (file: File | null) => void
  inputRef: RefObject<HTMLInputElement | null>
  maxFileSizeMb: number | null
  featureLimits: FeatureLimitsDto | null
}

function UploadZone({ kind, file, onFile, inputRef, maxFileSizeMb, featureLimits }: UploadZoneProps) {
  const isTranscript = kind === 'transcript'
  const icon = isTranscript ? <AlignLeft size={18} /> : kind === 'audio' ? <Music2 size={18} /> : <Upload size={18} />
  const title = file?.name ?? (isTranscript ? 'Drop a file, or click to browse' : 'Drop a video, or click to browse')
  const subtitle = isTranscript ? 'MP4, MOV, MP3, WAV, M4A, or AAC' : 'MP4 or MOV, up to 60 seconds'
  const output = isTranscript ? 'OUTPUT: TEXT' : kind === 'audio' ? 'OUTPUT: MP3' : '9:16 RECOMMENDED'
  const durationMinutes = featureLimits ? featureLimits.maxDurationSeconds / 60 : null
  const durationLabel = durationMinutes === null
    ? null
    : `${Number.isInteger(durationMinutes) ? durationMinutes : durationMinutes.toFixed(1)} ${durationMinutes === 1 ? 'MINUTE' : 'MINUTES'}`
  const limitsText = maxFileSizeMb !== null && featureLimits !== null
    ? `MAX ${maxFileSizeMb}MB · UP TO ${durationLabel}`
    : 'LOADING FILE LIMITS...'
  const chooseFile = (nextFile?: File) => { if (nextFile) onFile(nextFile) }

  return <>
    <div className="panel-label">{isTranscript ? 'Upload a video or audio file' : 'Upload a video'}</div>
    <p className="upload-limits">{limitsText}</p>
    <button className="dropzone" type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); chooseFile(event.dataTransfer.files[0]) }}>
      <span className="dropzone-icon">{icon}</span><span className="dropzone-title">{title}</span><span className="dropzone-sub">{file ? 'Ready to process' : subtitle}</span>
      <span className="dropzone-meta"><span>MAX 100MB</span><span>·</span><span>{output}</span></span>
    </button>
    <input ref={inputRef} className="file-input" type="file" accept={isTranscript ? 'video/*,audio/*' : 'video/mp4,video/quicktime'} onChange={(event) => chooseFile(event.target.files?.[0])} />
  </>
}

export default UploadZone
