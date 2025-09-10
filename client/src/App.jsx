import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Classroom from "./pages/Classroom";
import Replay from "./pages/Replay";

// Protected route wrapper
function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>; // or a spinner
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

// Public route wrapper (redirect if logged in)
function PublicRoute({ children }) {
  const { user } = useContext(AuthContext);
  if (user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Protected */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/classroom/:id"
            element={
              <PrivateRoute>
                <Classroom />
              </PrivateRoute>
            }
          />
          <Route
            path="/replay/:id"
            element={
              <PrivateRoute>
                <Replay />
              </PrivateRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
