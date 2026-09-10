import { BibleVerseItem } from '../types';

export interface ParsedScripture {
  book: string;
  chapter: string;
  verses: string;
  fullReference: string;
}

/**
 * Parses any standard Scripture string (e.g., "1 Corinthians 16:13-14", "Psalm 23: 1", "Psalm 23:1", "Philippians 4:6-7")
 * into its respective Book, Chapter, and Verse components.
 */
export function parseScriptureReference(reference?: string): ParsedScripture {
  if (!reference || typeof reference !== 'string') {
    return { book: 'Psalm', chapter: '23', verses: '1', fullReference: 'Psalm 23: 1' };
  }

  const clean = reference.trim();

  // Pattern: Optional book prefix number (1, 2, 3), Book Name, Chapter, and optional Verse range
  // Handles "Psalm 23: 1", "Psalm 23:1", "Psalm 23 : 1", "Psalm 23 v 1", "1 Corinthians 16:13-14"
  const match = clean.match(/^((?:[1-3]\s+)?[A-Za-z]+(?:\s+[A-Za-z]+)*)\s+(\d+)(?:\s*(?:[:,\.]|v(?:erse)?\.?)\s*([\d\s\-,\w]+))?/i);

  if (match) {
    const book = match[1].trim();
    const chapter = match[2].trim();
    const rawVerses = match[3] ? match[3].trim() : '1';
    // Clean up verse formatting
    const verses = rawVerses === '' ? '1' : rawVerses;
    return {
      book,
      chapter,
      verses,
      fullReference: clean,
    };
  }

  return {
    book: clean,
    chapter: '1',
    verses: '1',
    fullReference: clean,
  };
}

/**
 * Consistently formats a scripture citation with Bible Book, Chapter, and Verse(s)
 * e.g., "Psalm 23: 1", "1 Corinthians 16: 13-14"
 */
export function formatBibleCitation(
  reference?: string,
  book?: string,
  chapter?: string | number,
  verses?: string
): string {
  if (book && chapter !== undefined && chapter !== '') {
    const v = verses && verses !== 'Entire Chapter' && verses !== 'All' ? `: ${verses}` : '';
    return `${book} ${chapter}${v}`;
  }

  if (reference) {
    const parsed = parseScriptureReference(reference);
    if (parsed.book && parsed.chapter) {
      const v = parsed.verses && parsed.verses !== 'Entire Chapter' && parsed.verses !== 'All' ? `: ${parsed.verses}` : '';
      return `${parsed.book} ${parsed.chapter}${v}`;
    }
    return reference;
  }

  return 'Psalm 23: 1';
}

/**
 * Standard translations available for interactive preview
 */
export const BIBLE_TRANSLATIONS: Record<
  string,
  { name: string; abbreviation: string; description: string }
> = {
  NIV: {
    name: 'New International Version',
    abbreviation: 'NIV',
    description: 'Modern, balanced accuracy & clarity',
  },
  ESV: {
    name: 'English Standard Version',
    abbreviation: 'ESV',
    description: 'Essentially literal, word-for-word fidelity',
  },
  KJV: {
    name: 'King James Version',
    abbreviation: 'KJV',
    description: 'Majestic classic poetic English (1611)',
  },
  NLT: {
    name: 'New Living Translation',
    abbreviation: 'NLT',
    description: 'Warm, thought-for-thought devotional readability',
  },
  AMP: {
    name: 'Amplified Bible',
    abbreviation: 'AMP',
    description: 'Expanded shades of Hebrew and Greek meaning',
  },
};

/**
 * Pre-compiled parallel translations for core devotionals
 */
