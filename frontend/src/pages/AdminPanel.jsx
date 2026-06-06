import "../App.css";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import SupervisorList from "../components/SupervisorList";
import AddSupervisor from "../components/AddSupervisor";
import SupervisorDetail from "../components/SupervisorDetail";

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [supervisors, setSupervisors] = useState([]);
  const [viewSupervisor, setViewSupervisor] = useState(null);
  const [editData, setEditData] = useState(null);
  const [toast, setToast] = useState(null);

  // Database se list fetch karne ka function (useCallback for stability)
  const fetchSupervisors = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/supervisor/all');
      if (response.ok) {
        const data = await response.json();
        setSupervisors(data);
      }
    } catch (err) {
      console.error("Error fetching supervisors:", err);
    }
  }, []);

  // Component load hote hi data fetch karein
  useEffect(() => {
    fetchSupervisors();
  }, [fetchSupervisors]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this supervisor?")) {
      try {
        // Yahan aap delete API call add kar sakte hain: await fetch(`http://localhost:5000/api/supervisor/delete/${id}`, {method: 'DELETE'})
        setSupervisors(s => s.filter(sv => sv.id !== id));
        setViewSupervisor(null);
        setActiveTab("supervisors");
        showToast("Supervisor removed", "danger");
      } catch (err) {
        alert("Failed to delete");
      }
    }
  };

  const handleEdit = (sv) => {
    setEditData(sv);
    setViewSupervisor(null);
    setActiveTab("addSupervisor");
  };

  const goAdd = () => {
    setEditData(null);
    setActiveTab("addSupervisor");
  };

  return (
    <section style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css" />

      {/* Toast Notification */}
      {toast && (
        <output style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: toast.type === "danger" ? "#FEF2F2" : "#ECFDF5", border: `1px solid ${toast.type === "danger" ? "#fca5a5" : "#6ee7b7"}`, color: toast.type === "danger" ? "#991b1b" : "#065f46", padding: "10px 18px", borderRadius: 10, fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
          <i className={`ti ${toast.type === "danger" ? "ti-alert-circle" : "ti-circle-check"}`} />
          {toast.msg}
        </output>
      )}

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

      <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
        {activeTab === "dashboard" && (
          <Dashboard supervisors={supervisors} setActiveTab={setActiveTab} />
        )}

        {activeTab === "supervisors" && !viewSupervisor && (
          <SupervisorList
            supervisors={supervisors}
            onView={setViewSupervisor}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={goAdd}
          />
        )}

        {activeTab === "supervisors" && viewSupervisor && (
          <SupervisorDetail
            supervisor={viewSupervisor}
            onBack={() => setViewSupervisor(null)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {activeTab === "addSupervisor" && (
          <AddSupervisor
            editData={editData}
            onSave={() => {
              fetchSupervisors(); // Refresh list from DB
              showToast(editData ? "Supervisor updated successfully" : "Supervisor added successfully");
              setEditData(null);
              setActiveTab("supervisors");
            }}
            onCancel={() => {
              setActiveTab("supervisors");
              setEditData(null);
            }}
          />
        )}
      </main>
    </section>
  );
}