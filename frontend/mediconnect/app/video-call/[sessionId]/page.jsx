"use client";

import { useEffect, useState, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppContext } from "@/context/AppContext";

const API = "http://localhost:4000";

export default function VideoCallPage() {
  const { sessionId } = useParams();
  const router = useRouter();
  const { user } = useContext(AppContext);

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ending, setEnding] = useState(false);

  const isDoctor = user?.role === "doctor";

  useEffect(() => {
    if (!user) {
      router.push("/Auth/login");
      return;
    }
    joinSession();
  }, [user]);

  const joinSession = async () => {
    try {
      const res = await fetch(`${API}/api/telemedicine/${sessionId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "1",
          "x-user-role": user?.role === "doctor" ? "DOCTOR" : "PATIENT",
        },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Could not join session");
        return;
      }
      setSession(data.data || data);
    } catch {
      setError("Could not connect to the telemedicine service.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async () => {
    try {
      await fetch(`${API}/api/telemedicine/${sessionId}/start`, {
        method: "PATCH",
        headers: {
          "x-user-id": user?.id || "1",
          "x-user-role": "DOCTOR",
        },
      });
    } catch {
      // non-blocking — Jitsi meeting is already usable
    }
  };

  const handleEndSession = async () => {
    if (!confirm("End this consultation?")) return;
    setEnding(true);
    try {
      await fetch(`${API}/api/telemedicine/${sessionId}/end`, {
        method: "PATCH",
        headers: {
          "x-user-id": user?.id || "1",
          "x-user-role": "DOCTOR",
        },
      });
      router.push("/doctor/doctordashboard");
    } catch {
      alert("Failed to end session. Please try again.");
    } finally {
      setEnding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white gap-4">
        <svg className="w-10 h-10 animate-spin text-[#5F6FFF]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className="text-gray-300 text-sm">Connecting to your consultation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white gap-4">
        <div className="bg-red-900/40 border border-red-500 rounded-xl p-6 max-w-sm text-center">
          <p className="text-red-300 font-medium mb-2">Could not join session</p>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-5 py-2 bg-[#5F6FFF] text-white rounded-full text-sm hover:bg-[#4a5ce6]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const meetingLink = session?.meetingLink;

  // Extract Jitsi room name from the meeting link to use with the IFrame API
  // meetingLink is e.g. https://meet.jit.si/mc-<uuid>
  const roomName = meetingLink ? meetingLink.replace(/^https?:\/\/[^/]+\//, "") : null;
  const jitsiDomain = "meet.jit.si";

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <span className="text-white font-semibold text-sm">MediConnect</span>
          <span className="text-gray-400 text-xs">Video Consultation</span>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-green-400 text-xs">Live</span>
        </div>

        <div className="flex items-center gap-3">
          {isDoctor && session?.status === "SCHEDULED" && (
            <button
              onClick={handleStartSession}
              className="px-4 py-1.5 bg-green-600 text-white rounded-full text-xs font-medium hover:bg-green-700 transition"
            >
              Mark as Started
            </button>
          )}
          {isDoctor && (
            <button
              onClick={handleEndSession}
              disabled={ending}
              className="px-4 py-1.5 bg-red-600 text-white rounded-full text-xs font-medium hover:bg-red-700 transition disabled:opacity-50"
            >
              {ending ? "Ending..." : "End Consultation"}
            </button>
          )}
          {!isDoctor && (
            <button
              onClick={() => router.push("/my-appointments")}
              className="px-4 py-1.5 border border-gray-600 text-gray-300 rounded-full text-xs hover:bg-gray-700 transition"
            >
              Leave
            </button>
          )}
        </div>
      </div>

      {/* Jitsi embed */}
      {roomName ? (
        <iframe
          src={`https://${jitsiDomain}/${roomName}#userInfo.displayName="${encodeURIComponent(user?.name || "Guest")}"&config.prejoinPageEnabled=false&config.startWithAudioMuted=false&config.startWithVideoMuted=false`}
          allow="camera; microphone; display-capture; autoplay; fullscreen"
          allowFullScreen
          className="flex-1 w-full border-0"
          style={{ minHeight: "calc(100vh - 56px)" }}
          title="Video Consultation"
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <p>Meeting link not available. Please try again.</p>
        </div>
      )}
    </div>
  );
}
