export type TopicStatus =
  | 'PENDING'
  | 'GENERATING'
  | 'DRAFT'
  | 'AWAITING_APPROVAL'
  | 'APPROVED'
  | 'GENERATING_MEDIA'
  | 'READY_TO_PUBLISH'
  | 'PUBLISHING'
  | 'PUBLISHED'
  | 'FAILED';

export type NewsletterEdition = 'DAILY_DEVOTIONAL' | 'WEEKLY_EXEGESIS';

export type EditionPreference = 'ALL' | 'DAILY_DEVOTIONAL' | 'WEEKLY_EXEGESIS';

export interface NewsletterEditionInfo {
  id: NewsletterEdition;
  name: string;
  subtitle: string;
  frequency: string;
  badge: string;
  color: string;
  description: string;
  iconName: string;
}

export const NEWSLETTER_EDITIONS: Record<NewsletterEdition, NewsletterEditionInfo> = {
  DAILY_DEVOTIONAL: {
    id: 'DAILY_DEVOTIONAL',
    name: 'Daily Devotional',
    subtitle: 'Morning Grace & Daily Manna',
    frequency: 'Daily (Tue–Sun)',
    badge: '☀️ Daily Devotional',
    color: 'amber',
    description: '5-minute scripture study, morning prayer points, daily declarations, and practical faith encouragement to start each day strong.',
    iconName: 'Sun',
  },
  WEEKLY_EXEGESIS: {
    id: 'WEEKLY_EXEGESIS',
    name: 'Weekly Deep Exegesis',
    subtitle: 'Kingdom Leadership & Expository Studies',
    frequency: 'Weekly (Mondays)',
    badge: '📖 Weekly Deep Exegesis',
    color: 'indigo',
    description: 'Comprehensive theological exposition, original Greek/Hebrew exegetical insights, leadership principles, infographics, and companion video studies.',
    iconName: 'BookOpen',
  },
};

export type EmailCampaignStatus =
  | 'NOT_SENT'
  | 'QUEUED'
  | 'SENDING'
  | 'SENT'
  | 'PARTIAL'
  | 'FAILED';

export type SubscriberStatus =
  | 'ACTIVE'
  | 'UNSUBSCRIBED'
  | 'BOUNCED'
  | 'BLOCKED'
  | 'INVALID';

export interface Topic {
  TopicID: string;
  Topic: string;
  Scripture: string;
  Theme: string;
  Notes: string;
  PublishDate: string;
  Priority: 'HIGH' | 'MEDIUM' | 'LOW';
  Status: TopicStatus;
  Edition?: NewsletterEdition;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface KeyPoint {
  title: string;
  content: string;
}

export interface BibleVerseItem {
  verseNumber: number | string;
  verseText: string;
}

export interface Newsletter {
  NewsletterID: string;
  TopicID?: string;
  Edition?: NewsletterEdition;
  Title: string;
  Slug: string;
  ScriptureReference: string;
  ScriptureText: string;
  // Bible Chapter & Verses breakdown fields
  BibleBook?: string;
  BibleChapter?: number | string;
  BibleVerses?: string;
  BibleTranslation?: string;
  FullChapterContext?: string;
  VersesBreakdown?: BibleVerseItem[];
  Theme: string;
  Opening: string;
  Teaching: string;
  KeyPoint1Title?: string;
  KeyPoint1Body?: string;
  KeyPoint2Title?: string;
  KeyPoint2Body?: string;
  KeyPoint3Title?: string;
  KeyPoint3Body?: string;
  PracticalApplication: string;
  Prayer: string;
  Closing?: string;
  Excerpt: string;
  FeaturedImageURL: string;
  InfographicURL?: string;
  GoogleDocURL?: string;
  VideoURL?: string;
  YouTubeURL?: string;
  AudioURL?: string;
  AudioNarrationDuration?: string;
  AudioVoice?: string;
  AudioTranscript?: string;
  MetaTitle: string;
  MetaDescription: string;
  Keywords?: string[];
  CanonicalURL?: string;
  PublishDate: string;
  Status: TopicStatus;
  
  // Social content
  FacebookPost?: string;
  InstagramCaption?: string;
  InstagramHashtags?: string[];
  TikTokCaption?: string;
  TikTokHashtags?: string[];
  YouTubeShortHook?: string;
  YouTubeShortNarration?: string;
  YouTubeShortCTA?: string;
  YouTubeTitle?: string;
  YouTubeDescription?: string;
  YouTubeTags?: string[];
  FeaturedImagePrompt?: string;
  InfographicPrompt?: string;
  VeoVideoPrompt?: string;

