# TikTok "Self-Improvement": générateur de vidéos virales (100 % gratuit)

Des vidéos faceless en anglais, avec une voix IA, des sous-titres animés mot par mot, de la musique et des effets sonores.
**Tout tourne en local, sans compte, sans clé API et sans abonnement.**

| Brique | Outil gratuit | Rôle |
|---|---|---|
| Voix IA | [Kokoro TTS](https://github.com/thewh1teagle/kokoro-onnx) (open source, Apache 2.0) | Voix off naturelle d'un homme américain (`am_michael`) |
| Synchro des mots | [faster-whisper](https://github.com/SYSTRAN/faster-whisper) | Calcule l'instant de chaque mot pour des sous-titres karaoké |
| Musique et SFX | Générés en Python (numpy) | Nappe sombre, battement de cœur et whoosh à chaque cut, **sans aucun risque de copyright** |
| **Monde 3D + personnage** | [Three.js](https://threejs.org) (open source) rendu dans Chromium sans écran | Un robot 3D animé ([RobotExpressive](https://github.com/mrdoob/three.js/tree/dev/examples/models/gltf/RobotExpressive), licence CC0) joue l'histoire dans 3 décors |
| Montage | Pillow + ffmpeg | 1080x1920, 30 fps, sous-titres nets par-dessus la 3D, flash à chaque cut |

## Le monde 3D

Chaque vidéo raconte une transformation en 3 décors :

1. **`room`** : une chambre sombre la nuit. Le robot est affalé sur le canapé, téléphone en main, entouré de notifications (❤️🔔💬).
2. **`path`** : un sentier à l'aube, avec des collines, des sapins et des lanternes. Le robot marche et court, et des chiffres 3D (« 1-7 », « 2 »…) flottent au-dessus de lui.
3. **`summit`** : un sommet au lever du soleil, au-dessus d'une mer de nuages, avec un drapeau. Le robot danse ou lève le pouce.

Chaque phrase du script est un plan. Dans `scripts.py`, chaque segment précise :

- le décor (`place`) ;
- l'animation (`anim`) : `Idle`, `Walking`, `Running`, `Dance`, `Sitting`, `Standing`, `Death`, `Jump`, `Yes`, `No`, `Wave`, `Punch`, `ThumbsUp` ;
- le cadrage (`cam`) : `front`, `close`, `side`, `back`, `orbit`, `drone`.

`MODE=2d python make_video.py` revient à l'ancien style, avec un fond animé plat.

## Les 3 vidéos prêtes (`output/`)

| Fichier | Hook | Pourquoi ça marche |
|---|---|---|
| `01_not_lazy.mp4` | *"You're not lazy."* | Une phrase qui déculpabilise et touche directement le spectateur. La fin boucle sur le début, ce qui fait revoir la vidéo |
| `02_before_2027.mp4` | *"Do these five things before 2027…"* | Profite du pic « nouvelle année » de décembre. C'est une liste, donc on l'enregistre |
| `03_procrastination.mp4` | *"Three psychology tricks…"* | Le mot « psychology » et un bénéfice immédiat font partager la vidéo |

La description et les hashtags de chaque vidéo sont dans `output/*_caption.txt`.

## Comment poster pour maximiser les abonnés

1. **Rythme** : 1 à 2 vidéos par jour, à la même heure. Testez 18 h à 21 h, heure de New York, puisque le contenu est en anglais.
2. **Les 3 premières heures** : répondez à chaque commentaire, de préférence par une vidéo-réponse, ce qui fait un contenu gratuit de plus.
3. **Son** : laissez le son original. Vous pouvez aussi ajouter un son tendance à volume 0 % depuis l'éditeur TikTok pour profiter de l'algorithme du son.
4. **Lisez la courbe de rétention** dans les statistiques :
   - si elle chute à 2 s, c'est le hook qu'il faut changer ;
   - si elle chute vers 15 s, c'est le milieu qui est trop lent : raccourcissez-le.
5. **Recyclez ce qui marche** : quand une vidéo dépasse la moyenne, refaites-la avec un autre hook, en « Part 2 », ou dans la même structure sur un autre sujet.
6. Postez les mêmes fichiers sur YouTube Shorts et Instagram Reels. C'est gratuit et ça multiplie votre portée.

## Créer de nouvelles vidéos

1. Ajoutez une entrée dans `scripts.py`. Chaque segment est un tuple `(texte, gros_chiffre_ou_None, emoji)`, et chaque segment crée un cut visuel.
2. Lancez :

```bash
pip install kokoro-onnx soundfile faster-whisper numpy pillow playwright
(cd scene3d && npm install)   # Three.js
mkdir -p models && cd models
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
cd .. && python make_video.py            # toutes les vidéos
python make_video.py 01_not_lazy         # une seule
VOICE=bm_george python make_video.py     # voix britannique grave
```

Il faut aussi `ffmpeg` et Chromium. Chromium s'installe avec `npx playwright install chromium`. La police utilisée est Inter Display Black ; changez les chemins `FONT_*` sur Windows ou Mac.

**Règles d'écriture d'un bon script**, adaptées de ce qui marche dans la niche :

- un hook de moins de 8 mots qui accuse, rassure ou promet (*"You're not lazy"*, *"Stop doing this"*, *"Nobody tells you this"*) ;
- 90 à 120 mots, soit 30 à 45 secondes ;
- un cut toutes les 2 à 3 secondes ;
- une liste numérotée, parce qu'on l'enregistre ;
- une fin qui boucle sur le hook ou demande d'enregistrer.

## Idées pour les prochaines vidéos

- "If you're 18–25, stop doing these 4 things"
- "The 1% rule that rich people don't talk about"
- "Your brain on 30 days without porn / sugar / social media"
- "3 signs you're smarter than you think"
- "How to become dangerous in 6 months (quietly)"
- "The Japanese technique that kills laziness (Kaizen)"
- "Stoic rules that make you unshakeable"
