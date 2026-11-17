from pathlib import Path
import json,subprocess,concurrent.futures,hashlib
root=Path(__file__).resolve().parents[1];source=root/'local-media';dest=root/'dist/media';dest.mkdir(exist_ok=True)
previous_path=root/'dist/local-media.json'
previous=json.loads(previous_path.read_text()) if previous_path.exists() else {}
def prepare(p):
 out=dest/p.name
 cached=previous.get(p.stem)
 if cached and out.exists() and hashlib.sha256(out.read_bytes()).hexdigest()==cached['sha256'] and (dest/(p.stem+'.jpg')).exists():return p.stem,cached
 if not out.exists():subprocess.run(['ffmpeg','-nostdin','-v','error','-i',str(p),'-c:v','libx264','-preset','veryfast','-crf','22','-pix_fmt','yuv420p','-threads','2','-c:a','copy','-movflags','+faststart','-y',str(out)],check=True)
 # Full decode verifies the file, including audio.
 subprocess.run(['ffmpeg','-nostdin','-v','error','-threads','2','-i',str(out),'-f','null','-'],check=True)
 info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_name,codec_type,width,height','-of','json',str(out)]))
 import shutil
 shutil.copy2(p.with_suffix('.jpg'),dest/(p.stem+'.jpg'))
 print(p.stem,'verified',flush=True)
 return p.stem,{'src':'media/'+out.name,'poster':'media/'+p.stem+'.jpg','bytes':out.stat().st_size,'sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'probe':info}
selected={s['id'] for s in json.loads((root/'dist/songs.json').read_text())}
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:manifest=dict(pool.map(prepare,sorted(p for p in source.glob('*.mp4') if p.stem in selected)))
(root/'dist/local-media.json').write_text(json.dumps(manifest,indent=2))
(source/'verification.json').write_text(json.dumps(manifest,indent=2))
print('Total bytes',sum(m['bytes'] for m in manifest.values()),flush=True)
