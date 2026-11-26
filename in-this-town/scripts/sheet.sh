#!/bin/bash
# usage: sheet.sh COMP OUTDIR "start times..." VOICE_END
COMP=$1; S=$2; ST=$3; END=$4
rm -rf $S; mkdir -p $S
FR=$(python3 -c "
st=sorted(float(x) for x in '$ST'.split())+[$END]
print(' '.join(str(int(((st[i]+st[i+1])/2)*30)) for i in range(len(st)-1)))")
COMP=$COMP node scripts/stills.mjs $S $FR 2>&1 | grep -cE "^[0-9]+ [0-9]+ ms"
python3 -I - "$S" <<'PY'
import sys, glob
from PIL import Image
S=sys.argv[1]
fs=sorted(glob.glob(S+"/f*.jpeg")); w,h=Image.open(fs[0]).size; cols=8
for k in range(0,len(fs),16):
    b=fs[k:k+16]; rows=(len(b)+cols-1)//cols
    sh=Image.new("RGB",(cols*w,rows*h))
    for i,f in enumerate(b): sh.paste(Image.open(f),((i%cols)*w,(i//cols)*h))
    sh.save(f"{S}/sheet{k//16}.jpg",quality=80)
PY
