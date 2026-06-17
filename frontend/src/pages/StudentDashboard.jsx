import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../task2.css';

const BASE = 'http://localhost:5000/api';
const authH = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` });

/* ══════════════════════════════════════
   MY PROPOSAL PAGE
══════════════════════════════════════ */
function ProposalPage({ project, onRefresh, showToast }) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title:'', domain:'', description:'', technologies:'', teamMembers:'' });
  const [errs, setErrs] = useState({});

  const domains = ['Web Development','Mobile Application','Artificial Intelligence','Machine Learning','Cybersecurity','Database Systems','Cloud Computing','IoT','Blockchain','Other'];

  useEffect(() => {
    if (project) setForm({ title: project.title||'', domain: project.domain||'', description: project.description||'', technologies: project.technologies||'', teamMembers: project.teamMembers||'' });
  }, [project]);

  const validate = () => {
    const e = {};
    if (!form.title.trim())        e.title = 'Project title required';
    if (!form.domain)              e.domain = 'Please select a domain';
    if (!form.description.trim())  e.description = 'Description required';
    if (!form.technologies.trim()) e.technologies = 'Technologies required';
    setErrs(e); return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const url    = project ? `${BASE}/projects/my` : `${BASE}/projects/submit`;
      const method = project ? 'PUT' : 'POST';
      const res    = await fetch(url, { method, headers: authH(), body: JSON.stringify(form) });
      const data   = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast(project ? 'Proposal updated!' : 'Proposal submitted!');
      setEditing(false);
      onRefresh();
    } catch (err) { showToast(err.message, 'error'); }
    finally { setLoading(false); }
  };

  const set = (k, v) => { setForm(f => ({...f, [k]: v})); setErrs(r => ({...r, [k]: ''})); };

  const ProposalForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="t2-form-row">
        <div className="t2-form-field">
          <label className="t2-form-label">Project Title <span style={{color:'#dc2626'}}>*</span></label>
          <input className={`t2-form-input${errs.title?' err':''}`} placeholder="e.g. Smart Queue Management System" value={form.title} onChange={e=>set('title',e.target.value)}/>
          {errs.title && <p className="t2-form-err">{errs.title}</p>}
        </div>
        <div className="t2-form-field">
          <label className="t2-form-label">Project Domain <span style={{color:'#dc2626'}}>*</span></label>
          <select className={`t2-form-select${errs.domain?' err':''}`} value={form.domain} onChange={e=>set('domain',e.target.value)}>
            <option value="">Select Domain</option>
            {domains.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          {errs.domain && <p className="t2-form-err">{errs.domain}</p>}
        </div>
      </div>
      <div className="t2-form-field">
        <label className="t2-form-label">Project Description <span style={{color:'#dc2626'}}>*</span></label>
        <textarea className={`t2-form-textarea${errs.description?' err':''}`} rows={4} placeholder="Describe your project in detail — what problem it solves, how it works..." value={form.description} onChange={e=>set('description',e.target.value)}/>
        {errs.description && <p className="t2-form-err">{errs.description}</p>}
      </div>
      <div className="t2-form-row">
        <div className="t2-form-field">
          <label className="t2-form-label">Technologies Used <span style={{color:'#dc2626'}}>*</span></label>
          <input className={`t2-form-input${errs.technologies?' err':''}`} placeholder="e.g. React.js, Node.js, MongoDB, Express" value={form.technologies} onChange={e=>set('technologies',e.target.value)}/>
          {errs.technologies && <p className="t2-form-err">{errs.technologies}</p>}
        </div>
        <div className="t2-form-field">
          <label className="t2-form-label">Team Members</label>
          <input className="t2-form-input" placeholder="e.g. Faisal Iqbal, Mahnoor Shah" value={form.teamMembers} onChange={e=>set('teamMembers',e.target.value)}/>
        </div>
      </div>
      <div style={{display:'flex', gap:'12px', marginTop:'8px'}}>
        <button type="submit" className="t2-btn-primary" disabled={loading}>
          {loading ? 'Saving...' : project ? '💾 Save Changes' : '📤 Submit Proposal'}
        </button>
        {project && <button type="button" className="t2-btn-secondary" onClick={()=>setEditing(false)}>Cancel</button>}
      </div>
    </form>
  );

  if (!project) return (
    <section>
      <h1 className="t2-page-title">My Proposal</h1>
      <p className="t2-page-sub">Submit your FYP project proposal</p>
      <div className="t2-card">
        <p className="t2-card-title" style={{marginBottom:'20px'}}>📤 Submit New Proposal</p>
        <ProposalForm />
      </div>
    </section>
  );

  return (
    <section>
      <h1 className="t2-page-title">My Proposal</h1>
      <p className="t2-page-sub">View and manage your FYP proposal</p>

      <div className="t2-card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px', flexWrap:'wrap', gap:'10px'}}>
          <h2 style={{fontWeight:'700', fontSize:'20px', color:'#0f172a'}}>{project.title}</h2>
          <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
            <span className={`t2-badge t2-badge--${project.status}`}>{project.status.toUpperCase()}</span>
            {project.status !== 'approved' && (
              <button className="t2-btn-secondary" onClick={()=>setEditing(!editing)}>
                {editing ? 'Cancel' : '✏️ Edit'}
              </button>
            )}
          </div>
        </div>

        {editing ? <ProposalForm /> : (
          <>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'16px'}}>
              <div className="t2-info-card">
                <p className="t2-info-lbl">Domain</p>
                <p style={{fontSize:'15px', fontWeight:'600', color:'#0f172a'}}>{project.domain}</p>
              </div>
              <div className="t2-info-card">
                <p className="t2-info-lbl">Technologies</p>
                <p style={{fontSize:'15px', fontWeight:'600', color:'#0f172a'}}>{project.technologies}</p>
              </div>
              {project.teamMembers && (
                <div className="t2-info-card">
                  <p className="t2-info-lbl">Team Members</p>
                  <p style={{fontSize:'15px', fontWeight:'600', color:'#0f172a'}}>{project.teamMembers}</p>
                </div>
              )}
              {project.supervisorId && (
                <div className="t2-info-card">
                  <p className="t2-info-lbl">Supervisor</p>
                  <p style={{fontSize:'15px', fontWeight:'600', color:'#0f172a'}}>{project.supervisorId.name}</p>
                  <p style={{fontSize:'12px', color:'#64748b'}}>{project.supervisorId.email}</p>
                </div>
              )}
            </div>

            <div style={{background:'#f8fafc', borderRadius:'10px', padding:'16px', marginBottom:'12px'}}>
              <p style={{fontSize:'12px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'.06em', color:'#94a3b8', marginBottom:'8px'}}>Description</p>
              <p style={{fontSize:'14px', color:'#374151', lineHeight:'1.7'}}>{project.description}</p>
            </div>

            {project.feedback && (
              <div style={{background:'#f0f9ff', borderRadius:'10px', padding:'14px', border:'1px solid #bae6fd'}}>
                <p style={{fontSize:'12px', fontWeight:'700', color:'#0369a1', marginBottom:'6px'}}>💬 Supervisor Feedback</p>
                <p style={{fontSize:'14px', color:'#0369a1'}}>{project.feedback}</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   PROGRESS PAGE
══════════════════════════════════════ */
function ProgressPage({ project, onRefresh, showToast }) {
  const [form, setForm] = useState({ week:'', description:'' });
  const [errs, setErrs] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const er = {};
    if (!form.week) er.week = 'Week number required';
    if (!form.description.trim()) er.description = 'Description required';
    if (Object.keys(er).length) { setErrs(er); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${BASE}/projects/progress`, { method:'POST', headers: authH(), body: JSON.stringify({ week: +form.week, description: form.description }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast('Progress submitted!');
      setForm({ week:'', description:'' });
      setErrs({});
      onRefresh();
    } catch (err) { showToast(err.message, 'error'); }
    finally { setLoading(false); }
  };

  if (!project) return (
    <section>
      <h1 className="t2-page-title">Weekly Progress</h1>
      <div className="t2-empty-box"><p style={{fontSize:'36px',marginBottom:'12px'}}>📋</p><p style={{fontWeight:'600',color:'#374151',marginBottom:'6px'}}>No Project Yet</p><p style={{fontSize:'13px'}}>Submit a proposal first.</p></div>
    </section>
  );

  if (project.status !== 'approved') return (
    <section>
      <h1 className="t2-page-title">Weekly Progress</h1>
      <div className="t2-empty-box">
        <p style={{fontSize:'36px',marginBottom:'12px'}}>⏳</p>
        <p style={{fontWeight:'600',color:'#374151',marginBottom:'6px'}}>Waiting for Approval</p>
        <p style={{fontSize:'13px'}}>Your proposal is <strong style={{color: project.status==='rejected'?'#dc2626':'#d97706'}}>{project.status}</strong>. Progress can be submitted after approval.</p>
      </div>
    </section>
  );

  return (
    <section>
      <h1 className="t2-page-title">Weekly Progress</h1>
      <p className="t2-page-sub">Submit and track your weekly progress reports</p>

      <div className="t2-card" style={{marginBottom:'20px'}}>
        <p className="t2-card-title" style={{marginBottom:'16px'}}>📤 Submit Weekly Update</p>
        <form onSubmit={handleSubmit}>
          <div className="t2-form-row">
            <div className="t2-form-field" style={{maxWidth:'180px'}}>
              <label className="t2-form-label">Week Number <span style={{color:'#dc2626'}}>*</span></label>
              <input type="number" min="1" max="20" className={`t2-form-input${errs.week?' err':''}`} placeholder="e.g. 1" value={form.week} onChange={e=>{setForm(f=>({...f,week:e.target.value}));setErrs(r=>({...r,week:''}));}}/>
              {errs.week && <p className="t2-form-err">{errs.week}</p>}
            </div>
          </div>
          <div className="t2-form-field">
            <label className="t2-form-label">Progress Description <span style={{color:'#dc2626'}}>*</span></label>
            <textarea className={`t2-form-textarea${errs.description?' err':''}`} rows={4} placeholder="What did you accomplish this week? Any challenges faced? Next week's plan?" value={form.description} onChange={e=>{setForm(f=>({...f,description:e.target.value}));setErrs(r=>({...r,description:''}));}}/>
            {errs.description && <p className="t2-form-err">{errs.description}</p>}
          </div>
          <button type="submit" className="t2-btn-primary" disabled={loading}>{loading?'Submitting...':'📤 Submit Progress'}</button>
        </form>
      </div>

      <div className="t2-card">
        <p className="t2-card-title" style={{marginBottom:'16px'}}>📊 Progress History</p>
        {(!project.progress || project.progress.length === 0) && <p style={{color:'#94a3b8',textAlign:'center',padding:'20px'}}>No progress submitted yet.</p>}
        {project.progress?.slice().sort((a,b)=>a.week-b.week).map((pr,i) => (
          <div key={pr._id||i} style={{background:'#f8fafc',borderRadius:'10px',padding:'16px',marginBottom:'12px',border:'1px solid #e2e8f0'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
              <p style={{fontWeight:'700',color:'#0f172a',fontSize:'15px'}}>📅 Week {pr.week}</p>
              <p style={{fontSize:'12px',color:'#94a3b8'}}>{new Date(pr.submittedAt).toLocaleDateString()}</p>
            </div>
            <p style={{fontSize:'14px',color:'#374151',lineHeight:'1.6',marginBottom:'10px'}}>{pr.description}</p>
            {pr.feedback
              ? <div style={{background:'#f0fdf4',padding:'10px 14px',borderRadius:'8px',border:'1px solid #bbf7d0'}}><p style={{fontSize:'13px',color:'#059669',fontWeight:'500'}}>💬 Supervisor: {pr.feedback}</p></div>
              : <p style={{fontSize:'12px',color:'#94a3b8',fontStyle:'italic'}}>⏳ Awaiting supervisor feedback...</p>
            }
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   FEEDBACK PAGE
══════════════════════════════════════ */
function FeedbackPage({ project }) {
  if (!project) return (
    <section>
      <h1 className="t2-page-title">Feedback</h1>
      <div className="t2-empty-box"><p style={{fontSize:'36px',marginBottom:'12px'}}>💬</p><p style={{fontWeight:'600',color:'#374151'}}>No Feedback Yet</p><p style={{fontSize:'13px',marginTop:'6px'}}>Submit a proposal first to receive feedback.</p></div>
    </section>
  );

  const progressFeedbacks = project.progress?.filter(p => p.feedback) || [];

  return (
    <section>
      <h1 className="t2-page-title">Feedback</h1>
      <p className="t2-page-sub">View all feedback from your supervisor</p>

      {project.feedback && (
        <div className="t2-card" style={{marginBottom:'16px', background:'linear-gradient(135deg,#f0f9ff,#e0f2fe)', border:'1px solid #bae6fd'}}>
          <p style={{fontWeight:'700',fontSize:'15px',color:'#0369a1',marginBottom:'8px'}}>📋 Proposal Review Feedback</p>
          <p style={{fontSize:'14px',color:'#0369a1',lineHeight:'1.6'}}>{project.feedback}</p>
          <span className={`t2-badge t2-badge--${project.status}`} style={{marginTop:'10px',display:'inline-block'}}>{project.status.toUpperCase()}</span>
        </div>
      )}

      {progressFeedbacks.length === 0 && !project.feedback && (
        <div className="t2-empty-box"><p style={{fontSize:'36px',marginBottom:'12px'}}>💬</p><p style={{fontWeight:'600',color:'#374151'}}>No Feedback Yet</p><p style={{fontSize:'13px',marginTop:'6px'}}>Your supervisor hasn't provided feedback yet.</p></div>
      )}

      {progressFeedbacks.map((pr, i) => (
        <div key={pr._id||i} className="t2-card" style={{marginBottom:'12px'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
            <p style={{fontWeight:'700',color:'#0f172a'}}>Week {pr.week} Feedback</p>
            <p style={{fontSize:'12px',color:'#94a3b8'}}>{new Date(pr.submittedAt).toLocaleDateString()}</p>
          </div>
          <div style={{background:'#f8fafc',borderRadius:'8px',padding:'12px',marginBottom:'10px'}}>
            <p style={{fontSize:'12px',color:'#94a3b8',marginBottom:'4px'}}>Your Progress:</p>
            <p style={{fontSize:'14px',color:'#374151'}}>{pr.description}</p>
          </div>
          <div style={{background:'#f0fdf4',borderRadius:'8px',padding:'12px',border:'1px solid #bbf7d0'}}>
            <p style={{fontSize:'13px',color:'#059669',fontWeight:'500'}}>💬 {pr.feedback}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

/* ══════════════════════════════════════
   DASHBOARD PAGE
══════════════════════════════════════ */
function DashboardPage({ user, project, setActiveTab }) {
  return (
    <section>
      <h1 className="t2-page-title">Dashboard</h1>
      <p className="t2-page-sub">Welcome back, {user?.name}!</p>

      <div className="t2-info-grid">
        <article className="t2-info-card"><p className="t2-info-lbl">Roll Number</p><p className="t2-info-val">{user?.rollNo||'—'}</p></article>
        <article className="t2-info-card"><p className="t2-info-lbl">Department</p><p className="t2-info-val">{user?.department||'—'}</p></article>
        <article className="t2-info-card"><p className="t2-info-lbl">Semester</p><p className="t2-info-val">{user?.semester||'—'}</p></article>
        <article className="t2-info-card"><p className="t2-info-lbl">Batch Year</p><p className="t2-info-val">{user?.batch||'—'}</p></article>
      </div>

      <div className="t2-stats-grid" style={{marginBottom:'20px'}}>
        <article className="t2-stat-card"><div className="t2-stat-ico-box">📋</div><p className="t2-stat-num">{project?1:0}</p><p className="t2-stat-lbl">Proposal Submitted</p></article>
        <article className="t2-stat-card"><div className="t2-stat-ico-box">📈</div><p className="t2-stat-num">{project?.progress?.length||0}</p><p className="t2-stat-lbl">Progress Reports</p></article>
        <article className="t2-stat-card"><div className="t2-stat-ico-box">💬</div><p className="t2-stat-num">{project?.progress?.filter(p=>p.feedback).length||0}</p><p className="t2-stat-lbl">Feedback Received</p></article>
      </div>

      {project ? (
        <div className="t2-card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
            <p className="t2-card-title">Project Status</p>
            <span className={`t2-badge t2-badge--${project.status}`}>{project.status.toUpperCase()}</span>
          </div>
          <p style={{fontWeight:'600',fontSize:'16px',marginBottom:'4px'}}>{project.title}</p>
          <p style={{fontSize:'13px',color:'#64748b',marginBottom:'6px'}}>{project.domain} · {project.technologies}</p>
          {project.supervisorId && <p style={{fontSize:'13px',color:'#059669',fontWeight:'500'}}>👩‍🏫 Supervisor: {project.supervisorId.name}</p>}
          {project.feedback && <p style={{fontSize:'13px',color:'#0369a1',marginTop:'8px',fontStyle:'italic'}}>💬 "{project.feedback}"</p>}
        </div>
      ) : (
        <div className="t2-empty-box">
          <p style={{fontSize:'36px',marginBottom:'12px'}}>📋</p>
          <p style={{fontWeight:'600',color:'#374151',marginBottom:'8px'}}>No Project Submitted Yet</p>
          <button className="t2-btn-primary" onClick={()=>setActiveTab('proposal')}>Submit Your Proposal →</button>
        </div>
      )}
    </section>
  );
}

/* ══════════════════════════════════════
   MAIN StudentDashboard
══════════════════════════════════════ */
export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [project, setProject]     = useState(null);
  const [toast, setToast]         = useState(null);

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const loadProject = async () => {
    try {
      const res  = await fetch(`${BASE}/projects/my`, { headers: authH() });
      const data = await res.json();
      setProject(data || null);
    } catch { setProject(null); }
  };

  useEffect(() => { loadProject(); }, []);

  const navItems = [
    { id:'dashboard', icon:'🏠', label:'Dashboard'    },
    { id:'proposal',  icon:'📄', label:'My Proposal'  },
    { id:'progress',  icon:'📈', label:'Progress'     },
    { id:'feedback',  icon:'💬', label:'Feedback'     },
  ];

  return (
    <div className="t2-layout">
      {toast && (
        <div className={`t2-toast t2-toast--${toast.type==='error'?'error':'success'}`}>
          {toast.type==='error' ? '❌' : '✅'} {toast.msg}
        </div>
      )}

      <aside className="t2-sidebar">
        <header className="t2-sb-header">
          <div className="t2-sb-logo-row">
            <div className="t2-sb-icon-box"><i className="ti ti-school" style={{fontSize:'18px',color:'white'}}/></div>
            <div><p className="t2-sb-brand">FYP System</p><span className="t2-role-tag">STUDENT</span></div>
          </div>
        </header>
        <nav className="t2-sb-nav">
          {navItems.map(item => (
            <button key={item.id} className={`t2-nav-btn${activeTab===item.id?' t2-nav-btn--active':''}`} onClick={()=>setActiveTab(item.id)}>
              <span className="t2-nav-ico">{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <footer className="t2-sb-footer">
          <div className="t2-sb-user-row">
            <div className="t2-sb-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <div><span className="t2-sb-uname">{user?.name}</span><span className="t2-sb-uemail">{user?.email}</span></div>
          </div>
          <button className="t2-btn-logout" onClick={()=>{logout();navigate('/login');}}>Sign Out</button>
        </footer>
      </aside>

      <main className="t2-main">
        {activeTab==='dashboard' && <DashboardPage user={user} project={project} setActiveTab={setActiveTab}/>}
        {activeTab==='proposal'  && <ProposalPage  project={project} onRefresh={loadProject} showToast={showToast}/>}
        {activeTab==='progress'  && <ProgressPage  project={project} onRefresh={loadProject} showToast={showToast}/>}
        {activeTab==='feedback'  && <FeedbackPage  project={project}/>}
      </main>
    </div>
  );
}