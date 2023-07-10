import * as React from 'react';
import { openAITranscription } from './openAITranscription';

const mimeType = 'audio/webm';

export function AudioRecorder({
  openAIKey,
  setTranscriptionLoading,
  setMessages,
}) {
  const transcript = openAITranscription({ openAIKey });
  const [permission, setPermission] = React.useState(false);
  const mediaRecorder = React.useRef<any>(null);
  const [recordingStatus, setRecordingStatus] = React.useState<
    'recording' | 'inactive'
  >('inactive');
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [audioChunks, setAudioChunks] = React.useState<any[]>([]);

  const getMicrophonePermission = async () => {
    if ('MediaRecorder' in window) {
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
      alert('The MediaRecorder API is not supported in your browser.');
    }
  };

  const startRecording = async () => {
    setRecordingStatus('recording');
    //create new Media recorder instance using the stream
    if (!stream) return;
    const media = new MediaRecorder(stream, { mimeType: mimeType });
    //set the MediaRecorder instance to the mediaRecorder ref
    mediaRecorder.current = media;
    //invokes the start method to start the recording process
    mediaRecorder.current.start();
    let localAudioChunks: any[] = [];
    mediaRecorder.current.ondataavailable = (event: any) => {
      if (typeof event.data === 'undefined') return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = () => {
    setRecordingStatus('inactive');
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = async () => {
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      setAudioChunks([]);

      const file = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });

      setTranscriptionLoading(true);
      const transcription = await transcript(file);
      setMessages((messages) => {
        const newMessages = [
          ...messages,
          {
            role: 'user',
            content: transcription,
          },
        ];
        return newMessages;
      });
      setTranscriptionLoading(false);
    };
  };

  return (
    <div>
      {!permission && (
        <button
          className="button"
          onClick={getMicrophonePermission}
          type="button"
        >
          Enable microphone
        </button>
      )}
      {permission && recordingStatus === 'inactive' && (
        <button className="button" onClick={startRecording} type="button">
          Record your message
        </button>
      )}
      {recordingStatus === 'recording' && (
        <button className="button" onClick={stopRecording} type="button">
          Stop recording
        </button>
      )}
    </div>
  );
}
