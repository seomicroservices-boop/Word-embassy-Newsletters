import { Newsletter } from '../types';
import { formatBibleCitation, parseScriptureReference } from './bibleScripture';

export const CREATOMATE_CONFIG = {
  templateId: 'c67fa002-f471-4603-97bc-329edd25a2b8',
  apiKey: '0b002a0f3af341d7aff04440026f2f42fb67af73fa2b280a8f20f7bfebcd495bf78d0e4c34d7b057f66788dbaa5ac914',
  endpoint: 'https://api.creatomate.com/v2/renders',
  defaultAssets: {
    music: 'https://creatomate.com/files/assets/b5dc815e-dcc9-4c62-9405-f94913936bf5',
    background1: 'https://creatomate.com/files/assets/4a7903f0-37bc-48df-9d83-5eb52afd5d07',
    background2: 'https://creatomate.com/files/assets/4a6f6b28-bb42-4987-8eca-7ee36b347ee7',
    background3: 'https://creatomate.com/files/assets/4f6963a5-7286-450b-bc64-f87a3a1d8964',
    background4: 'https://creatomate.com/files/assets/36899eae-a128-43e6-9e97-f2076f54ea18',
  },
};

export interface CreatomateModifications {
  'Music.source': string;
  'Background-1.source': string;
  'Text-1.text': string;
  'Background-2.source': string;
  'Text-2.text': string;
  'Background-3.source': string;
  'Text-3.text': string;
  'Background-4.source': string;
  'Text-4.text': string;
  [key: string]: string;
}

export interface CreatomateRenderPayload {
  template_id: string;
  modifications: CreatomateModifications;
}

/**
 * Builds the customized 4-slide Devotional video payload for template c67fa002
 */
export function buildDevotionalCreatomatePayload(
  newsletter: Newsletter,
  overrides?: Partial<CreatomateModifications>
): CreatomateRenderPayload {
  const parsedScripture = parseScriptureReference(newsletter.ScriptureReference);
  const displayBook = newsletter.BibleBook || parsedScripture.book || 'Scripture';
  const displayChapter =
    newsletter.BibleChapter !== undefined ? String(newsletter.BibleChapter) : parsedScripture.chapter;
  const displayVerses = newsletter.BibleVerses || parsedScripture.verses;
  const citation = formatBibleCitation(newsletter.ScriptureReference, displayBook, displayChapter, displayVerses);

  // Slide 1: Hook / Ministry Awakening with prominent Scripture Reference
  const rawHook = newsletter.YouTubeShortHook || `Did you know what God promises in ${citation}? 🔥`;
  const text1 = `${citation.toUpperCase()} • DAILY DEVOTIONAL\n\n${rawHook}`;

  // Slide 2: Core Scripture Word with high-visibility citation
  const text2 =
    `“${newsletter.ScriptureText}”\n\n— ${citation} (${newsletter.BibleTranslation || 'NIV'}) ✨`;

  // Slide 3: Theological Reflection / Heart Message with Scripture Citation
  const baseReflection =
    newsletter.Excerpt ||
    newsletter.YouTubeShortNarration ||
    `When answers seem delayed, faith grows stronger. Stand firm on God's eternal covenant.`;
  const text3 = `${baseReflection}\n\n📖 Scripture Focus: ${citation}`;

  // Slide 4: Prayer of Faith & Call to Action with Scripture Reference
  const text4 =
    newsletter.Prayer
      ? `🙏 Prayer (${citation}):\n${newsletter.Prayer.slice(0, 130)}...\n\nSubscribe to Living Word Embassy for daily video devotionals! 🚀`
      : `${newsletter.YouTubeShortCTA || 'Subscribe to Living Word Embassy for daily Bible teachings. 🚀'}\n\n📖 Daily Scripture: ${citation}`;

  const defaultMods: CreatomateModifications = {
    'Music.source': CREATOMATE_CONFIG.defaultAssets.music,
    'Background-1.source': newsletter.FeaturedImageURL || CREATOMATE_CONFIG.defaultAssets.background1,
    'Text-1.text': text1,
    'Background-2.source': CREATOMATE_CONFIG.defaultAssets.background2,
    'Text-2.text': text2,
    'Background-3.source': CREATOMATE_CONFIG.defaultAssets.background3,
    'Text-3.text': text3,
    'Background-4.source': CREATOMATE_CONFIG.defaultAssets.background4,
    'Text-4.text': text4,
  };

  return {
    template_id: CREATOMATE_CONFIG.templateId,
    modifications: {
      ...defaultMods,
      ...overrides,
    },
  };
}

/**
 * Returns the exact curl command to trigger rendering via terminal or webhook
 */
export function generateCreatomateCurlCommand(
  payload: CreatomateRenderPayload,
  apiKey: string = CREATOMATE_CONFIG.apiKey
): string {
  const jsonString = JSON.stringify(payload, null, 2);
  return `curl -X POST ${CREATOMATE_CONFIG.endpoint} \\
     -H "Content-Type: application/json" \\
     -H "Authorization: Bearer ${apiKey}" \\
     -d '${jsonString}'`;
}

/**
 * The exact sample template curl command requested by the user
 */
export function getSampleCreatomateCurl(): string {
  return `curl -X POST https://api.creatomate.com/v2/renders \\
     -H "Content-Type: application/json" \\
     -H "Authorization: Bearer 0b002a0f3af341d7aff04440026f2f42fb67af73fa2b280a8f20f7bfebcd495bf78d0e4c34d7b057f66788dbaa5ac914" \\
     -d '{
  "template_id": "c67fa002-f471-4603-97bc-329edd25a2b8",
  "modifications": {
    "Music.source": "https://creatomate.com/files/assets/b5dc815e-dcc9-4c62-9405-f94913936bf5",
    "Background-1.source": "https://creatomate.com/files/assets/4a7903f0-37bc-48df-9d83-5eb52afd5d07",
    "Text-1.text": "Did you know you can automate TikTok, Instagram, and YouTube videos? 🔥",
    "Background-2.source": "https://creatomate.com/files/assets/4a6f6b28-bb42-4987-8eca-7ee36b347ee7",
    "Text-2.text": "Use any video automation tool to replace these text and background assets with your own! 😊",
    "Background-3.source": "https://creatomate.com/files/assets/4f6963a5-7286-450b-bc64-f87a3a1d8964",
    "Text-3.text": "Learn how to get started on the Guides & Tutorials page on Creatomate'\''s home page.",
    "Background-4.source": "https://creatomate.com/files/assets/36899eae-a128-43e6-9e97-f2076f54ea18",
    "Text-4.text": "Use the template editor to completely customize this video to meet your own needs. 🚀"
  }
}'`;
}

/**
 * Executes or simulates the Creatomate render request
 */
export async function submitCreatomateRender(
  payload: CreatomateRenderPayload,
  apiKey: string = CREATOMATE_CONFIG.apiKey
): Promise<{ success: boolean; data?: any; error?: string; isSimulated?: boolean }> {
  try {
    const res = await fetch(CREATOMATE_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: `Creatomate HTTP ${res.status}: ${errText}` };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (err: any) {
    // If blocked by browser CORS restrictions in preview iframe, return structured message
    return {
      success: false,
      error:
        err?.message ||
        'Direct browser call restricted by CORS. Use the provided cURL command or Google Apps Script Studio.',
    };
  }
}
