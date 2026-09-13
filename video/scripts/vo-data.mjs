/**
 * Voice-over source map.
 *
 * `words` timings were produced by forced alignment of the transcript against
 * assets/vo-source.mp3 (CMU pocketsphinx aligner), so every caption word lands
 * on the syllable that actually says it.
 *
 * Each entry is one kept slice of the source file. Everything between two
 * slices is dead air that gets thrown away; `gapAfter` is the much shorter
 * breath that replaces it, hand-tuned per beat so the delivery still sounds
 * like a person talking and not like a sample chopped on a grid.
 */

export const COLD_OPEN = 1.05; // silent-VO runway at the head, for the hook

export const SEGMENTS = [
  {
    id: 'A',
    start: 0.0,
    end: 4.18,
    gapAfter: 0.34,
    caption: [['YOU CAN TRAIN', 0], ['EVERY DAY', 5], ['AND STILL STAY', 6], ['THE SAME PLAYER', 9]],
    accent: ['same', 'player'],
    words: [
      ['you', 0.0], ['can', 0.19], ['train', 0.34], ['basketball', 0.66], ['every', 1.26],
      ['day', 1.54], ['and', 2.2], ['still', 2.36], ['stay', 2.69], ['the', 3.05],
      ['same', 3.18], ['player', 3.47], ['·', 4.07],
    ],
  },
  {
    id: 'B',
    start: 5.02,
    end: 8.2,
    gapAfter: 0.34,
    caption: [['YOU JUST WAIT', 0], ['FOR REPS', 3], ['TO MAKE YOU BETTER', 5]],
    accent: ['wait'],
    words: [
      ['you', 5.02], ['just', 5.1], ['wait', 5.51], ['for', 6.32], ['reps', 6.93],
      ['to', 7.18], ['make', 7.3], ['you', 7.51], ['better', 7.61], ['·', 8.14],
    ],
  },
  {
    id: 'C',
    start: 9.32,
    end: 11.5,
    gapAfter: 0.28,
    caption: [['REPS MAKE YOU MORE', 0], ['OF WHAT YOU ALREADY ARE', 4]],
    accent: ['already', 'are'],
    words: [
      ['reps', 9.39], ['make', 9.65], ['you', 9.89], ['more', 10.01], ['of', 10.28],
      ['what', 10.39], ['you', 10.53], ['already', 10.68], ['are', 11.09], ['·', 11.44],
    ],
  },
  {
    id: 'D',
    start: 12.25,
    end: 14.4,
    gapAfter: 0.26,
    caption: [['IF YOUR HANDLE', 0], ['BREAKS DOWN', 3], ['UNDER PRESSURE', 5]],
    accent: ['breaks', 'down'],
    words: [
      ['if', 12.25], ['your', 12.49], ['handle', 12.64], ['breaks', 13.04], ['down', 13.34],
      ['under', 13.58], ['pressure', 13.74], ['·', 14.32],
    ],
  },
  {
    id: 'E',
    start: 14.74,
    end: 16.7,
    gapAfter: 0.0,
    caption: [['TWO HUNDRED DRIBBLES', 0], ['A DAY', 3]],
    accent: ['two', 'hundred'],
    words: [
      ['two', 14.74], ['hundred', 15.29], ['dribbles', 15.73], ['a', 16.17], ['day', 16.23],
    ],
  },
  {
    id: 'F',
    start: 16.7,
    end: 20.66,
    gapAfter: 0.36,
    caption: [['JUST BUILDS A SMOOTHER', 0], ['VERSION OF THE HANDLE', 4], ['THAT STILL BREAKS DOWN', 8]],
    accent: ['still', 'breaks', 'down'],
    words: [
      ['just', 16.74], ['builds', 17.03], ['a', 17.45], ['smoother', 17.53], ['version', 18.12],
      ['of', 18.78], ['the', 18.86], ['handle', 18.93], ['that', 19.6], ['still', 19.71],
      ['breaks', 19.99], ['down', 20.29], ['·', 20.6],
    ],
  },
  {
    id: 'G',
    start: 21.63,
    end: 24.06,
    gapAfter: 0.28,
    caption: [['AND NOBODY TRAINS YOU', 0], ['FOR YOUR ACTUAL POSITION', 4]],
    accent: ['actual', 'position'],
    words: [
      ['and', 21.7], ['nobody', 21.81], ['trains', 22.21], ['you', 22.71], ['for', 22.81],
      ['your', 22.92], ['actual', 23.02], ['position', 23.44], ['·', 23.99],
    ],
  },
  {
    id: 'H',
    start: 24.73,
    end: 27.14,
    gapAfter: 0.16,
    caption: [['SAME WORKOUT', 0], ['FOR THE GUARD', 2], ['AND THE BIG', 5]],
    accent: ['guard', 'big'],
    words: [
      ['same', 24.79], ['workout', 25.19], ['for', 25.57], ['the', 25.7], ['guard', 25.8],
      ['and', 26.31], ['the', 26.61], ['big', 26.68], ['·', 27.08],
    ],
  },
  {
    id: 'I',
    start: 28.06,
    end: 30.9,
    gapAfter: 0.16,
    caption: [['THE POINT GUARD', 0], ['MAKES A READ', 3], ['IN HALF A SECOND', 7]],
    accent: ['half', 'second'],
    words: [
      ['point', 28.06], ['guard', 28.33], ['has', 28.66], ['to', 28.88], ['make', 28.96],
      ['a', 29.16], ['read', 29.2], ['in', 29.47], ['half', 29.56], ['a', 29.83],
      ['second', 29.86], ['·', 30.5],
    ],
  },
  {
    id: 'J',
    start: 31.45,
    end: 33.28,
    gapAfter: 0.18,
    caption: [['THE BIG —', 0], ['THE PASS IS STILL', 2], ['IN THE AIR', 6]],
    accent: ['air'],
    words: [
      ['the', 31.45], ['big', 31.6], ['the', 31.92], ['pass', 31.98], ['is', 32.41],
      ['still', 32.48], ['in', 33.01], ['the', 33.08],
    ],
  },
  {
    id: 'K',
    start: 33.52,
    end: 35.8,
    gapAfter: 0.32,
    caption: [['AND READ THE HELP', 1], ['BEFORE HE CATCHES IT', 4]],
    accent: ['help'],
    words: [
      ['air', 33.52], ['and', 33.58], ['read', 33.74], ['the', 34.0], ['help', 34.08],
      ['before', 34.6], ['he', 34.93], ['catches', 35.0], ['it', 35.5], ['·', 35.74],
    ],
  },
  {
    id: 'L',
    start: 36.88,
    end: 38.05,
    gapAfter: 0.32,
    caption: [['DIFFERENT JOB', 0]],
    accent: ['different'],
    words: [['different', 36.95], ['job', 37.39], ['·', 37.99]],
  },
  {
    id: 'M',
    start: 38.6,
    end: 39.86,
    gapAfter: 0.3,
    caption: [['SAME DRILLS', 0]],
    accent: ['same'],
    words: [['same', 38.66], ['drills', 39.02], ['·', 39.78]],
  },
  {
    id: 'N',
    start: 40.3,
    end: 41.8,
    gapAfter: 0.36,
    caption: [["THAT'S WHY", 0], ['NOTHING CHANGES', 2]],
    accent: ['nothing', 'changes'],
    words: [["that's", 40.37], ['why', 40.61], ['nothing', 40.78], ['changes', 41.11], ['·', 41.74]],
  },
  {
    id: 'O',
    start: 43.08,
    end: 47.46,
    gapAfter: 0.36,
    caption: [['TWELVE WEEKS', 0], ['BUILT AROUND EVERYTHING', 2], ['YOUR POSITION NEEDS', 5], ['TO BE BETTER', 8]],
    accent: ['twelve', 'weeks', 'position'],
    words: [
      ['twelve', 43.16], ['weeks', 43.56], ['built', 44.82], ['around', 45.07], ['everything', 45.39],
      ['your', 45.86], ['position', 45.96], ['needs', 46.42], ['to', 46.68], ['be', 46.75],
      ['better', 46.88], ['·', 47.38],
    ],
  },
  {
    id: 'P',
    start: 48.5,
    end: 51.25,
    gapAfter: 0.22,
    caption: [['TWELVE WEEKS FROM NOW', 0], ["YOU'RE A DIFFERENT PLAYER", 4]],
    accent: ['different', 'player'],
    words: [
      ['twelve', 48.5], ['weeks', 48.97], ['from', 49.21], ['now', 49.38], ["you're", 49.97],
      ['a', 50.17], ['different', 50.2], ['player', 50.56], ['·', 51.19],
    ],
  },
  {
    id: 'Q',
    start: 51.45,
    end: 53.82,
    gapAfter: 0.34,
    caption: [['OR THE SAME ONE', 0], ['WITH BETTER CARDIO', 4]],
    accent: ['cardio'],
    words: [
      ['or', 51.68], ['the', 51.84], ['same', 51.96], ['one', 52.36], ['with', 52.65],
      ['better', 52.82], ['cardio', 53.08], ['·', 53.74],
    ],
  },
  {
    id: 'R',
    start: 54.78,
    end: 57.57,
    gapAfter: 0.0,
    caption: [['COMMENT “GAME”', 0], ["AND I'LL SEND YOU THE LINK", 2]],
    accent: ['game'],
    words: [
      ['comment', 54.78], ['game', 55.39], ['and', 55.99], ["i'll", 56.14], ['send', 56.27],
      ['you', 56.55], ['the', 56.65], ['link', 56.75], ['·', 57.4],
    ],
  },
];

export const TAIL = 1.6; // end-card breathing room after the last word
