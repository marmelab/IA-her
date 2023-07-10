import * as React from 'react';

export function Welcome({ setOpenAIKey }) {
  const inputRef = React.useRef(null);
  const handleSubmit = () => {
    const key = inputRef.current.value;
    if (!key) return;
    setOpenAIKey(key);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Chat with the AI from the movie "Her"</h1>
        <p>Enter your OpenAI API Key</p>
        <div className="openaikey-form">
        <input name="openai_key" ref={inputRef} size={53} />
        <input type="submit" value="Send" className="button" />
        </div>
        <p style={{ color: 'grey', fontSize: '0.8em' }}>
          Don't be afraid, it's only sent from your browser to the OpenAI API
        </p>
      </form>
    </div>
  );
}