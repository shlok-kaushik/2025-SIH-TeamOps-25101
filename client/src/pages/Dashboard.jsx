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
    <div className="p-4 md:p-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome, {user?.email}</CardTitle>
          <CardDescription>Your role is: {user?.role}</CardDescription>
        </CardHeader>
        <CardContent>
          {user?.role === "student" && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Student Panel</h3>
              <div className="flex gap-4">
                <Link to="/classroom/1">
                  <Button>Join Classroom</Button>
                </Link>
                <Link to="/replay/1">
                  <Button variant="outline">Replay Session</Button>
                </Link>
              </div>
            </div>
          )}

          {user?.role === "teacher" && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Teacher Panel</h3>
              <Link to="/classroom/1">
                <Button>Start Teaching</Button>
              </Link>
            </div>
          )}

          {user?.role === "admin" && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Admin Panel</h3>
              <p>Manage users, sessions, and reports.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="w-full max-w-4xl mx-auto mt-4">
        <Button onClick={logout} variant="destructive">
          Logout
        </Button>
      </div>
    </div>
  );
}