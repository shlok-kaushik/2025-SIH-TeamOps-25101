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

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800">
      <Card className="w-full max-w-4xl bg-black/30 backdrop-blur-lg border border-white/20 text-white shadow-lg">
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">Dashboard</CardTitle>
            <CardDescription className="text-gray-300">
              Welcome back, {user?.email || "User"} 👋
            </CardDescription>
          </div>

          <Button
            onClick={logout}
            variant="destructive"
            type="button"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            Logout
          </Button>
        </CardHeader>

        <CardContent className="space-y-8">
          {user?.role === "student" && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Student Panel</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  asChild
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg"
                >
                  <Link to="/classroom/1" className="block text-center py-2">
                    Join Classroom
                  </Link>
                </Button>

                <Button
                  asChild
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg"
                >
                  <Link to="/replay/1" className="block text-center py-2">
                    Replay Session
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {user?.role === "teacher" && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Teacher Panel</h3>
              <Button
                asChild
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg"
              >
                <Link to="/classroom/1" className="block text-center py-2">
                  Start Teaching Session
                </Link>
              </Button>
            </div>
          )}

          {user?.role === "admin" && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Admin Panel</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  asChild
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg"
                >
                  <Link to="/classroom/1" className="block text-center py-2">
                    Manage Classrooms
                  </Link>
                </Button>

                <Button
                  asChild
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg"
                >
                  <Link to="/admin/users" className="block text-center py-2">
                    Manage Users
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
