import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth.jsx";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import Dashboard from "@/components/admin/dashboard";
import ProductManagement from "@/components/admin/product-management";
import UserManagement from "@/components/admin/user-management";
import OrderManagement from "@/components/admin/order-management";
import BannerManagement from "@/components/admin/banner-management";
import ReviewManagement from "@/components/admin/ReviewManagement";
import Statistics from "@/components/admin/statistics";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Star,
  Image,
  BarChart3
} from "lucide-react";

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      setLocation('/');
    }
  }, [isAuthenticated, user, setLocation]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="admin-layout bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />

      <div className="flex h-screen">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white shadow-xl border-r border-gray-200 admin-sidebar">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <Logo size="lg" showText={false} />
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-lobster" style={{fontFamily: 'Lobster, cursive'}}>Na Food</h2>
                <p className="text-sm text-gray-500">Admin Panel</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 admin-nav-button ripple ${
                  activeTab === "dashboard"
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <LayoutDashboard className={`h-5 w-5 ${activeTab === "dashboard" ? "icon-pulse" : ""}`} />
                <span className="font-medium">Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab("products")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 admin-nav-button ripple ${
                  activeTab === "products"
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Package className={`h-5 w-5 ${activeTab === "products" ? "icon-pulse" : ""}`} />
                <span className="font-medium">Sản phẩm</span>
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 admin-nav-button ripple ${
                  activeTab === "orders"
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <ShoppingCart className={`h-5 w-5 ${activeTab === "orders" ? "icon-pulse" : ""}`} />
                <span className="font-medium">Đơn hàng</span>
              </button>

              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 admin-nav-button ripple ${
                  activeTab === "users"
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Users className={`h-5 w-5 ${activeTab === "users" ? "icon-pulse" : ""}`} />
                <span className="font-medium">Người dùng</span>
              </button>

              <button
                onClick={() => setActiveTab("reviews")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 admin-nav-button ripple ${
                  activeTab === "reviews"
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Star className={`h-5 w-5 ${activeTab === "reviews" ? "icon-pulse" : ""}`} />
                <span className="font-medium">Đánh giá</span>
              </button>

              <button
                onClick={() => setActiveTab("banners")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 admin-nav-button ripple ${
                  activeTab === "banners"
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Image className={`h-5 w-5 ${activeTab === "banners" ? "icon-pulse" : ""}`} />
                <span className="font-medium">Banner</span>
              </button>

              <button
                onClick={() => setActiveTab("statistics")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 admin-nav-button ripple ${
                  activeTab === "statistics"
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <BarChart3 className={`h-5 w-5 ${activeTab === "statistics" ? "icon-pulse" : ""}`} />
                <span className="font-medium">Thống kê</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 admin-main-content">
          <div className="admin-page-container">


          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 ml-4">
            {/* Hidden TabsList for functionality */}
            <TabsList className="hidden"></TabsList>

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
