import { createContext, useContext, useState } from "react";
import { useAuth } from "@/lib/auth.jsx";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const CouponContext = createContext();

export function CouponProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateCoupon = async (couponCode, orderTotal) => {
    if (!couponCode.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mã giảm giá",
        variant: "destructive",
      });
      return null;
    }

    setIsValidating(true);
    try {
      const response = await apiRequest("POST", "/api/coupons/validate", {
        code: couponCode.toUpperCase(),
        orderTotal
      });

      if (response.valid) {
        setAppliedCoupon(response.coupon);
        toast({
          title: "Thành công",
          description: `Áp dụng mã giảm giá "${couponCode}" thành công!`,
        });
        return response.coupon;
      } else {
        toast({
          title: "Mã giảm giá không hợp lệ",
          description: response.message || "Mã giảm giá không tồn tại hoặc đã hết hạn",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể kiểm tra mã giảm giá",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsValidating(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast({
      title: "Đã xóa",
      description: "Đã xóa mã giảm giá",
    });
  };

  const calculateDiscount = (orderTotal, coupon = appliedCoupon) => {
    if (!coupon) return 0;

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (orderTotal * coupon.value) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else if (coupon.type === 'fixed') {
      discount = coupon.value;
    }

    return Math.min(discount, orderTotal);
  };

  const getAvailableCoupons = async () => {
    try {
      const response = await apiRequest("GET", "/api/coupons/available");
      return response.coupons || [];
    } catch (error) {
      console.error('Error fetching available coupons:', error);
      return [];
    }
  };

  // Mock coupons for demonstration
  const mockCoupons = [
    {
      id: 1,
      code: "WELCOME10",
      name: "Chào mừng khách hàng mới",
      description: "Giảm 10% cho đơn hàng đầu tiên",
      type: "percentage",
      value: 10,
      minOrder: 100000,
      maxDiscount: 50000,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      usageLimit: 1,
      usedCount: 0
    },
    {
      id: 2,
      code: "SAVE50K",
      name: "Giảm 50K",
      description: "Giảm 50,000đ cho đơn hàng từ 300,000đ",
      type: "fixed",
      value: 50000,
      minOrder: 300000,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      usageLimit: 100,
      usedCount: 25
    },
    {
      id: 3,
      code: "FREESHIP",
      name: "Miễn phí giao hàng",
      description: "Miễn phí giao hàng cho đơn từ 200,000đ",
      type: "shipping",
      value: 0,
      minOrder: 200000,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      usageLimit: null,
      usedCount: 150
    }
  ];

  const value = {
    appliedCoupon,
    isValidating,
    validateCoupon,
    removeCoupon,
    calculateDiscount,
    getAvailableCoupons,
    mockCoupons,
  };

  return (
    <CouponContext.Provider value={value}>
      {children}
    </CouponContext.Provider>
  );
}

export function useCoupon() {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error("useCoupon must be used within a CouponProvider");
  }
  return context;
}
