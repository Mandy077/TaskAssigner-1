import { useRef, useEffect } from 'react';
import Peer from 'simple-peer';
import { socketService } from '../services/socketService';

interface UsePeerProps {
  stream: MediaStream | null;
  userId: string;
}

export const usePeer = ({ stream, userId }: UsePeerProps) => {
  const peersRef = useRef<Record<string, { peer: Peer.Instance; username: string }>>({});

  const createPeer = (targetId: string, callerId: string, stream: MediaStream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream
    });
    
    peer.on('signal', signal => {
      socketService.sendSignal(targetId, callerId, signal);
    });
    
    return peer;
  };
  
  const addPeer = (callerId: string, targetId: string, stream: MediaStream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream
    });
    
    peer.on('signal', signal => {
      socketService.sendSignal(callerId, targetId, signal);
    });
    
    return peer;
  };

  const destroyPeer = (peerId: string) => {
    if (peersRef.current[peerId]) {
      peersRef.current[peerId].peer.destroy();
      const newPeers = { ...peersRef.current };
      delete newPeers[peerId];
      peersRef.current = newPeers;
    }
  };

  const destroyAllPeers = () => {
    Object.values(peersRef.current).forEach(({ peer }) => {
      peer.destroy();
    });
    peersRef.current = {};
  };

  return {
    peersRef,
    createPeer,
    addPeer,
    destroyPeer,
    destroyAllPeers
  };
};