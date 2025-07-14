import { useAuth } from "@/lib/auth.tsx";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Order } from "@shared/schema";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Package, Phone, MapPin } from "lucide-react";

export default function UserOrders() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAuthenticated) {
    setLocation('/auth');
    return null;
  }

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.json();
    },
  });

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipping: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const statusText = {
      pending: 'Chờ xử lý',
      processing: 'Đang xử lý',
      shipping: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy',
    };
    return statusText[status as keyof typeof statusText] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Đơn hàng của tôi</h1>
        
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Chưa có đơn hàng nào
              </h2>
              <p className="text-gray-600 mb-6">
                Bạn chưa có đơn hàng nào. Hãy khám phá thực đơn và đặt món yêu thích!
              </p>
              <Button
                onClick={() => setLocation('/')}
                className="bg-primary hover:bg-orange-600"
              >
                Khám phá thực đơn
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Đơn hàng #{order.id}
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Món ăn đã đặt:</h4>
                      <div className="space-y-2">
                        {Array.isArray(order.items) ? order.items.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <div className="flex items-center space-x-3">
                              <img
                                src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60'}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-600">
                                  {Number(item.price).toLocaleString('vi-VN')}₫ x {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="font-medium">
                              {(Number(item.price) * item.quantity).toLocaleString('vi-VN')}₫
                            </p>
                          </div>
                        )) : (
                          <p className="text-gray-600">Không có thông tin chi tiết</p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Thông tin khách hàng:</h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium">Tên:</span> {order.customerName}</p>
                          <p className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {order.customerPhone}
                          </p>
                          <p className="flex items-start">
                            <MapPin className="h-3 w-3 mr-1 mt-0.5" />
                            {order.customerAddress}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Thông tin thanh toán:</h4>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">Phương thức:</span>{' '}
                            {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' :
                             order.paymentMethod === 'bank_transfer' ? 'Chuyển khoản' : 'Ví điện tử'}
                          </p>
                          <p>
                            <span className="font-medium">Tổng tiền:</span>{' '}
                            <span className="text-lg font-bold text-primary">
                              {Number(order.total).toLocaleString('vi-VN')}₫
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {order.notes && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Ghi chú:</h4>
                        <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
                          {order.notes}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end space-x-3">
                      {order.status === 'pending' && (
                        <Button variant="outline" className="text-red-600 hover:text-red-700">
                          Hủy đơn hàng
                        </Button>
                      )}
                      {order.status === 'delivered' && (
                        <Button className="bg-primary hover:bg-orange-600">
                          Đánh giá
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