const KNOWN_PARALLEL_VERSES: Record<string, Record<string, string>> = {
  'Psalm 23: 1': {
    NIV: 'The Lord is my shepherd, I lack nothing.',
    ESV: 'The Lord is my shepherd; I shall not want.',
    KJV: 'The Lord is my shepherd; I shall not want.',
    NLT: 'The Lord is my shepherd; I have all that I need.',
    AMP: 'The Lord is my Shepherd [to feed, to guide and to shield me]; I shall not want.',
  },
  'Psalm 23:1': {
    NIV: 'The Lord is my shepherd, I lack nothing.',
    ESV: 'The Lord is my shepherd; I shall not want.',
    KJV: 'The Lord is my shepherd; I shall not want.',
    NLT: 'The Lord is my shepherd; I have all that I need.',
    AMP: 'The Lord is my Shepherd [to feed, to guide and to shield me]; I shall not want.',
  },
  'Psalm 23': {
    NIV: 'The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.',
    ESV: 'The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul.',
    KJV: 'The Lord is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul.',
    NLT: 'The Lord is my shepherd; I have all that I need. He lets me rest in green meadows; he leads me beside peaceful streams. He renews my strength.',
    AMP: 'The Lord is my Shepherd [to feed, to guide and to shield me]; I shall not want. He lets me lie down in green pastures; He leads me beside the still and quiet waters. He refreshes and restores my soul.',
  },
  '1 Corinthians 16:13-14': {
    NIV: 'Be on your guard; stand firm in the faith; be courageous; be strong. Do everything in love.',
    ESV: 'Be watchful, stand firm in the faith, act like men, be strong. Let all that you do be done in love.',
    KJV: 'Watch ye, stand fast in the faith, quit you like men, be strong. Let all your things be done with charity.',
    NLT: 'Be on guard. Stand firm in the faith. Be courageous. Be strong. And do everything with love.',
    AMP: 'Be on guard; stand firm in your faith [in God, respecting His precepts and keeping your confidence in Christ]; act like men and be courageous; be strong. Let all that you do be done in love [for God and man].',
  },
  'Philippians 4:6-7': {
    NIV: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.',
    ESV: 'Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.',
    KJV: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.',
    NLT: 'Don’t worry about anything; instead, pray about everything. Tell God what you need, and thank him for all he has done. Then you will experience God’s peace, which exceeds anything we can understand. His peace will guard your hearts and minds as you live in Christ Jesus.',
    AMP: 'Do not be anxious or worried about anything, but in everything [every circumstance and situation] by prayer and petition with thanksgiving, continue to make your [specific] requests known to God. And the peace of God [that peace which reassures the heart, that peace] which transcends all understanding, [that peace which] stands guard over your hearts and your minds in Christ Jesus [is yours].',
  },
  'Psalm 91:1-2': {
    NIV: 'Whoever dwells in the shelter of the Most High will rest in the shadow of the Almighty. I will say of the Lord, "He is my refuge and my fortress, my God, in whom I trust."',
    ESV: 'He who dwells in the shelter of the Most High will abide in the shadow of the Almighty. I will say to the Lord, "My refuge and my fortress, my God, in whom I trust."',
    KJV: 'He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty. I will say of the Lord, He is my refuge and my fortress: my God; in him will I trust.',
    NLT: 'Those who live in the shelter of the Most High will find rest in the shadow of the Almighty. This I declare about the Lord: He alone is my refuge, my place of safety; he is my God, and I trust him.',
    AMP: 'He who dwells in the shelter of the Most High will remain secure and rest in the shadow of the Almighty [whose power no enemy can withstand]. I will say of the Lord, “He is my refuge and my fortress, My God, in whom I trust [with great confidence, and on whom I rely]!”',
  },
  'Luke 18:1': {
    NIV: 'Then Jesus told his disciples a parable to show them that they should always pray and not give up.',
    ESV: 'And he told them a parable to the effect that they ought always to pray and not lose heart.',
    KJV: 'And he spake a parable unto them to this end, that men ought always to pray, and not to faint;',
    NLT: 'One day Jesus told his disciples a story to show that they should always pray and never give up.',
    AMP: 'Now Jesus was telling the disciples a parable to make the point that at all times they ought to pray and not give up and lose heart.',
  },
  '2 Corinthians 5:7': {
    NIV: 'For we live by faith, not by sight.',
    ESV: 'For we walk by faith, not by sight.',
    KJV: 'For we walk by faith, not by sight:',
    NLT: 'For we live by believing and not by seeing.',
    AMP: 'For we walk by faith, not by sight [living our lives in a manner consistent with our confident belief in God’s promises].',
  },
  'Ephesians 6:10-18': {
    NIV: 'Finally, be strong in the Lord and in his mighty power. Put on the full armor of God, so that you can take your stand against the devil’s schemes.',
    ESV: 'Finally, be strong in the Lord and in the strength of his might. Put on the whole armor of God, that you may be able to stand against the schemes of the devil.',
    KJV: 'Finally, my brethren, be strong in the Lord, and in the power of his might. Put on the whole armour of God, that ye may be able to stand against the wiles of the devil.',
    NLT: 'A final word: Be strong in the Lord and in his mighty power. Put on all of God’s armor so that you will be able to stand firm against all strategies of the devil.',
    AMP: 'In conclusion, be strong in the Lord [draw your strength from Him and be empowered through your union with Him] and in the power of His [boundless] might. Put on the full armor of God [for His precepts are like the splendid armor of a heavily-armed soldier], so that you may be able to stand up successfully against all the schemes and the strategies and the deceits of the devil.',
  },
  '1 Peter 5:7': {
    NIV: 'Cast all your anxiety on him because he cares for you.',
    ESV: 'Casting all your anxieties on him, because he cares for you.',
    KJV: 'Casting all your care upon him; for he careth for you.',
    NLT: 'Give all your worries and cares to God, for he cares about you.',
    AMP: 'Casting all your cares [all your anxieties, all your worries, and all your concerns, once and for all] on Him, for He cares about you [with deepest affection, and watches over you very carefully].',
  },
  'Romans 12:2': {
    NIV: 'Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God’s will is—his good, pleasing and perfect will.',
    ESV: 'Do not be conformed to this world, but be transformed by the renewal of your mind, that by testing you may discern what is the will of God, what is good and acceptable and perfect.',
    KJV: 'And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God.',
    NLT: 'Don’t copy the behavior and customs of this world, but let God transform you into a new person by changing the way you think. Then you will learn to know God’s will for you, which is good and pleasing and perfect.',
    AMP: 'And do not be conformed to this world [any longer with its superficial values and customs], but be transformed and progressively changed [as you mature spiritually] by the renewing of your mind [focusing on godly values and ethical attitudes], so that you may prove [for yourselves] what the will of God is, that which is good and acceptable and perfect [in His plan and purpose for you].',
  },
};

