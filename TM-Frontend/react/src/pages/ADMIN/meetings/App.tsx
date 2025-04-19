import { useState } from 'react';
import { JoinForm } from './components/home/JoinForm';
import { Meeting } from './components/meeting/Meeting';

function App() {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [joined, setJoined] = useState(false);

  const handleJoinRoom = (username: string, roomId: string) => {
    if (username && roomId) {
      setUsername(username);
      setRoomId(roomId);
      setJoined(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      {!joined ? (
        <JoinForm onJoin={handleJoinRoom} />
      ) : (
        <Meeting username={username} roomId={roomId} onLeave={() => setJoined(false)} />
      )}
    </div>
  );
}

export default App;