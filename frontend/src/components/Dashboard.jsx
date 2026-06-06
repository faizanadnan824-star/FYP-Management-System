export default function Dashboard({ supervisors, setActiveTab }) {
  const stats = [
    { label: "Total Supervisors", value: supervisors.length, icon: "ti-users", bg: "#EFF6FF", color: "#1d4ed8" },
    { label: "Active", value: supervisors.filter(s => s.status === "Active").length, icon: "ti-user-check", bg: "#ECFDF5", color: "#059669" },
    { label: "Total Capacity", value: supervisors.reduce((a, s) => a + s.maxProjects, 0), icon: "ti-folders", bg: "#F5F3FF", color: "#7c3aed" },
    { label: "Departments", value: [...new Set(supervisors.map(s => s.department))].length, icon: "ti-building", bg: "#FFFBEB", color: "#d97706" },
  ];

  return (
    <main className="dashboard-main">
      <header>
        <h2 className="welcome-title">Welcome, Admin</h2>
        <p className="welcome-subtitle">FYP Management System overview</p>
      </header>

      {/* Stat cards */}
      <section className="stats-grid">
        {stats.map(c => (
          <article key={c.label} className="stat-card">
            <figure className="stat-icon-wrapper" style={{ background: c.bg }}>
              <i className={`ti ${c.icon}`} style={{ fontSize: 20, color: c.color }} />
            </figure>
            <p className="stat-value">{c.value}</p>
            <p className="stat-label">{c.label}</p>
          </article>
        ))}
      </section>

      {/* Recent supervisors */}
      <section className="recent-supervisors-card">
        <header className="card-header">
          <h3 className="card-title">Supervisors</h3>
          <button onClick={() => setActiveTab("supervisors")} className="view-all-btn">
            View all →
          </button>
        </header>
        {supervisors.map(sv => (
          <article key={sv.id} className="supervisor-row">
            <article className="supervisor-info">
              <figure className="supervisor-avatar">
                {sv.image
                  ? <img src={sv.image} alt={sv.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                  : sv.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
                }
              </figure>
              <section>
                <p className="supervisor-name">{sv.name}</p>
                <p className="supervisor-dept">{sv.department}</p>
              </section>
            </article>
            <span className={`status-badge ${sv.status === "Active" ? "status-active" : "status-inactive"}`}>
              {sv.status}
            </span>
          </article>
        ))}
      </section>
    </main>
  );
}