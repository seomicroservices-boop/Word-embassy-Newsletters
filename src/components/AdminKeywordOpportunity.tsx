import React, { useState, useMemo } from 'react';
import {
  Target,
  TrendingUp,
  Search,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Plus,
  ArrowRight,
  BookOpen,
  Filter,
  Download,
  ExternalLink,
  Layers,
  Lightbulb,
  Check,
  ChevronRight,
  Zap,
  Flame,
  Shield,
  Heart,
  Compass,
  DollarSign,
  HelpCircle,
  Copy,
  BarChart2,
  CalendarPlus,
  CheckCheck,
  LayoutDashboard,
  Grid,
  Columns,
  Maximize2,
  ArrowUpRight,
  SlidersHorizontal,
  Info,
  Loader2,
} from 'lucide-react';
import { Topic, Newsletter, NewsletterEdition } from '../types';

export interface KeywordOpportunityItem {
  id: string;
  keyword: string;
  monthlyVolume: number;
  difficulty: number; // 0-100
  intent: 'Devotional' | 'Exegesis' | 'Prayer Guide' | 'Scripture Study';
  cluster:
    | 'Divine Healing & Wholeness'
    | 'Divine Protection & Warfare'
    | 'Anxiety, Peace & Mental Rest'
    | 'Persistent Prayer & Intercession'
    | 'Faith, Doubt & Mountain Moving'
    | 'Guidance, Purpose & God’s Will'
    | 'Covenant Provision & Stewardship'
    | 'Grace, Forgiveness & Freedom';
  anchorScripture: string;
  bibleBook: string;
  bibleChapter: string;
  bibleVerses: string;
  recommendedEdition: NewsletterEdition;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  topicalRationale: string;
  suggestedTopicTitle: string;
  suggestedEditorialAngle: string;
  suggestedMetaDescription: string;
  isCustom?: boolean;
}

