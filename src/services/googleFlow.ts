export interface FlowNode {
  id: string;
  type: 'trigger' | 'gemini_ai' | 'google_docs' | 'google_sheets' | 'google_drive' | 'google_tasks' | 'google_forms' | 'veo_video' | 'gmail';
  label: string;
  description: string;
  service: 'Google Workspace' | 'Gemini AI' | 'Cloud Storage' | 'Communications';
  status: 'idle' | 'running' | 'success' | 'failed' | 'paused';
  icon: string;
  config: Record<string, any>;
  output?: Record<string, any>;
  durationMs?: number;
}

export interface FlowConnection {
  fromNodeId: string;
  toNodeId: string;
}

export interface WorkflowPipeline {
  id: string;
  name: string;
  description: string;
  triggerType: 'Schedule' | 'New_Topic' | 'Manual_Run' | 'Form_Submission';
  scheduleInterval?: string;
  nodes: FlowNode[];
  connections: FlowConnection[];
  lastRun?: string;
  status: 'active' | 'paused' | 'draft';
  executionCount: number;
}

export interface FlowExecutionStepLog {
  timestamp: string;
  nodeId: string;
  nodeLabel: string;
  level: 'info' | 'success' | 'warn' | 'error';
  message: string;
  data?: any;
}

/**
 * Standard Omnichannel Word Embassy Pipeline
 */
export const DEFAULT_OMNICHANNEL_WORKFLOW: WorkflowPipeline = {
  id: 'flow-omnichannel-01',
  name: 'Sunday Omnichannel Publication Engine',
  description: 'Fully automated end-to-end publishing pipeline triggered every Tuesday: Research -> Gemini Exegesis -> Google Doc -> Sheets Log -> Drive Folder -> Tasks -> Forms -> Email Blast.',
  triggerType: 'Schedule',
  scheduleInterval: 'Every Tuesday at 06:00 UTC',
  status: 'active',
  executionCount: 18,
  lastRun: '2026-08-25T06:00:00Z',
  connections: [
    { fromNodeId: 'node-trigger', toNodeId: 'node-gemini' },
    { fromNodeId: 'node-gemini', toNodeId: 'node-docs' },
    { fromNodeId: 'node-docs', toNodeId: 'node-sheets' },
    { fromNodeId: 'node-sheets', toNodeId: 'node-drive' },
    { fromNodeId: 'node-drive', toNodeId: 'node-tasks' },
    { fromNodeId: 'node-tasks', toNodeId: 'node-forms' },
    { fromNodeId: 'node-forms', toNodeId: 'node-veo' },
    { fromNodeId: 'node-veo', toNodeId: 'node-gmail' },
  ],
  nodes: [
    {
      id: 'node-trigger',
      type: 'trigger',
      label: 'Trigger: Next Topic Scheduled',
      description: 'Pulls the highest priority Draft topic from the Topic Bank calendar.',
      service: 'Google Workspace',
      status: 'idle',
      icon: 'Clock',
      config: { triggerFrequency: 'Weekly on Tuesday', targetStatus: 'Draft' },
    },
    {
      id: 'node-gemini',
      type: 'gemini_ai',
      label: 'Gemini 3.7 Pro: Theological Exegesis',
      description: 'Generates 7-part biblical exposition, 3 key pillars, practical application, and pastoral prayer.',
      service: 'Gemini AI',
      status: 'idle',
      icon: 'Sparkles',
      config: { model: 'gemini-3.7-flash', temperature: 0.7, wordCountTarget: 1200 },
    },
    {
      id: 'node-docs',
      type: 'google_docs',
      label: 'Google Docs: Formatted Manuscript',
      description: 'Creates a stylized Google Document in the ministerial archive.',
      service: 'Google Workspace',
      status: 'idle',
      icon: 'FileText',
      config: { includeHeader: true, scriptureCalloutStyling: true },
    },
    {
      id: 'node-sheets',
      type: 'google_sheets',
      label: 'Google Sheets: Master Registry Sync',
      description: 'Appends topic status and publication metadata to Master Google Spreadsheet.',
      service: 'Google Workspace',
      status: 'idle',
      icon: 'FileSpreadsheet',
      config: { spreadsheetTab: 'Newsletters', updateStatusTo: 'Generated' },
    },
    {
      id: 'node-drive',
      type: 'google_drive',
      label: 'Google Drive: 7-Asset Cloud Archive',
      description: 'Creates Year/Month folder hierarchy and saves Doc, Graphics, Script, Prompts, and JSON metadata.',
      service: 'Cloud Storage',
      status: 'idle',
      icon: 'HardDrive',
      config: { folderFormat: 'Word Embassy / Newsletters / {YEAR} / {MONTH - TITLE}' },
    },
    {
      id: 'node-tasks',
      type: 'google_tasks',
      label: 'Google Tasks: Pastoral Review Assignment',
      description: 'Creates editorial review tasks with due dates in Google Tasks.',
      service: 'Google Workspace',
      status: 'idle',
      icon: 'CheckSquare',
      config: { taskList: 'Word Embassy Editorial Workflow', dueHoursFromNow: 48 },
    },
    {
      id: 'node-forms',
      type: 'google_forms',
      label: 'Google Forms: Feedback & Prayer Link',
      description: 'Embeds dynamic Google Forms link for reader prayer requests and testimonies.',
      service: 'Google Workspace',
      status: 'idle',
      icon: 'HelpCircle',
      config: { formType: 'PRAYER_REQUEST', appendFooterLink: true },
    },
    {
      id: 'node-veo',
      type: 'veo_video',
      label: 'Veo Video & YouTube Shorts Pipeline',
      description: 'Produces cinematic 9:16 video generation prompts and YouTube Short narration copy.',
      service: 'Gemini AI',
      status: 'idle',
      icon: 'Video',
      config: { aspectRatio: '9:16', style: 'Cinematic Biblical Illumination' },
    },
    {
      id: 'node-gmail',
      type: 'gmail',
      label: 'Gmail / Resend: Subscriber Broadcast',
      description: 'Delivers beautifully responsive HTML newsletter to active email subscriber list.',
      service: 'Communications',
      status: 'idle',
      icon: 'Send',
      config: { senderName: 'Word Embassy Ministries', sendBatchSize: 50 },
    },
  ],
};
