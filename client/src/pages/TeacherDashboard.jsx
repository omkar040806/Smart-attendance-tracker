import { useContext, useEffect, useReducer, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { attendanceReducer } from "../reducers/attendanceReducer";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ClassCard from "../components/ClassCard";
import AttendanceTable from "../components/AttendanceTable";

export default function TeacherDashboard() {
  const { user, logout } = useContext(AuthContext);

  const [state, dispatch] = useReducer(attendanceReducer, {
    classes: [],
    records: [],
  });

  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const [newClass, setNewClass] = useState({
    name: "",
    code: "",
    radius: 100,
    location: { latitude: 12.93, longitude: 77.53 },
  });

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    const res = await API.getClasses(user.id);
    if (res.success) dispatch({ type: "SET_CLASSES", payload: res.classes });
    setLoading(false);
  };

  const createClass = async () => {
    if (!newClass.name || !newClass.code)
      return alert("Fill all fields");

    setLoading(true);
    const res = await API.createClass({ ...newClass, teacherId: user.id });

    if (res.success) {
      dispatch({ type: "ADD_CLASS", payload: res.class });
      setShowCreate(false);
      setNewClass({
        name: "",
        code: "",
        radius: 100,
        location: { latitude: 12.93, longitude: 77.53 },
      });
    }
    setLoading(false);
  };

  const loadAttendance = async (classId) => {
    const res = await API.getAttendance({ classId });
    if (res.success) dispatch({ type: "SET_RECORDS", payload: res.records });
  };

  return (
    <div className="main-content">
      <Navbar user={user} logout={logout} title="Teacher Dashboard" />

      <div className="section-header">
        <h2>My Classes</h2>
        <button className="btn-create" onClick={() => setShowCreate(true)}>
          ➕ Create Class
        </button>
      </div>

      {showCreate && (
        <div className="card">
          <h3>Create New Class</h3>

          <input
            placeholder="Class Name"
            value={newClass.name}
            onChange={(e) =>
              setNewClass({ ...newClass, name: e.target.value })
            }
          />

          <input
            placeholder="Code"
            value={newClass.code}
            onChange={(e) => setNewClass({ ...newClass, code: e.target.value })}
          />

          <input
            type="number"
            value={newClass.radius}
            onChange={(e) =>
              setNewClass({ ...newClass, radius: Number(e.target.value) })
            }
          />

          <button onClick={createClass} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>

          <button onClick={() => setShowCreate(false)}>Cancel</button>
        </div>
      )}

      <div className="card-grid">
        {state.classes.map((cls) => (
          <ClassCard key={cls._id} data={cls} onSelect={() => loadAttendance(cls._id)} />
        ))}
      </div>

      {state.records.length > 0 && <AttendanceTable records={state.records} />}
    </div>
  );
}
