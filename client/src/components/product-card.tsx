import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Plus } from "lucide-react";
import { Product } from "@shared/schema";
import { useCart } from "@/lib/cart.tsx";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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

  const getCategoryColor = (category: string) => {
    const colors = {
      'Món chính': 'bg-secondary',
      'Món nhẹ': 'bg-warning',
      'Đồ uống': 'bg-blue-500',
      'Món chay': 'bg-secondary',
      'Món tráng miệng': 'bg-purple-500',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <Card className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
      <div className="relative overflow-hidden">
        <img 
          src={product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge className={`${getCategoryColor(product.category)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
            {product.category}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Button 
            variant="secondary" 
            size="icon"
            className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full"
          >
            <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary">
            {Number(product.price).toLocaleString('vi-VN')}₫
          </span>
          <div className="flex items-center">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < 4 ? 'fill-current' : ''}`}
                />
              ))}
            </div>
            <span className="text-gray-600 text-sm">4.5</span>
          </div>
        </div>
        
        <Button 
          onClick={handleAddToCart}
          className="w-full bg-primary text-white py-3 hover:bg-orange-600 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm vào giỏ
        </Button>
      </CardContent>
    </Card>
  );
}
