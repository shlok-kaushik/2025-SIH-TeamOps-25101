import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome, {user?.email}</h2>
      <p>Role: {user?.role}</p>

      {user?.role === "student" && (
        <>
          <h3>Student Panel</h3>
          <Link to="/classroom/1">Join Classroom</Link>
          <br />
          <Link to="/replay/1">Replay Session</Link>
        </>
      )}

      {user?.role === "teacher" && (
        <>
          <h3>Teacher Panel</h3>
          <Link to="/classroom/1">Start Teaching</Link>
        </>
      )}

      {user?.role === "admin" && (
        <>
          <h3>Admin Panel</h3>
          <p>Manage users, sessions, reports</p>
        </>
      )}

      <br />
      <button onClick={logout}>Logout</button>
    </div>
  );
}
