import { Topic, Newsletter, Subscriber, EmailLog, SystemLog } from '../types';
import { getAccessToken } from './firebaseAuth';

export interface SpreadsheetInfo {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
  sheets: Array<{
    sheetId: number;
    title: string;
    rowCount?: number;
  }>;
}

/**
 * Create a comprehensive Word Embassy Master Spreadsheet in Google Sheets
 */
export async function createMasterSpreadsheet(
  title: string = 'Word Embassy — Content & Subscriber Master',
  data?: {
    topics: Topic[];
    newsletters: Newsletter[];
    subscribers: Subscriber[];
    emailLogs: EmailLog[];
    systemLogs: SystemLog[];
  }
): Promise<SpreadsheetInfo> {
  const token = await getAccessToken();

  const defaultTabs = [
    'Topics',
    'Newsletters',
    'Subscribers',
    'Publishing_Schedule',
    'Email_Logs',
    'Video_Devotionals',
    'Social_Copy',
    'System_Logs',
    'Settings',
  ];

  if (!token || token === 'google-workspace-auth-active') {
    const mockId = `we_sheet_${Date.now().toString(36)}`;
    return {
      spreadsheetId: mockId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${mockId}/edit`,
      title,
      sheets: defaultTabs.map((t, idx) => ({
        sheetId: idx,
        title: t,
        rowCount: 50,
      })),
    };
  }

  try {
    const requestBody = {
      properties: { title },
      sheets: defaultTabs.map((tabTitle) => ({
        properties: { title: tabTitle },
      })),
    };

    const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (res.ok) {
      const dataJson = await res.json();
      const spreadsheetId = dataJson.spreadsheetId;

      // Seed headers & initial data into sheets if provided
      if (data) {
        await seedSpreadsheetData(spreadsheetId, token, data);
      }

      return {
        spreadsheetId,
        spreadsheetUrl: dataJson.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
        title: dataJson.properties?.title || title,
        sheets: (dataJson.sheets || []).map((s: any) => ({
          sheetId: s.properties?.sheetId,
          title: s.properties?.title,
          rowCount: s.properties?.gridProperties?.rowCount,
        })),
      };
    }
  } catch (err) {
    console.warn('Create spreadsheet API fallback:', err);
  }

  const mockId = `we_sheet_${Date.now().toString(36)}`;
  return {
    spreadsheetId: mockId,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${mockId}/edit`,
    title,
    sheets: defaultTabs.map((t, idx) => ({
      sheetId: idx,
      title: t,
      rowCount: 50,
    })),
  };
}

/**
 * Seed initial headers and records into Google Sheets
 */
export async function seedSpreadsheetData(
  spreadsheetId: string,
  token: string,
  data: {
    topics: Topic[];
    newsletters: Newsletter[];
    subscribers: Subscriber[];
    emailLogs: EmailLog[];
    systemLogs: SystemLog[];
  }
) {
  try {
    const valueRanges = [
      // 1. Topics Tab
      {
        range: 'Topics!A1:I',
        values: [
          ['TopicID', 'Topic', 'Scripture', 'Theme', 'Priority', 'Status', 'PublishDate', 'Notes', 'CreatedAt'],
          ...data.topics.map((t) => [
            t.TopicID,
            t.Topic,
            t.Scripture,
            t.Theme,
            t.Priority,
            t.Status,
            t.PublishDate,
            t.Notes,
            t.CreatedAt,
          ]),
        ],
      },
      // 2. Subscribers Tab
      {
        range: 'Subscribers!A1:H',
        values: [
          ['SubscriberID', 'Name', 'Email', 'Group', 'DateSubscribed', 'Status', 'SendCount', 'Source'],
          ...data.subscribers.map((s) => [
            s.SubscriberID,
            s.Name,
            s.Email,
            s.Group || 'General Subscribers',
            s.DateSubscribed,
            s.Status,
            s.SendCount,
            s.Source,
          ]),
        ],
      },
      // 3. Newsletters Tab
      {
        range: 'Newsletters!A1:H',
        values: [
          ['NewsletterID', 'TopicID', 'Title', 'Scripture', 'Theme', 'Status', 'EmailStatus', 'PublishDate'],
          ...data.newsletters.map((n) => [
            n.NewsletterID,
            n.TopicID,
            n.Title,
            n.ScriptureReference,
            n.Theme,
            n.Status,
            n.EmailStatus,
            n.PublishDate,
          ]),
        ],
      },
      // 4. Email Logs Tab
      {
        range: 'Email_Logs!A1:F',
        values: [
          ['EmailLogID', 'NewsletterID', 'SubscriberID', 'Email', 'SentAt', 'Status'],
          ...data.emailLogs.map((l) => [
            l.EmailLogID,
            l.NewsletterID,
            l.SubscriberID,
            l.Email,
            l.SentAt,
            l.Status,
          ]),
        ],
      },
    ];

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valueInputOption: 'USER_ENTERED',
          data: valueRanges,
        }),
      }
    );
  } catch (e) {
    console.warn('Error seeding spreadsheet values:', e);
  }
}

/**
 * Append a row to a specific Sheet in Google Sheets
 */
export async function appendSheetRow(
  spreadsheetId: string,
  sheetName: string,
  rowValues: any[]
): Promise<boolean> {
  const token = await getAccessToken();
  if (!token || token === 'google-workspace-auth-active') return true;

  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
        sheetName
      )}!A1:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [rowValues],
        }),
      }
    );
    return res.ok;
  } catch (err) {
    console.warn('Append sheet row error:', err);
    return false;
  }
}

/**
 * Fetch rows from Google Sheets
 */
export async function fetchSheetValues(
  spreadsheetId: string,
  range: string
): Promise<any[][] | null> {
  const token = await getAccessToken();
  if (!token || token === 'google-workspace-auth-active') return null;

  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
        range
      )}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.ok) {
      const data = await res.json();
      return data.values || [];
    }
  } catch (e) {
    console.warn('Fetch sheet values error:', e);
  }
  return null;
}
