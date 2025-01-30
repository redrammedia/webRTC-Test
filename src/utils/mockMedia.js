const createMockVideoStream = (label = 'Mock Stream') => {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  
  let animationId;
  const animate = () => {
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#4CAF50');
    gradient.addColorStop(1, '#2196F3');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add timestamp
    const time = new Date().toLocaleTimeString();
    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'right';
    ctx.fillText(time, canvas.width - 20, 40);
    
    // Add label
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(label, canvas.width/2, canvas.height/2);
    
    // Add moving circle
    const seconds = Date.now() / 1000;
    const x = canvas.width/2 + Math.cos(seconds * 2) * 100;
    const y = canvas.height/2 + Math.sin(seconds * 2) * 100;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    
    animationId = requestAnimationFrame(animate);
  };
  
  animate();
  
  const stream = canvas.captureStream(30); // 30 FPS
  
  // Add cleanup method
  stream.stop = () => {
    cancelAnimationFrame(animationId);
  };
  
  return stream;
};

const createMockScreenShare = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext('2d');
  
  let animationId;
  const animate = () => {
    // Blue background
    ctx.fillStyle = '#2196F3';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some "windows"
    const windows = [
      { x: 50, y: 50, width: 400, height: 300 },
      { x: 500, y: 100, width: 600, height: 400 },
      { x: 100, y: 400, width: 300, height: 200 }
    ];
    
    windows.forEach((win, i) => {
      // Window background
      ctx.fillStyle = 'white';
      ctx.fillRect(win.x, win.y, win.width, win.height);
      
      // Window title bar
      ctx.fillStyle = '#e0e0e0';
      ctx.fillRect(win.x, win.y, win.width, 30);
      
      // Window content
      ctx.fillStyle = '#333';
      ctx.font = '16px Arial';
      ctx.fillText(`Window ${i + 1}`, win.x + 10, win.y + 20);
    });
    
    // Add timestamp
    const time = new Date().toLocaleTimeString();
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'right';
    ctx.fillText(`Screen Share - ${time}`, canvas.width - 20, canvas.height - 20);
    
    animationId = requestAnimationFrame(animate);
  };
  
  animate();
  
  const stream = canvas.captureStream(30);
  
  // Add cleanup method
  stream.stop = () => {
    cancelAnimationFrame(animationId);
  };
  
  return stream;
};

export { createMockVideoStream, createMockScreenShare };
