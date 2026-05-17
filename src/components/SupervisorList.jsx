import { useState } from "react";

export default function SupervisorList({ supervisors, onView, onEdit, onDelete, onAdd }) {
  const [search, setSearch] = useState("");
  const filtered = supervisors.filter(sv =>
    sv.name.toLowerCase().includes(search.toLowerCase()) ||
    sv.email.toLowerCase().includes(search.toLowerCase()) ||
    sv.department.toLowerCase().includes(search.toLowerCase())
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

      {filtered.length === 0 ? (
        <section className="empty-state">
          <i className="ti ti-users-off" />
          <p>No supervisors found</p>
        </section>
      ) : (
        <section>
          {filtered.map(sv => (
            <article key={sv.id} className="supervisor-card">
              <figure className="list-avatar">
                {sv.image 
                  ? <img src={sv.image} alt={sv.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" , borderColor: "black"

                  }} />
                  : sv.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
                }
              </figure>
              <section className="card-content">
                <header className="card-header-row">
                  <p className="sv-name">{sv.name}</p>
                  <span className={`status-pill ${sv.status === "Active" ? "pill-active" : "pill-inactive"}`}>
                    {sv.status}
                  </span>
                </header>
                <p className="sv-contact">{sv.email} · {sv.department}</p>
                <p className="sv-details">{sv.specialization} · Max {sv.maxProjects} projects</p>
              </section>
              <nav className="card-actions">
                <button onClick={() => onView(sv)} className="btn-view">
                  <i className="ti ti-eye" /> View
                </button>
                <button onClick={() => onEdit(sv)} className="btn-edit-small">
                  <i className="ti ti-edit" /> Edit
                </button>
                <button onClick={() => onDelete(sv.id)} className="btn-delete-small">
                  <i className="ti ti-trash" />
                </button>
              </nav>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}