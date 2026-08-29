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
  CreatedAt: string;
  UpdatedAt: string;
}

export interface KeyPoint {
  title: string;
  content: string;
}

export interface Newsletter {
  NewsletterID: string;
  TopicID: string;
  Title: string;
  Slug: string;
  ScriptureReference: string;
  ScriptureText: string;
  Theme: string;
  Opening: string;
  Teaching: string;
  KeyPoint1Title: string;
  KeyPoint1Body: string;
  KeyPoint2Title: string;
  KeyPoint2Body: string;
  KeyPoint3Title: string;
  KeyPoint3Body: string;
  PracticalApplication: string;
  Prayer: string;
  Closing: string;
  Excerpt: string;
  FeaturedImageURL: string;
  InfographicURL: string;
  GoogleDocURL: string;
  VideoURL: string;
  YouTubeURL: string;
  MetaTitle: string;
  MetaDescription: string;
  Keywords?: string[];
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
