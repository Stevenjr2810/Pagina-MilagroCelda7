import React, { useRef, useState, useEffect } from 'react';

export default function SimpleAudioPlayer({ src, title, description }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    
    if (!audio) return;
    
    const setAudioData = () => {
      setDuration(audio.duration);
    };
    
    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };
    
    // Add event listeners
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    
    // Cleanup
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, []);
  
  const togglePlay = () => {
    const audio = audioRef.current;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const handleTimeChange = (e) => {
    const audio = audioRef.current;
    audio.currentTime = e.target.value;
    setCurrentTime(e.target.value);
  };
  
  // Format time in MM:SS
  const formatTime = (time) => {
    if (isNaN(time)) return '00:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="bg-gray-800 text-white rounded-lg p-6 shadow-lg w-full max-w-xl">
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="mb-4 text-gray-300">{description}</p>
      
      <audio ref={audioRef} src={src} preload="metadata"></audio>
      
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-4">
          <button 
            onClick={togglePlay}
            className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center focus:outline-none"
          >
            {isPlaying ? (
              <span className="block w-3 h-3 bg-white"></span>
            ) : (
              <span className="block border-l-8 border-t-4 border-b-4 border-white border-t-transparent border-b-transparent ml-1"></span>
            )}
          </button>
          
          <div className="text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
        
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleTimeChange}
          className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
}