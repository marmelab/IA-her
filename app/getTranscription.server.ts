import { Configuration, OpenAIApi } from "openai";
import { json } from "@remix-run/node";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (audio: string) {
  if (!configuration.apiKey) {
    return json(
      {
        error: {
          message:
            "OpenAI API key not configured, please follow instructions in README.md",
        },
      },
      {
        status: 500,
      }
    );
  }

  try {
    const blob = await fetch(audio).then((r) => r.blob());
    const file = new File([blob], "audio.webm", { type: "audio/webm" });

    const transcription = await openai.createTranscription(file, "whisper-1");
    return json(
      { result: transcription },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      return json(error.response.data, {
        status: error.response.status,
      });
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      return json(
        {
          error: {
            message: "An error occurred during your request.",
          },
        },
        {
          status: 500,
        }
      );
    }
  }
}
