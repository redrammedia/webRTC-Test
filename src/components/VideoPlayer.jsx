import React, { useEffect, useRef } from 'react';

const VideoPlayer = ({ 
  stream, 
  isMuted, 
  label, 
  isVideoEnabled = true, 
  isAudioEnabled = true,
  peerId,
  onRemove,
  isHost
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && stream) {
      console.log('Setting stream to video element:', stream);
      videoElement.srcObject = stream;
      
      const playVideo = async () => {
        try {
          await videoElement.play();
          console.log('Video playing successfully');
        } catch (err) {
          console.error('Error playing video:', err);
        }
      };

      videoElement.onloadedmetadata = () => {
        console.log('Video metadata loaded');
        playVideo();
      };
    }

    return () => {
      if (videoElement) {
        videoElement.srcObject = null;
      }
    };
  }, [stream]);

  return (
    <div className="video-container">
      {isHost && peerId && (
        <button 
          className="remove-participant" 
          onClick={() => onRemove(peerId)}
          title="Remove participant"
        >
          ×
        </button>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isMuted}
      />
      <div className="video-overlay">
        <div className="video-label">{label}</div>
        <div className="video-status-indicators">
          {!isAudioEnabled && (
            <div className="status-indicator">
              <span className="status-icon">🔇</span>
            </div>
          )}
          {!isVideoEnabled && (
            <div className="status-indicator">
              <span className="status-icon">🚫</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
