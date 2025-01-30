import React, { useEffect, useRef, useState } from 'react';
import { Peer } from 'peerjs';
import { v4 as uuidv4 } from 'uuid';
import VideoPlayer from './components/VideoPlayer';
import MediaControls from './components/MediaControls';
import { createMockVideoStream, createMockScreenShare } from './utils/mockMedia';
import { peerConfig } from './utils/peerConfig';

const App = () => {
  const [roomId, setRoomId] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [joined, setJoined] = useState(false);
  const [peers, setPeers] = useState(new Map());
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);
  const [error, setError] = useState('');
  const [localStream, setLocalStream] = useState(null);
  
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const simulatedPeersRef = useRef([]);

  const initializeMedia = async () => {
    try {
      console.log('Initializing media...');
      const stream = createMockVideoStream('You');
      console.log('Mock stream created:', stream);
      
      localStreamRef.current = stream;
      setLocalStream(stream);
      setMediaReady(true);
      
      console.log('Media initialized successfully');
    } catch (err) {
      console.error('Media initialization error:', err);
      setError('Failed to initialize media stream');
    }
  };

  const initializePeer = async () => {
    try {
      const peer = new Peer(undefined, peerConfig);

      peer.on('open', (id) => {
        console.log('Secure connection established with ID:', id);
      });

      peer.on('connection', (conn) => {
        console.log('New encrypted connection established');
        setupSecureConnection(conn);
      });

      peerRef.current = peer;
    } catch (err) {
      console.error('Peer initialization error:', err);
      setError('Failed to establish secure connection');
    }
  };

  const setupSecureConnection = (conn) => {
    if (!conn.encrypted) {
      console.error('Connection is not encrypted');
      return;
    }

    conn.on('open', () => {
      console.log('Secure data channel established');
    });

    conn.on('error', (err) => {
      console.error('Connection error:', err);
      setError('Secure connection failed');
    });
  };

  const simulateNewAttendee = async () => {
    try {
      const currentIds = Array.from(peers.keys())
        .map(id => parseInt(id.replace('attendee-', '')))
        .filter(num => !isNaN(num));
      
      const nextNumber = currentIds.length > 0 ? Math.max(...currentIds) + 1 : 1;
      const attendeeId = `attendee-${nextNumber}`;
      
      const attendeeStream = createMockVideoStream(`Attendee ${nextNumber}`);
      
      setPeers(prev => new Map(prev.set(attendeeId, attendeeStream)));
      simulatedPeersRef.current.push({ id: attendeeId, stream: attendeeStream });
      
      console.log(`Added new attendee: ${attendeeId}`);
    } catch (err) {
      console.error('Failed to simulate attendee:', err);
      setError('Failed to add simulated attendee');
    }
  };

  const removeAttendee = (peerId) => {
    try {
      const peerToRemove = simulatedPeersRef.current.find(p => p.id === peerId);
      
      if (peerToRemove) {
        peerToRemove.stream.getTracks().forEach(track => track.stop());
      }
      
      simulatedPeersRef.current = simulatedPeersRef.current.filter(p => p.id !== peerId);
      
      setPeers(prev => {
        const newPeers = new Map(prev);
        newPeers.delete(peerId);
        return newPeers;
      });

      console.log(`Removed participant: ${peerId}`);
    } catch (err) {
      console.error('Failed to remove attendee:', err);
      setError('Failed to remove attendee');
    }
  };

  const createRoom = async () => {
    if (!mediaReady) {
      setError('Please wait for media initialization');
      return;
    }
    const newRoomId = uuidv4().substring(0, 8);
    setRoomId(newRoomId);
    setIsHost(true);
    setJoined(true);
    setError('');
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !audioEnabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !videoEnabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        if (screenStreamRef.current) {
          screenStreamRef.current.getTracks().forEach(track => track.stop());
        }
        screenStreamRef.current = null;
        setLocalStream(localStreamRef.current);
      } else {
        const screenStream = createMockScreenShare();
        screenStreamRef.current = screenStream;
        setLocalStream(screenStream);
      }
      setIsScreenSharing(!isScreenSharing);
    } catch (err) {
      console.error('Screen sharing error:', err);
      setError('Failed to toggle screen sharing');
    }
  };

  useEffect(() => {
    console.log('App mounted, initializing...');
    initializeMedia();
    initializePeer();
    
    return () => {
      console.log('Cleaning up...');
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      simulatedPeersRef.current.forEach(peer => {
        peer.stream.getTracks().forEach(track => track.stop());
      });
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, []);

  if (!joined) {
    return (
      <div className="container">
        <div className="join-form">
          <h1>Secure Video Chat</h1>
          {error && <div className="error-message">{error}</div>}
          <div style={{ marginBottom: '20px' }}>
            <button onClick={createRoom} disabled={!mediaReady}>
              {mediaReady ? '🚀 Create New Room' : '⌛ Waiting for initialization...'}
            </button>
          </div>
          <div className="join-input">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID"
            />
            <button onClick={() => {}} disabled={!mediaReady}>Join Room</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {error && <div className="error-message">{error}</div>}
      
      <div className="room-controls">
        <MediaControls
          audioEnabled={audioEnabled}
          videoEnabled={videoEnabled}
          isScreenSharing={isScreenSharing}
          onToggleAudio={toggleAudio}
          onToggleVideo={toggleVideo}
          onToggleScreenShare={toggleScreenShare}
        />
        <button className="add-attendee" onClick={simulateNewAttendee}>
          👥 Add Test Attendee
        </button>
        <div className="room-info">Room ID: {roomId}</div>
      </div>
      
      <div className={`video-grid participants-${peers.size + 1}`}>
        <VideoPlayer
          stream={localStream}
          isMuted={true}
          label={isScreenSharing ? 'Your Screen' : 'You'}
          isVideoEnabled={videoEnabled}
          isAudioEnabled={audioEnabled}
          isHost={isHost}
        />
        {Array.from(peers.entries()).map(([peerId, stream]) => (
          <VideoPlayer
            key={peerId}
            stream={stream}
            isMuted={true}
            label={peerId.replace('attendee-', 'Attendee ')}
            isVideoEnabled={true}
            isAudioEnabled={true}
            peerId={peerId}
            onRemove={removeAttendee}
            isHost={isHost}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
