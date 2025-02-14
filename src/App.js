import './App.css';
import { useCallback, useEffect, useRef, useState } from 'react';

function App() {
  const videoRef = useRef(null);
  const [videos, setVideos] = useState([]);
  const [videoSrc, setVideoSrc] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(-1);

  function isVideo (entry) {
    return true
  }

  const handleFileChange = useCallback(async (event) => {
    if (videos.length > 0) return;
    const directoryHandle = await window.showDirectoryPicker();
    
    const _videos = [];
    for await (const entry of directoryHandle.values()) {
      if (!isVideo(entry)) continue;
      const file = await entry.getFile();
      file._entry = entry;
      _videos.push(file);
    }

    setVideos(_videos.sort(() => Math.random() - 0.5));
  }, [videos.length]);

  useEffect(() => {
    videoRef.current.load();
  }, [currentIdx, videoSrc]);

  const handleSwitch = useCallback((str) => {
    let targetIdx = currentIdx;

    while (true) {
      targetIdx = str === 'w'
        ? Math.max(targetIdx - 1, 0)
        : Math.min(targetIdx + 1, videos.length - 1);
      if (targetIdx === currentIdx || targetIdx < 0) break;

      console.log('targetIdx:', targetIdx, currentIdx);

      const video = videos[targetIdx];
      if (video._deleted) continue;

      setCurrentIdx(targetIdx);
      const videoUrl = URL.createObjectURL(video);
      setVideoSrc(videoUrl);
      document.title = video.name;
      break;
    }
  }, [currentIdx, videos]);

  // useEffect(() => {
  //   if (videos.length <= 0) return

  //   handleSwitch('s');
  // }, [handleSwitch, videos]);

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
        case 'w':
          handleSwitch('w');
          break;
        case 'q':
          videos[currentIdx]._entry.remove();
          videos[currentIdx]._deleted = true;
        // eslint-disable-next-line no-fallthrough
        case 's':
          handleSwitch('s');
          break;
        default:
          break;
      }
    }
  }, [currentIdx, handleSwitch, videos]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div style={{ textAlign: 'center' }}>
      <video onClick={handleFileChange} ref={videoRef} className="fixed-video" autoPlay controls>
        {videoSrc && (
          <source src={videoSrc} type={videos[currentIdx]?.type || 'video/mp4'} />
        )}
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default App;
