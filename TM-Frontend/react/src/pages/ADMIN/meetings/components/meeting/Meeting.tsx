import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Video } from './Video';
import { Controls } from './Controls';
import { Chat } from './Chat';
import { socketService } from '../../services/socketService';
import { usePeer } from '../../hooks/usePeer';
import { Participant, Message } from '../../types';

interface MeetingProps {
  username: string;
  roomId: string;
  onLeave: () => void;
}

export function Meeting({ username, roomId, onLeave }: MeetingProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [mediaPermissionDenied, setMediaPermissionDenied] = useState(false);
  
  const userId = useRef(uuidv4()).current;
  const { peersRef, createPeer, addPeer, destroyAllPeers } = usePeer({ stream, userId });

  useEffect(() => {
    // Initialize socket connection
    socketService.initialize();
    
    // Get user media
    const initializeMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
        setIsConnecting(false);
        setMediaPermissionDenied(false);
        
        // Join room after getting media stream
        socketService.joinRoom(roomId, userId, username);
        
        // Handle existing participants
        socketService.onRoomParticipants(participants => {
          participants.forEach(participant => {
            if (mediaStream) {
              // Create a peer for each existing participant
              const peer = createPeer(participant.socketId, socketService.getSocket().id, mediaStream);
              
              peersRef.current[participant.socketId] = {
                peer,
                username: participant.username
              };
            }
          });
          
          // Update participants state
          const newParticipants = participants.map(p => ({
            id: p.socketId,
            username: p.username,
            audioEnabled: true,
            videoEnabled: true,
            peer: peersRef.current[p.socketId]?.peer
          }));
          
          setParticipants(newParticipants);
        });
        
        // Handle new participant joining
        socketService.onUserJoined(participant => {
          console.log('User joined:', participant);
          
          if (mediaStream) {
            // Create a peer for the new participant
            const peer = addPeer(participant.socketId, socketService.getSocket().id, mediaStream);
            
            peersRef.current[participant.socketId] = {
              peer,
              username: participant.username
            };
            
            setParticipants(prev => [
              ...prev,
              {
                id: participant.socketId,
                username: participant.username,
                audioEnabled: true,
                videoEnabled: true,
                peer
              }
            ]);
          }
        });
        
        // Handle WebRTC signaling
        socketService.onSignal(({ from, signal }) => {
          if (peersRef.current[from]) {
            peersRef.current[from].peer.signal(signal);
          }
        });
        
        // Handle user leaving
        socketService.onUserLeft(({ socketId }) => {
          console.log('User left:', socketId);
          
          setParticipants(prev => prev.filter(p => p.id !== socketId));
          
          if (peersRef.current[socketId]) {
            peersRef.current[socketId].peer.destroy();
            const newPeers = { ...peersRef.current };
            delete newPeers[socketId];
            peersRef.current = newPeers;
          }
        });
        
        // Handle chat messages
        socketService.onNewMessage(message => {
          setMessages(prev => [
            ...prev, 
            {
              ...message,
              isOwn: message.sender === username
            }
          ]);
        });
        
        // Handle media toggles
        socketService.onUserToggleMedia(({ userId, type, status }) => {
          setParticipants(prev => 
            prev.map(p => p.id === userId 
              ? { ...p, [type === 'audio' ? 'audioEnabled' : 'videoEnabled']: status } 
              : p
            )
          );
        });
      } catch (error) {
        console.error('Error accessing media devices:', error);
        setIsConnecting(false);
        setMediaPermissionDenied(true);
      }
    };
    
    initializeMedia();
    
    // Cleanup
    return () => {
      socketService.leaveRoom(roomId);
      
      destroyAllPeers();
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      socketService.disconnect();
    };
  }, [roomId, username, userId]);
  
  // Retry accessing media devices
  const retryMediaAccess = async () => {
    setIsConnecting(true);
    setMediaPermissionDenied(false);
    
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      setIsConnecting(false);
      
      // Join room after getting media stream
      socketService.joinRoom(roomId, userId, username);
    } catch (error) {
      console.error('Error accessing media devices on retry:', error);
      setIsConnecting(false);
      setMediaPermissionDenied(true);
    }
  };
  
  // Toggle audio
  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !audioEnabled;
      });
      setAudioEnabled(!audioEnabled);
      
      // Notify other participants
      socketService.toggleMedia(roomId, 'audio', !audioEnabled);
    }
  };
  
  // Toggle video
  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !videoEnabled;
      });
      setVideoEnabled(!videoEnabled);
      
      // Notify other participants
      socketService.toggleMedia(roomId, 'video', !videoEnabled);
    }
  };
  
  // Share screen
  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true 
      });
      
      // Get the video track from the screen capture stream
      const videoTrack = screenStream.getVideoTracks()[0];
      
      // Replace track in all peer connections
      Object.values(peersRef.current).forEach(({ peer }) => {
        const senders = peer._pc.getSenders();
        const sender = senders.find((s: any) => s.track.kind === 'video');
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      });
      
      // Replace track in the local stream
      const oldVideoTrack = stream!.getVideoTracks()[0];
      stream!.removeTrack(oldVideoTrack);
      stream!.addTrack(videoTrack);
      
      // Set the video element's srcObject to the new stream
      setStream(stream);
      
      // Handle screen sharing stop event
      videoTrack.onended = () => {
        // Revert to camera
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(camStream => {
            const camVideoTrack = camStream.getVideoTracks()[0];
            
            // Replace track in all peer connections
            Object.values(peersRef.current).forEach(({ peer }) => {
              const senders = peer._pc.getSenders();
              const sender = senders.find((s: any) => s.track.kind === 'video');
              if (sender) {
                sender.replaceTrack(camVideoTrack);
              }
            });
            
            // Replace track in the local stream
            const screenVideoTrack = stream!.getVideoTracks()[0];
            stream!.removeTrack(screenVideoTrack);
            stream!.addTrack(camVideoTrack);
            
            // Set the video element's srcObject to the new stream
            setStream(stream);
          })
          .catch(err => console.error("Error reverting to camera", err));
      };
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };
  
  // Send message
  const sendMessage = (message: string) => {
    if (message.trim()) {
      socketService.sendMessage(roomId, message, username);
      
      // Add the message locally
      setMessages(prev => [
        ...prev,
        {
          sender: username,
          message,
          timestamp: Date.now(),
          isOwn: true
        }
      ]);
    }
  };
  
  // Handle room leave
  const handleLeaveRoom = () => {
    socketService.leaveRoom(roomId);
    
    // Stop all tracks
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    // Disconnect socket
    socketService.disconnect();
    
    // Destroy all peers
    destroyAllPeers();
    
    onLeave();
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="bg-white shadow-sm px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold text-gray-900">Room: {roomId}</h1>
        </div>
        <div className="text-sm font-medium text-gray-500">
          Participants: {participants.length + 1}
        </div>
      </header>
      
      <main className="flex-1 flex relative overflow-hidden p-4">
        {isConnecting ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Connecting to meeting...</p>
            </div>
          </div>
        ) : mediaPermissionDenied ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
              <div className="text-red-500 text-5xl mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Camera and Microphone Access Required</h2>
              <p className="text-gray-600 mb-4">
                To join the meeting, you need to allow access to your camera and microphone. 
                Please check your browser settings and allow the permissions.
              </p>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">How to enable permissions:</h3>
                <ol className="text-left text-gray-600 text-sm space-y-1">
                  <li>1. Click the camera icon in your browser's address bar</li>
                  <li>2. Select "Always allow" for camera and microphone</li>
                  <li>3. Refresh the page, or click the retry button below</li>
                </ol>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={retryMediaAccess}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Retry
                </button>
                <button 
                  onClick={handleLeaveRoom}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className={`flex-1 grid gap-4 ${isChatOpen ? 'mr-[320px]' : ''} transition-all duration-300`} 
              style={{
                gridTemplateColumns: `repeat(auto-fit, minmax(${participants.length > 2 ? '400px' : '500px'}, 1fr))`,
                gridAutoRows: `minmax(${participants.length > 4 ? '240px' : '300px'}, 1fr)`
              }}>
              {/* Your video */}
              {stream && (
                <div className="relative rounded-lg overflow-hidden shadow-lg transform transition-transform duration-200 hover:scale-[1.02]">
                  <Video 
                    stream={stream} 
                    muted={true} 
                    videoOff={!videoEnabled}
                    audioMuted={!audioEnabled}
                    username={username}
                    isLocal={true}
                  />
                </div>
              )}
              
              {/* Other participants */}
              {participants.map(participant => (
                <div 
                  key={participant.id} 
                  className="relative rounded-lg overflow-hidden shadow-lg transform transition-transform duration-200 hover:scale-[1.02]"
                >
                  <Video 
                    peer={participant.peer} 
                    username={participant.username}
                    audioMuted={!participant.audioEnabled}
                    videoOff={!participant.videoEnabled}
                  />
                </div>
              ))}
            </div>
            
            {/* Chat sidebar */}
            <div 
              className={`absolute top-0 right-0 h-full w-[320px] transform transition-transform duration-300 ease-in-out ${
                isChatOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              <div className="h-full p-4">
                <Chat 
                  messages={messages} 
                  onSendMessage={sendMessage}
                  onClose={toggleChat}
                />
              </div>
            </div>
          </>
        )}
      </main>
      
      <footer className="bg-white bg-opacity-80 backdrop-blur-sm p-4">
        <Controls 
          toggleAudio={toggleAudio}
          toggleVideo={toggleVideo}
          shareScreen={shareScreen}
          toggleChat={toggleChat}
          leaveRoom={handleLeaveRoom}
          audioEnabled={audioEnabled}
          videoEnabled={videoEnabled}
          isChatOpen={isChatOpen}
        />
      </footer>
    </div>
  );
}