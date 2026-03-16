export default function ClassCard({ data, onSelect }) {
  return (
    <div className="class-card">
      <h3 className="class-name">{data.name}</h3>
      <p className="class-code">Code: {data.code}</p>

      <div className="class-info">
        <span>📷 QR Code:</span>
        <strong>{data.qrCode}</strong>
      </div>

      <div className="class-info">
        <span>📍 Radius:</span>
        <strong>{data.radius}m</strong>
      </div>

      <button className="btn-view" onClick={onSelect}>
        View Attendance →
      </button>
    </div>
  );
}
