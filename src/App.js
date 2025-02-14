import './App.css';
import { useCallback, useEffect, useRef, useState } from 'react';

function App() {
  const videoRef = useRef(null);
  const [videos, setVideos] = useState([]);
  const [videoSrc, setVideoSrc] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);

  function isVideo (entry) {
    return true
  }

  const handleFileChange = useCallback(async (event) => {
    if (videos.length > 0) return
    const directoryHandle = await window.showDirectoryPicker();
    
    const _videos = []
    for await (const entry of directoryHandle.values()) {
      if (isVideo(entry)) _videos.push(await entry.getFile());
    }

    setVideos(_videos.sort(() => Math.random() - 0.5));
  }, [videos.length]);

  useEffect(() => {
    if (videos.length <= 0) return

    const videoUrl = URL.createObjectURL(videos[0]);
    setVideoSrc(videoUrl);
  }, [videos]);

  useEffect(() => {
    videoRef.current.load();
  }, [currentIdx, videoSrc])

  const handleSwitch = useCallback(async (idx) => {
    console.log(idx, currentIdx)
    if (idx === currentIdx) return

    setCurrentIdx(idx)
    setVideoSrc(URL.createObjectURL(videos[idx]));
  }, [currentIdx, videos]);

  const handleKeyDown = useCallback((event) => {
    console.log('clicked:', event.key);
    if (videoRef.current) {
      switch (event.key) {
        case 'a':
          videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
          break;
        case 'd':
          videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10);
          break;
        case 'q':
          break;
        case 'w':
          handleSwitch(Math.max(currentIdx - 1, 0));
          break;
        case 's':
          handleSwitch(Math.min(currentIdx + 1, videos.length - 1));
          break;
        default:
          break;
      }
    }
  }, [currentIdx, handleSwitch, videos.length])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div style={{textAlign: 'center'}}>
      <video onClick={handleFileChange} ref={videoRef} className="fixed-video" autoPlay controls>
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default App;
