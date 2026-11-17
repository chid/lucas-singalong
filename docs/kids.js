const $ = s => document.querySelector(s);
const languageNames = {en:'English', cmn:'普通话', yue:'廣東話', fr:'Français'};
const ui = {
 en:{heading:'What shall we sing?',grownups:'Grown-ups',little:'🚒 Little singers',explorers:'🚀 Growing explorers',note:'Familiar favourites and first adventures',older:'New stories, big ideas and songs to grow into',all:'🌈 All songs',favourites:'⭐ Favourites',back:'← Songs',again:'↺ Again',next:'Next song →',full:'⛶ Big screen',play:'▶ Play',pause:'Ⅱ Pause',start:'Tap ▶ to start.',ended:'Sing it again, or choose another song.',empty:'Tap the star on a song to save it here.',error:'This song could not load. Try Again or choose another song.',save:'Save favourite',remove:'Remove favourite',loading:'Getting your songs…',loadError:'The songs could not load. Please reload.'},
 cmn:{heading:'唱哪首歌？',grownups:'大人专区',little:'🚒 唱唱跳跳',explorers:'🚀 探索新世界',note:'熟悉的旋律，新的词语',older:'更多故事，更多新发现',all:'🌈 全部歌曲',favourites:'⭐ 最爱',back:'← 选歌',again:'↺ 再来一次',next:'下一首 →',full:'⛶ 全屏',play:'▶ 播放',pause:'Ⅱ 暂停',start:'点 ▶ 开始。',ended:'再唱一次，或者选另一首。',empty:'点歌曲上的星星，就能收藏到这里。',error:'歌曲暂时无法播放，请重试或选另一首。',save:'收藏歌曲',remove:'取消收藏',loading:'正在准备歌曲……',loadError:'歌曲未能载入，请刷新。'},
 yue:{heading:'唱邊首歌？',grownups:'大人專區',little:'🚒 一齊唱',explorers:'🚀 探索新世界',note:'熟悉嘅旋律，新嘅詞語',older:'更多故事，更多新發現',all:'🌈 全部歌曲',favourites:'⭐ 至愛',back:'← 返去揀歌',again:'↺ 再唱一次',next:'下一首 →',full:'⛶ 全螢幕',play:'▶ 播放',pause:'Ⅱ 暫停',start:'撳 ▶ 開始。',ended:'再唱一次，或者揀另一首。',empty:'撳歌曲上嘅星星，就可以收藏喺呢度。',error:'暫時播唔到，請再試或者揀另一首。',save:'收藏歌曲',remove:'取消收藏',loading:'準備緊歌曲……',loadError:'載入唔到歌曲，請重新整理。'},
 fr:{heading:'On chante quoi ?',grownups:'Pour les grands',little:'🚒 Petits chanteurs',explorers:'🚀 Explorateurs',note:'Des airs familiers et de nouveaux mots',older:'Des histoires et un monde à découvrir',all:'🌈 Toutes les chansons',favourites:'⭐ Favoris',back:'← Chansons',again:'↺ Encore',next:'Suivante →',full:'⛶ Plein écran',play:'▶ Lire',pause:'Ⅱ Pause',start:'Appuie sur ▶ pour commencer.',ended:'Encore une fois, ou une autre chanson ?',empty:'Appuie sur l’étoile d’une chanson pour la retrouver ici.',error:'La chanson ne se charge pas. Réessaie ou choisis une autre chanson.',save:'Ajouter aux favoris',remove:'Retirer des favoris',loading:'Les chansons arrivent…',loadError:'Les chansons ne se chargent pas. Actualise la page.'}
};
const topics = {
 en:{'Vehicles':'🚒 Trucks','Animals & nature':'🐙 Animals','Move & explore':'👐 Move','Everyday words':'🙂 My day','Rhythm & rhyme':'🎵 Rhymes','Stories & adventure':'🛶 Adventures','Words & numbers':'🔤 Words & numbers','Science & world':'🌍 Discover','Music & singing':'🎶 Music'},
 cmn:{'Vehicles':'🚒 交通工具','Animals & nature':'🐙 动物','Move & explore':'👐 动起来','Everyday words':'🙂 每一天','Rhythm & rhyme':'🎵 童谣','Stories & adventure':'🛶 故事','Words & numbers':'🔢 词语和数字','Science & world':'🌍 世界','Music & singing':'🎶 音乐'},
 yue:{'Vehicles':'🚒 交通工具','Animals & nature':'🐙 動物','Move & explore':'👐 郁一郁','Everyday words':'🙂 每一日','Rhythm & rhyme':'🎵 童謠','Stories & adventure':'🛶 故事','Words & numbers':'🔢 詞語同數字','Science & world':'🌍 世界','Music & singing':'🎶 音樂'},
 fr:{'Vehicles':'🚒 Véhicules','Animals & nature':'🐙 Animaux','Move & explore':'👐 Bouger','Everyday words':'🙂 Ma journée','Rhythm & rhyme':'🎵 Rimes','Stories & adventure':'🛶 Histoires','Words & numbers':'🔤 Mots et nombres','Science & world':'🌍 Découvrir','Music & singing':'🎶 Musique'}
};
function route(){let hash=location.hash.slice(1);let parts=hash.split('-');return {language:languageNames[parts[0]]?parts[0]:'en',collection:hash==='explorers'||parts[1]==='explorers'?'explorers':'little'}}
let {language,collection}=route();
let songs=[], media={}, filter='all', current=null, favs=[];
try {favs=JSON.parse(localStorage.getItem('lucas-song-favourites')||'[]');if(!Array.isArray(favs))favs=[]} catch {}
const t=()=>ui[language];
const group=()=>songs.filter(s=>(s.language||'en')===language&&(s.collection||'little')===collection);
const selection=()=>group().filter(s=>filter==='all'||s.category===filter||(filter==='favourites'&&favs.includes(s.id)));
function save(){try{localStorage.setItem('lucas-song-favourites',JSON.stringify(favs))}catch{}}
function updateRoute(){let hash=language==='en'?(collection==='explorers'?'explorers':''):(language+(collection==='explorers'?'-explorers':''));history.replaceState(null,'',location.pathname+location.search+(hash?'#'+hash:''))}
function localise(){
 document.documentElement.lang={en:'en',cmn:'zh-Hans',yue:'yue-Hant',fr:'fr'}[language];
 $('#shelf h1').textContent=t().heading;
 $('.grownups').textContent=t().grownups;
 $('.grownups').href='grownups.html?language='+language;
 $('#back').textContent=t().back;$('#again').textContent=t().again;$('#next').textContent=t().next;$('#fullscreen').textContent=t().full;
 document.querySelectorAll('[data-language]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.language===language)));
 document.querySelectorAll('[data-collection]').forEach(b=>{b.textContent=t()[b.dataset.collection];b.setAttribute('aria-pressed',String(b.dataset.collection===collection))});
 $('#collection-note').textContent=collection==='little'?t().note:t().older;
}
function render(){
 localise();
 const options=[['all',t().all],...Array.from(new Set(group().map(s=>s.category))).map(c=>[c,topics[language][c]||c]),['favourites',t().favourites]];
 $('#topics').replaceChildren(...options.map(([id,label])=>{let b=document.createElement('button');b.dataset.filter=id;b.textContent=label;b.setAttribute('aria-pressed',String(filter===id));return b}));
 const list=selection();
 $('#tiles').replaceChildren(...list.map(s=>{
  const b=document.createElement('button');b.className='tile';b.setAttribute('aria-label',t().play.replace('▶ ','')+' '+s.title);
  const picture=document.createElement('span');picture.className='picture';
  if(media[s.id]?.poster){let img=document.createElement('img');img.src=media[s.id].poster;img.alt='';img.loading='lazy';picture.append(img)}
  else {let e=document.createElement('span');e.className='emoji';e.textContent=s.emoji;picture.append(e)}
  const play=document.createElement('span');play.className='play';play.textContent='▶';picture.append(play);
  const label=document.createElement('span');label.className='label';
  const emoji=document.createElement('span');emoji.className='tiny';emoji.textContent=s.emoji;
  const name=document.createElement('span');name.textContent=s.childTitle;label.append(emoji,name);
  if(favs.includes(s.id)){const star=document.createElement('span');star.className='saved';star.textContent='★';label.append(star)}
  b.append(picture,label);b.onclick=()=>openSong(s);return b;
 }));
 $('#status').textContent=list.length?'':t().empty;
}
function stop(){$('#screen').querySelector('video')?.pause();$('#screen').replaceChildren()}
function setStar(){let active=favs.includes(current.id);$('#star').textContent=active?'★':'☆';$('#star').setAttribute('aria-pressed',String(active));$('#star').setAttribute('aria-label',active?t().remove:t().save)}
function online(s){const f=document.createElement('iframe');f.src=`https://www.youtube-nocookie.com/embed/${s.videoId}?autoplay=1&rel=0&playsinline=1`;f.title=s.title;f.allow='autoplay; encrypted-media; fullscreen; picture-in-picture';f.allowFullscreen=true;$('#screen').append(f)}
function openSong(s){
 stop();current=s;$('#shelf').hidden=true;$('#player').hidden=false;$('#playing-title').textContent=s.emoji+' '+s.childTitle;setStar();$('#player-status').textContent='';$('#toggle').hidden=!media[s.id]?.src;$('#toggle').textContent=t().play;
 if(media[s.id]?.src){
  const v=document.createElement('video');v.src=media[s.id].src;v.controls=true;v.playsInline=true;v.preload='metadata';if(media[s.id].poster)v.poster=media[s.id].poster;v.setAttribute('aria-label',s.title);
  v.onplay=()=>{$('#toggle').textContent=t().pause};v.onpause=()=>{$('#toggle').textContent=t().play};v.onended=()=>{$('#player-status').textContent=t().ended};v.onerror=()=>{$('#player-status').textContent=t().error};
  $('#screen').append(v);v.play().catch(()=>{$('#player-status').textContent=t().start});
 }else online(s);
 $('#playing-title').focus();window.scrollTo(0,0);
}
$('#topics').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(b){filter=b.dataset.filter;render()}});
function shelf(){stop();$('#player').hidden=true;$('#shelf').hidden=false;filter='all';render()}
document.querySelectorAll('[data-language]').forEach(b=>b.onclick=()=>{language=b.dataset.language;updateRoute();shelf()});
document.querySelectorAll('[data-collection]').forEach(b=>b.onclick=()=>{collection=b.dataset.collection;updateRoute();shelf()});
window.addEventListener('hashchange',()=>{({language,collection}=route());shelf()});
$('#back').onclick=async()=>{if(document.fullscreenElement)await document.exitFullscreen().catch(()=>{});stop();$('#player').hidden=true;$('#shelf').hidden=false;render();$('#tiles button')?.focus()};
$('#star').onclick=()=>{if(!current)return;favs=favs.includes(current.id)?favs.filter(id=>id!==current.id):[...favs,current.id];save();setStar()};
$('#toggle').onclick=()=>{let v=$('#screen video');if(!v)return;if(v.paused)v.play().catch(()=>{$('#player-status').textContent=t().start});else v.pause()};
$('#again').onclick=()=>{if(current)openSong(current)};
$('#next').onclick=()=>{let list=selection();if(!list.length)list=group();let i=list.findIndex(s=>s.id===current?.id);if(list.length)openSong(list[(i+1)%list.length])};
$('#fullscreen').onclick=()=>{const el=$('#screen'),v=el.querySelector('video');if(el.requestFullscreen)el.requestFullscreen().catch(()=>{$('#player-status').textContent=t().full});else if(v?.webkitEnterFullscreen)v.webkitEnterFullscreen()};
localise();$('#status').textContent=t().loading;
Promise.all([fetch('songs.json').then(r=>{if(!r.ok)throw Error('songs');return r.json()}),fetch('local-media.json',{cache:'no-store'}).then(r=>r.ok?r.json():{}).catch(()=>({}))]).then(([s,m])=>{songs=s;media=m;render()}).catch(()=>{$('#status').textContent=t().loadError});
