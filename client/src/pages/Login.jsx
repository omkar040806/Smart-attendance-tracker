import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Users } from "lucide-react";

export default function Login() {
  const { login, register } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");

    const res = isRegister
      ? await register(form)
      : await login({ email: form.email, password: form.password });

    if (!res.success) setErr(res.message);

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <Users className="icon-xl login-icon" />
        <h1>Smart Attendance</h1>

        <form onSubmit={submit}>
          {isRegister && (
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          {isRegister && (
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          )}

          {err && <p className="error">{err}</p>}

          <button disabled={loading}>
            {loading ? "Loading..." : isRegister ? "Register" : "Login"}
          </button>
        </form>

        <button
          className="link-button"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "Already have an account? Login"
            : "Need an account? Register"}
        </button>
      </div>
    </div>
  );
}
