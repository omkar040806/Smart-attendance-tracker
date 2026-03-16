import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import "./App.css";


export default function App() {
  const { user } = useContext(AuthContext);

  if (!user) return <Login />;

  return user.role === "teacher" ? (
    <TeacherDashboard />
  ) : (
    <StudentDashboard />
  );
}
