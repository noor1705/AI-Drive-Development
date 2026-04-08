const { v4: uuid } = require('uuid');

const now = () => new Date().toISOString();

const db = {
  user: {
    id: 'user-1',
    name: 'FlowSpace User',
    email: 'user@flowspace.dev',
    mode: 'developer',
    integrations: {
      gmailConnected: false,
      githubConnected: false,
    },
  },
  pages: [
    {
      id: uuid(),
      title: 'Welcome to FlowSpace',
      content:
        'This is your first page. Use the Pages tab to manage nested workspace docs quickly.',
      parentId: null,
      createdAt: now(),
      updatedAt: now(),
    },
  ],
  tasks: [
    {
      id: uuid(),
      title: 'Set up MVP stack',
      status: 'in_progress',
      priority: 'high',
      dueDate: null,
      linkedPageId: null,
      linkedEmailThreadId: null,
      createdAt: now(),
      updatedAt: now(),
    },
  ],
  snippets: [
    {
      id: uuid(),
      title: 'Express health route',
      language: 'javascript',
      tags: ['node', 'api'],
      code: "app.get('/api/health', (_, res) => res.json({ ok: true }));",
      createdAt: now(),
      updatedAt: now(),
    },
  ],
  inbox: [
    {
      id: uuid(),
      sender: 'client@example.com',
      subject: 'Kickoff tomorrow?',
      body: 'Can we have a quick sync tomorrow at 10am?',
      awaitingReply: true,
      timestamp: now(),
    },
  ],
  voiceNotes: [],
};

function createRecord(collection, payload) {
  const record = {
    id: uuid(),
    ...payload,
    createdAt: now(),
    updatedAt: now(),
  };
  db[collection].unshift(record);
  return record;
}

function updateRecord(collection, id, patch) {
  const idx = db[collection].findIndex((item) => item.id === id);
  if (idx < 0) {
    return null;
  }

  db[collection][idx] = {
    ...db[collection][idx],
    ...patch,
    updatedAt: now(),
  };
  return db[collection][idx];
}

function deleteRecord(collection, id) {
  const idx = db[collection].findIndex((item) => item.id === id);
  if (idx < 0) {
    return false;
  }
  db[collection].splice(idx, 1);
  return true;
}

module.exports = {
  db,
  createRecord,
  updateRecord,
  deleteRecord,
};
