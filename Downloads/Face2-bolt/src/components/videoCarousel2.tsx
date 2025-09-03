import React, { useEffect, useRef } from 'react';
import { Play } from 'lucide-react';

const VideoCarousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Placeholder video data - user will replace with actual videos
  const videos = [
    { id: 1, title: 'Facial Rejuvenation', video: 'src/components/assets/STATIC-1.mp4' },
    { id: 2, title: 'Skin Tightening', video: 'src/components/assets/STATIC-2.mp4' },
    { id: 3, title: 'Wrinkle Reduction', video: 'src/components/assets/STATIC-3.mp4' },
    { id: 4, title: 'Laser Treatment', video: 'src/components/assets/STATIC-4.mp4' },
    { id: 6, title: 'Botox Results', video: 'src/components/assets/STATIC-6.mp4' },
  ];

  // Duplicate videos for seamless infinite scroll
  const duplicatedVideos = [...videos, ...videos, ...videos];

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const animate = () => {
      scrollPosition += scrollSpeed;
      
      // Reset position when we've scrolled through one set of videos
      if (scrollPosition >= carousel.scrollWidth / 3) {
        scrollPosition = 0;
      }
      
      carousel.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    // Pause on hover
    const handleMouseEnter = () => {
      cancelAnimationFrame(animationId);
    };

    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate);
    };

    carousel.addEventListener('mouseenter', handleMouseEnter);
    carousel.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      carousel.removeEventListener('mouseenter', handleMouseEnter);
      carousel.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section className="py-16 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        
      </div>

      <div 
        ref={carouselRef}
        className="flex space-x-6 overflow-x-hidden"
        style={{ width: 'calc(100% + 400px)', marginLeft: '-200px' }}
      >
        {duplicatedVideos.map((video, index) => (
          <div
            key={`${video.id}-${index}`}
            className="flex-none w-80 h-[640px] rounded-2xl overflow-hidden shadow-2xl group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-3xl"
          >
            <div className="relative w-full h-full bg-gradient-to-br from-blue-600 to-purple-600">
              <video 
                src={video.video}
                alt={video.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
                autoPlay
                muted
                loop
                playsInline
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-white text-sm font-medium">AI Generated</span>
              </div>
              
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-semibold text-lg mb-2">{video.title}</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/80 text-sm">Before & After Video</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-lg">
          Upload Your Before & After Photos
        </button>
      </div>
    </section>
  );
};

export default VideoCarousel;