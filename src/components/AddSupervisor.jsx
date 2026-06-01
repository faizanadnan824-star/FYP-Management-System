import { useState, useEffect } from "react";

const departments = ["Computer Science", "Software Engineering", "Information Technology", "Electrical Engineering"];
const specializations = ["Mobile Application Development", "AI & Machine Learning", "Web Technologies", "Cybersecurity", "Database Systems", "Cloud Computing"];
const empty = { name: "", email: "", phone: "", department: "", specialization: "", designation: "", maxProjects: "", bio: "", status: "Active", image: "" };

export default function AddSupervisor({ onSave, editData, onCancel }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) setForm({ ...editData, maxProjects: String(editData.maxProjects) });
    else setForm(empty);
  }, [editData]);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm(f => ({ ...f, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.department) e.department = "Select a department";
    if (!form.specialization) e.specialization = "Select a specialization";
    if (!form.designation.trim()) e.designation = "Designation is required";
    if (!form.maxProjects || isNaN(form.maxProjects) || +form.maxProjects < 1) e.maxProjects = "Enter a valid number (min 1)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({ ...form, maxProjects: +form.maxProjects, education: editData?.education || [], roles: editData?.roles || [], id: editData?.id || Date.now() });
  };

  const initials = form.name ? form.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "?";

  return (
    <div className="asf-wrap">

      {/* Page Header */}
      <header className="asf-head">
        <h2>{editData ? "✏️ Edit Supervisor" : "Add Supervisor"}</h2>
        <p>{editData ? "Update the supervisor's information below." : "Register a new supervisor in the system."}</p>
      </header>

      <div className="asf-card">

        {/* ── Section 1: Profile Photo ── */}
        <section className="asf-section">
          <p className="asf-section-title">Profile Photo</p>
          <div className="asf-photo-box">
            <figure className="asf-avatar">
              {form.image ? <img src={form.image} alt="preview" /> : initials}
            </figure>
            <div className="asf-photo-info">
              <strong>Upload Profile Photo</strong>
              <span>JPG, PNG or WEBP — Max 2MB</span>
              <label>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                <span className="asf-upload-btn">📁 Choose Photo</span>
              </label>
            </div>
            {form.image && (
              <button type="button" className="asf-remove-btn" onClick={() => setForm(f => ({ ...f, image: "" }))}>
                ✕ Remove
              </button>
            )}
          </div>
        </section>

        {/* ── Section 2: Personal Info ── */}
        <section className="asf-section">
          <p className="asf-section-title">Personal Information</p>
          <div className="asf-grid">

            <div className="asf-field">
              <label className="asf-label">Full Name <span className="asf-required">*</span></label>
              <input className={`asf-input ${errors.name ? "err" : ""}`} type="text" placeholder="e.g. Mr. Asad Javed" value={form.name} onChange={e => set("name", e.target.value)} />
              {errors.name && <p className="asf-err-text">{errors.name}</p>}
            </div>

            <div className="asf-field">
              <label className="asf-label">Email Address <span className="asf-required">*</span></label>
              <input className={`asf-input ${errors.email ? "err" : ""}`} type="email" placeholder="e.g. name@uni.edu.pk" value={form.email} onChange={e => set("email", e.target.value)} />
              {errors.email && <p className="asf-err-text">{errors.email}</p>}
            </div>

            <div className="asf-field">
              <label className="asf-label">Phone Number <span className="asf-required">*</span></label>
              <input className={`asf-input ${errors.phone ? "err" : ""}`} type="text" placeholder="e.g. 0300-0000000" value={form.phone} onChange={e => set("phone", e.target.value)} />
              {errors.phone && <p className="asf-err-text">{errors.phone}</p>}
            </div>

            <div className="asf-field">
              <label className="asf-label">Designation <span className="asf-required">*</span></label>
              <input className={`asf-input ${errors.designation ? "err" : ""}`} type="text" placeholder="e.g. Lecturer / Assistant Professor" value={form.designation} onChange={e => set("designation", e.target.value)} />
              {errors.designation && <p className="asf-err-text">{errors.designation}</p>}
            </div>

          </div>
        </section>

        {/* ── Section 3: Academic Info ── */}
        <section className="asf-section">
          <p className="asf-section-title">Academic Information</p>
          <div className="asf-grid">

            <div className="asf-field">
              <label className="asf-label">Department <span className="asf-required">*</span></label>
              <div className="asf-select-wrap">
                <select className={`asf-select ${errors.department ? "err" : ""}`} value={form.department} onChange={e => set("department", e.target.value)}>
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              {errors.department && <p className="asf-err-text">{errors.department}</p>}
            </div>

            <div className="asf-field">
              <label className="asf-label">Specialization <span className="asf-required">*</span></label>
              <div className="asf-select-wrap">
                <select className={`asf-select ${errors.specialization ? "err" : ""}`} value={form.specialization} onChange={e => set("specialization", e.target.value)}>
                  <option value="">Select Specialization</option>
                  {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {errors.specialization && <p className="asf-err-text">{errors.specialization}</p>}
            </div>

          </div>
        </section>

        {/* ── Section 4: Capacity & Status ── */}
        <section className="asf-section">
          <p className="asf-section-title">Capacity & Status</p>
          <div className="asf-grid">

            <div className="asf-field">
              <label className="asf-label">Max Projects <span className="asf-required">*</span></label>
              <input className={`asf-input ${errors.maxProjects ? "err" : ""}`} type="number" min="1" placeholder="e.g. 3" value={form.maxProjects} onChange={e => set("maxProjects", e.target.value)} />
              {errors.maxProjects && <p className="asf-err-text">{errors.maxProjects}</p>}
            </div>

            <div className="asf-field">
              <label className="asf-label">Status</label>
              <div className="asf-radio-group">
                {["Active", "Inactive"].map(s => (
                  <label key={s} className={`asf-radio-label ${form.status === s ? "active" : ""}`} onClick={() => set("status", s)}>
                    <input type="radio" value={s} checked={form.status === s} onChange={() => set("status", s)} />
                    <span className="asf-radio-dot" />
                    {s}
                  </label>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── Section 5: Bio ── */}
        <section className="asf-section">
          <p className="asf-section-title">Bio / Description</p>
          <div className="asf-field">
            <label className="asf-label">Brief description about the supervisor</label>
            <textarea className="asf-textarea" rows={4} placeholder="Write a short bio, experience, research interests..." value={form.bio} onChange={e => set("bio", e.target.value)} />
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="asf-footer">
          <button type="button" className="asf-btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="asf-btn-primary" onClick={handleSubmit}>
            {editData ? "✓ Save Changes" : "＋ Add Supervisor"}
          </button>
        </footer>

      </div>
    </div>
  );
}