// Curated high-intent Christian & Biblical search queries with genuine monthly search demand
export const INITIAL_KEYWORD_OPPORTUNITIES: KeywordOpportunityItem[] = [
  // 1. Divine Healing & Wholeness (High Search Volume - Currently 0 in topics = CRITICAL GAP)
  {
    id: 'kw-healing-01',
    keyword: 'healing scriptures in the bible',
    monthlyVolume: 40500,
    difficulty: 36,
    intent: 'Scripture Study',
    cluster: 'Divine Healing & Wholeness',
    anchorScripture: 'Isaiah 53:5',
    bibleBook: 'Isaiah',
    bibleChapter: '53',
    bibleVerses: '5',
    recommendedEdition: 'WEEKLY_EXEGESIS',
    priority: 'HIGH',
    topicalRationale:
      'Massive search volume (40.5k/mo) with high devotional intent. Current library has zero topics covering physical or emotional healing through the atonement.',
    suggestedTopicTitle: 'By His Stripes: Healing Scriptures in the Bible and the Finished Work of Christ',
    suggestedEditorialAngle:
      'Exposition of Isaiah 53:4-5 and 1 Peter 2:24. Provide 7 core healing scriptures, the Hebrew meaning of "rapha" and "chaburah", and practical prayers of faith.',
    suggestedMetaDescription:
      'Discover foundational healing scriptures in the Bible with deep verse exposition on Isaiah 53:5. Learn how Christ’s finished work releases divine wholeness.',
  },
  {
    id: 'kw-healing-02',
    keyword: 'prayers for healing the sick',
    monthlyVolume: 33100,
    difficulty: 32,
    intent: 'Prayer Guide',
    cluster: 'Divine Healing & Wholeness',
    anchorScripture: 'James 5:14-15',
    bibleBook: 'James',
    bibleChapter: '5',
    bibleVerses: '14-15',
    recommendedEdition: 'DAILY_DEVOTIONAL',
    priority: 'HIGH',
    topicalRationale:
      'High-intent practical prayer search. Readers facing sickness search for scripture-grounded prayers with authority.',
    suggestedTopicTitle: 'The Prayer of Faith: Scriptural Prayers for Healing the Sick',
    suggestedEditorialAngle:
      'Focus on James 5:14-16 and anointing with oil. Include 3 printable/copyable healing prayer declarations for family members and personal illness.',
    suggestedMetaDescription:
      'Scripture-grounded prayers for healing the sick based on James 5:14-15. Speak God’s promises with faith, spiritual authority, and peace.',
  },
  {
    id: 'kw-healing-03',
    keyword: 'psalm 103 healing scriptures and benefits',
    monthlyVolume: 12400,
    difficulty: 22,
    intent: 'Devotional',
    cluster: 'Divine Healing & Wholeness',
    anchorScripture: 'Psalm 103:2-3',
    bibleBook: 'Psalm',
    bibleChapter: '103',
    bibleVerses: '2-3',
    recommendedEdition: 'DAILY_DEVOTIONAL',
    priority: 'MEDIUM',
    topicalRationale:
      'Low competition (KD 22) with strong devotional search volume. High conversion for daily email readers.',
    suggestedTopicTitle: 'Forget Not His Benefits: Psalm 103 Healing Scriptures & Covenant Mercy',
    suggestedEditorialAngle:
      'Davidic meditation on forgiving iniquities and healing all diseases. Encourages daily thanksgiving to anchor faith.',
    suggestedMetaDescription:
      'Meditate on Psalm 103:2-3 and explore God’s covenant benefits. Discover how remembering His mercies unlocks healing and spiritual renewal.',
  },

  // 2. Anxiety, Peace & Mental Rest
  {
    id: 'kw-anxiety-01',
    keyword: 'bible verses for anxiety',
    monthlyVolume: 49500,
    difficulty: 38,
    intent: 'Scripture Study',
    cluster: 'Anxiety, Peace & Mental Rest',
    anchorScripture: 'Philippians 4:6-7',
    bibleBook: 'Philippians',
    bibleChapter: '4',
    bibleVerses: '6-7',
    recommendedEdition: 'WEEKLY_EXEGESIS',
    priority: 'HIGH',
    topicalRationale:
      'Existing TOPIC-004 covers Phil 4:6-7 ("The Peace That Surpasses All Understanding"), but omits the #1 target search query "bible verses for anxiety" in title and headline.',
    suggestedTopicTitle: 'The Peace That Surpasses Understanding: 7 Bible Verses for Anxiety and Fear',
    suggestedEditorialAngle:
      'Optimize the existing Philippians 4 exegesis by framing it around the exact search phrase. Add structured Greek insights on "merimnate" (anxious dividing of mind).',
    suggestedMetaDescription:
      'Explore key Bible verses for anxiety with Paul’s teaching in Philippians 4:6-7. Learn how heartfelt prayer and thanksgiving replace panic with divine peace.',
  },
  {
    id: 'kw-anxiety-02',
    keyword: 'peace that surpasses all understanding',
    monthlyVolume: 27100,
    difficulty: 29,
    intent: 'Devotional',
    cluster: 'Anxiety, Peace & Mental Rest',
    anchorScripture: 'Philippians 4:6-7',
    bibleBook: 'Philippians',
    bibleChapter: '4',
    bibleVerses: '6-7',
    recommendedEdition: 'DAILY_DEVOTIONAL',
    priority: 'HIGH',
    topicalRationale:
      'Strongly covered by TOPIC-004 / NL-2026-PHIL4. Retain and cross-link with companion studies.',
    suggestedTopicTitle: 'The Peace That Surpasses All Understanding',
    suggestedEditorialAngle:
      'Deepen devotional application on guarded hearts and minds in Christ Jesus.',
    suggestedMetaDescription:
      'Experience the peace that surpasses all understanding from Philippians 4:6-7. Practical steps to guard your heart and mind through Christ.',
  },
  {
    id: 'kw-anxiety-03',
    keyword: 'scriptures for peace of mind',
    monthlyVolume: 16400,
    difficulty: 31,
    intent: 'Devotional',
    cluster: 'Anxiety, Peace & Mental Rest',
    anchorScripture: 'John 14:27',
    bibleBook: 'John',
    bibleChapter: '14',
    bibleVerses: '27',
    recommendedEdition: 'DAILY_DEVOTIONAL',
    priority: 'MEDIUM',
    topicalRationale:
      'High search interest around mental rest and sleep anxiety. Jesus’ promise "My peace I give to you" is currently missing as a dedicated topic.',
    suggestedTopicTitle: 'Not as the World Gives: Powerful Scriptures for Peace of Mind',
    suggestedEditorialAngle:
      'Exposition of John 14:27 contrasted with modern stress culture. Differentiate worldly tranquility from Christ’s supernatural peace.',
    suggestedMetaDescription:
      'Find restful sleep and mental clarity with scriptures for peace of mind centered on John 14:27. Release racing thoughts into God’s gentle care.',
  },
  {
    id: 'kw-anxiety-04',
    keyword: 'casting all your cares upon him',
    monthlyVolume: 9900,
    difficulty: 22,
    intent: 'Devotional',
    cluster: 'Anxiety, Peace & Mental Rest',
    anchorScripture: '1 Peter 5:7',
    bibleBook: '1 Peter',
    bibleChapter: '5',
    bibleVerses: '7',
    recommendedEdition: 'DAILY_DEVOTIONAL',
    priority: 'MEDIUM',
    topicalRationale:
      'Already in editorial calendar as TOPIC-006. High authority opportunity with low KD.',
    suggestedTopicTitle: 'Casting All Your Cares Upon Him',
    suggestedEditorialAngle:
      'Explore the Greek verb "epiripto" (hurling a burden off one’s back onto God).',
    suggestedMetaDescription:
      'Learn what it means to cast all your care upon God from 1 Peter 5:7. A reassuring daily devotional on trusting His tender fatherly care.',
  },

  // 3. Divine Protection & Spiritual Warfare
  {
    id: 'kw-prot-01',
    keyword: 'psalm 91 prayer for protection',
    monthlyVolume: 22200,
    difficulty: 26,
    intent: 'Prayer Guide',
    cluster: 'Divine Protection & Warfare',
    anchorScripture: 'Psalm 91:1-4',
    bibleBook: 'Psalm',
    bibleChapter: '91',
    bibleVerses: '1-4',
    recommendedEdition: 'WEEKLY_EXEGESIS',
    priority: 'HIGH',
    topicalRationale:
      'Covered in TOPIC-003 / NL-2026-PSALM91, but existing title is "Divine Protection: Abiding in the Secret Place". Suggest revising title or subhead to target the 22.2k/mo query "Psalm 91 prayer for protection".',
    suggestedTopicTitle: 'Abiding in the Secret Place: Psalm 91 Prayer for Protection & Refuge',
    suggestedEditorialAngle:
      'Maintain the rich exegesis of Elyon and Shaddai while highlighting the morning/evening prayer protection declarations that readers actively search for.',
    suggestedMetaDescription:
      'Deep devotional exegesis and daily Psalm 91 prayer for protection. Dwell under the shadow of the Almighty and walk in fearless divine safety.',
  },
  {
    id: 'kw-prot-02',
    keyword: 'armor of god devotional',
    monthlyVolume: 14800,
    difficulty: 28,
    intent: 'Scripture Study',
    cluster: 'Divine Protection & Warfare',
    anchorScripture: 'Ephesians 6:10-18',
    bibleBook: 'Ephesians',
    bibleChapter: '6',
    bibleVerses: '10-18',
    recommendedEdition: 'WEEKLY_EXEGESIS',
    priority: 'HIGH',
    topicalRationale:
      'TOPIC-005 exists as "The Armor of God in Daily Battles". Can be revised slightly to capture the exact phrase "Armor of God Devotional".',
    suggestedTopicTitle: 'Standing Firm in Battle: Complete Armor of God Devotional & Study Guide',
    suggestedEditorialAngle:
      'Expository breakdown of Roman soldier weaponry vs. spiritual realities (truth, righteousness, peace, faith, salvation, Word of God).',
    suggestedMetaDescription:
      'Equip your spirit with this in-depth Armor of God devotional from Ephesians 6:10-18. Practical spiritual warfare insights for daily victory.',
  },
  {
    id: 'kw-prot-03',
    keyword: 'spiritual warfare prayers for victory',
    monthlyVolume: 18100,
    difficulty: 35,
    intent: 'Prayer Guide',
    cluster: 'Divine Protection & Warfare',
    anchorScripture: '2 Corinthians 10:4-5',
    bibleBook: '2 Corinthians',
    bibleChapter: '10',
    bibleVerses: '4-5',
    recommendedEdition: 'WEEKLY_EXEGESIS',
    priority: 'HIGH',
    topicalRationale:
      'Missing topic. High search volume for casting down strongholds and pulling down demonic resistance with spiritual weapons.',
    suggestedTopicTitle: 'Mighty Through God: Spiritual Warfare Prayers for Victory & Pulling Down Strongholds',
    suggestedEditorialAngle:
      'Exposition of 2 Corinthians 10:3-5. Teach on the nature of spiritual weapons (prayer, fasting, Scripture declaration, blood of the Lamb).',
    suggestedMetaDescription:
      'Learn how to take every thought captive with spiritual warfare prayers for victory based on 2 Corinthians 10:4-5. Break free from fear and bondage.',
  },

  // 4. Guidance, Purpose & God’s Will (CRITICAL GAP)
  {
    id: 'kw-guide-01',
    keyword: 'jeremiah 29 11 meaning and devotional',
    monthlyVolume: 36000,
    difficulty: 30,
    intent: 'Exegesis',
    cluster: 'Guidance, Purpose & God’s Will',
    anchorScripture: 'Jeremiah 29:11',
    bibleBook: 'Jeremiah',
    bibleChapter: '29',
    bibleVerses: '11',
    recommendedEdition: 'WEEKLY_EXEGESIS',
    priority: 'HIGH',
    topicalRationale:
      'One of the most searched verses on Google (36k/mo). The library currently has ZERO devotionals or exegesis covering Jeremiah 29:11.',
    suggestedTopicTitle: 'Plans to Prosper You: Jeremiah 29:11 Meaning, Context & Devotional Hope',
    suggestedEditorialAngle:
      'Historical context of Babylonian exile. Rebut shallow "prosperity gospel" takes while upholding genuine prophetic comfort for believers in distress.',
    suggestedMetaDescription:
      'Discover the true Jeremiah 29:11 meaning and biblical context. Gain renewed hope and theological depth on God’s good plans for your future.',
  },
  {
    id: 'kw-guide-02',
    keyword: 'how to hear god’s voice clearly',
    monthlyVolume: 22500,
    difficulty: 33,
    intent: 'Scripture Study',
    cluster: 'Guidance, Purpose & God’s Will',
    anchorScripture: 'John 10:27',
    bibleBook: 'John',
    bibleChapter: '10',
    bibleVerses: '27',
    recommendedEdition: 'WEEKLY_EXEGESIS',
    priority: 'HIGH',
    topicalRationale:
      'Massive search volume among young adults and leaders seeking discernment and directional clarity.',
    suggestedTopicTitle: 'My Sheep Hear My Voice: How to Hear God’s Voice Clearly in Daily Life',
    suggestedEditorialAngle:
      'Jesus as Good Shepherd in John 10:27. Biblical filters for testing impressions against Scripture, inner peace, and godly counsel.',
    suggestedMetaDescription:
      'Learn how to hear God’s voice clearly through Scripture, prayer, and the Holy Spirit’s whisper. Practical discernment grounded in John 10:27.',
  },
  {
    id: 'kw-guide-03',
    keyword: 'trust in the lord with all your heart devotional',
    monthlyVolume: 18900,
    difficulty: 26,
    intent: 'Devotional',
    cluster: 'Guidance, Purpose & God’s Will',
    anchorScripture: 'Proverbs 3:5-6',
    bibleBook: 'Proverbs',
    bibleChapter: '3',
    bibleVerses: '5-6',
    recommendedEdition: 'DAILY_DEVOTIONAL',
    priority: 'HIGH',
    topicalRationale:
      'High-intent classic verse. Complete gap in current active topics.',
    suggestedTopicTitle: 'Trust in the Lord with All Your Heart: Devotional Guide on Proverbs 3:5-6',
    suggestedEditorialAngle:
      'Address the danger of "leaning on your own understanding". How acknowledging God in all ways leads to straight paths.',
    suggestedMetaDescription:
      'Deep daily devotional on Proverbs 3:5-6. Discover how leaning on God rather than human understanding brings clarity and straight paths.',
  },
  {
    id: 'kw-guide-04',
    keyword: 'god’s purpose for your life scriptures',
    monthlyVolume: 16100,
    difficulty: 31,
    intent: 'Scripture Study',
    cluster: 'Guidance, Purpose & God’s Will',
    anchorScripture: 'Romans 8:28',
    bibleBook: 'Romans',
    bibleChapter: '8',
    bibleVerses: '28',
    recommendedEdition: 'WEEKLY_EXEGESIS',
    priority: 'MEDIUM',
    topicalRationale:
      'Addresses existential searches and vocational anxiety. Strong fit for a Monday weekly exegesis.',
    suggestedTopicTitle: 'Called According to His Purpose: Key Scriptures on Finding God’s Will',
    suggestedEditorialAngle:
      'Exposition of Romans 8:28-30. How God weaves both triumphs and trials together for eternal good.',
    suggestedMetaDescription:
      'Discover key scriptures on God’s purpose for your life based on Romans 8:28. How God works all things together for those who love Him.',
  },

  // 5. Persistent Prayer & Intercession
  {
    id: 'kw-prayer-01',
    keyword: 'the power of persistent prayer',
    monthlyVolume: 14200,
    difficulty: 23,
    intent: 'Devotional',
    cluster: 'Persistent Prayer & Intercession',
    anchorScripture: 'Luke 18:1',
    bibleBook: 'Luke',
    bibleChapter: '18',
    bibleVerses: '1',
    recommendedEdition: 'WEEKLY_EXEGESIS',
    priority: 'HIGH',
    topicalRationale:
      'Covered by TOPIC-001 / NL-2026-PRAYER. Current title matches the target keyword directly!',
    suggestedTopicTitle: 'The Power of Persistent Prayer',
    suggestedEditorialAngle:
      'Maintain strong internal links and ensure canonical tag is set to the primary newsletter slug.',
    suggestedMetaDescription:
      'Exposition of Jesus’ parable of the persistent widow in Luke 18:1-8. Discover why persistent prayer strengthens faith.',
  },
  {
    id: 'kw-prayer-02',
    keyword: 'how to pray without ceasing',
    monthlyVolume: 12100,
    difficulty: 29,
    intent: 'Scripture Study',
    cluster: 'Persistent Prayer & Intercession',
    anchorScripture: '1 Thessalonians 5:17',
    bibleBook: '1 Thessalonians',
    bibleChapter: '5',
    bibleVerses: '17',
    recommendedEdition: 'DAILY_DEVOTIONAL',
    priority: 'MEDIUM',
    topicalRationale:
      'Common question believers struggle with: How do you pray continuously while working or studying?',
    suggestedTopicTitle: 'Pray Without Ceasing: Practical Ways to Walk in Continual Fellowship with God',
    suggestedEditorialAngle:
      'Explain prayer as an ongoing conversational posture rather than a rigid physical pose. 1 Thess 5:16-18 context.',
    suggestedMetaDescription:
      'Practical guide on how to pray without ceasing from 1 Thessalonians 5:17. Cultivate unbroken communion with the Holy Spirit throughout your day.',
  },
  {
    id: 'kw-prayer-03',
    keyword: 'the lord’s prayer meaning and breakdown',
    monthlyVolume: 27400,
    difficulty: 39,
    intent: 'Exegesis',
    cluster: 'Persistent Prayer & Intercession',
    anchorScripture: 'Matthew 6:9-13',
    bibleBook: 'Matthew',
    bibleChapter: '6',
    bibleVerses: '9-13',
    recommendedEdition: 'WEEKLY_EXEGESIS',
    priority: 'HIGH',
    topicalRationale:
      'Massive foundational search volume. Completely absent from existing topics.',
    suggestedTopicTitle: 'Our Father in Heaven: Complete Lord’s Prayer Meaning, Greek Breakdown & Pattern',
    suggestedEditorialAngle:
      'Expository line-by-line breakdown of Matthew 6:9-13. Teach how Jesus intended this as a theological blueprint, not mindless repetition.',
    suggestedMetaDescription:
      'Deep theological exposition of the Lord’s Prayer in Matthew 6:9-13 with Greek insights. Learn Jesus’ model for worship, daily provision, and forgiveness.',
  },

  // 6. Faith, Doubt & Mountain Moving
  {
    id: 'kw-faith-01',
    keyword: 'walking by faith and not by sight',
    monthlyVolume: 24000,
    difficulty: 25,
    intent: 'Devotional',
    cluster: 'Faith, Doubt & Mountain Moving',
    anchorScripture: '2 Corinthians 5:7',
    bibleBook: '2 Corinthians',
    bibleChapter: '5',
    bibleVerses: '7',
    recommendedEdition: 'DAILY_DEVOTIONAL',
    priority: 'HIGH',
    topicalRationale:
      'Covered in TOPIC-002 / NL-2026-FAITH. Title is currently "Walking by Faith When You Cannot See the Way". Slightly revising to include the exact phrase "Walking by Faith and Not by Sight" increases organic CTR.',
    suggestedTopicTitle: 'Walking by Faith and Not by Sight: Trusting God When the Path Is Unclear',
    suggestedEditorialAngle:
      'Reinforce Paul’s 2 Cor 5:7 message. Include practical exercises for stepping forward in obedience before physical feelings align.',
    suggestedMetaDescription:
      'Inspirational daily devotional on 2 Corinthians 5:7. Learn what it truly means to walk by faith and not by sight during seasons of uncertainty.',
  },
  {
    id: 'kw-faith-02',
    keyword: 'how to increase your faith in god',
    monthlyVolume: 15300,
    difficulty: 27,
    intent: 'Scripture Study',
    cluster: 'Faith, Doubt & Mountain Moving',
    anchorScripture: 'Romans 10:17',
    bibleBook: 'Romans',
    bibleChapter: '10',
    bibleVerses: '17',
    recommendedEdition: 'DAILY_DEVOTIONAL',
    priority: 'HIGH',
    topicalRationale:
      'Frequent pastoral question and high search volume. Missing from current editorial calendar.',
    suggestedTopicTitle: 'Faith Comes by Hearing: Practical Biblical Steps to Increase Your Faith',
    suggestedEditorialAngle:
      'Focus on Romans 10:17 (faith comes by hearing the Rhema of God). Practical guide to soaking in scripture and speaking God’s promises.',
    suggestedMetaDescription:
      'Discover how to increase your faith in God according to Romans 10:17. Biblical principles and spiritual habits that build immovable trust.',
  },
  {
    id: 'kw-faith-03',
    keyword: 'overcoming doubt in the bible',
    monthlyVolume: 7600,
    difficulty: 20,
    intent: 'Devotional',
    cluster: 'Faith, Doubt & Mountain Moving',
    anchorScripture: 'James 1:6',
    bibleBook: 'James',
    bibleChapter: '1',
    bibleVerses: '6',
    recommendedEdition: 'DAILY_DEVOTIONAL',
    priority: 'MEDIUM',
    topicalRationale:
      'Very low difficulty (KD 20) makes it an easy rank for topical authority. High empathy appeal to struggling believers.',
    suggestedTopicTitle: 'Anchor for the Double-Minded: Overcoming Doubt Through God’s Promises',
    suggestedEditorialAngle:
      'Examine James 1:6-8 and the father of the possessed child in Mark 9:24 ("Lord, I believe; help my unbelief!"). Honest pastoral encouragement.',
    suggestedMetaDescription:
      'Struggling with spiritual uncertainty? Learn biblical principles for overcoming doubt based on James 1:6 and Mark 9:24.',
  },

  // 7. Covenant Provision & Stewardship
  {
    id: 'kw-prov-01',
    keyword: 'the lord is my shepherd i shall not want devotional',
    monthlyVolume: 28200,
    difficulty: 28,
    intent: 'Devotional',
    cluster: 'Covenant Provision & Stewardship',
    anchorScripture: 'Psalm 23: 1',
    bibleBook: 'Psalm',
    bibleChapter: '23',
    bibleVerses: '1',
    recommendedEdition: 'DAILY_DEVOTIONAL',
    priority: 'HIGH',
    topicalRationale:
      'Covered in TOPIC-010 / NL-2026-PSALM23. High topical authority item.',
    suggestedTopicTitle: 'The Lord Is My Shepherd: Resting in Divine Provision (Psalm 23:1)',
    suggestedEditorialAngle:
      'Yahweh Rohi exegesis. Reassurance against inflation, scarcity, and fear of lack.',
    suggestedMetaDescription:
      'Meditate on Psalm 23:1: The Lord is my shepherd; I shall not want. Discover God’s covenant promise of abundance and rest.',
  },
  {
    id: 'kw-prov-02',
    keyword: 'god will provide all your needs scripture and devotional',
    monthlyVolume: 16800,
    difficulty: 24,
    intent: 'Devotional',
    cluster: 'Covenant Provision & Stewardship',
    anchorScripture: 'Philippians 4:19',
    bibleBook: 'Philippians',
    bibleChapter: '4',
    bibleVerses: '19',
    recommendedEdition: 'DAILY_DEVOTIONAL',
    priority: 'HIGH',
    topicalRationale:
      'Major search query during economic hardship. Completely unaddressed in current topics.',
    suggestedTopicTitle: 'According to His Riches in Glory: God Will Provide All Your Needs (Phil 4:19)',
    suggestedEditorialAngle:
      'Exposition of Philippians 4:19 in context of the Philippian church’s sacrificial generosity. God’s inexhaustible heavenly treasury.',
    suggestedMetaDescription:
      'Stand firm on Philippians 4:19: God will provide all your needs according to His riches in glory. Reassurance for every financial and spiritual need.',
  },

  // 8. Grace, Forgiveness & Freedom
  {
    id: 'kw-grace-01',
    keyword: 'there is therefore now no condemnation devotional',
    monthlyVolume: 15600,
    difficulty: 22,
    intent: 'Devotional',
    cluster: 'Grace, Forgiveness & Freedom',
    anchorScripture: 'Romans 8:1',
    bibleBook: 'Romans',
    bibleChapter: '8',
    bibleVerses: '1',
    recommendedEdition: 'DAILY_DEVOTIONAL',
    priority: 'HIGH',
    topicalRationale:
      'TOPIC-008 is drafted as "Grace for Today: Living Free from Condemnation". We can optimize the title to include the exact target phrase "No Condemnation in Christ Jesus".',
    suggestedTopicTitle: 'No Condemnation in Christ Jesus: Living Free Through Grace (Romans 8:1)',
    suggestedEditorialAngle:
      'Exposition of "katakrima" (judicial condemnation cancelled). Teach believers how to defeat the accuser of the brethren.',
    suggestedMetaDescription:
      'Experience the freedom of Romans 8:1: There is now no condemnation for those in Christ Jesus. Break free from religious guilt and walk in sons’ grace.',
  },
  {
    id: 'kw-grace-02',
    keyword: 'how to forgive someone who hurt you biblically',
    monthlyVolume: 19800,
    difficulty: 35,
    intent: 'Scripture Study',
    cluster: 'Grace, Forgiveness & Freedom',
    anchorScripture: 'Colossians 3:13',
    bibleBook: 'Colossians',
    bibleChapter: '3',
    bibleVerses: '13',
    recommendedEdition: 'WEEKLY_EXEGESIS',
    priority: 'HIGH',
    topicalRationale:
      'Deep relational search intent. Huge gap in current topics; perfect for a deep exegesis on agape and reconciliation.',
    suggestedTopicTitle: 'Bearing with One Another: How to Forgive Someone Who Hurt You Biblically',
    suggestedEditorialAngle:
      'Colossians 3:12-14 and Ephesians 4:32. Distinguish forgiveness from boundaryless reconciliation while releasing bitterness.',
    suggestedMetaDescription:
      'Biblical guidance on how to forgive someone who hurt you deeply based on Colossians 3:13. Find emotional freedom and healing through Christ’s mercy.',
  },
];

