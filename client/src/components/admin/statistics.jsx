import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Download,
  Filter
} from "lucide-react";

export default function Statistics() {
  const [timeRange, setTimeRange] = useState("30days");
  const [chartType, setChartType] = useState("revenue");

  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/statistics/detailed", timeRange],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/statistics/detailed?range=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.json();
    },
  });

  const exportReport = () => {
    // Mock export functionality
    const csvContent = [
      ["Ngày", "Doanh thu", "Đơn hàng", "Khách hàng mới"],
      ...mockChartData.map(item => [
        item.date,
        item.revenue,
        item.orders,
        item.customers
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `statistics_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mock data for demonstration
  const mockStats = {
    totalRevenue: 15750000,
    totalOrders: 342,
    totalCustomers: 128,
    totalProducts: 45,
    revenueGrowth: 12.5,
    orderGrowth: 8.3,
    customerGrowth: 15.2,
    productGrowth: 2.1,
    topProducts: [
      { name: "Phở Bò Tái", revenue: 2500000, orders: 85 },
      { name: "Bún Bò Huế", revenue: 2100000, orders: 72 },
      { name: "Cơm Tấm Sườn", revenue: 1800000, orders: 68 },
      { name: "Bánh Mì Thịt", revenue: 1200000, orders: 95 },
      { name: "Chè Ba Màu", revenue: 800000, orders: 52 }
    ],
    recentActivity: [
      { type: "order", message: "Đơn hàng #342 đã được đặt", time: "2 phút trước" },
      { type: "customer", message: "Khách hàng mới đăng ký", time: "5 phút trước" },
      { type: "product", message: "Sản phẩm 'Phở Gà' được cập nhật", time: "10 phút trước" },
      { type: "order", message: "Đơn hàng #341 đã được giao", time: "15 phút trước" }
    ]
  };

  const mockChartData = [
    { date: "01/01", revenue: 450000, orders: 12, customers: 3 },
    { date: "02/01", revenue: 520000, orders: 15, customers: 5 },
    { date: "03/01", revenue: 380000, orders: 10, customers: 2 },
    { date: "04/01", revenue: 680000, orders: 18, customers: 7 },
    { date: "05/01", revenue: 750000, orders: 22, customers: 8 },
    { date: "06/01", revenue: 620000, orders: 16, customers: 4 },
    { date: "07/01", revenue: 890000, orders: 25, customers: 12 }
  ];

  const currentStats = stats || mockStats;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Thống kê chi tiết</h2>
          <p className="text-muted-foreground">
            Phân tích dữ liệu kinh doanh chi tiết
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 ngày qua</SelectItem>
              <SelectItem value="30days">30 ngày qua</SelectItem>
              <SelectItem value="90days">3 tháng qua</SelectItem>
              <SelectItem value="1year">1 năm qua</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentStats.totalRevenue?.toLocaleString('vi-VN')}đ
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {currentStats.revenueGrowth >= 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
              )}
              <span className={currentStats.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}>
                {Math.abs(currentStats.revenueGrowth)}%
              </span>
              <span className="ml-1">so với kỳ trước</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.totalOrders}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              <span className="text-green-600">{currentStats.orderGrowth}%</span>
              <span className="ml-1">so với kỳ trước</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.totalCustomers}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              <span className="text-green-600">{currentStats.customerGrowth}%</span>
              <span className="ml-1">so với kỳ trước</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sản phẩm</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.totalProducts}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              <span className="text-green-600">{currentStats.productGrowth}%</span>
              <span className="ml-1">so với kỳ trước</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Chart */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Biểu đồ thống kê</CardTitle>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Doanh thu</SelectItem>
                  <SelectItem value="orders">Đơn hàng</SelectItem>
                  <SelectItem value="customers">Khách hàng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Biểu đồ {chartType === 'revenue' ? 'doanh thu' : chartType === 'orders' ? 'đơn hàng' : 'khách hàng'}</p>
                <p className="text-sm text-gray-400 mt-2">
                  Dữ liệu cho {timeRange === '7days' ? '7 ngày' : timeRange === '30days' ? '30 ngày' : timeRange === '90days' ? '3 tháng' : '1 năm'} qua
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm bán chạy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentStats.topProducts?.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.orders} đơn hàng</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      {product.revenue.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentStats.recentActivity?.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'order' ? 'bg-blue-500' :
                  activity.type === 'customer' ? 'bg-green-500' :
                  activity.type === 'product' ? 'bg-purple-500' : 'bg-gray-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hiệu suất bán hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Tỷ lệ chuyển đổi</span>
                <span className="font-medium">3.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Giá trị đơn hàng TB</span>
                <span className="font-medium">460,000đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Khách hàng quay lại</span>
                <span className="font-medium">68%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Thời gian phản hồi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Xử lý đơn hàng</span>
                <span className="font-medium">12 phút</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Giao hàng TB</span>
                <span className="font-medium">45 phút</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Phản hồi khách hàng</span>
                <span className="font-medium">5 phút</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Đánh giá chất lượng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Điểm đánh giá TB</span>
                <span className="font-medium">4.6/5.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Tỷ lệ hài lòng</span>
                <span className="font-medium">92%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Khiếu nại</span>
                <span className="font-medium">2.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
