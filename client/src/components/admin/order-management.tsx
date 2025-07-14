import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Order } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Search, FileText, Download, Eye, Edit, Trash2, Calendar, Phone, MapPin } from "lucide-react";

export default function OrderManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders", statusFilter, searchQuery],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/orders?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.json();
    },
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
    },
    onError: (error: any) => {
      toast({ title: "Lỗi", description: error.message, variant: "destructive" });
    }
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem('authToken');
      const response = await apiRequest('DELETE', `/api/orders/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Xóa đơn hàng thành công!" });
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
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

  const statusOptions = [
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'shipping', label: 'Đang giao' },
    { value: 'delivered', label: 'Đã giao' },
    { value: 'cancelled', label: 'Đã hủy' },
  ];

  const getPaymentMethodText = (method: string) => {
    const methods = {
      cod: 'Thanh toán khi nhận hàng',
      bank_transfer: 'Chuyển khoản ngân hàng',
      e_wallet: 'Ví điện tử',
    };
    return methods[method as keyof typeof methods] || method;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h2>
          <p className="text-gray-600 mt-1">Xem và quản lý tất cả đơn hàng</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="bg-primary text-white hover:bg-orange-600">
            <FileText className="h-4 w-4 mr-2" />
            Xuất PDF
          </Button>
          <Button variant="outline" className="bg-secondary text-white hover:bg-green-600">
            <Download className="h-4 w-4 mr-2" />
            Xuất CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm đơn hàng..."
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
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder="Từ ngày"
              />
            </div>
            <div>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder="Đến ngày"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => { 
                setSearchQuery(''); 
                setStatusFilter(''); 
                setDateFrom(''); 
                setDateTo(''); 
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

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
                      {selectedOrder.customerPhone}
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
                      {new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                    <p>
                      <span className="font-medium">Trạng thái:</span>{' '}
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
                  <h4 className="font-semibold mb-2">Ghi chú</h4>
                  <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Orders Table */}
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
              <p className="text-gray-500">Không tìm thấy đơn hàng nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Mã đơn</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Khách hàng</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Ngày đặt</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Tổng tiền</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Trạng thái</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="py-3 px-4 font-medium">#{order.id}</td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-sm text-gray-600">{order.customerPhone}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {Number(order.total).toLocaleString('vi-VN')}₫
                      </td>
                      <td className="py-3 px-4">
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteOrderMutation.mutate(order.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
