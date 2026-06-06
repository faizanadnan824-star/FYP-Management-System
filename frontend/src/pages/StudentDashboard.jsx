import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../task2.css';

/* ── My Proposal Page ── */
function ProposalPage() {
  return (
    <section>
      <h1 className="t2-page-title">My Proposal</h1>
      <p className="t2-page-sub">Submit and manage your FYP proposal</p>

      <div className="t2-empty-box">
        <p style={{ fontSize: '40px', marginBottom: '12px' }}>📄</p>
        <p style={{ fontWeight: '600', marginBottom: '6px', color: '#374151' }}>No Proposal Submitted</p>
        <p style={{ fontSize: '13px' }}>Submit your FYP proposal to get started.</p>
      </div>
    </section>
  );
}

/* ── Progress Page ── */
function ProgressPage() {
  return (
    <section>
      <h1 className="t2-page-title">My Progress</h1>
      <p className="t2-page-sub">Track your weekly progress updates</p>

      <div className="t2-empty-box">
        <p style={{ fontSize: '40px', marginBottom: '12px' }}>📈</p>
        <p style={{ fontWeight: '600', marginBottom: '6px', color: '#374151' }}>No Progress Yet</p>
        <p style={{ fontSize: '13px' }}>Your weekly progress reports will appear here.</p>
      </div>
    </section>
  );
}

/* ── Feedback Page ── */
function FeedbackPage() {
  return (
    <section>
      <h1 className="t2-page-title">Feedback</h1>
      <p className="t2-page-sub">View feedback from your supervisor</p>

      <div className="t2-empty-box">
        <p style={{ fontSize: '40px', marginBottom: '12px' }}>💬</p>
        <p style={{ fontWeight: '600', marginBottom: '6px', color: '#374151' }}>No Feedback Yet</p>
        <p style={{ fontSize: '13px' }}>Supervisor feedback will appear here once given.</p>
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

      {/* Info Cards */}
      <div className="t2-info-grid">
        <article className="t2-info-card">
          <p className="t2-info-lbl">Roll Number</p>
          <p className="t2-info-val">{user?.rollNo || '—'}</p>
        </article>
        <article className="t2-info-card">
          <p className="t2-info-lbl">Department</p>
          <p className="t2-info-val">{user?.department || '—'}</p>
        </article>
        <article className="t2-info-card">
          <p className="t2-info-lbl">Semester</p>
          <p className="t2-info-val">{user?.semester || '—'}</p>
        </article>
        <article className="t2-info-card">
          <p className="t2-info-lbl">Batch Year</p>
          <p className="t2-info-val">{user?.batch || '—'}</p>
        </article>
      </div>

      {/* Status Card */}
      <div className="t2-card">
        <div className="t2-card-header">
          <p className="t2-card-title">Project Status</p>
        </div>
        <div className="t2-empty-box" style={{ border: 'none', padding: '20px' }}>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>No project assigned yet. Submit a proposal to get started.</p>
        </div>
      </div>
    </section>
  );
}

/* ── Main StudentDashboard ── */
export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'proposal',  icon: '📄', label: 'My Proposal' },
    { id: 'progress',  icon: '📈', label: 'Progress' },
    { id: 'feedback',  icon: '💬', label: 'Feedback' },
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
              <span className="t2-role-tag">STUDENT</span>
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
        {activeTab === 'dashboard' && <DashboardPage user={user} />}
        {activeTab === 'proposal'  && <ProposalPage />}
        {activeTab === 'progress'  && <ProgressPage />}
        {activeTab === 'feedback'  && <FeedbackPage />}
      </main>

    </div>
  );
}