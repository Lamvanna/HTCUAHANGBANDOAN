import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { useCart } from "@/lib/cart.tsx";
import { useAuth } from "@/lib/auth.tsx";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Heart, ShoppingCart, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface ProductDetailParams {
  id: string;
}

export default function ProductDetail() {
  const { id } = useParams<ProductDetailParams>();
  const [, setLocation] = useLocation();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['/api/products', id],
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (!product) return;

    if (!user) {
      toast({
        title: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng",
        variant: "destructive",
      });
      setLocation("/auth");
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${product.name} đã được thêm vào giỏ hàng`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Đang tải...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy sản phẩm</h1>
            <Link href="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <img
                  src={product.image || "/placeholder-food.jpg"}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4" />
                  <span className="text-sm text-gray-600 ml-1">(4.0)</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-xl font-semibold text-orange-600 mb-4">
                {product.price.toLocaleString('vi-VN')}₫
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mô tả</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || "Món ăn ngon và hấp dẫn từ Na Food"}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Thông tin chi tiết</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Danh mục:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="font-medium text-green-600">Còn hàng</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian chuẩn bị:</span>
                  <span className="font-medium">15-20 phút</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex gap-4">
              <Button onClick={handleAddToCart} className="flex-1">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Thêm vào giỏ hàng
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Ưu đãi đặc biệt</h4>
              <p className="text-sm text-blue-800">
                Miễn phí giao hàng cho đơn hàng trên 200.000₫
              </p>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm tương tự</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* This would be populated with related products */}
            <Card className="opacity-50">
              <CardHeader>
                <CardTitle className="text-sm">Sản phẩm liên quan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500">Đang cập nhật...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}