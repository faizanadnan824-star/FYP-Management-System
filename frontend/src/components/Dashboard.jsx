export default function Dashboard({ supervisors, students, setActiveTab }) {
  const activeSupervisors = supervisors.filter(s => s.isActive || s.status === 'Active').length;
  const totalCapacity     = supervisors.reduce((a, s) => a + (+(s.maxStudents || s.maxProjects) || 0), 0);
  // Fix: department comes from DB as 'department' field, old data had it in specialization
  const departments = [
    ...new Set(
      supervisors
        .map(s => s.department || s.specialization || null)
        .filter(Boolean)
    )
  ].length;
  const assignedStudents = students.filter(s => s.supervisorId).length;

  const stats = [
    { label: 'Total Supervisors', value: supervisors.length, icon: 'ti-users',       bg: '#EFF6FF', color: '#1d4ed8' },
    { label: 'Active',            value: activeSupervisors,  icon: 'ti-user-check',  bg: '#ECFDF5', color: '#059669' },
    { label: 'Total Capacity',    value: totalCapacity,      icon: 'ti-folders',     bg: '#F5F3FF', color: '#7c3aed' },
    { label: 'Departments',       value: departments,        icon: 'ti-building',    bg: '#FFFBEB', color: '#d97706' },
    { label: 'Total Students',    value: students.length,    icon: 'ti-school',      bg: '#FDF4FF', color: '#9333ea' },
    { label: 'Assigned Students', value: assignedStudents,   icon: 'ti-user-check',  bg: '#F0FDF4', color: '#16a34a' },
  ];

  return (
    <main className="dashboard-main">
      <header>
        <h2 className="welcome-title">Welcome, Admin</h2>
        <p className="welcome-subtitle">FYP Management System overview</p>
      </header>

      {/* Stats Grid */}
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

      {/* Two-column recent lists */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Recent Supervisors */}
        <section className="recent-supervisors-card">
          <header className="card-header">
            <h3 className="card-title">Supervisors</h3>
            <button onClick={() => setActiveTab('supervisors')} className="view-all-btn">View all →</button>
          </header>

          {supervisors.slice(0, 5).map(sv => {
            const isActive = sv.isActive || sv.status === 'Active';
            const dept     = sv.department || sv.specialization || 'N/A';
            return (
              <article key={sv._id || sv.id} className="supervisor-row">
                <article className="supervisor-info">
                  <figure className="supervisor-avatar">
                    {sv.image
                      ? <img src={sv.image} alt={sv.name}
                          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      : sv.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                    }
                  </figure>
                  <section>
                    <p className="supervisor-name">{sv.name}</p>
                    <p className="supervisor-dept">{dept}</p>
                  </section>
                </article>
                <span className={`status-badge ${isActive ? 'status-active' : 'status-inactive'}`}>
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </article>
            );
          })}

          {supervisors.length === 0 && (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>No supervisors yet</p>
          )}
        </section>

        {/* Recent Students */}
        <section className="recent-supervisors-card">
          <header className="card-header">
            <h3 className="card-title">Students</h3>
            <button onClick={() => setActiveTab('students')} className="view-all-btn">View all →</button>
          </header>

          {students.slice(0, 5).map(st => (
            <article key={st._id} className="supervisor-row">
              <article className="supervisor-info">
                <figure className="supervisor-avatar"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
                  {st.name?.[0]?.toUpperCase()}
                </figure>
                <section>
                  <p className="supervisor-name">{st.name}</p>
                  <p className="supervisor-dept">
                    {st.department || 'N/A'}{st.rollNo ? ` · ${st.rollNo}` : ''}
                  </p>
                </section>
              </article>
              <span className="status-badge" style={{
                background: st.supervisorId
                  ? 'linear-gradient(135deg,#dcfce7,#bbf7d0)'
                  : 'linear-gradient(135deg,#fef9c3,#fde68a)',
                color:      st.supervisorId ? '#15803d' : '#92400e',
                fontSize: '11px', padding: '4px 10px',
                borderRadius: '20px', fontWeight: '600',
              }}>
                {st.supervisorId ? 'Assigned' : 'Unassigned'}
              </span>
            </article>
          ))}

          {students.length === 0 && (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>No students yet</p>
          )}
        </section>

      </section>
    </main>
  );
}