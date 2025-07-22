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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  Eye,
  Edit
} from "lucide-react";

const statusConfig = {
  pending: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  processing: { label: "Đang xử lý", color: "bg-blue-100 text-blue-800", icon: Package },
  shipping: { label: "Đang giao", color: "bg-purple-100 text-purple-800", icon: Truck },
  delivered: { label: "Đã giao", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800", icon: XCircle },
};

export default function Staff() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'staff' && user?.role !== 'admin')) {
      setLocation('/');
    }
  }, [isAuthenticated, user, setLocation]);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated && (user?.role === 'staff' || user?.role === 'admin'),
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ orderId, status }) => apiRequest("PUT", `/api/orders/${orderId}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(["/api/orders"]);
      toast({
        title: "Cập nhật thành công",
        description: "Trạng thái đơn hàng đã được cập nhật",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi cập nhật",
        description: error.message || "Không thể cập nhật trạng thái đơn hàng",
        variant: "destructive",
      });
    },
  });

  const handleUpdateStatus = (orderId, newStatus) => {
    updateOrderMutation.mutate({ orderId, status: newStatus });
  };

  if (!isAuthenticated || (user?.role !== 'staff' && user?.role !== 'admin')) {
    return null;
  }

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const processingOrders = orders.filter(order => order.status === 'processing');
  const shippingOrders = orders.filter(order => order.status === 'shipping');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý đơn hàng
            </h1>
            <p className="text-gray-600 mt-2">
              Chào mừng {user?.fullName}, xử lý và theo dõi đơn hàng
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {pendingOrders.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {processingOrders.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đang giao</CardTitle>
              <Truck className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {shippingOrders.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng đơn hôm nay</CardTitle>
              <ShoppingCart className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {orders.filter(order => {
                  const today = new Date().toDateString();
                  const orderDate = new Date(order.createdAt).toDateString();
                  return today === orderDate;
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Tất cả đơn hàng</TabsTrigger>
            <TabsTrigger value="pending">Chờ xử lý ({pendingOrders.length})</TabsTrigger>
            <TabsTrigger value="processing">Đang xử lý ({processingOrders.length})</TabsTrigger>
            <TabsTrigger value="shipping">Đang giao ({shippingOrders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OrderList
              orders={orders}
              isLoading={isLoading}
              onUpdateStatus={handleUpdateStatus}
              isUpdating={updateOrderMutation.isLoading}
            />
          </TabsContent>

          <TabsContent value="pending">
            <OrderList
              orders={pendingOrders}
              isLoading={isLoading}
              onUpdateStatus={handleUpdateStatus}
              isUpdating={updateOrderMutation.isLoading}
            />
          </TabsContent>

          <TabsContent value="processing">
            <OrderList
              orders={processingOrders}
              isLoading={isLoading}
              onUpdateStatus={handleUpdateStatus}
              isUpdating={updateOrderMutation.isLoading}
            />
          </TabsContent>

          <TabsContent value="shipping">
            <OrderList
              orders={shippingOrders}
              isLoading={isLoading}
              onUpdateStatus={handleUpdateStatus}
              isUpdating={updateOrderMutation.isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function OrderList({ orders, isLoading, onUpdateStatus, isUpdating }) {
  if (isLoading) {
    return (
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
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không có đơn hàng
          </h3>
          <p className="text-gray-500">
            Chưa có đơn hàng nào trong danh mục này
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Thông tin khách hàng:</p>
                    <p className="text-sm">{order.customerName}</p>
                    <p className="text-sm text-gray-500">{order.customerPhone}</p>
                    <p className="text-sm text-gray-500">{order.customerAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Thông tin đơn hàng:</p>
                    <p className="text-sm">Tổng tiền: <span className="font-bold text-primary">{Number(order.total).toLocaleString('vi-VN')}đ</span></p>
                    <p className="text-sm">Thanh toán: {order.paymentMethod === 'cod' ? 'COD' : 'Chuyển khoản'}</p>
                    <p className="text-sm">Số món: {order.items?.length || 0}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex space-x-2">
                    {order.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => onUpdateStatus(order.id, 'processing')}
                        disabled={isUpdating}
                      >
                        Xác nhận xử lý
                      </Button>
                    )}
                    {order.status === 'processing' && (
                      <Button
                        size="sm"
                        onClick={() => onUpdateStatus(order.id, 'shipping')}
                        disabled={isUpdating}
                      >
                        Bắt đầu giao hàng
                      </Button>
                    )}
                    {order.status === 'shipping' && (
                      <Button
                        size="sm"
                        onClick={() => onUpdateStatus(order.id, 'delivered')}
                        disabled={isUpdating}
                      >
                        Đã giao thành công
                      </Button>
                    )}
                    {(order.status === 'pending' || order.status === 'processing') && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onUpdateStatus(order.id, 'cancelled')}
                        disabled={isUpdating}
                      >
                        Hủy đơn
                      </Button>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Chi tiết
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
