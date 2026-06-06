import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../task2.css';

export default function Login() {
  const navigate        = useNavigate();
  const { login }       = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const res  = await loginUser(form);
      login(res.data.token, res.data.user);
      const role = res.data.user.role;
      if (role === 'admin')           navigate('/admin');
      else if (role === 'supervisor') navigate('/supervisor');
      else                            navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="t2-auth-page">
      <article className="t2-auth-card">

        <header className="t2-auth-head">
          <div className="t2-auth-logo"><span>FUI</span></div>
          <h1 className="t2-auth-title">FYP Management System</h1>
          <p className="t2-auth-subtitle">Foundation University Islamabad</p>
        </header>

        <section className="t2-auth-body">
          <h2 className="t2-auth-form-title">Sign In</h2>

          {error && (
            <div className="t2-alert-error" role="alert">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            <div className="t2-form-group">
              <label htmlFor="login-email" className="t2-label">
                Email Address <span className="t2-required">*</span>
              </label>
              <input
                type="email" id="login-email" name="email"
                className="t2-input"
                placeholder="e.g. admin@fui.edu.pk"
                value={form.email} onChange={handleChange}
                autoComplete="email" required
              />
            </div>

            <div className="t2-form-group">
              <label htmlFor="login-password" className="t2-label">
                Password <span className="t2-required">*</span>
              </label>
              <div className="t2-pw-wrap">
                <input
                  type={showPw ? 'text' : 'password'}
                  id="login-password" name="password"
                  className="t2-input"
                  placeholder="Enter your password"
                  value={form.password} onChange={handleChange}
                  autoComplete="current-password" required
                />
                <button type="button" className="t2-pw-toggle"
                  onClick={() => setShowPw(!showPw)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}>
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button type="submit" className="t2-btn-submit" disabled={loading}>
              {loading ? <span className="t2-spinner" /> : 'Sign In'}
            </button>
          </form>

          <footer className="t2-auth-footer">
            <p>New student? <Link to="/register" className="t2-auth-lnk">Create an account</Link></p>
            <p className="t2-auth-note">Supervisors &amp; Admins — contact the admin for credentials.</p>
          </footer>
        </section>

      </article>
    </main>
  );
}