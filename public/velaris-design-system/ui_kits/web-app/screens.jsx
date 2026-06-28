// Velaris Web UI Kit — screens

function StatCard({ icon, label, value, delta, dir }) {
  return (
    <div className="card card-pad">
      <div className="stat-label"><Icon name={icon} size={15} style={{ color: 'var(--teal-6)' }} />{label}</div>
      <div className="stat-value">{value}</div>
      <div className={'stat-delta ' + (dir === 'down' ? 'down' : 'up')}>
        {dir === 'down' ? '▼' : '▲'} {delta} <span className="dim" style={{ fontWeight: 400 }}>vs last week</span>
      </div>
    </div>
  );
}

function MiniBars({ data, color = 'var(--teal-6)', soft = 'var(--teal-2)' }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 64 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, height: (v / max * 100) + '%', borderRadius: '3px 3px 0 0',
          background: i === data.length - 1 ? color : soft }} />
      ))}
    </div>
  );
}

function StatusTag({ status }) {
  const s = STATUS_MAP[status];
  return <Tag tone={s.tone} pill><span className="dot" style={{ background: s.dot }} />{s.label}</Tag>;
}

function ProjectRow({ p, onOpen }) {
  return (
    <tr onClick={() => onOpen && onOpen(p)} style={{ cursor: 'pointer' }}>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <span style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--teal-1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            <Icon name="global" size={17} style={{ color: 'var(--teal-7)' }} />
          </span>
          <div>
            <div className="row-main">{p.name}</div>
            <div className="row-sub mono">{p.domain}</div>
          </div>
        </div>
      </td>
      <td><StatusTag status={p.status} /></td>
      <td className="muted">{p.framework}</td>
      <td className="mono" style={{ color: 'var(--text-primary)' }}>{p.visitors}</td>
      <td className="row-sub"><span className="mono">{p.branch}</span> · {p.deploy}</td>
      <td style={{ textAlign: 'right' }}><Icon name="ellipsis" size={18} style={{ color: 'var(--text-tertiary)' }} /></td>
    </tr>
  );
}

