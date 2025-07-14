import { useState } from "react";
import { useAuth } from "@/lib/auth.tsx";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import Dashboard from "@/components/admin/dashboard";
import ProductManagement from "@/components/admin/product-management";
import OrderManagement from "@/components/admin/order-management";
import UserManagement from "@/components/admin/user-management";
import ReviewManagement from "@/components/admin/review-management";
import BannerManagement from "@/components/admin/banner-management";
import Statistics from "@/components/admin/statistics";
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Star, 
  Image,
  TrendingUp
} from "lucide-react";

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (!isAuthenticated || user?.role !== 'admin') {
    setLocation('/auth');
    return null;
  }

  const navItems = [
    { id: "dashboard", label: "Tổng quan", icon: BarChart3 },
    { id: "products", label: "Quản lý món ăn", icon: Package },
    { id: "orders", label: "Đơn hàng", icon: ShoppingCart },
    { id: "users", label: "Người dùng", icon: Users },
    { id: "reviews", label: "Đánh giá", icon: Star },
    { id: "banners", label: "Banner", icon: Image },
    { id: "statistics", label: "Thống kê", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Quản trị viên</h2>
            <p className="text-sm text-gray-600">Na Food Admin</p>
          </div>
          
          <nav className="mt-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center w-full px-6 py-3 text-left transition-colors ${
                    activeTab === item.id
                      ? "text-primary bg-orange-50 border-r-2 border-primary"
                      : "text-gray-600 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="dashboard">
                <Dashboard />
              </TabsContent>
              
              <TabsContent value="products">
                <ProductManagement />
              </TabsContent>
              
              <TabsContent value="orders">
                <OrderManagement />
              </TabsContent>
              
              <TabsContent value="users">
                <UserManagement />
              </TabsContent>
              
              <TabsContent value="reviews">
                <ReviewManagement />
              </TabsContent>
              
              <TabsContent value="banners">
                <BannerManagement />
              </TabsContent>
              
              <TabsContent value="statistics">
                <Statistics />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
