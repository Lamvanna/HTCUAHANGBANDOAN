import { useAuth } from "@/lib/auth.tsx";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import OrderProcessing from "@/components/staff/order-processing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export default function Staff() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAuthenticated || (user?.role !== 'staff' && user?.role !== 'admin')) {
    setLocation('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển nhân viên</h1>
          <p className="text-gray-600 mt-2">Quản lý đơn hàng và xử lý giao hàng</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Quản lý đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrderProcessing />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
