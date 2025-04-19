import { Mic, MicOff, Video as VideoIcon, VideoOff, ScreenShare, MessageSquare, PhoneOff } from 'lucide-react';

interface ControlsProps {
  toggleAudio: () => void;
  toggleVideo: () => void;
  shareScreen: () => void;
  toggleChat: () => void;
  leaveRoom: () => void;
  audioEnabled: boolean;
  videoEnabled: boolean;
  isChatOpen: boolean;
}

export function Controls({
  toggleAudio,
  toggleVideo,
  shareScreen,
  toggleChat,
  leaveRoom,
  audioEnabled,
  videoEnabled,
  isChatOpen
}: ControlsProps) {
  return (
    <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-3 flex items-center justify-center space-x-4 w-fit mx-auto">
      <button
        onClick={toggleAudio}
        className={`control-btn ${audioEnabled ? 'bg-gray-100 hover:bg-gray-200' : 'bg-red-100 text-red-500 hover:bg-red-200'} transition-colors`}
        title={audioEnabled ? 'Mute' : 'Unmute'}
      >
        {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
      </button>
      
      <button
        onClick={toggleVideo}
        className={`control-btn ${videoEnabled ? 'bg-gray-100 hover:bg-gray-200' : 'bg-red-100 text-red-500 hover:bg-red-200'} transition-colors`}
        title={videoEnabled ? 'Turn Off Video' : 'Turn On Video'}
      >
        {videoEnabled ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
      </button>
      
      <button
        onClick={shareScreen}
        className="control-btn bg-gray-100 hover:bg-gray-200 transition-colors"
        title="Share Screen"
      >
        <ScreenShare className="h-5 w-5" />
      </button>
      
      <button
        onClick={toggleChat}
        className={`control-btn ${isChatOpen ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
        title={isChatOpen ? 'Close Chat' : 'Open Chat'}
      >
        <MessageSquare className="h-5 w-5" />
      </button>
      
      <button
        onClick={leaveRoom}
        className="control-btn bg-red-500 hover:bg-red-600 text-white transition-colors"
        title="Leave Meeting"
      >
        <PhoneOff className="h-5 w-5" />
      </button>
    </div>
  );
}