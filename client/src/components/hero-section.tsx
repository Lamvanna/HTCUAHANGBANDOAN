import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Banner } from "@shared/schema";

export default function HeroSection() {
  const { data: banners = [] } = useQuery<Banner[]>({
    queryKey: ["/api/banners"],
    queryFn: async () => {
      const response = await fetch("/api/banners?active=true");
      return response.json();
    },
  });

  const handleOrderNow = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  const mainBanner = banners[0];

  return (
    <section className="relative h-96 bg-gradient-to-r from-primary to-orange-600 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: mainBanner?.image 
            ? `url(${mainBanner.image})` 
            : "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="text-white">
          <h1 className="text-4xl md:text-6xl font-poppins font-bold mb-4">
            {mainBanner?.title || (
              <>
                Thưởng thức<br />
                <span className="text-accent-gold">món ngon mỗi ngày</span>
              </>
            )}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-md">
            {mainBanner?.description || "Đặt hàng nhanh chóng, giao hàng tận nơi với Na Food"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleOrderNow}
              className="bg-white text-primary font-semibold px-8 py-3 hover:bg-gray-100"
            >
              Đặt hàng ngay
            </Button>
            <Button 
              variant="outline" 
              onClick={handleViewMenu}
              className="border-2 border-white text-white font-semibold px-8 py-3 hover:bg-white hover:text-primary"
            >
              Xem thực đơn
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
