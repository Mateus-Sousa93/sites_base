'use client';

import { useEffect, useRef, useState } from 'react';

export function CampaignVideo({ name, label }: { name: string; label: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const manuallyPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    function syncPlayback() {
      if (!video) return;
      if (visible && !document.hidden && !motion.matches && !manuallyPaused.current) {
        if (!video.getAttribute('src')) video.src = `/videos/${name}.mp4`;
        void video.play().catch(() => { /* The play control remains available if autoplay is blocked. */ });
      } else video.pause();
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0.15 });
    observer.observe(video);
    document.addEventListener('visibilitychange', syncPlayback);
    motion.addEventListener('change', syncPlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      motion.removeEventListener('change', syncPlayback);
      video.pause();
    };
  }, [name]);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      manuallyPaused.current = false;
      if (!video.getAttribute('src')) video.src = `/videos/${name}.mp4`;
      void video.play().catch(() => setFailed(true));
    } else {
      manuallyPaused.current = true;
      video.pause();
    }
  }

  return <div className="campaign-video">
    <video ref={videoRef} muted loop playsInline preload="none" poster={`/videos/${name}-poster.jpg`}
      aria-label={label} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} />
    <button className="video-control" onClick={toggle} disabled={failed}
      aria-label={`${playing ? 'Pausar' : 'Reproduzir'} vídeo: ${label}`} aria-pressed={playing}>
      <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>{failed ? 'VÍDEO INDISPONÍVEL' : playing ? 'PAUSAR FILME' : 'VER FILME'}
    </button>
  </div>;
}
