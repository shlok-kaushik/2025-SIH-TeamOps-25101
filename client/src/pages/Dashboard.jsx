import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  // Reusable panel button
  const PanelButton = ({ to, children, color = "purple" }) => (
    <Button
      asChild
      className={`w-full bg-${color}-600 hover:bg-${color}-700 text-white font-bold rounded-lg`}
    >
      <Link to={to} className="block text-center py-2">
        {children}
      </Link>
    </Button>
  );

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800">
      <Card className="w-full max-w-4xl bg-black/30 backdrop-blur-lg border border-white/20 text-white shadow-lg">
        {/* Header */}
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">Dashboard</CardTitle>
            <CardDescription className="text-gray-300">
              Welcome back, {user?.email || "User"} 👋
            </CardDescription>
          </div>
          <Button
            onClick={logout}
            type="button"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            Logout
          </Button>
        </CardHeader>

        {/* Content */}
        <CardContent className="space-y-8">
          {/* Student Panel */}
          {user?.role === "student" && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Student Panel</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PanelButton to="/classroom/1">Join Classroom</PanelButton>
                <PanelButton to="/replay/1" color="indigo">
                  Replay Session
                </PanelButton>
                <PanelButton to="/notes" color="emerald">
                  View Notes
                </PanelButton>
              </div>
            </div>
          )}

          {/* Teacher Panel */}
          {user?.role === "teacher" && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Teacher Panel</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PanelButton to="/classroom/1">Start Teaching Session</PanelButton>
                <PanelButton to="/notes" color="indigo">
                  Manage Notes
                </PanelButton>
              </div>
            </div>
          )}

          {/* Admin Panel */}
          {user?.role === "admin" && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Admin Panel</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PanelButton to="/classroom/1">Manage Classrooms</PanelButton>
                <PanelButton to="/admin/users" color="indigo">
                  Manage Users
                </PanelButton>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
