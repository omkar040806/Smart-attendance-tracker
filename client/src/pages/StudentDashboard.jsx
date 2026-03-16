import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { attendanceReducer } from "../reducers/attendanceReducer";
import useGeolocation from "../hooks/useGeolocation";
import { calculateDistance } from "../utils/distance";
import API from "../services/api";
import Navbar from "../components/Navbar";
import AttendanceRecord from "../components/AttendanceRecord";

export default function StudentDashboard() {
  const { user, logout } = useContext(AuthContext);
  const { location, error: geoError, loading: geoLoading, getLocation } =
    useGeolocation();

  const qrInputRef = useRef(null);

  const [state, dispatch] = useReducer(attendanceReducer, {
    records: [],
  });

  const [qrInput, setQrInput] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    const res = await API.getAttendance({ studentId: user.id });
    if (res.success) dispatch({ type: "SET_RECORDS", payload: res.records });
  };

  const handleScan = async () => {
    if (!qrInput.trim()) {
      return setScanResult({ success: false, message: "QR cannot be empty" });
    }

    setLoading(true);
    try {
      const loc = await getLocation();
      const classRes = await API.getClassByQR(qrInput);

      if (!classRes.success)
        return setScanResult({ success: false, message: "Invalid QR code" });

      const cls = classRes.class;
      const distance = calculateDistance(
        loc.latitude,
        loc.longitude,
        cls.location.latitude,
        cls.location.longitude
      );

      const verified = distance <= cls.radius;

      const attendanceRes = await API.markAttendance({
        studentId: user.id,
        studentName: user.name,
        classId: cls._id,
        className: cls.name,
        location: loc,
        distance: Math.round(distance),
        verified,
      });

      if (attendanceRes.success) {
        dispatch({ type: "ADD_RECORD", payload: attendanceRes.record });
        setScanResult({
          success: verified,
          message: verified
            ? `Attendance Marked ✓`
            : `Too far (${Math.round(distance)}m)`,
        });
      }
      setQrInput("");
    } catch {
      setScanResult({
        success: false,
        message: "Enable location permissions",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <Navbar user={user} logout={logout} title="Student Dashboard" />

      <div className="container-medium">
        <div className="card">
          <h2 className="card-title">📷 Mark Attendance</h2>

          <input
            ref={qrInputRef}
            type="text"
            placeholder="Enter QR Code"
            value={qrInput}
            onChange={(e) => setQrInput(e.target.value)}
            className="attendance-input"
          />

          {location && (
            <div className="location-info">
              📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </div>
          )}

          {geoError && <div className="error-alert">{geoError}</div>}
          {scanResult && (
            <div
              className={
                scanResult.success ? "success-message" : "error-alert"
              }
            >
              {scanResult.message}
            </div>
          )}

          <button
            onClick={handleScan}
            disabled={loading || geoLoading}
            className="btn-scan"
          >
            {loading || geoLoading ? "Processing..." : "Mark Attendance"}
          </button>
        </div>

        <div className="card">
          <h2 className="card-title">📅 Attendance History</h2>

          {state.records.length === 0 ? (
            <div className="empty-state">No records yet</div>
          ) : (
            state.records.map((r) => <AttendanceRecord key={r._id} record={r} />)
          )}
        </div>
      </div>
    </div>
  );
}
