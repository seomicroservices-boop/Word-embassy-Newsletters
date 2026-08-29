export function generateGoogleAppsScriptCode(): { codeGs: string; indexHtml: string } {
  const codeGs = `/**
 * ============================================================================
 * WORD EMBASSY NEWSLETTER — GOOGLE APPS SCRIPT AUTOMATION ENGINE
 * ============================================================================
 * Subtitle: Bible Teaching • Faith • Prayer • Christian Living
 * Website: https://www.wordembassy.org
 * 
 * Instructions:
 * 1. Open Google Drive -> New -> Google Sheets (Name it "Word Embassy Newsletter Engine")
 * 2. In Sheets, go to Extensions -> Apps Script
 * 3. Replace all code in Code.gs with this file
 * 4. Create an HTML file named "Index.html" and paste the Index.html template
 * 5. Run 'setupAllSheets()' to initialize all 10 tabs automatically!
 * 6. Set Script Properties (Project Settings -> Script Properties):
 *    - GEMINI_API_KEY : Your Gemini API Key from Google AI Studio
 *    - ADMIN_EMAIL    : embassyword@gmail.com
 * ============================================================================
 */

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
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
 * 1. INITIALIZE ALL 10 SHEETS
 */
function setupAllSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
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

  logEvent('setupAllSheets', 'SUCCESS', 'All 10 Word Embassy sheets initialized successfully.');
}

/**
 * 2. CORE AUTOMATION WORKFLOW: processNextNewsletter()
 * Called by time-driven trigger or manual button
 */
function processNextNewsletter() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const topicsSheet = ss.getSheetByName(SHEET_NAMES.TOPICS);
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
    const newsletterId = 'NL-' + Utilities.formatDate(new Date(), 'GMT', 'yyyyMMdd-HHmm');

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

    // 4. Update Topic status
    topicsSheet.getRange(selectedRowIndex, 8).setValue('AWAITING_APPROVAL');
    logEvent('processNextNewsletter', 'SUCCESS', 'Generated newsletter ' + newsletterId + ' for topic: ' + topicRow.topic);
    
  } catch (err) {
    topicsSheet.getRange(selectedRowIndex, 8).setValue('FAILED');
    logEvent('processNextNewsletter', 'ERROR', 'Generation failed: ' + err.toString());
  }
}

/**
 * 3. GEMINI API CALL VIA URLFETCHAPP
 */
function callGeminiGenerateNewsletter(topicRow) {
  const apiKey = SCRIPT_PROP.getProperty('GEMINI_API_KEY');
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not found in Script Properties.');
  }

  const prompt = 'You are the Lead Theologian for Word Embassy Christian Newsletter. Generate a complete structured Christian newsletter package for Topic: "' + topicRow.topic + '", Scripture: "' + topicRow.scripture + '", Theme: "' + topicRow.theme + '", Notes: "' + topicRow.notes + '". Respond with valid JSON matching the schema.';
  
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
  const ss = SpreadsheetApp.getActiveSpreadsheet();
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
    const name = subs[j][1];
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
          + '<p style="font-size: 12px; color: #64748B; text-align: center;">Word Embassy | Bible Teaching • Faith • Prayer<br/><a href="https://www.wordembassy.org/unsubscribe?token=' + token + '" style="color: #64748B;">Unsubscribe</a></p>'
          + '</div>';

        MailApp.sendEmail({
          to: email,
          name: 'Word Embassy Editorial',
          replyTo: 'embassyword@gmail.com',
          subject: 'Word Embassy: ' + newsletter.title,
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
  const ss = SpreadsheetApp.getActiveSpreadsheet();
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
}

/**
 * 6. WEB APP ENDPOINTS (doGet and doPost for Web App Deployment)
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Word Embassy Newsletter')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    if (postData.action === 'SUBSCRIBE') {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
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
    <title>Word Embassy Newsletter</title>
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
      <h1>Word Embassy Newsletter</h1>
      <div class="subtitle">Bible Teaching • Faith • Prayer • Christian Living</div>
      <p>Welcome to Word Embassy Google Apps Script web portal. Use the main React client for the full experience.</p>
    </div>
  </body>
</html>`;

  return { codeGs, indexHtml };
}
