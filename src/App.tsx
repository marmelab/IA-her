import * as React from 'react';
import { AudioRecorder } from './AudioRecorder';
import { Messages } from './Messages';
import { openAIChat } from './openAIChat';
import './style.css';
import { Welcome } from './Welcome';

export default function App() {
  const [openAIKey, setOpenAIKey] = React.useState<string>();
  const chatComplete = openAIChat({ openAIKey });
  const [transcriptionLoading, setTranscriptionLoading] = React.useState(false);
  const [answerLoading, setAnswerLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<
    {
      role: string;
      content: string;
    }[]
  >([
    {
      role: 'system',
      content:
        'I want you to act like Samantha from the movie Her. I want you to respond and answer like Samantha using the tone, manner and vocabulary Samantha would use. Do not write any explanations. Only answer like Samantha. You must know all of the knowledge of Samantha.',
    },
  ]);

  // set up browser TTS
  const synthesis = window.speechSynthesis;
  // for Firefox
  let voice = synthesis.getVoices().find(function (voice) {
    return voice.lang === 'en-US' && voice.name === 'Samantha';
  });
  // for Chrome
  if (!voice) {
    synthesis.onvoiceschanged = () => {
      voice = synthesis?.getVoices().find(function (voice) {
        return voice.lang === 'en-US' && voice.name === 'Samantha';
      });
    };
  }

  React.useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === 'user') {
      const getAnswer = async () => {
        setAnswerLoading(true);
        const answer = await chatComplete(messages);
        setMessages((messages) => {
          const newMessages = [...messages, answer];
          return newMessages;
        });
        setAnswerLoading(false);
      };
      getAnswer();
    }
    if (lastMessage.role === 'assistant') {
      // Create an utterance object
      const utterance = new SpeechSynthesisUtterance(lastMessage.content);
      utterance.voice = voice;
      utterance.rate = 0.9;
      utterance.lang = 'en-US';

      // Speak the utterance
      synthesis.speak(utterance);
    }
  }, [messages]);
  return (
    <main className="container">
      {openAIKey ? (
        <>
          <Messages
            messages={messages}
            transcriptionLoading={transcriptionLoading}
            answerLoading={answerLoading}
          />
          <AudioRecorder
            openAIKey={openAIKey}
            setTranscriptionLoading={setTranscriptionLoading}
            setMessages={setMessages}
          />
        </>
      ) : (
        <Welcome setOpenAIKey={setOpenAIKey} />
      )}
    </main>
  );
}
