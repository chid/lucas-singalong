import json,re,urllib.request,concurrent.futures
from pathlib import Path
root=Path(__file__).resolve().parents[1]
songs=json.loads((root/'dist/songs.json').read_text())
def resolve(s):
 if 'youtube.com/watch' in s['url']:return s['id'],s['url'].split('v=')[1].split('&')[0]
 try:
  h=urllib.request.urlopen(s['url'],timeout=25).read().decode()
  ids=re.findall(r'(?:youtube(?:-nocookie)?\.com/embed/|youtu\.be/|youtube\.com/watch\?v=)([\w-]{11})',h)
  return s['id'],next(iter(dict.fromkeys(ids)),None)
 except Exception as e:return s['id'],str(e)
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
 result=dict(pool.map(resolve,songs))
(root/'local-media/video-ids.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result,indent=2))
