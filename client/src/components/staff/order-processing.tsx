import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Order } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Search, 
  Clock, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle,
  Eye,
  Phone,
  MapPin,
  Calendar,
  RefreshCw
} from "lucide-react";

export default function OrderProcessing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading, refetch } = useQuery<Order[]>({
    queryKey: ["/api/orders", statusFilter, searchQuery],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/orders?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.json();
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const token = localStorage.getItem('authToken');
      const response = await apiRequest('PUT', `/api/orders/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Cập nhật đơn hàng thành công!" });
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      setSelectedOrder(null);
    },
    onError: (error: any) => {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    }
  });

  const handleStatusChange = (orderId: number, newStatus: string) => {
    updateOrderMutation.mutate({ id: orderId, data: { status: newStatus } });
  };

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

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: Clock,
      processing: Package,
      shipping: Truck,
      delivered: CheckCircle,
      cancelled: XCircle,
    };
    const Icon = icons[status as keyof typeof icons] || Clock;
    return <Icon className="h-4 w-4" />;
  };

  const getNextStatus = (currentStatus: string) => {
    const statusFlow = {
      pending: 'processing',
      processing: 'shipping',
      shipping: 'delivered',
    };
    return statusFlow[currentStatus as keyof typeof statusFlow];
  };

  const getNextStatusText = (currentStatus: string) => {
    const nextStatus = getNextStatus(currentStatus);
    const statusText = {
      processing: 'Bắt đầu xử lý',
      shipping: 'Bắt đầu giao hàng',
      delivered: 'Xác nhận đã giao',
    };
    return statusText[nextStatus as keyof typeof statusText];
  };

  const statusOptions = [
    { value: '', label: 'Tất cả đơn hàng' },
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'shipping', label: 'Đang giao' },
    { value: 'delivered', label: 'Đã giao' },
    { value: 'cancelled', label: 'Đã hủy' },
  ];

  const getPaymentMethodText = (method: string) => {
    const methods = {
      cod: 'COD',
      bank_transfer: 'Chuyển khoản',
      e_wallet: 'Ví điện tử',
    };
    return methods[method as keyof typeof methods] || method;
  };

  const priorityOrders = orders.filter(order => order.status === 'pending').length;
  const processingOrders = orders.filter(order => order.status === 'processing').length;
  const shippingOrders = orders.filter(order => order.status === 'shipping').length;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cần xử lý</p>
                <p className="text-2xl font-bold text-yellow-600">{priorityOrders}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đang xử lý</p>
                <p className="text-2xl font-bold text-blue-600">{processingOrders}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đang giao</p>
                <p className="text-2xl font-bold text-orange-600">{shippingOrders}</p>
              </div>
              <Truck className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetch()}
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Làm mới
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Thông tin khách hàng</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Tên:</span> {selectedOrder.customerName}</p>
                    <p className="flex items-center">
                      <Phone className="h-3 w-3 mr-2" />
                      <a href={`tel:${selectedOrder.customerPhone}`} className="text-primary hover:underline">
                        {selectedOrder.customerPhone}
                      </a>
                    </p>
                    <p className="flex items-start">
                      <MapPin className="h-3 w-3 mr-2 mt-0.5" />
                      {selectedOrder.customerAddress}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Thông tin đơn hàng</h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center">
                      <Calendar className="h-3 w-3 mr-2" />
                      {new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p>
                      <span className="font-medium">Trạng thái hiện tại:</span>{' '}
                      <Badge className={getStatusColor(selectedOrder.status)}>
                        {getStatusText(selectedOrder.status)}
                      </Badge>
                    </p>
                    <p>
                      <span className="font-medium">Thanh toán:</span>{' '}
                      {getPaymentMethodText(selectedOrder.paymentMethod)}
                    </p>
                    <p>
                      <span className="font-medium">Tổng tiền:</span>{' '}
                      <span className="text-lg font-bold text-primary">
                        {Number(selectedOrder.total).toLocaleString('vi-VN')}₫
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Món ăn đã đặt</h4>
                <div className="space-y-2">
                  {Array.isArray(selectedOrder.items) ? selectedOrder.items.map((item: any, index: number) => (
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

              {selectedOrder.notes && (
                <div>
                  <h4 className="font-semibold mb-2">Ghi chú đặc biệt</h4>
                  <p className="text-sm text-gray-600 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                  <>
                    {getNextStatus(selectedOrder.status) && (
                      <Button
                        onClick={() => handleStatusChange(selectedOrder.id, getNextStatus(selectedOrder.status))}
                        className="bg-primary hover:bg-orange-600"
                        disabled={updateOrderMutation.isPending}
                      >
                        {getNextStatusText(selectedOrder.status)}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')}
                      className="text-red-600 hover:text-red-700"
                      disabled={updateOrderMutation.isPending}
                    >
                      Hủy đơn hàng
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => { 
                setSearchQuery(''); 
                setStatusFilter('pending'); 
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-500">Đang tải...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Không có đơn hàng nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="font-medium">Đơn hàng #{order.id}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString('vi-VN')} • {order.customerName}
                          </p>
                        </div>
                      </div>
                      <div className="hidden md:block">
                        <p className="font-medium">{Number(order.total).toLocaleString('vi-VN')}₫</p>
                        <p className="text-sm text-gray-600">{getPaymentMethodText(order.paymentMethod)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {order.status !== 'delivered' && order.status !== 'cancelled' && getNextStatus(order.status) && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(order.id, getNextStatus(order.status))}
                          disabled={updateOrderMutation.isPending}
                          className="bg-primary hover:bg-orange-600"
                        >
                          {getNextStatusText(order.status)}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
