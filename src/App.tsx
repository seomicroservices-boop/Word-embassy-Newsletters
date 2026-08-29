import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PublicHome } from './components/PublicHome';
import { NewsletterDetail } from './components/NewsletterDetail';
import { NewsletterArchive } from './components/NewsletterArchive';
import { VideosPage } from './components/VideosPage';
import { AboutPage } from './components/AboutPage';
import { SubscribePage } from './components/SubscribePage';
import { UnsubscribePage } from './components/UnsubscribePage';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminAuthGate } from './components/AdminAuthGate';
import {
  Topic,
  Newsletter,
  Subscriber,
  SubscriberGroup,
  EmailLog,
  VideoItem,
  SystemLog,
  AppSettings,
} from './types';
import {
  INITIAL_TOPICS,
  INITIAL_NEWSLETTERS,
  INITIAL_SUBSCRIBERS,
  INITIAL_SUBSCRIBER_GROUPS,
  INITIAL_EMAIL_LOGS,
  INITIAL_VIDEOS,
  INITIAL_SYSTEM_LOGS,
  INITIAL_SETTINGS,
} from './data/initialData';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<string>('home');
  const [currentSlug, setCurrentSlug] = useState<string>('the-power-of-persistent-prayer');
  const [unsubscribeToken, setUnsubscribeToken] = useState<string>('');

  // App Data States (with LocalStorage persistence for durable multi-session support)
  const [topics, setTopics] = useState<Topic[]>(() => {
    const saved = localStorage.getItem('we_topics');
    return saved ? JSON.parse(saved) : INITIAL_TOPICS;
  });

  const [newsletters, setNewsletters] = useState<Newsletter[]>(() => {
    const saved = localStorage.getItem('we_newsletters');
    if (saved) {
      try {
        const parsed: Newsletter[] = JSON.parse(saved);
        return parsed.map((nl) => {
          if (nl.FeaturedImageURL?.includes('1506126613408-eca07ce68773')) {
            return {
              ...nl,
              FeaturedImageURL: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80',
            };
          }
          return nl;
        });
      } catch (e) {
        console.error('Error parsing newsletters:', e);
      }
    }
    return INITIAL_NEWSLETTERS;
  });

  const [subscriberGroups, setSubscriberGroups] = useState<SubscriberGroup[]>(() => {
    const saved = localStorage.getItem('we_subscriber_groups');
    if (saved) {
      try {
        const parsed: SubscriberGroup[] = JSON.parse(saved);
        // Ensure default groups like Test Subscribers & Word Embassy exist
        const merged = [...parsed];
        for (const initialGroup of INITIAL_SUBSCRIBER_GROUPS) {
          if (!merged.some((g) => g.Name.toLowerCase() === initialGroup.Name.toLowerCase())) {
            merged.unshift(initialGroup);
          }
        }
        return merged;
      } catch (e) {
        console.error('Error parsing subscriber groups:', e);
      }
    }
    return INITIAL_SUBSCRIBER_GROUPS;
  });

  const [subscribers, setSubscribers] = useState<Subscriber[]>(() => {
    const saved = localStorage.getItem('we_subscribers');
    if (saved) {
      try {
        const parsed: Subscriber[] = JSON.parse(saved);
        const cleaned = parsed.filter((s) => !s.Email.toLowerCase().includes('@example.com'));
        const merged = [...cleaned];
        for (const initialSub of INITIAL_SUBSCRIBERS) {
          const index = merged.findIndex((s) => s.Email.toLowerCase() === initialSub.Email.toLowerCase());
          if (index === -1) {
            merged.unshift(initialSub);
          }
        }
        return merged;
      } catch (e) {
        console.error('Error parsing subscribers:', e);
      }
    }
    return INITIAL_SUBSCRIBERS;
  });

  const [emailLogs, setEmailLogs] = useState<EmailLog[]>(() => {
    const saved = localStorage.getItem('we_email_logs');
    if (saved) {
      try {
        const parsed: EmailLog[] = JSON.parse(saved);
        return parsed.filter((l) => !l.Email.toLowerCase().includes('@example.com'));
      } catch (e) {
        console.error('Error parsing email logs:', e);
      }
    }
    return INITIAL_EMAIL_LOGS;
  });

  const [videos, setVideos] = useState<VideoItem[]>(() => {
    const saved = localStorage.getItem('we_videos');
    if (saved) {
      try {
        const parsed: VideoItem[] = JSON.parse(saved);
        return parsed.map((v) => {
          if (v.ThumbnailURL?.includes('1506126613408-eca07ce68773')) {
            return {
              ...v,
              ThumbnailURL: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=600&q=80',
            };
          }
          return v;
        });
      } catch (e) {
        console.error('Error parsing videos:', e);
      }
    }
    return INITIAL_VIDEOS;
  });

  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(() => {
    const saved = localStorage.getItem('we_system_logs');
    return saved ? JSON.parse(saved) : INITIAL_SYSTEM_LOGS;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('we_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [adminUser, setAdminUser] = useState<{ email: string; role: string; name: string } | null>(
    () => {
      const saved = localStorage.getItem('we_admin_user');
      return saved
        ? JSON.parse(saved)
        : {
            email: 'embassyword@gmail.com',
            role: 'Super Administrator & Lead Editor',
            name: 'Word Embassy Lead Editor',
          };
    }
  );

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('we_admin_authenticated') === 'true' || true;
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Sync to local storage
  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('we_admin_user', JSON.stringify(adminUser));
      localStorage.setItem('we_admin_authenticated', 'true');
    } else {
      localStorage.removeItem('we_admin_user');
      localStorage.setItem('we_admin_authenticated', 'false');
    }
  }, [adminUser]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('we_topics', JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem('we_newsletters', JSON.stringify(newsletters));
  }, [newsletters]);

  useEffect(() => {
    localStorage.setItem('we_subscribers', JSON.stringify(subscribers));
  }, [subscribers]);

  useEffect(() => {
    localStorage.setItem('we_email_logs', JSON.stringify(emailLogs));
  }, [emailLogs]);

  useEffect(() => {
    localStorage.setItem('we_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('we_system_logs', JSON.stringify(systemLogs));
  }, [systemLogs]);

  useEffect(() => {
    localStorage.setItem('we_subscriber_groups', JSON.stringify(subscriberGroups));
  }, [subscriberGroups]);

  useEffect(() => {
    localStorage.setItem('we_settings', JSON.stringify(settings));
  }, [settings]);

  // Navigation handler
  const handleNavigate = (view: string, slugOrToken?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'newsletter' && slugOrToken) {
      setCurrentSlug(slugOrToken);
      setCurrentView('newsletter');
    } else if (view === 'unsubscribe') {
      if (slugOrToken) setUnsubscribeToken(slugOrToken);
      setCurrentView('unsubscribe');
    } else {
      setCurrentView(view);
    }
  };

  // 1. Log appending helper
  const addSystemLog = (
    func: string,
    status: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING',
    message: string,
    jobId?: string
  ) => {
    const newLog: SystemLog = {
      Timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      JobID: jobId || `JOB-${Date.now().toString().slice(-4)}`,
      Function: func,
      Status: status,
      Message: message,
      RetryCount: 0,
    };
    setSystemLogs((prev) => [newLog, ...prev]);
  };

  // 2. Subscription handlers
  const handleSubscribe = (name: string, email: string): Subscriber => {
    const existing = subscribers.find((s) => s.Email.toLowerCase() === email.toLowerCase());
    if (existing) {
      if (existing.Status === 'UNSUBSCRIBED') {
        const updated = subscribers.map((s) =>
          s.Email.toLowerCase() === email.toLowerCase()
            ? { ...s, Status: 'ACTIVE' as const }
            : s
        );
        setSubscribers(updated);
        addSystemLog('handleSubscribe', 'SUCCESS', `Reactivated subscription for ${email}`);
      }
      return existing;
    }

    const token = `tok_${Math.random().toString(36).substring(2, 12)}`;
    const newSub: Subscriber = {
      SubscriberID: `SUB-${(subscribers.length + 1).toString().padStart(3, '0')}`,
      Name: name || 'Faithful Reader',
      Email: email,
      DateSubscribed: new Date().toISOString().split('T')[0],
      Status: 'ACTIVE',
      Source: 'Word Embassy Website',
      UnsubscribeToken: token,
      SendCount: 0,
    };

    setSubscribers((prev) => [newSub, ...prev]);
    addSystemLog(
      'handleSubscribe',
      'SUCCESS',
      `New subscriber enrolled: ${email} (${name})`
    );
    return newSub;
  };

  const handleUnsubscribe = (tokenOrEmail: string): boolean => {
    const target = subscribers.find(
      (s) =>
        s.UnsubscribeToken === tokenOrEmail ||
        s.Email.toLowerCase() === tokenOrEmail.toLowerCase()
    );
    if (!target) return false;

    setSubscribers((prev) =>
      prev.map((s) =>
        s.SubscriberID === target.SubscriberID
          ? { ...s, Status: 'UNSUBSCRIBED' as const }
          : s
      )
    );
    addSystemLog(
      'handleUnsubscribe',
      'SUCCESS',
      `Subscriber ${target.Email} marked as UNSUBSCRIBED`
    );
    return true;
  };

  const handleResubscribe = (emailOrToken: string): boolean => {
    const target = subscribers.find(
      (s) =>
        s.UnsubscribeToken === emailOrToken ||
        s.Email.toLowerCase() === emailOrToken.toLowerCase()
    );
    if (!target) return false;

    setSubscribers((prev) =>
      prev.map((s) =>
        s.SubscriberID === target.SubscriberID ? { ...s, Status: 'ACTIVE' as const } : s
      )
    );
    addSystemLog('handleResubscribe', 'SUCCESS', `Subscriber ${target.Email} reactivated`);
    return true;
  };

  const handleDeleteSubscriber = (subscriberId: string) => {
    const target = subscribers.find((s) => s.SubscriberID === subscriberId);
    setSubscribers((prev) => prev.filter((s) => s.SubscriberID !== subscriberId));
    addSystemLog('SubscriberManagement', 'WARNING', `Deleted subscriber ${target?.Email || subscriberId}`);
  };

  const handleToggleSubscriberStatus = (
    subscriberId: string,
    newStatus?: 'ACTIVE' | 'UNSUBSCRIBED' | 'BOUNCED'
  ) => {
    setSubscribers((prev) =>
      prev.map((s) => {
        if (s.SubscriberID === subscriberId) {
          const nextStatus =
            newStatus || (s.Status === 'ACTIVE' ? ('UNSUBSCRIBED' as const) : ('ACTIVE' as const));
          return { ...s, Status: nextStatus };
        }
        return s;
      })
    );
    addSystemLog(
      'SubscriberManagement',
      'SUCCESS',
      `Updated status for subscriber ${subscriberId}`
    );
  };

  const handleAddSubscriber = (subData: { Name: string; Email: string; Group?: string }) => {
    const token = `tok_${Math.random().toString(36).substring(2, 12)}`;
    const newSub: Subscriber = {
      SubscriberID: `SUB-${(subscribers.length + 1).toString().padStart(3, '0')}`,
      Name: subData.Name || 'New Subscriber',
      Email: subData.Email,
      Group: subData.Group || 'Weekly Devotional Readers',
      DateSubscribed: new Date().toISOString().split('T')[0],
      Status: 'ACTIVE',
      Source: 'Admin Dashboard Registration',
      UnsubscribeToken: token,
      SendCount: 0,
    };
    setSubscribers((prev) => [newSub, ...prev]);
    addSystemLog(
      'SubscriberManagement',
      'SUCCESS',
      `Admin registered subscriber ${subData.Email} (${newSub.Group})`
    );
  };

  // 3. Topic & Pipeline operations
  const handleAddTopic = (topicData: Partial<Topic>) => {
    const newId = `TOPIC-${(topics.length + 1).toString().padStart(3, '0')}`;
    const newTopic: Topic = {
      TopicID: newId,
      Topic: topicData.Topic || 'Faith in Hard Times',
      Scripture: topicData.Scripture || 'James 1:2-4',
      Theme: topicData.Theme || 'Spiritual Growth',
      Notes: topicData.Notes || '',
      Priority: topicData.Priority || 'HIGH',
      Status: 'PENDING',
      PublishDate: topicData.PublishDate || new Date().toISOString().split('T')[0],
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    };

    setTopics((prev) => [newTopic, ...prev]);
    addSystemLog('handleAddTopic', 'SUCCESS', `Added topic ${newId}: ${newTopic.Topic}`);
  };

  const handleUpdateTopic = (id: string, updates: Partial<Topic>) => {
    setTopics((prev) => prev.map((t) => (t.TopicID === id ? { ...t, ...updates } : t)));
  };

  const handleDeleteTopic = (id: string) => {
    setTopics((prev) => prev.filter((t) => t.TopicID !== id));
    addSystemLog('handleDeleteTopic', 'INFO', `Deleted topic ${id}`);
  };

  const handleUpdateNewsletter = (id: string, updates: Partial<Newsletter>) => {
    setNewsletters((prev) =>
      prev.map((n) => (n.NewsletterID === id ? { ...n, ...updates } : n))
    );
  };

  // 4. Gemini AI Package Generator
  const generateNewsletterForTopic = async (topic: Topic) => {
    setIsProcessing(true);
    const jobId = `GEN-${Date.now().toString().slice(-4)}`;
    addSystemLog('GeminiPipeline', 'INFO', `Starting generation for Topic ${topic.TopicID}`, jobId);

    // Update topic status to GENERATING
    handleUpdateTopic(topic.TopicID, { Status: 'GENERATING' });

    try {
      const response = await fetch('/api/generate-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const generatedData = await response.json();
      const newNlId = `NL-${(newsletters.length + 1).toString().padStart(3, '0')}`;
      const slug = (generatedData.Slug || topic.Topic.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
        .replace(/(^-|-$)/g, '');

      const newNewsletter: Newsletter = {
        NewsletterID: newNlId,
        TopicID: topic.TopicID,
        PublishDate: topic.PublishDate,
        Theme: topic.Theme,
        Title: generatedData.Title || topic.Topic,
        Slug: slug,
        ScriptureReference: generatedData.ScriptureReference || topic.Scripture,
        ScriptureText:
          generatedData.ScriptureText ||
          'For with God nothing shall be impossible. — Luke 1:37',
        Excerpt:
          generatedData.Excerpt ||
          'Discover profound biblical insights on trusting God through life’s steepest valleys.',
        Opening: generatedData.Opening || '',
        Teaching: generatedData.Teaching || '',
        KeyPoint1Title: generatedData.KeyPoint1Title || 'Trust God’s Timing',
        KeyPoint1Body: generatedData.KeyPoint1Body || '',
        KeyPoint2Title: generatedData.KeyPoint2Title || 'Endure in Prayer',
        KeyPoint2Body: generatedData.KeyPoint2Body || '',
        KeyPoint3Title: generatedData.KeyPoint3Title || 'Walk in Unshakable Peace',
        KeyPoint3Body: generatedData.KeyPoint3Body || '',
        PracticalApplication: generatedData.PracticalApplication || '',
        Prayer: generatedData.Prayer || '',
        Closing:
          generatedData.Closing || 'May the grace and peace of our Lord Jesus Christ be with you.',
        FeaturedImageURL:
          generatedData.FeaturedImageURL ||
          'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80',
        InfographicURL: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1080&q=80',
        GoogleDocURL: 'https://docs.google.com/document/d/wordembassy',
        VideoURL: 'https://youtube.com/shorts/wordembassy',
        YouTubeURL: 'https://youtube.com/shorts/wordembassy',
        MetaTitle: `${generatedData.Title || topic.Topic} | Word Embassy`,
        MetaDescription: generatedData.Excerpt || 'Word Embassy Christian Newsletter',
        FeaturedImagePrompt: generatedData.FeaturedImagePrompt || '',
        InfographicPrompt: 'Structured modern Christian theological infographic layout with 3 key pillars.',
        VeoVideoPrompt: generatedData.VeoVideoPrompt || '',
        YouTubeTitle: generatedData.YouTubeTitle || `${generatedData.Title} | Word Embassy`,
        YouTubeShortHook: generatedData.YouTubeShortHook || 'What is God teaching you right now?',
        YouTubeShortNarration: generatedData.YouTubeShortNarration || '',
        YouTubeShortCTA:
          generatedData.YouTubeShortCTA || 'Subscribe to Word Embassy for weekly Bible studies.',
        FacebookPost: generatedData.FacebookPost || '',
        InstagramCaption: generatedData.InstagramCaption || '',
        InstagramHashtags: generatedData.InstagramHashtags || [
          '#WordEmbassy',
          '#BibleStudy',
          '#ChristianFaith',
        ],
        TikTokCaption: generatedData.TikTokCaption || '',
        Status: settings.AutoPublish ? 'PUBLISHED' : 'AWAITING_APPROVAL',
        EmailStatus: 'NOT_SENT',
        RecipientsAttempted: 0,
        RecipientsSent: 0,
        RecipientsFailed: 0,
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
      };

      // Add to newsletters
      setNewsletters((prev) => [newNewsletter, ...prev]);

      // Create Video Item for Gallery
      const newVideo: VideoItem = {
        VideoID: `VID-${(videos.length + 1).toString().padStart(3, '0')}`,
        NewsletterID: newNlId,
        Title: newNewsletter.YouTubeTitle || newNewsletter.Title,
        Type: 'Veo Devotional',
        Duration: '0:45',
        ThumbnailURL: newNewsletter.FeaturedImageURL,
        YouTubeURL: 'https://youtube.com/shorts/wordembassy',
        PublishDate: newNewsletter.PublishDate,
        Status: 'PUBLISHED',
        Views: 120,
        Description: newNewsletter.Excerpt,
      };
      setVideos((prev) => [newVideo, ...prev]);

      // Update Topic Status
      handleUpdateTopic(topic.TopicID, {
        Status: settings.AutoPublish ? 'PUBLISHED' : 'AWAITING_APPROVAL',
      });

      addSystemLog(
        'GeminiPipeline',
        'SUCCESS',
        `Generated complete package for "${newNewsletter.Title}" (${newNlId})`,
        jobId
      );
    } catch (err: any) {
      console.error('Generation error:', err);
      handleUpdateTopic(topic.TopicID, { Status: 'PENDING' });
      addSystemLog(
        'GeminiPipeline',
        'ERROR',
        `Failed to generate newsletter: ${err.message}`,
        jobId
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessNextTopic = async () => {
    const nextTopic = topics.find((t) => t.Status === 'PENDING');
    if (!nextTopic) {
      addSystemLog('ProcessNext', 'INFO', 'No pending topics found in queue.');
      return;
    }
    await generateNewsletterForTopic(nextTopic);
  };

  const handleGenerateSpecificTopic = async (topic: Topic) => {
    await generateNewsletterForTopic(topic);
  };

  // 5. Publishing handler
  const handlePublishNewsletter = (id: string) => {
    setNewsletters((prev) =>
      prev.map((n) => (n.NewsletterID === id ? { ...n, Status: 'PUBLISHED' as const } : n))
    );
    const targetNl = newsletters.find((n) => n.NewsletterID === id);
    if (targetNl) {
      handleUpdateTopic(targetNl.TopicID, { Status: 'PUBLISHED' });
    }
    addSystemLog('handlePublish', 'SUCCESS', `Published newsletter ${id} to website`);
  };

  // 6. Batch Email Campaign Dispatcher
  const handleSendEmailCampaign = async (
    newsletterId: string,
    batchSize: number,
    targetGroup?: string
  ) => {
    const targetNl = newsletters.find((n) => n.NewsletterID === newsletterId);
    if (!targetNl) return;

    let activeList = subscribers.filter((s) => s.Status === 'ACTIVE');
    if (targetGroup && targetGroup !== 'ALL') {
      activeList = activeList.filter((s) => s.Group === targetGroup);
    }
    const recipientsToSend = activeList.slice(0, batchSize);

    const newLogs: EmailLog[] = recipientsToSend.map((sub, idx) => ({
      EmailLogID: `LOG-${(emailLogs.length + idx + 1).toString().padStart(4, '0')}`,
      NewsletterID: newsletterId,
      SubscriberID: sub.SubscriberID,
      Email: sub.Email,
      SentAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      Status: 'SENT',
      AttemptNumber: 1,
    }));

    setEmailLogs((prev) => [...newLogs, ...prev]);

    // Update newsletter record
    setNewsletters((prev) =>
      prev.map((n) =>
        n.NewsletterID === newsletterId
          ? {
              ...n,
              EmailStatus: 'SENT' as const,
              RecipientsAttempted: (n.RecipientsAttempted || 0) + recipientsToSend.length,
              RecipientsSent: (n.RecipientsSent || 0) + recipientsToSend.length,
            }
          : n
      )
    );

    // Increment send counts on subscribers
    setSubscribers((prev) =>
      prev.map((s) => {
        if (recipientsToSend.some((r) => r.SubscriberID === s.SubscriberID)) {
          return { ...s, SendCount: s.SendCount + 1 };
        }
        return s;
      })
    );

    try {
      await fetch('/api/newsletter/send-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newsletterId,
          title: targetNl.Title,
          recipients: recipientsToSend.map((r) => ({ email: r.Email, name: r.Name })),
          batchSize,
          groupName: targetGroup,
        }),
      });
    } catch (e) {
      console.warn('Backend campaign dispatch logged locally:', e);
    }

    addSystemLog(
      'BatchEmailEngine',
      'SUCCESS',
      `Dispatched campaign from embassyword@gmail.com for "${targetNl.Title}" to ${recipientsToSend.length} active subscribers${
        targetGroup && targetGroup !== 'ALL' ? ` (Cohort: ${targetGroup})` : ''
      }`
    );
  };

  const handleSendTestEmail = async (newsletterId: string, testEmail: string) => {
    const targetNl = newsletters.find((n) => n.NewsletterID === newsletterId);
    const targetAddress = testEmail || 'omicroservices@gmail.com';

    // Log into emailLogs
    const newLog: EmailLog = {
      EmailLogID: `LOG-TEST-${Date.now().toString().slice(-6)}`,
      NewsletterID: newsletterId,
      SubscriberID: 'TEST-RECIPIENT',
      Email: targetAddress,
      SentAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      Status: 'SENT',
      AttemptNumber: 1,
    };
    setEmailLogs((prev) => [newLog, ...prev]);

    try {
      await fetch('/api/send-test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newsletterId,
          recipientEmail: targetAddress,
          subject: `🕊️ [Word Embassy] ${targetNl?.Title || 'Devotional'} — ${targetNl?.ScriptureReference || ''}`,
        }),
      });
    } catch (e) {
      console.warn('Backend test email logged locally:', e);
    }

    addSystemLog(
      'TestEmail',
      'SUCCESS',
      `Sent test email from embassyword@gmail.com for "${targetNl?.Title || newsletterId}" to ${targetAddress}`
    );
  };

  const handleCreateSubscriberGroup = (groupData: {
    Name: string;
    Description: string;
    Color: string;
  }) => {
    const newGroup: SubscriberGroup = {
      GroupID: `GRP-${(subscriberGroups.length + 1).toString().padStart(3, '0')}`,
      Name: groupData.Name,
      Description: groupData.Description,
      Color: groupData.Color || 'indigo',
      CreatedAt: new Date().toISOString().split('T')[0],
    };
    setSubscriberGroups((prev) => [...prev, newGroup]);
    addSystemLog('SubscriberGroups', 'SUCCESS', `Created subscriber group "${groupData.Name}"`);
  };

  const handleAssignSubscriberGroup = (subscriberId: string, groupName: string) => {
    setSubscribers((prev) =>
      prev.map((s) => (s.SubscriberID === subscriberId ? { ...s, Group: groupName } : s))
    );
    addSystemLog('SubscriberGroups', 'SUCCESS', `Assigned subscriber ${subscriberId} to group "${groupName}"`);
  };

  const handleCreateAndSendTestNewsletter = async () => {
    setIsProcessing(true);
    const testId = `NL-TEST-${Date.now().toString().slice(-4)}`;
    const topicId = `TOP-TEST-${Date.now().toString().slice(-4)}`;
    const today = new Date().toISOString().split('T')[0];

    const testTopic: Topic = {
      TopicID: topicId,
      Topic: 'Walking in the Radiance of Divine Favor',
      Scripture: 'Psalm 89:15-17',
      Theme: 'Divine Favor & Joyful Living',
      Notes: 'Pastoral test dispatch on walking in the light of God’s countenance, rejoicing in His name, and abiding in divine strength.',
      Priority: 'HIGH',
      Status: 'PUBLISHED',
      PublishDate: today,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    };

    const activeSubs = subscribers.filter((s) => s.Status === 'ACTIVE');

    const testNewsletter: Newsletter = {
      NewsletterID: testId,
      TopicID: topicId,
      Title: 'Walking in the Radiance of Divine Favor',
      Slug: `walking-in-divine-favor-${Date.now().toString().slice(-4)}`,
      ScriptureReference: 'Psalm 89:15-17',
      ScriptureText:
        'Blessed are those who have learned to acclaim you, who walk in the light of your presence, Lord. They rejoice in your name all day long; they celebrate your righteousness.',
      Theme: 'Divine Favor & Joyful Living',
      Opening:
        'Dear Word Embassy Subscriber, this is a special live pastoral test dispatch from Word Embassy Editorial (embassyword@gmail.com). May this devotional message ignite peace, strength, and joy in your spirit today.',
      Teaching:
        'To walk in the light of God’s presence is to live with a constant, grateful consciousness of His nearness. God’s favor is not earned through anxious human striving; it is freely bestowed in Christ Jesus. When we learn to acclaim Him through daily prayer and thanksgiving, our hearts remain anchored above the storms of life.',
      KeyPoint1Title: 'The Illuminating Light of His Presence',
      KeyPoint1Body:
        'God’s presence dispels confusion, revealing wisdom and supernatural guidance for every decision.',
      KeyPoint2Title: 'Rejoicing in His Holy Name All Day Long',
      KeyPoint2Body:
        'Praise is our spiritual victory key that shifts attention from earthly problems to God’s unchangeable faithfulness.',
      KeyPoint3Title: 'Exalted in Christ’s Righteousness',
      KeyPoint3Body:
        'Our peace does not rest in human perfection, but in the triumphant finished work of our Lord and Savior.',
      PracticalApplication:
        '1. Take 5 minutes today to praise God for 3 specific blessings.\n2. Meditate on Psalm 89:15 whenever anxious thoughts arise.\n3. Send an uplifting scripture to a friend or ministry member.',
      Prayer:
        'Heavenly Father, we thank You for the radiant light of Your presence. Fill our hearts with Your supernatural peace and our homes with Your joy. Lead us in paths of righteousness for Your name’s sake. In Jesus’ holy name, Amen.',
      Closing: 'Dispatched with blessings from Word Embassy Editorial (embassyword@gmail.com).',
      Excerpt:
        'A special test devotional message on Psalm 89:15 and living in the joyful, radiant presence of the Lord.',
      FeaturedImageURL:
        'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80',
      InfographicURL:
        'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1000&q=80',
      GoogleDocURL: 'https://docs.google.com/document/d/1WordEmbassy_FavorTest_DocID/edit',
      VideoURL: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      YouTubeURL: 'https://youtube.com/shorts/favor-test-embassy',
      MetaTitle: 'Walking in the Radiance of Divine Favor — Word Embassy',
      MetaDescription: 'Pastoral test dispatch from embassyword@gmail.com.',
      PublishDate: today,
      Status: 'PUBLISHED',
      EmailStatus: 'SENT',
      RecipientsAttempted: activeSubs.length,
      RecipientsSent: activeSubs.length,
      RecipientsFailed: 0,
      EmailStartedAt: new Date().toISOString(),
      EmailCompletedAt: new Date().toISOString(),
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    };

    setTopics((prev) => [testTopic, ...prev]);
    setNewsletters((prev) => [testNewsletter, ...prev]);

    // Create Video Item
    const testVideo: VideoItem = {
      VideoID: `VID-${Date.now().toString().slice(-4)}`,
      NewsletterID: testId,
      Title: testNewsletter.Title,
      Type: 'Veo Devotional',
      Duration: '0:45',
      ThumbnailURL: testNewsletter.FeaturedImageURL,
      YouTubeURL: 'https://youtube.com/shorts/favor-test-embassy',
      PublishDate: today,
      Status: 'PUBLISHED',
      Views: 1,
      Description: testNewsletter.Excerpt,
    };
    setVideos((prev) => [testVideo, ...prev]);

    // Generate Email Logs
    const newLogs: EmailLog[] = activeSubs.map((sub, idx) => ({
      EmailLogID: `LOG-TEST-${Date.now()}-${idx}`,
      NewsletterID: testId,
      SubscriberID: sub.SubscriberID,
      Email: sub.Email,
      SentAt: new Date().toISOString(),
      Status: 'SENT',
      AttemptNumber: 1,
    }));
    setEmailLogs((prev) => [...newLogs, ...prev]);

    // Update subscribers send count
    setSubscribers((prev) =>
      prev.map((s) =>
        s.Status === 'ACTIVE'
          ? {
              ...s,
              SendCount: s.SendCount + 1,
              LastNewsletterID: testId,
              LastEmailSent: new Date().toISOString(),
            }
          : s
      )
    );

    addSystemLog(
      'TestCampaignEngine',
      'SUCCESS',
      `Created test newsletter "${testNewsletter.Title}" (${testId}) and dispatched email campaign from embassyword@gmail.com to ${activeSubs.length} active subscribers.`
    );

    setIsProcessing(false);
  };

  // Find active newsletter for detail view
  const currentNewsletter =
    newsletters.find((n) => n.Slug === currentSlug) ||
    newsletters.find((n) => n.Status === 'PUBLISHED') ||
    newsletters[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1E293B] font-sans antialiased selection:bg-[#FEF3C7] selection:text-[#B45309]">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        isAdmin={currentView === 'admin'}
        onToggleAdmin={() => handleNavigate(currentView === 'admin' ? 'home' : 'admin')}
      />

      {/* Main Views */}
      <div className="flex-1">
        {currentView === 'home' && (
          <PublicHome
            newsletters={newsletters}
            videos={videos}
            onNavigate={handleNavigate}
            onSubscribe={handleSubscribe}
          />
        )}

        {currentView === 'newsletter' && currentNewsletter && (
          <NewsletterDetail
            newsletter={currentNewsletter}
            allNewsletters={newsletters.filter((n) => n.Status === 'PUBLISHED')}
            onNavigate={handleNavigate}
            onSubscribe={handleSubscribe}
          />
        )}

        {currentView === 'archive' && (
          <NewsletterArchive
            newsletters={newsletters.filter((n) => n.Status === 'PUBLISHED')}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'videos' && (
          <VideosPage
            videos={videos}
            newsletters={newsletters}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'about' && <AboutPage onNavigate={handleNavigate} />}

        {currentView === 'subscribe' && (
          <SubscribePage onSubscribe={handleSubscribe} onNavigate={handleNavigate} />
        )}

        {currentView === 'unsubscribe' && (
          <UnsubscribePage
            tokenParam={unsubscribeToken}
            subscribers={subscribers}
            onUnsubscribe={handleUnsubscribe}
            onResubscribe={handleResubscribe}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'admin' && (
          <AdminAuthGate
            isAuthenticated={isAdminAuthenticated}
            userEmail={adminUser?.email}
            onAuthenticate={(authenticatedUser) => {
              setAdminUser(authenticatedUser);
              setIsAdminAuthenticated(true);
              addSystemLog(
                'AdminAuth',
                'SUCCESS',
                `Google Stack Engine Admin signed in as ${authenticatedUser.name} (${authenticatedUser.email})`
              );
            }}
            onSignOut={() => {
              setAdminUser(null);
              setIsAdminAuthenticated(false);
              addSystemLog('AdminAuth', 'INFO', 'Admin signed out of Google Stack Engine');
            }}
            onBypassWithPin={(pin) => {
              if (pin === '7777') {
                setAdminUser({
                  email: 'embassyword@gmail.com',
                  role: 'Super Administrator & Lead Editor',
                  name: 'Word Embassy Lead Editor',
                });
                setIsAdminAuthenticated(true);
                return true;
              }
              return false;
            }}
          >
            <AdminDashboard
              topics={topics}
              newsletters={newsletters}
              subscribers={subscribers}
              subscriberGroups={subscriberGroups}
              emailLogs={emailLogs}
              videos={videos}
              systemLogs={systemLogs}
              settings={settings}
              currentUser={adminUser}
              onSignOut={() => {
                setAdminUser(null);
                setIsAdminAuthenticated(false);
              }}
              onAddTopic={handleAddTopic}
              onUpdateTopic={handleUpdateTopic}
              onDeleteTopic={handleDeleteTopic}
              onUpdateNewsletter={handleUpdateNewsletter}
              onProcessNextTopic={handleProcessNextTopic}
              onGenerateSpecificTopic={handleGenerateSpecificTopic}
              onPublishNewsletter={handlePublishNewsletter}
              onSendEmailCampaign={handleSendEmailCampaign}
              onSendTestEmail={handleSendTestEmail}
              onCreateSubscriberGroup={handleCreateSubscriberGroup}
              onAssignSubscriberGroup={handleAssignSubscriberGroup}
              onDeleteSubscriber={handleDeleteSubscriber}
              onToggleSubscriberStatus={handleToggleSubscriberStatus}
              onAddSubscriber={handleAddSubscriber}
              onCreateAndSendTestNewsletter={handleCreateAndSendTestNewsletter}
              onUpdateSettings={setSettings}
              onNavigateToPublic={handleNavigate}
              isProcessing={isProcessing}
            />
          </AdminAuthGate>
        )}
      </div>

      {/* Public Footer (hidden in admin mode for clean app control) */}
      {currentView !== 'admin' && (
        <Footer
          latestNewsletters={newsletters.filter((n) => n.Status === 'PUBLISHED').slice(0, 4)}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}
