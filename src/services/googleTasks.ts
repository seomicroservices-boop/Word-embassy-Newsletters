import { getAccessToken } from './firebaseAuth';

export interface GoogleTaskItem {
  id: string;
  title: string;
  notes?: string;
  status: 'needsAction' | 'completed';
  due?: string;
  updated?: string;
  completed?: string;
  category?: 'Editorial' | 'Scripture' | 'Media' | 'Broadcast';
}

export interface GoogleTaskList {
  id: string;
  title: string;
  updated?: string;
}

/**
 * Fetch or create default "Word Embassy Editorial Workflow" task list
 */
export async function getOrCreateTaskList(title: string = 'Word Embassy Editorial Workflow'): Promise<GoogleTaskList> {
  const token = await getAccessToken();

  if (!token || token === 'google-workspace-auth-active') {
    return { id: 'we-tasklist-main', title };
  }

  try {
    const listRes = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (listRes.ok) {
      const data = await listRes.json();
      const existing = (data.items || []).find((l: any) => l.title === title);
      if (existing) {
        return { id: existing.id, title: existing.title, updated: existing.updated };
      }
    }

    // Create new list
    const createRes = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });

    if (createRes.ok) {
      const created = await createRes.json();
      return { id: created.id, title: created.title };
    }
  } catch (err) {
    console.warn('Google Tasks list error fallback:', err);
  }

  return { id: 'we-tasklist-main', title };
}

/**
 * List tasks from a Google Task List
 */
export async function listGoogleTasks(taskListId: string): Promise<GoogleTaskItem[]> {
  const token = await getAccessToken();

  if (!token || token === 'google-workspace-auth-active') {
    return [
      {
        id: 'task-1',
        title: 'Review Exegesis for "Walking in Divine Authority"',
        notes: 'Verify Hebrew & Greek word studies in Luke 10:19 and cross-references.',
        status: 'needsAction',
        due: new Date(Date.now() + 86400000 * 2).toISOString(),
        category: 'Editorial',
      },
      {
        id: 'task-2',
        title: 'Render 9:16 Veo Video Devotional & Sound Design',
        notes: 'Vertical format with cinematic golden lighting and voiceover pacing.',
        status: 'needsAction',
        due: new Date(Date.now() + 86400000 * 3).toISOString(),
        category: 'Media',
      },
      {
        id: 'task-3',
        title: 'Sync Master Spreadsheet & Verify Subscriber Segment',
        notes: 'Ensure new subscribers from Google Forms are mapped to weekly mail merge.',
        status: 'completed',
        due: new Date(Date.now() - 86400000).toISOString(),
        category: 'Broadcast',
      },
      {
        id: 'task-4',
        title: 'Export Formatted Google Doc to Pastoral Archives',
        notes: 'Word Embassy / Newsletters / 2026 Archive.',
        status: 'needsAction',
        due: new Date(Date.now() + 86400000 * 4).toISOString(),
        category: 'Scripture',
      },
    ];
  }

  try {
    const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks?showCompleted=true&showHidden=true`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      return (data.items || []).map((t: any) => ({
        id: t.id,
        title: t.title,
        notes: t.notes,
        status: t.status,
        due: t.due,
        updated: t.updated,
        completed: t.completed,
      }));
    }
  } catch (err) {
    console.warn('Failed to list tasks:', err);
  }

  return [];
}

/**
 * Create a new task in Google Tasks
 */
export async function createGoogleTask(
  taskListId: string,
  task: { title: string; notes?: string; due?: string }
): Promise<GoogleTaskItem> {
  const token = await getAccessToken();

  if (!token || token === 'google-workspace-auth-active') {
    return {
      id: `task_${Date.now()}`,
      title: task.title,
      notes: task.notes,
      status: 'needsAction',
      due: task.due,
    };
  }

  try {
    const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: task.title,
        notes: task.notes,
        due: task.due,
      }),
    });

    if (res.ok) {
      const created = await res.json();
      return {
        id: created.id,
        title: created.title,
        notes: created.notes,
        status: created.status,
        due: created.due,
      };
    }
  } catch (err) {
    console.warn('Error creating Google Task:', err);
  }

  return {
    id: `task_${Date.now()}`,
    title: task.title,
    notes: task.notes,
    status: 'needsAction',
    due: task.due,
  };
}

/**
 * Update task status (toggle complete / needsAction)
 */
export async function toggleGoogleTaskStatus(
  taskListId: string,
  taskId: string,
  newStatus: 'needsAction' | 'completed'
): Promise<boolean> {
  const token = await getAccessToken();
  if (!token || token === 'google-workspace-auth-active') return true;

  try {
    const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${taskListId}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: newStatus,
        completed: newStatus === 'completed' ? new Date().toISOString() : null,
      }),
    });
    return res.ok;
  } catch (err) {
    console.warn('Error updating task:', err);
    return false;
  }
}
