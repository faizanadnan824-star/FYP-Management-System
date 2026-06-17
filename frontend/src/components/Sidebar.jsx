const navItems = [
  { id: "dashboard",     icon: "ti-layout-dashboard", label: "Dashboard"      },
  { id: "supervisors",   icon: "ti-users",             label: "Supervisors"    },
  { id: "addSupervisor", icon: "ti-user-plus",         label: "Add Supervisor" },
  { id: "students",      icon: "ti-school",            label: "Students"       },
];

export default function Sidebar({ activeTab, setActiveTab, user, onLogout }) {
  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <section className="logo-container">
          <figure className="logo-icon-wrapper">
            <i className="ti ti-school logo-icon" />
          </figure>
          <section>
            <p className="admin-panel-text">Admin Panel</p>
            <p className="department-text">FUI IET Department</p>
          </section>
        </section>
      </header>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-button ${activeTab === item.id ? "active" : ""}`}
          >
            <i className={`ti ${item.icon} nav-icon`} />
            {item.label}
          </button>
        ))}
      </nav>

      <footer className="sidebar-footer">
        <section className="admin-info-container">
          <figure className="admin-avatar">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </figure>
          <section>
            <p className="admin-name">{user?.name || 'Admin'}</p>
            <p className="admin-email">{user?.email || 'admin@fui.edu.pk'}</p>
          </section>
        </section>
        {onLogout && (
          <button
            onClick={onLogout}
            style={{ width:'100%', marginTop:'10px', padding:'9px', background:'rgba(255,255,255,0.1)', color:'white', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'8px', cursor:'pointer', fontSize:'13px', fontWeight:'600', fontFamily:'inherit', transition:'0.2s ease' }}
            onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'}
            onMouseOut={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
          >
            Sign Out
          </button>
        )}
      </footer>
    </aside>
  );
}