// Recording prompts for voice banking
export const RECORDING_PROMPTS = [
  {
    id: 1,
    title: 'Warm-Up',
    description: 'Say: "Hello, this is my voice"',
    duration: '1 minute',
    purpose: 'Test audio quality and give feedback',
  },
  {
    id: 2,
    title: 'A Favorite Memory',
    description: 'Tell us about your favorite childhood memory',
    duration: '1-2 minutes',
    purpose: 'Captures natural storytelling tone',
  },
  {
    id: 3,
    title: 'Someone You Love',
    description: 'Describe someone you love and why they\'re special',
    duration: '1-2 minutes',
    purpose: 'Rich emotional inflection',
  },
  {
    id: 4,
    title: 'Life Advice',
    description: 'What advice would you give your younger self?',
    duration: '1-2 minutes',
    purpose: 'Conversational, reflective tone',
  },
  {
    id: 5,
    title: 'Reading Passage - Rainbow',
    description: 'Read this passage aloud naturally (covers many sounds)',
    duration: '1-2 minutes',
    purpose: 'Covers all phonetic sounds',
    readingText: `When the sunlight strikes raindrops in the air, they act as a prism and form a rainbow. The rainbow is a division of white light into many beautiful colors. These take the shape of a long round arch, with its path high above, and its two ends apparently beyond the horizon. There is, according to legend, a boiling pot of gold at one end. People look, but no one ever finds it. When a man looks for something beyond his reach, his friends say he is looking for the pot of gold at the end of the rainbow. Throughout the centuries people have explained the rainbow in various ways. Some have accepted it as a miracle without physical explanation. To the Hebrews it was a token that there would be no more universal floods. The Greeks used to imagine that it was a sign from the gods to foretell war or heavy rain.`,
  },
  {
    id: 6,
    title: 'Proudest Moment',
    description: 'Tell us about your proudest accomplishment',
    duration: '1-2 minutes',
    purpose: 'Positive, energetic tone',
  },
  {
    id: 7,
    title: 'Legacy Statement',
    description: 'What do you want people to remember about you?',
    duration: '1-2 minutes',
    purpose: 'Deep, meaningful content',
  },
  {
    id: 8,
    title: 'Common Phrases',
    description: 'Say these phrases naturally with emotion',
    duration: '1-2 minutes',
    purpose: 'Practical daily use',
    phrases: [
      'I love you',
      'I\'m proud of you',
      'Thank you',
      'Good morning',
      'See you soon',
      'I miss you',
      'You make me happy',
      'Everything will be okay',
    ],
  },
]

// Suggested phrases for the dashboard
export const SUGGESTED_PHRASES = [
  'I love you',
  'I\'m proud of you',
  'Thank you for everything',
  'Good morning',
  'See you soon',
  'I miss you',
  'You\'re doing great',
  'Everything will be okay',
  'I believe in you',
  'Sweet dreams',
]

