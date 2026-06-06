import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../task2.css';

/* ── Proposals Page ── */
function ProposalsPage() {
  return (
    <section>
      <h1 className="t2-page-title">Proposals</h1>
      <p className="t2-page-sub">Review and manage student project proposals</p>

      <div className="t2-empty-box">
        <p style={{ fontSize: '40px', marginBottom: '12px' }}>📄</p>
        <p style={{ fontWeight: '600', marginBottom: '6px', color: '#374151' }}>No Proposals Yet</p>
        <p style={{ fontSize: '13px' }}>When students submit proposals, they will appear here for review.</p>
      </div>
    </section>
  );
}

/* ── Progress Page ── */
function ProgressPage() {
  return (
    <section>
      <h1 className="t2-page-title">Student Progress</h1>
      <p className="t2-page-sub">Monitor weekly progress of your assigned students</p>

      <div className="t2-empty-box">
        <p style={{ fontSize: '40px', marginBottom: '12px' }}>📈</p>
        <p style={{ fontWeight: '600', marginBottom: '6px', color: '#374151' }}>No Progress Reports</p>
        <p style={{ fontSize: '13px' }}>Student progress updates will appear here once submitted.</p>
      </div>
    </section>
  );
}

/* ── Dashboard Page ── */
function DashboardPage({ user }) {
  return (
    <section>
      <h1 className="t2-page-title">Dashboard</h1>
      <p className="t2-page-sub">Welcome back, {user?.name}!</p>

      {/* Supervisor Profile Card */}
      <article className="t2-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="t2-sb-avatar" style={{ width: '56px', height: '56px', fontSize: '20px', flexShrink: 0 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p style={{ fontWeight: '700', fontSize: '18px', color: '#0f172a', marginBottom: '4px' }}>{user?.name}</p>
            <p style={{ fontSize: '13px', color: '#64748b' }}>{user?.designation || 'Lecturer'}</p>
            <p style={{ fontSize: '13px', color: '#64748b' }}>{user?.email}</p>
            {user?.phone && <p style={{ fontSize: '13px', color: '#64748b' }}>{user?.phone}</p>}
            {user?.field && <p style={{ fontSize: '13px', color: '#0f172a', fontWeight: '600', marginTop: '4px' }}>Field: {user?.field}</p>}
          </div>
        </div>
      </article>

      {/* Stats */}
      <div className="t2-stats-grid">
        <article className="t2-stat-card" style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', color: 'white' }}>
          <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '4px' }}>0</div>
          <div style={{ fontSize: '13px', opacity: 0.9 }}>Assigned Students</div>
        </article>
        <article className="t2-stat-card" style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', color: 'white' }}>
          <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '4px' }}>0</div>
          <div style={{ fontSize: '13px', opacity: 0.9 }}>Pending Proposals</div>
        </article>
      </div>
    </section>
  );
}

/* ── Main SupervisorDashboard ── */
export default function SupervisorDashboard() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'proposals', icon: '📄', label: 'Proposals' },
    { id: 'progress',  icon: '📈', label: 'Progress' },
  ];

  return (
    <div className="t2-layout">

      {/* ── Sidebar ── */}
      <aside className="t2-sidebar">
        <header className="t2-sb-header">
          <div className="t2-sb-logo-row">
            <div className="t2-sb-icon-box">
              <i className="ti ti-school" style={{ fontSize: '18px', color: 'white' }} />
            </div>
            <div>
              <p className="t2-sb-brand">FYP System</p>
              <span className="t2-role-tag">SUPERVISOR</span>
            </div>
          </div>
        </header>

        <nav className="t2-sb-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`t2-nav-btn ${activeTab === item.id ? 't2-nav-btn--active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="t2-nav-ico">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <footer className="t2-sb-footer">
          <div className="t2-sb-user-row">
            <div className="t2-sb-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <div>
              <span className="t2-sb-uname">{user?.name}</span>
              <span className="t2-sb-uemail">{user?.email}</span>
            </div>
          </div>
          <button className="t2-btn-logout" onClick={handleLogout}>Sign Out</button>
        </footer>
      </aside>

      {/* ── Main Content ── */}
      <main className="t2-main">
        {activeTab === 'dashboard'  && <DashboardPage user={user} />}
        {activeTab === 'proposals'  && <ProposalsPage />}
        {activeTab === 'progress'   && <ProgressPage />}
      </main>

    </div>
  );
}