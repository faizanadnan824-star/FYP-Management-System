import { useState } from "react";

export default function SupervisorList({ supervisors, onView, onEdit, onDelete, onAdd, loading }) {
  const [search, setSearch] = useState("");

  const filtered = supervisors.filter(sv =>
    sv.name?.toLowerCase().includes(search.toLowerCase()) ||
    sv.email?.toLowerCase().includes(search.toLowerCase()) ||
    sv.department?.toLowerCase().includes(search.toLowerCase()) ||
    sv.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="list-container">
      <header className="list-header">
        <section>
          <h2 className="list-title">Supervisors</h2>
          <p className="list-count">{supervisors.length} registered</p>
        </section>
        <button onClick={onAdd} className="btn-add">
          <i className="ti ti-plus" /> Add Supervisor
        </button>
      </header>

      {/* Search */}
      <section className="search-wrapper">
        <i className="ti ti-search search-icon" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email or department..."
          className="search-input"
        />
      </section>

      {/* Loading */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
          <p>Loading supervisors...</p>
        </div>

      /* Empty */
      ) : filtered.length === 0 ? (
        <section className="empty-state">
          <i className="ti ti-users-off" />
          <p>{search ? 'No supervisors match your search' : 'No supervisors added yet'}</p>
        </section>

      /* Cards */
      ) : (
        <section>
          {filtered.map(sv => {
            const id       = sv._id || sv.id;
            const isActive = sv.isActive || sv.status === 'Active';
            const dept     = sv.department || '—';
            const spec     = sv.specialization || sv.field || '—';
            const maxP     = sv.maxStudents || sv.maxProjects || '—';

            return (
              <article key={id} className="supervisor-card">

                {/* Avatar */}
                <figure className="list-avatar">
                  {sv.image
                    ? <img src={sv.image} alt={sv.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    : sv.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                  }
                </figure>

                {/* Info */}
                <section className="card-content">
                  <header className="card-header-row">
                    <p className="sv-name">{sv.name}</p>
                    <span className={`status-pill ${isActive ? 'pill-active' : 'pill-inactive'}`}>
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </header>
                  <p className="sv-contact">{sv.email} · {dept}</p>
                  <p className="sv-details">{spec} · Max {maxP} projects</p>
                </section>

                {/* Actions */}
                <nav className="card-actions">
                  <button onClick={() => onView(sv)} className="btn-view">
                    <i className="ti ti-eye" /> View
                  </button>
                  <button onClick={() => onEdit(sv)} className="btn-edit-small">
                    <i className="ti ti-edit" /> Edit
                  </button>
                  <button onClick={() => onDelete(id)} className="btn-delete-small">
                    <i className="ti ti-trash" />
                  </button>
                </nav>

              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}