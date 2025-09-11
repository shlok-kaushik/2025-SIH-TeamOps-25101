import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.token) {
        login(data.token, { id: data.id, email: data.email, role: data.role });
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800">
      <Card className="w-[380px] bg-black/30 backdrop-blur-lg border border-white/20 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-gray-300">
            Sign in to continue to your classroom.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 placeholder:text-gray-400 focus:ring-purple-500"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 placeholder:text-gray-400 focus:ring-purple-500"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleLogin} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold">
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
