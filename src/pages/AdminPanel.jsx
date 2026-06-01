import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import SupervisorList from "../components/SupervisorList";
import AddSupervisor from "../components/AddSupervisor";
import SupervisorDetail from "../components/SupervisorDetail";
import { supervisorsData } from "../data/supervisors";

export default function Panel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [supervisors, setSupervisors] = useState(supervisorsData);
  const [viewSupervisor, setViewSupervisor] = useState(null);
  const [editData, setEditData] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (data) => {
    if (editData) {
      setSupervisors(s => s.map(sv => sv.id === data.id ? data : sv));
      showToast("Supervisor updated successfully");
    } else {
      setSupervisors(s => [...s, data]);
      showToast("Supervisor added successfully");
    }
    setEditData(null);
    setActiveTab("supervisors");
  };

  const handleDelete = (id) => {
    if (window.confirm("Remove this supervisor?")) {
      setSupervisors(s => s.filter(sv => sv.id !== id));
      setViewSupervisor(null);
      setActiveTab("supervisors");
      showToast("Supervisor removed", "danger");
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
    <section style={{ display: "flex", minHeight: "100vh", background: "#f9fafb", fontFamily: "'Segoe UI', sans-serif" }}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css" />

      {toast && (
        <output style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: toast.type === "danger" ? "#FEF2F2" : "#ECFDF5", border: `1px solid ${toast.type === "danger" ? "#fca5a5" : "#6ee7b7"}`, color: toast.type === "danger" ? "#991b1b" : "#065f46", padding: "10px 18px", borderRadius: 10, fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
          <i className={`ti ${toast.type === "danger" ? "ti-alert-circle" : "ti-circle-check"}`} style={{ fontSize: 18 }} />
          {toast.msg}
        </output>
      )}

      <Sidebar activeTab={activeTab} setActiveTab={(tab) => {
        setActiveTab(tab);
        setViewSupervisor(null);
        if (tab !== "addSupervisor") setEditData(null);
      }} />

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
            onSave={handleSave}
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