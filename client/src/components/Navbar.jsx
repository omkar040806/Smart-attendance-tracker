export default function Navbar({ user, logout, title }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">{title}</h1>

        <div className="navbar-user">
          <span className="navbar-username">{user.name}</span>

          <button className="btn-logout" onClick={logout}>
            🔓 Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
