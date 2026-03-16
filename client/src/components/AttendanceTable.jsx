export default function AttendanceTable({ records }) {
  return (
    <div className="card">
      <h3 className="card-title">Attendance Records</h3>

      <div className="table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Date</th>
              <th>Time</th>
              <th>Distance</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {records.map((r) => (
              <tr key={r._id}>
                <td>{r.studentName}</td>
                <td>{new Date(r.timestamp).toLocaleDateString()}</td>
                <td>{new Date(r.timestamp).toLocaleTimeString()}</td>
                <td>{r.distance}m</td>
                <td>
                  {r.verified ? (
                    <span className="status-verified">✔ Verified</span>
                  ) : (
                    <span className="status-failed">✘ Out of Range</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