/**
 * Returns text for the requested translation
 */
export function getScriptureTranslation(
  reference: string,
  translationKey = 'NIV',
  fallbackText = ''
): string {
  const normRef = reference.trim();
  const translations = KNOWN_PARALLEL_VERSES[normRef];
  if (translations && translations[translationKey]) {
    return translations[translationKey];
  }
  return fallbackText;
}

/**
 * Splits verses intelligently into numbered items (e.g. verse 13 and verse 14)
 */
export function getVersesBreakdown(
  reference: string,
  fullText: string,
  existingBreakdown?: BibleVerseItem[]
): BibleVerseItem[] {
  if (existingBreakdown && existingBreakdown.length > 0) {
    return existingBreakdown;
  }

  const { verses } = parseScriptureReference(reference);

  // If verse has a range like "13-14", "6-7", "1-2"
  const rangeMatch = verses.match(/^(\d+)\s*-\s*(\d+)$/);
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1], 10);
    const end = parseInt(rangeMatch[2], 10);

    // If 2 verses, split text by sentences or punctuation
    if (end - start === 1) {
      // Split on sentence boundaries
      const parts = fullText
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter(Boolean);

      if (parts.length >= 2) {
        // First part to verse 1, remainder to verse 2
        return [
          { verseNumber: start, verseText: parts.slice(0, parts.length - 1).join(' ') },
          { verseNumber: end, verseText: parts[parts.length - 1] },
        ];
      }
    }

    // Specific known dual-verse text mappings
    if (reference.includes('1 Corinthians 16:13-14')) {
      return [
        {
          verseNumber: 13,
          verseText: 'Be on your guard; stand firm in the faith; be courageous; be strong.',
        },
        { verseNumber: 14, verseText: 'Do everything in love.' },
      ];
    }
    if (reference.includes('Philippians 4:6-7')) {
      return [
        {
          verseNumber: 6,
          verseText:
            'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.',
        },
        {
          verseNumber: 7,
          verseText:
            'And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.',
        },
      ];
    }
    if (reference.includes('Psalm 91:1-2')) {
      return [
        {
          verseNumber: 1,
          verseText:
            'Whoever dwells in the shelter of the Most High will rest in the shadow of the Almighty.',
        },
        {
          verseNumber: 2,
          verseText:
            'I will say of the Lord, "He is my refuge and my fortress, my God, in whom I trust."',
        },
      ];
    }
  }

  // Single verse or general fallback
  const singleMatch = verses.match(/^(\d+)/);
  const verseNum = singleMatch ? singleMatch[1] : verses;
  return [{ verseNumber: verseNum, verseText: fullText }];
}

