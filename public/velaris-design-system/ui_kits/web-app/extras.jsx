// Velaris Web UI Kit — login, project detail, modals

function Login({ onLogin }) {
  const [pw, setPw] = React.useState('');
  const [show, setShow] = React.useState(false);
  const [email, setEmail] = React.useState('maya@velaris.io');
  return (
    <div className="login">
      <div className="login-form-side">
        <form className="login-form fadeup" onSubmit={e => { e.preventDefault(); onLogin(); }}>
          <Logo size={34} />
          <h1 style={{ fontSize: 26, fontWeight: 600, margin: '30px 0 6px' }}>Sign in to Velaris</h1>
          <p className="muted" style={{ margin: '0 0 26px', fontSize: 14 }}>Welcome back. Deploy with clarity.</p>

          <div className="oauth">
            <Button variant="default" block icon="global">Google</Button>
            <Button variant="default" block icon="link">GitHub</Button>
          </div>
          <div className="divider-text">or continue with email</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Email"><Input icon="mail" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" /></Field>
            <Field label="Password">
              <Input icon="lock" type={show ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••"
                suffix={<span className="input-pw-toggle vicon" onClick={() => setShow(!show)} style={{ width: 16, height: 16 }}><Icon name={show ? 'eye' : 'eye-invisible'} size={16} /></span>} />
            </Field>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0 20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: 'var(--teal-6)', width: 15, height: 15 }} /> Remember me
            </label>
            <a className="v-link" style={{ fontSize: 13 }}>Forgot password?</a>
          </div>
          <Button variant="primary" size="lg" block type="submit" iconRight="arrow-right">Sign in</Button>
          <p className="muted" style={{ textAlign: 'center', fontSize: 13, marginTop: 22 }}>
            New to Velaris? <a className="v-link">Create an account</a>
          </p>
        </form>
      </div>
      <div className="login-brand-side">
        <div className="glow" style={{ width: 320, height: 320, background: 'rgba(120,220,225,.35)', top: -80, right: -60 }} />
        <div className="glow" style={{ width: 260, height: 260, background: 'rgba(26,41,64,.5)', bottom: -40, left: -40 }} />
        <div className="login-quote">Build, ship &amp; <em>scale</em><br />your web presence.</div>
        <div className="login-sub">Velaris is the platform for teams who ship to the web — instant deploys, real-time analytics, and uptime you can trust.</div>
        <div className="login-stats">
          <div><div className="v">99.98%</div><div className="l">Platform uptime</div></div>
          <div><div className="v">42s</div><div className="l">Avg build time</div></div>
          <div><div className="v">12k+</div><div className="l">Teams shipping</div></div>
        </div>
      </div>
    </div>
  );
}

