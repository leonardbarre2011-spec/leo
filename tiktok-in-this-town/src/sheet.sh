#!/bin/sh
# contact sheet of every shot: src/sheet.sh <ep> [cols]  -> build/<ep>/sheet.jpg
EP=$1; C=${2:-8}
ffmpeg -loglevel error -y -pattern_type glob -i "build/$EP/sheet/*.jpg" -vf "scale=216:384,drawtext=text='%{n}':x=8:y=8:fontsize=26:fontcolor=yellow:box=1:boxcolor=black,tile=${C}x6" -q:v 3 build/$EP/sheet_%d.jpg
