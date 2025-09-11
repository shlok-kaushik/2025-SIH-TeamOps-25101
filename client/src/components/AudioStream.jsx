import { useEffect, useRef, useState } from "react";

export default function AudioStream({ socket, user, classroomId }) {
  const audioRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (!socket || !user) return;

    const pc = new RTCPeerConnection();
    pcRef.current = pc;

    // Student → listen mode
    if (user.role === "student") {
      pc.ontrack = (event) => {
        audioRef.current.srcObject = event.streams[0];
      };

      socket.on("teacher-offer", async (offer) => {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("student-answer", { classroomId, answer });
      });

      socket.on("mute-status", (muted) => {
        setMuted(muted);
      });
    }

    // Teacher → speak mode
    if (user.role === "teacher") {
      (async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStreamRef.current = stream;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit("teacher-offer", { classroomId, offer });
      })();

      socket.on("student-answer", async (answer) => {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      });
    }

    return () => {
      pc.close();
      socket.off("teacher-offer");
      socket.off("student-answer");
      socket.off("mute-status");
    };
  }, [socket, user, classroomId]);

  // Teacher mute/unmute
  const toggleMute = () => {
    if (user.role !== "teacher") return;
    const track = localStreamRef.current?.getTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMuted(!track.enabled);
      socket.emit("mute-status", { classroomId, muted: !track.enabled });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {user.role === "teacher" && (
        <button
          onClick={toggleMute}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow-lg"
        >
          {muted ? "Unmute Mic" : "Mute Mic"}
        </button>
      )}

      {user.role === "student" && (
        <div className="bg-black/70 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          {muted ? "Teacher is muted" : "🔊 Listening..."}
        </div>
      )}

      {/* Hidden audio element for students */}
      {user.role === "student" && <audio ref={audioRef} autoPlay className="hidden" />}
    </div>
  );
}
