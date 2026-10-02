/**
 * ============================================================
 *  EVERYTHING EDITABLE LIVES IN THIS FILE.
 * ============================================================
 *  Change any text below and the magazine updates. You never need
 *  to touch the components.
 *
 *  Photos: drop your images into /public/photos (photo1.jpg,
 *  photo2.jpg, ...). Photos 1-3 are used on the cover, letter and
 *  story (set below); EVERY other photo in the folder appears in the
 *  photo spread automatically, in number order. Small previews are
 *  made for you so it loads fast on mobile data. A missing photo shows
 *  a cute colored placeholder, so nothing ever breaks.
 *
 *  Lines marked "EDIT:" are the ones that need your real details.
 */
import type { PagePath } from '@/lib/pages'

export type AdTone = 'butter' | 'periwinkle' | 'sage'

/** A photo from /public/photos. Its real size is read from the file automatically. */
export type Photo = {
  src: string
  /** Describes the photo for screen readers */
  alt: string
  caption?: string
}

/* ------------------------------------------------------------ */
/*  The two of you                                              */
/* ------------------------------------------------------------ */
export const people = {
  him: 'Pratik',
  me: 'Tanu',
}

/* ------------------------------------------------------------ */
/*  Magazine basics (shown on the cover + running header)       */
/* ------------------------------------------------------------ */
export const magazine = {
  name: 'Pratik',
  /** Little script word after the name in the top bar and browser tab */
  nameSuffix: 'monthly',
  tagline: 'The only magazine with exactly one subscriber. I dare you to have another one.',
  /** The banner under the masthead on the cover */
  edition: "Boyfriend's Day Special Edition",
  issue: 'Vol. 1, Issue 1',
  date: 'October 3, 2026',
  price: 'Priceless',
}

/* ------------------------------------------------------------ */
/*  Background music (YouTube)                                  */
/* ------------------------------------------------------------ */
export const music = {
  youtubeId: 'y9NuAuosGJ0',
  title: 'Dandelions',
  artist: 'Ruth B.',
  label: 'Now playing',
  /** 0 to 100. Soft background level. */
  volume: 30,
  /**
   * Try to start the music as soon as the site opens. Browsers only allow sound
   * after a first tap, so where autoplay is blocked (always on iPhone) it starts
   * on the first tap, swipe or key press instead.
   */
  autoplay: true,
}

/* ------------------------------------------------------------ */
/*  Page titles (used by the contents page + browser tab)       */
/* ------------------------------------------------------------ */
export const pageTitles = {
  '/': { title: 'The Cover', blurb: 'where it all begins' },
  '/contents': { title: 'Contents', blurb: 'you are here' },
  '/letter': { title: "Editor's Letter", blurb: 'a little note from Tanu' },
  '/story': { title: 'Cover Story: How We Met', blurb: 'the day everything got better' },
  '/photos': { title: 'The Photo Spread', blurb: 'hard evidence that we are cute' },
  '/interview': { title: 'The Interview', blurb: 'the hard-hitting questions' },
  '/top-10': { title: 'Top 10', blurb: 'things I love about you' },
  '/ads': { title: 'Classifieds', blurb: 'a word from our sponsors' },
  '/quiz': { title: 'The Quiz', blurb: 'how well do you know us?' },
  '/back': { title: 'Back Cover', blurb: 'one last thing' },
} satisfies Record<PagePath, { title: string; blurb: string }>

/* ------------------------------------------------------------ */
/*  Little bits of UI text used around the magazine             */
/* ------------------------------------------------------------ */
export const ui = {
  desktopHint: 'psst: the arrow keys flip pages too',
  loading: 'turning the page…',
  scrollHint: 'scroll for more',
}

/* ------------------------------------------------------------ */
/*  01 · Cover                                                  */
/* ------------------------------------------------------------ */
export const cover = {
  photo: {
    src: '/photos/photo1.jpg', // EDIT: his best photo. A tall phone photo fills the cover best.
    alt: 'Pratik, looking unreasonably handsome',
  } satisfies Photo,
  /**
   * The cover photo fills the whole page, so very different screen shapes may trim
   * its edges. This picks the spot to always keep visible: "horizontal% vertical%".
   * "50% 50%" is the center; "70% 30%" keeps the right side, upper part (his face).
   */
  photoFocus: '70% 30%',
  headlines: [
    { kicker: 'Exclusive', text: 'Local man too cute. Have to hide from everyone.' },
    { kicker: 'p. 07', text: '10 things she loves about him (she ran out of room, not enough space)' },
    { kicker: 'Quiz', text: 'How well do you REALLY know us?' },
    { kicker: 'Inside', text: 'The interview he never agreed to' },
  ],
  sticker: 'Special\nissue!',
  openButton: 'Open the magazine',
}

