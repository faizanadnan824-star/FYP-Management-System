export default function SupervisorDetail({ supervisor, onBack, onEdit, onDelete }) {
  const initials = supervisor.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <main className="detail-view">
      <button onClick={onBack} className="back-btn">
        <i className="ti ti-arrow-left" /> Back to supervisors
      </button>

      <article className="detail-profile-card">
        {/* Header */}
        <header className="profile-header">
          <figure className="profile-avatar">
            {supervisor.image
              ? <img src={supervisor.image} alt={supervisor.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
              : initials
            }
          </figure>
          <section>
            <h2 className="profile-name">{supervisor.name}</h2>
            <p className="profile-title">{supervisor.designation} · {supervisor.department}</p>
            <span className={`status-pill ${supervisor.status === "Active" ? "pill-active" : "pill-inactive"}`}>
              {supervisor.status}
            </span>
          </section>
        </header>

        {/* Bio */}
        <section className="profile-section">
          <p className="section-heading">About</p>
          <p className="bio-description">{supervisor.bio}</p>
        </section>

        {/* Contact info grid */}
        <section className="info-grid">
          {[
            { icon: "ti-mail", label: "Email", value: supervisor.email },
            { icon: "ti-phone", label: "Phone", value: supervisor.phone },
            { icon: "ti-brain", label: "Specialization", value: supervisor.specialization },
            { icon: "ti-folders", label: "Max Projects", value: supervisor.maxProjects },
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

        {/* Education */}
        <section className="profile-section">
          <p className="section-heading">Education</p>
          {supervisor.education.map((e, i) => (
            <section key={i} className="education-entry">
              <i className="ti ti-school entry-icon" />
              <article>
                <p className="entry-bold">{e.degree}</p>
                <p className="entry-muted">{e.institute} · {e.years}</p>
              </article>
            </section>
          ))}
        </section>

        {/* Roles */}
        <section className="profile-section-last">
          <p className="section-heading">Roles & Responsibilities</p>
          <nav className="roles-container">
            {supervisor.roles.map((r, i) => (
              <span key={i} className="role-chip">{r}</span>
            ))}
          </nav>
        </section>

        {/* Actions */}
        <footer className="action-footer">
          <button onClick={onEdit} className="btn-action-edit">
            <i className="ti ti-edit" /> Edit
          </button>
          <button onClick={onDelete} className="btn-action-remove">
            <i className="ti ti-trash" /> Remove
          </button>
        </footer>
      </article>
    </main>
  );
}