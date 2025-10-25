

import React, { useState, useRef, WheelEvent, MouseEvent, TouchEvent, useEffect } from 'react';

interface ZoomableImageProps {
  src: string;
  alt: string;
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({ src, alt }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  
  const touchStartDist = useRef(0);
  const startScale = useRef(1);

  const [displaySrc, setDisplaySrc] = useState(src);
  const [opacity, setOpacity] = useState(1);

  // Reset zoom/pan when image src changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [displaySrc]);

  useEffect(() => {
    if (src !== displaySrc) {
      setOpacity(0);
    }
  }, [src, displaySrc]);

  const handleTransitionEnd = () => {
    if (opacity === 0) {
      setDisplaySrc(src);
      setOpacity(1);
    }
  };


  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    const newScale = e.deltaY > 0 ? scale / zoomFactor : scale * zoomFactor;
    const clampedScale = Math.max(1, Math.min(newScale, 8));
    
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newX = mouseX - (mouseX - position.x) * (clampedScale / scale);
    const newY = mouseY - (mouseY - position.y) * (clampedScale / scale);

    setScale(clampedScale);
    if (clampedScale <= 1) {
      setPosition({ x: 0, y: 0 });
    } else {
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (scale <= 1 || e.button !== 0) return;
    e.preventDefault();
    setIsPanning(true);
    setStartPan({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isPanning || scale <= 1) return;
    e.preventDefault();
    setPosition({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
    });
  };
  
  const handleMouseUpOrLeave = () => {
    setIsPanning(false);
  };

  // FIX: Changed Touch to React.Touch to match the type from React's synthetic event.
  const getTouchDist = (t1: React.Touch, t2: React.Touch) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
      if (e.touches.length === 1 && scale > 1) {
          setIsPanning(true);
          setStartPan({
              x: e.touches[0].clientX - position.x,
              y: e.touches[0].clientY - position.y,
          });
      } else if (e.touches.length === 2) {
          e.preventDefault();
          touchStartDist.current = getTouchDist(e.touches[0], e.touches[1]);
          startScale.current = scale;
      }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
      if (e.touches.length === 1 && isPanning) {
          setPosition({
              x: e.touches[0].clientX - startPan.x,
              y: e.touches[0].clientY - startPan.y,
          });
      } else if (e.touches.length === 2) {
          e.preventDefault();
          const currentDist = getTouchDist(e.touches[0], e.touches[1]);
          const newScale = startScale.current * (currentDist / touchStartDist.current);
          const clampedScale = Math.max(1, Math.min(newScale, 8));

          const rect = e.currentTarget.getBoundingClientRect();
          const touchCenterX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
          const touchCenterY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
          
          const newX = touchCenterX - (touchCenterX - position.x) * (clampedScale / scale);
          const newY = touchCenterY - (touchCenterY - position.y) * (clampedScale / scale);
          
          setScale(clampedScale);
          setPosition({ x: newX, y: newY });
      }
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
      if (e.touches.length < 2) {
        setIsPanning(false);
      }
      if (e.touches.length < 2) {
          touchStartDist.current = 0;
      }
      if (scale <= 1) {
        setPosition({ x: 0, y: 0 });
      }
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };
  
  const finalPosition = scale > 1 ? position : { x: 0, y: 0 };
  const cursorStyle = isPanning ? 'grabbing' : (scale > 1 ? 'grab' : 'default');

  return (
    <div 
        className="w-full h-full relative overflow-hidden touch-none rounded-2xl"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: cursorStyle }}
    >
      <div
        className="w-full h-full"
        style={{
          transform: `translate(${finalPosition.x}px, ${finalPosition.y}px) scale(${scale})`,
          transition: isPanning ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        <img
            src={displaySrc}
            alt={alt}
            className="w-full h-full object-contain"
            style={{ 
              opacity: opacity,
              transition: 'opacity 0.3s ease-in-out'
            }}
            onTransitionEnd={handleTransitionEnd}
            draggable="false"
        />
      </div>
      {scale > 1 && (
        <button 
          onClick={resetZoom}
          className="absolute bottom-4 right-4 bg-slate-900/30 backdrop-blur-sm text-white p-2 rounded-full hover:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-white transition"
          aria-label="Resetar zoom"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ZoomableImage;