/* ------------------------------------------------------------ */
/*  02 · Contents                                               */
/* ------------------------------------------------------------ */
export const contentsPage = {
  title: 'Contents',
  subtitle: 'everything inside this issue',
  editorsPick: "editor's pick",
  swipeHint: 'or just swipe, babe',
}

/* ------------------------------------------------------------ */
/*  03 · Editor's letter                                        */
/* ------------------------------------------------------------ */
export const letter = {
  kicker: "From the editor's desk",
  greeting: 'Dear Pratik,',
  // EDIT: write your own letter. Each string is one paragraph.
  paragraphs: [
    "Welcome to the very first issue of the only magazine where you are the cover star, the feature story, and the entire subscriber list. Our research team (me) worked very hard on this.",
    "Happy Boyfriend's Day. I wanted to make you something you could hold in your pocket and flip through whenever you need a reminder of how loved you are. So here it is: a whole magazine about my favorite topic.",
    'Thank you for the late-night talks, the terrible jokes, the wonderful hugs, the cute kisses, the way you always feed me, and for being my calm place when the world is loud. You make ordinary days feel like a special edition (get it?).',
    'Turn the page, babe. There is a lot more where this came from.',
  ],
  signoff: 'Forever your biggest (and the only one because I will fight others) fan,',
  signature: 'Tanu',
  ps: 'P.S. Yes, there is a quiz. Yes, it counts.',
  /** The very last line the pen writes. Leave it empty ('') to hide it. */
  pps: "P.P.S. And don't forget 19th October, 2025. We will see what happens that day this year. I did not forget and I won't let you forget 😈🔪",
  skipLabel: 'skip ahead',
  /**
   * How fast the letter writes itself: milliseconds per letter. Lower is faster.
   * 65 is a gentle, easy-to-follow reading pace; pauses at commas, full stops
   * and between paragraphs scale with it automatically.
   */
  msPerLetter: 65,
  photo: {
    src: '/photos/photo2.jpg', // EDIT: a photo of you two
    alt: 'Tanu and Pratik together',
    caption: 'the editor & her muse',
  } satisfies Photo,
}

/* ------------------------------------------------------------ */
/*  04 · Cover story: How we met                                */
/* ------------------------------------------------------------ */
export const story = {
  section: 'The feature',
  kicker: 'Cover story',
  title: 'How We Met',
  deck: 'An in-depth investigation into the exact moment everything got better.',
  byline: 'Words by Tanu · Photography by whoever we handed the phone to',
  // EDIT: tell your real story. Each string is one paragraph.
  before: [
    'Well we both know how it started. One swipe. Random answer of a random question. Two ghosts (ignoring the part where I ghosted you. GET OVER IT. I FORGOT THAT I DID NOT REPLY.) And then somehow along the way two persons who almost had the same experience all over started making sense to each other. And boom, here we are.',
    "I am glad I replied. I am glad you replied. I am glad we met. I am glad we are still here: still together, still in love, still us. And most importantly, I am glad we are still making each other happy, making each other laugh, and making each other feel loved. Last but not the least, I am glad you are my BOYFRIEND.",
  ],
  pullQuote: 'I remember thinking: oh no, I really like this one. Mera to katne wala hai.',
  after: [
    'Sources close to the couple (me) confirm that the first date involved nerves, too much talking, and at least one moment of very obvious staring. And then, umm... Anyways.',
    "Since then, the two have been spotted sharing food, finishing each other's sentences, and arguing over the ragebaits that most definitely work on me.",
    'Experts agree: this is the best thing that has ever happened. The investigation is ongoing and expected to last forever. And in case it so happens that it might not last forever, Tanu has confirmed she is going to kidnap him and keep him in a cage. So, you know, it is going to last forever.',
  ],
  photo: {
    src: '/photos/photo3.jpg', // EDIT: an early photo of you two
    alt: 'One of our first photos together',
    caption: 'exhibit A: the early days',
  } satisfies Photo,
}

