# Video scripts. Each segment: (spoken text, big label or None, emoji, 3D directions)
# 3D directions: place = room | path | summit ; anim = Idle Walking Running Dance Sitting Standing Death
#   Jump Yes No Wave Punch ThumbsUp WalkJump ; cam = front | close | side | back | orbit | drone
# Keep segments to one idea; each one triggers a visual "cut" (new color, emoji, whoosh).

VIDEOS = {
    "01_not_lazy": {
        "title": "RESET YOUR BRAIN IN 30 DAYS",
        "hue": (255, 70, 70),
        "segments": [
            ("You're not lazy.", None, "🧠", {"place": "room", "anim": "Sitting", "cam": "close"}),
            ("Your brain is addicted to cheap dopamine.", None, "📱", {"place": "room", "anim": "Sitting", "cam": "orbit"}),
            ("Every scroll. Every notification. Every snack.", None, "🍩", {"place": "room", "anim": "Sitting", "cam": "side"}),
            ("It raises your baseline. So hard things start to feel impossible.", None, "📉", {"place": "room", "anim": "No", "cam": "front"}),
            ("Here's how to reset it in thirty days.", None, "🔄", {"place": "room", "anim": "Standing", "cam": "close"}),
            ("Days one to seven. No phone for the first hour after you wake up.", "1-7", "🌅", {"place": "path", "anim": "Walking", "cam": "front"}),
            ("Days eight to fourteen. Do the hardest task first. Before anything fun.", "8-14", "💪", {"place": "path", "anim": "Running", "cam": "side"}),
            ("Days fifteen to thirty. Get bored on purpose. Walk without music. Eat without a screen.", "15-30", "🚶", {"place": "path", "anim": "Walking", "cam": "back"}),
            ("After thirty days, discipline stops feeling like pain.", None, "🔥", {"place": "summit", "anim": "Yes", "cam": "orbit"}),
            ("It starts feeling like who you are.", None, "👑", {"place": "summit", "anim": "Dance", "cam": "drone"}),
            ("And if you're still scrolling right now, that's exactly why you needed to hear this.", None, "👀", {"place": "summit", "anim": "Wave", "cam": "close"}),
        ],
        "caption": "You're not lazy. Your brain is just overstimulated 🧠 Save this and start tomorrow morning. "
                   "#selfimprovement #discipline #dopaminedetox #motivation #mindset #productivity #fyp",
    },
    "02_before_2027": {
        "title": "5 RULES BEFORE 2027",
        "hue": (255, 190, 60),
        "segments": [
            ("Do these five things before 2027, and nobody will recognize you.", None, "⚡", {"place": "room", "anim": "Sitting", "cam": "close"}),
            ("One. Wake up at the same time every day. Even on weekends.", "1", "⏰", {"place": "room", "anim": "Standing", "cam": "front"}),
            ("Consistency beats motivation.", None, "📈", {"place": "path", "anim": "Walking", "cam": "front"}),
            ("Two. Train your body before you train your mind. Thirty minutes. Every single day.", "2", "💪", {"place": "path", "anim": "Running", "cam": "side"}),
            ("Three. Read ten pages a day. That's twelve books a year.", "3", "📚", {"place": "path", "anim": "Walking", "cam": "back"}),
            ("Four. Stop telling people your plans. Show them results.", "4", "🤫", {"place": "path", "anim": "No", "cam": "front"}),
            ("Five. Protect your mornings like your life depends on it.", "5", "🔒", {"place": "path", "anim": "Punch", "cam": "side"}),
            ("Because your future does.", None, "🎯", {"place": "summit", "anim": "Idle", "cam": "drone"}),
            ("Most people will wait for January. You'll already be five weeks ahead.", None, "🏁", {"place": "summit", "anim": "Dance", "cam": "orbit"}),
            ("Save this, and start tonight.", None, "✅", {"place": "summit", "anim": "ThumbsUp", "cam": "close"}),
        ],
        "caption": "Don't wait for January. Which one are you starting tonight? 👇 "
                   "#selfimprovement #2027 #newyearnewme #discipline #glowup #mindset #motivation #fyp",
    },
    "03_procrastination": {
        "title": "STOP PROCRASTINATING",
        "hue": (80, 170, 255),
        "segments": [
            ("Three psychology tricks that will make you stop procrastinating. Today.", None, "🧠", {"place": "room", "anim": "Sitting", "cam": "close"}),
            ("Trick one. The five second rule.", "1", "⏳", {"place": "room", "anim": "Sitting", "cam": "orbit"}),
            ("When you feel the urge to delay, count. Five. Four. Three. Two. One. And move.", None, "🚀", {"place": "room", "anim": "Standing", "cam": "front"}),
            ("Your brain can't build excuses that fast.", None, "🧱", {"place": "path", "anim": "Running", "cam": "side"}),
            ("Trick two. The two minute start.", "2", "🕑", {"place": "path", "anim": "Walking", "cam": "front"}),
            ("Don't commit to the whole task. Commit to two minutes. Starting is the hardest part, and momentum does the rest.", None, "🏃", {"place": "path", "anim": "Running", "cam": "back"}),
            ("Trick three. Make it ugly.", "3", "📝", {"place": "path", "anim": "Yes", "cam": "orbit"}),
            ("Give yourself permission to do it badly. Perfectionism is just fear wearing a nice suit.", None, "🎭", {"place": "path", "anim": "No", "cam": "front"}),
            ("You can't fix a blank page. But you can fix a bad one.", None, "📄", {"place": "summit", "anim": "Idle", "cam": "drone"}),
            ("Now stop watching, and go do the thing.", None, "👊", {"place": "summit", "anim": "Punch", "cam": "close"}),
        ],
        "caption": "Trick #3 changed everything for me 📝 Send this to someone who needs it. "
                   "#procrastination #psychology #selfimprovement #productivity #studytips #mindset #fyp",
    },
}
