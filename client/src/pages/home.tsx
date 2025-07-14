import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Product } from "@shared/schema";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ProductCard from "@/components/product-card";
import CartModal from "@/components/cart-modal";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Home() {
  const [location] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Parse URL search params
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const initialSearch = urlParams.get('search') || '';

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", selectedCategory !== "all" ? selectedCategory : undefined, searchQuery || initialSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append('category', selectedCategory);
      if (searchQuery || initialSearch) params.append('search', searchQuery || initialSearch);
      
      const response = await fetch(`/api/products?${params}`);
      return response.json();
    },
  });

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "Món chính", name: "Món chính" },
    { id: "Món tráng miệng", name: "Món tráng miệng" },
    { id: "Đồ uống", name: "Đồ uống" },
    { id: "Món chay", name: "Món chay" },
    { id: "Món nhẹ", name: "Món nhẹ" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search will be handled by the query refetch
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeroSection />
      
      {/* Product Catalog */}
      <section id="menu" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 mb-4">
              Thực đơn đặc biệt
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
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

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-primary text-white hover:bg-orange-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category.name}
              </Button>
            ))}
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
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {products.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" className="px-8 py-3">
                Xem thêm món ăn
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 mb-4">
            Về Na Food
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Na Food là nền tảng đặt món ăn trực tuyến hàng đầu, mang đến cho bạn những trải nghiệm 
            ẩm thực tuyệt vời với đa dạng món ăn từ khắp nơi. Chúng tôi cam kết về chất lượng món ăn 
            và dịch vụ giao hàng nhanh chóng, đảm bảo sự hài lòng của khách hàng.
          </p>
        </div>
      </section>

      <Footer />
      <CartModal />
    </div>
  );
}
