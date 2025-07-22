import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const handleHomeClick = () => {
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <footer className="footer-enhanced bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-red-600/10 to-red-800/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-red-500/10 to-red-700/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info - Enhanced */}
          <div className="company-info">
            <h3
              className="text-3xl font-poppins font-black mb-6 footer-brand-title"
              style={{
                background: 'linear-gradient(135deg, #AA1515 0%, #FF4444 50%, #AA1515 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundSize: '200% 200%',
                animation: 'gradient-shift 3s ease-in-out infinite'
              }}
            >
              Na Food
            </h3>
            <p
              className="mb-6 text-lg leading-relaxed footer-description"
              style={{
                color: '#AA1515',
                fontWeight: '500'
              }}
            >
              Đặt món ăn ngon, giao hàng nhanh chóng đến tận nhà bạn.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="social-icon text-gray-400 hover:text-red-400 transition-all duration-300 transform hover:scale-125 hover:-translate-y-1">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="social-icon text-gray-400 hover:text-red-400 transition-all duration-300 transform hover:scale-125 hover:-translate-y-1">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="social-icon text-gray-400 hover:text-red-400 transition-all duration-300 transform hover:scale-125 hover:-translate-y-1">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="social-icon text-gray-400 hover:text-red-400 transition-all duration-300 transform hover:scale-125 hover:-translate-y-1">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links - Enhanced */}
          <div className="footer-section">
            <h4
              className="text-xl font-bold mb-6 footer-section-title"
              style={{color: '#AA1515'}}
            >
              Liên kết nhanh
            </h4>
            <ul className="space-y-3">
              <li>
                <span
                  onClick={handleHomeClick}
                  className="footer-link text-gray-300 hover:text-red-400 transition-all duration-300 transform hover:translate-x-2 inline-block cursor-pointer"
                >
                  🏠 Trang chủ
                </span>
              </li>
              <li>
                <a href="#menu" className="footer-link text-gray-300 hover:text-red-400 transition-all duration-300 transform hover:translate-x-2 inline-block">
                  🍽️ Thực đơn
                </a>
              </li>
              <li>
                <a href="#about" className="footer-link text-gray-300 hover:text-red-400 transition-all duration-300 transform hover:translate-x-2 inline-block">
                  ℹ️ Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="footer-link text-gray-300 hover:text-red-400 transition-all duration-300 transform hover:translate-x-2 inline-block">
                  📞 Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Categories - Enhanced */}
          <div className="footer-section">
            <h4
              className="text-xl font-bold mb-6 footer-section-title"
              style={{color: '#AA1515'}}
            >
              Danh mục
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="footer-link text-gray-300 hover:text-red-400 transition-all duration-300 transform hover:translate-x-2 inline-block">
                  🍖 Món chính
                </a>
              </li>
              <li>
                <a href="#" className="footer-link text-gray-300 hover:text-red-400 transition-all duration-300 transform hover:translate-x-2 inline-block">
                  🍰 Món tráng miệng
                </a>
              </li>
              <li>
                <a href="#" className="footer-link text-gray-300 hover:text-red-400 transition-all duration-300 transform hover:translate-x-2 inline-block">
                  🥤 Đồ uống
                </a>
              </li>
              <li>
                <a href="#" className="footer-link text-gray-300 hover:text-red-400 transition-all duration-300 transform hover:translate-x-2 inline-block">
                  🥗 Món chay
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info - Enhanced */}
          <div className="footer-section">
            <h4
              className="text-xl font-bold mb-6 footer-section-title"
              style={{color: '#AA1515'}}
            >
              Liên hệ
            </h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 contact-item group">
                <div className="contact-icon-wrapper bg-red-600/20 p-2 rounded-full group-hover:bg-red-600/30 transition-all duration-300">
                  <MapPin className="h-5 w-5 text-red-400" />
                </div>
                <span
                  className="text-gray-300 group-hover:text-red-300 transition-colors duration-300"
                  style={{color: '#AA1515', fontWeight: '500'}}
                >
                  123 Đường ABC, Quận 1, TP.HCM
                </span>
              </div>
              <div className="flex items-center space-x-4 contact-item group">
                <div className="contact-icon-wrapper bg-red-600/20 p-2 rounded-full group-hover:bg-red-600/30 transition-all duration-300">
                  <Phone className="h-5 w-5 text-red-400" />
                </div>
                <span
                  className="text-gray-300 group-hover:text-red-300 transition-colors duration-300"
                  style={{color: '#AA1515', fontWeight: '500'}}
                >
                  0123 456 789
                </span>
              </div>
              <div className="flex items-center space-x-4 contact-item group">
                <div className="contact-icon-wrapper bg-red-600/20 p-2 rounded-full group-hover:bg-red-600/30 transition-all duration-300">
                  <Mail className="h-5 w-5 text-red-400" />
                </div>
                <span
                  className="text-gray-300 group-hover:text-red-300 transition-colors duration-300"
                  style={{color: '#AA1515', fontWeight: '500'}}
                >
                  info@nafood.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Copyright Section */}
        <div className="border-t border-gradient-to-r from-transparent via-red-600/30 to-transparent mt-12 pt-8">
          <div className="text-center">
            <p
              className="text-lg font-medium copyright-text"
              style={{
                color: '#AA1515',
                fontWeight: '600'
              }}
            >
              © 2024 Na Food. Tất cả quyền được bảo lưu.
            </p>
            <div className="mt-4 flex justify-center items-center space-x-2">
              <span className="text-red-400">❤️</span>
              <span className="text-gray-400 text-sm">Made with love for Vietnamese cuisine</span>
              <span className="text-red-400">❤️</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
