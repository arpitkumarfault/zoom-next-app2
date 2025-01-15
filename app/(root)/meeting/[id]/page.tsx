"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import { Loader } from "lucide-react";

import { useGetCallById } from "@/hooks/useGetCallById";
import { Alert } from "@/components/ui/alert";
import MeetingSetup from "@/components/MeetingSetup";
import MeetingRoom from "@/components/MeetingRoom";
import "@stream-io/video-react-sdk/dist/css/styles.css";

const MeetingPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();

  // Always call hooks before any conditional returns
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  // Early return for invalid or missing `id` (before the hook)
  if (!id || Array.isArray(id)) {
    return (
      <p className="text-center text-3xl font-bold text-white">
        Invalid or missing meeting ID
      </p>
    );
  }

  // Call the hook unconditionally
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { call, isCallLoading } = useGetCallById(id);

  if (!isLoaded || isCallLoading) return <Loader />;

  if (!call)
    return (
      <p className="text-center text-3xl font-bold text-white">Call Not Found</p>
    );

  const notAllowed =
    call.type === "invited" &&
    (!user || !call.state.members.find((m) => m.user.id === user.id));

  if (notAllowed)
    return <Alert title="You are not allowed to join this meeting" />;

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default MeetingPage;