/* ------------------------------------------------------------ */
/*  05 · Photo spread                                           */
/* ------------------------------------------------------------ */
export const photoSpread = {
  kicker: 'The evidence',
  title: 'The Photo Spread',
  /** Shown after the photo count, e.g. "49 photos of proof that we are cute" */
  countLabel: 'photos of proof that we are cute',
  hint: 'tap a photo to make it big, then swipe through',
  /**
   * Photos are grouped "Exhibit A", "Exhibit B", ... with about this many in
   * each. Groups are evened out so none is left with a lonely straggler
   * (49 photos -> 13, 12, 12, 12).
   */
  groupLabel: 'Exhibit',
  groupSize: 12,
  /** Handwritten notes tucked between the groups (they repeat if there are more groups) */
  notes: [
    'okay, a few more...',
    'still not done. sorry not sorry',
    'every single one of these is my favorite',
    'the camera loves you. so do I.',
  ],
  footer: 'more coming soon (we keep being cute)',
  /** Fallback description for screen readers when a photo has no caption */
  defaultAlt: 'A photo of us',
  /**
   * EDIT (optional): captions for any photo, by file name. Photos without one
   * get a classic blank polaroid edge. Example:
   *   'photo7.jpg': 'that one perfect day',
   */
  captions: {} as Record<string, string>,
  /** Lightbox buttons, for screen readers */
  previousLabel: 'Previous photo',
  nextLabel: 'Next photo',
}

/* ------------------------------------------------------------ */
/*  06 · The interview                                          */
/* ------------------------------------------------------------ */
export const interview = {
  kicker: 'Q & A',
  badge: 'Exclusive',
  title: 'The Interview',
  intro:
    "We sat down with Pratik for a rare, exclusive conversation. He did not know this was an interview. Here's what he said (according to our very reliable memory).",
  // EDIT: questions and his (real or imagined) answers
  questions: [
    { q: 'Describe your life before Tanu.', a: 'My life was filled with darkness, and there she was, a complete ray of sunshine. I keep thanking my stars that she exists. Oh what I would have done without her. (Note from the editor: I dare you to defy me).' },
    { q: 'What was your first impression of Tanu?', a: '"Oh, she\'s trouble." He was correct.' },
    { q: 'Why do you hate Tanu?', a: 'I don\'t hate her. She keeps thinking I do. Not her fault tho. It\'s okay, I am used to it.' },
    { q: "What happened on 19th October, 2025?", a: '(He didn\'t answer. He pressed his temple and sighed.)' },
    { q: 'Who is funnier, you or Tanu?', a: 'He said himself. (The editor would like to file a formal complaint.)' },
    { q: 'You hate Tanu.', a: 'Huh?' },
  ],
}

/* ------------------------------------------------------------ */
/*  07 · Top 10                                                 */
/* ------------------------------------------------------------ */
export const top10 = {
  kicker: 'The list',
  bigTitle: 'Top 10',
  title: 'Things I Love About You',
  subtitle: "Ranked in no particular order, because they're all number one.",
  hint: 'tap one to give it a heart',
  // EDIT: your 10 things
  items: [
    'The way your nose scrunches when you laugh. I love it so much.',
    'How you always know when I need a hug, even before I do.',
    'Whenever we meet, you greet me with a kiss on my forehead. Golei jai ami.',
    'That you remember the tiny things I mention once.',
    'Your hands. Especially when they are holding mine.',
    'How calm you stay when I am being dramatic. I mean I know I piss you off. Tor jaygay ami thakle ami martam nijeke.',
    'Your face when you are concentrating really hard.',
    'You making sure I EAT EAT. Not just eat. Calling me and scolding me for not drinking water hehe. Love it.',
    'I KNOW HOW TO CROSS THE ROAD. But I love it when you hold my hand so tightly when we are crossing the road.',
    'That I get to call you mine.',
  ],
}

