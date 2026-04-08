import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export async function getBootstrap() {
  const { data } = await api.get('/bootstrap');
  return data;
}

export async function toggleIntegration(provider) {
  const { data } = await api.post(`/integrations/${provider}/toggle`);
  return data;
}

export async function createPage(payload) {
  const { data } = await api.post('/pages', payload);
  return data;
}

export async function deletePage(id) {
  await api.delete(`/pages/${id}`);
}

export async function createTask(payload) {
  const { data } = await api.post('/tasks', payload);
  return data;
}

export async function patchTask(id, payload) {
  const { data } = await api.patch(`/tasks/${id}`, payload);
  return data;
}

export async function createSnippet(payload) {
  const { data } = await api.post('/snippets', payload);
  return data;
}

export async function createEmail(payload) {
  const { data } = await api.post('/inbox', payload);
  return data;
}

export async function markReplied(id) {
  const { data } = await api.patch(`/inbox/${id}/reply`);
  return data;
}

export async function transcribeVoice(payload) {
  const { data } = await api.post('/voice/transcribe', payload);
  return data;
}
