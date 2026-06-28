// Velaris Web UI Kit — mock data

const VELARIS_USER = { name: 'Maya Okonkwo', email: 'maya@velaris.io', plan: 'Pro plan', initials: 'MO' };

const PROJECTS = [
  { id: 1, name: 'velaris-marketing', domain: 'velaris.io', status: 'live', framework: 'Next.js', visitors: '128k', deploy: '6m ago', branch: 'main' },
  { id: 2, name: 'docs-portal', domain: 'docs.velaris.io', status: 'live', framework: 'Astro', visitors: '41k', deploy: '2h ago', branch: 'main' },
  { id: 3, name: 'app-dashboard', domain: 'app.velaris.io', status: 'building', framework: 'React', visitors: '88k', deploy: 'now', branch: 'feat/billing' },
  { id: 4, name: 'blog-engine', domain: 'blog.velaris.io', status: 'live', framework: 'SvelteKit', visitors: '19k', deploy: '1d ago', branch: 'main' },
  { id: 5, name: 'status-page', domain: 'status.velaris.io', status: 'error', framework: 'Vue', visitors: '7.2k', deploy: '3h ago', branch: 'main' },
  { id: 6, name: 'partner-portal', domain: 'partners.velaris.io', status: 'live', framework: 'Next.js', visitors: '12k', deploy: '4d ago', branch: 'main' },
];

const ACTIVITY = [
  { who: 'Maya Okonkwo', action: 'deployed', target: 'velaris-marketing', meta: 'production · main', time: '6m', icon: 'rocket', tone: 'teal' },
  { who: 'CI Pipeline', action: 'started build', target: 'app-dashboard', meta: 'feat/billing', time: '9m', icon: 'sync', tone: 'teal' },
  { who: 'Diego Alvarez', action: 'failed deploy', target: 'status-page', meta: 'exit code 1', time: '3h', icon: 'close-circle', tone: 'error' },
  { who: 'Priya Nair', action: 'connected domain', target: 'docs.velaris.io', meta: 'DNS verified', time: '5h', icon: 'global', tone: 'success' },
  { who: 'Maya Okonkwo', action: 'invited', target: 'sam@velaris.io', meta: 'Developer role', time: '1d', icon: 'user', tone: 'neutral' },
];

const TEAM = [
  { name: 'Maya Okonkwo', email: 'maya@velaris.io', role: 'Owner', status: 'online' },
  { name: 'Diego Alvarez', email: 'diego@velaris.io', role: 'Admin', status: 'online' },
  { name: 'Priya Nair', email: 'priya@velaris.io', role: 'Developer', status: 'away' },
  { name: 'Sam Whitfield', email: 'sam@velaris.io', role: 'Developer', status: 'offline' },
  { name: 'Lena Fischer', email: 'lena@velaris.io', role: 'Viewer', status: 'offline' },
];

const STATUS_MAP = {
  live: { tone: 'success', label: 'Live', dot: '#52C41A' },
  building: { tone: 'teal', label: 'Building', dot: '#2A8F94' },
  error: { tone: 'error', label: 'Error', dot: '#FF4D4F' },
};

Object.assign(window, { VELARIS_USER, PROJECTS, ACTIVITY, TEAM, STATUS_MAP });
