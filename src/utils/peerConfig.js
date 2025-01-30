export const peerConfig = {
  config: {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302',
        username: '',
        credential: ''
      }
    ],
    iceTransportPolicy: 'all',
    encodedInsertableStreams: true,
    sdpSemantics: 'unified-plan'
  },
  secure: true,
  host: '0.peerjs.com',
  port: 443,
  debug: 2
};
