export function openAITranscription({ openAIKey }) {
  return async function query(audio) {
    const formData = new FormData();
    formData.append('file', audio);
    formData.append('model', 'whisper-1');

    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + String(openAIKey),
      },
      body: formData,
    };
    const response = await fetch(
      'https://api.openai.com/v1/audio/transcriptions',
      requestOptions
    );
    const { text } = await response.json();
    return text;
  };
}
