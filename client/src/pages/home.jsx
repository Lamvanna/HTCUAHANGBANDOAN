import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ProductCard from "@/components/product-card";
import CartModal from "@/components/cart-modal";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";

export default function Home() {
  const [location] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Parse URL search params
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const initialSearch = urlParams.get('search') || '';

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products", selectedCategory !== "all" ? selectedCategory : undefined, searchQuery || initialSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append('category', selectedCategory);
      if (searchQuery || initialSearch) params.append('search', searchQuery || initialSearch);

      const response = await fetch(`/api/products?${params}`);
      return response.json();
    },
  });

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'price') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "Món chính", name: "Món chính" },
    { id: "Món tráng miệng", name: "Món tráng miệng" },
    { id: "Đồ uống", name: "Đồ uống" },
    { id: "Món chay", name: "Món chay" },
    { id: "Món nhẹ", name: "Món nhẹ" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Search will be handled by the query refetch
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeroSection />
      
      {/* Product Catalog */}
      <section id="menu" className="scroll-section py-12 bg-gradient-to-br from-red-50/50 via-white to-red-100/50 relative overflow-hidden">
        {/* Background decorative elements - smaller */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-red-200/20 to-red-300/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-red-100/20 to-red-200/20 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header - compact */}
          <div className="text-center mb-8">
            <h2 className="menu-title text-3xl md:text-4xl font-poppins font-black mb-3 leading-tight"
                style={{
                  background: 'linear-gradient(135deg, #AA1515 0%, #8B0000 25%, #AA1515 50%, #CC1515 75%, #8B0000 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  backgroundSize: '200% 200%',
                  animation: 'gradient-shift 4s ease-in-out infinite',
                  textShadow: '0 0 20px rgba(170, 21, 21, 0.2)',
                  filter: 'drop-shadow(1px 1px 4px rgba(0, 0, 0, 0.1))'
                }}>
              Thực đơn đặc biệt
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Khám phá các món ăn ngon được chế biến tươi mới hàng ngày
            </p>
          </div>

          {/* Search Bar - Mobile */}
          <div className="md:hidden mb-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Tìm món ăn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </form>
          </div>

          {/* Filters and Sorting - compact */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 flex-1">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  size="sm"
                  className={`category-btn relative overflow-hidden rounded-full font-semibold px-4 py-2 text-sm transition-all duration-300 hover:scale-105 ${
                    selectedCategory === category.id
                      ? "text-white shadow-md border-0"
                      : "bg-white/90 text-gray-700 hover:bg-white border border-red-200/50 backdrop-blur-sm"
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.id ? '#AA1515' : undefined,
                    color: selectedCategory === category.id ? 'white' : undefined,
                    borderColor: selectedCategory !== category.id ? 'rgba(170, 21, 21, 0.2)' : undefined,
                    boxShadow: selectedCategory === category.id
                      ? '0 4px 15px rgba(170, 21, 21, 0.25)'
                      : '0 2px 8px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <span className="relative z-10 flex items-center gap-1.5"
                        style={{
                          color: selectedCategory !== category.id ? '#AA1515' : 'white'
                        }}>
                    {category.name}
                  </span>
                </Button>
              ))}
            </div>

            {/* Sort Controls - compact */}
            <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-red-200/50 shadow-sm">
              <div className="flex items-center gap-2" style={{color: '#AA1515'}}>
                <SlidersHorizontal className="h-4 w-4" />
                <span className="font-semibold text-sm">Sắp xếp:</span>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32 border-red-200/50 bg-white/90 hover:bg-white transition-colors text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-md border-red-200/50">
                  <SelectItem value="name" className="hover:bg-red-50">Tên</SelectItem>
                  <SelectItem value="price" className="hover:bg-red-50">Giá</SelectItem>
                  <SelectItem value="category" className="hover:bg-red-50">Danh mục</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border-red-200/50 bg-white/90 hover:bg-red-50 hover:border-red-300 transition-all duration-300 text-sm"
              >
                <ArrowUpDown className="h-4 w-4 mr-1" />
                {sortOrder === 'asc' ? '↑ A-Z' : '↓ Z-A'}
              </Button>
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Results Info */}
          {sortedProducts.length > 0 && (
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">
                Hiển thị {sortedProducts.length} sản phẩm
                {selectedCategory !== "all" && ` trong danh mục "${categories.find(c => c.id === selectedCategory)?.name}"`}
                {(searchQuery || initialSearch) && ` cho "${searchQuery || initialSearch}"`}
              </p>
              <Button variant="outline" className="px-8 py-3">
                Xem thêm món ăn
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* About Section - Enhanced */}
      <section id="about" className="scroll-section about-section py-20 bg-gradient-to-br from-red-50/50 via-white to-red-100/50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-red-200/20 to-red-300/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-red-100/20 to-red-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2
            className="about-title text-4xl md:text-5xl font-poppins font-black mb-8 leading-tight"
            style={{
              background: 'linear-gradient(135deg, #AA1515 0%, #8B0000 25%, #AA1515 50%, #CC1515 75%, #8B0000 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundSize: '200% 200%',
              animation: 'gradient-shift 4s ease-in-out infinite'
            }}
          >
            Về Na Food
          </h2>
          <div className="max-w-4xl mx-auto">
            <p
              className="about-description text-lg md:text-xl leading-relaxed mb-8"
              style={{
                color: '#AA1515',
                fontWeight: '500',
                lineHeight: '1.8'
              }}
            >
              Na Food là nền tảng đặt món ăn trực tuyến hàng đầu, mang đến cho bạn những trải nghiệm
              ẩm thực tuyệt vời với đa dạng món ăn từ khắp nơi. Chúng tôi cam kết về chất lượng món ăn
              và dịch vụ giao hàng nhanh chóng, đảm bảo sự hài lòng của khách hàng.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="feature-card bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-red-100/50">
                <div className="text-3xl mb-4">🍽️</div>
                <h3 className="font-bold text-lg mb-2" style={{color: '#AA1515'}}>Đa dạng món ăn</h3>
                <p className="text-gray-600 text-sm">Hàng trăm món ăn từ khắp nơi</p>
              </div>
              <div className="feature-card bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-red-100/50">
                <div className="text-3xl mb-4">🚚</div>
                <h3 className="font-bold text-lg mb-2" style={{color: '#AA1515'}}>Giao hàng nhanh</h3>
                <p className="text-gray-600 text-sm">Đảm bảo giao hàng trong 30 phút</p>
              </div>
              <div className="feature-card bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-red-100/50">
                <div className="text-3xl mb-4">⭐</div>
                <h3 className="font-bold text-lg mb-2" style={{color: '#AA1515'}}>Chất lượng cao</h3>
                <p className="text-gray-600 text-sm">Cam kết về chất lượng và an toàn</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <CartModal />
    </div>
  );
}
