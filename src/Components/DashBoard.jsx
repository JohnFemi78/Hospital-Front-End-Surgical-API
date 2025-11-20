// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useContext } from "react";
import { storeContext } from "../context/storeContext";
import Spinner from "../layout/Spinner";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

export default function Dashboard() {
  const {
    API,
    localStorageToken,
    isLoading,
    setIsLoading,
    fetchSchedules,
    schedules,
    deleteSchedule,
  } = useContext(storeContext);

  // Tab state: "add" | "manage"
  const [activeTab, setActiveTab] = useState("add");

  console.log(schedules);

  // Add schedule form state
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [note, setNote] = useState("");

  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // View details state
  const [viewSchedule, setViewSchedule] = useState(null);

  // Load schedules on mount
  useEffect(() => {
    fetchSchedules();
  }, []);

  // Helper: reset add form
  function resetAddForm() {
    setType("");
    setDate("");
    setTime("");
    setDoctorId("");
    setNote("");
  }

  // Create schedule (POST /schedule/create)
  async function handleCreate(e) {
    e.preventDefault();
    try {
      setIsLoading(true);
      const status = "Pending";
      // format date from input (already YYYY-MM-DD). Keep as-is, server expects YYYY-MM-DD in example.
      const payload = {
        date,
        time,
        type,
        status,
        note,
        doctorId: Number(doctorId),
      };

      const res = await fetch(`${API}/schedule/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorageToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        const msg = data?.message || "Failed to create schedule";
        console.error(msg);
        alert(msg);
        return;
      }

      // Refresh and reset form
      await fetchSchedules();
      resetAddForm();
      setActiveTab("manage");
    } catch (err) {
      console.error("Create schedule error:", err);
      toast.error("Network error creating schedule.");
    } finally {
      setIsLoading(false);
    }
  }

  // Open edit modal and populate data
  function editSchedule(schedule) {
    setEditingSchedule({
      ...schedule,
      // Date Format  YYYY-MM-DD
      date: schedule.date ? schedule.date.split("T")[0] : schedule.date,
    });
    setIsEditOpen(true);
  }

  // Save edited schedule (PUT /schedule/update-status/:id)
  async function saveEdit() {
    if (!editingSchedule) return;
    setEditLoading(true);
    try {
      const id = editingSchedule.id;
      const payload = {
        date: editingSchedule.date,
        time: editingSchedule.time,
        type: editingSchedule.type,
        status: editingSchedule.status || "Pending",
        doctorId: Number(editingSchedule.doctorId),
        note: editingSchedule.note,
      };

      const res = await fetch(`${API}/schedule/update-status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorageToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Update failed", data);
        alert(data?.message || "Failed to update schedule");
        return;
      }

      // refresh list, close modal
      await fetchSchedules();
      setIsEditOpen(false);
      setEditingSchedule(null);
    } catch (err) {
      console.error("Update error:", err);
      alert("Network error while updating schedule.");
    } finally {
      setEditLoading(false);
    }
  }

  // View details
  async function openView(schedule) {
    const res = await fetch(`${API}/schedule/single/${schedule.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorageToken}`,
      },
    });

    if (!res.ok) {
      alert("Network error while fetching schedule.");
      return;
    }
    const data = await res.json();

    console.log(data.data);

    setViewSchedule(data.data);
  }
  function closeView() {
    setViewSchedule(null);
  }

  if (isLoading) return <Spinner />;

  return (
    <div className="schedule-dashboard">
      <Sidebar/>
      <div className="sd-header">
        <h1 className="sd-title">Surgery Schedule Manager</h1>
        <p className="sd-sub">Create and manage surgery appointments</p>
      </div>

      {/* Tabs */}
      <div className="sd-tabs">
        <button
          className={`sd-tab ${activeTab === "add" ? "active" : ""}`}
          onClick={() => setActiveTab("add")}
        >
          Add Schedule
        </button>
        <button
          className={`sd-tab ${activeTab === "manage" ? "active" : ""}`}
          onClick={() => setActiveTab("manage")}
        >
          Manage Schedules ({schedules?.length || 0})
        </button>
      </div>

      {/* Tab content */}
      <div className="sd-content">
        {activeTab === "add" && (
          <div className="sd-card">
            <h2 className="card-title">Create a new schedule</h2>
            <form className="sd-form" onSubmit={handleCreate}>
              <div className="sd-row">
                <label>Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Cardiac Surgery">Cardiac Surgery</option>
                  <option value="Neuro-Surgery">Neuro-Surgery</option>
                  <option value="Orthopedic Surgery">Orthopedic Surgery</option>
                  <option value="Plastic Surgery">Plastic Surgery</option>
                  <option value="Thoracic Surgery">Thoracic Surgery</option>
                  <option value="Consultation">Consultation</option>
                </select>
              </div>

              <div className="sd-grid">
                <div>
                  <label>Pick a date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Pick a time</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  >
                    <option value="">Select Time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="sd-row">
                <label>Doctor</label>
                <select
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  required
                >
                  <option value="">Select Doctor</option>
                  <option value="2">Dr. Bose</option>
                  <option value="3">Dr. Kunle</option>
                  <option value="4">Dr. Dami</option>
                  <option value="8">Dr. Akinyemi</option>
                </select>
              </div>

              <div className="sd-row">
                <label>Note (optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows="4"
                />
              </div>

              <div className="sd-actions">
                <button type="submit" className="btn-primary">
                  Create Schedule
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={resetAddForm}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "manage" && (
          <div className="sd-card">
            <div className="card-head">
              <h2 className="card-title">My Schedules</h2>
              <button
                className="btn-ghost"
                onClick={() => fetchSchedules()}
                title="Refresh"
              >
                Refresh
              </button>
            </div>

            <div className="sd-table-wrap">
              <table className="sd-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Doctor</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules && schedules.length > 0 ? (
                    schedules.map((s) => (
                      <tr key={s.id}>
                        <td>{s.type}</td>
                        <td>{s.date ? s.date.split("T")[0] : s.date}</td>
                        <td>{s.time}</td>
                        <td>{s.status}</td>
                        <td>{s.doctorId}</td>
                        <td className="table-actions">
                          <button
                            className="btn-small"
                            onClick={() => openView(s)}
                          >
                            View
                          </button>
                          <button
                            className="btn-edit"
                            onClick={() => editSchedule(s)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this schedule?"
                                )
                              ) {
                                deleteSchedule(s.id);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="empty">
                        No schedules found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewSchedule && (
        <div className="sd-modal-backdrop" onClick={closeView}>
          <div
            className="sd-modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h3>Schedule details</h3>
            <p>
              <strong>Type:</strong> {viewSchedule.type}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {viewSchedule.date
                ? viewSchedule.date.split("T")[0]
                : viewSchedule.date}
            </p>
            <p>
              <strong>Time:</strong> {viewSchedule.time}
            </p>
            <p>
              <strong>Status:</strong> {viewSchedule.status}
            </p>
            <p>
              <strong>Doctor Email:</strong> {viewSchedule.doctor.email}
            </p>
            <p>
              <strong>Doctor FullName:</strong> {viewSchedule.doctor.profile.fullName}
            </p>
            <p>
              <strong>Doctor Phone Number:</strong> {viewSchedule.doctor.profile.phoneNumber}
            </p>
            <p>
              <strong>Note:</strong> {viewSchedule.note || "N/A"}
            </p>

            <div className="sd-modal-actions">
              <button className="btn-primary" onClick={closeView}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && editingSchedule && (
        <div
          className="sd-modal-backdrop"
          onClick={() => {
            setIsEditOpen(false);
            setEditingSchedule(null);
          }}
        >
          <div
            className="sd-modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h3>Edit schedule</h3>

            <div className="sd-form">
              <label>Type</label>
              <select
                value={editingSchedule.type}
                onChange={(e) =>
                  setEditingSchedule({
                    ...editingSchedule,
                    type: e.target.value,
                  })
                }
              >
                <option value="">Select Type</option>
                <option value="Cardiac Surgery">Cardiac Surgery</option>
                <option value="Neuro-Surgery">Neuro-Surgery</option>
                <option value="Orthopedic Surgery">Orthopedic Surgery</option>
                <option value="Plastic Surgery">Plastic Surgery</option>
                <option value="Thoracic Surgery">Thoracic Surgery</option>
                <option value="Consultation">Consultation</option>
              </select>

              <label>Date</label>
              <input
                type="date"
                value={editingSchedule.date}
                onChange={(e) =>
                  setEditingSchedule({
                    ...editingSchedule,
                    date: e.target.value,
                  })
                }
              />

              <label>Time</label>
              <select
                value={editingSchedule.time}
                onChange={(e) =>
                  setEditingSchedule({
                    ...editingSchedule,
                    time: e.target.value,
                  })
                }
              >
                <option value="">Select Time</option>
                <option value="09:00">9:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="13:00">1:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="17:00">5:00 PM</option>
              </select>

              <label>Doctor ID</label>
              <select
                value={editingSchedule.doctorId}
                onChange={(e) =>
                  setEditingSchedule({
                    ...editingSchedule,
                    doctorId: Number(e.target.value),
                  })
                }
              >
                <option value="">Select Doctor</option>
                <option value="2">Dr. Bose</option>
                <option value="3">Dr. Kunle</option>
                <option value="4">Dr. Dami</option>
              </select>

              <label>Status</label>
              <select
                value={editingSchedule.status}
                onChange={(e) =>
                  setEditingSchedule({
                    ...editingSchedule,
                    status: e.target.value,
                  })
                }
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <label>Note</label>
              <textarea
                rows="3"
                value={editingSchedule.note}
                onChange={(e) =>
                  setEditingSchedule({
                    ...editingSchedule,
                    note: e.target.value,
                  })
                }
              />
            </div>

            <div className="sd-modal-actions">
              <button
                className="btn-primary"
                onClick={saveEdit}
                disabled={editLoading}
              >
                {editLoading ? "Saving..." : "Save"}
              </button>
              <button
                className="btn-ghost"
                onClick={() => {
                  setIsEditOpen(false);
                  setEditingSchedule(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
