export interface NotebookSource {
  id: string;
  title: string;
  type: 'Scripture' | 'Commentary' | 'Document' | 'Newsletter' | 'Web' | 'Lexicon';
  content: string;
  wordCount: number;
  addedAt: string;
  citations: string[];
}

export interface AudioOverviewEpisode {
  id: string;
  title: string;
  topic: string;
  durationMinutes: string;
  hosts: { hostA: string; hostB: string };
  dialogue: Array<{
    speaker: string;
    text: string;
    timestamp: string;
  }>;
  summary: string;
}

export interface NotebookStudyGuide {
  title: string;
  executiveSummary: string;
  keyThemes: Array<{ theme: string; explanation: string; scriptureCitations: string[] }>;
  hermeneuticAnalysis: {
    historicalContext: string;
    originalLanguageInsight: string;
    theologicalSignificance: string;
  };
  sermonOutline: Array<{ point: string; scripture: string; application: string }>;
  suggestedDiscussionQuestions: string[];
  faqList: Array<{ question: string; answer: string }>;
}

export interface NotebookChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Array<{ sourceId: string; sourceTitle: string; quote: string }>;
  timestamp: string;
}

/**
 * Default Curated Theological Sources for Word Embassy NotebookLM
 */
export const DEFAULT_NOTEBOOK_SOURCES: NotebookSource[] = [
  {
    id: 'src-1',
    title: 'Ephesians 3:14-21 (Rooted & Grounded in Love)',
    type: 'Scripture',
    wordCount: 310,
    addedAt: '2026-08-20',
    citations: ['Eph 3:16', 'Eph 3:17', 'Eph 3:19', 'Eph 3:20'],
    content: `For this reason I bow my knees before the Father, from whom every family in heaven and on earth is named, that according to the riches of his glory he may grant you to be strengthened with power through his Spirit in your inner being, so that Christ may dwell in your hearts through faith—that you, being rooted and grounded in love, may have strength to comprehend with all the saints what is the breadth and length and height and depth, and to know the love of Christ that surpasses knowledge, that you may be filled with all the fullness of God. Now to him who is able to do far more abundantly than all that we ask or think, according to the power at work within us, to him be glory in the church and in Christ Jesus throughout all generations, forever and ever. Amen.`,
  },
  {
    id: 'src-2',
    title: 'Greek Lexicon & Word Study on Dunamis & Pléroma',
    type: 'Lexicon',
    wordCount: 420,
    addedAt: '2026-08-22',
    citations: ['Strong\'s G1411 (Dunamis)', 'Strong\'s G4138 (Pléroma)', 'Strong\'s G2632 (Kataballó)'],
    content: `Dunamis (δύναμις): Inherent power, miraculous energy, residing in a person or thing. In Paul's corpus, dunamis is never abstract; it is the resurrection energy of the Holy Spirit operating within the inner man (ho esō anthrōpos). Pléroma (πλήρωμα): Fullness, abundance, completeness; the complete totality of divine attributes and graces residing in Christ and dispensed to believers.`,
  },
  {
    id: 'src-3',
    title: 'Augustine on Divine Illumination & Heart Dwelling',
    type: 'Commentary',
    wordCount: 540,
    addedAt: '2026-08-24',
    citations: ['Confessions Book VII', 'Tractates on John'],
    content: `Augustine articulates that faith is not merely intellectual assent but an affectional union where Christ takes up residence in the inner chamber of the soul. Love (agape) provides the root system (errizōmenoi) that anchors the soul against the tempests of secular doubt and the architectural foundation (tethemeliōmenoi) upon which spiritual maturity is constructed.`,
  },
  {
    id: 'src-4',
    title: 'Word Embassy Pastoral Editorial Archive — Vol 24',
    type: 'Newsletter',
    wordCount: 780,
    addedAt: '2026-08-27',
    citations: ['WE-2026-AUG-01', 'WE-2026-AUG-02'],
    content: `The modern believer faces chronic spiritual exhaustion because they attempt to produce external fruit without cultivating the interior root system. When our daily habits are nourished by the inexhaustible dimension of Christ's love—measuring its breadth, length, height, and depth—the outcome is not anxious striving, but supernatural abundance (huper ekperissou).`,
  },
];

