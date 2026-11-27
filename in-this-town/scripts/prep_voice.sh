#!/bin/bash
# usage: prep_voice.sh N  (dead N)
N=$1; SC=/tmp/claude-0/-home-user-leo/361651ca-bdbd-5cd5-bb3b-df3bbe04fa3d/scratchpad; S=${2:-dead}; P=public/$S$N
mkdir -p $P
ffmpeg -y -loglevel error -i $SC/$S$N.wav -af "highpass=f=70,loudnorm=I=-15:TP=-1.5:LRA=7" -ar 48000 -b:a 192k $P/voiceover.mp3
ffmpeg -y -loglevel error -i $P/voiceover.mp3 -ar 16000 -ac 1 $SC/dw$S$N.wav
WMODEL=small.en WHISPER_DIR=$SC/whisper.cpp OUT=$P/captions.raw.json node scripts/transcribe.mjs $SC/dw$S$N.wav > /dev/null 2>&1
IN=$P/captions.raw.json OUT=$P/captions.json node scripts/clean-captions.mjs > /dev/null
END=$(python3 -c "import json;c=json.load(open('$P/captions.json'));print(round(c[-1]['endMs']/1000+0.35,2))")
python3 scripts/cues.py scripts/voice/$S$N.txt $P/captions.json $P/cues.json $END
echo "END $END"