function ProjectDetail({ p, onBack }) {
  const s = STATUS_MAP[p.status];
  const builds = [
    { id: 'a1f3', status: p.status, branch: p.branch, time: p.deploy, dur: '38s', who: 'Maya Okonkwo' },
    { id: 'b8e2', status: 'live', branch: 'main', time: '2h ago', dur: '41s', who: 'Diego Alvarez' },
    { id: 'c4d9', status: 'live', branch: 'main', time: '5h ago', dur: '36s', who: 'CI Pipeline' },
    { id: 'd0a7', status: 'error', branch: 'fix/cache', time: '1d ago', dur: '12s', who: 'Priya Nair' },
  ];
  return (
    <div className="fadeup" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <button className="btn btn-text" style={{ alignSelf: 'flex-start', paddingLeft: 6 }} onClick={onBack}>
        <Icon name="left" size={13} /> Projects
      </button>
      <div className="detail-head">
        <span style={{ width: 52, height: 52, borderRadius: 12, background: 'var(--teal-1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
          <Icon name="global" size={26} style={{ color: 'var(--teal-7)' }} />
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{p.name}</h1>
            <StatusTag status={p.status} />
          </div>
          <a className="url-pill" style={{ marginTop: 8 }}><Icon name="link" size={13} />{p.domain}<Icon name="arrow-right" size={12} /></a>
        </div>
        <Button variant="default" icon="sync">Redeploy</Button>
        <Button variant="primary" icon="rocket">Deploy</Button>
      </div>

      <div className="grid-stats">
        <StatCard icon="user" label="Visitors (30d)" value={p.visitors} delta="6.8%" />
        <StatCard icon="thunderbolt" label="Last build" value={p.deploy === 'now' ? 'building' : '38s'} delta="3%" dir="down" />
        <StatCard icon="line-chart" label="Framework" value={p.framework} delta="" />
        <StatCard icon="safety" label="SSL" value="Active" delta="" />
      </div>

      <div className="card">
        <h3 className="page-section-title" style={{ padding: '16px 20px 0', margin: 0 }}>Deployments</h3>
        <table className="tbl" style={{ marginTop: 10 }}>
          <thead><tr><th>Build</th><th>Status</th><th>Branch</th><th>Duration</th><th>Author</th><th>When</th></tr></thead>
          <tbody>
            {builds.map((b, i) => (
              <tr key={i}>
                <td className="mono row-main">#{b.id}</td>
                <td><StatusTag status={b.status} /></td>
                <td className="mono muted">{b.branch}</td>
                <td className="mono muted">{b.dur}</td>
                <td className="muted">{b.who}</td>
                <td className="row-sub">{b.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Modal({ title, onClose, children, footer }) {
  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head"><h3>{title}</h3><button className="x-btn" onClick={onClose}><Icon name="close" size={16} /></button></div>
        <div className="modal-body">{children}</div>
        <div className="modal-foot">{footer}</div>
      </div>
    </div>
  );
}

function NewProjectModal({ onClose, onCreate }) {
  const [name, setName] = React.useState('');
  const [fw, setFw] = React.useState('Next.js');
  return (
    <Modal title="Create a new project" onClose={onClose}
      footer={<>
        <Button variant="text" onClick={onClose}>Cancel</Button>
        <Button variant="primary" icon="rocket" onClick={() => onCreate(name || 'new-project')}>Create &amp; deploy</Button>
      </>}>
      <Field label="Import from"><div className="oauth"><Button variant="default" block icon="link">GitHub repo</Button><Button variant="default" block icon="upload">Upload</Button></div></Field>
      <Field label="Project name"><Input value={name} onChange={e => setName(e.target.value)} placeholder="my-web-app" icon="appstore" /></Field>
      <Field label="Framework preset">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Next.js', 'Astro', 'SvelteKit', 'Vue', 'Static'].map(f => (
            <button key={f} onClick={() => setFw(f)} className="btn"
              style={{ borderColor: fw === f ? 'var(--teal-6)' : 'var(--border)', background: fw === f ? 'var(--teal-1)' : '#fff', color: fw === f ? 'var(--teal-7)' : 'var(--text-primary)' }}>
              {f}
            </button>
          ))}
        </div>
      </Field>
    </Modal>
  );
}

function InviteModal({ onClose }) {
  return (
    <Modal title="Invite a member" onClose={onClose}
      footer={<><Button variant="text" onClick={onClose}>Cancel</Button><Button variant="primary" icon="mail" onClick={onClose}>Send invite</Button></>}>
      <Field label="Email address"><Input placeholder="teammate@velaris.io" icon="mail" /></Field>
      <Field label="Role">
        <div style={{ display: 'flex', gap: 8 }}>
          {['Admin', 'Developer', 'Viewer'].map((r, i) => (
            <button key={r} className="btn" style={{ flex: 1, borderColor: i === 1 ? 'var(--teal-6)' : 'var(--border)', background: i === 1 ? 'var(--teal-1)' : '#fff', color: i === 1 ? 'var(--teal-7)' : 'var(--text-primary)' }}>{r}</button>
          ))}
        </div>
      </Field>
    </Modal>
  );
}

Object.assign(window, { Login, ProjectDetail, Modal, NewProjectModal, InviteModal });