  // Email status
  EmailStatus: EmailCampaignStatus;
  EmailStartedAt?: string;
  EmailCompletedAt?: string;
  RecipientsAttempted: number;
  RecipientsSent: number;
  RecipientsFailed: number;

  CreatedAt: string;
  UpdatedAt: string;
}

export interface SubscriberGroup {
  GroupID: string;
  Name: string;
  Description: string;
  Color: string;
  MemberCount?: number;
  CreatedAt: string;
}

export interface Subscriber {
  SubscriberID: string;
  Name: string;
  Email: string;
  DateSubscribed: string;
  Status: SubscriberStatus;
  Source: string;
  UnsubscribeToken: string;
  Group?: string;
  EditionPreference?: 'ALL' | 'DAILY_DEVOTIONAL' | 'WEEKLY_EXEGESIS';
  LastNewsletterID?: string;
  LastEmailSent?: string;
  EmailStatus?: string;
  SendCount: number;
}

export interface EmailLog {
  EmailLogID: string;
  NewsletterID: string;
  SubscriberID: string;
  Email: string;
  SentAt: string;
  Status: 'SENT' | 'FAILED' | 'SKIPPED';
  ErrorMessage?: string;
  AttemptNumber: number;
}

export interface VideoItem {
  VideoID: string;
  NewsletterID?: string;
  Title: string;
  Description: string;
  ScriptureReference?: string;
  ScriptureText?: string;
  ThumbnailURL: string;
  YouTubeURL: string;
  Duration: string;
  Type: 'Short' | 'Full Video' | 'Veo Devotional';
  PublishDate: string;
  Status: 'PUBLISHED' | 'QUEUED' | 'GENERATING' | 'FAILED';
  Views: number;
}

export interface SystemLog {
  Timestamp: string;
  JobID: string;
  TopicID?: string;
  NewsletterID?: string;
  SubscriberID?: string;
  Function: string;
  Status: 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR';
  Message: string;
  ErrorDetails?: string;
  RetryCount: number;
}

export interface AppSettings {
  AutomationEnabled: boolean;
  AutoGenerate: boolean;
  AutoPublish: boolean;
  AutoEmail: boolean;
  AutoGenerateImages: boolean;
  AutoGenerateInfographic: boolean;
  AutoGenerateVideo: boolean;
  AutoUploadYouTube: boolean;
  EmailBatchSize: number;
  DefaultPublishFrequency: string;
  AdminEmail: string;
  TestEmail: string;
  WebsiteURL: string;
  YouTubeChannelID: string;
  SenderName: string;
  ReplyToEmail: string;
  EmailEnabled: boolean;
  WelcomeEmailEnabled: boolean;
  AdminPassword?: string;
  AdminPin?: string;
}

export interface GeminiStructuredNewsletterResponse {
  newsletter: {
    title: string;
    slug: string;
    opening: string;
    key_scripture: {
      reference: string;
      text: string;
    };
    teaching: string;
    key_points: Array<{
      title: string;
      content: string;
    }>;
    practical_application: string;
    prayer: string;
    closing: string;
    excerpt: string;
  };
  facebook: {
    post: string;
  };
  instagram: {
    caption: string;
    hashtags: string[];
  };
  tiktok: {
    caption: string;
    hashtags: string[];
  };
  youtube_short: {
    hook: string;
    narration: string;
    closing_cta: string;
  };
  youtube: {
    title: string;
    description: string;
    tags: string[];
  };
  images: {
    featured_image_prompt: string;
    infographic_prompt: string;
  };
  video: {
    veo_prompt: string;
  };
  seo: {
    meta_title: string;
    meta_description: string;
    keywords: string[];
  };
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  topic: string;
  topicSlug: string;
  pillarSlug?: string;
  relatedNewsletterSlug?: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  excerpt: string;
  publishDate: string;
  readTimeMinutes: number;
  author: {
    name: string;
    role: string;
    avatarUrl: string;
  };
  featuredImageUrl: string;
  featuredImageAlt: string;
  scriptureReference: string;
  scriptureText: string;
  hebrewGreekWordStudy?: {
    term: string;
    originalScript: string;
    transliteration: string;
    strongsNumber: string;
    definition: string;
    theologicalSignificance: string;
  };
  tableOfContents: { id: string; title: string }[];
  contentSections: {
    id: string;
    heading: string;
    paragraphs: string[];
    subsections?: {
      title: string;
      body: string;
    }[];
    callout?: {
      type: 'quote' | 'scripture' | 'insight';
      text: string;
      citation?: string;
    };
  }[];
  keyTakeaways: string[];
  prayerDeclaration: string;
  faqItems: {
    question: string;
    answer: string;
  }[];
  metaTitle: string;
  metaDescription: string;
}
