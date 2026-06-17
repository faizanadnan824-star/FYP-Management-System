import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../task2.css';

const BASE = 'http://localhost:5000/api';
const authH = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

/* ══════════════════════════════════════
   DASHBOARD PAGE
══════════════════════════════════════ */
function DashboardPage({ user, projects }) {
  const pending  = projects.filter(p => p.status === 'pending').length;
  const approved = projects.filter(p => p.status === 'approved').length;
  const rejected = projects.filter(p => p.status === 'rejected').length;

  return (
    <section>
      <h1 className="t2-page-title">Dashboard</h1>
      <p className="t2-page-sub">Welcome back, {user?.name}!</p>

      <div className="t2-card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="t2-sb-avatar" style={{ width: '60px', height: '60px', fontSize: '22px', flexShrink: 0 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p style={{ fontWeight: '700', fontSize: '18px', color: '#0f172a', marginBottom: '4px' }}>{user?.name}</p>
            <p style={{ fontSize: '13px', color: '#64748b' }}>{user?.designation || 'Lecturer'}</p>
            <p style={{ fontSize: '13px', color: '#64748b' }}>{user?.email}</p>
            {user?.phone        && <p style={{ fontSize: '13px', color: '#64748b' }}>{user?.phone}</p>}
            {user?.department   && <p style={{ fontSize: '13px', color: '#0f172a', fontWeight: '600', marginTop: '4px' }}>Department: {user?.department}</p>}
            {user?.specialization && <p style={{ fontSize: '13px', color: '#64748b' }}>Specialization: {user?.specialization}</p>}
          </div>
        </div>
      </div>

      <div className="t2-stats-grid">
        <article className="t2-stat-card">
          <div className="t2-stat-ico-box">📋</div>
          <p className="t2-stat-num">{projects.length}</p>
          <p className="t2-stat-lbl">Total Projects</p>
        </article>
        <article className="t2-stat-card">
          <div className="t2-stat-ico-box">⏳</div>
          <p className="t2-stat-num">{pending}</p>
          <p className="t2-stat-lbl">Pending Review</p>
        </article>
        <article className="t2-stat-card">
          <div className="t2-stat-ico-box">✅</div>
          <p className="t2-stat-num">{approved}</p>
          <p className="t2-stat-lbl">Approved</p>
        </article>
        <article className="t2-stat-card">
          <div className="t2-stat-ico-box">❌</div>
          <p className="t2-stat-num">{rejected}</p>
          <p className="t2-stat-lbl">Rejected</p>
        </article>
      </div>

      {projects.length > 0 && (
        <div className="t2-card">
          <p className="t2-card-title" style={{ marginBottom: '16px' }}>Recent Projects</p>
          {projects.slice(0, 4).map(p => (
            <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <p style={{ fontWeight: '600', fontSize: '14px', color: '#0f172a' }}>{p.title}</p>
                <p style={{ fontSize: '12px', color: '#64748b' }}>{p.studentId?.name} · {p.studentId?.rollNo || '—'}</p>
              </div>
              <span className={`t2-badge t2-badge--${p.status}`}>{p.status}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ══════════════════════════════════════
   PROPOSALS PAGE
══════════════════════════════════════ */
function ProposalsPage({ projects, onRefresh, showToast }) {
  const [feedback, setFeedback]   = useState({});
  const [reviewing, setReviewing] = useState({});

  const handleReview = async (projectId, status) => {
    const fb = feedback[projectId] || '';
    if (status === 'rejected' && !fb.trim()) {
      showToast('Please provide feedback when rejecting a proposal', 'error');
      return;
    }
    setReviewing(r => ({ ...r, [projectId]: true }));
    try {
      const res  = await fetch(`${BASE}/projects/${projectId}/review`, {
        method: 'PUT', headers: authH(),
        body: JSON.stringify({ status, feedback: fb }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast(`Project ${status}!`);
      setFeedback(f => ({ ...f, [projectId]: '' }));
      onRefresh();
    } catch (err) { showToast(err.message, 'error'); }
    finally { setReviewing(r => ({ ...r, [projectId]: false })); }
  };

  if (projects.length === 0) return (
    <section>
      <h1 className="t2-page-title">Proposals</h1>
      <p className="t2-page-sub">Review and manage student project proposals</p>
      <div className="t2-empty-box">
        <p style={{ fontSize: '40px', marginBottom: '12px' }}>📄</p>
        <p style={{ fontWeight: '600', color: '#374151', marginBottom: '6px' }}>No Proposals Yet</p>
        <p style={{ fontSize: '13px' }}>When students submit proposals, they will appear here.</p>
      </div>
    </section>
  );

  return (
    <section>
      <h1 className="t2-page-title">Proposals</h1>
      <p className="t2-page-sub">Review and manage student project proposals — {projects.length} total</p>

      {projects.map(p => (
        <div key={p._id} className="t2-card" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <p style={{ fontWeight: '700', fontSize: '18px', color: '#0f172a', marginBottom: '4px' }}>{p.title}</p>
              <p style={{ fontSize: '13px', color: '#64748b' }}>
                👤 {p.studentId?.name}
                {p.studentId?.rollNo ? ` (Roll: ${p.studentId.rollNo})` : ''}
                {p.studentId?.department ? ` · ${p.studentId.department}` : ''}
              </p>
            </div>
            <span className={`t2-badge t2-badge--${p.status}`}>{p.status.toUpperCase()}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '10px' }}>
              <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Domain</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{p.domain}</p>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '10px' }}>
              <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>Technologies</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{p.technologies}</p>
            </div>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
            <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Description</p>
            <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>{p.description}</p>
          </div>

          {p.teamMembers && (
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '10px' }}>👥 Team: {p.teamMembers}</p>
          )}

          {p.feedback && (
            <div style={{ background: '#f0f9ff', borderRadius: '8px', padding: '10px', border: '1px solid #bae6fd', marginBottom: '12px' }}>
              <p style={{ fontSize: '12px', color: '#0369a1', fontWeight: '700', marginBottom: '4px' }}>💬 Your Previous Feedback</p>
              <p style={{ fontSize: '13px', color: '#0369a1' }}>{p.feedback}</p>
            </div>
          )}

          {p.status === 'pending' && (
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', marginTop: '8px' }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '10px' }}>Review this proposal:</p>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <textarea
                  style={{ flex: 1, minWidth: '200px', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical', minHeight: '72px', outline: 'none' }}
                  placeholder="Add feedback or comments (required for rejection)..."
                  value={feedback[p._id] || ''}
                  onChange={e => setFeedback(f => ({ ...f, [p._id]: e.target.value }))}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    className="t2-btn-success"
                    style={{ padding: '10px 20px', fontWeight: '700', fontSize: '14px' }}
                    disabled={reviewing[p._id]}
                    onClick={() => handleReview(p._id, 'approved')}
                  >
                    {reviewing[p._id] ? '...' : '✅ Approve'}
                  </button>
                  <button
                    className="t2-btn-danger"
                    style={{ padding: '10px 20px', fontWeight: '700', fontSize: '14px' }}
                    disabled={reviewing[p._id]}
                    onClick={() => handleReview(p._id, 'rejected')}
                  >
                    {reviewing[p._id] ? '...' : '❌ Reject'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {p.status !== 'pending' && (
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '8px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  className="t2-form-input"
                  style={{ flex: 1, minWidth: '180px' }}
                  placeholder="Update feedback..."
                  value={feedback[p._id] || ''}
                  onChange={e => setFeedback(f => ({ ...f, [p._id]: e.target.value }))}
                />
                {p.status === 'approved' && (
                  <button className="t2-btn-danger" disabled={reviewing[p._id]} onClick={() => handleReview(p._id, 'rejected')}>
                    {reviewing[p._id] ? '...' : '❌ Reject'}
                  </button>
                )}
                {p.status === 'rejected' && (
                  <button className="t2-btn-success" disabled={reviewing[p._id]} onClick={() => handleReview(p._id, 'approved')}>
                    {reviewing[p._id] ? '...' : '✅ Approve'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

/* ══════════════════════════════════════
   PROGRESS PAGE
══════════════════════════════════════ */
function ProgressPage({ projects, onRefresh, showToast }) {
  const [fbInput, setFbInput]   = useState({});
  const [saving, setSaving]     = useState({});

  const approved = projects.filter(p => p.status === 'approved');

  const sendFeedback = async (projectId, progressId, key) => {
    const fb = fbInput[key] || '';
    if (!fb.trim()) { showToast('Please write feedback before sending', 'error'); return; }
    setSaving(s => ({ ...s, [key]: true }));
    try {
      const res  = await fetch(`${BASE}/projects/${projectId}/progress-feedback`, {
        method: 'PUT', headers: authH(),
        body: JSON.stringify({ progressId, feedback: fb }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast('Feedback sent!');
      setFbInput(f => ({ ...f, [key]: '' }));
      onRefresh();
    } catch (err) { showToast(err.message, 'error'); }
    finally { setSaving(s => ({ ...s, [key]: false })); }
  };

  if (approved.length === 0) return (
    <section>
      <h1 className="t2-page-title">Student Progress</h1>
      <p className="t2-page-sub">Monitor and provide feedback on weekly progress</p>
      <div className="t2-empty-box">
        <p style={{ fontSize: '40px', marginBottom: '12px' }}>📈</p>
        <p style={{ fontWeight: '600', color: '#374151', marginBottom: '6px' }}>No Approved Projects Yet</p>
        <p style={{ fontSize: '13px' }}>Approve student proposals first to see their progress here.</p>
      </div>
    </section>
  );

  return (
    <section>
      <h1 className="t2-page-title">Student Progress</h1>
      <p className="t2-page-sub">Monitor weekly progress and provide feedback</p>

      {approved.map(p => (
        <div key={p._id} className="t2-card" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <p style={{ fontWeight: '700', fontSize: '17px', color: '#0f172a' }}>{p.title}</p>
            <span className="t2-badge t2-badge--approved">APPROVED</span>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
            👤 {p.studentId?.name}
            {p.studentId?.rollNo ? ` · Roll: ${p.studentId.rollNo}` : ''}
            {p.studentId?.department ? ` · ${p.studentId.department}` : ''}
          </p>

          {(!p.progress || p.progress.length === 0) && (
            <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
              <p style={{ fontSize: '24px', marginBottom: '8px' }}>📋</p>
              <p style={{ fontSize: '13px' }}>No progress submitted yet by this student.</p>
            </div>
          )}

          {p.progress?.slice().sort((a, b) => a.week - b.week).map(pr => {
            const key = `${p._id}-${pr._id}`;
            return (
              <div key={pr._id} style={{ background: '#f8fafc', borderRadius: '10px', padding: '16px', marginBottom: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <p style={{ fontWeight: '700', color: '#0f172a' }}>📅 Week {pr.week}</p>
                  <p style={{ fontSize: '12px', color: '#94a3b8' }}>{new Date(pr.submittedAt).toLocaleDateString()}</p>
                </div>

                <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6', marginBottom: '12px' }}>{pr.description}</p>

                {pr.feedback ? (
                  <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '10px', border: '1px solid #bbf7d0', marginBottom: '8px' }}>
                    <p style={{ fontSize: '12px', color: '#059669', fontWeight: '700', marginBottom: '4px' }}>✅ Your Feedback</p>
                    <p style={{ fontSize: '13px', color: '#059669' }}>{pr.feedback}</p>
                  </div>
                ) : null}

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                  <input
                    className="t2-form-input"
                    style={{ flex: 1 }}
                    placeholder={pr.feedback ? 'Update feedback...' : 'Write feedback for this week...'}
                    value={fbInput[key] || ''}
                    onChange={e => setFbInput(f => ({ ...f, [key]: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') sendFeedback(p._id, pr._id, key); }}
                  />
                  <button
                    className="t2-btn-primary"
                    style={{ padding: '10px 16px', fontSize: '13px', flexShrink: 0 }}
                    disabled={saving[key]}
                    onClick={() => sendFeedback(p._id, pr._id, key)}
                  >
                    {saving[key] ? '...' : pr.feedback ? '🔄 Update' : '📤 Send'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </section>
  );
}

/* ══════════════════════════════════════
   MAIN SupervisorDashboard
══════════════════════════════════════ */
export default function SupervisorDashboard() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [toast, setToast]         = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/projects/assigned`, { headers: authH() });
      const data = await res.json();
      if (res.ok) setProjects(Array.isArray(data) ? data : []);
    } catch { showToast('Failed to load projects', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadProjects(); }, []);

  const navItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard'  },
    { id: 'proposals', icon: '📄', label: 'Proposals'  },
    { id: 'progress',  icon: '📈', label: 'Progress'   },
  ];

  const pendingCount = projects.filter(p => p.status === 'pending').length;

  return (
    <div className="t2-layout">
      {toast && (
        <div className={`t2-toast t2-toast--${toast.type === 'error' ? 'error' : 'success'}`}>
          {toast.type === 'error' ? '❌' : '✅'} {toast.msg}
        </div>
      )}

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
              className={`t2-nav-btn${activeTab === item.id ? ' t2-nav-btn--active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              style={{ position: 'relative' }}
            >
              <span className="t2-nav-ico">{item.icon}</span>
              {item.label}
              {item.id === 'proposals' && pendingCount > 0 && (
                <span style={{ marginLeft: 'auto', background: '#ef4444', color: 'white', borderRadius: '10px', fontSize: '11px', fontWeight: '700', padding: '2px 7px', minWidth: '20px', textAlign: 'center' }}>
                  {pendingCount}
                </span>
              )}
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
          <button className="t2-btn-logout" onClick={() => { logout(); navigate('/login'); }}>
            Sign Out
          </button>
        </footer>
      </aside>

      <main className="t2-main">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
            <div className="t2-loading-spin" style={{ margin: '0 auto 12px' }} />
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && <DashboardPage user={user} projects={projects} />}
            {activeTab === 'proposals' && <ProposalsPage projects={projects} onRefresh={loadProjects} showToast={showToast} />}
            {activeTab === 'progress'  && <ProgressPage  projects={projects} onRefresh={loadProjects} showToast={showToast} />}
          </>
        )}
      </main>
    </div>
  );
}