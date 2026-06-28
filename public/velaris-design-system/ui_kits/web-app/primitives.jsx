// Velaris Web UI Kit — shared primitives. Exposes components on window.
const ICON_BASE = '../../assets/icons';
const _iconCache = {};

function Icon({ name, size = 16, color, style, className }) {
  const [svg, setSvg] = React.useState(_iconCache[name] || null);
  React.useEffect(() => {
    let on = true;
    if (_iconCache[name]) { setSvg(_iconCache[name]); return; }
    fetch(ICON_BASE + '/' + name + '.svg')
      .then(r => r.text())
      .then(t => {
        t = t.replace('<svg', '<svg fill="currentColor"')
             .replace(/\swidth="[^"]*"/, '').replace(/\sheight="[^"]*"/, '');
        _iconCache[name] = t;
        if (on) setSvg(t);
      }).catch(() => {});
    return () => { on = false; };
  }, [name]);
  return (
    <span
      className={'vicon' + (className ? ' ' + className : '')}
      style={{ width: size, height: size, color, ...style }}
      dangerouslySetInnerHTML={{ __html: svg || '' }}
    />
  );
}

function Button({ variant = 'default', size, block, icon, iconRight, children, className = '', ...rest }) {
  const cls = ['btn', 'btn-' + variant,
    size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '',
    block ? 'btn-block' : '', !children ? 'btn-icon' : '', className]
    .filter(Boolean).join(' ');
  return (
    <button className={cls} {...rest}>
      {icon && <Icon name={icon} size={size === 'lg' ? 16 : 14} />}
      {children}
      {iconRight && <Icon name={iconRight} size={14} />}
    </button>
  );
}

function Tag({ tone = 'neutral', pill, dot, children }) {
  return (
    <span className={'tag tag-' + tone + (pill ? ' tag-pill' : '')}>
      {dot && <span className="dot" style={{ background: 'currentColor' }} />}
      {children}
    </span>
  );
}

function Avatar({ name = '', src, size = 32, color }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.4, background: color }}>
      {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
    </span>
  );
}

function Field({ label, children }) {
  return (
    <label className="field">
      {label && <span className="field-label">{label}</span>}
      {children}
    </label>
  );
}

function Input({ icon, suffix, ...rest }) {
  return (
    <div className="input">
      {icon && <Icon name={icon} size={15} />}
      <input {...rest} />
      {suffix}
    </div>
  );
}

// Velaris logo mark — the real app-icon tile (teal/navy gradient, V + star).
function VelarisMark({ size = 32, radius }) {
  const r = radius != null ? radius : Math.round(size * 0.26);
  return (
    <img src="../../assets/velaris-app-icon.jpg" alt="Velaris"
      width={size} height={size}
      style={{ display: 'block', borderRadius: r, flex: 'none' }} />
  );
}

function Logo({ size = 30, color = 'var(--text-primary)', word = 'Velaris' }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
      <VelarisMark size={size} />
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: size * 0.6,
        letterSpacing: '0.01em', color, lineHeight: 1, whiteSpace: 'nowrap'
      }}>{word}</span>
    </span>
  );
}

Object.assign(window, { Icon, Button, Tag, Avatar, Field, Input, VelarisMark, Logo });
