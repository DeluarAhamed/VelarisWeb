// Velaris Web UI Kit — root app

const TITLES = {
  dashboard: { t: 'Dashboard', s: 'Overview of your workspace' },
  projects: { t: 'Projects', s: 'Every site in your workspace' },
  analytics: { t: 'Analytics', s: 'Traffic across all projects' },
  team: { t: 'Team', s: 'Manage who can access Velaris' },
  settings: { t: 'Settings', s: 'Profile and workspace preferences' },
  help: { t: 'Help & docs', s: 'Guides, references and support' },
};

function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div className="toast">
      <Icon name="check-circle" size={16} style={{ color: 'var(--color-success)' }} />
      {msg}
    </div>
  );
}

function App() {
  const [authed, setAuthed] = React.useState(() => localStorage.getItem('velaris_authed') === '1');
  const [nav, setNav] = React.useState(() => localStorage.getItem('velaris_nav') || 'dashboard');
  const [detail, setDetail] = React.useState(null);
  const [modal, setModal] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [toast, setToast] = React.useState('');

  React.useEffect(() => { localStorage.setItem('velaris_authed', authed ? '1' : '0'); }, [authed]);
  React.useEffect(() => { localStorage.setItem('velaris_nav', nav); }, [nav]);

  const flash = (m) => { setToast(m); clearTimeout(window.__t); window.__t = setTimeout(() => setToast(''), 2600); };

  if (!authed) return <Login onLogin={() => { setAuthed(true); flash('Signed in to Velaris'); }} />;

  const go = (k) => { setNav(k); setDetail(null); };
  const meta = TITLES[nav];

  let body;
  if (detail) body = <ProjectDetail p={detail} onBack={() => setDetail(null)} />;
  else if (nav === 'dashboard') body = <Dashboard onOpen={setDetail} />;
  else if (nav === 'projects') body = <Projects query={search} onOpen={setDetail} onNew={() => setModal('new')} />;
  else if (nav === 'analytics') body = <Analytics />;
  else if (nav === 'team') body = <Team onInvite={() => setModal('invite')} />;
  else if (nav === 'settings') body = <Settings />;
  else body = <EmptyHelp />;

  return (
    <div className="app">
      <Sidebar active={nav} onNav={go} user={VELARIS_USER} />
      <div className="app-main">
        <TopBar
          title={detail ? detail.name : meta.t}
          subtitle={detail ? detail.domain : meta.s}
          search={search} setSearch={setSearch}
          onNew={(nav === 'projects' || nav === 'dashboard') && !detail ? () => setModal('new') : null}
          onLogout={() => { setAuthed(false); setNav('dashboard'); setDetail(null); }}
        />
        <div className="app-content scrollarea">{body}</div>
      </div>
      {modal === 'new' && <NewProjectModal onClose={() => setModal(null)} onCreate={(n) => { setModal(null); flash('Project “' + n + '” is deploying'); setNav('projects'); }} />}
      {modal === 'invite' && <InviteModal onClose={() => { setModal(null); flash('Invite sent'); }} />}
      <Toast msg={toast} />
    </div>
  );
}

function EmptyHelp() {
  return (
    <div className="fadeup" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 0', gap: 14 }}>
      <span style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--teal-1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="question-circle" size={30} style={{ color: 'var(--teal-7)' }} />
      </span>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>How can we help?</h2>
      <p className="muted" style={{ margin: 0, maxWidth: 380 }}>Search the docs, browse guides, or reach out to support — we usually reply within a few hours.</p>
      <Button variant="primary" icon="message">Contact support</Button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
