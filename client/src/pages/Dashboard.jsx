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
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-4 sm:p-6 md:p-8">
      <header className="max-w-5xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={logout} variant="destructive">
          Logout
        </Button>
      </header>

      <main className="max-w-5xl mx-auto">
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome, {user?.email}</CardTitle>
            <CardDescription className="capitalize">Your role is: {user?.role}</CardDescription>
          </CardHeader>
          <CardContent>
            {user?.role === "student" && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Student Panel</h3>
                <div className="flex flex-wrap gap-4">
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
                  <Button>Start Teaching Session</Button>
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
      </main>
    </div>
  );
}
