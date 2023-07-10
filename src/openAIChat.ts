const DEFAULT_PARAMS = {
  model: 'gpt-3.5-turbo',
  temperature: 0.6,
  max_tokens: 256,
};

export function openAIChat({ openAIKey }) {
  return async function query(messages) {
    const params = { ...DEFAULT_PARAMS, messages };

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + String(openAIKey),
      },
      body: JSON.stringify(params),
    };
    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      requestOptions
    );
    const data = await response.json();
    const completion = data.choices[0].message;
    return completion;
  };
}
