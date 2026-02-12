import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyApplications, deleteApplication } from "./api/application";
import { logout } from "./api/auth";
import { useTheme } from './context/ThemeContext';

const PAGE_SIZE = 6;

const Dashboard = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  const [apps, setApps] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await getMyApplications();
      const data = Array.isArray(res.data) ? res.data : [];
      setApps(data);
    } catch (err) {
      console.error("Load failed:", err);
      setErrorMsg("Failed to load applications. Please try again.");
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await deleteApplication(id);
      loadApps();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const total = Array.isArray(apps) ? apps.length : 0;

  const statusCounts = Array.isArray(apps)
    ? apps.reduce((acc, app) => {
        const status = (app?.status || "Unknown").toUpperCase();
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {})
    : {};

  const filtered = Array.isArray(apps)
    ? apps.filter((a) => {
        const matchesSearch =
          (a?.companyName || "").toLowerCase().includes(search.toLowerCase()) ||
          (a?.role || "").toLowerCase().includes(search.toLowerCase());

        const matchesStatus = selectedStatus
          ? (a?.status || "").toUpperCase() === selectedStatus
          : true;

        return matchesSearch && matchesStatus;
      })
    : [];

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, selectedStatus]);

  const handleStatusClick = (status) => {
    setSelectedStatus((prev) => (prev === status ? null : status));
  };

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "applied": return darkMode ? "#4dabf7" : "#007bff";
      case "interview": return darkMode ? "#ffca28" : "#ffc107";
      case "offered": return darkMode ? "#66bb6a" : "#28a745";
      case "rejected": return darkMode ? "#ef5350" : "#dc3545";
      case "ghosted": return darkMode ? "#bdbdbd" : "#6c757d";
      default: return darkMode ? "#9e9e9e" : "#6c757d";
    }
  };

  const styles = {
    container: {
      padding: "30px",
      background: "var(--bg-primary)",
      minHeight: "100vh",
      color: "var(--text-primary)",
      transition: "background 0.4s, color 0.4s",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "32px",
      flexWrap: "wrap",
      gap: "16px",
    },
    title: {
      margin: 0,
      color: "var(--text-primary)",
      fontSize: "28px",
    },
    headerButtons: {
      display: "flex",
      gap: "12px",
      alignItems: "center",
      flexWrap: "wrap",
    },
    themeToggle: {
      padding: "8px 14px",
      background: "var(--bg-secondary)",
      color: "var(--text-primary)",
      border: "1px solid var(--border)",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "15px",
      transition: "all 0.2s",
    },
    addBtn: {
      padding: "8px 16px",
      background: "var(--accent)",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "15px",
    },
    logoutBtn: {
      padding: "8px 16px",
      background: "var(--danger)",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "15px",
    },
    search: {
      width: "100%",
      maxWidth: "400px",
      padding: "12px 16px",
      marginBottom: "24px",
      border: "1px solid var(--border)",
      borderRadius: "6px",
      fontSize: "16px",
      background: "var(--bg-secondary)",
      color: "var(--text-primary)",
      outline: "none",
    },
    stats: {
      display: "flex",
      flexWrap: "wrap",
      gap: "16px",
      marginBottom: "32px",
    },
    statCard: {
      background: "var(--bg-secondary)",
      padding: "16px 24px",
      borderRadius: "12px",
      boxShadow: "var(--shadow-sm)",
      textAlign: "center",
      minWidth: "120px",
      cursor: "pointer",
      transition: "all 0.25s ease",
      border: "1px solid var(--border)",
    },
    statNumber: {
      display: "block",
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "6px",
      color: "var(--text-primary)",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "24px",
      marginBottom: "32px",
    },
    card: {
      background: "var(--bg-secondary)",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "var(--shadow-md)",
      border: "1px solid var(--border)",
      transition: "transform 0.2s, box-shadow 0.2s",
    },
    badge: {
      display: "inline-block",
      padding: "6px 12px",
      color: "white",
      borderRadius: "20px",
      fontSize: "14px",
      fontWeight: "500",
      marginBottom: "12px",
    },
    resumeSection: {
      marginTop: "12px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      fontSize: "14px",
    },
    viewResumeBtn: {
      padding: "6px 12px",
      background: "#17a2b8",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "13px",
      transition: "background 0.2s",
    },
    actions: {
      marginTop: "20px",
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
    },
    editBtn: {
      padding: "8px 16px",
      background: "var(--accent)",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
    },
    deleteBtn: {
      padding: "8px 16px",
      background: "var(--danger)",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      gap: "10px",
      marginTop: "32px",
      flexWrap: "wrap",
    },
    pageBtn: {
      padding: "8px 14px",
      border: "1px solid var(--border)",
      borderRadius: "6px",
      background: "var(--bg-secondary)",
      color: "var(--text-primary)",
      cursor: "pointer",
      minWidth: "40px",
      textAlign: "center",
    },
    activePage: {
      padding: "8px 14px",
      border: "1px solid var(--accent)",
      borderRadius: "6px",
      background: "var(--accent)",
      color: "white",
      fontWeight: "bold",
      cursor: "default",
      minWidth: "40px",
      textAlign: "center",
    },
    emptyState: {
      textAlign: "center",
      padding: "80px 20px",
      background: "var(--bg-secondary)",
      borderRadius: "12px",
      boxShadow: "var(--shadow-md)",
      border: "1px solid var(--border)",
    },
    filterNotice: {
      margin: "16px 0",
      padding: "12px",
      background: "rgba(13,110,253,0.08)",
      borderRadius: "8px",
      color: "var(--text-secondary)",
      fontSize: "15px",
    },
  };
