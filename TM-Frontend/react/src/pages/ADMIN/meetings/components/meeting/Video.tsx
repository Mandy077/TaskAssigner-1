import { useRef, useEffect } from 'react';
import { Camera, MicOff } from 'lucide-react';

interface VideoProps {
  stream?: MediaStream;
  peer?: any;
  muted?: boolean;
  audioMuted?: boolean;
  videoOff?: boolean;
  username?: string;
  isLocal?: boolean;
}

export function Video({ 
  stream, 
  peer, 
  muted = false, 
  audioMuted = false, 
  videoOff = false,
  username,
  isLocal = false
}: VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (peer && videoRef.current) {
      peer.on('stream', (stream: MediaStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });
    }
  }, [peer]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-900">
      {videoOff ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="flex flex-col items-center text-white">
            <Camera className="h-12 w-12 text-gray-500 mb-2" />
            <span className="text-sm text-gray-400">Video off</span>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          className="w-full h-full object-cover"
        />
      )}

      {audioMuted && (
        <div className="absolute top-3 right-3 bg-red-500 rounded-full p-1.5">
          <MicOff className="h-4 w-4 text-white" />
        </div>
      )}

      <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
        {isLocal ? `You${username ? ` (${username})` : ''}` : username}
      </div>

      {isLocal && (
        <div className="absolute top-3 left-3 bg-blue-500 bg-opacity-75 px-2 py-0.5 rounded text-xs text-white">
          You
        </div>
      )}
    </div>
  );
}