export const CHRISTIAN_MINISTRY_KEYWORDS = INITIAL_KEYWORD_OPPORTUNITIES;

export type CoverageStatus = 'COVERED' | 'UNDER_OPTIMIZED' | 'GAP';

export interface KeywordAnalysisResult {
  opportunity: KeywordOpportunityItem;
  status: CoverageStatus;
  matchedTopic?: Topic;
  matchedNewsletter?: Newsletter;
  matchScore: number; // 0-100
  matchNotes: string;
  revisionSuggestion?: {
    originalTitle: string;
    suggestedTitle: string;
    seoAdvantage: string;
  };
}

interface AdminKeywordOpportunityProps {
  topics: Topic[];
  newsletters: Newsletter[];
  onAddTopic: (topicData: any) => void;
  onUpdateTopic: (id: string, updates: Partial<Topic>) => void;
  onUpdateNewsletter: (id: string, updates: Partial<Newsletter>) => void;
  onGenerateSpecificTopic?: (topic: Topic) => Promise<void>;
  isProcessing?: boolean;
  onNavigateToTopicTab?: () => void;
  onNavigateToNewsletterTab?: () => void;
  onNavigateToSeoTab?: () => void;
}

export const AdminKeywordOpportunity: React.FC<AdminKeywordOpportunityProps> = ({
  topics,
  newsletters,
  onAddTopic,
  onUpdateTopic,
  onUpdateNewsletter,
  onGenerateSpecificTopic,
  isProcessing = false,
  onNavigateToTopicTab,
  onNavigateToNewsletterTab,
  onNavigateToSeoTab,
}) => {
  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | CoverageStatus>('ALL');
  const [sortBy, setSortBy] = useState<'volume' | 'difficulty' | 'status' | 'cluster'>('volume');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // View Mode: 'table' (Mapping Table & Coverage Gaps) | 'matrix' (Visual Quadrant & Radar) | 'alignment' (Topic Alignment Canvas)
  const [viewMode, setViewMode] = useState<'table' | 'matrix' | 'alignment'>('table');
  // Selected Matrix Node for Interactive Quadrant Chart
  const [selectedMatrixId, setSelectedMatrixId] = useState<string | null>(null);
  // Auto-generation in progress ID
  const [autoGeneratingId, setAutoGeneratingId] = useState<string | null>(null);

  // Custom Keywords state
  const [customKeywords, setCustomKeywords] = useState<KeywordOpportunityItem[]>(() => {
    try {
      const saved = localStorage.getItem('word_embassy_custom_keywords');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal states
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [newCustomKeyword, setNewCustomKeyword] = useState<Partial<KeywordOpportunityItem>>({
    keyword: '',
    monthlyVolume: 10000,
    difficulty: 30,
    intent: 'Devotional',
    cluster: 'Divine Healing & Wholeness',
    anchorScripture: '',
    bibleBook: 'Isaiah',
    bibleChapter: '53',
    bibleVerses: '5',
    recommendedEdition: 'DAILY_DEVOTIONAL',
    priority: 'HIGH',
    suggestedTopicTitle: '',
    suggestedEditorialAngle: '',
    suggestedMetaDescription: '',
    topicalRationale: '',
  });

  // Selected item for drawer/modal inspection
  const [inspectedItem, setInspectedItem] = useState<KeywordAnalysisResult | null>(null);
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  // Combine built-in and custom opportunities
  const allOpportunities = useMemo(() => {
    return [...INITIAL_KEYWORD_OPPORTUNITIES, ...customKeywords];
  }, [customKeywords]);

  // Intelligent matching engine: Maps each keyword opportunity against current topics and newsletters
  const analyzedKeywords = useMemo<KeywordAnalysisResult[]>(() => {
    return allOpportunities.map((opp) => {
      const normKw = opp.keyword.toLowerCase().trim();
      const kwTokens = normKw.split(/\s+/).filter((t) => t.length > 2);
      const normScripture = opp.anchorScripture.toLowerCase().replace(/[^a-z0-9]/g, '');

      let bestScore = 0;
      let matchedTopic: Topic | undefined = undefined;
      let matchedNewsletter: Newsletter | undefined = undefined;
      let matchNotes = '';

      // Check against existing topics
      for (const t of topics) {
        let score = 0;
        const normTopic = t.Topic.toLowerCase();
        const normTopicScripture = t.Scripture.toLowerCase().replace(/[^a-z0-9]/g, '');
        const normTheme = t.Theme.toLowerCase();
        const normNotes = (t.Notes || '').toLowerCase();

        // 1. Direct scripture match is very strong indicator
        if (
          normTopicScripture &&
          normScripture &&
          (normTopicScripture.includes(normScripture) || normScripture.includes(normTopicScripture))
        ) {
          score += 45;
        }

        // 2. Exact keyword inclusion in title
        if (normTopic.includes(normKw)) {
          score += 50;
        } else {
          // Token overlap in title
          const tokenMatches = kwTokens.filter((tk) => normTopic.includes(tk));
          score += (tokenMatches.length / Math.max(kwTokens.length, 1)) * 35;
        }

        // 3. Theme/Notes mention
        if (normTheme.includes(normKw) || normNotes.includes(normKw)) {
          score += 15;
        }

        if (score > bestScore) {
          bestScore = score;
          matchedTopic = t;
        }
      }

      // Check against published/draft newsletters as well
      for (const nl of newsletters) {
        let score = 0;
        const normTitle = nl.Title.toLowerCase();
        const normNlScripture = nl.ScriptureReference.toLowerCase().replace(/[^a-z0-9]/g, '');
        const normMeta = ((nl.MetaTitle || '') + ' ' + (nl.MetaDescription || '')).toLowerCase();

        if (
          normNlScripture &&
          normScripture &&
          (normNlScripture.includes(normScripture) || normScripture.includes(normNlScripture))
        ) {
          score += 45;
        }

        if (normTitle.includes(normKw) || normMeta.includes(normKw)) {
          score += 50;
        } else {
          const tokenMatches = kwTokens.filter((tk) => normTitle.includes(tk) || normMeta.includes(tk));
          score += (tokenMatches.length / Math.max(kwTokens.length, 1)) * 35;
        }

        if (score > bestScore) {
          bestScore = score;
          matchedNewsletter = nl;
          // Find parent topic if any
          matchedTopic = topics.find((t) => t.TopicID === nl.TopicID) || matchedTopic;
        }
      }

      // Determine Coverage Status:
      // Highlighting 'Coverage Gaps' where a keyword has no associated newsletter.
      let status: CoverageStatus = 'GAP';
      let revisionSuggestion: KeywordAnalysisResult['revisionSuggestion'] = undefined;

      if (matchedNewsletter) {
        if (bestScore >= 75) {
          status = 'COVERED';
          matchNotes = `Covered with high authority by Newsletter [${matchedNewsletter.NewsletterID}] "${matchedNewsletter.Title}". Keyword tokens strongly represented in headlines.`;
        } else {
          status = 'UNDER_OPTIMIZED';
          const currentTitle = matchedNewsletter.Title;
          matchNotes = `Scripture or theme is addressed in [${matchedNewsletter.NewsletterID}], but title/metadata omits high-volume query "${opp.keyword}". Potential traffic leak.`;
          revisionSuggestion = {
            originalTitle: currentTitle,
            suggestedTitle: opp.suggestedTopicTitle,
            seoAdvantage: `Infuses target query "${opp.keyword}" (${opp.monthlyVolume.toLocaleString()}/mo) to rank in Google SERP while preserving pastoral authority.`,
          };
        }
      } else {
        // No associated newsletter exists! This is a Coverage Gap.
        status = 'GAP';
        if (matchedTopic) {
          matchNotes = `Topic [${matchedTopic.TopicID}] "${matchedTopic.Topic}" is scheduled in calendar, but no associated newsletter has been generated yet.`;
        } else {
          matchNotes = `Complete topical coverage gap: No associated newsletter or planned topic covers ${opp.anchorScripture} for "${opp.keyword}".`;
        }
      }

      return {
        opportunity: opp,
        status,
        matchedTopic,
        matchedNewsletter,
        matchScore: Math.round(bestScore),
        matchNotes,
        revisionSuggestion,
      };
    });
  }, [allOpportunities, topics, newsletters]);

  // Aggregate Metrics & Calculations
  const stats = useMemo(() => {
    const total = analyzedKeywords.length;
    const covered = analyzedKeywords.filter((k) => k.status === 'COVERED');
    const underOptimized = analyzedKeywords.filter((k) => k.status === 'UNDER_OPTIMIZED');
    const gaps = analyzedKeywords.filter((k) => k.status === 'GAP');

    const totalMonitoredVolume = analyzedKeywords.reduce(
      (sum, k) => sum + k.opportunity.monthlyVolume,
      0
    );
    const coveredVolume = covered.reduce((sum, k) => sum + k.opportunity.monthlyVolume, 0);
    const untappedVolume = gaps.reduce((sum, k) => sum + k.opportunity.monthlyVolume, 0);
    const underOptimizedVolume = underOptimized.reduce(
      (sum, k) => sum + k.opportunity.monthlyVolume,
      0
    );

    const authorityScore = total > 0 ? Math.round(((covered.length * 1.0 + underOptimized.length * 0.5) / total) * 100) : 0;

    return {
      total,
      coveredCount: covered.length,
      underOptimizedCount: underOptimized.length,
      gapsCount: gaps.length,
      authorityScore,
      totalMonitoredVolume,
      coveredVolume,
      untappedVolume,
      underOptimizedVolume,
    };
  }, [analyzedKeywords]);

  // Clusters list
  const clusters = useMemo(() => {
    const set = new Set<string>();
    allOpportunities.forEach((o) => set.add(o.cluster));
    return Array.from(set);
  }, [allOpportunities]);

  const getClusterIcon = (cluster: string) => {
    switch (cluster) {
      case 'Divine Healing & Wholeness':
        return Heart;
      case 'Divine Protection & Warfare':
        return Shield;
      case 'Anxiety, Peace & Mental Rest':
        return Sparkles;
      case 'Persistent Prayer & Intercession':
        return Flame;
      case 'Faith, Doubt & Mountain Moving':
        return Zap;
      case 'Guidance, Purpose & God’s Will':
        return Compass;
      case 'Covenant Provision & Stewardship':
        return DollarSign;
      case 'Grace, Forgiveness & Freedom':
      default:
        return Layers;
    }
  };

  // Detailed breakdown per cluster for the Radar / Progress stacks
  const clusterBreakdown = useMemo(() => {
    return clusters.map((clusterName) => {
      const items = analyzedKeywords.filter((k) => k.opportunity.cluster === clusterName);
      const covered = items.filter((k) => k.status === 'COVERED');
      const underOptimized = items.filter((k) => k.status === 'UNDER_OPTIMIZED');
      const gaps = items.filter((k) => k.status === 'GAP');

      const totalVolume = items.reduce((sum, k) => sum + k.opportunity.monthlyVolume, 0);
      const coveredVolume = covered.reduce((sum, k) => sum + k.opportunity.monthlyVolume, 0);
      const gapVolume = gaps.reduce((sum, k) => sum + k.opportunity.monthlyVolume, 0);
      const underOptimizedVolume = underOptimized.reduce(
        (sum, k) => sum + k.opportunity.monthlyVolume,
        0
      );

      const totalCount = items.length;
      const coveragePercent =
        totalCount > 0
          ? Math.round(((covered.length * 1.0 + underOptimized.length * 0.5) / totalCount) * 100)
          : 0;

      return {
        clusterName,
        totalCount,
        coveredCount: covered.length,
        underOptimizedCount: underOptimized.length,
        gapsCount: gaps.length,
        totalVolume,
        coveredVolume,
        gapVolume,
        underOptimizedVolume,
        coveragePercent,
        items,
      };
    });
  }, [clusters, analyzedKeywords]);

  // Top 3 Actionable Content Gaps for immediate content strategy
  const topActionableGaps = useMemo(() => {
    return analyzedKeywords
      .filter((k) => k.status === 'GAP')
      .sort((a, b) => {
        const roiA = a.opportunity.monthlyVolume / Math.max(a.opportunity.difficulty, 10);
        const roiB = b.opportunity.monthlyVolume / Math.max(b.opportunity.difficulty, 10);
        return roiB - roiA;
      })
      .slice(0, 3);
  }, [analyzedKeywords]);

  // Top 3 Quick-Win Revisions (under-optimized topics with high traffic)
  const topQuickRevisions = useMemo(() => {
    return analyzedKeywords
      .filter((k) => k.status === 'UNDER_OPTIMIZED' && k.revisionSuggestion)
      .sort((a, b) => b.opportunity.monthlyVolume - a.opportunity.monthlyVolume)
      .slice(0, 3);
  }, [analyzedKeywords]);

  // Topics vs Keywords Cross-Alignment Data
  const topicAlignmentData = useMemo(() => {
    return topics.map((topic) => {
      const matched = analyzedKeywords.filter(
        (ak) => ak.matchedTopic?.TopicID === topic.TopicID
      );
      const totalDemand = matched.reduce((s, m) => s + m.opportunity.monthlyVolume, 0);
      const hasExactCover = matched.some((m) => m.status === 'COVERED');
      const hasRevision = matched.some((m) => m.status === 'UNDER_OPTIMIZED');

      return {
        topic,
        matched,
        totalDemand,
        status: hasExactCover ? 'ALIGNED' : hasRevision ? 'NEEDS_REVISION' : 'UNMAPPED',
      };
    });
  }, [topics, analyzedKeywords]);

  // Unmapped High-Demand Keywords (Keywords with 0 topic coverage)
  const unmappedKeywords = useMemo(() => {
    return analyzedKeywords.filter((k) => k.status === 'GAP');
  }, [analyzedKeywords]);

  // Active matrix node item for quick inspection
  const activeMatrixNode = useMemo(() => {
    if (!selectedMatrixId) {
      return topActionableGaps[0] || analyzedKeywords[0] || null;
    }
    return analyzedKeywords.find((k) => k.opportunity.id === selectedMatrixId) || null;
  }, [selectedMatrixId, topActionableGaps, analyzedKeywords]);

  // Filtered & Sorted keyword items
  const filteredKeywords = useMemo(() => {
    return analyzedKeywords
      .filter((item) => {
        const matchesSearch =
          !searchTerm ||
          item.opportunity.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.opportunity.anchorScripture.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.opportunity.suggestedTopicTitle.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCluster =
          selectedCluster === 'ALL' || item.opportunity.cluster === selectedCluster;

        const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;

        return matchesSearch && matchesCluster && matchesStatus;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'volume') {
          diff = b.opportunity.monthlyVolume - a.opportunity.monthlyVolume;
        } else if (sortBy === 'difficulty') {
          diff = b.opportunity.difficulty - a.opportunity.difficulty;
        } else if (sortBy === 'status') {
          const rank = { GAP: 3, UNDER_OPTIMIZED: 2, COVERED: 1 };
          diff = rank[b.status] - rank[a.status];
        } else if (sortBy === 'cluster') {
          diff = a.opportunity.cluster.localeCompare(b.opportunity.cluster);
        }
        return sortOrder === 'desc' ? diff : -diff;
      });
  }, [analyzedKeywords, searchTerm, selectedCluster, selectedStatus, sortBy, sortOrder]);

  // Action: Auto-Generate to trigger pipeline for specific topic gap
  const handleAutoGenerateForGap = async (item: KeywordAnalysisResult) => {
    const { opportunity: opp, matchedTopic } = item;
    try {
      setAutoGeneratingId(opp.id);
      setActionSuccessToast(
        `⚡ Auto-Generate triggered for "${opp.suggestedTopicTitle}". Running generation pipeline...`
      );

      let targetTopic: Topic;
      if (matchedTopic) {
        targetTopic = matchedTopic;
      } else {
        const today = new Date().toISOString().split('T')[0];
        const newTopicId = `TOPIC-${(topics.length + 1).toString().padStart(3, '0')}`;
        targetTopic = {
          TopicID: newTopicId,
          Topic: opp.suggestedTopicTitle,
          Scripture: opp.anchorScripture,
          Theme: opp.cluster,
          Edition: opp.recommendedEdition,
          Priority: opp.priority,
          Notes: `${opp.suggestedEditorialAngle} [Target Keyword: "${opp.keyword}" (${opp.monthlyVolume.toLocaleString()}/mo search demand, KD ${opp.difficulty})]`,
          Status: 'PENDING',
          PublishDate: today,
          CreatedAt: new Date().toISOString(),
          UpdatedAt: new Date().toISOString(),
        };
        onAddTopic(targetTopic);
      }

      if (onGenerateSpecificTopic) {
        await onGenerateSpecificTopic(targetTopic);
        setActionSuccessToast(
          `✓ Auto-generated complete newsletter package for "${targetTopic.Topic}"! Coverage gap closed.`
        );
      } else {
        setActionSuccessToast(
          `✓ Topic "${targetTopic.Topic}" created and queued for pipeline generation.`
        );
      }
      if (inspectedItem?.opportunity.id === opp.id) {
        setInspectedItem(null);
      }
    } catch (err: any) {
      console.error('Auto-generate error:', err);
      setActionSuccessToast(`Generation status: ${err?.message || 'Pipeline invoked'}`);
    } finally {
      setAutoGeneratingId(null);
      setTimeout(() => setActionSuccessToast(null), 5000);
    }
  };

  // 1-Click Action: Create Topic from Opportunity
  const handleCreateTopicFromOpportunity = (opp: KeywordOpportunityItem) => {
    const today = new Date().toISOString().split('T')[0];
    onAddTopic({
      Topic: opp.suggestedTopicTitle,
      Scripture: opp.anchorScripture,
      Theme: opp.cluster,
      Edition: opp.recommendedEdition,
      Priority: opp.priority,
      Notes: `${opp.suggestedEditorialAngle} [Target Keyword: "${opp.keyword}" (${opp.monthlyVolume.toLocaleString()}/mo search demand)]`,
      PublishDate: today,
    });

    setActionSuccessToast(
      `Added "${opp.suggestedTopicTitle}" to Topics Queue! High-traffic gap resolved.`
    );
    setTimeout(() => setActionSuccessToast(null), 4000);
    if (inspectedItem?.opportunity.id === opp.id) {
      setInspectedItem(null);
    }
  };

  // 1-Click Action: Apply Suggested SEO Revision to matched topic / newsletter
  const handleApplyRevision = (result: KeywordAnalysisResult) => {
    if (!result.revisionSuggestion) return;
    const { suggestedTitle } = result.revisionSuggestion;

    if (result.matchedTopic) {
      onUpdateTopic(result.matchedTopic.TopicID, {
        Topic: suggestedTitle,
        Notes: `${result.matchedTopic.Notes || ''} | Optimized for keyword: "${result.opportunity.keyword}" (${result.opportunity.monthlyVolume.toLocaleString()}/mo)`.trim(),
      });
    }

    if (result.matchedNewsletter) {
      onUpdateNewsletter(result.matchedNewsletter.NewsletterID, {
        Title: suggestedTitle,
        MetaTitle: `${suggestedTitle.slice(0, 55)} | Living Word Embassy`,
        MetaDescription: result.opportunity.suggestedMetaDescription,
      });
    }

    setActionSuccessToast(
      `Revised title and SEO metadata to "${suggestedTitle}" for improved topical authority.`
    );
    setTimeout(() => setActionSuccessToast(null), 4500);
    setInspectedItem(null);
  };

  // Save Custom Keyword
  const handleSaveCustomKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomKeyword.keyword || !newCustomKeyword.anchorScripture) return;

    const newKw: KeywordOpportunityItem = {
      id: `kw-custom-${Date.now()}`,
      keyword: newCustomKeyword.keyword.trim().toLowerCase(),
      monthlyVolume: Number(newCustomKeyword.monthlyVolume) || 5000,
      difficulty: Number(newCustomKeyword.difficulty) || 25,
      intent: (newCustomKeyword.intent as any) || 'Devotional',
      cluster: (newCustomKeyword.cluster as any) || 'Divine Healing & Wholeness',
      anchorScripture: newCustomKeyword.anchorScripture.trim(),
      bibleBook: newCustomKeyword.bibleBook || 'Psalm',
      bibleChapter: newCustomKeyword.bibleChapter || '1',
      bibleVerses: newCustomKeyword.bibleVerses || '1',
      recommendedEdition: newCustomKeyword.recommendedEdition || 'DAILY_DEVOTIONAL',
      priority: newCustomKeyword.priority || 'HIGH',
      topicalRationale: newCustomKeyword.topicalRationale || 'Custom tracked keyword',
      suggestedTopicTitle:
        newCustomKeyword.suggestedTopicTitle ||
        `${newCustomKeyword.keyword}: Biblical Study and Devotional`,
      suggestedEditorialAngle:
        newCustomKeyword.suggestedEditorialAngle ||
        `Exegesis of ${newCustomKeyword.anchorScripture} targeting ${newCustomKeyword.keyword}`,
      suggestedMetaDescription:
        newCustomKeyword.suggestedMetaDescription ||
        `Biblical exposition and practical devotional on ${newCustomKeyword.keyword} from ${newCustomKeyword.anchorScripture}.`,
      isCustom: true,
    };

    const updated = [newKw, ...customKeywords];
    setCustomKeywords(updated);
    try {
      localStorage.setItem('word_embassy_custom_keywords', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setShowAddCustomModal(false);
    setActionSuccessToast(`Custom keyword "${newKw.keyword}" added to tracking engine.`);
    setTimeout(() => setActionSuccessToast(null), 3500);
  };

  // Export CSV Report
  const handleExportReport = () => {
    const headers = [
      'Keyword',
      'Status',
      'Monthly Search Volume',
      'Difficulty (KD)',
      'Intent',
      'Topical Cluster',
      'Anchor Scripture',
      'Matched Topic / Newsletter',
      'Suggested Topic Title',
      'Suggested Meta Description',
    ];

    const rows = analyzedKeywords.map((k) => [
      `"${k.opportunity.keyword}"`,
      `"${k.status}"`,
      k.opportunity.monthlyVolume,
      k.opportunity.difficulty,
      `"${k.opportunity.intent}"`,
      `"${k.opportunity.cluster}"`,
      `"${k.opportunity.anchorScripture}"`,
      `"${k.matchedNewsletter?.Title || k.matchedTopic?.Topic || 'None (Topical Gap)'}"`,
      `"${k.opportunity.suggestedTopicTitle}"`,
      `"${k.opportunity.suggestedMetaDescription}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `living_word_embassy_keyword_opportunities_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6" id="admin-keyword-opportunity-view">
      {/* Toast Notification */}
      {actionSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-400/40 animate-fade-in text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-200" />
          <span>{actionSuccessToast}</span>
        </div>
      )}

      {/* 1. HEADER & EXECUTIVE SUMMARY */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 p-6 rounded-2xl border border-slate-700/80 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-lg text-xs font-bold border border-amber-500/20">
            <Target className="w-3.5 h-3.5" />
            <span>Topical Authority & Content Gap Intelligence</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-tight flex items-center gap-2.5">
            <span>Keyword Opportunity Radar</span>
            <span className="text-xs font-mono font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
              {stats.total} Monitored Queries
            </span>
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Maps current devotional topics and exegesis editions against verified high-traffic Christian search queries. Detects doctrinal content gaps, identifies under-optimized articles, and suggests 1-click revisions to dominate SERP rankings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAddCustomModal(true)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-colors"
            id="add-custom-keyword-btn"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Keyword</span>
          </button>
          <button
            onClick={handleExportReport}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Download CSV report of keyword gaps and recommendations"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export Strategy (CSV)</span>
          </button>
          {onNavigateToSeoTab && (
            <button
              onClick={onNavigateToSeoTab}
              className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>SEO Config Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. TOPICAL AUTHORITY METRICS TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Metric 1: Topical Authority Score */}
        <div className="bg-slate-850/90 p-4 rounded-xl border border-slate-700/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Topical Authority</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{stats.authorityScore}%</span>
            <span className="text-[10px] text-slate-400">coverage index</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.authorityScore}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Untapped Search Demand */}
        <div className="bg-slate-850/90 p-4 rounded-xl border border-rose-500/20 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Untapped Gap Traffic</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-rose-300">
              {stats.untappedVolume.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400">searches/mo</span>
          </div>
          <p className="text-[10px] text-slate-400 line-clamp-1">
            Across {stats.gapsCount} unaddressed doctrinal themes
          </p>
        </div>

        {/* Metric 3: Under-Optimized Opportunities */}
        <div className="bg-slate-850/90 p-4 rounded-xl border border-amber-500/20 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Under-Optimized Articles</span>
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-amber-300">
              {stats.underOptimizedCount}
            </span>
            <span className="text-[10px] text-slate-400">can be boosted</span>
          </div>
          <p className="text-[10px] text-slate-400 line-clamp-1">
            {stats.underOptimizedVolume.toLocaleString()} search queries addressable
          </p>
        </div>

        {/* Metric 4: Covered High-Authority Posts */}
        <div className="bg-slate-850/90 p-4 rounded-xl border border-emerald-500/20 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Covered (Strong)</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-emerald-300">{stats.coveredCount}</span>
            <span className="text-[10px] text-slate-400">of {stats.total}</span>
          </div>
          <p className="text-[10px] text-slate-400 line-clamp-1">
            {stats.coveredVolume.toLocaleString()}/mo traffic protected
          </p>
        </div>

        {/* Metric 5: Total Search Demand Tracked */}
        <div className="bg-slate-850/90 p-4 rounded-xl border border-slate-700/80 space-y-1 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Search Volume</span>
            <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-sky-300">
              {stats.totalMonitoredVolume.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400">queries/mo</span>
          </div>
          <p className="text-[10px] text-slate-400 line-clamp-1">Across 8 theological pillars</p>
        </div>
      </div>

      {/* VIEW MODE SWITCHER TABS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 p-2 rounded-xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 overflow-x-auto">
          <button
            id="view-mode-table-tab"
            onClick={() => setViewMode('table')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              viewMode === 'table'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Topics vs Keywords Mapping Table ({analyzedKeywords.length})</span>
          </button>
          <button
            id="view-mode-matrix-tab"
            onClick={() => setViewMode('matrix')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              viewMode === 'matrix'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Strategy Matrix & Radar</span>
          </button>
          <button
            id="view-mode-alignment-tab"
            onClick={() => setViewMode('alignment')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              viewMode === 'alignment'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Topical Coverage Alignment ({topics.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 px-2 justify-between sm:justify-end">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
            <span className="text-rose-300 font-bold">{stats.gapsCount}</span> Gaps
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <span className="text-amber-300 font-bold">{stats.underOptimizedCount}</span> Revisions
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-emerald-300 font-bold">{stats.coveredCount}</span> Covered
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: STRATEGY MATRIX & RADAR                                           */}
      {/* ========================================================================= */}
      {viewMode === 'matrix' && (
        <div className="space-y-6">
          {/* TOP SECTION: 2-COLUMN SCATTER MATRIX & INTERACTIVE NODE INSPECTOR */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* LEFT (8 COLS): 2D SCATTER PLOT QUADRANT MATRIX */}
            <div className="lg:col-span-8 bg-slate-850 rounded-2xl border border-slate-700 p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
                  <div>
                    <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                      <Target className="w-4 h-4 text-amber-400" />
                      <span>Topical Opportunity Quadrant Matrix</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Search Volume (Y) vs. Keyword Difficulty (X). Click any node to inspect and take 1-click strategy action.
                    </p>
                  </div>
                  {/* Scatter Plot Status Indicator Pills */}
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      <span>Gap ({stats.gapsCount})</span>
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Revise ({stats.underOptimizedCount})</span>
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Covered ({stats.coveredCount})</span>
                    </span>
                  </div>
                </div>

                {/* SVG 2D SCATTER PLOT */}
                <div className="relative w-full aspect-[820/430] bg-slate-950/80 rounded-xl border border-slate-800/90 overflow-hidden select-none">
                  <svg
                    viewBox="0 0 820 430"
                    className="w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <radialGradient id="gapGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* QUADRANT 1 (TOP-LEFT): HIGH DEMAND + LOW KD (PRIME CONTENT GAPS) */}
                    <rect
                      x="70"
                      y="30"
                      width="360"
                      height="190"
                      fill="#f43f5e"
                      fillOpacity="0.06"
                      stroke="#f43f5e"
                      strokeOpacity="0.15"
                      strokeDasharray="4 4"
                      rx="6"
                    />
                    <text
                      x="85"
                      y="52"
                      fill="#fda4af"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      🌟 High-Demand Quick Wins (Gaps)
                    </text>
                    <text
                      x="85"
                      y="68"
                      fill="#94a3b8"
                      fontSize="9.5"
                      fontFamily="sans-serif"
                    >
                      Low KD &lt; 30 • High Traffic &gt; 20k/mo
                    </text>

                    {/* QUADRANT 2 (TOP-RIGHT): HIGH DEMAND + HIGH KD (PILLAR AUTHORITY) */}
                    <rect
                      x="430"
                      y="30"
                      width="360"
                      height="190"
                      fill="#38bdf8"
                      fillOpacity="0.04"
                      stroke="#38bdf8"
                      strokeOpacity="0.15"
                      strokeDasharray="4 4"
                      rx="6"
                    />
                    <text
                      x="445"
                      y="52"
                      fill="#bae6fd"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      🏛️ Pillar Authority Series
                    </text>
                    <text
                      x="445"
                      y="68"
                      fill="#94a3b8"
                      fontSize="9.5"
                      fontFamily="sans-serif"
                    >
                      High KD ≥ 30 • Comprehensive Exegesis
                    </text>

                    {/* QUADRANT 3 (BOTTOM-LEFT): TARGETED DEMAND + LOW KD (NICHE DEVOTIONALS) */}
                    <rect
                      x="70"
                      y="220"
                      width="360"
                      height="155"
                      fill="#10b981"
                      fillOpacity="0.04"
                      stroke="#10b981"
                      strokeOpacity="0.12"
                      strokeDasharray="4 4"
                      rx="6"
                    />
                    <text
                      x="85"
                      y="242"
                      fill="#6ee7b7"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      🌱 Niche Devotionals & Prayers
                    </text>
                    <text
                      x="85"
                      y="258"
                      fill="#94a3b8"
                      fontSize="9.5"
                      fontFamily="sans-serif"
                    >
                      Low KD &lt; 30 • Easy Ranking Devotions
                    </text>

                    {/* QUADRANT 4 (BOTTOM-RIGHT): TARGETED DEMAND + HIGH KD (LONG-TAIL) */}
                    <rect
                      x="430"
                      y="220"
                      width="360"
                      height="155"
                      fill="#94a3b8"
                      fillOpacity="0.03"
                      stroke="#94a3b8"
                      strokeOpacity="0.1"
                      strokeDasharray="4 4"
                      rx="6"
                    />
                    <text
                      x="445"
                      y="242"
                      fill="#cbd5e1"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      🎯 Long-Tail Strategic Studies
                    </text>
                    <text
                      x="445"
                      y="258"
                      fill="#94a3b8"
                      fontSize="9.5"
                      fontFamily="sans-serif"
                    >
                      High KD ≥ 30 • Deep Doctrinal Reference
                    </text>

                    {/* AXIS DIVIDER LINES */}
                    <line
                      x1="430"
                      y1="30"
                      x2="430"
                      y2="375"
                      stroke="#475569"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <line
                      x1="70"
                      y1="220"
                      x2="790"
                      y2="220"
                      stroke="#475569"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />

                    {/* MAIN AXIS LINES */}
                    <line x1="70" y1="30" x2="70" y2="375" stroke="#334155" strokeWidth="2" />
                    <line x1="70" y1="375" x2="790" y2="375" stroke="#334155" strokeWidth="2" />

                    {/* Y-AXIS LABELS & TICKS */}
                    {[
                      { vol: 40000, label: '40k' },
                      { vol: 30000, label: '30k' },
                      { vol: 20000, label: '20k' },
                      { vol: 10000, label: '10k' },
                      { vol: 0, label: '0' },
                    ].map((tick) => {
                      const y = 30 + (1 - tick.vol / 45000) * 345;
                      return (
                        <g key={tick.vol}>
                          <line x1="64" y1={y} x2="70" y2={y} stroke="#64748b" strokeWidth="1.5" />
                          <line
                            x1="70"
                            y1={y}
                            x2="790"
                            y2={y}
                            stroke="#1e293b"
                            strokeWidth="1"
                            strokeDasharray="2 2"
                          />
                          <text
                            x="58"
                            y={y + 3.5}
                            fill="#94a3b8"
                            fontSize="10"
                            textAnchor="end"
                            fontFamily="monospace"
                          >
                            {tick.label}
                          </text>
                        </g>
                      );
                    })}

                    {/* X-AXIS LABELS & TICKS */}
                    {[
                      { kd: 0, label: 'KD 0' },
                      { kd: 15, label: '15' },
                      { kd: 30, label: '30' },
                      { kd: 45, label: '45' },
                      { kd: 60, label: '60' },
                    ].map((tick) => {
                      const x = 70 + (tick.kd / 60) * 720;
                      return (
                        <g key={tick.kd}>
                          <line x1={x} y1="375" x2={x} y2="381" stroke="#64748b" strokeWidth="1.5" />
                          <line
                            x1={x}
                            y1="30"
                            x2={x}
                            y2="375"
                            stroke="#1e293b"
                            strokeWidth="1"
                            strokeDasharray="2 2"
                          />
                          <text
                            x={x}
                            y="396"
                            fill="#94a3b8"
                            fontSize="10"
                            textAnchor="middle"
                            fontFamily="monospace"
                          >
                            {tick.label}
                          </text>
                        </g>
                      );
                    })}

                    {/* AXIS TITLES */}
                    <text
                      x="30"
                      y="200"
                      fill="#cbd5e1"
                      fontSize="10.5"
                      fontWeight="bold"
                      textAnchor="middle"
                      transform="rotate(-90 30 200)"
                      fontFamily="sans-serif"
                    >
                      Monthly Search Volume (queries/mo)
                    </text>
                    <text
                      x="430"
                      y="418"
                      fill="#cbd5e1"
                      fontSize="10.5"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      Keyword Difficulty (KD Score: 0 - 60)
                    </text>

                    {/* DATA NODES */}
                    {analyzedKeywords.map((item) => {
                      const opp = item.opportunity;
                      const cx = 70 + (Math.min(opp.difficulty, 60) / 60) * 720;
                      const cy = 30 + (1 - Math.min(opp.monthlyVolume, 45000) / 45000) * 345;
                      const r = Math.max(5.5, Math.min(13, 5 + (opp.monthlyVolume / 45000) * 8));
                      const isSelected = activeMatrixNode?.opportunity.id === opp.id;
                      const isGap = item.status === 'GAP';
                      const isRevise = item.status === 'UNDER_OPTIMIZED';

                      const fillColor = isGap ? '#f43f5e' : isRevise ? '#f59e0b' : '#10b981';
                      const strokeColor = isGap ? '#ffe4e6' : isRevise ? '#fef3c7' : '#d1fae5';

                      return (
                        <g
                          key={opp.id}
                          className="cursor-pointer transition-transform duration-150 hover:scale-125"
                          onClick={() => setSelectedMatrixId(opp.id)}
                          style={{ transformOrigin: `${cx}px ${cy}px` }}
                        >
                          {/* Pulsing Aura for Gaps */}
                          {isGap && (
                            <circle
                              cx={cx}
                              cy={cy}
                              r={r + 4}
                              fill="url(#gapGlow)"
                              opacity="0.4"
                            />
                          )}

                          {/* Selected Highlight Ring */}
                          {isSelected && (
                            <circle
                              cx={cx}
                              cy={cy}
                              r={r + 6}
                              fill="none"
                              stroke="#fbbf24"
                              strokeWidth="2.5"
                              strokeDasharray="4 2"
                            />
                          )}

                          {/* Main Node Circle */}
                          <circle
                            cx={cx}
                            cy={cy}
                            r={r}
                            fill={fillColor}
                            stroke={isSelected ? '#ffffff' : strokeColor}
                            strokeWidth={isSelected ? '2' : '1.5'}
                            opacity={isSelected ? 1 : 0.88}
                          />

                          {/* Hover Tooltip Title */}
                          <title>
                            {opp.keyword} ({opp.monthlyVolume.toLocaleString()}/mo, KD {opp.difficulty}) - {item.status}
                          </title>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Bottom Quick Hint */}
              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tip: Large red dots near top-left represent the highest-converting editorial gaps.</span>
                </span>
                <button
                  onClick={() => setViewMode('table')}
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Open Filterable Table</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* RIGHT (4 COLS): ACTIVE NODE STRATEGY INSPECTOR & ACTION CARD */}
            <div className="lg:col-span-4 bg-slate-850 rounded-2xl border border-slate-700 p-5 shadow-xl flex flex-col justify-between space-y-4">
              {activeMatrixNode ? (
                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        Selected Matrix Keyword
                      </span>
                      <h4 className="font-serif text-lg font-bold text-white leading-tight mt-0.5">
                        "{activeMatrixNode.opportunity.keyword}"
                      </h4>
                    </div>
                    {/* Status Badge */}
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 ${
                        activeMatrixNode.status === 'GAP'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : activeMatrixNode.status === 'UNDER_OPTIMIZED'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {activeMatrixNode.status === 'GAP' && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                      {activeMatrixNode.status === 'UNDER_OPTIMIZED' && <Sparkles className="w-3 h-3 text-amber-400" />}
                      {activeMatrixNode.status === 'COVERED' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      <span>{activeMatrixNode.status.replace('_', ' ')}</span>
                    </span>
                  </div>

                  {/* Demand & Difficulty Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                      <div className="text-slate-400 text-[10px] flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-amber-400" />
                        <span>Monthly Search Demand</span>
                      </div>
                      <div className="text-lg font-mono font-bold text-white mt-0.5">
                        {activeMatrixNode.opportunity.monthlyVolume.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-amber-400/80">queries / month</div>
                    </div>

                    <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                      <div className="text-slate-400 text-[10px] flex items-center gap-1">
                        <Target className="w-3 h-3 text-sky-400" />
                        <span>Keyword Difficulty</span>
                      </div>
                      <div className="text-lg font-mono font-bold text-white mt-0.5">
                        KD {activeMatrixNode.opportunity.difficulty}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {activeMatrixNode.opportunity.difficulty < 25
                          ? 'Very Easy'
                          : activeMatrixNode.opportunity.difficulty < 35
                          ? 'Moderate'
                          : 'Competitive'}
                      </div>
                    </div>
                  </div>

                  {/* Doctrinal Pillar & Anchor Scripture */}
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Doctrinal Cluster:</span>
                      <span className="font-semibold text-amber-300">{activeMatrixNode.opportunity.cluster}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Anchor Scripture:</span>
                      <span className="font-serif font-bold text-amber-400 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{activeMatrixNode.opportunity.anchorScripture}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-400">Format:</span>
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-300 font-medium">
                        {activeMatrixNode.opportunity.recommendedEdition === 'WEEKLY_EXEGESIS'
                          ? '📖 Weekly Exegesis'
                          : '☀️ Daily Devotional'}
                      </span>
                    </div>
                  </div>

                  {/* Strategic Topic Proposal */}
                  <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Suggested Newsletter Title</span>
                    </div>
                    <p className="text-xs font-serif font-bold text-white">
                      "{activeMatrixNode.opportunity.suggestedTopicTitle}"
                    </p>
                    <p className="text-[11px] text-slate-300 leading-relaxed italic">
                      {activeMatrixNode.opportunity.suggestedEditorialAngle}
                    </p>
                  </div>

                  {/* Status Rationale */}
                  <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                    <span className="font-semibold text-slate-300">Topical Authority Impact: </span>
                    {activeMatrixNode.opportunity.topicalRationale}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">
                  <Target className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  <p className="text-xs font-semibold">Select any node on the matrix to inspect opportunity</p>
                </div>
              )}

              {/* ACTION BUTTONS */}
              {activeMatrixNode && (
                <div className="pt-2 border-t border-slate-800">
                  {activeMatrixNode.status === 'GAP' && (
                    <button
                      onClick={() => handleCreateTopicFromOpportunity(activeMatrixNode.opportunity)}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>1-Click: Add Topic to Editorial Queue</span>
                    </button>
                  )}

                  {activeMatrixNode.status === 'UNDER_OPTIMIZED' && activeMatrixNode.revisionSuggestion && (
                    <button
                      onClick={() => handleApplyRevision(activeMatrixNode)}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Apply Suggested Title Revision</span>
                    </button>
                  )}

                  {activeMatrixNode.status === 'COVERED' && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl text-center text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Strong Authority Established for this Query</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* MIDDLE SECTION: DOCTRINAL PILLAR & COVERAGE RADAR GRID */}
          <div className="bg-slate-850 rounded-2xl border border-slate-700 p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Doctrinal Pillars & Topical Authority Radar</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Total search demand and newsletter coverage broken down by Biblical doctrinal cluster.
                </p>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded" />
                  <span>Covered</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded" />
                  <span>Under-Optimized</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-rose-500 rounded" />
                  <span>Untapped Gap</span>
                </span>
              </div>
            </div>

            {/* 8 DOCTRINAL PILLAR CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {clusterBreakdown.map((cluster) => {
                const IconComponent = getClusterIcon(cluster.clusterName);
                const coveredRatio = cluster.totalCount > 0 ? (cluster.coveredCount / cluster.totalCount) * 100 : 0;
                const underOptimizedRatio =
                  cluster.totalCount > 0 ? (cluster.underOptimizedCount / cluster.totalCount) * 100 : 0;
                const gapRatio = cluster.totalCount > 0 ? (cluster.gapsCount / cluster.totalCount) * 100 : 0;

                const isCriticalGap = cluster.coveredCount === 0;

                return (
                  <div
                    key={cluster.clusterName}
                    onClick={() => {
                      setSelectedCluster(cluster.clusterName);
                      setViewMode('table');
                    }}
                    className={`bg-slate-900/90 rounded-xl p-4 border transition-all cursor-pointer hover:border-amber-400 hover:shadow-lg space-y-3 ${
                      isCriticalGap
                        ? 'border-rose-500/30 hover:border-rose-400'
                        : 'border-slate-800'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-white text-xs leading-tight line-clamp-1">
                            {cluster.clusterName}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            {cluster.totalCount} monitored queries
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Monthly Volume */}
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">Monthly Demand:</span>
                      <span className="font-mono font-bold text-amber-300">
                        {cluster.totalVolume.toLocaleString()}/mo
                      </span>
                    </div>

                    {/* Segmented Stacked Progress Bar */}
                    <div className="space-y-1">
                      <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden flex">
                        <div
                          style={{ width: `${coveredRatio}%` }}
                          className="bg-emerald-500 h-full transition-all"
                          title={`Covered: ${cluster.coveredCount}`}
                        />
                        <div
                          style={{ width: `${underOptimizedRatio}%` }}
                          className="bg-amber-500 h-full transition-all"
                          title={`Under-optimized: ${cluster.underOptimizedCount}`}
                        />
                        <div
                          style={{ width: `${gapRatio}%` }}
                          className="bg-rose-500 h-full transition-all"
                          title={`Gap: ${cluster.gapsCount}`}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>{cluster.coveragePercent}% Authority</span>
                        <span>{cluster.gapsCount} Gaps</span>
                      </div>
                    </div>

                    {/* Status Pill Badge */}
                    <div className="pt-1">
                      {isCriticalGap ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 w-full justify-center">
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          <span>0% Covered — Priority Target</span>
                        </span>
                      ) : cluster.coveragePercent >= 60 ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 w-full justify-center">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>High Authority Cluster</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 w-full justify-center">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>Partial Authority Established</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BOTTOM SECTION: STRATEGIC CONTENT ROADMAP (TOP GAPS & TOP REVISIONS) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* TOP 3 IMMEDIATE CONTENT GAPS */}
            <div className="bg-slate-850 rounded-2xl border border-rose-500/30 p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-white">
                      Immediate Content Gaps (Highest ROI)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Low competition, high monthly volume. Click to draft immediately.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  {stats.gapsCount} Total Gaps
                </span>
              </div>

              <div className="space-y-2.5">
                {topActionableGaps.map((item) => (
                  <div
                    key={item.opportunity.id}
                    className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>"{item.opportunity.keyword}"</span>
                        <span className="font-mono text-amber-400 text-[11px]">
                          ({item.opportunity.monthlyVolume.toLocaleString()}/mo)
                        </span>
                      </div>
                      <div className="text-slate-400 text-[11px] flex items-center gap-2">
                        <span className="text-amber-300 font-serif">{item.opportunity.anchorScripture}</span>
                        <span>•</span>
                        <span>KD {item.opportunity.difficulty}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleAutoGenerateForGap(item)}
                        disabled={autoGeneratingId === item.opportunity.id || isProcessing}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-xs transition-all disabled:opacity-50"
                        title="Trigger pipeline to generate newsletter for this gap"
                      >
                        {autoGeneratingId === item.opportunity.id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                            <span>Auto-Generate</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleCreateTopicFromOpportunity(item.opportunity)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold p-1.5 rounded-lg text-xs flex items-center transition-colors"
                        title="Add topic to queue without immediate generation"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TOP 3 QUICK-WIN TITLE REVISIONS */}
            <div className="bg-slate-850 rounded-2xl border border-amber-500/30 p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-white">
                      Quick-Win Title Revisions
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Existing topics that can capture high traffic with title updates.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {stats.underOptimizedCount} Revisions
                </span>
              </div>

              <div className="space-y-2.5">
                {topQuickRevisions.map((item) => (
                  <div
                    key={item.opportunity.id}
                    className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="text-slate-400 text-[11px] line-clamp-1">
                        Current: <span className="text-slate-300 font-medium">"{item.matchedTopic?.Topic || item.matchedNewsletter?.Title}"</span>
                      </div>
                      <div className="font-bold text-amber-300 line-clamp-1 flex items-center gap-1">
                        <ArrowRight className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>"{item.revisionSuggestion?.suggestedTitle}"</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleApplyRevision(item)}
                      className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shrink-0 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Apply</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: TOPIC VS KEYWORD CROSS-ALIGNMENT CANVAS                           */}
      {/* ========================================================================= */}
      {viewMode === 'alignment' && (
        <div className="space-y-6">
          <div className="bg-slate-850 rounded-2xl border border-slate-700 p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                  <Columns className="w-4 h-4 text-amber-400" />
                  <span>Topics vs. Keywords Cross-Alignment Canvas</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Maps current active newsletter topics against potential high-traffic keywords. Identifies which topics need keyword infusion and shows unaddressed orphan keywords.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                  {topicAlignmentData.filter((t) => t.status === 'ALIGNED').length} Aligned Topics
                </span>
                <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                  {topicAlignmentData.filter((t) => t.status === 'NEEDS_REVISION').length} Need Revision
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700 font-medium">
                  {topicAlignmentData.filter((t) => t.status === 'UNMAPPED').length} General
                </span>
              </div>
            </div>

            {/* 2-COLUMN COMPARISON CANVAS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* LEFT COLUMN: ACTIVE TOPICS LIST WITH KEYWORD BACKING */}
              <div className="lg:col-span-7 space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Current Active Topics in Queue ({topics.length})</span>
                  <span className="text-[11px] text-slate-400 font-normal">Rank Target Alignment</span>
                </div>

                <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
                  {topicAlignmentData.map(({ topic, matched, totalDemand, status }) => {
                    const primaryMatch = matched[0];
                    return (
                      <div
                        key={topic.TopicID}
                        className={`p-3.5 rounded-xl border text-xs space-y-2 transition-colors ${
                          status === 'ALIGNED'
                            ? 'bg-slate-900/90 border-emerald-500/30'
                            : status === 'NEEDS_REVISION'
                            ? 'bg-amber-950/20 border-amber-500/30'
                            : 'bg-slate-900/60 border-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-serif font-bold text-white text-sm">
                              {topic.Topic}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                              <span className="text-amber-400 font-serif">{topic.Scripture}</span>
                              <span>•</span>
                              <span>{topic.BibleBook} {topic.BibleChapter}</span>
                              <span>•</span>
                              <span className="bg-slate-800 px-1.5 py-0.2 rounded text-[10px] text-slate-300">
                                {topic.Theme || 'Biblical Study'}
                              </span>
                            </div>
                          </div>

                          {/* Status pill */}
                          {status === 'ALIGNED' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                              ✓ Aligned
                            </span>
                          )}
                          {status === 'NEEDS_REVISION' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                              ⚡ Needs Infusion
                            </span>
                          )}
                          {status === 'UNMAPPED' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                              General
                            </span>
                          )}
                        </div>

                        {/* Keyword target line */}
                        {primaryMatch ? (
                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <Target className="w-3.5 h-3.5 text-amber-400" />
                              <span>Target Query: <strong>"{primaryMatch.opportunity.keyword}"</strong></span>
                              <span className="font-mono text-amber-300 font-bold">
                                ({primaryMatch.opportunity.monthlyVolume.toLocaleString()}/mo)
                              </span>
                            </div>
                            {primaryMatch.revisionSuggestion && (
                              <button
                                onClick={() => handleApplyRevision(primaryMatch)}
                                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 text-[11px]"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>Infuse Keyword</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between">
                            <span>No exact high-traffic target query attached</span>
                            <span className="text-slate-400 text-[10px]">Devotional Focus</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT COLUMN: UNADDRESSED HIGH-DEMAND KEYWORDS (ORPHAN GAPS) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Untapped Search Queries (Orphan Gaps)</span>
                  <span className="text-[11px] text-slate-400 font-normal">0 Matching Topics</span>
                </div>

                <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
                  {unmappedKeywords.map((gap) => (
                    <div
                      key={gap.opportunity.id}
                      className="p-3.5 rounded-xl border border-rose-500/30 bg-slate-900/90 text-xs space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-white text-sm">
                            "{gap.opportunity.keyword}"
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {gap.opportunity.cluster}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-mono font-bold text-amber-300 text-sm">
                            {gap.opportunity.monthlyVolume.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-400">KD {gap.opportunity.difficulty}</div>
                        </div>
                      </div>

                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                        <span className="text-amber-400 font-serif font-bold">Suggested Topic: </span>
                        "{gap.opportunity.suggestedTopicTitle}"
                      </div>

                      <div className="flex items-center justify-between pt-1 gap-2">
                        <span className="font-serif text-amber-400 text-[11px] flex items-center gap-1 shrink-0">
                          <BookOpen className="w-3 h-3" />
                          <span>{gap.opportunity.anchorScripture}</span>
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleAutoGenerateForGap(gap)}
                            disabled={autoGeneratingId === gap.opportunity.id || isProcessing}
                            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs flex items-center gap-1 shadow-xs transition-all disabled:opacity-50"
                            title="Trigger generation pipeline for this gap"
                          >
                            {autoGeneratingId === gap.opportunity.id ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                                <span>Generating...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                                <span>Auto-Generate</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleCreateTopicFromOpportunity(gap.opportunity)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold p-1 rounded-lg text-xs flex items-center transition-colors"
                            title="Queue topic without immediate generation"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: FULL KEYWORDS DATABASE TABLE                                      */}
      {/* ========================================================================= */}
      {(viewMode === 'table' || viewMode === 'matrix') && (
        <div className="space-y-4 pt-2">
          {viewMode === 'matrix' && (
            <div className="flex items-center justify-between pt-2">
              <h4 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <Grid className="w-4 h-4 text-amber-400" />
                <span>Keyword Opportunities Detail Table</span>
              </h4>
              <span className="text-xs text-slate-400">
                Showing {filteredKeywords.length} of {allOpportunities.length} opportunities
              </span>
            </div>
          )}

      {/* 3. CLUSTERS QUICK FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs select-none">
        <span className="text-slate-400 font-semibold shrink-0 flex items-center gap-1 mr-1">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Doctrinal Pillars:</span>
        </span>
        <button
          onClick={() => setSelectedCluster('ALL')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            selectedCluster === 'ALL'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
          }`}
        >
          All Pillars ({allOpportunities.length})
        </button>
        {clusters.map((cluster) => {
          const count = allOpportunities.filter((o) => o.cluster === cluster).length;
          const isSelected = selectedCluster === cluster;
          return (
            <button
              key={cluster}
              onClick={() => setSelectedCluster(cluster)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              {cluster} ({count})
            </button>
          );
        })}
      </div>

      {/* 4. SEARCH & STATUS FILTER BAR */}
      <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search keywords, scripture (e.g. Isaiah 53, Psalm 91), intent, or proposed title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-400 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Status Filter Buttons */}
          <div className="bg-slate-900 p-1 rounded-lg border border-slate-700 flex items-center gap-1">
            <button
              onClick={() => setSelectedStatus('ALL')}
              className={`px-2.5 py-1 rounded text-xs font-semibold ${
                selectedStatus === 'ALL'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({analyzedKeywords.length})
            </button>
            <button
              onClick={() => setSelectedStatus('GAP')}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                selectedStatus === 'GAP'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>Gaps ({stats.gapsCount})</span>
            </button>
            <button
              onClick={() => setSelectedStatus('UNDER_OPTIMIZED')}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                selectedStatus === 'UNDER_OPTIMIZED'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Revise ({stats.underOptimizedCount})</span>
            </button>
            <button
              onClick={() => setSelectedStatus('COVERED')}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                selectedStatus === 'COVERED'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Covered ({stats.coveredCount})</span>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg">
            <span className="text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="volume" className="bg-slate-900">Search Volume</option>
              <option value="difficulty" className="bg-slate-900">Keyword Difficulty</option>
              <option value="status" className="bg-slate-900">Status (Gaps first)</option>
              <option value="cluster" className="bg-slate-900">Doctrinal Cluster</option>
            </select>
            <button
              onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
              className="text-slate-400 hover:text-white px-1 font-mono"
              title="Toggle sort direction"
            >
              {sortOrder === 'desc' ? '↓' : '↑'}
            </button>
          </div>
        </div>
      </div>

      {/* 5. MAIN KEYWORDS & GAPS MAPPING TABLE */}
      <div className="bg-slate-850 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
              <tr>
                <th className="p-4">Target Keyword & Intent</th>
                <th className="p-4">Monthly Demand</th>
                <th className="p-4">Difficulty (KD)</th>
                <th className="p-4">Anchor Scripture</th>
                <th className="p-4">Topical Coverage Status</th>
                <th className="p-4">Current Mapped Content</th>
                <th className="p-4 text-right">Strategic Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredKeywords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-400">
                    <Target className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold text-white">No keyword opportunities matched your filters</p>
                    <p className="text-xs text-slate-500 mt-1">Try clearing search terms or changing status filters</p>
                  </td>
                </tr>
              ) : (
                filteredKeywords.map((item) => {
                  const { opportunity: opp, status, matchedTopic, matchedNewsletter, revisionSuggestion } = item;
                  const isGap = status === 'GAP';
                  const isUnderOptimized = status === 'UNDER_OPTIMIZED';
                  const isCovered = status === 'COVERED';

                    return (
                    <tr
                      key={opp.id}
                      className={`transition-colors ${
                        isGap
                          ? 'bg-rose-950/20 hover:bg-rose-900/30 border-l-4 border-l-rose-500'
                          : isUnderOptimized
                          ? 'bg-amber-950/15 hover:bg-amber-900/25 border-l-4 border-l-amber-500'
                          : 'hover:bg-slate-800/60'
                      }`}
                    >
                      {/* Keyword & Cluster */}
                      <td className="p-4 max-w-[240px]">
                        <div className="font-bold text-white text-sm flex items-center gap-1.5">
                          <span>{opp.keyword}</span>
                          {opp.isCustom && (
                            <span className="bg-indigo-500/20 text-indigo-300 text-[9px] px-1 rounded font-mono">
                              CUSTOM
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{opp.cluster}</div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="bg-slate-900 border border-slate-700 text-slate-300 px-1.5 py-0.5 rounded text-[10px]">
                            {opp.intent}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              opp.recommendedEdition === 'WEEKLY_EXEGESIS'
                                ? 'bg-indigo-500/20 text-indigo-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {opp.recommendedEdition === 'WEEKLY_EXEGESIS' ? '📖 Weekly Exegesis' : '☀️ Daily Devotional'}
                          </span>
                        </div>
                      </td>

                      {/* Monthly Volume */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-white text-sm flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                          <span>{opp.monthlyVolume.toLocaleString()}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">searches / month</div>
                      </td>

                      {/* Difficulty (KD) */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                              opp.difficulty < 25
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : opp.difficulty < 35
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            KD {opp.difficulty}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {opp.difficulty < 25 ? 'Very Easy' : opp.difficulty < 35 ? 'Moderate' : 'Competitive'}
                          </span>
                        </div>
                      </td>

                      {/* Anchor Scripture */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-serif font-bold text-amber-400 text-xs flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                          <span>{opp.anchorScripture}</span>
                        </div>
                      </td>

                      {/* Coverage Status Badge */}
                      <td className="p-4 whitespace-nowrap">
                        {isCovered && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Covered (Published)</span>
                          </span>
                        )}
                        {isUnderOptimized && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                            <span>Under-Optimized</span>
                          </span>
                        )}
                        {isGap && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/25 text-rose-200 border border-rose-500/50 shadow-xs animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                            <span>Coverage Gap</span>
                          </span>
                        )}
                      </td>

                      {/* Current Content or Gap details */}
                      <td className="p-4 max-w-[260px]">
                        {isCovered && (
                          <div>
                            <div className="font-semibold text-slate-200 text-xs truncate">
                              {matchedNewsletter ? matchedNewsletter.Title : matchedTopic?.Topic}
                            </div>
                            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                              {matchedNewsletter ? `[${matchedNewsletter.NewsletterID}] Published` : `[${matchedTopic?.TopicID}] In Calendar`}
                            </div>
                          </div>
                        )}
                        {isUnderOptimized && (
                          <div>
                            <div className="text-[11px] text-slate-400 line-through truncate">
                              {matchedNewsletter ? matchedNewsletter.Title : matchedTopic?.Topic}
                            </div>
                            <div className="text-xs font-semibold text-amber-300 flex items-center gap-1 mt-0.5">
                              <span>Suggest:</span>
                              <span className="truncate">{revisionSuggestion?.suggestedTitle}</span>
                            </div>
                          </div>
                        )}
                        {isGap && (
                          <div>
                            {matchedTopic ? (
                              <div>
                                <div className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                                  <span className="truncate">Topic [{matchedTopic.TopicID}]: {matchedTopic.Topic}</span>
                                </div>
                                <div className="text-[10px] text-rose-400 font-medium mt-0.5">
                                  ⚠️ Planned in calendar • No newsletter generated yet
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                  <span>No Associated Newsletter</span>
                                </div>
                                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 italic">
                                  Suggested: "{opp.suggestedTopicTitle}"
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {isGap && (
                            <button
                              onClick={() => handleAutoGenerateForGap(item)}
                              disabled={autoGeneratingId === opp.id || isProcessing}
                              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-md hover:shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
                              id={`auto-generate-${opp.id}`}
                              title="Trigger pipeline to generate devotional newsletter for this topic gap"
                            >
                              {autoGeneratingId === opp.id ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                                  <span>Generating...</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                                  <span>Auto-Generate</span>
                                </>
                              )}
                            </button>
                          )}

                          {isGap && !matchedTopic && (
                            <button
                              onClick={() => handleCreateTopicFromOpportunity(opp)}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors"
                              id={`create-topic-gap-${opp.id}`}
                              title="Queue as topic without immediate generation"
                            >
                              <CalendarPlus className="w-3 h-3" />
                              <span>Queue Topic</span>
                            </button>
                          )}

                          {isUnderOptimized && (
                            <button
                              onClick={() => handleApplyRevision(item)}
                              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-xs transition-colors"
                              id={`apply-revision-${opp.id}`}
                              title="Apply suggested SEO title and meta to newsletter"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Apply Revision</span>
                            </button>
                          )}

                          {isCovered && (
                            <span className="text-emerald-400 font-mono text-[11px] font-bold px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/20">
                              ✓ Published & Optimized
                            </span>
                          )}

                          <button
                            onClick={() => setInspectedItem(item)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                            title="Inspect SEO rationale, SERP preview, and angle details"
                          >
                            Inspect
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
        </div>
      )}

      {/* 6. INSPECTION & DETAIL DRAWER MODAL */}
      {inspectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    Topical Opportunity: "{inspectedItem.opportunity.keyword}"
                  </h3>
                  <p className="text-xs text-slate-400">
                    {inspectedItem.opportunity.cluster} • {inspectedItem.opportunity.monthlyVolume.toLocaleString()} searches/mo
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectedItem(null)}
                className="text-slate-400 hover:text-white text-lg font-bold px-2"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Status Banner */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  inspectedItem.status === 'COVERED'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : inspectedItem.status === 'UNDER_OPTIMIZED'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {inspectedItem.status === 'COVERED' && <CheckCircle2 className="w-4 h-4" />}
                  {inspectedItem.status === 'UNDER_OPTIMIZED' && <Lightbulb className="w-4 h-4" />}
                  {inspectedItem.status === 'GAP' && <AlertTriangle className="w-4 h-4" />}
                  <span className="font-bold">
                    {inspectedItem.status === 'COVERED'
                      ? 'Covered with High Topical Authority'
                      : inspectedItem.status === 'UNDER_OPTIMIZED'
                      ? 'Under-Optimized: Revision Suggested'
                      : 'Critical Topical Gap: Content Missing'}
                  </span>
                </div>
                <span className="text-[11px] font-mono">
                  Anchor: {inspectedItem.opportunity.anchorScripture}
                </span>
              </div>

              {/* Rationale & Insight */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">
                  Topical & SEO Rationale
                </span>
                <p className="text-slate-200 leading-relaxed">{inspectedItem.opportunity.topicalRationale}</p>
              </div>

              {/* Current vs Suggested Comparison (If under-optimized) */}
              {inspectedItem.revisionSuggestion && (
                <div className="bg-slate-950 p-3.5 rounded-xl border border-amber-500/30 space-y-2.5">
                  <span className="text-amber-400 font-bold uppercase text-[10px] tracking-wider block">
                    Recommended Title Revision
                  </span>
                  <div className="space-y-1.5">
                    <div className="text-slate-400">
                      <span className="font-bold">Current Title: </span>
                      <span className="line-through">{inspectedItem.revisionSuggestion.originalTitle}</span>
                    </div>
                    <div className="text-amber-300 font-bold text-sm">
                      <span>Suggested Title: </span>
                      <span>{inspectedItem.revisionSuggestion.suggestedTitle}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 italic">
                      {inspectedItem.revisionSuggestion.seoAdvantage}
                    </p>
                  </div>
                </div>
              )}

              {/* Editorial Angle Suggestion */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider block">
                  Suggested Exegesis / Devotional Angle
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {inspectedItem.opportunity.suggestedEditorialAngle}
                </p>
              </div>

              {/* Meta Description Preview */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    Google SERP Snippet Recommendation
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {inspectedItem.opportunity.suggestedMetaDescription.length} chars
                  </span>
                </div>
                <p className="text-slate-300 font-mono text-xs leading-relaxed bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  {inspectedItem.opportunity.suggestedMetaDescription}
                </p>
              </div>

              {/* Action Buttons in Drawer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setInspectedItem(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white font-semibold"
                >
                  Close
                </button>

                {inspectedItem.status === 'GAP' && (
                  <>
                    <button
                      onClick={() => handleAutoGenerateForGap(inspectedItem)}
                      disabled={autoGeneratingId === inspectedItem.opportunity.id || isProcessing}
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 disabled:opacity-50"
                    >
                      {autoGeneratingId === inspectedItem.opportunity.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                          <span>Generating Newsletter...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-slate-950" />
                          <span>Auto-Generate Newsletter</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleCreateTopicFromOpportunity(inspectedItem.opportunity)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-xl border border-slate-700 flex items-center gap-2"
                    >
                      <CalendarPlus className="w-4 h-4" />
                      <span>Queue Topic Only</span>
                    </button>
                  </>
                )}

                {inspectedItem.status === 'UNDER_OPTIMIZED' && (
                  <button
                    onClick={() => handleApplyRevision(inspectedItem)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Apply Revision Now</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. ADD CUSTOM KEYWORD MODAL */}
      {showAddCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">Track Custom Keyword</h3>
                  <p className="text-xs text-slate-400">Add a search query to monitor for topical authority</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddCustomModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCustomKeyword} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Target Search Query / Keyword <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. how to hear god's voice clearly"
                  value={newCustomKeyword.keyword}
                  onChange={(e) =>
                    setNewCustomKeyword({ ...newCustomKeyword, keyword: e.target.value })
                  }
                  className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Est. Monthly Searches
                  </label>
                  <input
                    type="number"
                    value={newCustomKeyword.monthlyVolume}
                    onChange={(e) =>
                      setNewCustomKeyword({
                        ...newCustomKeyword,
                        monthlyVolume: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Keyword Difficulty (KD 0-100)
                  </label>
                  <input
                    type="number"
                    max={100}
                    min={0}
                    value={newCustomKeyword.difficulty}
                    onChange={(e) =>
                      setNewCustomKeyword({
                        ...newCustomKeyword,
                        difficulty: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Anchor Scripture Citation <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John 10:27, Isaiah 53:5"
                    value={newCustomKeyword.anchorScripture}
                    onChange={(e) =>
                      setNewCustomKeyword({
                        ...newCustomKeyword,
                        anchorScripture: e.target.value,
                      })
                    }
                    className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Doctrinal Pillar / Cluster
                  </label>
                  <select
                    value={newCustomKeyword.cluster}
                    onChange={(e) =>
                      setNewCustomKeyword({ ...newCustomKeyword, cluster: e.target.value as any })
                    }
                    className="w-full bg-slate-950 text-white px-3 py-2.5 rounded-xl border border-slate-800"
                  >
                    {clusters.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Suggested Topic Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. My Sheep Hear My Voice: How to Hear God Clearly in Daily Life"
                  value={newCustomKeyword.suggestedTopicTitle}
                  onChange={(e) =>
                    setNewCustomKeyword({
                      ...newCustomKeyword,
                      suggestedTopicTitle: e.target.value,
                    })
                  }
                  className="w-full bg-slate-950 text-white px-3.5 py-2.5 rounded-xl border border-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-md"
                >
                  Track Keyword
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
