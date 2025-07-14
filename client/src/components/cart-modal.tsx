import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart.tsx";
import { useAuth } from "@/lib/auth.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CreateOrderData } from "@/types";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

export default function CartModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderData, setOrderData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    paymentMethod: 'cod' as 'cod' | 'bank_transfer' | 'e_wallet',
    notes: '',
  });
  
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user) {
      setOrderData(prev => ({
        ...prev,
        customerName: user.fullName,
      }));
    }
  }, [user]);

  useEffect(() => {
    const handleOpenCart = () => setIsOpen(true);
    window.addEventListener('open-cart', handleOpenCart);
    return () => window.removeEventListener('open-cart', handleOpenCart);
  }, []);

  const createOrderMutation = useMutation({
    mutationFn: async (data: CreateOrderData) => {
      const response = await apiRequest('POST', '/api/orders', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Đặt hàng thành công!",
        description: "Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.",
      });
      clearCart();
      setIsOpen(false);
      setShowCheckout(false);
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi đặt hàng",
        description: error.message || "Có lỗi xảy ra khi đặt hàng",
        variant: "destructive",
      });
    }
  });

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để đặt hàng",
        variant: "destructive",
      });
      return;
    }
    setShowCheckout(true);
  };

  const handleSubmitOrder = () => {
    if (!orderData.customerName || !orderData.customerPhone || !orderData.customerAddress) {
      toast({
        title: "Vui lòng điền đầy đủ thông tin",
        description: "Tên, số điện thoại và địa chỉ là bắt buộc",
        variant: "destructive",
      });
      return;
    }

    const orderItems = items.map(item => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    createOrderMutation.mutate({
      items: orderItems,
      total,
      ...orderData,
    });
  };

  if (showCheckout) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full max-w-md flex flex-col">
          <SheetHeader>
            <SheetTitle>Thông tin đặt hàng</SheetTitle>
          </SheetHeader>
          
          <div className="py-6 space-y-4 flex-1 overflow-y-auto">
            <div>
              <Label htmlFor="name">Họ và tên *</Label>
              <Input
                id="name"
                value={orderData.customerName}
                onChange={(e) => setOrderData(prev => ({ ...prev, customerName: e.target.value }))}
                placeholder="Nhập họ và tên"
              />
            </div>

            <div>
              <Label htmlFor="phone">Số điện thoại *</Label>
              <Input
                id="phone"
                value={orderData.customerPhone}
                onChange={(e) => setOrderData(prev => ({ ...prev, customerPhone: e.target.value }))}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div>
              <Label htmlFor="address">Địa chỉ giao hàng *</Label>
              <Textarea
                id="address"
                value={orderData.customerAddress}
                onChange={(e) => setOrderData(prev => ({ ...prev, customerAddress: e.target.value }))}
                placeholder="Nhập địa chỉ giao hàng"
              />
            </div>

            <div>
              <Label>Phương thức thanh toán</Label>
              <RadioGroup
                value={orderData.paymentMethod}
                onValueChange={(value) => setOrderData(prev => ({ ...prev, paymentMethod: value as any }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Thanh toán khi nhận hàng (COD)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                  <Label htmlFor="bank_transfer">Chuyển khoản ngân hàng</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="e_wallet" id="e_wallet" />
                  <Label htmlFor="e_wallet">Ví điện tử</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="notes">Ghi chú</Label>
              <Textarea
                id="notes"
                value={orderData.notes}
                onChange={(e) => setOrderData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Ghi chú thêm (tùy chọn)"
              />
            </div>
          </div>

          <div className="border-t pt-4 flex-shrink-0">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Tổng cộng:</span>
              <span className="text-2xl font-bold text-primary">
                {total.toLocaleString('vi-VN')}₫
              </span>
            </div>
            
            <div className="space-y-2">
              <Button
                onClick={handleSubmitOrder}
                disabled={createOrderMutation.isPending}
                className="w-full bg-primary text-white hover:bg-orange-600"
              >
                {createOrderMutation.isPending ? 'Đang xử lý...' : 'Đặt hàng'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCheckout(false)}
                className="w-full"
              >
                Quay lại giỏ hàng
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Giỏ hàng của bạn</SheetTitle>
        </SheetHeader>
        
        <div className="py-6 flex-1 overflow-y-auto min-h-0">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Giỏ hàng trống</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <img 
                    src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80'} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.price.toLocaleString('vi-VN')}₫</p>
                    <div className="flex items-center mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="mx-3 font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {items.length > 0 && (
          <div className="border-t pt-4 flex-shrink-0">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Tổng cộng:</span>
              <span className="text-2xl font-bold text-primary">
                {total.toLocaleString('vi-VN')}₫
              </span>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full bg-primary text-white hover:bg-orange-600"
            >
              Thanh toán
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
