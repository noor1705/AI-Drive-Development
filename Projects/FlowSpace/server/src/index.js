const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { db, createRecord, updateRecord, deleteRecord } = require('./store');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_, res) => {
  res.json({ ok: true, service: 'flowspace-server', timestamp: new Date().toISOString() });
});

app.get('/api/bootstrap', (_, res) => {
  res.json(db);
});

app.post('/api/integrations/:provider/toggle', (req, res) => {
  const provider = req.params.provider;
  if (!['gmail', 'github'].includes(provider)) {
    return res.status(400).json({ message: 'Unsupported provider' });
  }

  const key = `${provider}Connected`;
  db.user.integrations[key] = !db.user.integrations[key];

  return res.json({ provider, connected: db.user.integrations[key] });
});

app.post('/api/pages', (req, res) => {
  const { title, content = '', parentId = null } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const page = createRecord('pages', { title, content, parentId });
  return res.status(201).json(page);
});

app.put('/api/pages/:id', (req, res) => {
  const page = updateRecord('pages', req.params.id, req.body);
  if (!page) {
    return res.status(404).json({ message: 'Page not found' });
  }
  return res.json(page);
});

app.delete('/api/pages/:id', (req, res) => {
  const ok = deleteRecord('pages', req.params.id);
  if (!ok) {
    return res.status(404).json({ message: 'Page not found' });
  }
  return res.status(204).send();
});

app.post('/api/tasks', (req, res) => {
  const { title, status = 'todo', priority = 'medium', dueDate = null } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const task = createRecord('tasks', {
    title,
    status,
    priority,
    dueDate,
    linkedPageId: req.body.linkedPageId || null,
    linkedEmailThreadId: req.body.linkedEmailThreadId || null,
  });

  return res.status(201).json(task);
});

app.patch('/api/tasks/:id', (req, res) => {
  const task = updateRecord('tasks', req.params.id, req.body);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  return res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const ok = deleteRecord('tasks', req.params.id);
  if (!ok) {
    return res.status(404).json({ message: 'Task not found' });
  }
  return res.status(204).send();
});

app.post('/api/snippets', (req, res) => {
  const { title, language = 'plaintext', tags = [], code = '' } = req.body;
  if (!title || !code) {
    return res.status(400).json({ message: 'Title and code are required' });
  }

  const snippet = createRecord('snippets', {
    title,
    language,
    tags: Array.isArray(tags) ? tags : String(tags).split(',').map((tag) => tag.trim()).filter(Boolean),
    code,
  });
  return res.status(201).json(snippet);
});

app.delete('/api/snippets/:id', (req, res) => {
  const ok = deleteRecord('snippets', req.params.id);
  if (!ok) {
    return res.status(404).json({ message: 'Snippet not found' });
  }
  return res.status(204).send();
});

app.post('/api/inbox', (req, res) => {
  const { sender, subject, body } = req.body;
  if (!sender || !subject || !body) {
    return res.status(400).json({ message: 'Sender, subject, and body are required' });
  }

  const mail = createRecord('inbox', {
    sender,
    subject,
    body,
    awaitingReply: true,
    timestamp: new Date().toISOString(),
  });

  return res.status(201).json(mail);
});

app.patch('/api/inbox/:id/reply', (req, res) => {
  const updated = updateRecord('inbox', req.params.id, { awaitingReply: false });
  if (!updated) {
    return res.status(404).json({ message: 'Thread not found' });
  }
  return res.json(updated);
});

app.post('/api/voice/transcribe', (req, res) => {
  const transcript = (req.body.transcript || '').trim();
  if (!transcript) {
    return res.status(400).json({ message: 'Transcript text is required for MVP' });
  }

  const voiceNote = createRecord('voiceNotes', {
    transcript,
    cleanedText: transcript.replace(/\b(um|uh|like)\b/gi, '').replace(/\s+/g, ' ').trim(),
    durationSec: Number(req.body.durationSec || 0),
  });

  const page = createRecord('pages', {
    title: `Voice Note ${new Date().toLocaleString()}`,
    content: voiceNote.cleanedText,
    parentId: null,
  });

  voiceNote.linkedPageId = page.id;
  return res.status(201).json({ voiceNote, page });
});

app.use((err, _, res, __) => {
  console.error(err);
  res.status(500).json({ message: 'Unexpected server error' });
});

app.listen(PORT, () => {
  console.log(`FlowSpace API listening on http://localhost:${PORT}`);
});
