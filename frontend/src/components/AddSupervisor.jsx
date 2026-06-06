import { useState } from "react";

export default function AddSupervisor({ onCancel }) {
  const [form, setForm] = useState({
    image: null, name: "", email: "", password: "", 
    confirmPassword: "", phone: "", designation: "", bio: ""
  });

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Role aur baki data ko prepare karna
    const dataToSend = { ...form, role: "supervisor" };

    try {
      const response = await fetch('http://localhost:5000/api/supervisor/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      const result = await response.json();

      if (response.ok) {
        alert("Supervisor saved successfully!");
        onCancel(); // Form band karne ke liye
      } else {
        console.log("Server Error:", result);
        alert("Error: " + (result.error || "Could not save data"));
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Backend se connect nahi ho paya. Check karein server 5000 par chal raha hai.");
    }
  };

  return (
    <div style={{ padding: "40px", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}>
        
        <header style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2 style={{ fontSize: "24px", color: "#111827", margin: "0" }}>Add Supervisor</h2>
          <p style={{ color: "#6b7280" }}>Register a new supervisor in the system.</p>
        </header>

        {/* Profile Image Section */}
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <label style={{ display: "block", marginBottom: "10px", fontWeight: "600" }}>Profile Image</label>
          <input type="file" onChange={(e) => set("image", e.target.files[0])} style={{ padding: "10px", border: "1px dashed #d1d5db", borderRadius: "8px", width: "100%" }} />
        </div>

        {/* Input Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {[
            { label: "Full Name *", key: "name", type: "text" },
            { label: "Email Address *", key: "email", type: "email" },
            { label: "Password *", key: "password", type: "password" },
            { label: "Confirm Password *", key: "confirmPassword", type: "password" },
            { label: "Phone Number *", key: "phone", type: "text" },
            { label: "Designation *", key: "designation", type: "text" },
          ].map((field) => (
            <div key={field.key} style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>{field.label}</label>
              <input type={field.type} style={{ padding: "12px", borderRadius: "6px", border: "1px solid #d1d5db" }} value={form[field.key]} onChange={(e) => set(field.key, e.target.value)} />
            </div>
          ))}
        </div>

        {/* Bio Section */}
        <div style={{ marginTop: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Bio / Description</label>
          <textarea style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #d1d5db", height: "100px" }} value={form.bio} onChange={(e) => set("bio", e.target.value)} />
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: "30px", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button onClick={handleSubmit} style={{ padding: "12px 24px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>+ Add Supervisor</button>
          <button onClick={onCancel} style={{ padding: "12px 24px", backgroundColor: "#f3f4f6", color: "#374151", border: "none", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
        </div>

      </div>
    </div>
  );
}