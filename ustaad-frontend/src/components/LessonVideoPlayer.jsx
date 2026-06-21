import { useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { api } from "../api/client";

function LessonVideoPlayer({ chapterName }) {
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const utteranceRef = useRef(null);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const speakScript = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setPlaying(true);
  };

  const pauseSpeech = () => {
    window.speechSynthesis?.cancel();
    setPlaying(false);
  };

  const handlePlay = async () => {
    if (playing) {
      pauseSpeech();
      return;
    }

    if (script) {
      speakScript(script);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await api.getLessonScript(chapterName);
      setScript(data.script);
      speakScript(data.script);
    } catch (err) {
      setError(err.message || "Could not load lesson video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lesson-video-player">
      <div className="lesson-video-screen">
        {!script && !loading && (
          <button type="button" className="lesson-video-play-btn" onClick={handlePlay} aria-label="Play lesson">
            ▶
          </button>
        )}

        {loading && (
          <div className="lesson-video-loading">
            <Spinner animation="border" variant="light" size="sm" />
            <span className="ms-2">Preparing your lesson...</span>
          </div>
        )}

        {script && (
          <div className="lesson-video-script">
            <p style={{ whiteSpace: "pre-line" }}>{script}</p>
          </div>
        )}

        {script && (
          <button
            type="button"
            className="lesson-video-control-btn"
            onClick={handlePlay}
            aria-label={playing ? "Pause lesson" : "Play lesson"}
          >
            {playing ? "⏸" : "▶"}
          </button>
        )}
      </div>

      {error && <p className="text-danger small mt-2 mb-0">{error}</p>}
      {script && (
        <p className="text-muted small mt-2 mb-0">
          {playing ? "Playing AI lesson narration..." : "Tap play to listen to the lesson again."}
        </p>
      )}
    </div>
  );
}

export default LessonVideoPlayer;
