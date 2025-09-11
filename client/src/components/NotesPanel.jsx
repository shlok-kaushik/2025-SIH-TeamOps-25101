import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button } from "@/components/ui/button";

export default function NotesPanel({ classroomId }) {
  const { user } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [file, setFile] = useState(null);

  // fetch notes
  useEffect(() => {
    fetch(`http://localhost:4000/classrooms/${classroomId}/notes`)
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error(err));
  }, [classroomId]);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("note", file);

    try {
      await fetch(`http://localhost:4000/classrooms/${classroomId}/notes`, {
        method: "POST",
        body: formData,
      });
      setFile(null);
      // reload notes after upload
      const res = await fetch(`http://localhost:4000/classrooms/${classroomId}/notes`);
      setNotes(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white/5 border border-white/10 rounded-lg p-3 text-white">
      <h2 className="font-bold text-lg mb-2">Notes</h2>

      {/* Teacher: upload notes */}
      {user?.role === "teacher" && (
        <div className="mb-3 space-y-2">
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

      {/* Notes list */}
      <ul className="space-y-2 overflow-y-auto flex-1">
        {notes.length === 0 ? (
          <p className="text-gray-400 text-sm">No notes available</p>
        ) : (
          notes.map((n) => (
            <li key={n.id} className="bg-white/10 rounded p-2">
              <a
                href={n.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:underline"
              >
                {n.name}
              </a>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
