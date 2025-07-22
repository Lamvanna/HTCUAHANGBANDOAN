import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Eye } from "lucide-react";
import { useCart } from "@/lib/cart.jsx";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
    });
    
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${product.name} đã được thêm vào giỏ hàng`,
    });
  };

  return (
    <Card className="product-card group relative overflow-hidden bg-white rounded-xl border-0 shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02]">
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-100/30 via-transparent to-red-200/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative overflow-hidden rounded-t-xl">
        {/* Enhanced image container */}
        <div className="relative overflow-hidden h-48 bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={product.image || "/placeholder-food.jpg"}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ease-out filter group-hover:brightness-110"
          />

          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] group-hover:transition-transform group-hover:duration-1000"></div>

          {/* Floating badge */}
          <div className="absolute top-3 left-3 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
            <Badge
              variant="secondary"
              className="bg-white/95 backdrop-blur-sm text-gray-800 border border-white/50 font-semibold px-3 py-1.5 rounded-full shadow-lg"
            >
              {product.category}
            </Badge>
          </div>

          {/* Enhanced overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
            <Link href={`/product/${product.id}`}>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/95 backdrop-blur-sm text-gray-800 hover:bg-white border border-white/50 font-semibold rounded-full px-4 py-2 shadow-xl transform scale-90 group-hover:scale-100 transition-all duration-300"
              >
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <CardContent className="p-5 relative z-10">
        <div className="space-y-3">
          {/* Enhanced product name */}
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-primary transition-all duration-300 leading-tight">
            {product.name}
          </h3>

          {/* Enhanced description */}
          <p
            className="text-sm text-gray-600 line-clamp-2 leading-relaxed"
            style={{
              textShadow: 'none',
              filter: 'none',
              boxShadow: 'none',
              WebkitTextShadow: 'none',
              WebkitFilter: 'none'
            }}
          >
            {product.description || "Món ăn ngon được chế biến từ nguyên liệu tươi ngon"}
          </p>

          {/* Animated star rating */}
          <div className="flex items-center space-x-1 py-1">
            <div className="flex items-center space-x-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 transition-all duration-300 ${
                    i < 4
                      ? 'text-yellow-400 fill-current group-hover:scale-110 group-hover:rotate-12'
                      : 'text-gray-300'
                  }`}
                  style={{
                    transitionDelay: `${i * 50}ms`
                  }}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2 font-medium">(4.0)</span>
          </div>

          {/* Enhanced price and button section */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex flex-col">
              <span
                className="text-2xl font-black leading-none group-hover:scale-105 transition-transform duration-300"
                style={{
                  background: 'linear-gradient(135deg, #AA1515 0%, #CC1515 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {Number(product.price)?.toLocaleString('vi-VN')}đ
              </span>
            </div>

            <Button
              onClick={handleAddToCart}
              size="sm"
              className="shrink-0 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-4 py-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 group-hover:animate-pulse"
              style={{
                backgroundColor: '#AA1515'
              }}
            >
              <Plus className="mr-1 h-4 w-4" />
              Thêm
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
