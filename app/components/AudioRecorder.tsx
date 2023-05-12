import { Form } from "@remix-run/react";
import { useState, useRef } from "react";

const mimeType = "audio/webm";

const AudioRecorder = () => {
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef<any>(null);
  const [recordingStatus, setRecordingStatus] = useState<
    "recording" | "inactive" | "paused"
  >("inactive");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioChunks, setAudioChunks] = useState<any[]>([]);
  const [audio, setAudio] = useState<string | null>(null);

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (err: any) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const startRecording = async () => {
    setRecordingStatus("recording");
    //create new Media recorder instance using the stream
    if (!stream) return;
    const media = new MediaRecorder(stream, { mimeType: mimeType });
    //set the MediaRecorder instance to the mediaRecorder ref
    mediaRecorder.current = media;
    //invokes the start method to start the recording process
    mediaRecorder.current.start();
    let localAudioChunks: any[] = [];
    mediaRecorder.current.ondataavailable = (event: any) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = () => {
    setRecordingStatus("inactive");
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      //creates a playable URL from the blob file.
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);
      setAudioChunks([]);
    };
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <h2 className="text-xl font-bold">Audio Recorder</h2>
      <div>
        {!permission && (
          <button
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={getMicrophonePermission}
            type="button"
          >
            Get Microphone
          </button>
        )}
        {permission && recordingStatus === "inactive" && (
          <button
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={startRecording}
            type="button"
          >
            Start Recording
          </button>
        )}
        {recordingStatus === "recording" && (
          <button
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={stopRecording}
            type="button"
          >
            Stop Recording
          </button>
        )}
      </div>
      {audio && (
        <div className="flex flex-col items-center gap-3">
          <audio src={audio} controls></audio>
          <Form method="post">
            <input type="hidden" name="audio" value={audio} />
            <button
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              type="submit"
            >
              Send to AI
            </button>
          </Form>
        </div>
      )}
    </div>
  );
};
export default AudioRecorder;