const downloadResume = async (resume) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`https://applyboard-job-application-tracer.onrender.com${resume.filePath}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Download failed");
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = resume.fileName || "resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    alert("Unable to download resume");
  }
};
  return (
    <div style={styles.container} className="app-container">
      <div style={styles.header} className="app-header">
        <h2 style={styles.title} className="app-title">My Applications Dashboard</h2>
        <div style={styles.headerButtons} className="flex gap-12">
          <button
            onClick={toggleDarkMode}
            style={styles.themeToggle}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>

          <button onClick={() => navigate("/add")} style={styles.addBtn}>
            + Add Application
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      {total > 0 && (
        <div style={styles.stats} className="flex gap-12">
          <div
            onClick={() => handleStatusClick(null)}
            style={{
              ...styles.statCard,
              background: selectedStatus === null ? 'rgba(13,110,253,0.1)' : 'var(--bg-secondary)',
              borderColor: selectedStatus === null ? 'var(--accent)' : 'var(--border)',
            }}
            className="statCard"
          >
            <span style={styles.statNumber}>{total}</span>
            <span>All</span>
          </div>

          {Object.entries(statusCounts).map(([status, count]) => (
            <div
              key={status}
              onClick={() => handleStatusClick(status)}
              style={{
                ...styles.statCard,
                background: selectedStatus === status ? 'rgba(13,110,253,0.1)' : 'var(--bg-secondary)',
                borderColor: selectedStatus === status ? 'var(--accent)' : 'var(--border)',
              }}
              className="statCard"
            >
              <span style={styles.statNumber}>{count}</span>
              <span>{status}</span>
            </div>
          ))}
        </div>
      )}

      <input
        placeholder="Search company or role..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
        className="search"
      />

      {selectedStatus && (
        <div style={styles.filterNotice} className="filterNotice">
          Showing only <strong>{selectedStatus}</strong> applications
          <button
            onClick={() => setSelectedStatus(null)}
            style={{
              marginLeft: "12px",
              background: "none",
              border: "none",
              color: "var(--accent)",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Clear filter
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "80px", color: "var(--text-muted)" }} className="loading">
          Loading applications...
        </div>
      ) : errorMsg ? (
        <div style={{ textAlign: "center", padding: "50px", color: "var(--danger)" }} className="loading">
          {errorMsg}
          <br />
          <button
            onClick={loadApps}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "var(--accent)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      ) : total === 0 ? (
        <div style={styles.emptyState} className="emptyState">
          <h3>No applications yet</h3>
          <p>Start tracking your job applications by adding one!</p>
          <button onClick={() => navigate("/add")} style={styles.addBtn}>
            + Add Your First Application
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>
          No applications match the current filter.
          <br />
          <button
            onClick={() => setSelectedStatus(null)}
            style={{
              marginTop: "16px",
              padding: "10px 20px",
              background: "var(--accent)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Show all applications
          </button>
        </div>
      ) : (
        <>
          <div style={styles.grid} className="grid">
            {visible.map((a) => (
              <div key={a.id} style={styles.card} className="card">
                <h3>{a.companyName || "Company Name"}</h3>
                <p>{a.role || "Role"}</p>
                <span
                  style={{
                    ...styles.badge,
                    backgroundColor: getStatusColor(a.status),
                  }}
                >
                  {a.status || "Pending"}
                </span>

                {/* View Resume Button */}
                {a.resume && a.resume.filePath && (
  <div style={styles.resumeSection} className="resumeSection">
    
    <button
  onClick={() => downloadResume(a.resume)}
  style={styles.viewResumeBtn}
  className="view-resume"
>
  Download Resume
</button>
  </div>
)}

                <div style={styles.actions} className="flex gap-12">
                  <button
                    onClick={() => navigate(`/edit/${a.id}`)}
                    style={styles.editBtn}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={styles.pagination} className="pagination">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  style={
                    page === i + 1 ? styles.activePage : styles.pageBtn
                  }
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;