import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth.jsx";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Eye,
  X
} from "lucide-react";

const statusConfig = {
  pending: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  processing: { label: "Đang xử lý", color: "bg-blue-100 text-blue-800", icon: Package },
  shipping: { label: "Đang giao", color: "bg-purple-100 text-purple-800", icon: Truck },
  delivered: { label: "Đã giao", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800", icon: XCircle },
};

export default function UserOrders() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/auth');
    }
  }, [isAuthenticated, setLocation]);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated,
  });

  const cancelOrderMutation = useMutation({
    mutationFn: (orderId) => apiRequest("PUT", `/api/orders/${orderId}`, { status: 'cancelled' }),
    onSuccess: () => {
      queryClient.invalidateQueries(["/api/orders"]);
      toast({
        title: "Hủy đơn hàng thành công",
        description: "Đơn hàng đã được hủy",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi hủy đơn hàng",
        description: error.message || "Không thể hủy đơn hàng",
        variant: "destructive",
      });
    },
  });

  const handleCancelOrder = (orderId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      cancelOrderMutation.mutate(orderId);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Đơn hàng của tôi
        </h1>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có đơn hàng nào
              </h3>
              <p className="text-gray-500 mb-6">
                Bạn chưa có đơn hàng nào. Hãy khám phá thực đơn và đặt món yêu thích!
              </p>
              <Button onClick={() => setLocation('/')}>
                Khám phá thực đơn
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;

              return (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Đơn hàng #{order.id}
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <Badge className={status.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Order Items Preview */}
                      <div>
                        <p className="text-sm font-medium mb-2">Món ăn:</p>
                        <div className="flex flex-wrap gap-2">
                          {order.items?.slice(0, 3).map((item, index) => (
                            <span key={index} className="text-sm bg-gray-100 px-2 py-1 rounded">
                              {item.name} x{item.quantity}
                            </span>
                          ))}
                          {order.items?.length > 3 && (
                            <span className="text-sm text-gray-500">
                              +{order.items.length - 3} món khác
                            </span>
                          )}
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-primary">
                            {Number(order.total).toLocaleString('vi-VN')}đ
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                Chi tiết
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Chi tiết đơn hàng #{order.id}</DialogTitle>
                              </DialogHeader>
                              <OrderDetails order={order} />
                            </DialogContent>
                          </Dialog>

                          {order.status === 'pending' && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancelOrder(order.id)}
                              disabled={cancelOrderMutation.isLoading}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Hủy đơn
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderDetails({ order }) {
  const status = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Status */}
      <div className="flex items-center space-x-2">
        <Badge className={status.color}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {status.label}
        </Badge>
        <span className="text-sm text-gray-500">
          {new Date(order.createdAt).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>

      {/* Customer Info */}
      <div>
        <h4 className="font-medium mb-2">Thông tin giao hàng</h4>
        <div className="bg-gray-50 p-4 rounded-lg space-y-1">
          <p><strong>Tên:</strong> {order.customerName}</p>
          <p><strong>Điện thoại:</strong> {order.customerPhone}</p>
          <p><strong>Địa chỉ:</strong> {order.customerAddress}</p>
        </div>
      </div>

      {/* Items */}
      <div>
        <h4 className="font-medium mb-2">Món ăn đã đặt</h4>
        <div className="space-y-3">
          {order.items?.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <img
                src={item.image || "/placeholder-food.jpg"}
                alt={item.name}
                className="w-12 h-12 object-cover rounded-md"
              />
              <div className="flex-1">
                <h5 className="font-medium">{item.name}</h5>
                <p className="text-sm text-gray-500">
                  {Number(item.price).toLocaleString('vi-VN')}đ x {item.quantity}
                </p>
              </div>
              <p className="font-medium">
                {(Number(item.price) * item.quantity).toLocaleString('vi-VN')}đ
              </p>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Total */}
      <div className="flex justify-between items-center text-lg font-bold">
        <span>Tổng cộng:</span>
        <span className="text-primary">{Number(order.total).toLocaleString('vi-VN')}đ</span>
      </div>

      {/* Notes */}
      {order.notes && (
        <div>
          <h4 className="font-medium mb-2">Ghi chú</h4>
          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{order.notes}</p>
        </div>
      )}
    </div>
  );
}
