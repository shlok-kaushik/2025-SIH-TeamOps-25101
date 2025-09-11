import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function Notes() {
  const { user } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [file, setFile] = useState(null);

  // fetch all notes
  const fetchNotes = async () => {
    try {
      const res = await fetch("http://localhost:4000/notes");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("note", file);

    try {
      await fetch("http://localhost:4000/notes/upload", {
        method: "POST",
        body: formData,
      });
      setFile(null);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800">
      <Card className="w-full max-w-3xl bg-black/30 backdrop-blur-lg border border-white/20 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Notes</CardTitle>
          <CardDescription className="text-gray-300">
            {user?.role === "teacher"
              ? "Upload and manage classroom notes."
              : "Browse and download classroom notes."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Teacher Upload Section */}
          {user?.role === "teacher" && (
            <div className="space-y-2">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-gray-300 file:mr-3 file:py-1 file:px-3
                           file:rounded-md file:border-0 file:text-sm file:font-semibold
                           file:bg-purple-600 file:text-white hover:file:bg-purple-700"
              />
              <Button
                onClick={handleUpload}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold"
              >
                Upload Note
              </Button>
            </div>
          )}

          {/* Notes List */}
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {notes.length === 0 ? (
              <p className="text-gray-400 text-sm">No notes available.</p>
            ) : (
              notes.map((n) => (
                <li
                  key={n.id}
                  className="flex justify-between items-center bg-white/10 rounded p-2"
                >
                  <span>{n.name}</span>
                  <Button
                    asChild
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    <a
                      href={`http://localhost:4000${n.filepath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  </Button>
                </li>
              ))
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
