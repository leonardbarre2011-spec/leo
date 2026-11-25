# "In this town…": TikTok 3D (format story blocky)

Vidéo verticale 1080×1920, 30 fps, ~55 s, au format viral **"In this town…"** :
ville 3D blocky style Roblox, persos cubiques, couleurs saturées, sous-titres
mot par mot au centre (blanc, contour noir, mots-clés en jaune), voix off rapide
et pitchée, une coupe toutes les 1-2 s.

**Vidéos :**
| Épisode | Fichier | Durée |
|---|---|---|
| Le soleil contrôlé par un vieux | `output/in-this-town-sun-switch.mp4` | 55 s |
| La gravité s'arrête à midi | `output/in-this-town-gravity.mp4` | 48 s |
| Il neige sur une seule maison | `output/in-this-town-snow.mp4` | 42 s |
| Un vœu pour tes 10 ans | `output/in-this-town-wish.mp4` | 47 s |
| Il pleut des vaches le vendredi (montage rapide) | `output/in-this-town-cows.mp4` | 40 s |
| Dis « banana » et tu deviens une banane (montage rapide) | `output/in-this-town-banana.mp4` | 38 s |

### Montage rapide (épisodes 5-6)
~1 plan toutes les 0,75-0,9 s (46 et 52 plans), zoom d'impact + petit décalage caméra à chaque coupe,
swish sur chaque coupe, flash + secousse sur les moments forts. Vérifier tous les plans d'un coup :
`EP=cows node src/render.mjs sheet && src/sheet.sh cows` → `build/cows/sheet_1.jpg`.

### Musique de fond (épisodes 2 à 6)
Le morceau utilisé par la vidéo de référence est **« Numbers » de TEMPOREX**
(identifié par reconnaissance audio). Il est protégé par le droit d'auteur, donc il
n'est pas intégré aux fichiers : les vidéos 2-4 contiennent voix + bruitages, et la
musique s'ajoute dans TikTok → *Sons* → chercher « Numbers TEMPOREX » → volume de la
musique ~10-15 %, volume d'origine 100 %.

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
Épisodes 2-4 : ×1.22 (un peu moins aigu, ~0,8 demi-ton plus grave), vitesse compensée (+6 %).

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
EP=gravity                                   # sun | gravity | snow | wish | cows | banana
python3 src/voice.py $EP                     # voix + timings -> build/$EP/voice.wav, words.json
python3 src/sfx.py $EP                       # bruitages + mix -> build/$EP/mix.wav
EP=$EP node src/render.mjs preview 1 10      # aperçus -> build/$EP/preview_*.jpg
EP=$EP node src/render.mjs video 30          # rendu image par image (Chromium headless + three.js)
ffmpeg -i build/$EP/video_noaudio.mp4 -i build/$EP/mix.wav -c:v copy -c:a aac -b:a 192k -shortest output/in-this-town-$EP.mp4
```
Nouvel épisode : créer `src/episodes/<nom>/` avec `script.txt`, `config.json`
(`K` = accélération/pitch, `rate`) et `shots.js` (un plan par phrase, accessoires
partagés dans `src/episodes/common.js`), puis ajouter ses bruitages dans `src/sfx.py`.
(`src/audio.py` = ancienne bande-son avec musique générée, utilisée pour l'épisode 1.)