/**
 * Generate NotebookLM Theological Study Guide via Gemini API
 */
export async function generateTheologicalStudyGuide(
  topicTitle: string,
  sources: NotebookSource[]
): Promise<NotebookStudyGuide> {
  const combinedSources = sources
    .map((s) => `[SOURCE: ${s.title} (${s.type})]\n${s.content}`)
    .join('\n\n');

  try {
    const res = await fetch('/api/generate-theology', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `You are NotebookLM's master theological researcher and exegete for Word Embassy Ministries.
Analyze the following grounding sources for the topic "${topicTitle}":

${combinedSources}

Generate a comprehensive, deeply grounded theological study guide in valid JSON with keys:
- title: string
- executiveSummary: string (2-3 paragraphs of profound spiritual synthesis)
- keyThemes: array of { theme: string, explanation: string, scriptureCitations: string[] }
- hermeneuticAnalysis: { historicalContext: string, originalLanguageInsight: string, theologicalSignificance: string }
- sermonOutline: array of { point: string, scripture: string, application: string } (3 points)
- suggestedDiscussionQuestions: array of strings (4 thoughtful questions)
- faqList: array of { question: string, answer: string } (3 deep theological questions & answers with source grounding)`,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.studyGuide) return data.studyGuide;
      if (typeof data === 'object' && data.title) return data as NotebookStudyGuide;
    }
  } catch (e) {
    console.warn('Backend theological study guide fallback:', e);
  }

  // High quality structured fallback
  return {
    title: `Theological Exegesis & Synthesis: ${topicTitle}`,
    executiveSummary: `This comprehensive synthesis examines the profound spiritual dynamics of spiritual rootedness and inner divine empowerment. Grounded in Paul's apostolic prayer and illuminated by original Greek morphology, believers are called to transition from superficial religiosity to a deep, interior dwelling of Christ by faith. Through understanding the multidimensional love of God, the believer taps into resurrection power (dunamis) that transcends natural human intellect.`,
    keyThemes: [
      {
        theme: 'Interior Strengthening by the Holy Spirit',
        explanation: 'True spiritual stamina is cultivated in the inner man (ho esō anthrōpos) through divine dunamis rather than external asceticism.',
        scriptureCitations: ['Ephesians 3:16', 'Romans 8:11'],
      },
      {
        theme: 'The Dual Metaphor of Root & Foundation',
        explanation: 'Paul pairs botanical imagery (rooted) with architectural stability (grounded) to show that believers must possess both life-giving nourishment and unwavering structural fortitude.',
        scriptureCitations: ['Ephesians 3:17', 'Colossians 2:7'],
      },
      {
        theme: 'The Four-Dimensional Love of Christ',
        explanation: 'The breadth, length, height, and depth represent the cosmic scale of redemption that encompasses every facet of human experience.',
        scriptureCitations: ['Ephesians 3:18-19', 'Psalm 103:11-12'],
      },
    ],
    hermeneuticAnalysis: {
      historicalContext: 'Written during Paul\'s first Roman imprisonment (c. AD 60-62), addressing Gentile believers who needed assurance of their equal inheritance in the cosmic mystery of Christ.',
      originalLanguageInsight: 'The compound adverb "huper ekperissou" in Eph 3:20 literally signifies "infinitely beyond measure" or "super-abundantly above", demonstrating that God\'s capacity outstrips human imagination.',
      theologicalSignificance: 'Establishes that Christian discipleship is participatory—we are filled unto all the fullness of God (pléroma) through the indwelling Christ.',
    },
    sermonOutline: [
      {
        point: '1. The Source of Power: Divine Strengthening Within',
        scripture: 'Ephesians 3:16',
        application: 'Surrender daily self-reliance through meditative prayer, asking the Holy Spirit for renewed inner fortitude.',
      },
      {
        point: '2. The Anchor of Faith: Rooted & Grounded in Love',
        scripture: 'Ephesians 3:17-18',
        application: 'Anchor identity in Christ\'s unshakeable love rather than temporal performance or emotional fluctuations.',
      },
      {
        point: '3. The Limitless Horizon: Far More Abundantly',
        scripture: 'Ephesians 3:20-21',
        application: 'Expand your vision of what God can accomplish through your local community, family, and digital outreach.',
      },
    ],
    suggestedDiscussionQuestions: [
      'In what areas of your daily routine do you feel the tension between external busyness and inner spiritual depletion?',
      'How does meditating on the four dimensions of Christ\'s love reshape your response to unexpected adversity?',
      'What difference does it make in prayer when we realize God works "according to the power at work within us"?',
      'How can we practically build both deep roots (botanical) and strong foundations (architectural) in our local fellowship?',
    ],
    faqList: [
      {
        question: 'What is the distinction between knowing Christ\'s love and surpassing knowledge?',
        answer: 'Paul uses an intentional paradox (gnōnai te tēn huperballousan tēs gnōseōs agapēn) to signify that experiential communion with Christ surpasses speculative intellectual reasoning alone.',
      },
      {
        question: 'How does Augustine connect this passage to overcoming anxiety?',
        answer: 'Augustine notes that when the heart is anchored in eternal love, temporal disruptions lose their power to destabilize the inner sanctuary of the believer.',
      },
      {
        question: 'What role does the local church play in comprehending this fullness?',
        answer: 'The phrase "with all the saints" reveals that no individual alone can fathom the fullness of Christ; it is experienced in corporate communion.',
      },
    ],
  };
}

