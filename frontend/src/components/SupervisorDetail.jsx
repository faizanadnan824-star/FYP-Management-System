export default function SupervisorDetail({ supervisor, onBack, onEdit, onDelete }) {
  // Safe initials — works for both old local data and new DB data
  const initials = supervisor.name
    ?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';

  // Handle both old field names and new DB field names
  const isActive    = supervisor.isActive || supervisor.status === 'Active';
  const dept        = supervisor.department || '—';
  const spec        = supervisor.specialization || supervisor.field || '—';
  const maxP        = supervisor.maxStudents || supervisor.maxProjects || '—';
  const phone       = supervisor.phone || '—';
  const designation = supervisor.designation || '—';
  const bio         = supervisor.bio || supervisor.field || 'No description provided.';

  // Education & roles — only shown if they exist (old local data had them)
  const education = Array.isArray(supervisor.education) ? supervisor.education : [];
  const roles     = Array.isArray(supervisor.roles)     ? supervisor.roles     : [];

  return (
    <main className="detail-view">
      <button onClick={onBack} className="back-btn">
        <i className="ti ti-arrow-left" /> Back to supervisors
      </button>

      <article className="detail-profile-card">

        {/* ── Header ── */}
        <header className="profile-header">
          <figure className="profile-avatar">
            {supervisor.image
              ? <img src={supervisor.image} alt={supervisor.name}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              : initials
            }
          </figure>
          <section>
            <h2 className="profile-name">{supervisor.name}</h2>
            <p className="profile-title">{designation} · {dept}</p>
            <span className={`status-pill ${isActive ? 'pill-active' : 'pill-inactive'}`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </section>
        </header>

        {/* ── About / Bio ── */}
        <section className="profile-section">
          <p className="section-heading">About</p>
          <p className="bio-description">{bio}</p>
        </section>

        {/* ── Contact Info Grid ── */}
        <section className="info-grid">
          {[
            { icon: 'ti-mail',    label: 'Email',          value: supervisor.email },
            { icon: 'ti-phone',   label: 'Phone',          value: phone            },
            { icon: 'ti-brain',   label: 'Specialization', value: spec             },
            { icon: 'ti-folders', label: 'Max Projects',   value: maxP             },
          ].map(row => (
            <article key={row.label} className="grid-item">
              <header className="grid-item-header">
                <i className={`ti ${row.icon}`} />
                <p className="grid-label">{row.label}</p>
              </header>
              <p className="grid-value">{row.value}</p>
            </article>
          ))}
        </section>

        {/* ── Education — only shown if exists ── */}
        {education.length > 0 && (
          <section className="profile-section">
            <p className="section-heading">Education</p>
            {education.map((e, i) => (
              <section key={i} className="education-entry">
                <i className="ti ti-school entry-icon" />
                <article>
                  <p className="entry-bold">{e.degree}</p>
                  <p className="entry-muted">{e.institute} · {e.years}</p>
                </article>
              </section>
            ))}
          </section>
        )}

        {/* ── Roles — only shown if exists ── */}
        {roles.length > 0 && (
          <section className="profile-section-last">
            <p className="section-heading">Roles & Responsibilities</p>
            <nav className="roles-container">
              {roles.map((r, i) => (
                <span key={i} className="role-chip">{r}</span>
              ))}
            </nav>
          </section>
        )}

        {/* ── Actions ── */}
        <footer className="action-footer">
          <button onClick={() => onEdit(supervisor)} className="btn-action-edit">
            <i className="ti ti-edit" /> Edit
          </button>
          <button onClick={() => onDelete(supervisor._id || supervisor.id)} className="btn-action-remove">
            <i className="ti ti-trash" /> Remove
          </button>
        </footer>

      </article>
    </main>
  );
}