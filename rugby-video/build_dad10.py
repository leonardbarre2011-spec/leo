"""Builds dad10.html = shared engine from scene.html + dad10_main.js"""
s = open('scene.html').read()
head, rest = s.split('// ---------- timeline ----------', 1)
tail = rest[rest.index('</script>'):]
head = head.replace('<title>La dernière transformation</title>', "<title>My Dad's Number 10</title>").replace('lang="fr"', 'lang="en"')
# reset also clears body rotation
head = head.replace("this.body.position.set(0,0,0); this.root.visible=true;", "this.body.position.set(0,0,0); this.body.rotation.set(0,0,0); this.root.visible=true;")
extra_faces = r"""
      case 'tired': g.lineWidth=9; ex.forEach(x=>{g.beginPath();g.ellipse(x,ey+4,13,9,0,0,Math.PI*2);g.fill();g.beginPath();g.moveTo(x-18,ey-6);g.lineTo(x+18,ey-6);g.stroke();});
        g.strokeStyle='rgba(120,90,110,.45)'; g.lineWidth=6; ex.forEach(x=>{g.beginPath();g.arc(x,ey+18,16,0.15*Math.PI,0.85*Math.PI);g.stroke();}); g.strokeStyle='#111';
        g.lineWidth=9; g.beginPath(); g.moveTo(140,180); g.lineTo(180,180); g.stroke(); break;
      case 'tiredsmile': g.lineWidth=9; ex.forEach(x=>{g.beginPath();g.ellipse(x,ey+4,13,10,0,0,Math.PI*2);g.fill();g.beginPath();g.moveTo(x-18,ey-6);g.lineTo(x+18,ey-6);g.stroke();});
        g.strokeStyle='rgba(120,90,110,.45)'; g.lineWidth=6; ex.forEach(x=>{g.beginPath();g.arc(x,ey+18,16,0.15*Math.PI,0.85*Math.PI);g.stroke();}); g.strokeStyle='#111';
        g.lineWidth=10; g.beginPath(); g.arc(160,150,34,0.2*Math.PI,0.8*Math.PI); g.stroke(); break;
      case 'happycrydad': g.lineWidth=11; ex.forEach(x=>{g.beginPath();g.arc(x,ey+8,20,1.1*Math.PI,1.9*Math.PI);g.stroke();}); tears();
        g.strokeStyle='rgba(120,90,110,.45)'; g.lineWidth=6; ex.forEach(x=>{g.beginPath();g.arc(x,ey+24,16,0.15*Math.PI,0.85*Math.PI);g.stroke();}); g.strokeStyle='#111';
        g.lineWidth=12; g.beginPath(); g.arc(160,150,44,0.15*Math.PI,0.85*Math.PI); g.stroke(); break;
      case 'pain': g.lineWidth=11; ex.forEach((x,i)=>{const d=i?-1:1; g.beginPath(); g.moveTo(x-18*d,ey-14); g.lineTo(x+14*d,ey); g.lineTo(x-18*d,ey+14); g.stroke();});
        g.fillStyle='#fff'; g.fillRect(118,160,84,30); g.strokeRect(118,160,84,30); g.lineWidth=5; g.beginPath(); g.moveTo(118,175); g.lineTo(202,175); g.stroke(); g.fillStyle='#111'; break;
      case 'dad': eyes(); g.lineWidth=10; g.beginPath(); g.moveTo(ex[0]-22,ey-40); g.lineTo(ex[0]+18,ey-42); g.moveTo(ex[1]+22,ey-40); g.lineTo(ex[1]-18,ey-42); g.stroke();
        g.fillStyle='rgba(60,40,25,.28)'; g.beginPath(); g.ellipse(160,190,70,48,0,0,Math.PI); g.fill(); g.fillStyle='#111';
        g.lineWidth=12; g.beginPath(); g.arc(160,148,44,0.15*Math.PI,0.85*Math.PI); g.stroke(); break;
"""
marker = "      case 'down':"
assert marker in head
head = head.replace(marker, extra_faces + marker)
open('dad10.html', 'w').write(head + open('dad10_main.js').read() + '\n' + tail)
print('built dad10.html')
