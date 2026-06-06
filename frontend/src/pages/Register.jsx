import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../task2.css';

export default function Register() {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    rollNo: '', department: '', batch: '', semester: ''
  });
  const [fieldErrors, setFieldErrors]   = useState({});
  const [serverError, setServerError]   = useState('');
  const [loading, setLoading]           = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())                            e.name            = 'Full name is required.';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email       = 'Enter a valid email address.';
    if (form.password.length < 8)                     e.password        = 'Minimum 8 characters.';
    if (form.password !== form.confirmPassword)       e.confirmPassword = 'Passwords do not match.';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      const res = await registerUser(data);
      login(res.data.token, res.data.user);
      navigate('/student');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { id: 'name',            label: 'Full Name',        type: 'text',     placeholder: 'e.g. Faisal Iqbal',      required: true },
    { id: 'email',           label: 'Email Address',    type: 'email',    placeholder: 'e.g. student@fui.edu.pk', required: true },
    { id: 'password',        label: 'Password',         type: 'password', placeholder: 'Min. 8 characters',      required: true },
    { id: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Re-enter password',      required: true },
    { id: 'rollNo',          label: 'Roll Number',      type: 'text',     placeholder: 'e.g. 011' },
    { id: 'department',      label: 'Department',       type: 'text',     placeholder: 'e.g. IET' },
    { id: 'batch',           label: 'Batch Year',       type: 'text',     placeholder: 'e.g. 2022' },
    { id: 'semester',        label: 'Semester',         type: 'text',     placeholder: 'e.g. 4A' },
  ];

  return (
    <main className="t2-auth-page">
      <article className="t2-auth-card t2-auth-card--wide">

        <header className="t2-auth-head">
          <div className="t2-auth-logo"><span>FUI</span></div>
          <h1 className="t2-auth-title">FYP Management System</h1>
          <p className="t2-auth-subtitle">Foundation University Islamabad</p>
        </header>

        <section className="t2-auth-body">
          <h2 className="t2-auth-form-title">Student Registration</h2>

          {serverError && (
            <div className="t2-alert-error" role="alert">
              <span>⚠</span> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="t2-form-grid">
              {fields.map(({ id, label, type, placeholder, required }) => (
                <div className="t2-form-group" key={id}>
                  <label htmlFor={`reg-${id}`} className="t2-label">
                    {label} {required && <span className="t2-required">*</span>}
                  </label>
                  <input
                    type={type}
                    id={`reg-${id}`}
                    name={id}
                    className={`t2-input${fieldErrors[id] ? ' t2-input--error' : ''}`}
                    placeholder={placeholder}
                    value={form[id]}
                    onChange={handleChange}
                    autoComplete={id === 'password' || id === 'confirmPassword' ? 'new-password' : id}
                  />
                  {fieldErrors[id] && <span className="t2-field-error">{fieldErrors[id]}</span>}
                </div>
              ))}
            </div>

            <button type="submit" className="t2-btn-submit" disabled={loading}>
              {loading ? <span className="t2-spinner" /> : 'Create Account'}
            </button>
          </form>

          <footer className="t2-auth-footer">
            <p>Already have an account? <Link to="/login" className="t2-auth-lnk">Sign in</Link></p>
          </footer>
        </section>

      </article>
    </main>
  );
}