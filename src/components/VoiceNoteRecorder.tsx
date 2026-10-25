import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Volume2, CheckCircle2 } from 'lucide-react';

interface VoiceNoteRecorderProps {
  onAudioRecorded: (audioData: { url: string; name: string; size: string; durationSeconds: number }) => void;
  onClearAudio: () => void;
  initialAudio?: { url: string; name: string; durationSeconds?: number };
}

export const VoiceNoteRecorder: React.FC<VoiceNoteRecorderProps> = ({
  onAudioRecorded,
  onClearAudio,
  initialAudio
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(initialAudio?.url || null);
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasMicPermission(true);
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onAudioRecorded({
          url,
          name: `voice_note_${Date.now()}.webm`,
          size: `${Math.round(audioBlob.size / 1024)} KB`,
          durationSeconds: recordSeconds
        });
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone access unavailable or denied:', err);
      setHasMicPermission(false);
      // Fallback to sample recording
      useSampleRecording();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const useSampleRecording = () => {
    const sampleUrl = 'https://cdn.freesound.org/previews/381/381382_6494619-lq.mp3';
    setAudioUrl(sampleUrl);
    setRecordSeconds(18);
    onAudioRecorded({
      url: sampleUrl,
      name: 'mechanic_voice_note_serekunda.mp3',
      size: '480 KB',
      durationSeconds: 18
    });
  };

  const handlePlayPause = () => {
    if (!audioPlayerRef.current || !audioUrl) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleClear = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    setAudioUrl(null);
    setIsPlaying(false);
    setRecordSeconds(0);
    onClearAudio();
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="border border-zinc-200 rounded-2xl p-4 bg-zinc-50/50">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold text-zinc-900 flex items-center gap-1.5 uppercase tracking-wider">
          <Volume2 className="w-3.5 h-3.5 text-zinc-700" /> Voice Note (Explain your issue)
        </label>
        <span className="text-[11px] text-zinc-400">Optional · Gambian mechanics standard</span>
      </div>

      {!audioUrl && !isRecording && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={startRecording}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95"
          >
            <Mic className="w-4 h-4 text-emerald-400" />
            <span>Record Voice Note</span>
          </button>
          <button
            type="button"
            onClick={useSampleRecording}
            className="w-full sm:w-auto text-xs font-medium text-zinc-600 hover:text-zinc-900 px-3 py-2 rounded-xl hover:bg-zinc-200/60 transition-colors border border-dashed border-zinc-300"
          >
            Use Mechanic Voice Sample
          </button>
        </div>
      )}

      {isRecording && (
        <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-xl animate-pulse">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
            <span className="text-xs font-bold text-red-900">
              Recording... {formatTime(recordSeconds)}
            </span>
          </div>
          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            Stop
          </button>
        </div>
      )}

      {audioUrl && !isRecording && (
        <div className="flex items-center justify-between p-3 bg-white border border-zinc-200 rounded-xl shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePlayPause}
              className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center transition-colors shadow-sm"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-bold text-zinc-900">Voice Note Recorded</span>
              </div>
              <span className="text-[11px] text-zinc-500">
                {recordSeconds > 0 ? `${formatTime(recordSeconds)} duration` : '18s audio description'}
              </span>
            </div>
            <audio
              ref={audioPlayerRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete recording"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
