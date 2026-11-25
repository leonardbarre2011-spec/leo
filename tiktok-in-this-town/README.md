# "In this town…": TikTok 3D (format story blocky)

Vidéo verticale 1080×1920, 30 fps, ~55 s, au format viral **"In this town…"** :
ville 3D blocky style Roblox, persos cubiques, couleurs saturées, sous-titres
mot par mot au centre (blanc, contour noir, mots-clés en jaune), voix off rapide
et pitchée, une coupe toutes les 1-2 s.

**Vidéo finale :** `output/in-this-town-sun-switch.mp4`

## Histoire
> In this town, the sun is controlled by one old man… (interrupteur géant sur la
> colline, il s'endort, le soleil ne se couche plus, le héros abaisse l'interrupteur,
> il devient le nouveau "Switch Keeper" pour toujours, le vieux est en vacances à la
> plage… et se plaint qu'il fait trop beau.)

Script complet : `src/script.txt`

## Voix
Analyse des vidéos de référence : voix TTS masculine jeune, **accélérée + pitchée**
(F0 médiane 172-183 Hz, ~165-210 mots/min).

Reproduction : **Microsoft Edge Neural TTS `en-US-AndrewNeural`**, puis
`asetrate ×1.28` (accélère et monte la hauteur d'un coup, la technique TikTok
classique) + EQ de présence + compression.
Résultat : F0 médiane 169 Hz, 197 mots/min.

Pour une voix encore plus proche : ElevenLabs (voix narrateur jeune type "Adam" /
"Josh") puis la même accélération ×1.2-1.3.

## Légende TikTok proposée
```
In this town, one old man controls the sun ☀️🔌 #roblox #inthistown #robloxstories #fyp #storytime
```

## Régénérer
```bash
npm install                      # three.js
pip install edge-tts numpy
python3 src/voice.py             # voix + timings mot à mot -> build/voice.wav, build/words.json
python3 src/audio.py             # musique + bruitages + mix -> build/mix.wav
node src/render.mjs preview 1 10 # aperçus -> build/preview_*.jpg
node src/render.mjs video 30     # rendu image par image (Chromium headless + three.js)
ffmpeg -i build/video_noaudio.mp4 -i build/mix.wav -c:v copy -c:a aac -b:a 192k -shortest output/in-this-town-sun-switch.mp4
```
Changer l'histoire : modifier `src/script.txt`, relancer `voice.py`, puis adapter les
plans dans `buildShots()` (`src/scene.js`), un plan par phrase.
