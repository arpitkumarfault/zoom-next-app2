'use client'

import { DeviceSettings, useCall, VideoPreview } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'

const MeetingSetup = ({ setIsSetupComplete }: { setIsSetupComplete: (value: boolean) => void }) => {
  const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false)
  const call = useCall()
  if (!call) {
    throw new Error('useCall must be used inside StreamCall component')
  }

  useEffect(() => {
    if (isMicCamToggledOn) {
      call?.camera.disable()
      call?.microphone.disable()
    } else {
      call?.camera.enable()
      call?.microphone.enable()
    }
  }, [isMicCamToggledOn, call?.camera, call?.microphone])
  return (
    <>
      <div className="flex flex-col items-center gap-3 text-white font-bold justify-center w-full h-screen">
        <h1 className="text-3xl font-bold">Meeting Setup</h1>
        <VideoPreview />
        <div className="flex h-16 justify-center items-center gap-3">
          <label className="flex items-center justify-center gap-2 font-medium">
            <input
              type="checkbox"
              checked={isMicCamToggledOn}
              onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
            />
            Join with mic and camera off
          </label>
          <DeviceSettings />
        </div>
        <Button
          className="rounded-md bg-green-500 px-4 py-2.5 w-40 h-36"
          onClick={() => {
            call.join()
            setIsSetupComplete(true)
          }}
         title = "join meeting"
        />
      </div>
    </>
  )
}

export default MeetingSetup
