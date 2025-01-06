'use client'
import { useGetCalls } from '@/hooks/useGetCall'
import { Call, CallRecording } from '@stream-io/video-react-sdk'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import MeetingCard from './MeetingCard'
import Loader from './Loader'

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
  const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();
  const router = useRouter();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const [isFetchingRecordings, setIsFetchingRecordings] = useState(false);

  const fetchRecordings = async () => {
    setIsFetchingRecordings(true);
    try {
      const callData = await Promise.all(callRecordings?.map((meeting) => meeting.queryRecordings()));
      const recordings = callData
        .filter((call) => call.recordings.length > 0)
        .flatMap((call) => call.recordings);
      setRecordings(recordings);
    } catch (error) {
      console.error('Error fetching recordings:', error);
    } finally {
      setIsFetchingRecordings(false);
    }
  };

  useEffect(() => {
    if (type === 'recordings') fetchRecordings();
  }, [type, callRecordings]);

  const getCalls = (): Call[] | CallRecording[] => {
    switch (type) {
      case 'ended':
        return endedCalls || [];
      case 'upcoming':
        return upcomingCalls || [];
      case 'recordings':
        return recordings;
      default:
        return [];
    }
  };

  const calls = getCalls();
  const noCallMessage = {
    ended: 'No Previous Calls',
    upcoming: 'No Upcoming Calls',
    recordings: 'No Recordings Found',
  }[type];

  if (isLoading || (type === 'recordings' && isFetchingRecordings)) return <Loader />;
  
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls.length > 0 ? (
        calls.map((meeting, index) => (
          <MeetingCard
            key={(meeting as Call)?.id || index}
            icon={`/icons/${type}.svg`}
            title={meeting?.state?.custom?.description?.substring(0, 20) || 'No description'}
            date={meeting?.state?.startAt?.toLocaleString() || 'Start time unavailable'}
            isPreviousMeeting={type === 'ended'}
            buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
            buttonText={type === 'recordings' ? 'Play' : 'Start'}
            handleClick={
              type === 'recordings'
                ? () => router.push(meeting.url)
                : () => router.push(`/meeting/${(meeting as Call)?.id}`)
            }
            link={
              type === 'recordings'
                ? meeting.url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call)?.id}`
            }
          />
        ))
      ) : (
        <h1 className="text-center text-gray-500">{noCallMessage}</h1>
      )}
    </div>
  );
};


export default CallList
