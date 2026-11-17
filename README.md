# Lucas’s Songs

Child-first song shelf: 53 large picture buttons across English, Mandarin, Cantonese and French. English retains Little singers (11) and Growing explorers (12); each additional language has five songs in each collection, simple topic filters, in-page playback, replay, full screen, next-song and favourites. Vocabulary and play ideas remain at `grownups.html`, with rough starting ranges of 2–4, 4–5 and 6–8 (Do-Re-Mi spans 4–8). These are editorial suggestions, not milestones or prerequisites. Open `/#explorers` to go straight to the older English collection. Use `/#cmn`, `/#yue`, or `/#fr` for Mandarin, Cantonese or French, and append `-explorers` for each older collection. Language buttons also translate the child controls. Native titles have English meanings in the grown-up view, with Pinyin for Mandarin and Jyutping for Cantonese. The grown-up view has language, age and topic filters. Next-song is manual; nothing auto-advances.

## Hosting

- Public: https://chid.github.io/lucas-singalong/ — `main:/docs`, online YouTube embeds.
- g2: https://agent.92485405.xyz/lucas-songs/ (existing protected vault).
- Home network: http://192.168.7.243:8889/lucas-songs/ (existing vault login).

`dist/` is the g2 deployment. `dist/local-media.json` maps the saved video files to their song IDs. Local H.264/AAC MP4s and JPEG posters live in `dist/media/`. These media files, source metadata and logs are excluded from Git. They stay on this Mac and the protected g2 server, not GitHub Pages.

Local playback needs home Wi-Fi and g2 running; internet is not needed. The tablet does not retain an offline copy. Favourites are browser-local and do not sync across hosts/devices. The Grown-ups link is a view switch, not a parental lock.

## Prepare and update

`python3 scripts/download-videos.py [song-id ...]` downloads the selected public official videos with the current yt-dlp and saves source metadata, logs and a report under `local-media/`. `python3 scripts/prepare-local-media.py` prepares H.264/AAC copies, decodes each new file fully, reuses prior verification only when the output hash matches, and records duration, codecs, size and SHA-256. Both require `uv`, `node`, `ffmpeg` and `ffprobe` already available on this Mac. No cookies or account login are used for downloads.

Sync `dist/` to `charley@192.168.7.243:/home/charley/vault/lucas-songs/`. Copy frontend assets to `docs/` without media or the local manifest; keep `docs/local-media.json` equal to `{}`. Commit and push for Pages. Do not upload the videos to GitHub.

`node scripts/qa.cjs` checks the child interactions in both public/embed and g2/local modes, using the pre-existing jsdom installation at `/tmp/growing-sydney-qa/node_modules/jsdom`. That temporary test dependency may need to be restored on another machine. Browser preview was unavailable during the update; DOM checks do not verify physical playback or sound output.

Videos retain their original creators’ copyright; source links and credit appear in the grown-up view. Sources checked 18 November 2026.

## Language curation and checks

Selections use primary artist/publisher uploads. Cantonese selection relies on explicit 粵語 / 廣東話 language declarations, not Traditional Chinese lettering; Mandarin uses Mandarin-learning publishers and Mandarin editions. Different Chinese scripts do not establish the spoken language. `languageEvidence` records the basis for each new selection. Vocabulary prompts include related play words and are not lyric transcripts. Cantonese printed song titles can use a literary register while conversation uses everyday Cantonese; related notes make this explicit where relevant.

`uv run --python 3.12 --with faster-whisper python scripts/check-audio-language.py` optionally runs a rough 38-second local sample check with the public tiny Whisper model (downloaded on first run). It is not a reliable lyric transcript or a Mandarin/Cantonese classifier; source declarations are used alongside samples. Results stay in ignored `local-media/language-audio-check.json`. No recordings are uploaded to a transcription service.

The Cantonese seasons item is explicitly a four-song collection lasting about nine minutes. The older sets combine richer stories, cultural topics, choir/pop music and classic chanson; ages are approximate and language familiarity matters more than age. Charles Trenet’s La mer is a live performance, and some older English selections have still artwork.
