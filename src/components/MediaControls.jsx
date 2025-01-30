import React from 'react';

const MediaControls = ({
  audioEnabled,
  videoEnabled,
  isScreenSharing,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare
}) => {
  return (
    <div className="media-controls">
      <button 
        className={`control-button ${!audioEnabled ? 'disabled' : ''}`}
        onClick={onToggleAudio}
        title={audioEnabled ? 'Mute Audio' : 'Unmute Audio'}
      >
        {audioEnabled ? '🎤' : '🔇'}
        <span className="button-text">
          {audioEnabled ? 'Mute' : 'Unmute'}
        </span>
      </button>

      <button 
        className={`control-button ${!videoEnabled ? 'disabled' : ''}`}
        onClick={onToggleVideo}
        title={videoEnabled ? 'Stop Video' : 'Start Video'}
      >
        {videoEnabled ? '📹' : '🚫'}
        <span className="button-text">
          {videoEnabled ? 'Stop Video' : 'Start Video'}
        </span>
      </button>

      <button 
        className={`control-button ${isScreenSharing ? 'sharing' : ''}`}
        onClick={onToggleScreenShare}
        title={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
      >
        {isScreenSharing ? '⏹️' : '🖥️'}
        <span className="button-text">
          {isScreenSharing ? 'Stop Share' : 'Share Screen'}
        </span>
      </button>
    </div>
  );
};

export default MediaControls;
