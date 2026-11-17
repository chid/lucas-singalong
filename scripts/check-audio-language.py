"""Optional local sampling check: uv run --python 3.12 --with faster-whisper python scripts/check-audio-language.py
Downloads the public tiny Whisper model on first use. This is a rough language check,
not a reliable transcription or a Mandarin/Cantonese dialect classifier. Publisher
language declarations remain important. Reports stay in ignored local-media/.
"""
from pathlib import Path
import subprocess,json,numpy as np
from faster_whisper import WhisperModel
root=Path(__file__).resolve().parents[1];model=WhisperModel('tiny',device='cpu',compute_type='int8',cpu_threads=3)
report=root/'local-media/language-audio-check.json'
results=json.loads(report.read_text()) if report.exists() else []
checked={r['id'] for r in results}
selected={s['id'] for s in json.loads((root/'dist/songs.json').read_text())}
for p in sorted((root/'local-media').glob('*.mp4')):
 if p.stem in checked or p.stem not in selected:continue
 if not p.stem.startswith(('cmn-','yue-','fr-')):continue
 audio=np.frombuffer(subprocess.check_output(['ffmpeg','-nostdin','-v','error','-ss','8','-i',str(p),'-t','38','-ar','16000','-ac','1','-f','f32le','-']),dtype=np.float32)
 segments,info=model.transcribe(audio,beam_size=2);text=' '.join(s.text for s in segments);result={'id':p.stem,'detected':info.language,'probability':info.language_probability,'sample_transcript':text};results.append(result);(root/'local-media/language-audio-check.json').write_text(json.dumps(results,ensure_ascii=False,indent=2));print(p.stem,info.language,round(info.language_probability,2),text[:140],flush=True)
