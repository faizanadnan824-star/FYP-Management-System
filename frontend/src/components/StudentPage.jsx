import { useState } from 'react';

export default function StudentsPage({ students, supervisors, onAssign, onDelete, loading }) {
  const [search, setSearch] = useState('');

  const filtered = students.filter(st =>
    st.name?.toLowerCase().includes(search.toLowerCase()) ||
    st.email?.toLowerCase().includes(search.toLowerCase()) ||
    st.rollNo?.toLowerCase().includes(search.toLowerCase()) ||
    st.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="list-container">
      <header className="list-header">
        <section>
          <h2 className="list-title">Students</h2>
          <p className="list-count">{students.length} registered</p>
        </section>
      </header>

      {/* Search Bar */}
      <section className="search-wrapper">
        <i className="ti ti-search search-icon" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, roll number or department..."
          className="search-input"
        />
      </section>

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
          <i className="ti ti-loader" style={{ fontSize: '36px', marginBottom: '12px', display: 'block' }} />
          <p>Loading students...</p>
        </div>

      /* Empty State */
      ) : filtered.length === 0 ? (
        <section className="empty-state">
          <i className="ti ti-users-off" />
          <p>{search ? 'No students match your search' : 'No students registered yet'}</p>
        </section>

      /* Student Cards — same style as supervisor cards */
      ) : (
        <section>
          {filtered.map(st => (
            <article key={st._id} className="supervisor-card">

              {/* Avatar */}
              <figure
                className="list-avatar"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
              >
                {st.name?.[0]?.toUpperCase()}
              </figure>

              {/* Info */}
              <section className="card-content">
                <header className="card-header-row">
                  <p className="sv-name">{st.name}</p>
                  <span
                    className="status-pill"
                    style={{
                      background: st.supervisorId
                        ? 'linear-gradient(135deg,#dcfce7,#bbf7d0)'
                        : 'linear-gradient(135deg,#fef9c3,#fde68a)',
                      color: st.supervisorId ? '#15803d' : '#92400e',
                      fontSize: '11px',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontWeight: '600',
                    }}
                  >
                    {st.supervisorId ? 'Assigned' : 'Unassigned'}
                  </span>
                </header>

                <p className="sv-contact">
                  {st.email}
                  {st.rollNo ? ` · Roll: ${st.rollNo}` : ''}
                </p>

                <p className="sv-details">
                  {st.department || 'No department'} 
                  {st.semester ? ` · Semester: ${st.semester}` : ''}
                  {st.batch ? ` · Batch: ${st.batch}` : ''}
                </p>

                <p className="sv-details" style={{
                  marginTop: '4px',
                  fontWeight: '600',
                  color: st.supervisorId ? '#059669' : '#d97706'
                }}>
                  {st.supervisorId
                    ? `👩‍🏫 Supervisor: ${st.supervisorId.name || st.supervisorId}`
                    : '⚠ No Supervisor Assigned'}
                </p>
              </section>

              {/* Actions */}
              <nav className="card-actions" style={{ flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                <select
                  value={st.supervisorId?._id || st.supervisorId || ''}
                  onChange={e => onAssign(st._id, e.target.value)}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '8px',
                    border: '1px solid #dbeafe',
                    fontSize: '13px',
                    color: '#2563eb',
                    background: '#eff6ff',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    minWidth: '160px',
                  }}
                >
                  <option value="">Assign Supervisor</option>
                  {supervisors
                    .filter(sv => sv.isActive || sv.status === 'Active')
                    .map(sv => (
                      <option key={sv._id || sv.id} value={sv._id || sv.id}>
                        {sv.name}
                      </option>
                    ))}
                </select>

                <button
                  onClick={() => { if (window.confirm(`Remove student "${st.name}"?`)) onDelete(st._id); }}
                  className="btn-delete-small"
                  style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <i className="ti ti-trash" /> Remove
                </button>
              </nav>

            </article>
          ))}
        </section>
      )}
    </main>
  );
}