/* ------------------------------------------------------------ */
/*  08 · Fake ads (inside jokes!)                               */
/* ------------------------------------------------------------ */
export const ads = {
  title: 'Classifieds',
  subtitle: 'A word from our sponsors',
  labels: {
    advertisement: 'Advertisement',
    burst: 'NEW!',
    clip: 'clip & keep',
    asSeenOnTv: 'As seen on TV',
  },
  // EDIT: turn your inside jokes into ads. Exactly 2 ads.
  items: [
    {
      brand: 'PRATIK-NAP™',
      headline: 'The Nap after you-know-what.',
      tagline: 'Results may last 3 hours.',
      body: 'Clinically proven to happen anywhere, any time.',
      cta: 'Do not disturb',
      fine: '*Waking him up voids all warranties.',
      tone: 'butter',
    },
    {
      brand: 'TANU & CO.',
      headline: 'Hugs and Kisses on Demand',
      tagline: 'Now with unlimited refills!',
      body: 'Feeling tired? Grumpy? Hungry? One hug and one kiss cures all known conditions. No subscription required.',
      cta: 'Redeem anytime',
      fine: '*Valid forever. Non-transferable. Only one customer, ever. No refunds.',
      tone: 'periwinkle',
    },
  ] satisfies {
    brand: string
    headline: string
    tagline: string
    body: string
    cta: string
    fine: string
    tone: AdTone
  }[],
}

/* ------------------------------------------------------------ */
/*  09 · The quiz                                               */
/* ------------------------------------------------------------ */
export const quiz = {
  kicker: 'Pop quiz',
  title: 'How Well Do You Know Us?',
  intro: 'Five questions. No cheating. Tanu is watching.',
  // EDIT: questions, options, and which option is right (`answer` counts from 0)
  questions: [
    {
      question: 'Where did we first meet?',
      options: ['Through friends', 'Bumble', 'At school or work', 'Destiny (and Wi-Fi)'],
      answer: 1,
    },
    {
      question: "What's Tanu's go-to comfort food?",
      options: ['Pizza', 'Momos', 'Ice cream', 'Whatever is on your plate'],
      answer: 3,
    },
    {
      question: 'Who is the best?',
      options: ['Pratik', 'Tanu', 'None', "Bilai"],
      answer: 0,
    },
    {
      question: 'What is our favorite thing to do together?',
      options: ['Long walks', 'Date nights', 'Eating our way through the city', 'Literally anything'],
      answer: 3,
    },
    {
      question: 'How much does Tanu love you?',
      options: ['A lot', 'A whole lot', 'More than Iced Mocha', 'Too much to fit in a magazine'],
      answer: 3,
    },
  ],
  correctReactions: ['Correct! Gold star.', 'Ding ding ding!', 'Look at you go!', 'Yes! You get a kiss.'],
  wrongReactions: ['Hmm, close-ish?', 'Wrong, but still cute.', 'Points deducted, love retained.'],
  // Shown at the end. The first one where score >= minScore wins (keep them ordered high to low).
  results: [
    { minScore: 5, title: 'Certified Soulmate', message: 'A perfect score. Frame it. You clearly pay attention, and I love that about you.' },
    { minScore: 3, title: 'Professional Boyfriend', message: 'Not bad at all! A few gaps in the research, but the heart is in the right place.' },
    { minScore: 0, title: 'Adorable Disaster', message: "That went terribly, and I somehow love you even more. Let's go make more memories so you can study." },
  ],
  questionLabel: 'Question',
  nextLabel: 'Next',
  resultsLabel: 'Results',
  resultHeading: 'Your result',
  retryLabel: 'Try again',
}

/* ------------------------------------------------------------ */
/*  10 · Back cover                                             */
/* ------------------------------------------------------------ */
export const backCover = {
  kicker: 'The back cover',
  heartLabel: 'Tap the heart for more confetti',
  title: "Happy Boyfriend's Day",
  message:
    "Thank you, Pratik. For everything. For every laugh, every hug, and every ordinary day you've made feel special, and for staying. I love you more than this whole magazine could ever say. This magazine is just a way to tell you that you are special. I don't know if you like it or not. But nonetheless, I love you. And never ever think you are alone. I will always stay by you, and I am never going to leave you alone (up to you to think whether it's a threat or a promise). I love you, and nothing in this world can ever change that. You don't have to fight anything alone. We will figure everything out together. I promise.",
  signature: 'Yours only, Tanu',
  footer: 'Printed with love, in an edition of one.',
  replayLabel: 'Read it again',
}

/* ------------------------------------------------------------ */
/*  404 page                                                    */
/* ------------------------------------------------------------ */
export const notFound = {
  kicker: 'Page ???',
  title: 'Uh oh. This page was torn out.',
  message: 'Someone ripped it out of the magazine. The main suspect is Pratik. Investigations continue.',
  backLabel: 'Back to the cover',
}
