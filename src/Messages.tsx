import * as React from 'react';
import { Loader } from './Loader';

export function Messages({ messages, transcriptionLoading, answerLoading }) {
  return (
    <div className="message-container">
      {messages.map(
        (message, index) =>
          message.role !== 'system' && (
            <span key={index} className={`message ${message.role}`}>{message.content}</span>
          )
      )}
      {transcriptionLoading && (
        <span className="message user">
          <Loader />
        </span>
      )}
      {answerLoading && (
        <span className="message assistant">
          <Loader />
        </span>
      )}
    </div>
  );
}
