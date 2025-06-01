'use client';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Song {
  title: string;
  artist: string;
  url: string;
  coverImage: string;
}

interface AudioVisualizerProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

// 为 WebKit AudioContext 添加类型声明
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

// 创建一个全局的 AudioContext 和 MediaElementSource 管理器
const audioContextManager = {
  context: null as AudioContext | null,
  source: null as MediaElementAudioSourceNode | null,
  analyser: null as AnalyserNode | null,
  initialize(audio: HTMLAudioElement) {
    if (!this.context) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.context = new AudioContextClass();
    }
    if (!this.source) {
      this.source = this.context.createMediaElementSource(audio);
    }
    if (!this.analyser) {
      this.analyser = this.context.createAnalyser();
      this.analyser.fftSize = 256;
      this.source.connect(this.analyser);
      this.analyser.connect(this.context.destination);
    }
    return {
      context: this.context,
      source: this.source,
      analyser: this.analyser
    };
  },
  cleanup() {
    if (this.analyser) {
      this.analyser.disconnect();
      this.analyser = null;
    }
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.context) {
      this.context.close();
      this.context = null;
    }
  }
};

// 音频可视化组件
function AudioVisualizer({ audioRef }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | undefined>(undefined);
  const lastDrawTime = useRef<number>(0);
  const FRAME_INTERVAL = 50; // 限制为每秒20帧

  useEffect(() => {
    if (!audioRef.current || !canvasRef.current) return;

    const audio = audioRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let analyserNode: AnalyserNode | null = null;

    const initAudio = () => {
      try {
        const { analyser } = audioContextManager.initialize(audio);
        analyserNode = analyser;
      } catch (error) {
        console.error('Error initializing audio:', error);
      }
    };

    initAudio();

    if (!analyserNode) return;

    const analyser = analyserNode as AnalyserNode;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = (timestamp: number) => {
      if (!canvas || !ctx || !analyser) return;

      // 限制帧率
      if (timestamp - lastDrawTime.current < FRAME_INTERVAL) {
        animationFrameId.current = requestAnimationFrame(draw);
        return;
      }

      lastDrawTime.current = timestamp;

      const width = canvas.width;
      const height = canvas.height;
      const barWidth = width / bufferLength * 2.5;
      
      analyser.getByteFrequencyData(dataArray);
      
      ctx.clearRect(0, 0, width, height);
      
      // 优化渲染性能
      ctx.beginPath();
      dataArray.forEach((value, index) => {
        const barHeight = (value / 255) * height * 0.8;
        const x = index * barWidth;
        const hue = ((index / bufferLength) * 360) + ((Date.now() / 100) % 360); // 降低颜色变化速度
        
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.5)`; // 降低透明度
        ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);
      });
      ctx.fill();

      animationFrameId.current = requestAnimationFrame(draw);
    };

    draw(0);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [audioRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-30" // 降低整体不透明度
      width={400} // 降低canvas分辨率
      height={200}
    />
  );
}

// 添加播放模式类型
type PlayMode = 'sequential' | 'random' | 'single';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullyExpanded, setIsFullyExpanded] = useState(false);
  const [volume, setVolume] = useState(0.1);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playMode, setPlayMode] = useState<PlayMode>('sequential');
  const audioRef = useRef<HTMLAudioElement>(null);

  // 使用 useMemo 缓存播放列表
  const playlist: Song[] = useMemo(() => [
    {
      title: 'Under Bright Lights (ft. Indy Skies)',
      artist: 'TWERL & Ekko & Sidetrack',
      url: '/music/song1.mp3',
      coverImage: '/images/cover1.jpg',
    },
    {
      title: 'Bring Me Back',
      artist: 'zekk',
      url: '/music/song2.mp3',
      coverImage: '/images/cover2.jpg',
    },
    {
      title: 'Highscore',
      artist: 'Teminite & Panda Eyes',
      url: '/music/song3.mp3',
      coverImage: '/images/cover3.jpg',
    },
    {
      title: 'AbsoluTe disoRdeR',
      artist: 'Acute Disarray',
      url: '/music/song4.mp3',
      coverImage: '/images/cover4.png',
    },
    {
      title: 'I Really Want to Stay at Your House',
      artist: 'Samuel Kim Lorien',
      url: '/music/song5.mp3',
      coverImage: '/images/cover5.jpg',
    },
    {
      title: 'All Night',
      artist: 'KILL SCRIPT',
      url: '/music/song6.mp3',
      coverImage: '/images/cover6.jpg',
    },
    {
      title: 'Make U SWEAT!',
      artist: 'Knock2',
      url: '/music/song7.mp3',
      coverImage: '/images/cover7.jpg',
    },
    {
      title: 'THE SIXTH SENSE',
      artist: 'Reol',
      url: '/music/song8.mp3',
      coverImage: '/images/cover8.jpg',
    },
  ], []);

  // 使用 useCallback 缓存函数
  const togglePlay = useCallback(async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          await audioRef.current.pause();
        } else {
          await audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error('播放出错:', error);
      }
    }
  }, [isPlaying]);

  const getNextSongIndex = useCallback(() => {
    switch (playMode) {
      case 'sequential':
        return (currentSongIndex + 1) % playlist.length;
      case 'random':
        // 避免随机到当前歌曲
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * playlist.length);
        } while (nextIndex === currentSongIndex && playlist.length > 1);
        return nextIndex;
      case 'single':
        return currentSongIndex;
    }
  }, [currentSongIndex, playMode, playlist.length]);

  // 处理播放模式切换
  const handlePlayModeChange = useCallback(() => {
    setPlayMode(current => {
      const newMode = current === 'sequential' ? 'random' : current === 'random' ? 'single' : 'sequential';
      // 切换模式时不改变当前播放状态
      return newMode;
    });
  }, []);

  const playNext = useCallback(() => {
    setCurrentSongIndex(getNextSongIndex());
  }, [getNextSongIndex]);

  const playPrev = useCallback(() => {
    setCurrentSongIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  }, [playlist.length]);

  // 格式化时间
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // 处理进度条拖动
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // 监听音频时间更新
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, []);

  // 修复 useEffect 依赖
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      // 设置音频属性
      audio.src = playlist[currentSongIndex].url;
      audio.volume = volume;
      setIsLoading(true);

      const handleCanPlay = () => {
        setIsLoading(false);
        if (isPlaying) {
          audio.play()
            .catch(error => {
              console.error('播放出错:', error);
              setIsPlaying(false);
            });
        }
      };

      const handleEnded = () => {
        playNext();
      };

      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [currentSongIndex, isPlaying, playNext, playlist, volume]);

  // 监听音量变化
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // 监听播放状态变化
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      if (isPlaying) {
        audio.play().catch(error => {
          console.error('播放出错:', error);
          setIsPlaying(false);
        });
      } else {
        audio.pause();
      }
    }
  }, [isPlaying, volume, playlist, playNext]);

  // 组件卸载时清理音频上下文
  useEffect(() => {
    return () => {
      audioContextManager.cleanup();
    };
  }, []);

  // 修复键盘快捷键 useEffect 依赖
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isFullyExpanded) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          playPrev();
          break;
        case 'ArrowRight':
          playNext();
          break;
        case 'ArrowUp':
          if (audioRef.current && volume < 1) {
            setVolume(prev => Math.min(prev + 0.1, 1));
          }
          break;
        case 'ArrowDown':
          if (audioRef.current && volume > 0) {
            setVolume(prev => Math.max(prev - 0.1, 0));
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullyExpanded, volume, togglePlay, playNext, playPrev]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  // 处理全屏模式的打开
  const handleOpenFullScreen = () => {
    setIsFullyExpanded(true);
    setIsExpanded(true);
  };

  // 处理全屏模式的关闭
  const handleCloseFullScreen = () => {
    setIsFullyExpanded(false);
  };

  return (
    <>
      {/* 全屏遮罩 */}
      <AnimatePresence mode="wait">
        {isFullyExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={handleCloseFullScreen}
          />
        )}
      </AnimatePresence>

      {/* 音乐播放器 */}
      <motion.div
        initial={false}
        animate={{ 
          x: isFullyExpanded ? '-50%' : 0,
          y: isFullyExpanded ? '-50%' : 0,
          scale: 1,
          transition: { type: "spring", stiffness: 50 }
        }}
        className={`fixed z-50 ${
          isFullyExpanded 
            ? 'top-1/2 left-1/2' 
            : 'bottom-8 right-8'
        }`}
      >
        <motion.div
          className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg ${
            isFullyExpanded ? 'w-[800px] h-[600px]' : 'p-4'
          }`}
          initial={false}
        >
          {isFullyExpanded ? (
            <div className="relative w-full h-full p-8">
              <AudioVisualizer audioRef={audioRef} />
              
              <div className="relative z-10 flex h-full">
                {/* 左侧：封面和主控制区 */}
                <div className="flex-1 flex flex-col items-center justify-center">
                  <motion.div
                    className="relative w-80 h-80 rounded-full overflow-hidden mb-8"
                    animate={{
                      rotate: isPlaying ? 360 : 0
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                      repeatType: "loop"
                    }}
                  >
                    <Image
                      src={playlist[currentSongIndex].coverImage}
                      alt="Album Cover"
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">
                      {playlist[currentSongIndex].title}
                    </h2>
                    <p className="text-xl text-gray-600 mt-2">
                      {playlist[currentSongIndex].artist}
                    </p>
                  </div>
                </div>

                {/* 右侧：播放列表和控制面板 */}
                <div className="w-72 border-l border-gray-200 p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">播放列表</h3>
                    <button
                      onClick={handlePlayModeChange}
                      className="p-2 hover:text-blue-600 tooltip"
                      title={playMode === 'sequential' ? '顺序播放' : playMode === 'random' ? '随机播放' : '单曲循环'}
                    >
                      {playMode === 'sequential' ? (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v7h7M4 11l7-7M20 20v-7h-7m7 7l-7-7"/>
                        </svg>
                      ) : playMode === 'random' ? (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 3h5v5M4 20L21 3M21 16v5h-5M4 4l5 5m6 6l5 5"/>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v7h7M4 11l7-7m-7 10v-3"/>
                        </svg>
                      )}
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {playlist.map((song, index) => (
                      <motion.div
                        key={index}
                        className={`flex items-center p-2 rounded-lg cursor-pointer ${
                          currentSongIndex === index ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          setCurrentSongIndex(index);
                          setIsPlaying(true);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="w-10 h-10 relative rounded-md overflow-hidden mr-3">
                          <Image
                            src={song.coverImage}
                            alt={song.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {song.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {song.artist}
                          </p>
                        </div>
                        {currentSongIndex === index && isPlaying && (
                          <div className="w-4 h-4 ml-2">
                            <motion.div
                              className="w-1 h-4 bg-blue-600 inline-block mx-[1px]"
                              animate={{ scaleY: [1, 1.5, 1] }}
                              transition={{
                                repeat: Infinity,
                                duration: 1,
                                ease: "easeInOut"
                              }}
                            />
                            <motion.div
                              className="w-1 h-4 bg-blue-600 inline-block mx-[1px]"
                              animate={{ scaleY: [1, 2, 1] }}
                              transition={{
                                repeat: Infinity,
                                duration: 0.8,
                                ease: "easeInOut",
                                delay: 0.2
                              }}
                            />
                            <motion.div
                              className="w-1 h-4 bg-blue-600 inline-block mx-[1px]"
                              animate={{ scaleY: [1, 1.5, 1] }}
                              transition={{
                                repeat: Infinity,
                                duration: 0.6,
                                ease: "easeInOut",
                                delay: 0.4
                              }}
                            />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 space-y-4">
                    {/* 进度条 */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleProgressChange}
                        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        style={{
                          background: `linear-gradient(to right, #2563eb ${(currentTime / duration) * 100}%, #d1d5db ${(currentTime / duration) * 100}%)`
                        }}
                      />
                    </div>

                    {/* 控制按钮 */}
                    <div className="flex items-center justify-center space-x-4">
                      <motion.button
                        onClick={playPrev}
                        className="p-2 hover:text-blue-600"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={isLoading}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                          />
                        </svg>
                      </motion.button>

                      <motion.button
                        onClick={togglePlay}
                        className="p-3 hover:text-blue-600"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={isLoading}
                      >
                        {isPlaying ? (
                          <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </motion.button>

                      <motion.button
                        onClick={playNext}
                        className="p-2 hover:text-blue-600"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={isLoading}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 5l7 7-7 7M5 5l7 7-7 7"
                          />
                        </svg>
                      </motion.button>
                    </div>

                    {/* 音量控制 */}
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18l-4-4H4a1 1 0 01-1-1V11a1 1 0 011-1h4l4-4v12z"
                        />
                      </svg>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #2563eb ${volume * 100}%, #d1d5db ${volume * 100}%)`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 关闭按钮 */}
              <motion.button
                onClick={handleCloseFullScreen}
                className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            </div>
          ) : (
            // 原始/一级展开界面
            <div className="flex items-center space-x-4">
              <motion.div
                className="relative w-10 h-10 rounded-full overflow-hidden cursor-pointer group"
                animate={{
                  rotate: isPlaying ? 360 : 0
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop"
                }}
                onClick={handleClick}
              >
                <Image
                  src={playlist[currentSongIndex].coverImage}
                  alt="Album Cover"
                  fill
                  className="object-cover"
                />
                {/* 悬浮提示 */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-xs font-medium"
                >
                  {isExpanded ? '点击收起' : '点击展开'}
                </motion.div>
              </motion.div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-4 overflow-hidden">
                      <div className="min-w-[200px]">
                        <p className="font-medium text-gray-900">
                          {playlist[currentSongIndex].title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {playlist[currentSongIndex].artist}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={playPrev}
                          className="p-2 hover:text-blue-600"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          disabled={isLoading}
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                            />
                          </svg>
                        </motion.button>

                        <motion.button
                          onClick={togglePlay}
                          className="p-2 hover:text-blue-600"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          disabled={isLoading}
                        >
                          {isPlaying ? (
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          )}
                        </motion.button>

                        <motion.button
                          onClick={playNext}
                          className="p-2 hover:text-blue-600"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          disabled={isLoading}
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 5l7 7-7 7M5 5l7 7-7 7"
                            />
                          </svg>
                        </motion.button>

                        {/* 添加展开按钮 */}
                        <motion.button
                          onClick={handleOpenFullScreen}
                          className="p-2 hover:text-blue-600"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                            />
                          </svg>
                        </motion.button>
                      </div>
                    </div>

                    {/* 简洁进度条 */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-600">{formatTime(currentTime)}</span>
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleProgressChange}
                        className="w-48 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        style={{
                          background: `linear-gradient(to right, #2563eb ${(currentTime / duration) * 100}%, #d1d5db ${(currentTime / duration) * 100}%)`
                        }}
                      />
                      <span className="text-xs text-gray-600">{formatTime(duration)}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </motion.div>
      <audio ref={audioRef} preload="metadata" /> {/* 添加preload="metadata"属性 */}
    </>
  );
} 