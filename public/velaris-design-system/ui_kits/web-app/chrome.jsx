// Velaris Web UI Kit — app chrome (Sidebar, TopBar)

function Sidebar({ active, onNav, user }) {
  const nav = [
    { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { key: 'projects', label: 'Projects', icon: 'appstore' },
    { key: 'analytics', label: 'Analytics', icon: 'bar-chart' },
    { key: 'team', label: 'Team', icon: 'team' },
  ];
  const sub = [
    { key: 'settings', label: 'Settings', icon: 'setting' },
    { key: 'help', label: 'Help & docs', icon: 'question-circle' },
  ];
  const item = (n) => (
    <button key={n.key} className={'side-item' + (active === n.key ? ' active' : '')}
      onClick={() => onNav(n.key)}>
      <Icon name={n.icon} size={17} />
      <span>{n.label}</span>
    </button>
  );
  return (
    <aside className="sidebar">
      <div className="side-brand">
        <Logo size={28} />
      </div>
      <div className="side-section-label">Workspace</div>
      <nav className="side-nav">{nav.map(item)}</nav>
      <div style={{ flex: 1 }} />
      <nav className="side-nav">{sub.map(item)}</nav>
      <div className="side-user">
        <Avatar name={user.name} color="var(--teal-7)" size={32} />
        <div style={{ minWidth: 0 }}>
          <div className="side-user-name">{user.name}</div>
          <div className="side-user-plan">{user.plan}</div>
        </div>
        <Icon name="up" size={12} style={{ color: 'var(--text-tertiary)', marginLeft: 'auto', transform: 'rotate(180deg)' }} />
      </div>
    </aside>
  );
}

function TopBar({ title, subtitle, onNew, search, setSearch, onLogout }) {
  return (
    <header className="topbar">
      <div>
        <h1 className="topbar-title">{title}</h1>
        {subtitle && <div className="topbar-sub">{subtitle}</div>}
      </div>
      <div className="topbar-actions">
        <div className="topbar-search">
          <Icon name="search" size={15} style={{ color: 'var(--text-tertiary)' }} />
          <input placeholder="Search projects, domains…" value={search}
            onChange={e => setSearch(e.target.value)} />
          <span className="kbd">⌘K</span>
        </div>
        <button className="icon-btn" title="Notifications"><Icon name="bell" size={18} /><span className="ping" /></button>
        <button className="icon-btn" title="Sign out" onClick={onLogout}><Icon name="logout" size={18} /></button>
        {onNew && <Button variant="primary" icon="plus" onClick={onNew}>New project</Button>}
      </div>
    </header>
  );
}

Object.assign(window, { Sidebar, TopBar });
