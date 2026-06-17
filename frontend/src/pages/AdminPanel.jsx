import "../App.css";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import SupervisorList from "../components/SupervisorList";
import AddSupervisor from "../components/AddSupervisor";
import SupervisorDetail from "../components/SupervisorDetail";
import StudentsPage from "../components/StudentPage";

// ─── API base ───────────────────────────────────────────────────────────────
const BASE = "http://localhost:5000";
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab]           = useState("dashboard");
  const [supervisors, setSupervisors]       = useState([]);
  const [students, setStudents]             = useState([]);
  const [viewSupervisor, setViewSupervisor] = useState(null);
  const [editData, setEditData]             = useState(null);
  const [toast, setToast]                   = useState(null);
  const [svLoading, setSvLoading]           = useState(false);
  const [stLoading, setStLoading]           = useState(false);
  const [saveLoading, setSaveLoading]       = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Load Supervisors ────────────────────────────────────────────────────
  const loadSupervisors = useCallback(async () => {
    setSvLoading(true);
    try {
      // Try new API first, fallback to old route
      let res = await fetch(`${BASE}/api/supervisors`, { headers: authHeader() });
      if (!res.ok) res = await fetch(`${BASE}/api/supervisor/all`);
      if (res.ok) {
        const data = await res.json();
        setSupervisors(data);
      }
    } catch (e) { console.error("Supervisors fetch error:", e); }
    finally { setSvLoading(false); }
  }, []);

  // ── Load Students ───────────────────────────────────────────────────────
  const loadStudents = useCallback(async () => {
    setStLoading(true);
    try {
      const res = await fetch(`${BASE}/api/students`, { headers: authHeader() });
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (e) { console.error("Students fetch error:", e); }
    finally { setStLoading(false); }
  }, []);

  useEffect(() => {
    loadSupervisors();
    loadStudents();
  }, [loadSupervisors, loadStudents]);

  const handleLogout = () => { logout(); navigate("/login"); };

  // ── Save Supervisor (Create or Update) ─────────────────────────────────
  const handleSave = async (data) => {
    setSaveLoading(true);
    try {
      if (editData) {
        // UPDATE — try new API, fallback to old
        const res = await fetch(`${BASE}/api/supervisors/${editData._id || editData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...authHeader() },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error((await res.json()).message || "Update failed");
        showToast("Supervisor updated successfully!");
      } else {
        // CREATE — try new API, fallback to old
        let res = await fetch(`${BASE}/api/supervisors`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeader() },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          // Try old route
          res = await fetch(`${BASE}/api/supervisor/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, role: "supervisor" }),
          });
        }
        if (!res.ok) throw new Error((await res.json()).message || "Create failed");
        showToast("Supervisor added successfully!");
      }
      await loadSupervisors();
      setEditData(null);
      setActiveTab("supervisors");
    } catch (e) { showToast(e.message || "Failed to save", "danger"); }
    finally { setSaveLoading(false); }
  };

  // ── Delete Supervisor ───────────────────────────────────────────────────
  const handleDeleteSupervisor = async (id) => {
    if (!window.confirm("Remove this supervisor?")) return;
    try {
      const res = await fetch(`${BASE}/api/supervisors/${id}`, {
        method: "DELETE",
        headers: authHeader(),
      });
      if (!res.ok) throw new Error("Delete failed");
      showToast("Supervisor removed", "danger");
      setViewSupervisor(null);
      setActiveTab("supervisors");
      await loadSupervisors();
    } catch (e) { showToast("Failed to delete supervisor", "danger"); }
  };

  // ── Assign Supervisor to Student ────────────────────────────────────────
  const handleAssignStudent = async (studentId, supervisorId) => {
    try {
      const res = await fetch(`${BASE}/api/students/${studentId}/assign`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ supervisorId }),
      });
      if (!res.ok) throw new Error("Assign failed");
      showToast("Supervisor assigned to student!");
      await loadStudents();
    } catch (e) { showToast("Failed to assign supervisor", "danger"); }
  };

  // ── Delete Student ──────────────────────────────────────────────────────
  const handleDeleteStudent = async (id) => {
    try {
      const res = await fetch(`${BASE}/api/students/${id}`, {
        method: "DELETE",
        headers: authHeader(),
      });
      if (!res.ok) throw new Error("Delete failed");
      showToast("Student removed", "danger");
      await loadStudents();
    } catch (e) { showToast("Failed to delete student", "danger"); }
  };

  const handleEdit = (sv) => { setEditData(sv); setViewSupervisor(null); setActiveTab("addSupervisor"); };
  const goAdd      = ()   => { setEditData(null); setActiveTab("addSupervisor"); };

  return (
    <section style={{ display: "flex", minHeight: "100vh", background: "#f9fafb", fontFamily: "'Segoe UI', sans-serif" }}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css" />

      {/* Toast */}
      {toast && (
        <output style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          background: toast.type === "danger" ? "#FEF2F2" : "#ECFDF5",
          border: `1px solid ${toast.type === "danger" ? "#fca5a5" : "#6ee7b7"}`,
          color: toast.type === "danger" ? "#991b1b" : "#065f46",
          padding: "10px 18px", borderRadius: 10, fontSize: 14, fontWeight: 500,
          display: "flex", alignItems: "center", gap: 8,
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        }}>
          <i className={`ti ${toast.type === "danger" ? "ti-alert-circle" : "ti-circle-check"}`} style={{ fontSize: 18 }} />
          {toast.msg}
        </output>
      )}

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setViewSupervisor(null);
          if (tab !== "addSupervisor") setEditData(null);
        }}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>

        {activeTab === "dashboard" && (
          <Dashboard
            supervisors={supervisors}
            students={students}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "supervisors" && !viewSupervisor && (
          <SupervisorList
            supervisors={supervisors}
            onView={setViewSupervisor}
            onEdit={handleEdit}
            onDelete={handleDeleteSupervisor}
            onAdd={goAdd}
            loading={svLoading}
          />
        )}

        {activeTab === "supervisors" && viewSupervisor && (
          <SupervisorDetail
            supervisor={viewSupervisor}
            onBack={() => setViewSupervisor(null)}
            onEdit={handleEdit}
            onDelete={handleDeleteSupervisor}
          />
        )}

        {activeTab === "addSupervisor" && (
          <AddSupervisor
            editData={editData}
            onSave={handleSave}
            onCancel={() => { setActiveTab("supervisors"); setEditData(null); }}
            loading={saveLoading}
          />
        )}

        {activeTab === "students" && (
          <StudentsPage
            students={students}
            supervisors={supervisors}
            onAssign={handleAssignStudent}
            onDelete={handleDeleteStudent}
            loading={stLoading}
          />
        )}

      </main>
    </section>
  );
}