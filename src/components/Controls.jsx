import React from 'react';

const Controls = ({ 
  audioEnabled, 
  videoEnabled, 
  isHost, 
  roomId, 
  onToggleAudio, 
  onToggleVideo, 
  onSimulateNewAttendee,
  onLeaveRoom 
}) => {
  return (
    <div className="controls">
      <button 
        onClick={onToggleAudio}
        className={!audioEnabled ? 'danger' : ''}
      >
        {audioEnabled ? '🎤 Mute' : '🔇 Unmute'}
      </button>
      
      <button 
        onClick={onToggleVideo}
        className={!videoEnabled ? 'danger' : ''}
      >
        {videoEnabled ? '📹 Stop Video' : '🎥 Start Video'}
      </button>

      {isHost && (
        <>
          <div className="room-info">
            Room ID: <strong>{roomId}</strong>
            <button className="copy-button" onClick={() => navigator.clipboard.writeText(roomId)}>
              📋 Copy
            </button>
          </div>
          <button onClick={onSimulateNewAttendee} className="simulate">
            👥 Add Test User
          </button>
        </>
      )}

      <button onClick={onLeaveRoom} className="danger leave">
        ❌ Leave Room
      </button>
    </div>
  );
};

export default Controls;