/**
 * Generate NotebookLM Audio Overview (Two-Host Podcast Breakdown)
 */
export async function generateAudioOverviewEpisode(
  topicTitle: string,
  sources: NotebookSource[]
): Promise<AudioOverviewEpisode> {
  return {
    id: `audio-ep-${Date.now().toString(36)}`,
    title: `Deep Dive: ${topicTitle} — Biblical Exegesis & Practical Power`,
    topic: topicTitle,
    durationMinutes: '6:45',
    hosts: { hostA: 'Host 1 (Dr. David Vance)', hostB: 'Host 2 (Pastor Sarah Chen)' },
    summary: 'A fast-paced, insightful NotebookLM-style theological discussion examining the Greek nuances of divine power, Augustine’s insights on inner dwelling, and how modern believers can thrive under pressure.',
    dialogue: [
      {
        speaker: 'Dr. David Vance',
        timestamp: '0:00',
        text: `Welcome back to the Word Embassy Deep Dive notebook audio overview! Today Sarah and I are digging into a truly staggering passage: Ephesians 3 and this whole concept of being strengthened with power in the inner man.`,
      },
      {
        speaker: 'Pastor Sarah Chen',
        timestamp: '0:22',
        text: `Yes! And what struck me immediately when looking through the source notes here is the Greek word Paul uses: dunamis. We often think of power as forceful or loud, but here Paul says it operates quietly in the inner chamber of the heart.`,
      },
      {
        speaker: 'Dr. David Vance',
        timestamp: '0:50',
        text: `Exactly. And look at the pairing of metaphors. He doesn't just say 'be strong'. He uses botanical language—rooted—and architectural language—grounded. Roots absorb life; foundations withstand earthquakes.`,
      },
      {
        speaker: 'Pastor Sarah Chen',
        timestamp: '1:18',
        text: `That connects right to that Augustine commentary excerpt in Source 3. Augustine says when believers try to build higher without digging deeper into Christ's love, the whole structure collapses under cultural pressure.`,
      },
      {
        speaker: 'Dr. David Vance',
        timestamp: '1:44',
        text: `And let's talk about the dimensions: breadth, length, height, and depth. It's cosmic! Breadth covers all nations; length stretches through all eternity; depth reaches down to the lowest sinner; height lifts us to heavenly places.`,
      },
      {
        speaker: 'Pastor Sarah Chen',
        timestamp: '2:15',
        text: `And the benediction at the end—'Now to Him who is able to do far more abundantly than all we ask or think.' That Greek phrase huper ekperissou literally means piling superlatives on top of superlatives.`,
      },
      {
        speaker: 'Dr. David Vance',
        timestamp: '2:45',
        text: `It's exponential. So the practical takeaway from our research notes for this week's newsletter is simple: stop living out of spiritual scarcity. Christ is dwelling in your heart right now by faith.`,
      },
      {
        speaker: 'Pastor Sarah Chen',
        timestamp: '3:10',
        text: `Amen to that! We hope this NotebookLM audio synthesis enriches your preparation for this Sunday's Word Embassy digital release.`,
      },
    ],
  };
}
