import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import AudioRecorder from "~/components/AudioRecorder";
import getTranscription from "~/getTranscription.server";

export const meta: V2_MetaFunction = () => [{ title: "AI - Her" }];

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  console.log("IN ACTION", formData);
  const audio = formData.get("audio") as string;
  console.log("IN ACTION", audio);
  const res = getTranscription(audio);
  return res;
}

export default function Index() {
  const data = useActionData<typeof action>();
  console.log("data", data);
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-white">
      <AudioRecorder />
    </main>
  );
}
