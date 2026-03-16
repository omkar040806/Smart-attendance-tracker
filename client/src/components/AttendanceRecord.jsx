export default function AttendanceRecord({ record }) {
  return (
    <div className="attendance-record">
      <div className="record-header">
        <div>
          <h3 className="record-class">{record.className}</h3>
          <p className="record-time">
            {new Date(record.timestamp).toLocaleString()}
          </p>
        </div>

        <span className={record.verified ? "status-verified" : "status-failed"}>
          {record.verified ? "✔ Verified" : "✘ Out of Range"}
        </span>
      </div>

      <div className="record-distance">
        📍 Distance: {record.distance}m
      </div>
    </div>
  );
}
