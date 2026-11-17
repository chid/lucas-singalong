"""Personal g2 copies only. Uses public official video URLs; no cookies or login."""
from pathlib import Path
import json, subprocess,concurrent.futures,datetime
root=Path(__file__).resolve().parents[1];out=root/'local-media';out.mkdir(exist_ok=True)
songs=json.loads((root/'dist/songs.json').read_text())
def download(s):
 id=s['id'];cmd=['uv','tool','run','--from','yt-dlp[default]','yt-dlp','--js-runtimes','node','--no-playlist','--retries','1','--fragment-retries','1','--socket-timeout','20','--max-filesize','200M','-f','bv*[height<=720][ext=mp4]+ba[ext=m4a]/b[height<=720][ext=mp4]','--merge-output-format','mp4','--write-info-json','--write-thumbnail','--convert-thumbnails','jpg','-o',str(out/(id+'.%(ext)s')),'https://www.youtube.com/watch?v='+s['videoId']]
 try:
  r=subprocess.run(cmd,capture_output=True,text=True,timeout=180);(out/(id+'.log')).write_text(r.stdout+r.stderr)
  ok=r.returncode==0 and (out/(id+'.mp4')).exists()
  return {'id':id,'status':'downloaded' if ok else 'unavailable','source':'https://www.youtube.com/watch?v='+s['videoId'],'checked':datetime.datetime.now(datetime.timezone.utc).isoformat(),'error':None if ok else r.stderr[-1200:]}
 except Exception as e:return {'id':id,'status':'unavailable','error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 results=[]
 for r in pool.map(download,songs):results.append(r);print(r['id'],r['status'],flush=True);(out/'download-report.json').write_text(json.dumps(results,indent=2))
