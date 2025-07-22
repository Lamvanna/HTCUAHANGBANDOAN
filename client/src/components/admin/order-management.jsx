import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  Calendar,
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck
} from "lucide-react";

const statusConfig = {
  pending: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  processing: { label: "Đang xử lý", color: "bg-blue-100 text-blue-800", icon: Package },
  shipping: { label: "Đang giao", color: "bg-purple-100 text-purple-800", icon: Truck },
  delivered: { label: "Đã giao", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800", icon: XCircle },
};

const paymentMethods = {
  cod: "Thanh toán khi nhận hàng",
  bank_transfer: "Chuyển khoản ngân hàng",
  wallet: "Ví điện tử"
};

export default function OrderManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["/api/orders", "admin"],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/orders?admin=true', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.json();
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, ...orderData }) => apiRequest("PUT", `/api/orders/${id}`, orderData),
    onSuccess: () => {
      queryClient.invalidateQueries(["/api/orders"]);
      toast({
        title: "Thành công",
        description: "Đơn hàng đã được cập nhật",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật đơn hàng",
        variant: "destructive",
      });
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (id) => apiRequest("DELETE", `/api/orders/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["/api/orders"]);
      toast({
        title: "Thành công",
        description: "Đơn hàng đã được xóa",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa đơn hàng",
        variant: "destructive",
      });
    },
  });

  const handleUpdateStatus = (orderId, newStatus) => {
    updateOrderMutation.mutate({ id: orderId, status: newStatus });
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      deleteOrderMutation.mutate(orderId);
    }
  };

  const exportOrders = () => {
    const csvContent = [
      ["ID", "Khách hàng", "Điện thoại", "Tổng tiền", "Trạng thái", "Ngày tạo"],
      ...filteredOrders.map(order => [
        order.id,
        order.customerName,
        order.customerPhone,
        order.total,
        statusConfig[order.status]?.label || order.status,
        new Date(order.createdAt).toLocaleDateString('vi-VN')
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerPhone.includes(searchTerm) ||
                         order.id.toString().includes(searchTerm);
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    const matchesPayment = selectedPayment === "all" || order.paymentMethod === selectedPayment;
    
    let matchesDate = true;
    if (dateRange !== "all") {
      const orderDate = new Date(order.createdAt);
      const today = new Date();
      const daysDiff = Math.floor((today - orderDate) / (1000 * 60 * 60 * 24));
      
      switch (dateRange) {
        case "today":
          matchesDate = daysDiff === 0;
          break;
        case "week":
          matchesDate = daysDiff <= 7;
          break;
        case "month":
          matchesDate = daysDiff <= 30;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesPayment && matchesDate;
  });

  // Calculate statistics
  const stats = {
    total: filteredOrders.length,
    pending: filteredOrders.filter(o => o.status === 'pending').length,
    processing: filteredOrders.filter(o => o.status === 'processing').length,
    delivered: filteredOrders.filter(o => o.status === 'delivered').length,
    cancelled: filteredOrders.filter(o => o.status === 'cancelled').length,
    totalRevenue: filteredOrders.reduce((sum, o) => sum + Number(o.total), 0)
  };

  return (
    <div className="space-y-4 admin-form-container">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Quản lý đơn hàng</h2>
          <p className="text-sm text-muted-foreground">
            Quản lý tất cả đơn hàng trong hệ thống
          </p>
        </div>
        <Button onClick={exportOrders} variant="outline" size="sm">
          <Download className="mr-2 h-3 w-3" />
          Xuất CSV
        </Button>
      </div>

      {/* Statistics Cards - Compact */}
      <div className="grid gap-3 md:grid-cols-6">
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Tổng đơn</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
            <Package className="h-4 w-4 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Chờ xử lý</p>
              <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="h-4 w-4 text-yellow-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Đang xử lý</p>
              <p className="text-xl font-bold text-blue-600">{stats.processing}</p>
            </div>
            <Package className="h-4 w-4 text-blue-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Đã giao</p>
              <p className="text-xl font-bold text-green-600">{stats.delivered}</p>
            </div>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Đã hủy</p>
              <p className="text-xl font-bold text-red-600">{stats.cancelled}</p>
            </div>
            <XCircle className="h-4 w-4 text-red-600" />
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Doanh thu</p>
              <p className="text-lg font-bold text-green-600">
                {stats.totalRevenue.toLocaleString('vi-VN')}đ
              </p>
            </div>
            <DollarSign className="h-4 w-4 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Filter className="h-3 w-3" />
            <span>Bộ lọc</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
              <Input
                placeholder="Tìm theo tên, SĐT, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 h-7 text-xs border-gray-300"
              />
            </div>
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="h-7 w-28 text-xs border-gray-300">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {Object.entries(statusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedPayment} onValueChange={setSelectedPayment}>
            <SelectTrigger className="h-7 w-28 text-xs border-gray-300">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {Object.entries(paymentMethods).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="h-7 w-28 text-xs border-gray-300">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="today">Hôm nay</SelectItem>
              <SelectItem value="week">7 ngày qua</SelectItem>
              <SelectItem value="month">30 ngày qua</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-muted-foreground">Không tìm thấy đơn hàng nào</p>
            </div>
          ) : (
            <div className="admin-table-container">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Thanh toán</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const status = statusConfig[order.status] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {order.items?.length || 0} món
                          {order.items?.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="text-xs text-muted-foreground">
                              {item.name} x{item.quantity}
                            </div>
                          ))}
                          {order.items?.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{order.items.length - 2} món khác
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-green-600">
                          {Number(order.total).toLocaleString('vi-VN')}đ
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {paymentMethods[order.paymentMethod] || order.paymentMethod}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={status.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <div className="dialog-scrollable">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl admin-modal-content">
                                <DialogHeader>
                                  <DialogTitle>Chi tiết đơn hàng #{order.id}</DialogTitle>
                                </DialogHeader>
                                <OrderDetails
                                  order={selectedOrder}
                                  onUpdateStatus={handleUpdateStatus}
                                  isUpdating={updateOrderMutation.isLoading}
                                />
                              </DialogContent>
                            </Dialog>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteOrder(order.id)}
                            disabled={deleteOrderMutation.isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function OrderDetails({ order, onUpdateStatus, isUpdating }) {
  if (!order) return null;

  const status = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Order Status */}
      <div className="flex items-center justify-between">
        <Badge className={status.color}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {status.label}
        </Badge>
        <div className="flex space-x-2">
          {order.status === 'pending' && (
            <Button size="sm" onClick={() => onUpdateStatus(order.id, 'processing')} disabled={isUpdating}>
              Xác nhận
            </Button>
          )}
          {order.status === 'processing' && (
            <Button size="sm" onClick={() => onUpdateStatus(order.id, 'shipping')} disabled={isUpdating}>
              Giao hàng
            </Button>
          )}
          {order.status === 'shipping' && (
            <Button size="sm" onClick={() => onUpdateStatus(order.id, 'delivered')} disabled={isUpdating}>
              Hoàn thành
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
      </div>

      {/* Customer Info */}
      <div>
        <h4 className="font-medium mb-2">Thông tin khách hàng</h4>
        <div className="bg-gray-50 p-4 rounded-lg space-y-1">
          <p><strong>Tên:</strong> {order.customerName}</p>
          <p><strong>Điện thoại:</strong> {order.customerPhone}</p>
          <p><strong>Địa chỉ:</strong> {order.customerAddress}</p>
          <p><strong>Thanh toán:</strong> {paymentMethods[order.paymentMethod] || order.paymentMethod}</p>
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h4 className="font-medium mb-2">Sản phẩm đã đặt</h4>
        <div className="space-y-3">
          {order.items?.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
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

      {/* Total */}
      <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
        <span>Tổng cộng:</span>
        <span className="text-green-600">{Number(order.total).toLocaleString('vi-VN')}đ</span>
      </div>

      {/* Notes */}
      {order.notes && (
        <div>
          <h4 className="font-medium mb-2">Ghi chú</h4>
          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{order.notes}</p>
        </div>
      )}

      {/* Order Timeline */}
      <div>
        <h4 className="font-medium mb-2">Thời gian</h4>
        <div className="text-sm text-gray-500">
          <p>Đặt hàng: {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
          {order.updatedAt && order.updatedAt !== order.createdAt && (
            <p>Cập nhật: {new Date(order.updatedAt).toLocaleString('vi-VN')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
