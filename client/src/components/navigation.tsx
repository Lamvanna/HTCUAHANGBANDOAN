import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth.tsx";
import { useCart } from "@/lib/cart.tsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Search, ShoppingCart, User, LogOut, Settings, Package } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <span className="text-2xl font-poppins font-bold text-primary cursor-pointer">
                Na Food
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/">
              <span className={`font-medium transition-colors cursor-pointer ${
                location === "/" ? "text-primary" : "text-gray-500 hover:text-primary"
              }`}>
                Trang chủ
              </span>
            </Link>
            <Link href="/#menu">
              <span className="text-gray-500 hover:text-primary transition-colors font-medium cursor-pointer">
                Thực đơn
              </span>
            </Link>
            {isAuthenticated && (
              <Link href="/orders">
                <span className={`font-medium transition-colors cursor-pointer ${
                  location === "/orders" ? "text-primary" : "text-gray-500 hover:text-primary"
                }`}>
                  Đơn hàng
                </span>
              </Link>
            )}
            <Link href="/#about">
              <span className="text-gray-500 hover:text-primary transition-colors font-medium cursor-pointer">
                Về chúng tôi
              </span>
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Input
                type="text"
                placeholder="Tìm món ăn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </form>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => {
                const event = new CustomEvent('open-cart');
                window.dispatchEvent(event);
              }}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-primary text-white min-w-[20px] h-5 text-xs flex items-center justify-center">
                  {itemCount}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span className="hidden md:block">{user?.fullName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/orders">
                      <Package className="h-4 w-4 mr-2" />
                      Đơn hàng của tôi
                    </Link>
                  </DropdownMenuItem>
                  {(user?.role === 'admin' || user?.role === 'staff') && (
                    <DropdownMenuItem asChild>
                      <Link href={user.role === 'admin' ? "/admin" : "/staff"}>
                        <Settings className="h-4 w-4 mr-2" />
                        {user.role === 'admin' ? 'Quản trị' : 'Nhân viên'}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button variant="ghost">
                  <User className="h-5 w-5 mr-2" />
                  Đăng nhập
                </Button>
              </Link>
            )}

            {/* Admin/Staff Badge */}
            {user?.role && user.role !== 'user' && (
              <Badge variant="secondary" className="bg-primary text-white">
                {user.role === 'admin' ? 'Admin' : 'Staff'}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