/**
 * Historical, pastoral, and literary context for entire chapters
 */
const CHAPTER_CONTEXTS: Record<string, string> = {
  'Psalm 23':
    'Psalm 23 is King David’s immortal pastoral hymn of intimate trust, unwavering divine guidance, and sovereign provision. Composed from David’s own experience as a shepherd boy in the rugged hills of Bethlehem and his lifelong walk with God, the psalm opens in verse 1 with the profound covenant declaration: "The Lord is my shepherd; I lack nothing." Throughout the six verses, David reveals Jehovah-Raah (the Lord our Shepherd) who leads His sheep beside quiet waters of peace, restores weary souls, and guides in righteous paths. Even in the valley of the shadow of death, the Good Shepherd’s rod and staff bring comfort and total victory, culminating in an anointed banquet prepared before adversaries and goodness and mercy following the believer all the days of their life.',

  '1 Corinthians 16':
    'First Corinthians 16 serves as the Apostle Paul’s stirring apostolic conclusion to the Corinthian believers. After providing the majestic theological exposition of the resurrection in chapter 15, Paul transitions into concrete, day-to-day kingdom ministry. He instructs the church regarding collections for impoverished believers in Jerusalem, details his future travel plans with Timothy and Apollos, and issues the timeless five-fold spiritual charge in verses 13–14: to be watchful, spiritually anchored in faith, courageous under pressure, strengthened in the Holy Spirit, and entirely motivated by selfless Christlike love (agape).',

  'Philippians 4':
    'Philippians 4 is Paul’s epistle of supernatural joy and contentment penned from a Roman prison cell. In this closing chapter, Paul urges unity between Euodia and Syntyche, commands believers to "rejoice in the Lord always," and provides God’s sovereign prescription against crippling anxiety in verses 6–7: turning every concern into prayer, petition, and sincere thanksgiving. In return, God promises not merely external relief, but His garrison of supernatural peace to guard our hearts and minds in Christ Jesus.',

  'Psalm 91':
    'Psalm 91 is revered across church history as the "Psalm of the Secret Place" and the ultimate hymn of divine sanctuary. Opening with verses 1–2, the Psalmist declares that the believer who makes their permanent dwelling in the shelter of El Shaddai (the All-Sufficient One) rests beneath His wings. Throughout the chapter, the Lord promises supernatural protection from pestilence, terror by night, and arrows that fly by day, concluding with God’s prophetic covenant to rescue, honor, and satisfy the faithful with long life.',

  'Luke 18':
    'Luke 18 documents Jesus’ pivotal teachings on prayer, humility, and the nature of the Kingdom of God as He journeys toward Jerusalem. The chapter opens in verse 1 with Jesus stating the exact objective of His parable of the persistent widow: "that they should always pray and not give up." Jesus contrasts an unrighteous, selfish human judge with our compassionate, righteous Heavenly Father who hastens to hear His elect.',

  '2 Corinthians 5':
    'Second Corinthians 5 addresses the eternal hope of our heavenly dwelling and our spiritual ambassadorship on earth. In verse 7, Paul provides the defining axiom of Christian discipleship: "we walk by faith, not by sight." Paul explains that while our mortal bodies may experience groaning and trial, believers look past temporary, visible circumstances to eternal, spiritual realities, walking as reconciled new creations in Christ.',

  'Ephesians 6':
    'Ephesians 6 forms the culmination of Paul’s letter to the church at Ephesus, moving from household relationships to the realities of spiritual warfare. Verses 10–18 reveal that believers do not wrestle against flesh and blood, but against spiritual wickedness. Paul commands Christians to be strong in the Lord and put on the whole armor of God—the belt of truth, breastplate of righteousness, shoes of peace, shield of faith, helmet of salvation, and sword of the Spirit which is God’s Word.',

  '1 Peter 5':
    'First Peter 5 provides pastoral guidance for elders and persecuted believers throughout Asia Minor. Peter instructs the flock to clothe themselves with humility before God, promising that He lifts up the humble in due time. Verse 7 gives the warm invitation to cast every anxiety upon the Lord because He cares deeply and tenderly for His children.',

  'Romans 12':
    'Romans 12 marks the great practical shift in Paul’s theology from doctrinal salvation to Spirit-empowered Christian living. In light of God’s mercies, believers are commanded in verse 2 not to be conformed to the transient patterns of this fallen world, but to be radically transformed by the renewing of their minds, discerning and walking in God’s good, pleasing, and perfect will.',
};

