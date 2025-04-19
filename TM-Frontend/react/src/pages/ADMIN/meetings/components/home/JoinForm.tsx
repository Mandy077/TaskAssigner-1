import { useState, FormEvent } from 'react';
import { Video, Users, Link2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface JoinFormProps {
  onJoin: (username: string, roomId: string) => void;
}

export function JoinForm({ onJoin }: JoinFormProps) {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onJoin(username, roomId);
  };

  const createNewMeeting = () => {
    const newRoomId = uuidv4().substring(0, 8);
    setRoomId(newRoomId);
    setIsCreating(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Video className="h-10 w-10 text-indigo-600" />
          <h1 className="ml-3 text-3xl font-bold text-gray-900">MeetSync</h1>
        </div>
        
        <div className="bg-white shadow-xl rounded-xl overflow-hidden transition-all duration-300 transform hover:shadow-2xl">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              {isCreating ? 'Start a new meeting' : 'Join a meeting'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-1">
                  Room ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="roomId"
                    type="text"
                    required
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter room ID"
                  />
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  {isCreating ? 'Start Meeting' : 'Join Meeting'}
                </button>
                
                {!isCreating && (
                  <button
                    type="button"
                    onClick={createNewMeeting}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    Create New Meeting
                  </button>
                )}
              </div>
            </form>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              By joining, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}