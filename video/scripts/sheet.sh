#!/bin/bash
# Contact sheet from the rendered MP4: scripts/sheet.sh 0,30,60 name
set -e
mkdir -p public/_review out/stills
IFS=',' read -ra FR <<< "$1"
for f in "${FR[@]}"; do
  T=$(node -e "console.log((process.argv[1]/30).toFixed(4))" "$f")
  npx remotion ffmpeg -y -ss "$T" -i out/viral-basketball.mp4 -frames:v 1 -vf scale=270:480 "public/_review/$f.png" >/dev/null 2>&1
done
node -e "console.log(JSON.stringify({frames: process.argv[1].split(',').map(Number)}))" "$1" > /tmp/sheet-props.json
npx remotion still src/index.ts Tiles "out/stills/$2.png" --props=/tmp/sheet-props.json --image-format=png >/dev/null 2>&1
npx remotion ffmpeg -y -i "out/stills/$2.png" -vf scale=800:-2 -q:v 3 "out/stills/$2.jpg" >/dev/null 2>&1
echo "out/stills/$2.jpg"