/**
 * Returns rich chapter context for study
 */
export function getChapterContext(book: string, chapter: string | number): string {
  const key = `${book.trim()} ${chapter}`.trim();
  if (CHAPTER_CONTEXTS[key]) {
    return CHAPTER_CONTEXTS[key];
  }
  return `${book} Chapter ${chapter} provides foundational biblical wisdom for the believer's walk with God. Meditating on the surrounding verses illuminates the author's primary theological theme and empowers daily Christian discipleship.`;
}

/**
 * Generates direct verified links to leading Bible study resources for the chapter and verses
 */
export function getBibleStudyLinks(
  book: string,
  chapter: string | number,
  verses?: string,
  translation = 'NIV'
) {
  const queryWithVerses = verses && verses !== 'Entire Chapter' ? `${book} ${chapter}:${verses}` : `${book} ${chapter}`;
  const chapterOnly = `${book} ${chapter}`;

  return {
    // 1. Bible Gateway (Passage View)
    bibleGatewayPassageUrl: `https://www.biblegateway.com/passage/?search=${encodeURIComponent(queryWithVerses)}&version=${translation}`,
    bibleGatewayChapterUrl: `https://www.biblegateway.com/passage/?search=${encodeURIComponent(chapterOnly)}&version=${translation}`,

    // 2. YouVersion Bible App / Web Reader
    youVersionUrl: `https://www.bible.com/search/bible?q=${encodeURIComponent(queryWithVerses)}`,

    // 3. Blue Letter Bible (Exegesis, Strong's Concordance, Greek/Hebrew)
    blueLetterBibleUrl: `https://www.blueletterbible.org/search/search.cfm?Criteria=${encodeURIComponent(queryWithVerses)}`,

    // 4. Bible Hub (Parallel Translations & Interlinear)
    bibleHubUrl: `https://biblehub.com/${encodeURIComponent(book.toLowerCase().replace(/\s+/g, '_'))}/${chapter}-${verses ? verses.split('-')[0].trim() : '1'}.htm`,
  };
}