function Dashboard({ onOpen }) {
  return (
    <div className="fadeup" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="grid-stats">
        <StatCard icon="global" label="Visitors" value="296k" delta="12.4%" />
        <StatCard icon="rocket" label="Deploys" value="184" delta="8.1%" />
        <StatCard icon="thunderbolt" label="Avg build" value="42s" delta="5.0%" dir="down" />
        <StatCard icon="safety" label="Uptime" value="99.98%" delta="0.02%" />
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '1.6fr 1fr' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 0' }}>
            <h3 className="page-section-title" style={{ margin: 0 }}>Recent projects</h3>
            <span className="muted" style={{ fontSize: 13, color: 'var(--teal-6)', cursor: 'pointer', fontWeight: 500 }}>View all →</span>
          </div>
          <table className="tbl" style={{ marginTop: 8 }}>
            <thead><tr><th>Project</th><th>Status</th><th>Framework</th><th>Visitors</th><th>Last deploy</th><th></th></tr></thead>
            <tbody>{PROJECTS.slice(0, 4).map(p => <ProjectRow key={p.id} p={p} onOpen={onOpen} />)}</tbody>
          </table>
        </div>

        <div className="card card-pad">
          <h3 className="page-section-title">Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {ACTIVITY.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 11, padding: '9px 0', borderBottom: i < ACTIVITY.length - 1 ? '1px solid var(--border-secondary)' : 0 }}>
                <span style={{ width: 30, height: 30, borderRadius: 8, flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  background: a.tone === 'error' ? 'var(--color-error-bg)' : a.tone === 'success' ? 'var(--color-success-bg)' : 'var(--teal-1)' }}>
                  <Icon name={a.icon} size={15} style={{ color: a.tone === 'error' ? 'var(--color-error)' : a.tone === 'success' ? 'var(--color-success-active)' : 'var(--teal-7)' }} />
                </span>
                <div style={{ fontSize: 13, lineHeight: 1.45 }}>
                  <div><b>{a.who}</b> <span className="muted">{a.action}</span> <b style={{ color: 'var(--teal-7)' }}>{a.target}</b></div>
                  <div className="row-sub">{a.meta} · {a.time} ago</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Projects({ onOpen, onNew, query }) {
  const list = PROJECTS.filter(p => !query || (p.name + p.domain + p.framework).toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="fadeup">
      <div className="grid-3">
        {list.map(p => (
          <div key={p.id} className="card card-pad card-hoverable" onClick={() => onOpen(p)}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--teal-1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="global" size={20} style={{ color: 'var(--teal-7)' }} />
              </span>
              <StatusTag status={p.status} />
            </div>
            <div className="row-main" style={{ fontSize: 15, marginTop: 14 }}>{p.name}</div>
            <div className="row-sub mono">{p.domain}</div>
            <hr className="divider" style={{ margin: '14px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
              <span className="muted">{p.framework}</span>
              <span className="muted"><span className="mono" style={{ color: 'var(--text-primary)' }}>{p.visitors}</span> visitors</span>
            </div>
            <div className="row-sub" style={{ marginTop: 8 }}><Icon name="sync" size={12} style={{ verticalAlign: '-2px', color: 'var(--text-tertiary)' }} /> {p.branch} · {p.deploy}</div>
          </div>
        ))}
        <button className="card card-pad new-tile" onClick={onNew}>
          <Icon name="plus" size={22} style={{ color: 'var(--teal-6)' }} />
          <span>New project</span>
          <span className="row-sub" style={{ fontWeight: 400 }}>Import a repo or start fresh</span>
        </button>
      </div>
    </div>
  );
}

function Analytics() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const traffic = [62, 48, 75, 90, 84, 40, 55];
  const max = Math.max(...traffic);
  return (
    <div className="fadeup" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="grid-stats">
        <StatCard icon="global" label="Page views" value="1.24M" delta="9.2%" />
        <StatCard icon="user" label="Unique visitors" value="296k" delta="12.4%" />
        <StatCard icon="clock" label="Avg session" value="3m 12s" delta="4.1%" />
        <StatCard icon="line-chart" label="Bounce rate" value="38.2%" delta="2.3%" dir="down" />
      </div>
      <div className="card card-pad">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3 className="page-section-title" style={{ margin: 0 }}>Traffic — last 7 days</h3>
          <div className="seg-inline">
            <span className="on">Week</span><span>Month</span><span>Year</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, height: 200, paddingTop: 10 }}>
          {traffic.map((v, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ width: '100%', maxWidth: 54, height: (v / max * 100) + '%', borderRadius: '6px 6px 0 0',
                background: i === 3 ? 'var(--brand-gradient)' : 'var(--teal-2)' }} />
              <span className="row-sub">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid-2">
        <div className="card card-pad">
          <h3 className="page-section-title">Top pages</h3>
          {[['/','42%'],['/pricing','18%'],['/docs','15%'],['/blog/launch','11%'],['/changelog','7%']].map(([p, pct], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0' }}>
              <span className="mono" style={{ fontSize: 13, width: 130, color: 'var(--text-primary)' }}>{p}</span>
              <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'var(--fill-tertiary)', overflow: 'hidden' }}>
                <div style={{ width: pct, height: '100%', background: 'var(--teal-6)', borderRadius: 4 }} />
              </div>
              <span className="row-sub" style={{ width: 38, textAlign: 'right' }}>{pct}</span>
            </div>
          ))}
        </div>
        <div className="card card-pad">
          <h3 className="page-section-title">Visitors by country</h3>
          {[['United States','58k','#2A8F94'],['Germany','31k','#41A8AC'],['India','27k','#6AC1C4'],['Brazil','18k','#9BD7D9'],['Japan','12k','#C5E8E9']].map(([c, n, col], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--border-secondary)' : 0 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: col }} />
              <span style={{ flex: 1, fontSize: 14 }}>{c}</span>
              <span className="mono row-sub" style={{ color: 'var(--text-primary)' }}>{n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Team({ onInvite }) {
  return (
    <div className="fadeup">
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
          <div><h3 className="page-section-title" style={{ margin: 0 }}>Members</h3><span className="row-sub">{TEAM.length} people in this workspace</span></div>
          <Button variant="primary" icon="user" onClick={onInvite}>Invite member</Button>
        </div>
        <table className="tbl">
          <thead><tr><th>Member</th><th>Role</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {TEAM.map((m, i) => (
              <tr key={i}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <Avatar name={m.name} size={34} color={['var(--teal-7)','var(--teal-6)','var(--teal-8)','#1A2940','var(--teal-5)'][i % 5]} />
                    <div><div className="row-main">{m.name}</div><div className="row-sub mono">{m.email}</div></div>
                  </div>
                </td>
                <td><Tag tone={m.role === 'Owner' ? 'teal' : 'neutral'}>{m.role}</Tag></td>
                <td>
                  <span className="muted" style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ width: 7, height: 7, borderRadius: 50, background: m.status === 'online' ? '#52C41A' : m.status === 'away' ? '#FAAD14' : 'var(--text-quaternary)' }} />
                    {m.status[0].toUpperCase() + m.status.slice(1)}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}><Button variant="text" size="sm">Manage</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Settings() {
  return (
    <div className="fadeup" style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="card card-pad">
        <h3 className="page-section-title">Profile</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <Avatar name="Maya Okonkwo" size={56} color="var(--teal-7)" />
          <div><Button variant="default" size="sm" icon="upload">Change photo</Button><div className="row-sub" style={{ marginTop: 6 }}>JPG or PNG, up to 2 MB</div></div>
        </div>
        <div className="grid-2" style={{ gap: 14 }}>
          <Field label="Full name"><Input defaultValue="Maya Okonkwo" /></Field>
          <Field label="Email"><Input defaultValue="maya@velaris.io" icon="mail" /></Field>
        </div>
      </div>
      <div className="card card-pad">
        <h3 className="page-section-title">Workspace</h3>
        <div className="grid-2" style={{ gap: 14 }}>
          <Field label="Workspace name"><Input defaultValue="Velaris" /></Field>
          <Field label="Primary domain"><Input defaultValue="velaris.io" icon="global" /></Field>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, padding: '14px 0 0', borderTop: '1px solid var(--border-secondary)' }}>
          <div><div className="row-main" style={{ fontSize: 14 }}>Production deploy protection</div><div className="row-sub">Require approval before deploying to production</div></div>
          <Toggle defaultOn />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <Button variant="text">Cancel</Button>
        <Button variant="primary">Save changes</Button>
      </div>
    </div>
  );
}

function Toggle({ defaultOn }) {
  const [on, setOn] = React.useState(!!defaultOn);
  return (
    <button onClick={() => setOn(!on)} className="vtoggle" data-on={on}
      style={{ width: 44, height: 24, borderRadius: 999, border: 0, cursor: 'pointer', padding: 2,
        background: on ? 'var(--teal-6)' : 'var(--gray-5)', transition: 'background .2s', display: 'inline-flex', justifyContent: on ? 'flex-end' : 'flex-start' }}>
      <span style={{ width: 20, height: 20, borderRadius: 50, background: '#fff', display: 'block', boxShadow: '0 1px 2px rgba(0,0,0,.2)' }} />
    </button>
  );
}

Object.assign(window, { Dashboard, Projects, Analytics, Team, Settings, Toggle, StatusTag });
