import './App.css';
import { useCallback, useEffect, useRef, useState } from 'react';

function App() {
  const videoRef = useRef(null);
  const [videos, setVideos] = useState([]);
  const [videoSrc, setVideoSrc] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleFileChange = (event) => {
    const files = event.target.files;

    console.log(files)

    const file = files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

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
          const idx1 = Math.max(currentVideoIndex - 1, 0)
          setCurrentVideoIndex(idx1);
          videoRef.current.src = videos[idx1];
          videoRef.current.play();
          break;
        case 's':
          const idx2 = Math.min(currentVideoIndex + 1, videos.length - 1)
          setCurrentVideoIndex(idx2);
          videoRef.current.src = videos[idx2];
          videoRef.current.play();
          break;
        case 'q':
          break;
        default:
          break;
      }
    }
  }, [currentVideoIndex, videos])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const deleteFile = useCallback(async () => {
    const [fileHandle] = await window.showOpenFilePicker();
    if (!fileHandle) return
    // await fileHandle.remove();
    await fileHandle.remove();
    console.log('File deleted successfully');
  }, [])

  return (
    <div style={{textAlign: 'center'}}>
      <button onClick={deleteFile}>删除文件</button>

      <input type="file" webkitdirectory="true" onChange={handleFileChange} />

      <video ref={videoRef} width="100%"  controls>
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default App;
