export function generateGoogleAppsScriptCode(): { codeGs: string; indexHtml: string } {
  const codeGs = `/**
 * ============================================================================
 * LIVING WORD EMBASSY NEWSLETTER — GOOGLE APPS SCRIPT AUTOMATION ENGINE
 * ============================================================================
 * Subtitle: Bible Teaching • Faith • Prayer • Christian Living
 * Website: https://www.wordembassy.org
 * 
 * Instructions:
 * OPTION 1 (Recommended - Container Bound):
 * 1. Open Google Drive -> New -> Google Sheets (Name it "Living Word Embassy Newsletter")
 * 2. In your Sheet, click "Extensions" -> "Apps Script"
 * 3. Replace all code in Code.gs with this file
 * 4. Run 'setupAllSheets()' or 'setupSheets()'
 * 
 * OPTION 2 (Standalone script from script.google.com / script.new):
 * 1. Just paste this code and click "Run" with 'setupAllSheets()'
 *    The script will AUTOMATICALLY create a new Google Sheet for you in your Google Drive!
 * 2. Or set SPREADSHEET_ID in Project Settings -> Script Properties
 * ============================================================================
 */

// OPTIONAL: If using standalone script (script.google.com), paste your Google Sheet ID here, or leave empty for auto-creation
const SPREADSHEET_ID = "";

const SCRIPT_PROP = PropertiesService.getScriptProperties();

const SHEET_NAMES = {
  TOPICS: 'Topics',
  NEWSLETTERS: 'Newsletters',
  SUBSCRIBERS: 'Subscribers',
  PUBLISHING: 'Publishing',
  VIDEOS: 'Videos',
  SOCIAL: 'Social',
  EMAIL_LOG: 'EmailLog',
  ANALYTICS: 'Analytics',
  SETTINGS: 'Settings',
  LOGS: 'Logs'
};

/**
 * Robust Spreadsheet Resolver:
 * Works in BOTH container-bound scripts AND standalone scripts (script.google.com)
 */
function getOrInitSpreadsheet() {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (!ss) {
    // 1. Check top-level SPREADSHEET_ID variable if specified
    if (typeof SPREADSHEET_ID !== 'undefined' && SPREADSHEET_ID && SPREADSHEET_ID !== 'YOUR_ID_HERE') {
      try {
        ss = SpreadsheetApp.openById(SPREADSHEET_ID.trim());
        return ss;
      } catch (e) {
        Logger.log('Could not open spreadsheet by top-level SPREADSHEET_ID ' + SPREADSHEET_ID + ': ' + e.message);
      }
    }

    // 2. Check if SPREADSHEET_ID is configured in Script Properties
    const savedId = SCRIPT_PROP.getProperty('SPREADSHEET_ID');
    if (savedId) {
      try {
        ss = SpreadsheetApp.openById(savedId.trim());
        return ss;
      } catch (e) {
        Logger.log('Could not open spreadsheet by ID ' + savedId + ': ' + e.message);
      }
    }

    // 3. Search Google Drive for existing Living Word Embassy master spreadsheet
    try {
      const files = DriveApp.getFilesByName('Living Word Embassy Master Database (10 Sheets)');
      if (files.hasNext()) {
        const file = files.next();
        ss = SpreadsheetApp.openById(file.getId());
        SCRIPT_PROP.setProperty('SPREADSHEET_ID', file.getId());
        Logger.log('✅ Found existing Master Google Sheet in your Drive: ' + file.getName() + ' (' + file.getId() + ')');
        return ss;
      }
    } catch (driveErr) {
      Logger.log('Drive search notice: ' + driveErr.message);
    }

    // 4. Auto-create a master spreadsheet in Google Drive if standalone
    try {
      ss = SpreadsheetApp.create('Living Word Embassy Master Database (10 Sheets)');
      SCRIPT_PROP.setProperty('SPREADSHEET_ID', ss.getId());
      Logger.log('✨ Auto-created new Master Google Sheet in your Google Drive: ' + ss.getUrl());
      Logger.log('Saved SPREADSHEET_ID: ' + ss.getId());
      return ss;
    } catch (createErr) {
      Logger.log('Auto-create failed: ' + createErr.message);
    }
  }
  return ss;
}

/**
 * 1. INITIALIZE ALL 10 SHEETS (Alias setupSheets for easy execution)
 */
function setupSheets() {
  setupAllSheets();
}

function setupAllSheets() {
  const ss = getOrInitSpreadsheet();
  if (!ss) {
    throw new Error('Spreadsheet could not be initialized.');
  }
  
  const schemas = {
    [SHEET_NAMES.TOPICS]: ['TopicID', 'Topic', 'Scripture', 'Theme', 'Notes', 'PublishDate', 'Priority', 'Status', 'CreatedAt', 'UpdatedAt'],
    [SHEET_NAMES.NEWSLETTERS]: ['NewsletterID', 'TopicID', 'Title', 'Slug', 'ScriptureReference', 'ScriptureText', 'Theme', 'Opening', 'Teaching', 'KeyPoint1Title', 'KeyPoint1Body', 'KeyPoint2Title', 'KeyPoint2Body', 'KeyPoint3Title', 'KeyPoint3Body', 'PracticalApplication', 'Prayer', 'Closing', 'Excerpt', 'FeaturedImageURL', 'InfographicURL', 'GoogleDocURL', 'VideoURL', 'YouTubeURL', 'MetaTitle', 'MetaDescription', 'PublishDate', 'Status', 'EmailStatus', 'CreatedAt', 'UpdatedAt'],
    [SHEET_NAMES.SUBSCRIBERS]: ['SubscriberID', 'Name', 'Email', 'Group', 'DateSubscribed', 'Status', 'Source', 'UnsubscribeToken', 'LastNewsletterID', 'LastEmailSent', 'EmailStatus', 'SendCount'],
    [SHEET_NAMES.PUBLISHING]: ['PublishID', 'NewsletterID', 'WebsiteStatus', 'EmailCampaignStatus', 'SocialStatus', 'DriveStatus', 'YouTubeStatus', 'PublishedAt', 'CreatedBy'],
    [SHEET_NAMES.VIDEOS]: ['VideoID', 'NewsletterID', 'Title', 'YouTubeURL', 'Duration', 'Type', 'PublishDate', 'Status', 'Views'],
    [SHEET_NAMES.SOCIAL]: ['SocialID', 'NewsletterID', 'Platform', 'Content', 'Hashtags', 'Status', 'ScheduledAt'],
    [SHEET_NAMES.EMAIL_LOG]: ['EmailLogID', 'NewsletterID', 'SubscriberID', 'Email', 'SentAt', 'Status', 'ErrorMessage', 'AttemptNumber'],
    [SHEET_NAMES.ANALYTICS]: ['Date', 'Metric', 'Value', 'Notes'],
    [SHEET_NAMES.SETTINGS]: ['Key', 'Value', 'Description'],
    [SHEET_NAMES.LOGS]: ['Timestamp', 'JobID', 'TopicID', 'NewsletterID', 'SubscriberID', 'Function', 'Status', 'Message', 'ErrorDetails', 'RetryCount']
  };

  for (const [name, headers] of Object.entries(schemas)) {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1E293B').setFontColor('#FFFFFF');
      sheet.setFrozenRows(1);
    }
  }

  Logger.log('✅ All 10 Living Word Embassy sheets initialized successfully in: ' + ss.getName() + ' (' + ss.getUrl() + ')');
  logEvent('setupAllSheets', 'SUCCESS', 'All 10 Living Word Embassy sheets initialized successfully.');
}

/**
 * 2. CORE AUTOMATION WORKFLOWS & TRIGGERS
 */

/**
 * DAILY DEVOTIONAL DRAFT (Day timer: 5am - 6am)
 * Skips Monday automatically because Monday is reserved for the Weekly Newsletter!
 */
function createDailyDraft() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat

  // Check if today is Monday
  if (dayOfWeek === 1) {
    Logger.log('Today is Monday. Skipping Daily Devotional creation (Weekly Newsletter Day).');
    logEvent('createDailyDraft', 'SKIPPED', 'Skipped on Monday (Weekly Newsletter Day)');
    return;
  }

  processNextNewsletter('DAILY');
}

/**
 * DAILY DEVOTIONAL APPROVE & SEND (Day timer: 7am - 8am)
 * Skips Monday automatically
 */
function approveAndSendDaily() {
  const today = new Date();
  const dayOfWeek = today.getDay();

  if (dayOfWeek === 1) {
    Logger.log('Today is Monday. Skipping Daily Devotional dispatch.');
    return;
  }

  sendLatestApprovedNewsletter('DAILY');
}

/**
 * WEEKLY NEWSLETTER DRAFT (Week timer: Every Monday 6am - 7am)
 */
function createWeeklyDraft() {
  processNextNewsletter('WEEKLY');
}

/**
 * WEEKLY NEWSLETTER APPROVE & SEND (Week timer: Every Monday 8am - 9am)
 */
function approveAndSendWeekly() {
  sendLatestApprovedNewsletter('WEEKLY');
}

/**
 * Core processor for next devotional or newsletter
 */
function processNextNewsletter(type) {
  const ss = getOrInitSpreadsheet();
  if (!ss) {
    Logger.log('Notice: Spreadsheet not connected. Please connect a Google Sheet or run setupAllSheets().');
    logEvent('processNextNewsletter', 'WARNING', 'Spreadsheet not connected.');
    return;
  }
  let topicsSheet = ss.getSheetByName(SHEET_NAMES.TOPICS);
  if (!topicsSheet) {
    setupAllSheets();
    topicsSheet = ss.getSheetByName(SHEET_NAMES.TOPICS);
  }
  if (!topicsSheet) return;
  const topicsData = topicsSheet.getDataRange().getValues();
  
  // Find next PENDING or APPROVED topic
  let selectedRowIndex = -1;
  let topicRow = null;

  for (let i = 1; i < topicsData.length; i++) {
    const status = topicsData[i][7];
    if (status === 'PENDING' || status === 'APPROVED') {
      selectedRowIndex = i + 1;
      topicRow = {
        topicId: topicsData[i][0],
        topic: topicsData[i][1],
        scripture: topicsData[i][2],
        theme: topicsData[i][3],
        notes: topicsData[i][4],
        publishDate: topicsData[i][5] || new Date().toISOString().split('T')[0]
      };
      break;
    }
  }

  if (!topicRow) {
    Logger.log('No pending topics found.');
    return;
  }

  try {
    // 1. Update Topic status to GENERATING
    topicsSheet.getRange(selectedRowIndex, 8).setValue('GENERATING');
    topicsSheet.getRange(selectedRowIndex, 10).setValue(new Date().toISOString());

    // 2. Call Gemini API
    const generated = callGeminiGenerateNewsletter(topicRow);
    const newsletterId = (type === 'WEEKLY' ? 'NL-WK-' : 'NL-DY-') + Utilities.formatDate(new Date(), 'GMT', 'yyyyMMdd-HHmm');

    // 3. Save to Newsletters sheet
    const nlSheet = ss.getSheetByName(SHEET_NAMES.NEWSLETTERS);
    nlSheet.appendRow([
      newsletterId,
      topicRow.topicId,
      generated.newsletter.title,
      generated.newsletter.slug,
      generated.newsletter.key_scripture.reference,
      generated.newsletter.key_scripture.text,
      topicRow.theme,
      generated.newsletter.opening,
      generated.newsletter.teaching,
      generated.newsletter.key_points[0]?.title || '',
      generated.newsletter.key_points[0]?.content || '',
      generated.newsletter.key_points[1]?.title || '',
      generated.newsletter.key_points[1]?.content || '',
      generated.newsletter.key_points[2]?.title || '',
      generated.newsletter.key_points[2]?.content || '',
      generated.newsletter.practical_application,
      generated.newsletter.prayer,
      generated.newsletter.closing,
      generated.newsletter.excerpt,
      '', '', '', '', '', // URLs (Image, Infographic, Doc, Video, YouTube)
      generated.seo.meta_title,
      generated.seo.meta_description,
      topicRow.publishDate,
      'AWAITING_APPROVAL',
      'NOT_SENT',
      new Date().toISOString(),
      new Date().toISOString()
    ]);

    // 4. Create Gmail Draft
    const adminEmail = SCRIPT_PROP.getProperty('ADMIN_EMAIL') || 'embassyword@gmail.com';
    const htmlBody = type === 'WEEKLY' ? getWeeklyFullHtml(generated.newsletter) : getDailyCompactHtml(generated.newsletter);
    
    GmailApp.createDraft(
      adminEmail,
      '[' + (type === 'WEEKLY' ? 'WEEKLY NEWSLETTER DRAFT' : 'DAILY DEVOTIONAL DRAFT') + '] ' + generated.newsletter.title,
      generated.newsletter.opening + '\n\n' + generated.newsletter.teaching,
      { htmlBody: htmlBody }
    );

    // 5. Update Topic status
    topicsSheet.getRange(selectedRowIndex, 8).setValue('AWAITING_APPROVAL');
    logEvent('processNextNewsletter', 'SUCCESS', 'Generated ' + (type || 'newsletter') + ' ' + newsletterId + ' draft for: ' + topicRow.topic);
    
  } catch (err) {
    topicsSheet.getRange(selectedRowIndex, 8).setValue('FAILED');
    logEvent('processNextNewsletter', 'ERROR', 'Generation failed: ' + err.toString());
  }
}

/**
 * Send latest approved newsletter
 */
function sendLatestApprovedNewsletter(type) {
  const ss = getOrInitSpreadsheet();
  if (!ss) {
    Logger.log('Notice: Spreadsheet not connected yet. Skipping send step safely.');
    return;
  }
  let nlSheet = ss.getSheetByName(SHEET_NAMES.NEWSLETTERS);
  if (!nlSheet) {
    setupAllSheets();
    nlSheet = ss.getSheetByName(SHEET_NAMES.NEWSLETTERS);
  }
  if (!nlSheet) return;
  const rows = nlSheet.getDataRange().getValues();

  for (let i = rows.length - 1; i >= 1; i--) {
    const status = rows[i][27]; // Status column
    const emailStatus = rows[i][28]; // EmailStatus column
    const nlId = rows[i][0];

    if ((status === 'APPROVED' || status === 'AWAITING_APPROVAL') && emailStatus !== 'SENT') {
      sendNewsletterBatch(nlId, 50);
      nlSheet.getRange(i + 1, 29).setValue('SENT');
      break;
    }
  }
}

/**
 * 3. HTML TEMPLATE ENGINES
 */
function getDailyCompactHtml(nl) {
  const scriptureRef = nl.key_scripture?.reference || nl.ScriptureReference || 'Scripture Focus';
  const scriptureText = nl.key_scripture?.text || nl.ScriptureText || '';
  const videoUrl = nl.YouTubeURL || nl.VideoURL || ('https://youtube.com/results?search_query=Living+Word+Embassy+' + encodeURIComponent(scriptureRef));

  return '<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1E293B; background: #FDFBF7; padding: 24px; border: 1px solid #E2E8F0; border-radius: 12px;">'
    + '<div style="text-align: center; border-bottom: 2px solid #F59E0B; padding-bottom: 12px; margin-bottom: 16px;">'
    + '<p style="color: #B45309; font-family: sans-serif; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 4px 0;">Living Word Embassy Ministry</p>'
    + '<h2 style="color: #1E293B; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; margin: 0;">Daily Video Devotional</h2>'
    + '</div>'
    + '<h1 style="color: #1E293B; font-size: 22px; margin-top: 0; margin-bottom: 12px; font-weight: bold;">' + (nl.title || '') + '</h1>'
    + '<div style="background: #FEF3C7; padding: 16px; border: 2px solid #F59E0B; border-radius: 8px; margin-bottom: 16px;">'
    + '<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">'
    + '<span style="font-family: sans-serif; font-size: 11px; font-weight: bold; color: #B45309; text-transform: uppercase;">📖 Today\'s Scripture Reference</span>'
    + '<span style="background: #B45309; color: #FFFFFF; font-family: sans-serif; font-size: 12px; font-weight: bold; padding: 2px 8px; border-radius: 4px;">' + scriptureRef + '</span>'
    + '</div>'
    + '<p style="font-style: italic; font-size: 16px; line-height: 1.6; color: #1E293B; margin: 8px 0 4px 0;">“' + scriptureText + '”</p>'
    + '<p style="text-align: right; font-size: 12px; font-weight: bold; color: #92400E; margin: 0;">— ' + scriptureRef + '</p>'
    + '</div>'
    + '<p style="line-height: 1.6; font-size: 15px;">' + (nl.opening || '') + '</p>'
    + '<p style="line-height: 1.6; font-size: 15px;">' + (nl.teaching || '') + '</p>'
    + (nl.prayer ? '<div style="background: #F1F5F9; border-left: 4px solid #B45309; padding: 14px; border-radius: 0 6px 6px 0; margin: 16px 0;"><strong style="color: #92400E;">🙏 Prayer of Faith (' + scriptureRef + '):</strong><br/><em style="color: #334155; font-size: 14px;">' + nl.prayer + '</em></div>' : '')
    + '<div style="text-align: center; margin: 24px 0; background-color: #0F172A; padding: 18px; border-radius: 10px;">'
    + '<p style="color: #FCD34D; font-family: sans-serif; font-size: 12px; font-weight: bold; text-transform: uppercase; margin: 0 0 8px 0;">🎥 Watch Today\'s Video Devotional (' + scriptureRef + ')</p>'
    + '<a href="' + videoUrl + '" style="background: #F59E0B; color: #060B18; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-family: sans-serif; font-size: 14px; font-weight: bold; display: inline-block;">▶ Watch ' + scriptureRef + ' Video Devotional</a>'
    + '</div>'
    + '<div style="margin: 12px 0; text-align: center;"><a href="https://www.wordembassy.org" style="color: #475569; font-size: 13px; text-decoration: underline;">Read Full Devotional Study on Living Word Embassy</a></div>'
    + '<hr style="border: none; border-top: 1px solid #E2E8F0; margin: 20px 0;" />'
    + '<p style="font-size: 12px; color: #64748B; text-align: center;">Follow us on Instagram <a href="https://instagram.com/embassyword02" style="color: #D97706;">@embassyword02</a> & X <a href="https://x.com/Wordembass76269" style="color: #D97706;">@Wordembass76269</a></p>'
    + '</div>';
}

function getWeeklyFullHtml(nl) {
  return '<div style="font-family: Georgia, serif; max-width: 650px; margin: 0 auto; color: #1E293B; background: #FFFFFF; padding: 32px; border: 1px solid #CBD5E1; border-radius: 10px;">'
    + '<div style="text-align: center; border-bottom: 2px solid #1E293B; padding-bottom: 16px; margin-bottom: 24px;">'
    + '<h3 style="color: #B45309; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin: 0;">Weekly Teaching & Pastoral Letter</h3>'
    + '<h1 style="color: #0F172A; font-size: 26px; margin: 8px 0;">' + (nl.title || '') + '</h1>'
    + '</div>'
    + '<div style="background: #FFFBEB; padding: 16px; border-left: 4px solid #B45309; border-radius: 4px; margin-bottom: 24px; font-size: 16px; line-height: 1.6;">'
    + '<strong>Scripture Foundation:</strong> ' + (nl.key_scripture?.reference || '') + '<br/><em>"' + (nl.key_scripture?.text || '') + '"</em>'
    + '</div>'
    + '<div style="line-height: 1.7; font-size: 16px;">' + (nl.teaching || '') + '</div>'
    + '<div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 18px; border-radius: 8px; margin: 24px 0;">'
    + '<h4 style="margin: 0 0 8px 0; color: #1E293B;">Weekly Prayer & Intercession</h4>'
    + '<p style="margin: 0; line-height: 1.6; font-style: italic;">' + (nl.prayer || '') + '</p>'
    + '</div>'
    + '<hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />'
    + '<p style="font-size: 12px; color: #64748B; text-align: center;">Living Word Embassy | Bible Teaching • Faith • Prayer<br/><a href="https://instagram.com/embassyword02" style="color: #B45309;">Instagram</a> • <a href="https://x.com/Wordembass76269" style="color: #B45309;">X (Twitter)</a></p>'
    + '</div>';
}

/**
 * GEMINI API GENERATOR VIA URLFETCHAPP
 */
function callGeminiGenerateNewsletter(topicRow) {
  const apiKey = SCRIPT_PROP.getProperty('GEMINI_API_KEY');
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not found in Script Properties. Add it under Project Settings > Script Properties.');
  }

  const prompt = 'You are the Lead Theologian for Living Word Embassy Christian Newsletter. Generate a complete structured Christian newsletter package for Topic: "' + topicRow.topic + '", Scripture: "' + topicRow.scripture + '", Theme: "' + topicRow.theme + '", Notes: "' + topicRow.notes + '". Respond with valid JSON matching the schema.';
  
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=' + apiKey;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json'
    }
  };

  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  if (response.getResponseCode() !== 200) {
    throw new Error('Gemini API Error: ' + response.getContentText());
  }

  const json = JSON.parse(response.getContentText());
  const text = json.candidates[0].content.parts[0].text;
  return JSON.parse(text);
}

/**
 * 4. BATCH EMAIL SENDER ENGINE (GmailApp / MailApp)
 */
function sendNewsletterBatch(newsletterId, batchLimit) {
  const ss = getOrInitSpreadsheet();
  const nlSheet = ss.getSheetByName(SHEET_NAMES.NEWSLETTERS);
  const subSheet = ss.getSheetByName(SHEET_NAMES.SUBSCRIBERS);
  const logSheet = ss.getSheetByName(SHEET_NAMES.EMAIL_LOG);

  const nlRows = nlSheet.getDataRange().getValues();
  let newsletter = null;
  for (let i = 1; i < nlRows.length; i++) {
    if (nlRows[i][0] === newsletterId) {
      newsletter = {
        id: nlRows[i][0],
        title: nlRows[i][2],
        scriptureRef: nlRows[i][4],
        scriptureText: nlRows[i][5],
        opening: nlRows[i][7],
        teaching: nlRows[i][8],
        prayer: nlRows[i][16],
        slug: nlRows[i][3]
      };
      break;
    }
  }

  if (!newsletter) throw new Error('Newsletter not found: ' + newsletterId);

  const subs = subSheet.getDataRange().getValues();
  const batchSize = batchLimit || 25;
  let sentCount = 0;

  for (let j = 1; j < subs.length; j++) {
    if (sentCount >= batchSize) break;
    const subId = subs[j][0];
    const rawName = subs[j][1];
    const name = (!rawName || rawName === 'Word Embassy Admin' || String(rawName).trim() === '') ? 'Beloved' : String(rawName).trim();
    const email = subs[j][2];
    const status = subs[j][4];
    const token = subs[j][6];
    const lastNl = subs[j][7];

    if (status === 'ACTIVE' && lastNl !== newsletterId) {
      try {
        const htmlBody = '<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1E293B; background: #FDFBF7; padding: 24px; border: 1px solid #E2E8F0; border-radius: 8px;">'
          + '<h1 style="color: #1E293B; font-size: 24px; margin-bottom: 8px;">' + newsletter.title + '</h1>'
          + '<p style="color: #B45309; font-style: italic; font-size: 16px; margin-bottom: 20px;">' + newsletter.scriptureRef + ' — "' + newsletter.scriptureText + '"</p>'
          + '<p style="line-height: 1.6;">Dear ' + name + ',</p>'
          + '<p style="line-height: 1.6;">' + newsletter.opening + '</p>'
          + '<div style="margin: 24px 0; text-align: center;"><a href="https://www.wordembassy.org/newsletter/' + newsletter.slug + '" style="background: #1E293B; color: #FFFFFF; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Read Full Newsletter & Watch Video</a></div>'
          + '<hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />'
          + '<p style="font-size: 12px; color: #64748B; text-align: center;">Living Word Embassy | Bible Teaching • Faith • Prayer<br/><a href="https://www.wordembassy.org/unsubscribe?token=' + token + '" style="color: #64748B;">Unsubscribe</a></p>'
          + '</div>';

        MailApp.sendEmail({
          to: email,
          name: 'Living Word Embassy Editorial',
          replyTo: 'embassyword@gmail.com',
          subject: 'Living Word Embassy: ' + newsletter.title,
          htmlBody: htmlBody
        });

        // Update subscriber record
        subSheet.getRange(j + 1, 8).setValue(newsletterId);
        subSheet.getRange(j + 1, 9).setValue(new Date().toISOString());
        subSheet.getRange(j + 1, 10).setValue('DELIVERED');
        subSheet.getRange(j + 1, 11).setValue((subs[j][10] || 0) + 1);

        // Append to EmailLog
        logSheet.appendRow(['LOG-' + Utilities.getUuid().substring(0, 8), newsletterId, subId, email, new Date().toISOString(), 'SENT', '', 1]);
        sentCount++;
      } catch (e) {
        logSheet.appendRow(['LOG-' + Utilities.getUuid().substring(0, 8), newsletterId, subId, email, new Date().toISOString(), 'FAILED', e.toString(), 1]);
      }
    }
  }

  logEvent('sendNewsletterBatch', 'SUCCESS', 'Sent batch of ' + sentCount + ' emails for ' + newsletterId);
}

/**
 * 5. LOGGING HELPER
 */
function logEvent(funcName, status, message, errorDetails) {
  try {
    const ss = getOrInitSpreadsheet();
    if (!ss) return;
    const logSheet = ss.getSheetByName(SHEET_NAMES.LOGS);
    if (logSheet) {
      logSheet.appendRow([
        new Date().toISOString(),
        'JOB-' + Utilities.getUuid().substring(0, 6),
        '', '', '',
        funcName,
        status,
        message,
        errorDetails || '',
        0
      ]);
    }
  } catch (e) {
    Logger.log('logEvent notice: ' + e.message);
  }
}

/**
 * 6. WEB APP ENDPOINTS (doGet and doPost for Web App Deployment)
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Living Word Embassy Newsletter')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    if (postData.action === 'SUBSCRIBE') {
      const ss = getOrInitSpreadsheet();
      const subSheet = ss.getSheetByName(SHEET_NAMES.SUBSCRIBERS);
      const token = 'tok_' + Utilities.getUuid().substring(0, 8);
      subSheet.appendRow([
        'SUB-' + (subSheet.getLastRow() + 1000),
        postData.name,
        postData.email,
        new Date().toISOString().split('T')[0],
        'ACTIVE',
        postData.source || 'Web App Form',
        token,
        '', '', '', 0
      ]);
      return ContentService.createTextOutput(JSON.stringify({ success: true, token: token })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;

  const indexHtml = `<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Living Word Embassy Newsletter</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #FDFBF7; color: #1E293B; margin: 0; padding: 20px; }
      .container { max-width: 800px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
      h1 { font-family: Georgia, serif; color: #1E293B; font-size: 28px; margin-bottom: 4px; }
      .subtitle { color: #B45309; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; }
      .btn { background: #1E293B; color: #FFFFFF; border: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; cursor: pointer; }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Living Word Embassy Newsletter</h1>
      <div class="subtitle">Bible Teaching • Faith • Prayer • Christian Living</div>
      <p>Welcome to Living Word Embassy Google Apps Script web portal. Use the main React client for the full experience.</p>
    </div>
  </body>
</html>`;

  return { codeGs, indexHtml };
}
