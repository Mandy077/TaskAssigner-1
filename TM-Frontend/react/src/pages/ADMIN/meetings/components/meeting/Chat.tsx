import { useState, useRef, useEffect, FormEvent } from 'react';
import { Send, X } from 'lucide-react';
import { Message } from '../../types';

interface ChatProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onClose: () => void;
}

export function Chat({ messages, onSendMessage, onClose }: ChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Meeting Chat</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm">No messages yet</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`max-w-[85%] ${msg.isOwn ? 'ml-auto' : 'mr-auto'}`}
            >
              <div 
                className={`rounded-lg px-4 py-2 inline-block ${
                  msg.isOwn 
                    ? 'bg-indigo-100 text-indigo-900' 
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {!msg.isOwn && (
                  <span className="block text-xs font-medium text-gray-700 mb-1">
                    {msg.sender}
                  </span>
                )}
                <p className="text-sm">{msg.message}</p>
              </div>
              <div 
                className={`text-xs text-gray-500 mt-1 ${
                  msg.isOwn ? 'text-right' : 'text-left'
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm border-gray-300 px-3 py-2"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className={`ml-3 inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            newMessage.trim() 
              ? 'bg-indigo-600 hover:bg-indigo-700' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}