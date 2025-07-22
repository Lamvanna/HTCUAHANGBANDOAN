import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const { data: banners = [] } = useQuery({
    queryKey: ["/api/banners"],
    queryFn: async () => {
      const response = await fetch("/api/banners?active=true");
      return response.json();
    },
  });

  // Auto slide banners every 5 seconds
  useEffect(() => {
    if (banners.length > 1 && isAutoPlay) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prevIndex) =>
          prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [banners.length, isAutoPlay]);

  const handleOrderNow = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentBanner = banners[currentBannerIndex] || banners[0];

  // Handle manual banner navigation
  const goToSlide = (index) => {
    setCurrentBannerIndex(index);
    setIsAutoPlay(false); // Pause auto-play when user manually navigates

    // Resume auto-play after 10 seconds
    setTimeout(() => {
      setIsAutoPlay(true);
    }, 10000);
  };

  const nextSlide = () => {
    const nextIndex = currentBannerIndex === banners.length - 1 ? 0 : currentBannerIndex + 1;
    goToSlide(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = currentBannerIndex === 0 ? banners.length - 1 : currentBannerIndex - 1;
    goToSlide(prevIndex);
  };

  return (
    <section className="relative h-[600px] bg-gradient-to-r from-primary to-red-700 overflow-hidden min-h-[550px] max-h-[700px] hero-section" style={{background: `linear-gradient(to right, #AA1515, #881111)`}}>
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30 animate-pulse"></div>

      {/* Background image với tối ưu hóa và transition */}
      <div
        key={currentBannerIndex} // Key để trigger re-render khi chuyển banner
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hero-bg banner-transition"
        style={{
          backgroundImage: currentBanner?.image
            ? `url(${currentBanner.image})`
            : 'url("/hero-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(1.1) contrast(1.05) saturate(1.1)',
          imageRendering: 'crisp-edges',
          WebkitImageRendering: 'crisp-edges',
          animation: 'subtle-zoom 20s ease-in-out infinite alternate, fadeInBanner 0.8s ease-in-out'
        }}
      ></div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-particle particle-1"></div>
        <div className="floating-particle particle-2"></div>
        <div className="floating-particle particle-3"></div>
        <div className="floating-particle particle-4"></div>
        <div className="floating-particle particle-5"></div>
      </div>


      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
        <div className="text-white max-w-4xl text-center">
          {/* Tiêu đề chính với hiệu ứng gradient và animation */}
          <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl font-poppins font-black mb-6 leading-tight tracking-tight animate-fade-in-up"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 25%, #ffffff 50%, #e9ecef 75%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundSize: '200% 200%',
                animation: 'gradient-shift 3s ease-in-out infinite, glow-pulse 2s ease-in-out infinite alternate',
                textShadow: '0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(255, 255, 255, 0.3), 3px 3px 15px rgba(0, 0, 0, 0.8)',
                filter: 'drop-shadow(2px 2px 8px rgba(0, 0, 0, 0.7))'
              }}>
            {currentBanner?.title || "Thưởng thức món ngon mỗi ngày"}
          </h1>

          {/* Mô tả với hiệu ứng typewriter */}
          <p className="hero-subtitle text-lg md:text-2xl lg:text-3xl mb-10 text-yellow-100 font-semibold leading-relaxed animate-fade-in-up-delay tracking-wide max-w-3xl mx-auto"
             style={{
               textShadow: '2px 2px 12px rgba(0, 0, 0, 0.9), 0 0 20px rgba(255, 193, 7, 0.3)',
               animation: 'fade-in-up 1s ease-out 0.5s both, text-glow 2s ease-in-out infinite alternate',
               fontFamily: '"Poppins", sans-serif'
             }}>
            {currentBanner?.description || "Đặt món yêu thích của bạn chỉ với vài cú click"}
          </p>

          {/* Buttons với hiệu ứng lung linh */}
          <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up-delay-2 justify-center items-center">
            <Button
              size="lg"
              className="hero-btn-primary group relative overflow-hidden bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white hover:from-orange-600 hover:via-red-600 hover:to-pink-600 font-bold px-10 py-5 text-xl shadow-2xl border-0 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2"
              onClick={handleOrderNow}
              style={{
                borderRadius: '50px',
                boxShadow: '0 10px 30px rgba(255, 107, 107, 0.4), 0 0 50px rgba(255, 107, 107, 0.2)',
                animation: 'button-glow 2s ease-in-out infinite alternate'
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                🍽️ Đặt món ngay
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="hero-btn-secondary group relative overflow-hidden border-3 border-white/90 text-white hover:text-orange-500 font-bold px-10 py-5 text-xl bg-white/5 backdrop-blur-md hover:bg-white/95 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2"
              onClick={handleViewMenu}
              style={{
                borderRadius: '50px',
                boxShadow: '0 10px 30px rgba(255, 255, 255, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                animation: 'border-glow 2s ease-in-out infinite alternate'
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                📋 Xem thực đơn
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            </Button>
          </div>
        </div>
      </div>

      {/* Banner indicators - chỉ hiển thị khi có nhiều hơn 1 banner */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`banner-indicator transition-all duration-500 ${
                index === currentBannerIndex
                  ? 'w-12 h-3 bg-white scale-110 shadow-lg'
                  : 'w-3 h-3 bg-white/60 hover:bg-white/90 hover:scale-105'
              }`}
              style={{
                borderRadius: '50px',
                backdropFilter: 'blur(10px)',
                boxShadow: index === currentBannerIndex
                  ? '0 4px 15px rgba(255, 255, 255, 0.4), 0 0 20px rgba(255, 255, 255, 0.3)'
                  : '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Banner navigation arrows - chỉ hiển thị khi có nhiều hơn 1 banner */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="banner-nav-btn absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/15 hover:bg-white/30 backdrop-blur-md rounded-full p-4 transition-all duration-300 z-20 group"
            style={{
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            aria-label="Previous banner"
          >
            <svg className="w-6 h-6 text-white group-hover:scale-125 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="banner-nav-btn absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/15 hover:bg-white/30 backdrop-blur-md rounded-full p-4 transition-all duration-300 z-20 group"
            style={{
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            aria-label="Next banner"
          >
            <svg className="w-6 h-6 text-white group-hover:scale-125 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Auto-play indicator */}
      {banners.length > 1 && (
        <div className="absolute top-6 right-6 z-20">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-md transition-all duration-300 ${
            isAutoPlay ? 'bg-green-500/20 border border-green-400/30' : 'bg-gray-500/20 border border-gray-400/30'
          }`}>
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
              isAutoPlay ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
            }`}></div>
            <span className="text-white text-xs font-medium">
              {isAutoPlay ? 'Auto' : 'Manual'}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
