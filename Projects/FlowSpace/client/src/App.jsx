import { useEffect, useMemo, useState } from 'react';
import {
  createEmail,
  createPage,
  createSnippet,
  createTask,
  getBootstrap,
  markReplied,
  patchTask,
  toggleIntegration,
  transcribeVoice,
} from './api';
import './App.css';

const tabs = ['overview', 'pages', 'tasks', 'snippets', 'inbox', 'voice'];

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [pageForm, setPageForm] = useState({ title: '', content: '' });
  const [taskForm, setTaskForm] = useState({ title: '', priority: 'medium', dueDate: '' });
  const [snippetForm, setSnippetForm] = useState({
    title: '',
    language: 'javascript',
    tags: '',
    code: '',
  });
  const [mailForm, setMailForm] = useState({ sender: '', subject: '', body: '' });
  const [voiceText, setVoiceText] = useState('');

  async function loadData() {
    try {
      setLoading(true);
      const bootstrap = await getBootstrap();
      setData(bootstrap);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data from server.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    if (!data) {
      return { pages: 0, todo: 0, snippets: 0, awaitingReply: 0 };
    }

    return {
      pages: data.pages.length,
      todo: data.tasks.filter((t) => t.status !== 'done').length,
      snippets: data.snippets.length,
      awaitingReply: data.inbox.filter((m) => m.awaitingReply).length,
    };
  }, [data]);

  async function onToggleIntegration(provider) {
    await toggleIntegration(provider);
    await loadData();
  }

  async function onCreatePage(e) {
    e.preventDefault();
    await createPage(pageForm);
    setPageForm({ title: '', content: '' });
    await loadData();
  }

  async function onCreateTask(e) {
    e.preventDefault();
    await createTask(taskForm);
    setTaskForm({ title: '', priority: 'medium', dueDate: '' });
    await loadData();
  }

  async function onTaskStatus(id, status) {
    await patchTask(id, { status });
    await loadData();
  }

  async function onCreateSnippet(e) {
    e.preventDefault();
    await createSnippet(snippetForm);
    setSnippetForm({ title: '', language: 'javascript', tags: '', code: '' });
    await loadData();
  }

  async function onCreateEmail(e) {
    e.preventDefault();
    await createEmail(mailForm);
    setMailForm({ sender: '', subject: '', body: '' });
    await loadData();
  }

  async function onVoiceSubmit(e) {
    e.preventDefault();
    await transcribeVoice({ transcript: voiceText, durationSec: Math.ceil(voiceText.length / 20) });
    setVoiceText('');
    await loadData();
  }

  if (loading) {
    return <main className="screen-state">Booting FlowSpace MVP...</main>;
  }

  if (!data) {
    return <main className="screen-state">{error || 'No data available.'}</main>;
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">SynqBite</p>
          <h1>FlowSpace MVP</h1>
          <p className="subtitle">Developer-first connected workspace running locally.</p>
        </div>
        <div className="integration-group">
          <button
            onClick={() => onToggleIntegration('gmail')}
            className={data.user.integrations.gmailConnected ? 'ok' : ''}
          >
            Gmail: {data.user.integrations.gmailConnected ? 'Connected' : 'Disconnected'}
          </button>
          <button
            onClick={() => onToggleIntegration('github')}
            className={data.user.integrations.githubConnected ? 'ok' : ''}
          >
            GitHub: {data.user.integrations.githubConnected ? 'Connected' : 'Disconnected'}
          </button>
        </div>
      </header>

      <section className="stats-grid">
        <article>
          <span>Pages</span>
          <strong>{stats.pages}</strong>
        </article>
        <article>
          <span>Open Tasks</span>
          <strong>{stats.todo}</strong>
        </article>
        <article>
          <span>Snippets</span>
          <strong>{stats.snippets}</strong>
        </article>
        <article>
          <span>Awaiting Reply</span>
          <strong>{stats.awaitingReply}</strong>
        </article>
      </section>

      <nav className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {error ? <p className="error">{error}</p> : null}

      {activeTab === 'overview' ? (
        <section className="panel">
          <h2>What this MVP includes</h2>
          <ul className="simple-list">
            <li>Workspace pages CRUD starter</li>
            <li>Kanban-style task status updates</li>
            <li>Snippet vault with tags + language</li>
            <li>Inbox compose + follow-up tracker</li>
            <li>Voice transcript into page workflow</li>
          </ul>
        </section>
      ) : null}

      {activeTab === 'pages' ? (
        <section className="panel two-col">
          <form onSubmit={onCreatePage} className="card form-card">
            <h2>New Page</h2>
            <input
              placeholder="Page title"
              value={pageForm.title}
              onChange={(e) => setPageForm((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
            <textarea
              placeholder="Page content"
              value={pageForm.content}
              onChange={(e) => setPageForm((prev) => ({ ...prev, content: e.target.value }))}
            />
            <button type="submit">Create Page</button>
          </form>
          <div className="card">
            <h2>Pages</h2>
            {data.pages.map((page) => (
              <article key={page.id} className="list-item">
                <h3>{page.title}</h3>
                <p>{page.content || 'No content yet.'}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === 'tasks' ? (
        <section className="panel two-col">
          <form onSubmit={onCreateTask} className="card form-card">
            <h2>New Task</h2>
            <input
              placeholder="Task title"
              value={taskForm.title}
              onChange={(e) => setTaskForm((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
            <select
              value={taskForm.priority}
              onChange={(e) => setTaskForm((prev) => ({ ...prev, priority: e.target.value }))}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <input
              type="date"
              value={taskForm.dueDate}
              onChange={(e) => setTaskForm((prev) => ({ ...prev, dueDate: e.target.value }))}
            />
            <button type="submit">Add Task</button>
          </form>
          <div className="card">
            <h2>Task Board</h2>
            {data.tasks.map((task) => (
              <article key={task.id} className="list-item">
                <h3>{task.title}</h3>
                <p>
                  {task.priority.toUpperCase()} | {task.status.replace('_', ' ')}
                </p>
                <div className="button-row">
                  <button onClick={() => onTaskStatus(task.id, 'todo')}>To Do</button>
                  <button onClick={() => onTaskStatus(task.id, 'in_progress')}>In Progress</button>
                  <button onClick={() => onTaskStatus(task.id, 'done')}>Done</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === 'snippets' ? (
        <section className="panel two-col">
          <form onSubmit={onCreateSnippet} className="card form-card">
            <h2>New Snippet</h2>
            <input
              placeholder="Snippet title"
              value={snippetForm.title}
              onChange={(e) => setSnippetForm((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
            <input
              placeholder="Language"
              value={snippetForm.language}
              onChange={(e) => setSnippetForm((prev) => ({ ...prev, language: e.target.value }))}
            />
            <input
              placeholder="Tags (comma separated)"
              value={snippetForm.tags}
              onChange={(e) => setSnippetForm((prev) => ({ ...prev, tags: e.target.value }))}
            />
            <textarea
              placeholder="Paste code"
              value={snippetForm.code}
              onChange={(e) => setSnippetForm((prev) => ({ ...prev, code: e.target.value }))}
              required
            />
            <button type="submit">Save Snippet</button>
          </form>
          <div className="card">
            <h2>Snippet Vault</h2>
            {data.snippets.map((snippet) => (
              <article key={snippet.id} className="list-item">
                <h3>{snippet.title}</h3>
                <p>
                  {snippet.language} | {snippet.tags.join(', ') || 'no tags'}
                </p>
                <pre>{snippet.code}</pre>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === 'inbox' ? (
        <section className="panel two-col">
          <form onSubmit={onCreateEmail} className="card form-card">
            <h2>Compose</h2>
            <input
              placeholder="Sender"
              value={mailForm.sender}
              onChange={(e) => setMailForm((prev) => ({ ...prev, sender: e.target.value }))}
              required
            />
            <input
              placeholder="Subject"
              value={mailForm.subject}
              onChange={(e) => setMailForm((prev) => ({ ...prev, subject: e.target.value }))}
              required
            />
            <textarea
              placeholder="Body"
              value={mailForm.body}
              onChange={(e) => setMailForm((prev) => ({ ...prev, body: e.target.value }))}
              required
            />
            <button type="submit">Send (Mock)</button>
          </form>
          <div className="card">
            <h2>Inbox</h2>
            {data.inbox.map((mail) => (
              <article key={mail.id} className="list-item">
                <h3>{mail.subject}</h3>
                <p>From: {mail.sender}</p>
                <p>{mail.body}</p>
                <button onClick={() => markReplied(mail.id).then(loadData)}>
                  {mail.awaitingReply ? 'Mark Replied' : 'Replied'}
                </button>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === 'voice' ? (
        <section className="panel two-col">
          <form onSubmit={onVoiceSubmit} className="card form-card">
            <h2>Voice to Note (MVP)</h2>
            <p className="note">Paste or type transcript text to simulate Whisper pipeline.</p>
            <textarea
              placeholder="Transcript text"
              value={voiceText}
              onChange={(e) => setVoiceText(e.target.value)}
              required
            />
            <button type="submit">Transcribe & Save as Page</button>
          </form>
          <div className="card">
            <h2>Voice Notes</h2>
            {data.voiceNotes.length === 0 ? <p>No voice notes yet.</p> : null}
            {data.voiceNotes.map((note) => (
              <article key={note.id} className="list-item">
                <h3>Voice Note</h3>
                <p>{note.cleanedText}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

export default App;
