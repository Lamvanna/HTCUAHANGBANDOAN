import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Users,
  Package,
  Star,
  Calendar
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface OrderStats {
  todayRevenue: number;
  newOrders: number;
  totalOrders: number;
  deliveredOrders: number;
}

interface TopProduct {
  id: number;
  name: string;
  orderCount: number;
}

export default function Statistics() {
  const { data: stats } = useQuery<OrderStats>({
    queryKey: ["/api/statistics/overview"],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/statistics/overview', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.json();
    },
  });

  const { data: topProducts = [] } = useQuery<TopProduct[]>({
    queryKey: ["/api/statistics/top-products"],
    queryFn: async () => {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/statistics/top-products', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.json();
    },
  });

  // Mock revenue data for chart (in real app this would come from API)
  const revenueData = [
    { name: 'T2', revenue: 2400000 },
    { name: 'T3', revenue: 1398000 },
    { name: 'T4', revenue: 9800000 },
    { name: 'T5', revenue: 3908000 },
    { name: 'T6', revenue: 4800000 },
    { name: 'T7', revenue: 3800000 },
    { name: 'CN', revenue: 4300000 },
  ];

  // Mock order status data for pie chart
  const orderStatusData = [
    { name: 'Đã giao', value: stats?.deliveredOrders || 0, color: '#10B981' },
    { name: 'Đang giao', value: Math.floor((stats?.totalOrders || 0) * 0.3), color: '#F59E0B' },
    { name: 'Đang xử lý', value: Math.floor((stats?.totalOrders || 0) * 0.2), color: '#3B82F6' },
    { name: 'Chờ xử lý', value: stats?.newOrders || 0, color: '#EF4444' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Thống kê & Báo cáo</h2>
        <p className="text-gray-600 mt-1">Tổng quan về hiệu suất kinh doanh và xu hướng</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Doanh thu hôm nay</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.todayRevenue?.toLocaleString('vi-VN') || '0'}₫
                </p>
                <p className="text-sm text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +12% so với hôm qua
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đơn hàng mới</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.newOrders || 0}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +5% so với tuần trước
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng đơn hàng</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalOrders || 0}
                </p>
                <p className="text-sm text-purple-600 mt-1">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  Trong tháng này
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đánh giá trung bình</p>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
                <p className="text-sm text-yellow-600 mt-1">
                  <Star className="h-3 w-3 inline mr-1 fill-current" />
                  Từ 156 đánh giá
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu 7 ngày qua</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis 
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toLocaleString('vi-VN')}₫`, 'Doanh thu']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bổ trạng thái đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {orderStatusData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top sản phẩm bán chạy</CardTitle>
        </CardHeader>
        <CardContent>
          {topProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Chưa có dữ liệu sản phẩm</p>
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="orderCount" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {((stats?.deliveredOrders || 0) / (stats?.totalOrders || 1) * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-gray-600">Tỷ lệ giao hàng thành công</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">
                {(stats?.totalOrders ? (stats.todayRevenue / stats.totalOrders) : 0).toLocaleString('vi-VN')}₫
              </div>
              <p className="text-sm text-gray-600">Giá trị đơn hàng trung bình</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">92%</div>
              <p className="text-sm text-gray-600">Tỷ lệ hài lòng khách hàng</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
